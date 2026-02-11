import { createClient } from '@/lib/supabase/client'
import type { Doctor, DoctorSchedule } from '@/types/doctor'

const supabase = createClient()

export async function getDoctors(filters?: {
  specialization?: string
  search?: string
  availableOnly?: boolean
}) {
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
  if (error) throw error
  return data as Doctor[]
}

export async function getDoctorById(id: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Doctor
}

export async function getDoctorByUserId(userId: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as Doctor | null
}

export async function upsertDoctorProfile(doctor: Partial<Doctor> & { user_id: string }) {
  const { data, error } = await supabase
    .from('doctors')
    .upsert(doctor, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) throw error
  return data as Doctor
}

export async function getDoctorSchedules(doctorId: string) {
  const { data, error } = await supabase
    .from('doctor_schedules')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('day_of_week')
    .order('start_time')

  if (error) throw error
  return data as DoctorSchedule[]
}

export async function upsertSchedule(schedule: Omit<DoctorSchedule, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('doctor_schedules')
    .upsert(schedule)
    .select()
    .single()

  if (error) throw error
  return data as DoctorSchedule
}

export async function deleteSchedule(id: string) {
  const { error } = await supabase.from('doctor_schedules').delete().eq('id', id)
  if (error) throw error
}

export async function getDoctorStats(doctorId: string) {
  const { count: totalConsultations } = await supabase
    .from('consultations')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', doctorId)

  const { count: completedCount } = await supabase
    .from('consultations')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', doctorId)
    .eq('status', 'completed')

  const { data: ratingData } = await supabase
    .from('consultations')
    .select('rating')
    .eq('doctor_id', doctorId)
    .not('rating', 'is', null)

  const avgRating = ratingData?.length
    ? ratingData.reduce((sum, c) => sum + (c.rating || 0), 0) / ratingData.length
    : 0

  const { data: earnings } = await supabase
    .from('consultations')
    .select('total_cost')
    .eq('doctor_id', doctorId)
    .eq('payment_status', 'confirmed')

  const totalEarnings = earnings?.reduce((sum, c) => sum + (c.total_cost || 0), 0) || 0

  return {
    totalConsultations: totalConsultations || 0,
    completedConsultations: completedCount || 0,
    averageRating: Math.round(avgRating * 10) / 10,
    totalEarnings,
  }
}
