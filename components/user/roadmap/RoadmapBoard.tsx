'use client'

import { motion } from 'framer-motion'
import { CalendarRange, Route, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { ActivityCard } from './ActivityCard'
import React from 'react'
import type { RoadmapActivity } from '@/types/roadmap'

interface RoadmapBoardProps {
  filteredActivities: RoadmapActivity[]
  todayLabel: string
  getActivityStatus: (id: string) => 'not_started' | 'in_progress' | 'completed'
  statusConfig: Record<string, { label: string; icon: LucideIcon; color: string; bg: string }>
  difficultyConfig: Record<number, { label: string; color: string; bg: string }>
  defaultDifficulty: { label: string; color: string; bg: string }
  trimester: number
  setSelectedActivity: (activity: RoadmapActivity) => void
  setIsModalOpen: (val: boolean) => void
  handleComplete: (id: string) => void
}

export function RoadmapBoard({
  filteredActivities,
  todayLabel,
  getActivityStatus,
  statusConfig,
  difficultyConfig,
  defaultDifficulty,
  trimester,
  setSelectedActivity,
  setIsModalOpen,
  handleComplete
}: RoadmapBoardProps) {
  const statusTone = (status: string) => {
    if (status === 'completed') return 'bg-emerald-500'
    if (status === 'in_progress') return 'bg-sky-500'
    return 'bg-slate-300 '
  }

  return (
    <div id="roadmap-activities" className="rounded-2xl border border-slate-100  bg-white  p-6 shadow-sm md:p-10 relative overflow-hidden">
      {/* Subtle Texture Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="h-1.5 w-6 rounded-full bg-doccure-teal" />
             <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Roadmap Board</p>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 ">Aktivitas Hari Ini</h2>
        </div>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-100  bg-slate-50  px-5 py-3 text-xs font-bold text-slate-600  shadow-sm transition-all hover:bg-white ">
          <CalendarRange className="h-4 w-4 text-doccure-teal" />
          {todayLabel}
        </div>
      </div>

      {filteredActivities.length > 0 ? (
        <div className="relative mt-16 px-4 md:px-8">
          {/* Timeline Connector Line */}
          <div className="absolute left-[2.5rem] md:left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-slate-100 " />
          
          <div className="relative space-y-16">
            {filteredActivities.map((activity, index) => {
              const status = getActivityStatus(activity.id)
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] items-center gap-8`}
                >
                  <div className={`order-2 md:order-1 ${isEven ? 'block' : 'hidden md:block'}`}>
                     {isEven && (
                        <ActivityCard
                          activity={activity}
                          index={index}
                          status={status}
                          statusInfo={statusConfig[status]}
                          difficulty={difficultyConfig[activity.difficulty_level] || defaultDifficulty}
                          trimester={trimester}
                          onClick={() => {
                            setSelectedActivity(activity)
                            setIsModalOpen(true)
                          }}
                          onComplete={() => handleComplete(activity.id)}
                        />
                     )}
                  </div>

                  <div className="order-1 md:order-2 flex justify-start md:justify-center relative">
                     <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`z-10 flex h-14 w-14 items-center justify-center rounded-3xl border-4 border-white  shadow-2xl ${statusTone(status)} text-white transition-all`}
                     >
                        <span className="font-black text-xl">{index + 1}</span>
                     </motion.div>
                     {status === 'in_progress' && (
                       <div className="absolute inset-0 h-14 w-14 rounded-3xl bg-sky-500 animate-ping opacity-20" />
                     )}
                  </div>

                  <div className={`order-3 ${!isEven ? 'block' : 'hidden md:block'}`}>
                     {!isEven && (
                        <ActivityCard
                          activity={activity}
                          index={index}
                          status={status}
                          statusInfo={statusConfig[status]}
                          difficulty={difficultyConfig[activity.difficulty_level] || defaultDifficulty}
                          trimester={trimester}
                          onClick={() => {
                            setSelectedActivity(activity)
                            setIsModalOpen(true)
                          }}
                          onComplete={() => handleComplete(activity.id)}
                        />
                     )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mt-12 rounded-3xl border border-dashed border-slate-200  bg-slate-50/50  py-24 text-center group">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-slate-200 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500 mb-8">
             <Route size={40} />
          </div>
          <h3 className="text-3xl font-black text-slate-900  tracking-tight">Kustomisasi Roadmap...</h3>
          <p className="mt-4 mx-auto max-w-sm text-lg font-medium text-slate-500 leading-relaxed">
            Bunda, silakan lengkapi profil kehamilan Anda agar sistem dapat menyusun rencana harian yang paling tepat.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/profile"
              className="h-14 inline-flex items-center justify-center rounded-2xl bg-doccure-teal px-10 text-base font-black text-white hover:bg-doccure-dark shadow-md transition-all active:scale-95"
            >
              Lengkapi Profil Bunda
            </Link>
          </div>
        </div>
      )}
      
      <div className="mt-20 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
         <div className="h-px w-12 bg-slate-100" />
         Validated for Trimester {trimester} Science
         <div className="h-px w-12 bg-slate-100" />
      </div>
    </div>
  )
}
