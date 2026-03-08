'use server'

import { createClient } from '@/lib/supabase-server'
import { assertAuthenticated, handleServiceError } from '@/lib/service-helper'
import { Consultation, ConsultationConversation, ConsultationMessage, DoctorEarningRecord } from '@/types/consultation'

export async function getUpcomingConsultations(doctorId: string, limit: number = 5): Promise<Consultation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultations')
    .select('id, scheduled_at, user_id, status, title, duration_minutes, hourly_rate')
    .eq('doctor_id', doctorId)
    .in('status', ['scheduled', 'ongoing'])
    .order('scheduled_at', { ascending: true })
    .limit(limit)

  if (error) handleServiceError(error, 'Gagal mengambil jadwal konsultasi mendatang')
  return (data || []) as Consultation[]
}

export async function getRecentConsultations(doctorId: string, limit: number = 5): Promise<Consultation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultations')
    .select('id, scheduled_at, ended_at, user_id, status, duration_minutes, total_cost, rating, review, created_at')
    .eq('doctor_id', doctorId)
    .in('status', ['completed', 'cancelled'])
    .order('ended_at', { ascending: false })
    .limit(limit)

  if (error) handleServiceError(error, 'Gagal mengambil riwayat konsultasi')
  return (data || []) as Consultation[]
}

export async function getActiveConsultation(doctorId: string): Promise<Consultation | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultations')
    .select('id, scheduled_at, started_at, user_id, status, title, hourly_rate, duration_minutes')
    .eq('doctor_id', doctorId)
    .eq('status', 'ongoing')
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data || null) as Consultation | null
}

export async function getTodayEarnings(doctorId: string) {
  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data, error } = await supabase
    .from('consultations')
    .select('total_cost')
    .eq('doctor_id', doctorId)
    .eq('status', 'completed')
    .gte('ended_at', today.toISOString())

  if (error) handleServiceError(error, 'Gagal mengambil data penghasilan hari ini')
  return data.reduce((acc, curr) => acc + (curr.total_cost || 0), 0)
}

export async function getMonthlyStats(doctorId: string) {
  const supabase = await createClient()
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('consultations')
    .select('status, total_cost, rating')
    .eq('doctor_id', doctorId)
    .gte('created_at', monthStart.toISOString())

  if (error) handleServiceError(error, 'Gagal mengambil statistik bulanan')

  const completed = data.filter(c => c.status === 'completed')
  const totalEarnings = completed.reduce((acc, curr) => acc + (curr.total_cost || 0), 0)
  const ratings = completed.filter(c => c.rating !== null).map(c => c.rating as number)
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : '0.0'

  return {
    totalConsultations: data.length,
    completedConsultations: completed.length,
    totalEarnings,
    avgRating
  }
}

export async function getConsultationById(id: string): Promise<Consultation | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      doctor:doctors(
        *,
        user:profiles(*)
      ),
      user:profiles(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    handleServiceError(error, 'Gagal mengambil data konsultasi')
  }

  return data as Consultation
}

export async function updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation> {
  const user = await assertAuthenticated()
  const supabase = await createClient()
  
  // Security check: only the user or the doctor in the consultation can update it
  const { data: existing, error: fetchError } = await supabase
    .from('consultations')
    .select('user_id, doctor_id')
    .eq('id', id)
    .single()
    
  if (fetchError || !existing) throw new Error('Konsultasi tidak ditemukan')
  
  // Check if user is either the patient or the doctor
  const { data: doctor } = await supabase.from('doctors').select('id').eq('user_id', user.id).maybeSingle()
  const isOwner = existing.user_id === user.id || (doctor && existing.doctor_id === doctor.id)
  
  if (!isOwner && user.role !== 'admin') {
    throw new Error('Akses ditolak: Anda tidak memiliki izin untuk mengubah konsultasi ini')
  }

  const { data, error } = await supabase
    .from('consultations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal memperbarui data konsultasi')
  return data as Consultation
}

export async function getConsultationMessages(consultationId: string): Promise<ConsultationMessage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultation_messages')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as ConsultationMessage[]
}

export async function sendConsultationMessage(
  consultationId: string, 
  senderId: string, 
  message: string,
  senderType: 'user' | 'doctor' = 'user'
): Promise<ConsultationMessage> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultation_messages')
    .insert([{
      consultation_id: consultationId,
      sender_id: senderId,
      sender_type: senderType,
      message
    }])
    .select()
    .single()

  if (error) throw error
  return data as ConsultationMessage
}

