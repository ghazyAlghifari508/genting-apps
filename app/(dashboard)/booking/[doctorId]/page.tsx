'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Calendar, Clock, Stethoscope, CreditCard } from 'lucide-react'
import Link from 'next/link'
import type { Doctor, DoctorSchedule } from '@/types/doctor'
import { DAY_NAMES } from '@/types/doctor'

export default function BookingPage() {
  const { doctorId } = useParams<{ doctorId: string }>()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [form, setForm] = useState({ date: '', time: '', duration: 60, description: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      const { data: doc } = await supabase.from('doctors').select('*').eq('id', doctorId).single()
      if (!doc) { router.push('/konsultasi-dokter'); return }
      setDoctor(doc)

      const { data: sched } = await supabase.from('doctor_schedules').select('*').eq('doctor_id', doctorId).eq('is_available', true).order('day_of_week')
      setSchedules(sched || [])
      setLoading(false)
    }
    load()
  }, [doctorId, supabase, router])

  const totalCost = doctor ? (doctor.hourly_rate / 60) * form.duration : 0

  const handleSubmit = async () => {
    if (!form.date || !form.time || !doctor) return
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const scheduledAt = `${form.date}T${form.time}:00`

      const { data, error } = await supabase.from('consultations').insert({
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
      }).select().single()

      if (error) throw error
      router.push(`/payment/${data.id}`)
    } catch {
      toast({ title: 'Error', description: 'Gagal membuat booking.', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingScreen message="Memuat..." fullScreen />
  if (!doctor) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-8">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-lg font-black text-slate-900">Booking Konsultasi</h1>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Doctor Info */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{doctor.full_name}</p>
              <p className="text-xs text-blue-600 font-bold">{doctor.specialization}</p>
            </div>
            <p className="ml-auto text-sm font-black text-slate-900">Rp {doctor.hourly_rate.toLocaleString('id-ID')}/jam</p>
          </div>
        </Card>

        {/* Available Schedule */}
        {schedules.length > 0 && (
          <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
            <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><Calendar size={12} /> Jadwal Tersedia</p>
            <div className="flex flex-wrap gap-2">
              {schedules.map((s) => (
                <span key={s.id} className="px-3 py-1.5 rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                  {DAY_NAMES[s.day_of_week]} {s.start_time.slice(0, 5)}-{s.end_time.slice(0, 5)}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Booking Form */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white space-y-4">
          <h3 className="font-bold text-slate-900">Detail Booking</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Tanggal *</label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Waktu *</label>
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Durasi (menit)</label>
              <select value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white">
                <option value={30}>30 menit</option>
                <option value={60}>60 menit</option>
                <option value={90}>90 menit</option>
                <option value={120}>120 menit</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Keluhan / Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none h-20" placeholder="Jelaskan keluhan Anda..." />
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-1"><CreditCard size={16} /> Rincian Biaya</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Tarif ({form.duration} menit)</span>
              <span>Rp {totalCost.toLocaleString('id-ID')}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span>Rp {totalCost.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </Card>

        <Button onClick={handleSubmit} disabled={!form.date || !form.time || submitting} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-base">
          {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
        </Button>
      </main>
    </div>
  )
}
