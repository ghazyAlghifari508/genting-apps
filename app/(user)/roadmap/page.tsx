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
import dynamic from 'next/dynamic'

// Components - Lazy Loaded
const RoadmapHeader = dynamic(() => import('@/components/user/roadmap/RoadmapHeader').then(mod => mod.RoadmapHeader), {
  loading: () => <Skeleton className="h-[200px] w-full rounded-xl" />
})
const CategoryFilters = dynamic(() => import('@/components/user/roadmap/CategoryFilters').then(mod => mod.CategoryFilters), {
  loading: () => <Skeleton className="h-[80px] w-full rounded-xl mt-4" />
})
const RoadmapBoard = dynamic(() => import('@/components/user/roadmap/RoadmapBoard').then(mod => mod.RoadmapBoard), {
  loading: () => <Skeleton className="h-[600px] w-full rounded-xl mt-8" />
})
const RoadmapSidebar = dynamic(() => import('@/components/user/roadmap/RoadmapSidebar').then(mod => mod.RoadmapSidebar), {
  loading: () => <Skeleton className="h-[400px] w-full rounded-xl mt-8" />
})

import { ActivityDetailModal } from '@/components/user/roadmap/activity-detail-modal'
import { Skeleton } from '@/components/ui/skeleton'
import { ActivityCard } from '@/components/user/roadmap/ActivityCard'
import { RoadmapProgress } from '@/components/user/roadmap/roadmap-progress'

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

      <RoadmapHeader todayLabel={todayLabel} />

      <CategoryFilters
        category={category}
        setCategory={setCategory}
        categoryTabs={categoryTabs}
        categoryCounts={categoryCounts}
        trimester={trimester}
        setTrimester={setTrimester}
      />

      <section className="mx-auto max-w-[1400px] px-4 mt-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <RoadmapBoard
              filteredActivities={filteredActivities}
              todayLabel={todayLabel}
              getActivityStatus={getActivityStatus}
              statusConfig={statusConfig}
              difficultyConfig={difficultyConfig}
              defaultDifficulty={defaultDifficulty}
              trimester={trimester}
              setSelectedActivity={setSelectedActivity}
              setIsModalOpen={setIsModalOpen}
              handleComplete={handleComplete}
            />

          <RoadmapSidebar
            pregnancyWeek={pregnancyWeek}
            timelineWeeks={timelineWeeks}
            journal={journal}
            setJournal={setJournal}
            handleSaveJournal={handleSaveJournal}
            journalSaved={journalSaved}
            completedCount={completedCount}
            activitiesCount={activities.length}
            streakDays={streakDays}
            trimester={trimester}
          />
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
