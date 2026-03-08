'use client'

import { useState } from 'react'
import { useDoctorContext } from '@/components/providers/Providers'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import { RatingStars } from '@/components/shared/RatingStars'
import { Search, Users, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Consultation } from '@/types/consultation'

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Dijadwalkan', value: 'scheduled' },
  { label: 'Berlangsung', value: 'ongoing' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

export default function DoctorConsultationsPage() {
  const doctorContext = useDoctorContext()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const consultations = doctorContext?.consultations || []
  const loading = doctorContext?.loading

  const filtered = consultations.filter((c) => {
    const matchesSearch = !search || c.user?.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || c.status === filter
    return matchesSearch && matchesFilter
  })

  if (loading && consultations.length === 0) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
        <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
           <Skeleton className="h-10 w-48 rounded-lg" />
        </div>

        <main className="max-w-4xl mx-auto space-y-4">
           <div className="flex gap-3">
             <Skeleton className="h-10 flex-1 rounded-xl" />
             <div className="flex gap-1">
               {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-20 rounded-xl" />)}
             </div>
           </div>
           {[1, 2, 3, 4].map(i => (
             <Skeleton key={i} className="h-20 w-full rounded-2xl" />
           ))}
        </main>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      <main className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Cari pasien..." 
              className="pl-9 rounded-xl" 
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filter === tab.value ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
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
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/doctor/consultations/${c.id}`}>
                  <Card className="p-4 rounded-2xl border-0 shadow-sm bg-white hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cerulean/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-cerulean" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{c.user?.full_name || 'Pasien'}</p>
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
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cerulean" />
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
