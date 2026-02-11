'use client'

import { useConsultationTimer } from '@/hooks/useConsultationTimer'
import { Clock } from 'lucide-react'

export function ConsultationTimer({ startedAt, endedAt }: { startedAt?: string; endedAt?: string }) {
  const { formatted, isRunning } = useConsultationTimer(startedAt, endedAt)

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold ${
      isRunning ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
    }`}>
      <Clock size={16} className={isRunning ? 'animate-pulse' : ''} />
      {formatted}
    </div>
  )
}
