'use client'

import React from 'react'
import { TrendingUp, Users, Clock, Star, Calendar, MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ActivityData {
  todayPatients: number
  weeklyGrowth: number
  avgResponseTime: string
  patientSatisfaction: number
  upcomingAppointments: number
  unreadMessages: number
}

export const ActivitySummary = React.memo(function ActivitySummary({
  todayPatients = 12,
  weeklyGrowth = 15.3,
  avgResponseTime = "2 menit",
  patientSatisfaction = 4.8,
  upcomingAppointments = 8,
  unreadMessages = 5
}: ActivityData) {
  const activities = [
    {
      title: "Pasien Hari Ini",
      value: todayPatients,
      subtitle: "Total konsultasi",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: null
    },
    {
      title: "Pertumbuhan Mingguan",
      value: `${weeklyGrowth}%`,
      subtitle: "Dari minggu lalu",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "up"
    },
    {
      title: "Waktu Respon",
      value: avgResponseTime,
      subtitle: "Rata-rata",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: null
    },
    {
      title: "Kepuasan Pasien",
      value: patientSatisfaction.toFixed(1),
      subtitle: "Dari 5.0",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      trend: "up"
    }
  ]

  const upcomingItems = [
    { time: "09:00", patient: "Sarah Putri", type: "Konsultasi Baru" },
    { time: "10:30", patient: "Budi Santoso", type: "Follow-up" },
    { time: "14:00", patient: "Maya Indah", type: "Konsultasi Baru" }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Stats */}
      <div className="lg:col-span-2">
        <Card className="rounded-[2.5rem] border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Ringkasan Aktivitas</h3>
              <p className="text-sm text-slate-500">Performa praktik Anda</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.map((activity, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 rounded-xl ${activity.bgColor} flex items-center justify-center mx-auto mb-3`}>
                  <activity.icon className={`w-6 h-6 ${activity.color}`} />
                </div>
                <p className="text-xl font-black text-slate-900">{activity.value}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.subtitle}</p>
                {activity.trend === 'up' && (
                  <div className="text-xs text-green-600 mt-1">↑ 12%</div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Bars */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Target Mingguan</span>
                <span className="font-bold text-slate-900">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Ketersediaan</span>
                <span className="font-bold text-slate-900">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming & Messages */}
      <div className="space-y-6">
        {/* Upcoming Appointments */}
        <Card className="rounded-[2.5rem] border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-slate-900">Janji Temu</h3>
            <div className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
              {upcomingAppointments}
            </div>
          </div>
          <div className="space-y-3">
            {upcomingItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 backdrop-blur-sm hover:bg-white/80 transition-all cursor-pointer">
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-500">{item.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{item.patient}</p>
                  <p className="text-xs text-slate-500">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Unread Messages */}
        <Card className="rounded-[2.5rem] border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-slate-900">Pesan Baru</h3>
            <div className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
              {unreadMessages}
            </div>
          </div>
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Tidak ada pesan baru</p>
          </div>
        </Card>
      </div>
    </div>
  )
})
