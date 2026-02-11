'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ConsultationMessage } from '@/types/consultation'

export function useConsultationMessages(consultationId: string) {
  const [messages, setMessages] = useState<ConsultationMessage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('consultation_messages')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true })

      setMessages(data || [])
      setLoading(false)
    }

    fetchMessages()

    const channel = supabase
      .channel(`consultation:${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_messages',
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ConsultationMessage])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [consultationId, supabase])

  return { messages, loading }
}
