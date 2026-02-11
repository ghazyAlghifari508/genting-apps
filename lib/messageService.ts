import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function sendMessage(
  consultationId: string,
  senderId: string,
  senderType: 'user' | 'doctor',
  message: string,
  messageType: 'text' | 'file' | 'prescription' | 'note' = 'text'
) {
  const { data, error } = await supabase
    .from('consultation_messages')
    .insert({
      consultation_id: consultationId,
      sender_id: senderId,
      sender_type: senderType,
      message,
      message_type: messageType
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getConsultationMessages(consultationId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('consultation_messages')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

export function subscribeToMessages(consultationId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`consultation:${consultationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'consultation_messages',
        filter: `consultation_id=eq.${consultationId}`
      },
      (payload) => callback(payload.new)
    )
    .subscribe()
}
