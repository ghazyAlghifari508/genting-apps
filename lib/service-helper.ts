import { PostgrestError } from '@supabase/supabase-js'
import { getCurrentUser } from './auth-server'

/**
 * Standard error handler for service actions to ensure consistent error messages 
 * and proper logging.
 */
export function handleServiceError(error: PostgrestError | Error | unknown, customMessage?: string): never {
  const message = error instanceof Error ? error.message : (error as PostgrestError).message || 'Terjadi kesalahan sistem'
  console.error(`Service Error: ${customMessage || ''}`, error)
  throw new Error(customMessage ? `${customMessage}: ${message}` : message)
}

/**
 * Asserts that a user is authenticated and returns the user object.
 * Throws an error if the user is not found.
 */
export async function assertAuthenticated() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Sesi berakhir, silakan login kembali')
  return user
}

/**
 * Checks if the current user has the required role.
 */
export async function assertRole(role: 'admin' | 'doctor' | 'user') {
  const user = await assertAuthenticated()
  if (user.role !== role) throw new Error(`Akses ditolak: Memerlukan peran ${role}`)
  return user
}
