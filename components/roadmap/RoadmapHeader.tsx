'use client'

import React from 'react'
import { Route } from 'lucide-react'

interface RoadmapHeaderProps {
  trimester: number
  pregnancyWeek: number
  onTrimesterChange: (t: number) => void
}

export const RoadmapHeader = React.memo(({ trimester, pregnancyWeek, onTrimesterChange }: RoadmapHeaderProps) => {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cerulean/10 flex items-center justify-center">
            <Route className="w-5 h-5 text-cerulean" />
          </div>
          <span className="text-[10px] font-black text-cerulean uppercase tracking-widest">
            Panduan Anti-Stunting
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-2">
          Roadmap <span className="gradient-text">Bunda</span>
        </h1>
        <p className="text-slate-500 font-bold text-base max-w-xl">
          Ikuti aktivitas harian yang dirancang khusus untuk Trimester {trimester} 
          {pregnancyWeek > 0 && ` (Minggu ke-${pregnancyWeek})`} Anda.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {[1, 2, 3].map((t) => (
          <button
            key={t}
            onClick={() => onTrimesterChange(t)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${
              trimester === t
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'bg-white/50 text-slate-400 hover:bg-white hover:text-slate-600 border border-white/50'
            }`}
          >
            TM {t}
          </button>
        ))}
      </div>
    </section>
  )
})

RoadmapHeader.displayName = 'RoadmapHeader'
