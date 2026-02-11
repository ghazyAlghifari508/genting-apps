'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { History, Star, ArrowUpRight, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface RecentConsultation {
  id: string
  ended_at: string
  status: string
  total_cost: number
  rating: number
  user_id: string
}

interface RecentConsultationsWidgetProps {
  consultations: RecentConsultation[]
}

export default function RecentConsultationsWidget({ consultations }: RecentConsultationsWidgetProps) {
  return (
    <Card className="rounded-[2.5rem] p-8 border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">Riwayat Sesi</h3>
          <p className="text-sm text-slate-500 font-medium">Tinjau sesi konsultasi sebelumnya</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-sea-green/10 flex items-center justify-center">
          <History className="w-6 h-6 text-sea-green" />
        </div>
      </div>

      <div className="space-y-4">
        {consultations.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-[2rem] bg-slate-50/50 border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">Belum ada riwayat sesi</p>
          </div>
        ) : (
          consultations.map((item) => (
            <div 
              key={item.id} 
              className="p-5 rounded-[2rem] bg-slate-50/30 border border-slate-100 hover:bg-white transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                      <MessageSquare className="w-5 h-5 text-slate-400" />
                   </div>
                   <div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        {item.ended_at ? format(new Date(item.ended_at), 'dd MMM yyyy • HH:mm', { locale: id }) : 'Waktu tidak tersedia'}
                      </span>
                      <p className="text-sm font-bold text-slate-900">Sesi Selesai - Rp {item.total_cost?.toLocaleString('id-ID') || 0}</p>
                   </div>
                </div>
                
                {item.rating > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span className="text-xs font-black text-amber-600">{item.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold h-10 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                  Detail Rekamanan
                </Button>
                <Button size="sm" className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-0 text-slate-400 hover:text-cerulean hover:border-cerulean/20 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Button variant="ghost" className="w-full mt-6 rounded-2xl h-14 font-bold text-slate-400 hover:text-sea-green hover:bg-sea-green/5 transition-all">
        Lihat Semua Riwayat
      </Button>
    </Card>
  )
}
