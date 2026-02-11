'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { RatingStars } from '@/components/shared/RatingStars'
import { Search, Stethoscope, Clock, Star, ChevronRight, Filter } from 'lucide-react'
import Link from 'next/link'
import type { Doctor } from '@/types/doctor'
import { SPECIALIZATIONS } from '@/types/doctor'

export default function KonsultasiDokterPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let query = supabase.from('doctors').select('*').eq('is_active', true).eq('is_verified', true)

      if (category !== 'Semua') query = query.eq('specialization', category)
      if (search) query = query.ilike('full_name', `%${search}%`)

      const { data } = await query.order('created_at', { ascending: false })
      setDoctors(data || [])
      setLoading(false)
    }
    load()
  }, [supabase, category, search])

  const categories = ['Semua', ...SPECIALIZATIONS]

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Konsultasi Dokter</h1>
        <p className="text-sm text-slate-500">Temukan dokter spesialis untuk konsultasi</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari dokter..." className="pl-9 rounded-xl bg-white border-slate-200" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <div className="flex justify-center py-12"><LoadingScreen message="Mencari dokter..." /></div>
      ) : doctors.length === 0 ? (
        <Card className="p-12 rounded-2xl border-0 shadow-sm bg-white text-center">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Tidak ada dokter ditemukan</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {doctors.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="rounded-2xl border-0 shadow-sm bg-white hover:shadow-lg transition-all group overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                      {doc.profile_picture_url ? (
                        <img src={doc.profile_picture_url} alt={doc.full_name} className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <Stethoscope className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{doc.full_name}</h3>
                      <p className="text-xs text-blue-600 font-bold">{doc.specialization}</p>
                      {doc.years_of_experience && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock size={10} /> {doc.years_of_experience} tahun pengalaman
                        </p>
                      )}
                    </div>
                  </div>

                  {doc.bio && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{doc.bio}</p>}

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-slate-900">
                      Rp {doc.hourly_rate.toLocaleString('id-ID')}<span className="text-xs text-slate-400 font-medium">/jam</span>
                    </p>
                    <Link href={`/doctors/${doc.id}`}>
                      <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs">
                        Lihat Profil <ChevronRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
