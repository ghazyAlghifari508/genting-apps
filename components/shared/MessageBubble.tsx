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
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
        isOwn
          ? 'bg-slate-900 text-white rounded-br-md'
          : 'bg-white border border-slate-100 text-slate-800 rounded-bl-md shadow-sm'
      }`}>
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
        <p className={`text-[10px] mt-1 ${isOwn ? 'text-slate-400' : 'text-slate-400'}`}>{time}</p>
      </div>
    </div>
  )
}
