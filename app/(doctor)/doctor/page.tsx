'use client'

import React, { useState, useEffect } from 'react'
import { DoctorTopHeader } from '@/components/doctor/layout/DoctorTopHeader'
import { MetricsGrid } from '@/components/doctor/dashboard/MetricsGrid'
import { AppointmentTrendChart } from '@/components/doctor/dashboard/AppointmentTrendChart'
import { DoctorScheduleList } from '@/components/doctor/dashboard/DoctorScheduleList'
import { ConsultationHistoryList } from '@/components/doctor/dashboard/ConsultationHistoryList'
import { MessagesWidget } from '@/components/doctor/dashboard/MessagesWidget'
import { getDoctorStats, getDoctorByUserId } from '@/services/doctorService'
import { useAuth } from '@/hooks/useAuth'

interface DoctorDashboardStats {
  totalPatients: number;
  activeConsultations: number;
  todayAppointments: { total: number; completed: number; upcoming: number; };
  monthlyRevenue: number;
  weeklyTrend?: { name: string; value: number; }[];
  statusSummary?: { completed: number; pending: number; };
}

export default function DoctorDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DoctorDashboardStats | null>(null)

  useEffect(() => {
    if (!user) return
    const loadData = async () => {
      try {
        const doc = await getDoctorByUserId(user.id)
        if (doc) {
          const s = await getDoctorStats(doc.id)
          setStats(s as DoctorDashboardStats)
        }
      } catch (err) {
        console.error('Error loading stats:', err)
      }
    }
    loadData()
  }, [user])

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      <DoctorTopHeader />

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Overview</h1>

      {/* 1. Metrics Row */}
      <MetricsGrid stats={stats} />

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
