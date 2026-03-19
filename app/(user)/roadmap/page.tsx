'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  CheckCircle2,
  Clock,
  LucideIcon,
  Zap,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { usePregnancyData } from '@/hooks/usePregnancyData'
import { upsertRoadmapProgress } from '@/services/roadmapService'
import type { RoadmapActivity } from '@/types/roadmap'
import dynamic from 'next/dynamic'
import confetti from 'canvas-confetti'

// Components - Lazy Loaded
const RoadmapHeader = dynamic(() => import('@/components/user/roadmap/RoadmapHeader').then(mod => mod.RoadmapHeader))
const CategoryFilters = dynamic(() => import('@/components/user/roadmap/CategoryFilters').then(mod => mod.CategoryFilters))
const RoadmapBoard = dynamic(() => import('@/components/user/roadmap/RoadmapBoard').then(mod => mod.RoadmapBoard))
const RoadmapSidebar = dynamic(() => import('@/components/user/roadmap/RoadmapSidebar'))
const ActivityDetailModal = dynamic(() => import('@/components/user/roadmap/activity-detail-modal').then(mod => ({ default: mod.ActivityDetailModal })))

type CategoryFilter = 'all' | 'exercise' | 'nutrition'

const statusConfig: Record<string, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  not_started: { label: 'Belum Mulai', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-100' },
  in_progress: { label: 'Sedang Jalan', icon: Zap, color: 'text-sky-500', bg: 'bg-sky-50' },
  completed: { label: 'Selesai!', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
}

const difficultyConfig: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Mudah', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  2: { label: 'Sedang', color: 'text-amber-600', bg: 'bg-amber-50' },
  3: { label: 'Tantangan', color: 'text-rose-600', bg: 'bg-rose-50' },
}

const defaultDifficulty = { label: 'Sedang', color: 'text-slate-600', bg: 'bg-slate-50' }