export async function markMessagesAsRead(consultationId: string, readerType: 'user' | 'doctor') {
  const supabase = await createClient()
  
  // Mark as read all messages where the SENDER is NOT the current reader
  const { error } = await supabase
    .from('consultation_messages')
    .update({ is_read: true })
    .eq('consultation_id', consultationId)
    .neq('sender_type', readerType)
    .eq('is_read', false)

  if (error) handleServiceError(error, 'Gagal menandai pesan sebagai terbaca')
  return true
}


export async function createConsultation(payload: Partial<Consultation>): Promise<Consultation> {
  await assertAuthenticated()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultations')
    .insert([payload])
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal membuat data konsultasi')
  return data as Consultation
}

export async function getUserConsultations(userId: string): Promise<Consultation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      doctor:doctors(
        *,
        user:profiles(*)
      )
    `)
    .eq('user_id', userId)
    .order('scheduled_at', { ascending: false })

  if (error) handleServiceError(error, 'Gagal mengambil daftar konsultasi user')
  return (data || []) as Consultation[]
}

export async function getDoctorConsultations(doctorId: string, filters?: { status?: string, order?: 'asc' | 'desc' }): Promise<Consultation[]> {
  const supabase = await createClient()
  let query = supabase
    .from('consultations')
    .select(`
      *,
      user:profiles(full_name, avatar_url)
    `)
    .eq('doctor_id', doctorId)

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query.order('scheduled_at', { ascending: filters?.order === 'asc' ? true : false })

  if (error) throw error
  return (data || []) as Consultation[]
}

export async function submitConsultationRating(id: string, rating: number, review?: string): Promise<Consultation> {
  const user = await assertAuthenticated()
  const supabase = await createClient()
  
  // Security check: only the user who booked the consultation can rate it
  const { data: existing, error: fetchError } = await supabase
    .from('consultations')
    .select('user_id')
    .eq('id', id)
    .single()
    
  if (fetchError || !existing) throw new Error('Konsultasi tidak ditemukan')
  if (existing.user_id !== user.id) throw new Error('Akses ditolak: Anda hanya dapat memberi rating pada konsultasi Anda sendiri')

  const { data, error } = await supabase
    .from('consultations')
    .update({ 
      rating, 
      review, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal memberikan rating')
  return data as Consultation
}

/**
 * Fetches the latest message from each conversation for a doctor.
 * Used for the dashboard messages widget.
 * Refactored to avoid N+1 query pattern.
 */
export async function getDoctorConversations(doctorId: string): Promise<ConsultationConversation[]> {
  const supabase = await createClient()
  
  // 1. Get all consultations with their users
  const { data: consultations, error: cError } = await supabase
    .from('consultations')
    .select('id, user_id, user:profiles(full_name, avatar_url)')
    .eq('doctor_id', doctorId)

  if (cError) throw cError
  if (!consultations || consultations.length === 0) return []

  const consultationIds = consultations.map(c => c.id)

  // 2. Fetch all messages for these consultations in one query
  const { data: allMessages, error: mError } = await supabase
    .from('consultation_messages')
    .select('*')
    .in('consultation_id', consultationIds)
    .order('created_at', { ascending: false })

  if (mError) throw mError

  // 3. Map to conversations by picking the latest message for each consultation
  const messageMap = new Map<string, ConsultationMessage>()
  allMessages?.forEach(msg => {
    if (!messageMap.has(msg.consultation_id)) {
      messageMap.set(msg.consultation_id, msg as ConsultationMessage)
    }
  })

  return consultations
    .filter(con => messageMap.has(con.id))
    .map(con => {
      const joinedUser = (Array.isArray(con.user) ? con.user[0] : con.user) as ConsultationConversation['user']
      return {
        consultation_id: con.id,
        user: joinedUser ?? null,
        lastMessage: messageMap.get(con.id)!,
      }
    })
    .sort((a, b) => 
      new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    )
}

/**
 * Fetches transaction history for a doctor.
 */
export async function getDoctorEarnings(doctorId: string): Promise<DoctorEarningRecord[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consultations')
    .select('id, ended_at, total_cost, payment_status, status, user:profiles(full_name)')
    .eq('doctor_id', doctorId)
    .eq('payment_status', 'confirmed')
    .order('ended_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((item) => ({
    ...item,
    user: Array.isArray(item.user) ? item.user[0] ?? null : item.user,
  })) as DoctorEarningRecord[]
}
