'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { EducationContent } from '@/types/education'

interface TodayHighlightProps {
  content: EducationContent | null
  currentDay: number
  onReadMore: (day: number) => void
}

export const TodayHighlight = React.memo(({ content, currentDay, onReadMore }: TodayHighlightProps) => {
  if (!content) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className="relative overflow-hidden rounded-[28px] border border-doccure-teal/20 bg-[linear-gradient(145deg,#e1f4ef_0%,#f2faf7_50%,#ffffff_100%)] shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full border border-doccure-teal/20" />
        <div className="pointer-events-none absolute -right-16 -top-14 h-52 w-52 rounded-full bg-doccure-teal/15 blur-3xl" />

        <div className="relative grid gap-4 p-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-center md:p-6">
          <div className="rounded-3xl border border-doccure-teal/25 bg-white/70 p-4 text-center backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-doccure-teal">Day</p>
            <p className="mt-2 text-6xl font-bold leading-none text-slate-900">{currentDay}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">Pilihan personal hari ini</p>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-doccure-teal" />
              Daily Highlight
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">
              {content.title}
            </h2>
            <p className="max-w-3xl text-sm font-medium leading-relaxed text-slate-600 md:text-base">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {content.tags && content.tags.length > 0 ? (
                content.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="rounded-xl border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-500">
                    #{tag.replace('#', '')}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="rounded-xl border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-500">
                  #EdukasiGenting
                </Badge>
              )}
            </div>

            <Button
              size="lg"
              onClick={() => onReadMore(content.day)}
              className="h-10 rounded-xl bg-doccure-teal px-5 text-sm font-semibold text-white transition-colors hover:bg-doccure-dark"
            >
              Baca Panduan Lengkap
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
})

TodayHighlight.displayName = 'TodayHighlight'
