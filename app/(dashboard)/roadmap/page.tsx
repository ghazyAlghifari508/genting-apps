'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dumbbell,
  Salad,
  ChevronRight,
  Loader2,
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  PlayCircle,
  Route,
  Flame,
  Star,
  Filter,
  BarChart3
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MagicCard } from '@/components/ui/magic-card'
import { ActivityDetailModal } from '@/components/roadmap/activity-detail-modal'
import { RoadmapProgress } from '@/components/roadmap/roadmap-progress'

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
  xp_reward: number
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
  1: { label: 'Pemula', color: 'text-sea-green', bg: 'bg-sea-green/10 border-sea-green/20' },
  2: { label: 'Menengah', color: 'text-amber-600', bg: 'bg-apricot/10 border-apricot/20' },
  3: { label: 'Lanjutan', color: 'text-grapefruit', bg: 'bg-grapefruit/10 border-grapefruit/20' },
}

const statusConfig = {
  not_started: { label: 'Belum Mulai', icon: Circle, color: 'text-slate-400', bg: 'bg-slate-100' },
  in_progress: { label: 'Sedang Berjalan', icon: PlayCircle, color: 'text-cerulean', bg: 'bg-cerulean/10' },
  completed: { label: 'Selesai', icon: CheckCircle2, color: 'text-sea-green', bg: 'bg-sea-green/10' },
}

type Category = 'exercise' | 'nutrition'
type ViewMode = 'activities' | 'progress'

