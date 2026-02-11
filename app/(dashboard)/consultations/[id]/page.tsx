'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import { ConsultationTimer } from '@/components/shared/ConsultationTimer'
import { MessageBubble } from '@/components/shared/MessageBubble'
import { RatingStars } from '@/components/shared/RatingStars'
import { useConsultationMessages } from '@/hooks/useConsultationMessages'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Send, Stethoscope, Star, X } from 'lucide-react'
import type { Consultation } from '@/types/consultation'

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
  const { messages } = useConsultationMessages(id)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('consultations')
        .select('*, doctor:doctor_id(full_name, specialization, profile_picture_url)')
        .eq('id', id)
        .single()

      if (data) setConsultation(data)
      setLoading(false)
    }
    load()

    // Subscribe to status changes
    const channel = supabase
      .channel(`consultation-status:${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'consultations', filter: `id=eq.${id}` }, (payload) => {
        setConsultation((prev) => prev ? { ...prev, ...payload.new } as Consultation : prev)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id, supabase, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const msg = input.trim()
    setInput('')
    await supabase.from('consultation_messages').insert({
      consultation_id: id,
      sender_id: userId,
      sender_type: 'user',
      message: msg,
    })
  }

  const submitRating = async () => {
    if (!rating) return
    await supabase.from('consultations').update({ rating, review, reviewed_at: new Date().toISOString() }).eq('id', id)
    setConsultation((prev) => prev ? { ...prev, rating, review } : prev)
    setShowRating(false)
    toast({ title: 'Terima kasih!', description: 'Ulasan Anda telah terkirim.' })
  }

  if (loading) return <LoadingScreen message="Memuat konsultasi..." fullScreen />
  if (!consultation) return <div className="p-8 text-center text-slate-500">Konsultasi tidak ditemukan</div>

  const doctor = (consultation as any).doctor

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => router.push('/consultation-history')}>
            <ArrowLeft size={18} />
          </Button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">{doctor?.full_name || 'Dokter'}</p>
            <ConsultationStatusBadge status={consultation.status} />
          </div>
        </div>
        <ConsultationTimer startedAt={consultation.started_at} endedAt={consultation.ended_at} />
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-center text-sm text-slate-400 py-8">Belum ada pesan</p>}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === userId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Actions */}
      {consultation.status === 'ongoing' && (
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} placeholder="Ketik pesan..." className="rounded-xl flex-1" />
            <Button onClick={handleSend} disabled={!input.trim()} className="rounded-xl bg-blue-600 hover:bg-blue-700">
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}

      {consultation.status === 'scheduled' && (
        <div className="p-4 bg-blue-50 border-t text-center">
          <p className="text-sm text-blue-700 font-bold">⏳ Menunggu dokter memulai konsultasi</p>
        </div>
      )}

      {consultation.status === 'completed' && !consultation.rating && (
        <div className="p-4 bg-white border-t">
          {!showRating ? (
            <Button onClick={() => setShowRating(true)} className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 font-bold">
              <Star size={16} className="mr-2" /> Beri Ulasan
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">Beri Rating</p>
                <button onClick={() => setShowRating(false)} className="text-slate-400"><X size={18} /></button>
              </div>
              <div className="flex justify-center py-2">
                <RatingStars rating={rating} size={32} interactive onRate={setRating} />
              </div>
              <textarea value={review} onChange={(e) => setReview(e.target.value)} className="w-full rounded-xl border p-3 text-sm resize-none h-20" placeholder="Tulis ulasan (opsional)..." />
              <Button onClick={submitRating} disabled={!rating} className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 font-bold">
                Kirim Ulasan
              </Button>
            </div>
          )}
        </div>
      )}

      {consultation.status === 'completed' && consultation.rating && (
        <div className="p-4 bg-green-50 border-t text-center">
          <p className="text-sm text-green-700 font-bold">✅ Konsultasi selesai — Rating: {consultation.rating}/5</p>
        </div>
      )}
    </div>
  )
}
