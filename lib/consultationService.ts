import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function getUpcomingConsultations(doctorId: string, limit: number = 5) {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      id,
      scheduled_at,
      user_id,
      status,
      title,
      duration_minutes,
      hourly_rate
    `)
    .eq('doctor_id', doctorId)
    .in('status', ['scheduled', 'ongoing'])
    .order('scheduled_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getRecentConsultations(doctorId: string, limit: number = 5) {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      id,
      scheduled_at,
      ended_at,
      user_id,
      status,
      duration_minutes,
      total_cost,
      rating,
      review,
      created_at
    `)
    .eq('doctor_id', doctorId)
    .in('status', ['completed', 'cancelled'])
    .order('ended_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getActiveConsultation(doctorId: string) {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      id,
      scheduled_at,
      started_at,
      user_id,
      status,
      title,
      hourly_rate,
      duration_minutes
    `)
    .eq('doctor_id', doctorId)
    .eq('status', 'ongoing')
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getTodayEarnings(doctorId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('consultations')
    .select('total_cost')
    .eq('doctor_id', doctorId)
    .eq('status', 'completed')
    .gte('ended_at', today.toISOString())

  if (error) throw error

  const total = data?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0
  return total
}

export async function getMonthlyStats(doctorId: string) {
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const { data, error } = await supabase
    .from('consultations')
    .select('id, total_cost, rating, status')
    .eq('doctor_id', doctorId)
    .gte('created_at', monthStart.toISOString())

  if (error) throw error

  const completed = data?.filter(c => c.status === 'completed') || []
  const rated = completed.filter(c => c.rating)

  const stats = {
    totalConsultations: data?.length || 0,
    completedConsultations: completed.length || 0,
    totalEarnings: data?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0,
    avgRating: rated.length > 0
      ? (rated.reduce((sum, item) => sum + (item.rating || 0), 0) / rated.length).toFixed(1)
      : '0.0'
  }

  return stats
}
