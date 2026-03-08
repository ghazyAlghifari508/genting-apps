'use client'

import React from 'react'
import { BookCheck } from 'lucide-react'
import { EducationProgressBar } from './EducationProgressBar'

interface SidebarStatsProps {
  readCount: number
  totalDays: number
  streakDays?: number
}

export const SidebarStats = React.memo(({ readCount, totalDays, streakDays }: SidebarStatsProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-doccure-dark text-white">
           <BookCheck className="h-5 w-5" />
        </div>
        <div>
           <h3 className="text-lg font-bold leading-none tracking-tight text-slate-900">Statistik</h3>
           <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Progress Belajar</p>
        </div>
      </div>

      <EducationProgressBar 
        readCount={readCount}
        streakDays={streakDays}
        totalDays={totalDays}
      />
    </div>
  )
})

SidebarStats.displayName = 'SidebarStats'