export default function RoadmapPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<Category>('exercise')
  const [viewMode, setViewMode] = useState<ViewMode>('activities')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [trimester, setTrimester] = useState(1)
  const [pregnancyWeek, setPregnancyWeek] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get pregnancy info
        const { data: profile } = await supabase
          .from('profiles')
          .select('pregnancy_week, due_date')
          .eq('id', user.id)
          .single()

        let week = profile?.pregnancy_week || 0
        if (!week && profile?.due_date) {
          const dueDate = new Date(profile.due_date)
          const today = new Date()
          const diffMs = dueDate.getTime() - today.getTime()
          const weeksLeft = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000))
          week = Math.max(1, 40 - weeksLeft)
        }
        setPregnancyWeek(week)

        // Calculate trimester
        let tri = 1
        if (week > 26) tri = 3
        else if (week > 12) tri = 2
        setTrimester(tri)

        // Load activities
        const { data: acts, error: actsError } = await supabase
          .from('roadmap_activities')
          .select('*')
          .order('difficulty_level', { ascending: true })

        if (actsError) throw actsError
        setActivities(acts || [])

        // Load user progress
        const { data: prog, error: progError } = await supabase
          .from('user_roadmap_progress')
          .select('*')
          .eq('user_id', user.id)

        if (progError) throw progError
        setProgress(prog || [])
      } catch (error: any) {
        console.error('Error loading roadmap data:', {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  const filteredActivities = useMemo(() => {
    return activities.filter(a =>
      a.category === category &&
      a.min_trimester <= trimester &&
      a.max_trimester >= trimester
    )
  }, [activities, category, trimester])

  const getActivityStatus = (activityId: string): 'not_started' | 'in_progress' | 'completed' => {
    const p = progress.find(p => p.activity_id === activityId)
    return (p?.status as 'not_started' | 'in_progress' | 'completed') || 'not_started'
  }

  const completedCount = progress.filter(p => p.status === 'completed').length
  const totalXp = useMemo(() => {
    return progress
      .filter(p => p.status === 'completed')
      .reduce((total, p) => {
        const activity = activities.find(a => a.id === p.activity_id)
        return total + (activity?.xp_reward || 0)
      }, 0)
  }, [progress, activities])

  const streakDays = useMemo(() => {
    const maxStreak = progress.reduce((max, p) => Math.max(max, p.streak_count || 0), 0)
    return maxStreak
  }, [progress])

  const handleComplete = async (activityId: string) => {
    setIsCompleting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const existingProgress = progress.find(p => p.activity_id === activityId)
      const currentStatus = existingProgress?.status || 'not_started'
      const newStatus = currentStatus === 'not_started' ? 'in_progress' : 'completed'

      if (existingProgress) {
        const { error } = await supabase
          .from('user_roadmap_progress')
          .update({
            status: newStatus,
            completion_date: newStatus === 'completed' ? new Date().toISOString() : null,
            streak_count: (existingProgress.streak_count || 0) + 1,
            last_completed_date: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id)

        if (error) throw error

        setProgress(prev => prev.map(p =>
          p.id === existingProgress.id
            ? { ...p, status: newStatus, completion_date: newStatus === 'completed' ? new Date().toISOString() : null, streak_count: (p.streak_count || 0) + 1 }
            : p
        ))
      } else {
        const { data, error } = await supabase
          .from('user_roadmap_progress')
          .insert({
            user_id: user.id,
            activity_id: activityId,
            status: newStatus,
            completion_date: newStatus === 'completed' ? new Date().toISOString() : null,
            streak_count: 1,
            last_completed_date: new Date().toISOString().split('T')[0]
          })
          .select()
          .single()

        if (error) throw error
        if (data) setProgress(prev => [...prev, data])
      }

      // Close modal immediately if completed
      if (newStatus === 'completed') {
        setIsModalOpen(false)
        setSelectedActivity(null)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cerulean border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400">Memuat roadmap...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cerulean/10 flex items-center justify-center">
              <Route className="w-5 h-5 text-cerulean" />
            </div>
            <span className="text-[10px] font-black text-cerulean uppercase tracking-widest">
              Panduan Anti-Stunting
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-2">
            Roadmap <span className="gradient-text">Bunda</span>
          </h1>
          <p className="text-slate-500 font-bold text-base max-w-xl">
            Ikuti aktivitas harian yang dirancang khusus untuk Trimester {trimester} 
            {pregnancyWeek > 0 && ` (Minggu ke-${pregnancyWeek})`} Anda.
          </p>
        </div>

        {/* Trimester Badge */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((t) => (
            <button
              key={t}
              onClick={() => setTrimester(t)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${
                trimester === t
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  : 'bg-white/50 text-slate-400 hover:bg-white hover:text-slate-600 border border-white/50'
              }`}
            >
              TM {t}
            </button>
          ))}
        </div>
      </section>

      {/* Category Toggle + View Mode */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-sm">
          <button
            onClick={() => setCategory('exercise')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${
              category === 'exercise'
                ? 'bg-cerulean text-white shadow-lg shadow-cerulean/20'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            Olahraga
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              category === 'exercise' ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              {activities.filter(a => a.category === 'exercise' && a.min_trimester <= trimester && a.max_trimester >= trimester).length}
            </span>
          </button>
          <button
            onClick={() => setCategory('nutrition')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${
              category === 'nutrition'
                ? 'bg-sea-green text-white shadow-lg shadow-sea-green/20'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Salad className="w-4 h-4" />
            Nutrisi
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              category === 'nutrition' ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              {activities.filter(a => a.category === 'nutrition' && a.min_trimester <= trimester && a.max_trimester >= trimester).length}
            </span>
          </button>
        </div>

        <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-xl border border-white/50 shadow-sm">
          <button
            onClick={() => setViewMode('activities')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              viewMode === 'activities'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Aktivitas
          </button>
          <button
            onClick={() => setViewMode('progress')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              viewMode === 'progress'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Progress
          </button>
        </div>
      </section>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'activities' ? (
          <motion.section
            key="activities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="px-2"
          >
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredActivities.map((activity, index) => {
                  const status = getActivityStatus(activity.id)
                  const statusInfo = statusConfig[status]
                  const difficulty = difficultyConfig[activity.difficulty_level]

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedActivity(activity)
                          setIsModalOpen(true)
                        }}
                      >
                      <MagicCard
                        className={`p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border-white group ${
                          status === 'completed' ? 'opacity-75' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                              category === 'exercise' ? 'bg-cerulean/10' : 'bg-sea-green/10'
                            }`}>
                              {category === 'exercise' 
                                ? <Dumbbell className={`w-7 h-7 ${category === 'exercise' ? 'text-cerulean' : 'text-sea-green'}`} />
                                : <Salad className="w-7 h-7 text-sea-green" />
                              }
                            </div>
                            <div>
                              <h3 className={`text-lg font-black text-slate-900 ${status === 'completed' ? 'line-through' : ''}`}>
                                {activity.activity_name}
                              </h3>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${difficulty.bg} ${difficulty.color}`}>
                                {difficulty.label}
                              </span>
                            </div>
                          </div>

                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusInfo.bg}`}>
                            <statusInfo.icon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                            <span className={`text-[10px] font-black ${statusInfo.color}`}>{statusInfo.label}</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">
                          {activity.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                            {activity.duration_minutes > 0 && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {activity.duration_minutes}m
                              </span>
                            )}
                            {activity.frequency_per_week > 0 && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {activity.frequency_per_week}x/mg
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-cerulean flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              +{activity.xp_reward} XP
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cerulean group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </MagicCard>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center text-center max-w-md mx-auto">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center mb-8">
                  <Route className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">Belum Ada Aktivitas</h3>
                <p className="text-slate-500 font-bold mb-6 leading-relaxed">
                  Data roadmap belum dimuat. Silakan salin dan jalankan isi file <code className="text-cerulean bg-cerulean/5 px-2 py-1 rounded">supabase/roadmap.sql</code> di SQL Editor Supabase Anda untuk memuat data aktivitas.
                </p>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-left">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Penting</p>
                  <p className="text-xs text-amber-700 font-bold leading-relaxed">
                    Fitur Roadmap memerlukan tabel database khusus. Jika Anda melihat pesan ini, kemungkinan tabel tersebut belum dibuat atau masih kosong.
                  </p>
                </div>
              </div>
            )}
          </motion.section>
        ) : (
          <motion.section
            key="progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="px-2"
          >
            <RoadmapProgress
              completedCount={completedCount}
              totalCount={activities.length}
              streakDays={streakDays}
              totalXp={totalXp}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Bottom Stats */}
      {viewMode === 'activities' && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-xl px-6 sm:px-10 py-4 sm:py-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4 sm:gap-8 text-white"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-sea-green" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Selesai</p>
              <p className="text-sm font-black">{completedCount}/{activities.length}</p>
            </div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">XP</p>
              <p className="text-sm font-black">{totalXp}</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-white/10" />

          <div className="hidden sm:flex items-center gap-2">
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Streak</p>
              <p className="text-sm font-black flex items-center gap-1">
                {streakDays} <Flame className="w-4 h-4 text-grapefruit fill-grapefruit" />
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity Detail Modal */}
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
