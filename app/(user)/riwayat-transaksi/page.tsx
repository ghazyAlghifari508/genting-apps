'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getUserConsultations } from '@/services/consultationService'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import { RatingStars } from '@/components/shared/RatingStars'
import { Calendar, Clock, Stethoscope, ChevronRight, ArrowLeft } from 'lucide-react'
import type { Consultation } from '@/types/consultation'

export default function ConsultationHistoryPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }

    const load = async () => {
      try {
        const data = await getUserConsultations(user.id)
        setConsultations(data || [])
      } catch (error) {
        console.error('Error loading consultation history:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router, user, authLoading])

  if (loading) {
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
          <div className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-4 space-y-3">
             {[1, 2, 3, 4, 5].map(i => (
               <Skeleton key={i} className="h-20 w-full rounded-2xl" />
             ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-32 text-slate-900">
      {/* Slim Professional Header */}
      {/* Clean Sub-page Header */}
      <section className="w-full pt-8 mb-6 relative">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm shrink-0" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Riwayat Transaksi</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Daftar lengkap pembayaran dan rekam jejak finansial konsultasi Bunda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-4">
          {consultations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-24 text-center">
              <Calendar className="mb-3 h-10 w-10 text-slate-300" />
              <p className="text-base font-semibold text-slate-900">Belum ada transaksi</p>
              <p className="mt-1 text-sm text-slate-500">Rekaman pembayaran akan muncul setelah Bunda melakukan konsultasi.</p>
              <Link href="/konsultasi-dokter" className="mt-4">
                <Button className="h-9 rounded-xl bg-doccure-teal px-4 text-sm font-semibold text-white hover:bg-doccure-dark">
                  Cari Dokter
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {consultations.map((consultation, index) => (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link href={`/konsultasi-dokter/${consultation.id}`}>
                    <Card className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-doccure-teal/35 hover:bg-white">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-doccure-teal to-doccure-dark">
                            {consultation.doctor?.profile_picture_url ? (
                              <Image
                                src={consultation.doctor.profile_picture_url}
                                alt={consultation.doctor.full_name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <Stethoscope className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">{consultation.doctor?.full_name || 'Dokter'}</p>
                            <p className="text-xs font-semibold text-doccure-teal">{consultation.doctor?.specialization || '-'}</p>
                            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                              <Clock className="h-3 w-3" />
                              {new Date(consultation.scheduled_at).toLocaleString('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <ConsultationStatusBadge status={consultation.status} />
                          {consultation.rating && <RatingStars rating={consultation.rating} size={12} />}
                          <p className="text-xs font-semibold text-slate-700">Rp {(consultation.total_cost || 0).toLocaleString('id-ID')}</p>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
