'use server'

import { getCurrentUser } from '@/lib/auth-server'
import { revalidatePath } from 'next/cache'

/**
 * Clears the show_approval_msg flag after the user has seen the approval page.
 * Called when the user clicks "Pergi ke Dashboard Doctor".
 */
export async function clearApprovalFlag() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')



  // Using admin client to ensure this succeeds regardless of RLS or session quirk
  const { getSupabaseAdmin } = await import('@/lib/supabase')
  const supabaseAdmin = getSupabaseAdmin()

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ show_approval_msg: false })
    .eq('id', user.id)

  if (error) {
    console.error('[clearApprovalFlag] Error:', error.message)
    throw new Error('Failed to clear approval flag')
  }



  revalidatePath('/', 'layout') // Revalidate everything to be safe
  return { success: true }
}
