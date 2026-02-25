'use server'

import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth-server'

export async function getRoadmapActivities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('roadmap_activities')
    .select('*')
    .order('difficulty_level', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getUserRoadmapProgress(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_roadmap_progress')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

export async function upsertRoadmapProgress(payload: {
  user_id: string
  activity_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  completion_date?: string | null
  streak_count: number
  last_completed_date: string
}) {
  const user = await getCurrentUser()
  if (!user || user.id !== payload.user_id) throw new Error('Unauthorized')

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

  if (result.error) throw result.error
  return result.data
}
