'use server'

import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth-server'
import type { UserProfile } from '@/types/education' // UserProfile definition needs check

// We need to define UserProfile type if not available or import it.
// Assuming it matches the table structure.

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching user profile:', error)
    return null
  }
  return data as UserProfile
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }) {
  const user = await getCurrentUser()
  if (!user || user.id !== profile.id) {
    console.error(`[UserService] Unauthorized upsert attempt by ${user?.id} for ${profile.id}`)
    throw new Error('Unauthorized: You can only update your own profile')
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()

  if (error) throw error
  return data as UserProfile
}

export async function deleteUserProfile(userId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) throw error
  return true
}
