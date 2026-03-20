'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getDoctorById, getDoctorSchedules } from '@/services/doctorService'
import { getMonthlyStats } from '@/services/consultationService'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Stethoscope,
  Star,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import type { Doctor, DoctorSchedule } from '@/types/doctor'
import { DAY_NAMES } from '@/types/doctor'

export default function DoctorPublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      try {
        const doctorData = await getDoctorById(id)
        if (!doctorData) {
          router.push('/konsultasi-dokter')
          return
        }

        setDoctor(doctorData)

        const [scheduleData, stats] = await Promise.all([getDoctorSchedules(id), getMonthlyStats(id)])
        setSchedules((scheduleData || []).filter((s) => s.is_available))
        setAvgRating(parseFloat(stats.avgRating) || 0)
        setReviewCount(stats.totalConsultations || 0)
      } catch (error) {
        console.error('Error loading doctor profile:', error)
        router.push('/konsultasi-dokter')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, router])

  if (loading && !doctor) {
    return (
      <div className="space-y-5 pb-32 text-slate-900">
        <section className="w-full pt-8 mb-6 relative">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-8 w-48 rounded-xl" />
                <Skeleton className="h-4 w-64 rounded-full mt-2" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 space-y-6">
              <div className="flex gap-5">
                <Skeleton className="h-24 w-24 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-6 w-64 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
            </Card>

            <div className="space-y-5">
              <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-4 w-48 rounded-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </Card>
              <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </Card>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!doctor) return null

  return (
    <div className="space-y-5 pb-32 text-slate-900">
      {/* Clean Sub-page Header */}
      <section className="w-full pt-8 mb-6 relative">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm shrink-0" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Profil Dokter</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Informasi lengkap, ulasan, dan jadwal praktik dokter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6">
            <div className="mb-5 flex flex-col gap-5 sm:flex-row">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-doccure-teal to-doccure-dark">
                {doctor.profile_picture_url ? (
                  <Image src={doctor.profile_picture_url} alt={doctor.full_name} fill unoptimized className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Stethoscope className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-slate-900">{doctor.full_name}</p>
                <p className="text-sm font-semibold text-doccure-teal">{doctor.specialization}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3.5 w-3.5 fill-current" /> {avgRating.toFixed(1)}
                  </span>
                  <span className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {reviewCount}+ konsultasi
                  </span>
                  <span className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {doctor.years_of_experience || 0} tahun pengalaman
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Tentang Dokter</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                {doctor.bio || 'Informasi bio dokter belum tersedia.'}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Nomor STR</p>
              <p className="mt-1.5 text-sm font-bold text-slate-900">{doctor.license_number || '-'}</p>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6">
              <h3 className="text-base font-bold text-slate-900">Tarif Konsultasi</h3>
              <p className="mt-1 text-sm text-slate-500">Tarif per jam konsultasi langsung.</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">Rp {doctor.hourly_rate.toLocaleString('id-ID')}</p>

              <Link href={`/booking/${doctor.id}`}>
                <Button className="mt-5 h-12 w-full rounded-xl bg-doccure-teal text-sm font-bold text-white hover:bg-doccure-dark shadow-md transition-all active:scale-[0.98]">
                  Booking Sekarang
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>

              <div className="mt-4 inline-flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-[11px] font-medium text-slate-600">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-doccure-teal" />
                Pembayaran aman melalui Midtrans.
              </div>
            </Card>

            <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6">
              <h3 className="text-base font-bold text-slate-900">Jadwal Praktik</h3>
              {schedules.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">Belum ada jadwal. Silakan hubungi admin untuk jadwal khusus.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {schedules.map((schedule) => (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5"
                    >
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <Calendar className="h-3.5 w-3.5 text-doccure-teal" />
                        {DAY_NAMES[schedule.day_of_week]}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
