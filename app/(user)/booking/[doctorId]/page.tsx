'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getDoctorById, getDoctorSchedules } from '@/services/doctorService'
import { createConsultation } from '@/services/consultationService'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import {
  ArrowLeft,
  Stethoscope,
  Calendar,
  Clock,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import type { Doctor, DoctorSchedule } from '@/types/doctor'
import { DAY_NAMES } from '@/types/doctor'

export default function BookingPage() {
  const { doctorId } = useParams<{ doctorId: string }>()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState({
    date: '',
    time: '',
    duration: 60,
    description: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const doctorData = await getDoctorById(doctorId)
        if (!doctorData) {
          router.push('/konsultasi-dokter')
          return
        }
        setDoctor(doctorData)

        const scheduleData = await getDoctorSchedules(doctorId)
        setSchedules((scheduleData || []).filter((s) => s.is_available))
      } catch (error) {
        console.error('Error loading booking data:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [doctorId, router])

  const totalCost = useMemo(() => {
    if (!doctor) return 0
    return (doctor.hourly_rate / 60) * form.duration
  }, [doctor, form.duration])

  const handleSubmit = async () => {
    if (!doctor || !form.date || !form.time) {
      toast({
        title: 'Data belum lengkap',
        description: 'Pilih tanggal dan jam konsultasi terlebih dahulu.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      if (!user) {
        router.push('/login')
        return
      }

      const scheduledAt = `${form.date}T${form.time}:00`

      const consultation = await createConsultation({
        user_id: user.id,
        doctor_id: doctor.id,
        title: `Konsultasi dengan ${doctor.full_name}`,
        description: form.description,
        scheduled_at: scheduledAt,
        hourly_rate: doctor.hourly_rate,
        duration_minutes: form.duration,
        total_cost: totalCost,
        payment_status: 'pending',
        status: 'scheduled',
      })

      router.push(`/payment/${consultation.id}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: 'Booking gagal',
        description: 'Terjadi kendala saat membuat jadwal. Coba beberapa saat lagi.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

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
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 space-y-6">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded-full" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-full" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            </Card>

            <div className="space-y-5">
              <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 space-y-4">
                <Skeleton className="h-6 w-48 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </Card>
              <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 space-y-3">
                <Skeleton className="h-5 w-32 rounded-md" />
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
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
              <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Booking Jadwal Konsultasi</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Tentukan waktu yang paling nyaman bersama {doctor.full_name}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6">
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-doccure-teal to-doccure-dark">
                {doctor.profile_picture_url ? (
                  <Image src={doctor.profile_picture_url} alt={doctor.full_name} fill unoptimized className="object-cover" />
                ) : (
                  <Stethoscope className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{doctor.full_name}</p>
                <p className="text-xs font-semibold text-doccure-teal">{doctor.specialization}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">Tarif Rp {doctor.hourly_rate.toLocaleString('id-ID')} / jam</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-doccure-teal" />
                    Tanggal
                  </label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="h-12 rounded-xl border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-doccure-teal" />
                    Jam
                  </label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                    className="h-12 rounded-xl border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Durasi Sesi</p>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 60, 90].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setForm((prev) => ({ ...prev, duration }))}
                      className={`h-12 rounded-xl border text-sm font-semibold transition-colors ${
                        form.duration === duration
                          ? 'border-doccure-teal bg-doccure-teal text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {duration} menit
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <MessageSquare className="h-3.5 w-3.5 text-doccure-teal" />
                  Keluhan / pertanyaan
                </label>
                <Textarea
                  placeholder="Tuliskan keluhan atau pertanyaan yang ingin didiskusikan..."
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px] rounded-xl border-slate-300"
                />
              </div>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6">
              <h2 className="text-base font-bold text-slate-900">Ringkasan Booking</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Dokter</span>
                  <span className="font-semibold text-slate-900">{doctor.full_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Durasi</span>
                  <span className="font-semibold text-slate-900">{form.duration} menit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Metode</span>
                  <span className="font-semibold text-slate-900">Chat konsultasi</span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Total biaya</p>
                <p className="mt-1.5 text-2xl font-bold text-slate-900">Rp {totalCost.toLocaleString('id-ID')}</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!form.date || !form.time || submitting}
                className="mt-5 h-12 w-full rounded-xl bg-doccure-teal text-sm font-bold text-white hover:bg-doccure-dark shadow-md transition-all active:scale-[0.98]"
              >
                {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                {!submitting && <ChevronRight className="ml-1.5 h-4 w-4" />}
              </Button>

              <div className="mt-4 inline-flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-[11px] font-medium text-slate-600">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-doccure-teal" />
                Pembayaran diproses aman melalui Midtrans.
              </div>
            </Card>

            <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6">
              <h3 className="text-sm font-bold text-slate-900">Jadwal Dokter</h3>
              {schedules.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">Belum ada jadwal tersedia. Silakan hubungi admin.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {schedules.slice(0, 5).map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
                      <span className="text-xs font-semibold text-slate-700">{DAY_NAMES[schedule.day_of_week]}</span>
                      <span className="text-xs font-semibold text-slate-900">
                        {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                      </span>
                    </div>
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
