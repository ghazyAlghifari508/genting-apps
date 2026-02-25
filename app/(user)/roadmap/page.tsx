'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarRange,
  CheckCircle2,
  Circle,
  PlayCircle,
  Route,
  TrendingUp,
  Compass
} from 'lucide-react'
import { getRoadmapActivities, getUserRoadmapProgress, upsertRoadmapProgress } from '@/services/roadmapService'
import { getUserProfile } from '@/services/userService'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ActivityDetailModal } from '@/components/user/roadmap/activity-detail-modal'
import { RoadmapProgress } from '@/components/user/roadmap/roadmap-progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ActivityCard } from '@/components/user/roadmap/ActivityCard'

interface Activity {
  id: string
  activity_name: string
  category: string
  description: string
  benefits: string[]
  difficulty_level: number
  min_trimester: number
  max_trimester: number
  duration_minutes: number
  frequency_per_week: number
  instructions: string[]
  tips: string | null
  warnings: string | null
  icon_name: string
}

interface UserProgress {
  id: string
  user_id: string
  activity_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  completion_date: string | null
  streak_count: number
}

const difficultyConfig: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Ringan', color: 'text-sea-green', bg: 'bg-sea-green/10 border-sea-green/20' },
  2: { label: 'Menengah', color: 'text-amber-600', bg: 'bg-apricot/10 border-apricot/20' },
  3: { label: 'Tinggi', color: 'text-grapefruit', bg: 'bg-grapefruit/10 border-grapefruit/20' },
  4: { label: 'Tinggi', color: 'text-grapefruit', bg: 'bg-grapefruit/10 border-grapefruit/20' },
  5: { label: 'Tinggi', color: 'text-grapefruit', bg: 'bg-grapefruit/10 border-grapefruit/20' },
}

const defaultDifficulty = { label: 'Umum', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-100' }

const statusConfig = {
  not_started: { label: 'Belum Mulai', icon: Circle, color: 'text-slate-500', bg: 'bg-slate-100' },
  in_progress: { label: 'Berjalan', icon: PlayCircle, color: 'text-cerulean', bg: 'bg-cerulean/10' },
  completed: { label: 'Selesai', icon: CheckCircle2, color: 'text-sea-green', bg: 'bg-sea-green/10' },
}

type CategoryFilter = 'all' | 'exercise' | 'nutrition'

const categoryTabs: Array<{ key: CategoryFilter; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'exercise', label: 'Olahraga' },
  { key: 'nutrition', label: 'Nutrisi' },
]


