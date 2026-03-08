'use client'

import { useConsultationTimer } from '@/hooks/useConsultationTimer'
import { Clock } from 'lucide-react'

export function ConsultationTimer({ startedAt, endedAt }: { startedAt?: string; endedAt?: string }) {
  const { formatted, isRunning } = useConsultationTimer(startedAt, endedAt)

  return (
    <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs font-semibold ${
      isRunning ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
    }`}>
      <Clock size={14} className={isRunning ? 'animate-pulse' : ''} />
      {formatted}
    </div>
  )
}



