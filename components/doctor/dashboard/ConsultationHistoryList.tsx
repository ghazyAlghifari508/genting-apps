'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, History, Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getRecentConsultations } from '@/services/consultationService'
import { getDoctorByUserId } from '@/services/doctorService'
import { useAuth } from '@/hooks/useAuth'
import type { Consultation } from '@/types/consultation'
import Link from 'next/link'

export function ConsultationHistoryList() {
  const { user } = useAuth()
  const [history, setHistory] = useState<Partial<Consultation>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const doc = await getDoctorByUserId(user.id)
        if (!doc) return
        const data = await getRecentConsultations(doc.id, 5) // Fetch top 5 recent
        setHistory(data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white  transition-colors h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900  transition-colors">Riwayat Konsultasi</h3>
          <p className="text-xs text-slate-400  mt-1">Sesi yang baru saja selesai</p>
        </div>
        <Link href="/doctor/history">
            <button className="p-2 rounded-full hover:bg-slate-50  transition-colors">
            <ArrowUpRight className="w-5 h-5 text-slate-400 " />
            </button>
        </Link>
      </div>

      {loading ? (
         <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-3 w-16 rounded-full opacity-50" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
            ))}
         </div>
      ) : history.length === 0 ? (
         <div className="py-10 text-center text-slate-400  text-sm border-2 border-dashed border-slate-100  rounded-2xl transition-colors">
            Belum ada riwayat konsul.
         </div>
      ) : (
         <div className="space-y-4">
            {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 gap-3 hover:bg-slate-50  rounded-2xl transition-colors cursor-default border border-transparent hover:border-slate-100 ">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            item.status === 'completed' ? 'bg-green-100  text-green-600 ' : 'bg-red-100  text-red-600 '
                        }`}>
                            <History className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900  transition-colors truncate">
                                {item.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                            </p>
                            <p className="text-xs text-slate-400 ">
                                {new Date(item.ended_at || item.created_at || Date.now()).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                         <p className="text-sm font-bold text-slate-900  transition-colors">
                            Rp {(item.total_cost || 0).toLocaleString('id-ID')}
                         </p>
                         {item.rating && (
                            <div className="flex items-center justify-end gap-1 text-xs text-yellow-500">
                                <Star className="w-3 h-3 fill-yellow-500" />
                                <span>{item.rating}</span>
                            </div>
                         )}
                    </div>
                </div>
            ))}
         </div>
      )}
    </Card>
  )
}
