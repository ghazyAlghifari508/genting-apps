'use client'

import { Flame, Trophy } from 'lucide-react'

interface RoadmapProgressProps {
  completedCount: number
  totalCount: number
  streakDays: number
}

export function RoadmapProgress({ completedCount, totalCount, streakDays }: RoadmapProgressProps) {
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
          <Trophy className="h-4 w-4 text-amber-500" />
          Progress Engine
        </h3>
        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
          {progressPercentage}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-doccure-teal via-sea-green to-emerald-400"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Selesai</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {completedCount}
            <span className="ml-0.5 text-xs font-semibold text-slate-500">/{totalCount}</span>
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-800">Streak</p>
          <p className="mt-1 inline-flex items-center gap-1 text-lg font-bold text-amber-900">
            {streakDays}
            <Flame className="h-3.5 w-3.5" />
          </p>
        </div>
      </div>

      {/* Milestone Board Hidden as per user request */}
    </div>
  )
}
