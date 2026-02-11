'use client'

import React from 'react'
import { BookCheck } from 'lucide-react'
import { EducationProgressBar } from './EducationProgressBar'

interface SidebarStatsProps {
  readCount: number
  totalDays: number
  streakDays?: number
}

export const SidebarStats = React.memo(({ readCount, totalDays, streakDays = 3 }: SidebarStatsProps) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cerulean/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-cerulean/10" />
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-secondary shadow-lg shadow-slate-200 ring-4 ring-slate-50">
           <BookCheck className="w-6 h-6 text-sea-green" />
        </div>
        <div>
           <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">Statistik</h3>
           <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Progress Belajar</p>
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
