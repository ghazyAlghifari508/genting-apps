'use client'

import React from 'react'
import { Star } from 'lucide-react'

interface RoadmapHeaderProps {
  trimester: number
  pregnancyWeek: number
  completedCount: number
  totalCount: number
  streakDays: number
  totalXp: number
}

function formatToday() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const RoadmapHeader = React.memo(({
  trimester,
  pregnancyWeek,
  completedCount,
  totalCount,
  streakDays,
  totalXp,
}: RoadmapHeaderProps) => {
  const todayLabel = formatToday()

  return (
    <section className="px-1">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-doccure-teal">
          Minggu {pregnancyWeek || 0} · Trimester {trimester} · {todayLabel}
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Roadmap Harian
        </h1>
        <p className="mt-1 text-slate-500 font-semibold text-[15px] max-w-xl">
          Aktivitas hari ini difokuskan untuk progres kehamilan yang terarah.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
            ✓ {completedCount}/{totalCount} selesai
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
            🔥 {streakDays} hari
          </span>
          {totalXp > 0 && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
                <Star className="w-3.5 h-3.5 text-amber-500" /> {totalXp} XP
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  )
})

RoadmapHeader.displayName = 'RoadmapHeader'
