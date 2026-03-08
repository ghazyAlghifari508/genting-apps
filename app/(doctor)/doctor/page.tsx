'use client'

import React from 'react'
import { DoctorTopHeader } from '@/components/doctor/layout/DoctorTopHeader'
import { MetricsGrid } from '@/components/doctor/dashboard/MetricsGrid'
import { AppointmentTrendChart } from '@/components/doctor/dashboard/AppointmentTrendChart'
import { DoctorScheduleList } from '@/components/doctor/dashboard/DoctorScheduleList'
import { ConsultationHistoryList } from '@/components/doctor/dashboard/ConsultationHistoryList'
import { MessagesWidget } from '@/components/doctor/dashboard/MessagesWidget'
import { Skeleton } from '@/components/ui/skeleton'
import { useDoctorContext } from '@/components/providers/Providers'


export default function DoctorDashboardPage() {
  const doctorContext = useDoctorContext()
  const stats = doctorContext?.stats
  const loading = doctorContext?.loading

  if (loading && !stats) {
    return (
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
        <DoctorTopHeader />
        <div className="space-y-6">
          <Skeleton className="h-12 w-48 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Overview</h1>

      {/* 1. Metrics Row */}
      <MetricsGrid stats={stats || null} />

      {/* 2. Main Grid: Charts & Schedule */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Trends Chart */}
             <div className="space-y-6">
                <AppointmentTrendChart data={stats?.weeklyTrend} summary={stats?.statusSummary} />
             </div>
             
             {/* Consultation History */}
             <ConsultationHistoryList />
           </div>
           
           {/* Messages Widget */}
           <MessagesWidget />
        </div>

        {/* Right Column (1/3 width) - Schedule & Demographics */}
        <div className="xl:col-span-1">
           <DoctorScheduleList />
        </div>
      </div>
    </div>
  )
}