export default function RoadmapPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [trimester, setTrimester] = useState(1)
  const [pregnancyWeek, setPregnancyWeek] = useState(0)
  const [journal, setJournal] = useState('')
  const [journalSaved, setJournalSaved] = useState<string | null>(null)

  const { user, loading: authLoading } = useAuth()

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) return

    const loadData = async () => {
      try {
        const profile = await getUserProfile(user.id)

        let week = profile?.pregnancy_week || 0
        if (!week && profile?.due_date) {
          const dueDate = new Date(profile.due_date)
          const today = new Date()
          const diffMs = dueDate.getTime() - today.getTime()
          const weeksLeft = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000))
          week = Math.max(1, 40 - weeksLeft)
        }
        setPregnancyWeek(week)

        let tri = 1
        if (week > 26) tri = 3
        else if (week > 12) tri = 2
        setTrimester(tri)

        const [acts, prog] = await Promise.all([
          getRoadmapActivities(),
          getUserRoadmapProgress(user.id),
        ])

        setActivities(acts || [])
        setProgress(prog || [])
      } catch (error) {
        console.error('Error loading roadmap data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, authLoading])

  const eligibleActivities = useMemo(() => {
    return activities.filter(a => a.min_trimester <= trimester && a.max_trimester >= trimester)
  }, [activities, trimester])

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      all: eligibleActivities.length,
      exercise: 0,
      nutrition: 0,
    }

    for (const activity of eligibleActivities) {
      if (activity.category === 'exercise') counts.exercise += 1
      if (activity.category === 'nutrition') counts.nutrition += 1
    }

    return counts
  }, [eligibleActivities])

  const filteredActivities = useMemo(() => {
    if (category === 'all') return eligibleActivities
    return eligibleActivities.filter(a => a.category === category)
  }, [eligibleActivities, category])

  const getActivityStatus = (activityId: string): 'not_started' | 'in_progress' | 'completed' => {
    const p = progress.find(p => p.activity_id === activityId)
    return (p?.status as 'not_started' | 'in_progress' | 'completed') || 'not_started'
  }

  const completedCount = progress.filter(p => p.status === 'completed').length

  const streakDays = useMemo(() => {
    const maxStreak = progress.reduce((max, p) => Math.max(max, p.streak_count || 0), 0)
    return maxStreak
  }, [progress])

  const handleComplete = async (activityId: string) => {
    setIsCompleting(true)
    try {
      if (!user) return

      const existingProgress = progress.find(p => p.activity_id === activityId)
      if (existingProgress?.status === 'completed') return

      const updated = await upsertRoadmapProgress({
        user_id: user.id,
        activity_id: activityId,
        status: 'completed',
        completion_date: new Date().toISOString(),
        streak_count: (existingProgress?.streak_count || 0) + 1,
        last_completed_date: new Date().toISOString().split('T')[0],
      })

      if (existingProgress) {
        setProgress(prev => prev.map(p => p.id === existingProgress.id ? updated : p))
      } else {
        setProgress(prev => [...prev, updated])
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleSaveJournal = () => {
    if (!user) return
    const key = `roadmap_journal_${user.id}_${new Date().toISOString().slice(0, 10)}`
    localStorage.setItem(key, journal)
    setJournalSaved(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
  }

  const timelineWeeks = useMemo(() => {
    const center = Math.max(1, pregnancyWeek || 24)
    return [center - 2, center - 1, center, center + 1, center + 2].map(w => Math.max(1, w))
  }, [pregnancyWeek])

  const statusTone = (status: 'not_started' | 'in_progress' | 'completed') => {
    if (status === 'completed') return 'bg-emerald-500'
    if (status === 'in_progress') return 'bg-sky-500'
    return 'bg-slate-300 dark:bg-slate-700'
  }

  if (loading) {
    return (
      <div className="pb-32 text-slate-900 relative">
        <section className="w-full bg-white border-b border-slate-100 relative overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-32 rounded-lg" />
                  <Skeleton className="h-6 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-96 rounded-xl" />
                <Skeleton className="h-6 w-64 rounded-xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 -mt-10 sm:px-6 lg:px-8 relative z-30">
          <div className="rounded-[32px] border border-slate-200/50 bg-white/80 p-5 shadow-[0_24px_54px_rgba(15,23,42,0.1)] backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24 rounded-2xl" />
                <Skeleton className="h-10 w-24 rounded-2xl" />
                <Skeleton className="h-10 w-24 rounded-2xl" />
              </div>
              <Skeleton className="h-12 w-48 rounded-2xl" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 mt-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-[40px] border border-slate-100 bg-white p-6 shadow-sm md:p-10">
              <div className="flex justify-between items-end border-b border-slate-100 pb-8">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-10 w-64 rounded-xl" />
                </div>
                <Skeleton className="h-12 w-48 rounded-2xl" />
              </div>
              <div className="mt-16 space-y-16">
                {[1, 2, 3].map(i => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] items-center gap-8">
                    <div className={i % 2 === 0 ? 'invisible' : ''}>
                      <Skeleton className="h-48 w-full rounded-[32px]" />
                    </div>
                    <div className="flex justify-center">
                      <Skeleton className="h-14 w-14 rounded-3xl" />
                    </div>
                    <div className={i % 2 !== 0 ? 'invisible' : ''}>
                      <Skeleton className="h-48 w-full rounded-[32px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="space-y-8">
              <Skeleton className="h-96 w-full rounded-[36px]" />
              <Skeleton className="h-80 w-full rounded-[36px]" />
              <Skeleton className="h-48 w-full rounded-[36px]" />
            </aside>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pb-32 text-slate-900 relative">
      {/* Abstract Background Accents */}
      <div className="absolute top-[20%] -left-32 w-96 h-96 bg-doccure-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] -right-32 w-80 h-80 bg-doccure-yellow/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Slim Professional Header */}
      <section className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
        {/* Subtle decorative motif */}
        <div className="absolute top-0 right-0 w-64 h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #227c9d 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{todayLabel}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none transition-colors">
                Roadmap <span className="text-doccure-teal italic relative inline-block">
                  1000 HPK
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg transition-colors">
                Peta jalan harian adaptif untuk tumbuh kembang optimal Bunda & Si Kecil.
              </p>
            </motion.div>

            <div className="hidden lg:block w-32" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 -mt-10 sm:px-6 lg:px-8 relative z-30">
        <div className="rounded-[32px] border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 shadow-[0_24px_54px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCategory(tab.key)}
                  className={`inline-flex items-center gap-3 rounded-2xl border px-5 py-3 text-xs font-bold transition-all duration-300 ${
                    category === tab.key
                      ? 'border-doccure-teal bg-doccure-teal text-white shadow-lg shadow-doccure-teal/20 active:scale-95'
                      : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <span className="tracking-wide">{tab.label}</span>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${
                      category === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {categoryCounts[tab.key]}
                  </span>
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 p-1.5">
              {[1, 2, 3].map((t) => (
                <button
                  key={t}
                  onClick={() => setTrimester(t)}
                  className={`h-11 rounded-xl px-5 text-[11px] font-black uppercase tracking-[0.1em] transition-all ${
                    trimester === t
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-white/5'
                  }`}
                >
                  TM {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 mt-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div id="roadmap-activities" className="rounded-[40px] border border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm md:p-10 relative overflow-hidden">
            {/* Subtle Texture Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-1.5 w-6 rounded-full bg-doccure-teal" />
                   <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Roadmap Board</p>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Aktivitas Hari Ini</h2>
              </div>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-5 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm transition-all hover:bg-white dark:hover:bg-white/10">
                <CalendarRange className="h-4 w-4 text-doccure-teal" />
                {todayLabel}
              </div>
            </div>

            {filteredActivities.length > 0 ? (
              <div className="relative mt-16 px-4 md:px-8">
                {/* Timeline Connector Line - Hidden on small screens for vertical layout */}
                <div className="absolute left-[2.5rem] md:left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-slate-100 dark:bg-white/5" />
                
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
                        {/* Position for Desktop/Mobile Consistency */}
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

                        {/* Interactive Timeline Pin */}
                        <div className="order-1 md:order-2 flex justify-start md:justify-center relative">
                           <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className={`z-10 flex h-14 w-14 items-center justify-center rounded-3xl border-4 border-white dark:border-slate-800 shadow-2xl ${statusTone(status)} text-white transition-all`}
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
              <div className="mt-12 rounded-[40px] border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 py-24 text-center group">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-[32px] bg-white dark:bg-slate-900 text-slate-200 dark:text-slate-700 shadow-sm border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-500 mb-8">
                   <Route size={40} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Kustomisasi Roadmap...</h3>
                <p className="mt-4 mx-auto max-w-sm text-lg font-medium text-slate-500 leading-relaxed">
                  Bunda, silakan lengkapi profil kehamilan Anda agar sistem dapat menyusun rencana harian yang paling tepat.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/profile"
                    className="h-14 inline-flex items-center justify-center rounded-2xl bg-doccure-teal px-10 text-base font-black text-white hover:bg-doccure-dark shadow-xl shadow-doccure-teal/20 transition-all active:scale-95"
                  >
                    Lengkapi Profil Bunda
                  </Link>
                </div>
              </div>
            )}
            
            {/* Visual Footer Accent */}
            <div className="mt-20 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
               <div className="h-px w-12 bg-slate-100" />
               Validated for Trimester {trimester} Science
               <div className="h-px w-12 bg-slate-100" />
            </div>
          </div>

            <aside className="space-y-8 xl:sticky xl:top-24 xl:self-start">
            {/* Remaining empty space for layout balance */}

            <div className="rounded-[36px] border border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-bl-[60px] -mr-4 -mt-4 transition-colors" />
               
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 relative z-10">
                 <Compass className="h-5 w-5 text-doccure-teal" />
                 Timeline Minggu Ini
              </h3>
              <div className="relative mt-8 space-y-4">
                <div className="absolute left-[20px] top-1 h-[calc(100%-12px)] w-px bg-slate-100 dark:bg-white/5" />
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
                        className={`flex-1 rounded-[20px] border px-4 py-3 transition-all ${
                          isCurrent
                            ? 'border-doccure-teal/30 bg-doccure-teal/5 text-slate-900 dark:text-white shadow-sm'
                            : isPast
                              ? 'border-emerald-100 bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              : 'border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-400 dark:text-slate-500 group-hover/item:border-slate-200 dark:group-hover/item:border-white/10'
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

            <div id="roadmap-journal" className="rounded-[36px] border border-slate-100 bg-slate-900 p-8 shadow-2xl relative group overflow-hidden">
              {/* Pattern Elemental Accent */}
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

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-[36px] p-6 shadow-sm overflow-hidden text-center relative">
               <div className="absolute -left-10 -top-10 w-24 h-24 bg-doccure-yellow/10 rounded-full blur-2xl" />
               <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 italic">Current Achievement</p>
               <RoadmapProgress
                 completedCount={completedCount}
                 totalCount={activities.length || 10}
                 streakDays={streakDays}
               />
            </div>
          </aside>
        </div>
      </section>

      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedActivity(null)
        }}
        onComplete={handleComplete}
        status={selectedActivity ? getActivityStatus(selectedActivity.id) : 'not_started'}
        isLoading={isCompleting}
      />
    </div>
  )
}
