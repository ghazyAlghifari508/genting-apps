'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, FilePlus, User, Timer } from 'lucide-react'
import { sendMessage, getConsultationMessages, subscribeToMessages } from '@/lib/messageService'

interface ActiveConsultationWidgetProps {
  consultation: any
  doctor: any
}

export default function ActiveConsultationWidget({ consultation, doctor }: ActiveConsultationWidgetProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!consultation?.id) return

    // Load initial messages
    getConsultationMessages(consultation.id).then(setMessages)

    // Subscribe to real-time updates
    const channel = subscribeToMessages(consultation.id, (payload) => {
      setMessages((prev) => [...prev, payload])
    })

    return () => {
      channel.unsubscribe()
    }
  }, [consultation?.id])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || sending) return

    setSending(true)
    try {
      await sendMessage(consultation.id, doctor.user_id, 'doctor', inputText)
      setInputText('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  if (!consultation) {
    return (
      <Card className="rounded-[2.5rem] p-8 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center h-[500px]">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
           <Timer className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-black text-slate-400">Tidak ada sesi aktif</h3>
        <p className="text-sm text-slate-400 mt-2">Sesi yang sedang berlangsung akan muncul di sini</p>
      </Card>
    )
  }

  return (
    <Card className="rounded-[2.5rem] flex flex-col h-[600px] border-white/50 bg-white/70 backdrop-blur-md shadow-2xl relative overflow-hidden group">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-white/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cerulean to-sea-green flex items-center justify-center text-white shadow-lg shadow-cerulean/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 leading-none">Sarah Millenia</h4>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sesi Sedang Berlangsung</span>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-2 bg-slate-900 rounded-xl text-white font-black text-xs flex items-center gap-2">
           <Timer className="w-3.5 h-3.5 text-sea-green" />
           24:12
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-slate-50/20"
      >
        {messages.map((msg, i) => {
          const isDoctor = msg.sender_type === 'doctor'
          return (
            <div key={msg.id || i} className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-bold shadow-sm ${
                isDoctor 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-600 rounded-tl-none border border-slate-100'
              }`}>
                {msg.message}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-100 bg-white/50">
        <form onSubmit={handleSend} className="flex gap-2">
           <Button type="button" variant="outline" className="w-12 h-12 rounded-2xl shrink-0 p-0 border-slate-200 text-slate-400 hover:text-cerulean hover:border-cerulean/20 transition-all">
              <FilePlus className="w-6 h-6" />
           </Button>
           <Input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik balasan..." 
              className="h-12 rounded-2xl px-5 border-slate-200 text-sm font-bold focus-visible:ring-cerulean"
           />
           <Button 
              type="submit"
              disabled={sending || !inputText.trim()}
              className="w-12 h-12 rounded-2xl bg-slate-900 text-white shrink-0 p-0 hover:bg-cerulean transition-all active:scale-95 disabled:opacity-50"
           >
              <Send className="w-5 h-5" />
           </Button>
        </form>
      </div>
    </Card>
  )
}
