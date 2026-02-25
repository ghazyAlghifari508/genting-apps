'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MoreVertical, 
  Video, 
  Users 
} from 'lucide-react'

// Mock Data - In real app this would come from props
const mockAppointments = [
  {
    id: 1,
    patientName: 'Ny. Rina Wulansari',
    time: '09:00 - 09:30',
    type: 'Telekonsultasi',
    status: 'In Progress',
    avatar: 'RW',
    color: 'bg-blue-100 text-blue-600',
    condition: 'Pemeriksaan Rutin Kehamilan (Trimester 2)'
  },
  {
    id: 2,
    patientName: 'Ny. Budi Santoso',
    time: '10:00 - 10:30',
    type: 'Kunjungan Klinik',
    status: 'Pending',
    avatar: 'BS',
    color: 'bg-purple-100 text-purple-600',
    condition: 'Keluhan Mual & Pusing'
  },
  {
    id: 3,
    patientName: 'Ny. Siti Aminah',
    time: '11:00 - 11:30',
    type: 'Telekonsultasi',
    status: 'Confirmed',
    avatar: 'SA',
    color: 'bg-orange-100 text-orange-600',
    condition: 'Konsultasi Nutrisi & Gizi'
  },
  {
    id: 4,
    patientName: 'Ny. Dewi Lestari',
    time: '13:00 - 13:30',
    type: 'Telekonsultasi',
    status: 'Confirmed',
    avatar: 'DL',
    color: 'bg-green-100 text-green-600',
    condition: 'Pemeriksaan Pasca Melahirkan'
  }
]

export const AppointmentTimeline = () => {
  const [view, setView] = useState<'timeline' | 'list'>('timeline')

  return (
    <Card className="p-6 h-full border-none shadow-sm bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Jadwal Hari Ini
          </h2>
          <p className="text-sm text-slate-500">
            Selasa, 18 Februari 2026
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setView('timeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === 'timeline' 
                ? 'bg-white text-doccure-teal shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === 'list' 
                ? 'bg-white text-doccure-teal shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-slate-100">
        {mockAppointments.map((apt) => (
          <div key={apt.id} className="relative flex gap-6 group">
            <div className="absolute left-6 ml-[-5px] mt-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ring-2 ring-doccure-teal/20 bg-doccure-teal z-10" />
            
            <div className={`
              flex-1 p-4 rounded-xl border border-slate-100 bg-slate-50/50 
              hover:bg-white hover:shadow-md hover:border-doccure-teal/20 
              transition-all duration-300 cursor-pointer group-hover:pl-5
            `}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={apt.status === 'In Progress' ? 'default' : 'secondary'} 
                    className={`
                      ${apt.status === 'In Progress' ? 'bg-doccure-teal hover:bg-doccure-teal/90' : 'bg-slate-200 text-slate-600'}
                    `}
                  >
                    {apt.time}
                  </Badge>
                  {apt.type === 'Telekonsultasi' ? (
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <button className="text-slate-300 hover:text-slate-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${apt.color}`}>
                  {apt.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{apt.patientName}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{apt.condition}</p>
                </div>
              </div>

              {apt.status === 'In Progress' && (
                <Button size="sm" className="w-full bg-doccure-teal hover:bg-doccure-teal/90 text-white h-8 text-xs font-semibold rounded-lg">
                  Lanjutkan Konsultasi
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="ghost" className="text-doccure-teal text-sm hover:bg-blue-50">
          Lihat Semua Jadwal
        </Button>
      </div>
    </Card>
  )
}