export default function RoadmapPage() {
  const { profile, loading: dataLoading, roadmap, loadRoadmap, saveDailyJournal, getDailyJournal } = usePregnancyData()
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [currentTrimester, setCurrentTrimester] = useState(profile?.trimester || 1)
  const [journal, setJournal] = useState('')
  const [journalSaved, setJournalSaved] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<RoadmapActivity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (profile) {
      const fetchJournal = async () => {
        const today = new Date().toISOString().slice(0, 10)
        const key = `roadmap_journal_${profile.id}_${today}`
        
        // 1. Cek LocalStorage dulu (cepat)
        const local = localStorage.getItem(key)
        if (local) setJournal(local)

        // 2. Tarik dari DB (sumber kebenaran)
        try {
          const dbJournal = await getDailyJournal(profile.id, today)
          if (dbJournal?.content) {
            setJournal(dbJournal.content)
            localStorage.setItem(key, dbJournal.content)
          }
        } catch (error) {
          console.warn('Sync journal error:', error)
        }
      }
      fetchJournal()
    }
  }, [profile, getDailyJournal])

  useEffect(() => {
    // Rely on Provider's internal guard to prevent loops
    // We add roadmap.activities.length back to the dependency array to satisfy React's 
    // hook size check during dev, but our logic ignores it.
    if (profile && !dataLoading && !roadmap.loading) {
      loadRoadmap()
    }
  }, [profile, dataLoading, roadmap.activities.length, roadmap.loading, loadRoadmap])

  const activities = roadmap.activities
  const progress = roadmap.progress
  const pregnancyWeek = profile?.pregnancy_week || 0

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchTrimester = act.min_trimester <= currentTrimester && act.max_trimester >= currentTrimester
      const matchCategory = category === 'all' || act.category === category
      return matchTrimester && matchCategory
    })
  }, [activities, currentTrimester, category])

  const getActivityStatus = useCallback((id: string) => {
    const actProgress = progress.find((p) => p.activity_id === id)
    return actProgress?.status || 'not_started'
  }, [progress])

  const handleComplete = async (activityId: string) => {
    if (!profile) return
    try {
      const existingProg = progress.find((p) => p.activity_id === activityId)
      if (existingProg?.status === 'completed') return

      await upsertRoadmapProgress({
        user_id: profile.id,
        activity_id: activityId,
        status: 'completed',
        completion_date: new Date().toISOString(),
        streak_count: (existingProg?.streak_count || 0) + 1,
        last_completed_date: new Date().toISOString().split('T')[0],
      })
      
      await loadRoadmap(true)
      
      // Edutainment: Confetti Burst!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#007E85', '#FFB800', '#FF5B5B', '#48BB78'],
        zIndex: 9999
      })

      toast({ title: 'Aktivitas selesai!', description: 'Bagus Bunda, teruskan kebiasaan sehat ini ya.' })
    } catch (error) {
      console.error('Error completing activity:', error)
      toast({ title: 'Oops!', description: 'Gagal memperbarui aktivitas.', variant: 'destructive' })
    }
  }

  const handleSaveJournal = async () => {
    if (!profile) return
    const today = new Date().toISOString().split('T')[0]
    const key = `roadmap_journal_${profile.id}_${today}`

    try {
      await saveDailyJournal({
        user_id: profile.id,
        content: journal,
        date: today
      })
      // Always sync to local storage on success too
      localStorage.setItem(key, journal)
      setJournalSaved(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
      toast({ title: 'Jurnal disimpan', description: 'Catatan Bunda telah aman tersimpan di database.' })
    } catch (error) {
      console.error('Error saving journal to DB:', error)
      // Fallback to localStorage if service/table fails
      localStorage.setItem(key, journal)
      setJournalSaved(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
      toast({ title: 'Jurnal disimpan (Lokal)', description: 'Tersimpan lokal karena kendala koneksi.' })
    }
  }

  if ((dataLoading || roadmap.loading) && roadmap.activities.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen pb-24 pt-0 transition-colors">
        {/* Header Skeleton */}
        <div className="w-full bg-white border-b border-slate-100 p-10">
          <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-12 w-96 rounded-2xl" />
              <Skeleton className="h-6 w-64 rounded-xl" />
            </div>
            <div className="flex gap-4 items-center">
              <Skeleton className="h-20 w-48 rounded-3xl" />
              <Skeleton className="h-20 w-48 rounded-3xl" />
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="mt-8 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-4 flex justify-between items-center">
            <div className="flex gap-4">
               <Skeleton className="h-10 w-24 rounded-xl" />
               <Skeleton className="h-10 w-24 rounded-xl" />
               <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>
        </div>

        <div className="mt-12 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
              <div className="flex justify-between items-end mb-8">
                <Skeleton className="h-8 w-64 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 w-full rounded-3xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-96 w-full rounded-[36px]" />
            <Skeleton className="h-64 w-full rounded-[36px]" />
          </div>
        </div>
      </div>
    )
  }

  const todayLabel = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
  const currentTrimesterActivities = activities.filter(a => 
    a.min_trimester <= currentTrimester && a.max_trimester >= currentTrimester
  )
  const categoryCounts = {
    all: currentTrimesterActivities.length,
    exercise: currentTrimesterActivities.filter(a => a.category === 'exercise').length,
    nutrition: currentTrimesterActivities.filter(a => a.category === 'nutrition').length
  }
  
  // Create a 5-week sliding window centered on the current pregnancy week
  const startWeek = Math.max(1, pregnancyWeek - 2)
  const timelineWeeks = Array.from({length: 5}, (_, i) => startWeek + i).filter(w => w <= 40)
  
  const completedCount = progress.filter(p => p.status === 'completed' && currentTrimesterActivities.some(a => a.id === p.activity_id)).length
  const maxStreak = progress.length > 0 ? Math.max(...progress.map(p => p.streak_count || 0)) : 0

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-0">
      <RoadmapHeader 
        pregnancyWeek={pregnancyWeek} 
        trimester={currentTrimester} 
        progress={progress} 
        activities={currentTrimesterActivities}
      />
      
      <CategoryFilters 
        category={category}
        setCategory={setCategory}
        categoryTabs={[
          { key: 'all', label: 'Semua' },
          { key: 'exercise', label: 'Olahraga' },
          { key: 'nutrition', label: 'Nutrisi' }
        ]}
        categoryCounts={categoryCounts}
        trimester={currentTrimester}
        setTrimester={setCurrentTrimester}
      />

      <div className="mt-12 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
           <RoadmapBoard 
              filteredActivities={filteredActivities}
              todayLabel={todayLabel}
              getActivityStatus={getActivityStatus}
              statusConfig={statusConfig}
              difficultyConfig={difficultyConfig}
              defaultDifficulty={defaultDifficulty}
              trimester={currentTrimester}
              setSelectedActivity={setSelectedActivity}
              setIsModalOpen={setIsModalOpen}
              handleComplete={handleComplete}
           />
        </div>
        
        <div className="lg:col-span-1">
           <RoadmapSidebar 
             pregnancyWeek={pregnancyWeek}
             timelineWeeks={timelineWeeks}
             journal={journal}
             setJournal={setJournal}
             handleSaveJournal={handleSaveJournal}
             journalSaved={journalSaved}
             completedCount={completedCount}
             activitiesCount={currentTrimesterActivities.length}
             streakDays={maxStreak}
             trimester={currentTrimester}
           />
        </div>
      </div>

      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={async (id) => {
          await handleComplete(id)
          setIsModalOpen(false)
        }}
        status={selectedActivity ? getActivityStatus(selectedActivity.id) : 'not_started'}
        isLoading={roadmap.loading}
      />
    </div>
  )
}

