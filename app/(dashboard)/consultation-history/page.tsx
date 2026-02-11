'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import { RatingStars } from '@/components/shared/RatingStars'
import { Stethoscope, Clock, ChevronRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { Consultation } from '@/types/consultation'

export default function ConsultationHistoryPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('consultations')
        .select('*, doctor:doctor_id(full_name, specialization, profile_picture_url)')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: false })

      setConsultations(data || [])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  if (loading) return <LoadingScreen message="Memuat riwayat..." fullScreen />

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Riwayat Konsultasi</h1>
        <p className="text-sm text-slate-500">Semua konsultasi Anda di sini</p>
      </div>

      {consultations.length === 0 ? (
        <Card className="p-12 rounded-2xl border-0 shadow-sm bg-white text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-900 mb-1">Belum Ada Konsultasi</p>
          <p className="text-sm text-slate-400">Mulai konsultasi pertama Anda</p>
          <Link href="/konsultasi-dokter" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
            Cari Dokter
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {consultations.map((c, i) => {
            const doctor = (c as any).doctor
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/consultations/${c.id}`}>
                  <Card className="p-4 rounded-2xl border-0 shadow-sm bg-white hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                          {doctor?.profile_picture_url ? (
                            <img src={doctor.profile_picture_url} alt={doctor.full_name} className="w-full h-full rounded-xl object-cover" />
                          ) : (
                            <Stethoscope className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{doctor?.full_name || 'Dokter'}</p>
                          <p className="text-xs text-blue-600 font-bold">{doctor?.specialization}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} />
                            {new Date(c.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <ConsultationStatusBadge status={c.status} />
                        {c.rating && <RatingStars rating={c.rating} size={12} />}
                        <p className="text-xs font-bold text-slate-600">Rp {(c.total_cost || 0).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
