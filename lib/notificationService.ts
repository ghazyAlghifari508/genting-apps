import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export type NotificationType = 
  | 'new_consultation'
  | 'message'
  | 'payment'
  | 'reminder'
  | 'review'
  | 'system'

export async function createDoctorNotification(
  doctorId: string,
  payload: {
    title: string
    message: string
    type: NotificationType
    referenceId?: string
    actionUrl?: string
  }
) {
  const { data, error } = await supabase
    .from('doctor_notifications')
    .insert({
      doctor_id: doctorId,
      title: payload.title,
      message: payload.message,
      notification_type: payload.type,
      reference_id: payload.referenceId,
      action_url: payload.actionUrl
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUnreadNotifications(doctorId: string) {
  const { data, error } = await supabase
    .from('doctor_notifications')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data || []
}

export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from('doctor_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) throw error
}
