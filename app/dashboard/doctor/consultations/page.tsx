'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import { RatingStars } from '@/components/shared/RatingStars'
import { ArrowLeft, Search, Users, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Consultation, ConsultationStatus } from '@/types/consultation'

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Dijadwalkan', value: 'scheduled' },
  { label: 'Berlangsung', value: 'ongoing' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

export default function DoctorConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: doc } = await supabase.from('doctors').select('id').eq('user_id', user.id).single()
      if (!doc) { router.push('/dashboard/doctor/profile'); return }

      let query = supabase
        .from('consultations')
        .select('*, user:user_id(full_name, avatar_url)')
        .eq('doctor_id', doc.id)

      if (filter !== 'all') query = query.eq('status', filter)

      const { data } = await query.order('scheduled_at', { ascending: false })
      setConsultations(data || [])
      setLoading(false)
    }
    load()
  }, [supabase, router, filter])

  const filtered = consultations.filter((c) =>
    !search || (c as any).user?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingScreen message="Memuat konsultasi..." fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-8">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard/doctor"><Button variant="ghost" size="sm" className="rounded-xl"><ArrowLeft size={18} /></Button></Link>
          <h1 className="text-lg font-black text-slate-900">Daftar Konsultasi</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pasien..." className="pl-9 rounded-xl" />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setFilter(tab.value); setLoading(true) }}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filter === tab.value ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="p-12 rounded-2xl border-0 shadow-sm bg-white text-center">
            <p className="text-slate-400 font-medium">Tidak ada konsultasi ditemukan</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/dashboard/doctor/consultations/${c.id}`}>
                  <Card className="p-4 rounded-2xl border-0 shadow-sm bg-white hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{(c as any).user?.full_name || 'Pasien'}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(c.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                          {c.title && <p className="text-xs text-slate-500 mt-0.5">{c.title}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {c.rating && <RatingStars rating={c.rating} size={12} />}
                        <ConsultationStatusBadge status={c.status} />
                        <p className="text-sm font-bold text-slate-700 hidden sm:block">
                          Rp {(c.total_cost || 0).toLocaleString('id-ID')}
                        </p>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
