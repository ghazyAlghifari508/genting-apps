'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { getDoctorConversations } from '@/services/consultationService'
import { getDoctorByUserId } from '@/services/doctorService'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { ConsultationConversation } from '@/types/consultation'

export const MessagesWidget = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConsultationConversation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = useCallback(async () => {
    if (!user) return
    try {
      const doc = await getDoctorByUserId(user.id)
      if (doc) {
        const data = await getDoctorConversations(doc.id)
        setConversations(data || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchConversations()

      // Subscribe to any new messages across all consultations for this doctor
      const channel = supabase
        .channel('dashboard_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'consultation_messages'
          },
          () => {
            fetchConversations()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user, fetchConversations])

  const getInitials = (name?: string | null) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??'
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Sekarang'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m lalu`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}j lalu`
    return `${Math.floor(diff / 86400000)}h lalu`
  }

  return (
    <Card className="p-6 border-none shadow-sm bg-white  h-auto transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800  flex items-center gap-2 transition-colors">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          Pesan Baru
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-cerulean hover:bg-sea-green/10  text-xs font-semibold"
          onClick={() => router.push('/doctor/messages')}
        >
          Lihat Semua
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-3 rounded-xl">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-12 rounded-full opacity-50" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="py-10 text-center text-slate-400  text-sm border-2 border-dashed border-slate-50  rounded-2xl transition-colors">
          Belum ada pesan masuk.
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((con) => (
            <div 
              key={con.consultation_id} 
              className="flex gap-4 p-3 rounded-xl hover:bg-slate-50  transition-colors cursor-pointer group border border-transparent hover:border-slate-100 "
              onClick={() => router.push(`/doctor/messages/${con.consultation_id}`)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-sea-green/20  text-cerulean  transition-colors`}>
                {getInitials(con.user?.full_name)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className={`text-sm font-bold truncate text-slate-900  transition-colors`}>
                    {con.user?.full_name || 'Pasien Anonim'}
                  </h4>
                  <span className="text-xs text-slate-400  whitespace-nowrap">
                    {formatTime(con.lastMessage.created_at)}
                  </span>
                </div>
                <p className={`text-xs truncate text-slate-700  transition-colors`}>
                  {con.lastMessage.message}
                </p>
              </div>
              {!con.lastMessage.is_read && con.lastMessage.sender_type === 'user' && (
                <div className="w-2 h-2 rounded-full bg-medical-red mt-2 shrink-0 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
