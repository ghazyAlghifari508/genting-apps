'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  BedDouble,
  Brain,
  Calendar,
  ChevronRight,
  ClipboardPlus,
  Clock,
  Dumbbell,
  HeartHandshake,
  Salad,
  Sparkles,
  Square,
  SquareCheckBig,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

interface Activity {
  id: string
  activity_name: string
  category: string
  description: string
  difficulty_level: number
  duration_minutes: number
  frequency_per_week: number
}

interface ActivityCardProps {
  activity: Activity
  index: number
  status: 'not_started' | 'in_progress' | 'completed'
  statusInfo: { label: string; icon: LucideIcon; color: string; bg: string }
  difficulty: { label: string; color: string; bg: string }
  onClick: () => void
  onComplete: () => void
  trimester: number
}

const categoryConfig: Record<string, { label: string; icon: LucideIcon; tone: string; chip: string }> = {
  exercise: {
    label: 'Olahraga',
    icon: Dumbbell,
    tone: 'from-sky-500/16 via-sky-500/6 to-transparent',
    chip: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
  },
  nutrition: {
    label: 'Nutrisi',
    icon: Salad,
    tone: 'from-emerald-500/16 via-emerald-500/6 to-transparent',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  },
  sleep: {
    label: 'Tidur',
    icon: BedDouble,
    tone: 'from-indigo-500/16 via-indigo-500/6 to-transparent',
    chip: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
  },
  mental: {
    label: 'Mental',
    icon: Brain,
    tone: 'from-fuchsia-500/16 via-fuchsia-500/6 to-transparent',
    chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20',
  },
  checkup: {
    label: 'Pemeriksaan',
    icon: ClipboardPlus,
    tone: 'from-amber-500/16 via-amber-500/6 to-transparent',
    chip: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  },
  bonding: {
    label: 'Bonding',
    icon: HeartHandshake,
    tone: 'from-amber-500/16 via-amber-500/6 to-transparent',
    chip: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  },
}

const defaultCategory = {
  label: 'Aktivitas',
  icon: Sparkles,
  tone: 'from-slate-500/16 via-slate-500/6 to-transparent',
  chip: 'bg-slate-100 text-slate-700 border-slate-200',
}

export const ActivityCard = React.memo(({
  activity,
  index,
  status,
  statusInfo,
  difficulty,
  onClick,
  onComplete,
  trimester,
}: ActivityCardProps) => {
  const isCompleted = status === 'completed'
  const category = categoryConfig[activity.category] || defaultCategory
  const CategoryIcon = category.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div
        className={`group relative cursor-pointer overflow-hidden rounded-[24px] border transition-all duration-300 ${
          isCompleted
            ? 'border-emerald-200/80 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5'
            : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:-translate-y-0.5 hover:border-doccure-teal/40 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]'
        }`}
        onClick={onClick}
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.tone}`} />

        <div className="relative p-7 flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className={`shrink-0 flex h-14 w-14 items-center justify-center rounded-[20px] border shadow-sm ${category.chip} dark:bg-white/5 dark:border-white/10 dark:text-white`}>
                <CategoryIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${category.chip} dark:bg-white/5 dark:border-white/10 dark:text-white/70`}>
                    {category.label}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Trimester {trimester}
                  </span>
                </div>
                <h3 className={`text-2xl font-black leading-tight text-slate-900 dark:text-white tracking-tight ${isCompleted ? 'line-through opacity-50' : ''}`}>
                  {activity.activity_name}
                </h3>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onComplete()
              }}
              className="mt-1 shrink-0 rounded-xl p-2 text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-white/5 hover:text-doccure-teal active:scale-90 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
              aria-label="Tandai selesai"
              title="Tandai selesai"
            >
              {isCompleted ? <SquareCheckBig className="h-6 w-6 text-emerald-500" /> : <Square className="h-6 w-6" />}
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] ${statusInfo.bg} ${statusInfo.color} border border-current opacity-80`}>
              <statusInfo.icon className="h-3.5 w-3.5" />
              {statusInfo.label}
            </div>

            <p className="line-clamp-3 text-[15px] font-medium leading-relaxed text-slate-600 dark:text-slate-400 opacity-90">
              {activity.description}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {activity.duration_minutes > 0 && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 px-3 py-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4 text-doccure-teal" />
                  {activity.duration_minutes}m
                </div>
              )}
              {activity.frequency_per_week > 0 && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 px-3 py-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4 text-doccure-teal" />
                  {activity.frequency_per_week}x/pk
                </div>
              )}
              <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[11px] font-bold ${difficulty.bg} ${difficulty.color}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {difficulty.label}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end border-t border-slate-50 dark:border-white/5 pt-5">
            <Button
              size="sm"
              variant="default"
              className="h-10 px-6 rounded-xl bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-200 text-[12px] font-black uppercase tracking-widest text-white dark:text-slate-900 shadow-md active:scale-95 transition-all group/btn"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
            >
              Lihat Detail
              <ChevronRight className="ml-1.5 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

ActivityCard.displayName = 'ActivityCard'
