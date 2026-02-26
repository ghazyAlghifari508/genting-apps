'use server'

import { createClient } from '@/lib/supabase-server'
import { assertAuthenticated, handleServiceError } from '@/lib/service-helper'
import type { UserProfile } from '@/types/education'

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
    if (error.code === 'PGRST116') return null
    handleServiceError(error, 'Gagal mengambil data profil user')
  }
  return data as UserProfile
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }) {
  const user = await assertAuthenticated()
  if (user.id !== profile.id) {
    throw new Error('Akses ditolak: Anda hanya dapat memperbarui profil Anda sendiri')
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()

  if (error) handleServiceError(error, 'Gagal memperbarui profil user')
  return data as UserProfile
}

export async function deleteUserProfile(userId: string) {
  await assertAuthenticated()

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) handleServiceError(error, 'Gagal menghapus profil user')
  return true
}
