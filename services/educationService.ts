'use server'

import { createClient } from '@/lib/supabase-server'
import { assertAuthenticated, handleServiceError } from '@/lib/service-helper'
import type { EducationContent, UserProgress } from '@/types/education'

export async function getAllEducationContent() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education_contents')
    .select('*')
    .order('day', { ascending: true })
  
  if (error) handleServiceError(error, 'Gagal mengambil konten edukasi')
  return (data || []) as EducationContent[]
}

export async function getContentByDay(day: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education_contents')
    .select('*')
    .eq('day', day)
    .maybeSingle()
  
  if (error) handleServiceError(error, 'Gagal mengambil detail edukasi hari ini')
  return data as EducationContent | null
}

export async function getUserProgress(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
  
  if (error) handleServiceError(error, 'Gagal mengambil data progress user')
  return (data || []) as UserProgress[]
}

export async function toggleReadStatus(userId: string, day: number, isRead: boolean): Promise<UserProgress> {
  const user = await assertAuthenticated()
  if (user.id !== userId) throw new Error('Akses ditolak: ID User tidak cocok')
  
  const supabase = await createClient()
  const readAt = isRead ? new Date().toISOString() : null
  
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({ 
      user_id: userId, 
      day, 
      is_read: isRead, 
      read_at: readAt 
    }, { 
      onConflict: 'user_id,day' 
    })
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal memperbarui status baca')
  return data as UserProgress
}

export async function toggleFavoriteStatus(userId: string, day: number, isFavorite: boolean): Promise<UserProgress> {
  const user = await assertAuthenticated()
  if (user.id !== userId) throw new Error('Akses ditolak: ID User tidak cocok')
  
  const supabase = await createClient()
  const favoritedAt = isFavorite ? new Date().toISOString() : null
  
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({ 
      user_id: userId, 
      day, 
      is_favorite: isFavorite, 
      favorited_at: favoritedAt 
    }, { 
      onConflict: 'user_id,day' 
    })
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal memperbarui status favorit')
  return data as UserProgress
}

export async function getProgressStats(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc('get_user_progress_stats', { p_user_id: userId })
  
  if (error) handleServiceError(error, 'Gagal mengambil statistik progress')
  return data && Array.isArray(data) ? data[0] : data
}
