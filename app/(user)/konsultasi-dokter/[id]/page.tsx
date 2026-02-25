'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import { ConsultationTimer } from '@/components/shared/ConsultationTimer'
import { MessageBubble } from '@/components/shared/MessageBubble'
import { RatingStars } from '@/components/shared/RatingStars'
import { useConsultationMessages } from '@/hooks/useConsultationMessages'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Send, Stethoscope, Star, X } from 'lucide-react'
import type { Consultation } from '@/types/consultation'
import { getConsultationById, sendConsultationMessage, submitConsultationRating, markMessagesAsRead } from '@/services/consultationService'

export default function UserConsultationRoomPage() {
  const { id } = useParams<{ id: string }>()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [userId, setUserId] = useState('')
  const [input, setInput] = useState('')
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, addMessage } = useConsultationMessages(id)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }

    const load = async () => {
      setUserId(user.id)
      try {
        const data = await getConsultationById(id)
        if (data) {
          setConsultation(data)
          await markMessagesAsRead(id, 'user')
        }
      } catch (error) {
        console.error(error)
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
      .channel(`consultation_status:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'consultations',
          filter: `id=eq.${id}`
        },
        (payload: any) => {
          console.log('[UserConsultationRoom] Status change received:', payload)
          setConsultation(payload.new as Consultation)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  useEffect(() => {
    console.log('[UserChat] Messages updated, scrolling. Count:', messages.length)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (messages.length > 0 && messages[messages.length - 1].sender_type === 'doctor') {
      markMessagesAsRead(id, 'user').catch(console.error)
    }
  }, [messages, id])

  const handleSend = async () => {
    if (!input.trim()) return
    const message = input.trim()
    setInput('')
    try {
      console.log('[UserChat] Sending message:', message)
      const newMsg = await sendConsultationMessage(id, userId, message, 'user')
      console.log('[UserChat] Message sent successfully:', newMsg)
      if (newMsg) addMessage(newMsg)
    } catch (error) {
      console.error('[UserChat] Error sending message:', error)
    }
  }

  const submitRating = async () => {
    if (!rating) return
    await submitConsultationRating(id, rating, review)
    setConsultation((prev) => (prev ? { ...prev, rating, review } : prev))
    setShowRating(false)
    toast({ title: 'Terima kasih', description: 'Ulasan Anda sudah terkirim.' })
  }

  if (loading) {
    return (
      <div className="space-y-5 pt-6 pb-32 text-slate-900">
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-3 md:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div>
                  <Skeleton className="h-4 w-32 rounded-full mb-1" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>
            </div>

            <div className="h-[calc(100vh-260px)] min-h-[420px] rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-4 overflow-hidden">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <Skeleton className={`h-16 w-1/2 rounded-2xl ${i % 2 === 0 ? 'rounded-tr-none' : 'rounded-tl-none'}`} />
                 </div>
               ))}
            </div>

            <div className="mt-3 flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-12 rounded-xl" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!consultation) return <div className="p-8 text-center text-slate-500">Konsultasi tidak ditemukan.</div>

  const doctor = consultation.doctor

  return (
    <div className="space-y-5 pt-6 pb-32 text-slate-900">
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-3 md:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-8 rounded-xl border-slate-300 px-2" onClick={() => router.push('/konsultasi-dokter')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-doccure-teal to-doccure-dark text-white">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{doctor?.full_name || 'Dokter'}</p>
                <p className="text-xs font-medium text-slate-500">{doctor?.specialization || 'Konsultasi'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ConsultationStatusBadge status={consultation.status} />
              <ConsultationTimer startedAt={consultation.started_at} endedAt={consultation.ended_at} />
            </div>
          </div>

          <div className="h-[calc(100vh-260px)] min-h-[420px] rounded-2xl border border-slate-100 bg-slate-50/70 p-3 md:p-4 overflow-y-auto">
            {messages.length === 0 && <p className="py-8 text-center text-sm text-slate-500">Belum ada pesan pada sesi ini.</p>}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} isOwn={message.sender_id === userId} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {consultation.status === 'ongoing' && (
            <div className="mt-3 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ketik pesan..."
                className="h-10 rounded-xl border-slate-300"
              />
              <Button onClick={handleSend} disabled={!input.trim()} className="h-10 rounded-xl bg-doccure-teal px-4 text-white hover:bg-doccure-dark">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {consultation.status === 'scheduled' && (
            <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Menunggu dokter memulai sesi konsultasi.
            </div>
          )}

          {consultation.status === 'completed' && !consultation.rating && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3">
              {!showRating ? (
                <Button onClick={() => setShowRating(true)} className="h-10 w-full rounded-xl bg-amber-500 text-sm font-semibold text-white hover:bg-amber-600">
                  <Star className="mr-1 h-4 w-4" /> Beri Ulasan
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Beri rating sesi ini</p>
                    <button onClick={() => setShowRating(false)} className="text-slate-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-center py-1">
                    <RatingStars rating={rating} size={30} interactive onRate={setRating} />
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="h-20 w-full resize-none rounded-xl border border-slate-300 p-3 text-sm"
                    placeholder="Tulis ulasan (opsional)..."
                  />
                  <Button onClick={submitRating} disabled={!rating} className="h-10 w-full rounded-xl bg-amber-500 text-sm font-semibold text-white hover:bg-amber-600">
                    Kirim Ulasan
                  </Button>
                </div>
              )}
            </div>
          )}

          {consultation.status === 'completed' && consultation.rating && (
            <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Konsultasi selesai. Rating Anda: {consultation.rating}/5.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
