'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  GraduationCap,
  Heart,
  ChevronRight as ChevronRightIcon,
  FileText,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getContentByDay,
  toggleReadStatus,
  toggleFavoriteStatus,
  getUserProgress,
  getAllEducationContent,
} from '@/services/educationService'
import { EducationContent, getPhaseInfo, UserProgress } from '@/types/education'
import { cn } from '@/lib/utils'
import { usePregnancyData } from '@/hooks/usePregnancyData'
import { Skeleton } from '@/components/ui/skeleton'

export default function EducationDetail() {
  const router = useRouter()
  const params = useParams()
  const day = parseInt(params.day as string)

  const { profile, loading: authLoading, loadEducation } = usePregnancyData()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<EducationContent | null>(null)
  const [isRead, setIsRead] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [allProgress, setAllProgress] = useState<UserProgress[]>([])
  const [relatedContents, setRelatedContents] = useState<EducationContent[]>([])
  const [totalLessons, setTotalLessons] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return
      if (!profile) {
        router.push('/login')
        return
      }
      setUserId(profile.id)

      try {
        const [data, progress, allContent] = await Promise.all([
          getContentByDay(day),
          getUserProgress(profile.id),
          getAllEducationContent(),
        ])

        if (data) {
          setContent(data)
          const currentProgress = progress.find((p) => p.day === day)
          if (currentProgress) {
            setIsRead(currentProgress.is_read)
            setIsFavorite(currentProgress.is_favorite)
          }
        }

        setAllProgress(progress)
        setTotalLessons(allContent.length)

        // Get related content (nearby days)
        const nearbyDays = [day - 1, day + 1, day + 2].filter(d => d > 0 && d !== day)
        const related = allContent.filter(c => nearbyDays.includes(c.day)).slice(0, 3)
        setRelatedContents(related)
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [day, profile, authLoading, router])

  const handleToggleRead = async () => {
    if (!userId) return
    const newRead = !isRead
    try {
      await toggleReadStatus(userId, day, newRead)
      setIsRead(newRead)
      // Update local state for sidebar
      setAllProgress(prev => {
        const exists = prev.some(p => p.day === day)
        if (exists) {
          return prev.map(p => p.day === day ? { ...p, is_read: newRead } : p)
        }
        return [...prev, { id: '', user_id: userId, day, is_read: newRead, is_favorite: isFavorite }]
      })
      // Sync global state for listing page filters
      loadEducation(true)
    } catch (error) {
      console.error('Error toggling read status:', error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!userId) return
    try {
      await toggleFavoriteStatus(userId, day, !isFavorite)
      setIsFavorite(!isFavorite)
      // Sync global state
      loadEducation(true)
    } catch (error) {
      console.error('Error toggling favorite status:', error)
    }
  }

  const tipsList = useMemo(() => {
    if (!content?.tips) return []
    if (Array.isArray(content.tips)) return content.tips
    return [String(content.tips)]
  }, [content])

  const readCount = allProgress.filter(p => p.is_read).length
  const progressPercent = totalLessons > 0 ? Math.round((readCount / totalLessons) * 100) : 0

  // --- LOADING STATE ---
  if (loading && !content) {
    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="bg-doccure-dark pt-28 pb-12">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-10 rounded-xl bg-white/10 mb-6" />
            <Skeleton className="h-4 w-48 rounded-full mb-3 bg-white/10" />
            <Skeleton className="h-12 w-2/3 rounded-2xl mb-3 bg-white/10" />
            <Skeleton className="h-5 w-1/2 rounded-xl bg-white/10" />
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid lg:grid-cols-[1fr_340px] gap-8">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
          <div className="space-y-6 hidden lg:block">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-60 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  // --- NOT FOUND ---
  if (!content) {
    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="bg-doccure-dark pt-28 pb-12">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-black text-white">Materi Tidak Ditemukan</h1>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white rounded-2xl border p-10 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-900 mb-2">Materi untuk hari ke-{day} belum tersedia.</p>
            <Button onClick={() => router.push('/education')} className="mt-4 h-11 rounded-xl bg-doccure-teal text-white font-bold hover:bg-doccure-dark">
              Kembali ke Edukasi
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const phaseInfo = getPhaseInfo(content.phase)

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* ─── HEADER STRIP ─── */}
      <div className="bg-doccure-dark pt-28 pb-20 relative overflow-hidden min-h-[420px] flex items-end">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={content.thumbnail_url || '/images/unsplash/img_028c4aca.png'} 
            alt={content.title}
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />
        </div>

        {/* Background Rings - Subtle */}
        <div className="absolute top-[-40%] left-[-8%] w-[540px] h-[540px] border-[60px] border-doccure-teal opacity-10 rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] border-[40px] border-doccure-yellow opacity-10 rounded-full pointer-events-none z-0" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 shrink-0 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-md p-0 shadow-lg transition-all"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 text-white" />
              </Button>
              <nav className="flex items-center gap-1.5 text-white/50 text-xs font-black tracking-wide">
                <button onClick={() => router.push('/education')} className="hover:text-doccure-teal transition-colors">EDUKASI</button>
                <ChevronRightIcon className="w-3 h-3 text-white/30" />
                <span className="text-white/70 uppercase">{phaseInfo.label}</span>
                <ChevronRightIcon className="w-3 h-3 text-white/30" />
                <span className="text-doccure-yellow uppercase">HARI {day}</span>
              </nav>
            </div>

            {/* Title Block */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6 max-w-4xl drop-shadow-sm">
              {content.title}
            </h1>

            {/* Author Row */}
            <div className="flex flex-wrap items-center gap-5 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-doccure-teal to-emerald-500 flex items-center justify-center text-white text-[10px] font-black shadow-lg ring-1 ring-white/20">
                  G+
                </div>
                <div>
                  <p className="text-sm font-black text-white">GENTING+ Team</p>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Tim Ahli Nutrisi & Kesehatan</p>
                </div>
              </div>
              <div className="h-6 w-px bg-white/20 hidden sm:block mx-1" />
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="rounded-xl bg-white/10 text-doccure-teal border border-doccure-teal/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-md">
                  {phaseInfo.label}
                </Badge>
                <span className="text-[11px] font-black text-white/70 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-doccure-yellow" /> 
                  {Math.max(1, Math.ceil((content.content?.split(/\s+/).length || 0) / 200))} Menit Baca
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── MAIN 2-COLUMN LAYOUT ─── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* ─── LEFT COLUMN: ARTICLE ─── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_16px_40px_rgba(15,23,42,0.06)] overflow-hidden">
              {/* Action Row */}
              <div className="flex items-center justify-between px-6 md:px-8 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" /> {content.category}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-9 rounded-xl border-slate-200 px-3 text-xs font-bold transition-all',
                      isFavorite && 'border-amber-300 bg-amber-50 text-amber-700 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]'
                    )}
                    onClick={handleToggleFavorite}
                  >
                    <Bookmark className={cn('mr-1.5 h-3.5 w-3.5', isFavorite && 'fill-current')} />
                    {isFavorite ? 'Favorit' : 'Favorit'}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 px-2.5 text-xs font-bold">
                    <Share2 className="mr-1 h-3 w-3" /> Bagikan
                  </Button>
                </div>
              </div>

              {/* Description Block */}
              <div className="px-6 md:px-8 pt-8">
                <div className="relative rounded-2xl bg-gradient-to-r from-doccure-teal/5 to-emerald-50/30 border border-doccure-teal/10 p-5 overflow-hidden">
                  <Heart className="absolute top-3 right-3 w-8 h-8 text-doccure-teal/10" />
                  <p className="text-base font-semibold leading-relaxed text-slate-700 pr-8">
                    {content.description}
                  </p>
                </div>
              </div>

              {/* Article Body */}
              <article className="px-6 md:px-8 py-8 space-y-8">
                <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-600 font-medium">
                  {content.content}
                </div>

                {/* Tips Section */}
                {tipsList.length > 0 && (
                  <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/40 to-yellow-50 border border-amber-200/40 p-6 relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200/50 shadow-inner">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                      </div>
                      <h3 className="text-sm font-black text-amber-800 uppercase tracking-wide">Tips Penting</h3>
                    </div>
                    <ul className="space-y-3 relative z-10">
                      {tipsList.map((tip, idx) => (
                        <li key={`${tip}-${idx}`} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-md bg-amber-200/70 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-black text-amber-800">{idx + 1}</span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-amber-800/90">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {(content.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                    {(content.tags || []).map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-lg border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </article>

              {/* Footer Navigation */}
              <div className="px-6 md:px-8 pb-8 border-t border-slate-100 pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleToggleRead}
                    className={cn(
                      'h-12 rounded-xl px-6 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all',
                      isRead ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-doccure-teal hover:bg-doccure-dark'
                    )}
                  >
                    {isRead ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Sudah Dibaca</> : 'Tandai Selesai'}
                  </Button>
                  <div className="flex flex-1 gap-2">
                    <Button variant="outline" disabled={day <= 1} onClick={() => router.push(`/education/${day - 1}`)} className="h-12 flex-1 rounded-xl border-slate-200 text-sm font-bold">
                      <ChevronLeft className="mr-1 h-4 w-4" /> Hari {day - 1}
                    </Button>
                    <Button variant="outline" disabled={day >= 1000} onClick={() => router.push(`/education/${day + 1}`)} className="h-12 flex-1 rounded-xl border-slate-200 text-sm font-bold">
                      Hari {day + 1} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── RIGHT COLUMN: SIDEBAR ─── */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="hidden lg:flex flex-col gap-6 sticky top-24"
          >
            {/* Progress Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.03] pointer-events-none"
                   style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
              <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-doccure-teal" />
                Progres Belajar
              </h3>
              <div className="mt-4 mb-3">
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-doccure-teal to-emerald-400 rounded-full"
                  />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500">
                <span className="text-doccure-teal">{progressPercent}%</span> Selesai ({readCount} dari {totalLessons} materi)
              </p>
              <Button
                onClick={() => router.push('/education')}
                className="w-full mt-4 h-10 rounded-xl bg-doccure-teal hover:bg-doccure-dark text-white text-xs font-bold"
              >
                Lanjutkan Belajar
              </Button>
            </div>

            {/* Related Lessons Card */}
            {relatedContents.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-doccure-teal" />
                  Materi Terkait
                </h3>
                <div className="space-y-3">
                  {relatedContents.map(rc => {
                    const rcRead = allProgress.some(p => p.day === rc.day && p.is_read)
                    return (
                      <button
                        key={rc.id}
                        onClick={() => router.push(`/education/${rc.day}`)}
                        className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-black',
                          rcRead ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        )}>
                          {rcRead ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate group-hover:text-doccure-teal transition-colors">{rc.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> 5 Menit Baca · Hari {rc.day}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tips Summary Card */}
            {tipsList.length > 0 && (
              <div className="bg-gradient-to-br from-doccure-dark to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-doccure-teal/10 rounded-full -translate-y-6 translate-x-6 blur-xl pointer-events-none" />
                <h3 className="text-sm font-black mb-4 flex items-center gap-2 relative z-10">
                  <div className="w-7 h-7 rounded-lg bg-doccure-yellow flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5 text-doccure-dark" />
                  </div>
                  Rangkuman Pelajaran
                </h3>
                <p className="text-xs font-medium text-white/60 leading-relaxed relative z-10 mb-4">
                  Materi hari ke-{day} membahas tentang {content.title.toLowerCase()}. Pastikan Bunda memahami semua tips yang diberikan.
                </p>
                <div className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">
                  <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> {tipsList.length} Tips</span>
                  <span>·</span>
                  <span>{content.category}</span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
