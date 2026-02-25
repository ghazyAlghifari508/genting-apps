'use client'

import type { ConsultationMessage } from '@/types/consultation'

export function MessageBubble({
  message,
  isOwn,
}: {
  message: ConsultationMessage
  isOwn: boolean
}) {
  const time = new Date(message.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`mb-3 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] rounded-2xl px-3 py-2.5 text-sm ${
        isOwn
          ? 'bg-doccure-dark text-white'
          : 'border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] text-slate-800'
      }`}>
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
        <p className={`mt-1 text-[10px] ${isOwn ? 'text-slate-300' : 'text-slate-400'}`}>{time}</p>
      </div>
    </div>
  )
}



