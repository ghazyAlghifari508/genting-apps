import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function getUserRole(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    return 'user'
  }

  if (error) throw error
  return data?.role || 'user'
}

export async function createUserRole(userId: string, role: string = 'user') {
  // Synchronize with profiles table
  await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  const { error } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role }, { onConflict: 'user_id' })

  if (error) throw error
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  // First check if role exists, if not create it
  const { data, error } = await supabase.from('user_roles').select('id').eq('user_id', userId).maybeSingle()
  
  if (error) {
    console.error('Error checking user role:', error)
  }

  if (!data) {
    await createUserRole(userId, role)
    return
  }

  // Synchronize with profiles table (used by middleware)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (profileError) {
    console.error('Error updating profile role:', profileError)
    // Non-blocking but we should know
  }

  const { error: updateError } = await supabase
    .from('user_roles')
    .update({
      role,
      registration_status: 'approved',
      approved_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (updateError) throw updateError
}

export async function hasRole(userId: string, role: string): Promise<boolean> {
  const userRole = await getUserRole(userId)
  return userRole === role
}
