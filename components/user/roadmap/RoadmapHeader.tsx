'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import type { RoadmapActivity, UserRoadmapProgress } from '@/types/roadmap'

interface RoadmapHeaderProps {
  pregnancyWeek: number
  trimester: number
  progress: UserRoadmapProgress[]
  activities: RoadmapActivity[]
}

export function RoadmapHeader({ pregnancyWeek, trimester, progress, activities }: RoadmapHeaderProps) {
  const completedCount = progress.filter(p => p.status === 'completed' && activities.some(a => a.id === p.activity_id)).length
  const totalCount = activities.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <section className="w-full bg-white  border-b border-slate-100  relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-64 h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #227c9d 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Badge className="rounded-xl border-none bg-doccure-teal/10 text-doccure-teal font-black px-4 py-1.5 text-xs">
                MINGGU {pregnancyWeek}
              </Badge>
              <Badge className="rounded-xl border-none bg-amber-500/10 text-amber-500 font-black px-4 py-1.5 text-xs">
                TRIMESTER {trimester}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900  leading-none">
              Roadmap <span className="text-doccure-teal italic relative inline-block">
                1000 HPK
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-slate-500  font-medium max-w-lg">
              Peta jalan harian adaptif untuk tumbuh kembang optimal Bunda & Si Kecil.
            </p>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Aktivitas Selesai</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-900 ">{percentage}%</span>
                <div className="h-8 w-[2px] bg-slate-100 hidden sm:block mx-2" />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-900  leading-tight">{completedCount}/{totalCount}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Aktivitas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
