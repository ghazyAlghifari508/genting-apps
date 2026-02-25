'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  getContentByDay,
  toggleReadStatus,
  toggleFavoriteStatus,
  getUserProgress,
} from '@/services/educationService'
import { EducationContent, getPhaseInfo } from '@/types/education'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export default function EducationDetail() {
  const router = useRouter()
  const params = useParams()
  const day = parseInt(params.day as string)

  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<EducationContent | null>(null)
  const [isRead, setIsRead] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      try {
        const [data, progress] = await Promise.all([getContentByDay(day), getUserProgress(user.id)])

        if (data) {
          setContent(data)
          const currentProgress = progress.find((p) => p.day === day)
          if (currentProgress) {
            setIsRead(currentProgress.is_read)
            setIsFavorite(currentProgress.is_favorite)
          }
        }
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [day, user, authLoading, router])

  const handleToggleRead = async () => {
    if (!userId) return
    try {
      await toggleReadStatus(userId, day, !isRead)
      setIsRead(!isRead)
    } catch (error) {
      console.error('Error toggling read status:', error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!userId) return
    try {
      await toggleFavoriteStatus(userId, day, !isFavorite)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite status:', error)
    }
  }

  const tipsList = useMemo(() => {
    if (!content?.tips) return []
    if (Array.isArray(content.tips)) return content.tips
    return [String(content.tips)]
  }, [content])

  if (loading) {
    return (
      <div className="space-y-5 pb-32 text-slate-900">
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Skeleton className="h-4 w-32 rounded-full mb-2" />
              <Skeleton className="h-10 w-96 rounded-xl mb-2" />
              <Skeleton className="h-6 w-64 rounded-xl" />
            </div>
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 space-y-6">
            <div className="flex justify-between border-b border-slate-100 pb-4">
               <div className="flex gap-2">
                 <Skeleton className="h-6 w-20 rounded-xl" />
                 <Skeleton className="h-6 w-20 rounded-xl" />
                 <Skeleton className="h-6 w-24 rounded-xl" />
               </div>
               <div className="flex gap-2">
                 <Skeleton className="h-8 w-20 rounded-xl" />
                 <Skeleton className="h-8 w-20 rounded-xl" />
               </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </Card>
        </section>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="space-y-5 pb-32 text-slate-900">
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-doccure-teal">Edukasi Harian</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Materi Tidak Ditemukan</h1>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 text-center">
            <p className="text-base font-semibold text-slate-900">Materi untuk hari ke-{day} belum tersedia.</p>
            <Button onClick={() => router.push('/education')} className="mt-4 h-9 rounded-xl bg-doccure-teal px-4 text-sm font-semibold text-white hover:bg-doccure-dark">
              Kembali ke Edukasi
            </Button>
          </Card>
        </section>
      </div>
    )
  }

  const phaseInfo = getPhaseInfo(content.phase)

  return (
    <div className="space-y-5 pb-32 text-slate-900">
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-doccure-teal">Edukasi Hari Ke-{day}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{content.title}</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">{content.description}</p>
          </div>
          <Button variant="outline" className="h-9 rounded-xl border-slate-300 px-3 text-xs font-semibold" onClick={() => router.push('/education')}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-xl bg-doccure-teal text-white">{phaseInfo.label}</Badge>
              <Badge variant="outline" className="rounded-xl border-slate-300 bg-slate-50 text-slate-600">
                {content.category}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock className="h-3.5 w-3.5" /> 5 menit baca
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <BookOpen className="h-3.5 w-3.5" /> Interaktif
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className={cn('h-8 rounded-xl border-slate-300 px-3 text-xs font-semibold', isFavorite && 'border-amber-300 bg-amber-50 text-amber-700')}
                onClick={handleToggleFavorite}
              >
                <Bookmark className={cn('mr-1 h-3.5 w-3.5', isFavorite && 'fill-current')} />
                Favorit
              </Button>
              <Button variant="outline" className="h-8 rounded-xl border-slate-300 px-3 text-xs font-semibold">
                <Share2 className="mr-1 h-3.5 w-3.5" />
                Bagikan
              </Button>
            </div>
          </div>

          <article className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-base font-semibold leading-relaxed text-slate-700">
              {content.description}
            </div>

            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{content.content}</div>

            {tipsList.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <Lightbulb className="h-4 w-4" />
                  Tips Penting
                </p>
                <ul className="space-y-1 text-sm text-amber-800">
                  {tipsList.map((tip, index) => (
                    <li key={`${tip}-${index}`} className="leading-relaxed">
                      - {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {(content.tags || []).map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-xl border-slate-300 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleToggleRead}
                className={cn(
                  'h-10 rounded-xl px-4 text-sm font-semibold text-white',
                  isRead ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-doccure-teal hover:bg-doccure-dark'
                )}
              >
                {isRead ? (
                  <>
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Sudah Dibaca
                  </>
                ) : (
                  'Tandai Selesai'
                )}
              </Button>

              <div className="flex flex-1 gap-2">
                <Button
                  variant="outline"
                  disabled={day <= 1}
                  onClick={() => router.push(`/education/${day - 1}`)}
                  className="h-10 flex-1 rounded-xl border-slate-300 text-sm font-semibold"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Hari {day - 1}
                </Button>
                <Button
                  variant="outline"
                  disabled={day >= 1000}
                  onClick={() => router.push(`/education/${day + 1}`)}
                  className="h-10 flex-1 rounded-xl border-slate-300 text-sm font-semibold"
                >
                  Hari {day + 1} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
