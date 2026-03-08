'use client'

import { motion } from 'framer-motion'
import { Compass, TrendingUp } from 'lucide-react'
import { RoadmapProgress } from './roadmap-progress'

interface RoadmapSidebarProps {
  pregnancyWeek: number
  timelineWeeks: number[]
  journal: string
  setJournal: (val: string) => void
  handleSaveJournal: () => void
  journalSaved: string | null
  completedCount: number
  activitiesCount: number
  streakDays: number
  trimester: number
}

export default function RoadmapSidebar({
  pregnancyWeek,
  timelineWeeks,
  journal,
  setJournal,
  handleSaveJournal,
  journalSaved,
  completedCount,
  activitiesCount,
  streakDays
}: RoadmapSidebarProps) {
  return (
    <aside className="space-y-8 xl:sticky xl:top-24 xl:self-start">
      <div className="rounded-3xl border border-slate-100  bg-white  p-6 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50  rounded-bl-2xl -mr-4 -mt-4 transition-colors" />
         
        <h3 className="text-lg font-bold text-slate-900  flex items-center gap-2 relative z-10">
           <Compass className="h-5 w-5 text-doccure-teal" />
           Timeline Minggu Ini
        </h3>
        <div className="relative mt-8 space-y-4">
          <div className="absolute left-[20px] top-1 h-[calc(100%-12px)] w-px bg-slate-100 " />
          {timelineWeeks.map((week) => {
            const isCurrent = week === pregnancyWeek
            const isPast = week < pregnancyWeek
            return (
              <div key={week} className="relative flex items-center gap-4 group/item">
                <motion.span
                  animate={isCurrent ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`z-10 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm transition-colors ${
                    isCurrent ? 'bg-doccure-teal ring-4 ring-doccure-teal/15' : isPast ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
                <div
                  className={`flex-1 rounded-xl border px-4 py-3 transition-all ${
                    isCurrent
                      ? 'border-doccure-teal/30 bg-doccure-teal/5 text-slate-900  shadow-sm'
                      : isPast
                        ? 'border-emerald-100 bg-emerald-50/50  text-emerald-700 '
                        : 'border-slate-50  bg-slate-50/50  text-slate-400  group-hover/item:border-slate-200 '
                  }`}
                >
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest">Minggu</span>
                     {isCurrent && <span className="bg-doccure-teal text-white text-[9px] font-black px-2 py-0.5 rounded-full">NOW</span>}
                  </div>
                  <p className="text-lg font-black mt-0.5">{week}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div id="roadmap-journal" className="rounded-3xl border border-slate-100 bg-slate-900 p-8 shadow-2xl relative group overflow-hidden">
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
           Catatan Hari Ini
           <div className="h-1.5 w-1.5 rounded-full bg-doccure-yellow animate-pulse" />
        </h3>
        <p className="mt-2 text-sm font-medium text-white/50 leading-relaxed">Penting untuk dibahas saat sesi konsultasi Bunda.</p>

        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder='E.g. "Agak mual pagi ini, tapi tetap konsumsi vitamin..."'
          className="mt-6 h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-doccure-teal focus:bg-white/10 focus:ring-4 focus:ring-doccure-teal/20"
        />

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
             {journalSaved ? (
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Disk tersimpan • {journalSaved}</p>
             ) : (
               <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Menunggu input...</p>
             )}
             <TrendingUp size={12} className="text-white/20" />
          </div>
          <button
            onClick={handleSaveJournal}
            className="h-12 w-full inline-flex items-center justify-center rounded-xl bg-doccure-teal px-6 text-sm font-black text-white hover:bg-doccure-dark shadow-md transition-all active:scale-95"
          >
            Save Logbook
          </button>
        </div>
      </div>

      <div className="bg-white  border border-slate-100  rounded-3xl p-6 shadow-sm overflow-hidden text-center relative">
         <div className="absolute -left-10 -top-10 w-24 h-24 bg-doccure-yellow/10 rounded-full blur-2xl" />
         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 italic">Current Achievement</p>
         <RoadmapProgress
           completedCount={completedCount}
           totalCount={activitiesCount || 10}
           streakDays={streakDays}
         />
      </div>
    </aside>
  )
}
