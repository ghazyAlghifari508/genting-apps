'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Calendar,
  List,
  Search,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import {
  Phase,
  EducationContent,
  UserProfile,
} from '@/types/education'
import {
  getAllEducationContent,
  getUserProgress,
  toggleFavoriteStatus,
  getProgressStats,
} from '@/services/educationService'
import { getUserProfile } from '@/services/userService'

import { TodayHighlight } from '@/components/user/education/TodayHighlight'
import { SidebarStats } from '@/components/user/education/SidebarStats'
import { PaginationUI } from '@/components/shared/pagination-ui'
import { PhaseFilter } from '@/components/user/education/PhaseFilter'
import { EducationSearchBar } from '@/components/user/education/EducationSearchBar'
import { TimelineView } from '@/components/user/education/TimelineView'
import { EducationCard } from '@/components/user/education/EducationCard'
import { EducationCalendarView } from '@/components/user/education/EducationCalendarView'

type ViewMode = 'timeline' | 'grid' | 'calendar'

export default function Education() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [contents, setContents] = useState<EducationContent[]>([])
  const [readDays, setReadDays] = useState<Set<number>>(new Set())
  const [favoriteDays, setFavoriteDays] = useState<Set<number>>(new Set())
  const [stats, setStats] = useState({ total_read: 0, total_favorite: 0, progress_percentage: 0 })
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'all'>('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [showRead, setShowRead] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30

  useEffect(() => {
    async function init() {
      if (authLoading) return
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      try {
        const [profile, allContent, progress, progressStats] = await Promise.all([
          getUserProfile(user.id),
          getAllEducationContent(),
          getUserProgress(user.id),
          getProgressStats(user.id)
        ])

        setUserData(profile)
        const sanitizedContent = (allContent || []).map(c => ({
          ...c,
          tags: c.tags || [],
          tips: c.tips || [],
        }))
        setContents(sanitizedContent)

        const read = new Set<number>()
        const fav = new Set<number>()
        ;(progress || []).forEach(p => {
          if (p.is_read) read.add(p.day)
          if (p.is_favorite) fav.add(p.day)
        })
        setReadDays(read)
        setFavoriteDays(fav)

        if (progressStats) setStats(progressStats)
      } catch {
        // Error loading education data
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [user, authLoading, router])

  const filteredContents = useMemo(() => {
    let result = [...contents]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags?.some(t => t.toLowerCase().includes(q))
      )
    }
    if (selectedPhase !== 'all') {
      result = result.filter(c => c.phase === selectedPhase)
    }
    if (showFavorites) {
      result = result.filter(c => favoriteDays.has(c.day))
    }
    if (showRead) {
      result = result.filter(c => readDays.has(c.day))
    }
    return result
  }, [contents, searchQuery, selectedPhase, showFavorites, showRead, favoriteDays, readDays])

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage)
  const paginatedContents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredContents.slice(start, start + itemsPerPage)
  }, [filteredContents, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedPhase, showFavorites, showRead])

  const todayContent = useMemo(() => {
    if (!userData) return null
    return contents.find(c => c.day === (userData?.current_day || 1)) || null
  }, [userData, contents])

  const handleCardClick = (day: number) => {
    router.push(`/education/${day}`)
  }

  const handleFavorite = async (day: number) => {
    if (!userId) return
    const isCurrentlyFavorite = favoriteDays.has(day)
    try {
      await toggleFavoriteStatus(userId, day, !isCurrentlyFavorite)
      setFavoriteDays(prev => {
        const next = new Set(prev)
        if (isCurrentlyFavorite) next.delete(day)
        else next.add(day)
        return next
      })
      const progressStats = await getProgressStats(userId)
      if (progressStats) setStats(progressStats)
    } catch {
      // Error toggling favorite
    }
  }

  if (loading) {
    return (
      <div className="space-y-12 pb-32 text-slate-900 dark:text-white relative transition-colors duration-300">
        <section className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
          <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 rounded-lg mb-4" />
                <Skeleton className="h-10 w-64 rounded-xl" />
                <Skeleton className="h-4 w-96 rounded-full mt-2" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-6">
              <Skeleton className="h-48 rounded-[32px]" />
              <Skeleton className="h-96 rounded-[32px]" />
            </aside>
            <div className="space-y-6">
              <Skeleton className="h-14 w-full rounded-[20px]" />
              <Skeleton className="h-[400px] rounded-[40px]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-[28px]" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header Section - Aligned with Roadmap Style */}
      <section className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pusat Pengetahuan</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Edukasi <span className="text-doccure-teal italic relative inline-block">
                  1000 HPK
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">
                Bekalkan diri dengan pengetahuan tepat untuk tumbuh kembang optimal Bunda & Si Kecil.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 mt-12 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <SidebarStats readCount={stats.total_read} totalDays={1000} />

            <PhaseFilter
              selectedPhase={selectedPhase}
              onPhaseChange={setSelectedPhase}
              showFavorites={showFavorites}
              onFavoritesChange={setShowFavorites}
              showRead={showRead}
              onReadChange={setShowRead}
            />
          </aside>

          <div className="space-y-6">
            <EducationSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari panduan MPASI, nutrisi, atau aktivitas..."
            />

            {!searchQuery && selectedPhase === 'all' && todayContent && (
              <div className="relative group">
                <div className="absolute inset-0 bg-doccure-teal/5 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <TodayHighlight
                  content={todayContent}
                  currentDay={userData?.current_day || 1}
                  onReadMore={handleCardClick}
                />
              </div>
            )}

            <div className="space-y-6 rounded-[40px] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-4 shadow-sm md:p-6 relative overflow-hidden transition-colors duration-300">
              {/* Background Texture Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
              
              <div className="flex flex-col items-start justify-between gap-4 rounded-[28px] border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 p-3 sm:flex-row sm:items-center relative z-10">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full sm:w-auto">
                  <TabsList className="h-12 w-full rounded-[20px] bg-white dark:bg-white/5 p-1.5 sm:w-auto shadow-inner">
                    <TabsTrigger value="grid" className="h-full gap-2 rounded-[16px] px-6 text-xs font-black uppercase tracking-wider data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-slate-900 transition-all">
                      <List className="h-4 w-4" />
                      Gallery
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="h-full gap-2 rounded-[16px] px-6 text-xs font-black uppercase tracking-wider data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-slate-900 transition-all">
                      <BookOpen className="h-4 w-4" />
                      History
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="h-full gap-2 rounded-[16px] px-6 text-xs font-black uppercase tracking-wider data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-slate-900 transition-all">
                      <Calendar className="h-4 w-4" />
                      Plan
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Ditemukan {filteredContents.length} Materi
                </p>
              </div>

              <div className="min-h-[600px] relative z-10">
                <AnimatePresence mode="wait">
                  {viewMode === 'grid' ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {paginatedContents.length > 0 ? (
                          paginatedContents.map((content, index) => {
                            const featured = index === 0 && searchQuery === '' && selectedPhase === 'all'
                            return (
                              <div key={content.id} className={featured ? 'sm:col-span-2' : ''}>
                                <EducationCard
                                  content={content}
                                  isRead={readDays.has(content.day)}
                                  isFavorite={favoriteDays.has(content.day)}
                                  onClick={() => handleCardClick(content.day)}
                                  onFavorite={() => handleFavorite(content.day)}
                                  featured={featured}
                                />
                              </div>
                            )
                          })
                        ) : (
                          <div className="col-span-full flex flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 py-32 text-center group">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[32px] bg-white dark:bg-slate-800 text-slate-200 dark:text-white shadow-sm border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
                              <Search className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Edukasi belum tersedia</h3>
                            <p className="mt-4 text-sm font-medium text-slate-500 max-w-xs mx-auto">Silakan gunakan filter lain atau ubah kata kunci pencarian Bunda.</p>
                          </div>
                        )}
                      </div>

                      <PaginationUI
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </motion.div>
                  ) : viewMode === 'timeline' ? (
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <TimelineView
                        contents={paginatedContents}
                        readDays={readDays}
                        favoriteDays={favoriteDays}
                        onCardClick={handleCardClick}
                        onFavorite={handleFavorite}
                        currentDay={userData?.current_day || 1}
                      />
                      <PaginationUI
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                    >
                      <EducationCalendarView
                        contents={contents}
                        readDays={readDays}
                        favoriteDays={favoriteDays}
                        onCardClick={handleCardClick}
                        currentDay={userData?.current_day || 1}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            </div>
          </div>
        </section>
    </div>
  )
}
