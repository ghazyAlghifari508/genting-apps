'use client'

import React from 'react'
import { Video, MessageSquare, Calendar, DollarSign, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface QuickAction {
  title: string
  description: string
  icon: LucideIcon
  color: string
  action: () => void
  badge?: string | number
}

export const QuickActions = React.memo(function QuickActions() {
  const router = useRouter()

  const quickActions: QuickAction[] = [
    {
      title: "Mulai Konsultasi",
      description: "Mulai sesi dengan pasien",
      icon: Video,
      color: "bg-sea-green/20 text-cerulean hover:bg-sea-green/30",
      action: () => router.push('/doctor/consultations')
    },
    {
      title: "Jadwal Hari Ini",
      description: "Lihat jadwal praktik",
      icon: Calendar,
      color: "bg-cerulean/10 text-cerulean hover:bg-cerulean/20",
      action: () => router.push('/doctor/schedule'),
      badge: "3"
    },
    {
      title: "Pesan Baru",
      description: "Chat dengan pasien",
      icon: MessageSquare,
      color: "bg-slate-100 text-slate-600 hover:bg-slate-200",
      action: () => router.push('/doctor/chat'),
      badge: "5"
    },
    {
      title: "Laporan Keuangan",
      description: "Lihat pendapatan",
      icon: DollarSign,
      color: "bg-sea-green/20 text-cerulean hover:bg-sea-green/30",
      action: () => router.push('/doctor/earnings')
    }
  ]

  return (
    <Card className="rounded-[2.5rem] border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-black text-slate-900">Akses Cepat</h3>
          <p className="text-sm text-slate-500">Tindakan yang sering dilakukan</p>
        </div>
        <Button variant="ghost" size="sm" className="text-cerulean hover:text-cerulean/80 transition-colors">
          Lihat Semua
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={action.action}
            className={`h-auto p-4 flex flex-col items-center gap-3 rounded-xl border-0 transition-all ${action.color}`}
          >
            <div className="relative">
              <action.icon className="w-6 h-6" />
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {action.badge}
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">{action.title}</p>
              <p className="text-xs text-slate-600 mt-1">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
})
