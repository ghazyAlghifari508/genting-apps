'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, User, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface Consultation {
  id: string
  scheduled_at: string
  title: string
  status: string
  user_id: string
}

interface UpcomingConsultationsWidgetProps {
  consultations: Consultation[]
  onJoin?: (id: string) => void
}

export default function UpcomingConsultationsWidget({ consultations, onJoin }: UpcomingConsultationsWidgetProps) {
  return (
    <Card className="rounded-[2.5rem] p-8 border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">Jadwal Mendatang</h3>
          <p className="text-sm text-slate-500 font-medium">Jangan lewatkan sesi konsultasi Anda</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-cerulean/10 flex items-center justify-center">
          <Clock className="w-6 h-6 text-cerulean" />
        </div>
      </div>

      <div className="space-y-4">
        {consultations.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-[2rem] bg-slate-50/50 border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">Tidak ada jadwal dalam waktu dekat</p>
          </div>
        ) : (
          consultations.map((item) => (
            <div 
              key={item.id} 
              className="group p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-cerulean/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cerulean/10 group-hover:text-cerulean transition-colors overflow-hidden">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{item.title || 'Konsultasi'}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-cerulean bg-cerulean/5 px-2.5 py-1 rounded-lg">
                        {format(new Date(item.scheduled_at), 'HH:mm', { locale: id })}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {format(new Date(item.scheduled_at), 'dd MMM yyyy', { locale: id })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onJoin?.(item.id)}
                  className="rounded-2xl bg-slate-900 text-white font-bold h-12 px-6 hover:bg-cerulean hover:shadow-lg hover:shadow-cerulean/20 transition-all active:scale-95"
                >
                  Join Room
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Button variant="ghost" className="w-full mt-6 rounded-2xl h-14 font-bold text-slate-400 hover:text-cerulean hover:bg-cerulean/5 transition-all">
        Lihat Kalender Lengkap
      </Button>
    </Card>
  )
}
