'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { 
  Stethoscope, 
  CalendarDays, 
  MessageSquareText, 
  FileBarChart, 
  ChevronRight 
} from 'lucide-react'

const quickAccessItems = [
  {
    title: 'Mulai Konsultasi',
    description: 'Tangani antrian pasien sekarang',
    icon: Stethoscope,
    color: 'bg-doccure-teal',
    textColor: 'text-doccure-teal',
    borderColor: 'border-doccure-teal/20',
    href: '/doctor/consultations',
    gradient: 'from-doccure-teal/10 to-transparent'
  },
  {
    title: 'Jadwal Praktik',
    description: 'Atur ketersediaan waktu Anda',
    icon: CalendarDays,
    color: 'bg-doccure-teal',
    textColor: 'text-doccure-teal',
    borderColor: 'border-doccure-teal/20',
    href: '/doctor/schedule',
    gradient: 'from-doccure-teal/10 to-transparent'
  },
  {
    title: 'Pesan Pasien',
    description: '3 pesan baru belum dibaca',
    icon: MessageSquareText,
    color: 'bg-doccure-teal',
    textColor: 'text-doccure-teal',
    borderColor: 'border-doccure-teal/20',
    href: '/doctor/messages',
    gradient: 'from-doccure-teal/10 to-transparent'
  },
  {
    title: 'Laporan Keuangan',
    description: 'Ringkasan pendapatan bulan ini',
    icon: FileBarChart,
    color: 'bg-medical-orange',
    textColor: 'text-medical-orange',
    borderColor: 'border-medical-orange/20',
    href: '/doctor/earnings',
    gradient: 'from-medical-orange/10 to-transparent'
  }
]

export const QuickAccessGrid = () => {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {quickAccessItems.map((item, index) => (
        <Card 
          key={index}
          onClick={() => router.push(item.href)}
          className={`relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-l-4 ${item.borderColor}`}
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-bl-full opacity-50 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500`} />
          
          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${item.color} bg-opacity-10 ${item.textColor}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-slate-900">
              {item.title}
            </h3>
            <p className="text-sm text-slate-500 group-hover:text-slate-600">
              {item.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
