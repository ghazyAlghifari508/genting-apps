'use server'

import { createClient } from '@/lib/supabase-server'
import { assertAuthenticated, handleServiceError } from '@/lib/service-helper'
import type { Doctor, DoctorSchedule, DoctorStats } from '@/types/doctor'

export async function getDoctors(filters?: {
  specialization?: string
  search?: string
  availableOnly?: boolean
}) {
  const supabase = await createClient()
  let query = supabase
    .from('doctors')
    .select('*')
    .eq('is_active', true)
    .eq('is_verified', true)

  if (filters?.specialization && filters.specialization !== 'Semua') {
    query = query.eq('specialization', filters.specialization)
  }
  
  if (filters?.search) {
    query = query.ilike('full_name', `%${filters.search}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) handleServiceError(error, 'Gagal mengambil daftar dokter')
  return data as Doctor[]
}

export async function getDoctorById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) handleServiceError(error, 'Gagal mengambil data dokter')
  if (!data) throw new Error('Dokter tidak ditemukan')
  return data as Doctor
}

export async function getDoctorByUserId(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    handleServiceError(error, 'Gagal mengambil data dokter berdasarkan User ID')
  }
  return data as Doctor
}

export async function upsertDoctorProfile(doctor: Partial<Doctor> & { user_id: string }) {
  await assertAuthenticated()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doctors')
    .upsert(doctor, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal memperbarui profil dokter')
  return data as Doctor
}

export async function getDoctorSchedules(doctorId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doctor_schedules')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) handleServiceError(error, 'Gagal mengambil jadwal dokter')
  return data as DoctorSchedule[]
}

export async function upsertSchedule(schedule: Omit<DoctorSchedule, 'id' | 'created_at' | 'updated_at'>) {
  await assertAuthenticated()
    
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doctor_schedules')
    .insert([schedule])
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal menambahkan jadwal')
  return data as DoctorSchedule
}

export async function deleteSchedule(id: string) {
  await assertAuthenticated()
    
  const supabase = await createClient()
  const { error } = await supabase
    .from('doctor_schedules')
    .delete()
    .eq('id', id)

  if (error) handleServiceError(error, 'Gagal menghapus jadwal')
}

export async function getDoctorStats(doctorId: string): Promise<DoctorStats> {
  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [
    { data: allConsultations, error: cError },
  ] = await Promise.all([
    supabase
      .from('consultations')
      .select('user_id, status, scheduled_at, total_cost, payment_status, rating')
      .eq('doctor_id', doctorId)
  ])

  if (cError) handleServiceError(cError, 'Gagal mengambil statistik dokter')

  const consultations = allConsultations || []

  // 1. Total Unique Patients
  const uniquePatients = new Set(consultations.map(c => c.user_id)).size

  // 2. Ongoing/Active Consultations
  const activeConsultations = consultations.filter(c => c.status === 'ongoing').length

  // 3. Today's Appointments
  const todayConsultations = consultations.filter(c => {
    const date = new Date(c.scheduled_at)
    return date >= today && date < tomorrow
  })
  const todayTotal = todayConsultations.length
  const todayCompleted = todayConsultations.filter(c => c.status === 'completed').length

  // 4. Monthly Revenue
  const monthlyConsultations = consultations.filter(c => {
    const date = new Date(c.scheduled_at)
    return date >= monthStart
  })
  const monthlyRevenue = monthlyConsultations.reduce((acc, curr) => 
    curr.payment_status === 'confirmed' ? acc + (curr.total_cost || 0) : acc, 0)
  
  // 5. Patient Growth (New patients this month)
  // This is tricky without knowing previous history perfectly, but let's count patients whose FIRST consultation is this month
  const patientFirstConsultation = new Map<string, Date>()
  consultations.forEach(c => {
    const date = new Date(c.scheduled_at)
    if (!patientFirstConsultation.has(c.user_id) || date < patientFirstConsultation.get(c.user_id)!) {
      patientFirstConsultation.set(c.user_id, date)
    }
  })
  const newPatientsThisMonth = Array.from(patientFirstConsultation.values()).filter(d => d >= monthStart).length

  // 6. Weekly Trend (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  const weeklyTrend = last7Days.map(day => {
    const nextDay = new Date(day)
    nextDay.setDate(nextDay.getDate() + 1)
    
    const count = consultations.filter(c => {
      const date = new Date(c.scheduled_at)
      return date >= day && date < nextDay
    }).length
    
    return {
      name: day.toLocaleDateString('id-ID', { weekday: 'short' }),
      value: count
    }
  })

  // 7. Status Summary
  const statusSummary = {
    completed: consultations.filter(c => c.status === 'completed').length,
    pending: consultations.filter(c => c.status === 'scheduled').length,
    cancelled: consultations.filter(c => c.status === 'cancelled').length
  }

  // 8. Rating
  const ratings = consultations.filter(c => c.rating !== null).map(c => c.rating as number)
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

  return {
    totalPatients: uniquePatients,
    activeConsultations,
    todayAppointments: {
      total: todayTotal,
      completed: todayCompleted,
      upcoming: todayTotal - todayCompleted
    },
    monthlyRevenue,
    newPatientsThisMonth,
    averageRating: Math.round(avgRating * 10) / 10,
    totalConsultations: consultations.length,
    completedConsultations: statusSummary.completed,
    weeklyTrend,
    statusSummary
  }
}

export async function updateScheduleStatus(id: string, isAvailable: boolean) {
  await assertAuthenticated()
    
  const supabase = await createClient()
  const { error } = await supabase
    .from('doctor_schedules')
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) handleServiceError(error, 'Gagal memperbarui status ketersediaan')
}

export async function updateSchedule(id: string, updates: Partial<DoctorSchedule>) {
  await assertAuthenticated()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doctor_schedules')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal memperbarui jadwal')
  return data as DoctorSchedule
}
