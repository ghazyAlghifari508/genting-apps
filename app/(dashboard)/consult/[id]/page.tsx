'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  ChevronLeft, 
  Send, 
  Loader2,
  CheckCircle,
  Clock,
  Stethoscope,
  User
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
}

interface PaymentData {
  id: string
  status: string
  doctorId: string
  doctorName: string
  doctorAvatar: string | null
}

export default function ConsultChatPage() {
  const params = useParams()
  const paymentId = params.id as string
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)

        // Get payment and doctor info
        const { data: paymentData } = await supabase
          .from('payments')
          .select(`
            id,
            status,
            doctor_id,
            profiles:doctor_id (full_name, avatar_url)
          `)
          .eq('id', paymentId)
          .single()

        if (paymentData) {
          setPayment({
            id: paymentData.id,
            status: paymentData.status,
            doctorId: paymentData.doctor_id,
            doctorName: (paymentData.profiles as any)?.full_name || 'Dokter',
            doctorAvatar: (paymentData.profiles as any)?.avatar_url,
          })
        }

        // Get existing messages
        const { data: existingMessages } = await supabase
          .from('consultation_messages')
          .select('*')
          .eq('payment_id', paymentId)
          .order('created_at', { ascending: true })

        if (existingMessages) {
          setMessages(existingMessages.map(m => ({
            id: m.id,
            senderId: m.sender_id,
            content: m.content,
            createdAt: m.created_at,
          })))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, paymentId])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`consultation:${paymentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_messages',
          filter: `payment_id=eq.${paymentId}`,
        },
        (payload) => {
          const newMsg = payload.new as any
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, {
              id: newMsg.id,
              senderId: newMsg.sender_id,
              content: newMsg.content,
              createdAt: newMsg.created_at,
            }]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, paymentId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || sending) return

    try {
      setSending(true)
      
      await supabase.from('consultation_messages').insert({
        payment_id: paymentId,
        sender_id: userId,
        content: newMessage.trim(),
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lavender border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="glass-card rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Konsultasi Tidak Ditemukan</h2>
          <p className="text-foreground/60 mb-4">Silakan lakukan pembayaran terlebih dahulu</p>
          <Link href="/consult">
            <Button className="rounded-xl bg-lavender hover:bg-lavender/90">
              Kembali ke Daftar Dokter
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (payment.status !== 'success') {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="glass-card rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Menunggu Pembayaran</h2>
          <p className="text-foreground/60 mb-4">
            Silakan selesaikan pembayaran untuk memulai konsultasi
          </p>
          <Link href="/consult">
            <Button variant="outline" className="rounded-xl">
              Kembali
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col gradient-bg">
      {/* Header */}
      <header className="glass-card border-b border-border/50 shrink-0">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/consult">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-lavender/10 flex items-center justify-center overflow-hidden">
              {payment.doctorAvatar ? (
                <img src={payment.doctorAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <Stethoscope className="w-5 h-5 text-lavender" />
              )}
            </div>
            <div>
              <h1 className="font-semibold text-sm">{payment.doctorName}</h1>
              <div className="flex items-center gap-1 text-xs text-green">
                <CheckCircle className="w-3 h-3" />
                <span>Konsultasi Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-lg mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-foreground/50">
            <p>Mulai percakapan dengan dokter</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === userId
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {!isMe && (
                    <div className="w-8 h-8 rounded-lg bg-lavender/10 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-4 h-4 text-lavender" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      isMe
                        ? 'bg-lavender text-white rounded-br-sm'
                        : 'glass-card rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-white/60' : 'text-foreground/40'}`}>
                      {new Date(message.createdAt).toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {isMe && (
                    <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-green" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card border-t border-border/50 shrink-0">
        <div className="max-w-lg mx-auto px-4 py-3 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ketik pesan..."
            className="flex-1 rounded-xl"
          />
          <Button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            size="icon"
            className="rounded-xl bg-lavender hover:bg-lavender/90"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
