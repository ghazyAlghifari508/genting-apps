'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { Card } from '@/components/ui/card'
import { MessageSquare, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getDoctorConversations } from '@/services/consultationService'
import { getDoctorByUserId } from '@/services/doctorService'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import type { ConsultationConversation } from '@/types/consultation'

export default function DoctorMessagesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConsultationConversation[]>([])
  const [search, setSearch] = useState('')
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

      const channel = supabase
        .channel('messages_page')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'consultation_messages' }, () => {
          fetchConversations()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user, fetchConversations])

  const filtered = conversations.filter(c => 
    c.user?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const getInitials = (name?: string | null) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??'
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen relative">
      
      <main className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pasien..."
            className="pl-10 rounded-2xl bg-white border-slate-200"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">Memuat percakapan...</div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-transparent">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Tidak ada pesan ditemukan</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((con) => (
              <Card 
                key={con.consultation_id} 
                className="p-4 hover:shadow-md transition-all cursor-pointer border-slate-100 group"
                onClick={() => router.push(`/doctor/consultations/${con.consultation_id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cerulean/10 text-cerulean flex items-center justify-center font-bold">
                    {getInitials(con.user?.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-900 truncate">{con.user?.full_name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase font-black">
                        {new Date(con.lastMessage.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${!con.lastMessage.is_read && con.lastMessage.sender_type === 'user' ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                      {con.lastMessage.message}
                    </p>
                  </div>
                  {!con.lastMessage.is_read && con.lastMessage.sender_type === 'user' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-cerulean/5 rounded-full blur-[120px] -mr-64 -mt-32" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-cerulean/5 rounded-full blur-[120px] -ml-64 -mb-32" />
    </div>
  )
}
