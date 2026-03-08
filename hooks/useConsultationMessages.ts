import { useEffect, useState } from 'react'
import { getConsultationMessages } from '@/services/consultationService'
import { supabase } from '@/lib/supabase'
import type { ConsultationMessage } from '@/types/consultation'

export function useConsultationMessages(consultationId: string) {
  const [messages, setMessages] = useState<ConsultationMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Initial fetch
    const fetchMessages = async () => {
      try {
        const data = await getConsultationMessages(consultationId)
        setMessages(data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // 2. Real-time subscription
    // IMPORTANT: Make sure 'Realtime' is enabled for consultation_messages in Supabase dashboard
    const channel = supabase
      .channel(`chat:${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consultation_messages',
          filter: `consultation_id=eq.${consultationId}`
        },
        (payload) => {

          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as ConsultationMessage
            setMessages((prev) => {
              if (prev.find(m => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new as ConsultationMessage
            setMessages((prev) => prev.map(msg => msg.id === updatedMsg.id ? updatedMsg : msg))
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter(msg => msg.id === payload.old.id))
          }
        }
      )
      .subscribe()


    return () => { 
      supabase.removeChannel(channel)
    }
  }, [consultationId])

  const addMessage = (msg: ConsultationMessage) => {
    setMessages((prev) => {
      // Prevent duplicates if Realtime already inserted it
      if (prev.find(m => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }

  return { messages, loading, addMessage }
}

