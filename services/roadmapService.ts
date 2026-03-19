'use server'

import { createClient } from '@/lib/supabase-server'
import { assertAuthenticated, handleServiceError } from '@/lib/service-helper'
import { RoadmapActivity, UserRoadmapProgress } from '@/types/roadmap'

export async function getRoadmapActivities(): Promise<RoadmapActivity[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('roadmap_activities')
    .select('*')
    .order('difficulty_level', { ascending: true })
  
  if (error) handleServiceError(error, 'Gagal mengambil daftar aktivitas roadmap')
  return (data || []) as RoadmapActivity[]
}

export async function getUserRoadmapProgress(userId: string): Promise<UserRoadmapProgress[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_roadmap_progress')
    .select('*')
    .eq('user_id', userId)
  
  if (error) handleServiceError(error, 'Gagal mengambil progres roadmap user')
  return (data || []) as UserRoadmapProgress[]
}

export async function upsertRoadmapProgress(payload: {
  user_id: string
  activity_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  completion_date?: string | null
  streak_count: number
  last_completed_date: string
}): Promise<UserRoadmapProgress> {
  const user = await assertAuthenticated()
  if (user.id !== payload.user_id) {
    throw new Error('Akses ditolak: Anda hanya dapat memperbarui progres Anda sendiri')
  }

  const supabase = await createClient()
  
  // Try to find existing record first to avoid Postgres ON CONFLICT mismatch
  const { data: existing } = await supabase
    .from('user_roadmap_progress')
    .select('id')
    .eq('user_id', payload.user_id)
    .eq('activity_id', payload.activity_id)
    .maybeSingle()

  const dataToSave = {
    user_id: payload.user_id,
    activity_id: payload.activity_id,
    status: payload.status,
    completion_date: payload.completion_date || null,
    streak_count: payload.streak_count,
    last_completed_date: payload.last_completed_date,
    updated_at: new Date().toISOString()
  }

  let result;
  if (existing?.id) {
    result = await supabase
      .from('user_roadmap_progress')
      .update(dataToSave)
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    result = await supabase
      .from('user_roadmap_progress')
      .insert(dataToSave)
      .select()
      .single()
  }

  if (result.error) handleServiceError(result.error, 'Gagal memperbarui progres roadmap')
  return result.data as UserRoadmapProgress
}

export async function saveDailyJournal(payload: {
  user_id: string
  content: string
  date: string
}) {
  const user = await assertAuthenticated()
  if (user.id !== payload.user_id) {
    throw new Error('Akses ditolak: Anda hanya dapat menyimpan jurnal Anda sendiri')
  }

  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_journals')
    .upsert({
      user_id: payload.user_id,
      content: payload.content,
      journal_date: payload.date,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,journal_date'
    })
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal menyimpan jurnal harian')
  return data
}

export async function getDailyJournal(userId: string, date: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_journals')
    .select('*')
    .eq('user_id', userId)
    .eq('journal_date', date)
    .maybeSingle()

  if (error) handleServiceError(error, 'Gagal mengambil jurnal harian')
  return data
}
