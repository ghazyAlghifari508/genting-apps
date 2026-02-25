'use client'

import { useEffect, useState, useRef } from 'react'
import { getConsultationById, updateConsultation, sendConsultationMessage, markMessagesAsRead } from '@/services/consultationService'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import { ConsultationTimer } from '@/components/shared/ConsultationTimer'
import { MessageBubble } from '@/components/shared/MessageBubble'
import { useConsultationMessages } from '@/hooks/useConsultationMessages'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Send, Play, CheckCircle, User, Clock, Menu } from 'lucide-react'
import { DoctorTopHeader } from '@/components/doctor/layout/DoctorTopHeader'
import Link from 'next/link'
import type { Consultation } from '@/types/consultation'

export default function DoctorConsultationRoomPage() {
  const { id } = useParams<{ id: string }>()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [userId, setUserId] = useState('')
  const [input, setInput] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, addMessage } = useConsultationMessages(id)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login'); return }

    const load = async () => {
      try {
        setUserId(user.id)
        const data = await getConsultationById(id)

        if (data) {
          setConsultation(data)
          setNotes(data.notes || '')
          await markMessagesAsRead(id, 'doctor')
        }
      } catch (error) {
        console.error('Error loading consultation:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router, user, authLoading])

  useEffect(() => {
    if (!id) return

    // Real-time subscription for consultation status/details
    const channel = supabase
      .channel(`consultation_status_doctor:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'consultations',
          filter: `id=eq.${id}`
        },
        (payload: any) => {
          console.log('[DoctorConsultationRoom] Status change received:', payload)
          setConsultation(payload.new as Consultation)
          if (payload.new.notes) setNotes(payload.new.notes)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  useEffect(() => {
    console.log('[DoctorChat] Messages updated, scrolling to bottom. Count:', messages.length)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (messages.length > 0 && messages[messages.length - 1].sender_type === 'user') {
      markMessagesAsRead(id, 'doctor').catch(console.error)
    }
  }, [messages, id])

  const handleSend = async () => {
    if (!input.trim() || !consultation) return
    const msg = input.trim()
    setInput('')
    try {
      console.log('[DoctorChat] Sending message:', msg)
      const newMsg = await sendConsultationMessage(id, userId, msg, 'doctor')
      console.log('[DoctorChat] Message sent successfully:', newMsg)
      if (newMsg) addMessage(newMsg)
    } catch (error) {
      console.error('[DoctorChat] Error sending message:', error)
    }
  }

  const startConsultation = async () => {
    try {
      const updated = await updateConsultation(id, { status: 'ongoing', started_at: new Date().toISOString() })
      if (updated) setConsultation(updated)
      toast({ title: 'Konsultasi dimulai!' })
    } catch (error) {
      console.error('Error starting consultation:', error)
    }
  }

  const endConsultation = async () => {
    try {
      const ended = new Date().toISOString()
      const duration = consultation?.started_at
        ? Math.ceil((new Date(ended).getTime() - new Date(consultation.started_at).getTime()) / 60000)
        : 0

      const updated = await updateConsultation(id, {
        status: 'completed', ended_at: ended, duration_minutes: duration, notes,
      })

      if (updated) setConsultation(updated)
      toast({ title: 'Konsultasi selesai!' })
    } catch (error) {
      console.error('Error ending consultation:', error)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-slate-50">
        <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <Skeleton className="h-8 w-8 rounded-xl" />
             <div className="space-y-1">
               <Skeleton className="h-4 w-32 rounded-full" />
               <Skeleton className="h-4 w-20 rounded-full" />
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-4 space-y-4">
             <Skeleton className="h-32 w-full rounded-2xl" />
             <Skeleton className="h-24 w-full rounded-2xl" />
             <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="flex-1 p-4 space-y-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                 <Skeleton className="h-16 w-1/2 rounded-2xl" />
               </div>
             ))}
          </div>
        </div>
      </div>
    )
  }

  if (!consultation) return <div className="p-8 text-center text-slate-500">Konsultasi tidak ditemukan</div>

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <DoctorTopHeader showSearch={false} />
          </div>
          <div className="hidden lg:block">
            <Link href="/doctor/consultations" className="p-2 hover:bg-slate-50 rounded-full transition-colors block">
              <ArrowLeft size={20} className="text-slate-400" />
            </Link>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 line-clamp-1">{consultation.user?.full_name || 'Pasien'}</p>
            <ConsultationStatusBadge status={consultation.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConsultationTimer startedAt={consultation.started_at} endedAt={consultation.ended_at} />
          {consultation.status === 'scheduled' && (
            <Button onClick={startConsultation} className="rounded-xl bg-green-600 hover:bg-green-700 font-bold text-sm">
              <Play size={14} className="mr-1" /> Mulai
            </Button>
          )}
          {consultation.status === 'ongoing' && (
            <Button onClick={endConsultation} className="rounded-xl bg-red-600 hover:bg-red-700 font-bold text-sm">
              <CheckCircle size={14} className="mr-1" /> Selesai
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Patient Info */}
        <div className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-4 overflow-y-auto">
          <Card className="p-4 rounded-2xl border-0 shadow-sm bg-slate-50 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-sm">{consultation.user?.full_name || 'Pasien'}</p>
                <p className="text-xs text-slate-400">Pasien</p>
              </div>
            </div>
            {consultation.description && (
              <div className="text-xs text-slate-600 bg-white rounded-lg p-3 border">
                <p className="font-bold text-slate-500 mb-1">Keluhan:</p>
                {consultation.description}
              </div>
            )}
          </Card>

          <Card className="p-4 rounded-2xl border-0 shadow-sm bg-slate-50 mb-4">
            <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><Clock size={12} /> Detail</p>
            <div className="space-y-1 text-xs text-slate-600">
              <p>Jadwal: {new Date(consultation.scheduled_at).toLocaleString('id-ID')}</p>
              <p>Tarif: Rp {consultation.hourly_rate.toLocaleString('id-ID')}/jam</p>
              <p>Total: Rp {(consultation.total_cost || 0).toLocaleString('id-ID')}</p>
            </div>
          </Card>

          {(consultation.status === 'ongoing' || consultation.status === 'completed') && (
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">Catatan Dokter</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={consultation.status === 'completed'}
                className="w-full text-xs border rounded-xl p-3 resize-none h-32 bg-white"
                placeholder="Tulis catatan konsultasi..."
              />
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {messages.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">Belum ada pesan</p>
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === userId} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {consultation.status === 'ongoing' && (
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ketik pesan..."
                  className="rounded-xl flex-1"
                />
                <Button onClick={handleSend} disabled={!input.trim()} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                  <Send size={16} />
                </Button>
              </div>
            </div>
          )}

          {consultation.status === 'completed' && (
            <div className="p-4 bg-green-50 border-t text-center">
              <p className="text-sm text-green-700 font-bold">✅ Konsultasi telah selesai</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
