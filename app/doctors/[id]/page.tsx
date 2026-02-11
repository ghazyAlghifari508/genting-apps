'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { RatingStars } from '@/components/shared/RatingStars'
import { Stethoscope, Clock, Star, Shield, Calendar, ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Doctor, DoctorSchedule } from '@/types/doctor'
import { DAY_NAMES } from '@/types/doctor'

export default function DoctorPublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: doc } = await supabase.from('doctors').select('*').eq('id', id).single()
      if (!doc) { router.push('/konsultasi-dokter'); return }
      setDoctor(doc)

      const { data: sched } = await supabase.from('doctor_schedules').select('*').eq('doctor_id', id).eq('is_available', true).order('day_of_week').order('start_time')
      setSchedules(sched || [])

      const { data: ratings } = await supabase.from('consultations').select('rating').eq('doctor_id', id).not('rating', 'is', null)
      if (ratings?.length) {
        setAvgRating(Math.round((ratings.reduce((s, r) => s + (r.rating || 0), 0) / ratings.length) * 10) / 10)
        setReviewCount(ratings.length)
      }

      setLoading(false)
    }
    load()
  }, [id, supabase, router])

  if (loading) return <LoadingScreen message="Memuat profil dokter..." fullScreen />
  if (!doctor) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-8">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-lg font-black text-slate-900">Profil Dokter</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Header */}
        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
              {doctor.profile_picture_url ? (
                <img src={doctor.profile_picture_url} alt={doctor.full_name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <Stethoscope className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-slate-900">{doctor.full_name}</h2>
              <p className="text-sm text-blue-600 font-bold">{doctor.specialization}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                {doctor.years_of_experience && (
                  <span className="flex items-center gap-1"><Clock size={12} />{doctor.years_of_experience} thn</span>
                )}
                <span className="flex items-center gap-1"><Star size={12} />{avgRating} ({reviewCount} ulasan)</span>
                {doctor.is_verified && <span className="flex items-center gap-1 text-green-600"><Shield size={12} />Terverifikasi</span>}
              </div>
            </div>
          </div>
          {doctor.bio && <p className="text-sm text-slate-600 mt-4 leading-relaxed">{doctor.bio}</p>}
        </Card>

        {/* Pricing */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Tarif Konsultasi</p>
              <p className="text-2xl font-black text-slate-900">Rp {doctor.hourly_rate.toLocaleString('id-ID')}<span className="text-sm text-slate-400 font-medium">/jam</span></p>
            </div>
            <Link href={`/booking/${doctor.id}`}>
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-bold">
                Book Konsultasi <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Schedule */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Calendar size={16} /> Jadwal Tersedia</h3>
          {schedules.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada jadwal yang tersedia</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {schedules.map((s) => (
                <div key={s.id} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 text-sm">
                  <span className="font-bold text-slate-700 w-16">{DAY_NAMES[s.day_of_week]}</span>
                  <span className="text-slate-500">{s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Credentials */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Shield size={16} /> Kredensial</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p><span className="font-bold text-slate-700">No. STR:</span> {doctor.license_number}</p>
            <p><span className="font-bold text-slate-700">Spesialisasi:</span> {doctor.specialization}</p>
            {doctor.years_of_experience && <p><span className="font-bold text-slate-700">Pengalaman:</span> {doctor.years_of_experience} tahun</p>}
          </div>
        </Card>
      </main>
    </div>
  )
}
