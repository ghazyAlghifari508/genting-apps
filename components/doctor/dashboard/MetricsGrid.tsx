'use client'

import React from 'react'
import { StatCard, StatProgress } from '@/components/doctor/dashboard/StatCard'
import { 
  Users, 
  UserRoundCheck, 
  CalendarCheck, 
  DollarSign
} from 'lucide-react'

// Mock Data for Bars
const MockBars = () => (
  <div className="flex items-end gap-[2px] h-10 w-full mt-2">
    {[35, 60, 45, 70, 50, 65, 40, 55, 75, 50, 60, 45, 35, 60, 45, 70, 50, 65, 40, 55, 75, 50, 60].map((h, i) => (
      <div 
        key={i} 
        className={`w-full rounded-t-sm transition-colors ${i % 2 === 0 ? 'bg-doccure-teal/80' : 'bg-slate-200 dark:bg-slate-700'}`} 
        style={{ height: `${h}%` }} 
      />
    ))}
  </div>
)

const MockLines = () => (
  <div className="flex items-end gap-[2px] h-10 w-full mt-2">
    {[20, 40, 30, 50, 35, 55, 25, 45, 60, 40, 50, 35, 20, 40, 30, 50, 35, 55, 25, 45, 60, 40, 50].map((h, i) => (
      <div 
        key={i} 
        className={`w-full rounded-t-sm transition-colors ${i % 3 === 0 ? 'bg-medical-red/60' : 'bg-slate-200 dark:bg-slate-700'}`} 
        style={{ height: `${h}%` }} 
      />
    ))}
  </div>
)

interface MetricsGridProps {
  stats: {
    totalPatients: number
    activeConsultations: number
    todayAppointments: {
      total: number
      completed: number
      upcoming: number
    }
    monthlyRevenue: number
  } | null
}

export const MetricsGrid = ({ stats }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* 1. Total Patients */}
      <StatCard 
        title="Total Patients" 
        value={stats?.totalPatients?.toString() || "0"} 
        icon={Users}
        chart={<MockBars />}
        footer={
          <div className="flex justify-between items-end">
            <div className="text-xs">
              <span className="text-slate-400">Total</span>
              <p className="font-bold text-slate-700 dark:text-white transition-colors">{stats?.totalPatients || 0}</p>
            </div>
          </div>
        }
      />

      {/* 2. Active Consultations */}
      <StatCard 
        title="Active Consultations" 
        value={stats?.activeConsultations?.toString() || "0"} 
        icon={UserRoundCheck}
        chart={<MockLines />}
        footer={
          <div className="flex justify-between items-end">
            <div className="text-xs">
              <span className="text-slate-400">Ongoing</span>
              <p className="font-bold text-slate-700 dark:text-white transition-colors">{stats?.activeConsultations || 0}</p>
            </div>
          </div>
        }
      />

      {/* 3. Today's Appointments */}
      <StatCard 
        title="Today's Appointments" 
        value={stats?.todayAppointments?.total?.toString() || "0"} 
        icon={CalendarCheck}
        footer={
          <div className="flex gap-4 mt-2">
            <div className="flex-1 space-y-3">
               <StatProgress label="Completed" value={stats?.todayAppointments?.completed || 0} total={stats?.todayAppointments?.total || 1} color="bg-yellow-400" />
            </div>
            <div className="flex-1 space-y-3">
               <StatProgress label="Upcoming" value={stats?.todayAppointments?.upcoming || 0} total={stats?.todayAppointments?.total || 1} color="bg-slate-200" />
            </div>
          </div>
        }
      />

      {/* 4. Monthly Revenue */}
      <StatCard 
        title="Monthly Revenue" 
        value={`Rp ${stats?.monthlyRevenue?.toLocaleString('id-ID') || "0"}`} 
        icon={DollarSign}
        footer={
          <div className="flex gap-4 mt-2">
             <div className="flex-1 space-y-3">
               <StatProgress label="This Month" value={stats?.monthlyRevenue || 0} total={stats?.monthlyRevenue || 1} color="bg-doccure-teal" />
            </div>
          </div>
        }
      />
    </div>
  )
}
