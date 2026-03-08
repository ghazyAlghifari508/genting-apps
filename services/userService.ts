'use server'

import { createClient } from '@/lib/supabase-server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { assertAuthenticated, handleServiceError } from '@/lib/service-helper'
import type { UserProfile } from '@/types/education'

// We need to define UserProfile type if not available or import it.
// Assuming it matches the table structure.

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
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
  return (data || null) as UserProfile | null
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

export async function deleteFullAccount(userId: string) {
  const user = await assertAuthenticated()
  if (user.id !== userId) {
    throw new Error('Akses ditolak: Anda hanya dapat menghapus akun Anda sendiri')
  }

  const adminClient = getSupabaseAdmin()
  
  // 1. Delete profile first (will trigger RLS/cascades if any)
  await deleteUserProfile(userId)

  // 2. Delete from Auth (Admin function)
  const { error: authError } = await adminClient.auth.admin.deleteUser(userId)
  
  if (authError) {
    handleServiceError(authError, 'Gagal menghapus akun autentikasi')
  }

  return true
}
