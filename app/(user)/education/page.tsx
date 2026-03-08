'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Grid,
  List as ListIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { usePregnancyData } from '@/hooks/usePregnancyData'
import {
  Phase,
  PHASES,
  EducationContent,
} from '@/types/education'
import {
  toggleReadStatus,
  toggleFavoriteStatus
} from '@/services/educationService'
import { calculateReadingStreak } from '@/lib/education-utils'

import { SidebarStats } from '@/components/user/education/SidebarStats'
import { PaginationUI } from '@/components/shared/pagination-ui'
import { PhaseFilter } from '@/components/user/education/PhaseFilter'
import { EducationCard } from '@/components/user/education/EducationCard'

type ViewMode = 'grid' | 'list'

export default function Education() {
  const router = useRouter()
  const { profile, loading: dataLoading, education, loadEducation } = usePregnancyData()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'all'>('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [showRead, setShowRead] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30

  useEffect(() => {
    // Rely on Provider mechnism for success guarding
    // Adding length back to dependencies to avoid React Hook size mismatch errors
    if (!profile || dataLoading || education.loading) return
    loadEducation()
  }, [profile, dataLoading, education.loading, education.content.length, loadEducation])

  const readDays = useMemo(() => {
    const read = new Set<number>()
    ;(education.progress || []).forEach(p => {
      if (p.is_read) read.add(p.day)
    })
    return read
  }, [education.progress])

  const favoriteDays = useMemo(() => {
    const fav = new Set<number>()
    ;(education.progress || []).forEach(p => {
      if (p.is_favorite) fav.add(p.day)
    })
    return fav
  }, [education.progress])

  const stats = useMemo(() => {
    return education.stats || { total_read: 0, total_favorite: 0, progress_percentage: 0 }
  }, [education.stats])

  const streakDays = useMemo(() => {
    return calculateReadingStreak(education.progress || [])
  }, [education.progress])

  const filteredContents = useMemo(() => {
    let result = [...education.content]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c: EducationContent) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags?.some((t: string) => t.toLowerCase().includes(q))
      )
    }
    if (selectedPhase !== 'all') {
      result = result.filter((c: EducationContent) => c.phase === selectedPhase)
    }
    if (showFavorites) {
      result = result.filter((c: EducationContent) => favoriteDays.has(c.day))
    }
    if (showRead) {
      result = result.filter((c: EducationContent) => readDays.has(c.day))
    }
    return result
  }, [education.content, searchQuery, selectedPhase, showFavorites, showRead, favoriteDays, readDays])

  const paginatedContents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredContents.slice(start, start + itemsPerPage)
  }, [filteredContents, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage)

  const handleCardClick = (day: number) => {
    router.push(`/education/${day}`)
  }

  const handleFavorite = async (day: number) => {
    if (!profile) return
    const isFav = favoriteDays.has(day)
    try {
      await toggleFavoriteStatus(profile.id, day, !isFav)
      loadEducation(true)
    } catch {
      toast({ title: 'Error', description: 'Gagal memperbarui favorit.', variant: 'destructive' })
    }
  }

  if ((dataLoading || education.loading) && education.content.length === 0) {
    return (
      <div className="pb-32 text-slate-900 relative bg-slate-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-doccure-teal/10 rounded-full blur-[120px] pointer-events-none opacity-30" />
        <section className="w-full bg-white border-b border-slate-100 relative overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 rounded-lg mb-4" />
                <Skeleton className="h-10 w-64 rounded-xl" />
                <Skeleton className="h-4 w-96 max-w-full rounded-full mt-2" />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Skeleton className="h-12 w-full md:w-80 rounded-2xl" />
                <Skeleton className="h-12 w-12 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-8 relative z-20">
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1 space-y-8">
                <Skeleton className="h-[400px] w-full rounded-3xl" />
              </aside>
              <main className="lg:col-span-3 space-y-8">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-48 rounded-xl" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-80 w-full rounded-2xl" />
                  ))}
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pb-32 text-slate-900 relative bg-slate-50">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-doccure-teal/10 rounded-full blur-[120px] pointer-events-none opacity-30" />
      
      {/* Header Section */}
      <section className="w-full bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Edukasi</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900  leading-none">
                Edukasi <span className="text-doccure-teal italic relative inline-block">
                  Bunda
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-slate-500  font-medium max-w-lg">
                Panduan lengkap kesehatan dan perkembangan si Kecil setiap hari.
              </p>
            </motion.div>
            
            <div className="flex flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative group flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari topik edukasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-2xl border-none bg-slate-50 pl-11 pr-4 text-sm font-semibold shadow-inner ring-1 ring-slate-200 focus:ring-2 focus:ring-doccure-teal focus:bg-white transition-all outline-none"
                />
              </div>
              <Button 
                variant="outline" 
                className="h-12 w-12 shrink-0 rounded-2xl p-0 border-none bg-slate-50 shadow-inner ring-1 ring-slate-200 hover:bg-white transition-all"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <ListIcon className="h-5 w-5 text-slate-600" /> : <Grid className="h-5 w-5 text-slate-600" />}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-8 relative z-20">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-8 lg:self-start">
            <SidebarStats
              readCount={stats.total_read}
              totalDays={education.content.length}
              streakDays={streakDays}
            />

            <PhaseFilter
              selectedPhase={selectedPhase}
              onSelect={setSelectedPhase}
              showFavorites={showFavorites}
              onToggleFavorites={setShowFavorites}
              showRead={showRead}
              onToggleRead={setShowRead}
            />
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">
                {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 
                 showFavorites ? 'Konten Favorit' :
                 showRead ? 'Konten Selesai' :
                 selectedPhase !== 'all' ? `Fase: ${PHASES.find(p => p.id === selectedPhase)?.label}` : 
                 'Semua Panduan'}
                <span className="ml-3 inline-flex h-6 items-center rounded-full bg-slate-100 px-2.5 text-xs font-black text-slate-500">
                  {filteredContents.length}
                </span>
              </h3>
            </div>

            {filteredContents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-slate-200 py-24 text-center">
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                  <Search size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-900">Tidak ada konten ditemukan</h4>
                <p className="text-slate-500 mt-2 max-w-md">
                  Coba gunakan kata kunci lain atau ubah filter untuk menemukan apa yang Bunda cari.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 rounded-xl"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedPhase('all')
                    setShowFavorites(false)
                    setShowRead(false)
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {paginatedContents.map((content) => (
                    <EducationCard
                      key={content.id}
                      content={content}
                      viewMode={viewMode}
                      isRead={readDays.has(content.day)}
                      isFavorite={favoriteDays.has(content.day)}
                      onClick={() => handleCardClick(content.day)}
                      onFavorite={() => handleFavorite(content.day)}
                      featured={false}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pt-8">
                    <PaginationUI 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={setCurrentPage} 
                    />
                  </div>
                )}
              </>
            )}
          </main>
          </div>
        </div>
      </section>
    </div>
  )
}
