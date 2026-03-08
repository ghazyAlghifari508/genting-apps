'use server'

import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth-server'
import { EducationContent } from '@/types/education'
import { RoadmapActivity, CreateRoadmapActivityInput, UpdateRoadmapActivityInput } from '@/types/roadmap'
import { DoctorRegistration, Doctor } from '@/types/doctor'

export interface DashboardStats {
  totalUsers: number
  totalDoctors: number
  pendingVerifications: number
  totalEducation: number
  totalRoadmap: number
}

async function checkAdmin() {
  const user = await getCurrentUser()
  
  if (!user) {
    console.warn('[AdminService] checkAdmin: No user found in session')
    throw new Error('Unauthorized: No user session found')
  }

  if (user.role !== 'admin') {
    console.warn(`[AdminService] Unauthorized access attempt by ${user.email} (${user.id}) with role: ${user.role}`)
    throw new Error('Unauthorized: Admin access required')
  }

  return user
}

// ==================== DASHBOARD ====================
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await checkAdmin()
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: doctorCount },
    { count: pendingCount },
    { count: educationCount },
    { count: roadmapCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('doctor_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('education_contents').select('*', { count: 'exact', head: true }),
    supabase.from('roadmap_activities').select('*', { count: 'exact', head: true })
  ])

  return {
    totalUsers: userCount || 0,
    totalDoctors: doctorCount || 0,
    pendingVerifications: pendingCount || 0,
    totalEducation: educationCount || 0,
    totalRoadmap: roadmapCount || 0,
  }
}

// ==================== DOCTOR APPROVALS ====================
export async function fetchPendingDoctors(): Promise<DoctorRegistration[]> {
  await checkAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doctor_registrations')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true })

  if (error) throw error
  return (data || []) as DoctorRegistration[]
}

export async function approveDoctor(registrationId: string) {
  const admin = await checkAdmin()
  const supabase = await createClient()

  // 1. Get the registration
  const { data: registration, error: regError } = await supabase
    .from('doctor_registrations')
    .select('*')
    .eq('id', registrationId)
    .single()

  if (regError || !registration) throw new Error('Registration not found')

  // 2. Create the actual doctor profile in the `doctors` table
  // Generate unique email using name and short UID suffix if registration email is missing
  const uidSuffix = registration.user_id.substring(0, 4)
  const safeName = registration.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const generatedEmail = `${safeName}.${uidSuffix}@genting.id`
  const doctorEmail = registration.email || generatedEmail

  const { error: doctorError } = await supabase
    .from('doctors')
    .upsert([{
      user_id: registration.user_id,
      full_name: registration.full_name,
      email: doctorEmail,
      phone: registration.phone,
      bio: registration.bio,
      profile_picture_url: registration.profile_photo_url,
      specialization: registration.specialization,
      license_number: registration.license_number,
      certification_url: registration.certification_url,
      years_of_experience: registration.years_of_experience,
      hourly_rate: registration.hourly_rate || 150000,
      is_verified: true,
      is_active: true,
      registration_status: 'approved',
      verification_date: new Date().toISOString(),
    }], { onConflict: 'user_id' })

  if (doctorError) throw doctorError

  // 3. Update registration status
  const { error: updateError } = await supabase
    .from('doctor_registrations')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
    })
    .eq('id', registrationId)

  if (updateError) throw updateError

  // 4. Update user role in profiles table + set approval notification flag
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'doctor', show_approval_msg: true })
    .eq('id', registration.user_id)

  if (profileError) throw profileError

  // 5. Sync role to Supabase Auth Metadata
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const adminClient = getSupabaseAdmin()
    const { error: authError } = await adminClient.auth.admin.updateUserById(registration.user_id, {
      user_metadata: { role: 'doctor' }
    })
    if (authError) throw authError
  } catch (err) {
    console.error('[AdminService] Gagal sinkronisasi metadata role:', err)
  }

  // Approval persisted in DB — no additional logging needed
}

export async function rejectDoctor(registrationId: string, userId: string, reason: string) {
  const admin = await checkAdmin()
  const supabase = await createClient()

  // 1. Update registration status
  const { error: regError } = await supabase
    .from('doctor_registrations')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
    })
    .eq('id', registrationId)

  if (regError) throw regError

  // 2. Ensure user role stays 'user'
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'user' })
    .eq('id', userId)

  if (profileError) throw profileError

  // 3. Sync role to Supabase Auth Metadata
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const adminClient = getSupabaseAdmin()
    await adminClient.auth.admin.updateUserById(userId, {
      user_metadata: { role: 'user' }
    })
  } catch (err) {
    console.error('[AdminService] Gagal sinkronisasi metadata role:', err)
  }
}

// ==================== GENERIC CRUD HELPERS ====================
async function getTable(name: string) {
  await checkAdmin()
  const supabase = await createClient()
  return supabase.from(name)
}

async function fetchById(table: string, id: string) {
  const query = await getTable(table)
  const { data, error } = await query.select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching ${table} by id:`, error)
    return null
  }
  return data
}

async function createItem<TItem extends Record<string, unknown>, TResult = TItem>(
  table: string,
  item: TItem
): Promise<TResult> {
  const query = await getTable(table)
  const { data, error } = await query.insert([item]).select().single()
  if (error) throw error
  return data as TResult
}

async function updateItem<TItem extends Record<string, unknown>, TResult = TItem>(
  table: string,
  id: string,
  item: TItem
): Promise<TResult> {
  const query = await getTable(table)
  const { data, error } = await query.update(item).eq('id', id).select().single()
  if (error) throw error
  return data as TResult
}

async function deleteItem(table: string, id: string) {
  const query = await getTable(table)
  const { error } = await query.delete().eq('id', id)
  if (error) throw error
}

// ==================== EDUCATION CRUD ====================
export async function fetchEducationContents(filters?: {
  search?: string
  category?: string
  phase?: string
}): Promise<EducationContent[]> {
  await checkAdmin()
  const supabase = await createClient()
  let query = supabase.from('education_contents').select('*')

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.phase) query = query.eq('phase', filters.phase)
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`)

  const { data, error } = await query.order('day', { ascending: true })
  if (error) throw error
  return (data || []) as EducationContent[]
}

export async function fetchEducationById(id: string) {
  return fetchById('education_contents', id)
}

export async function createEducationContent(content: Omit<EducationContent, 'id' | 'created_at' | 'updated_at'>) {
  return createItem('education_contents', content)
}

export async function updateEducationContent(id: string, content: Partial<Omit<EducationContent, 'id' | 'created_at' | 'updated_at'>>) {
  return updateItem('education_contents', id, content)
}

export async function deleteEducationContent(id: string) {
  return deleteItem('education_contents', id)
}

// ==================== ROADMAP CRUD ====================
export async function fetchRoadmapActivities(filters?: {
  search?: string
  category?: string
}): Promise<RoadmapActivity[]> {
  await checkAdmin()
  const supabase = await createClient()
  let query = supabase.from('roadmap_activities').select('*')

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.search) query = query.ilike('activity_name', `%${filters.search}%`)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as RoadmapActivity[]
}

export async function fetchRoadmapById(id: string) {
  return fetchById('roadmap_activities', id)
}

export async function createRoadmapActivity(activity: CreateRoadmapActivityInput) {
  return createItem('roadmap_activities', activity)
}

export async function updateRoadmapActivity(id: string, activity: UpdateRoadmapActivityInput) {
  return updateItem('roadmap_activities', id, activity)
}

export async function deleteRoadmapActivity(id: string) {
  return deleteItem('roadmap_activities', id)
}
