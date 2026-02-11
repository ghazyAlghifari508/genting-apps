'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import { getDoctorByUserId } from '@/lib/doctorService'
import { 
  getUpcomingConsultations, 
  getActiveConsultation, 
  getRecentConsultations, 
  getTodayEarnings, 
  getMonthlyStats 
} from '@/lib/consultationService'
import { getUnreadNotifications, markAsRead } from '@/lib/notificationService'

// UI Components
import TopStatsBar from '@/components/doctor/dashboard/TopStatsBar'
import UpcomingConsultationsWidget from '@/components/doctor/dashboard/UpcomingConsultationsWidget'
import ActiveConsultationWidget from '@/components/doctor/dashboard/ActiveConsultationWidget'
import RecentConsultationsWidget from '@/components/doctor/dashboard/RecentConsultationsWidget'
import NotificationsPanel from '@/components/doctor/dashboard/NotificationsPanel'
import DoctorStatsSection from '@/components/doctor/dashboard/DoctorStatsSection'
import { LoadingScreen } from '@/components/ui/loading-screen'

interface DashboardState {
  upcoming: any[]
  active: any | null
  recent: any[]
  earnings: number
  stats: any | null
  notifications: any[]
}

export default function DoctorDashboardPage() {
  const { user } = useAuth()
  const { role, loading: roleLoading } = useUserRole(user?.id)
  const [doctor, setDoctor] = useState<any>(null)
  const [data, setData] = useState<DashboardState>({
    upcoming: [],
    active: null,
    recent: [],
    earnings: 0,
    stats: null,
    notifications: []
  })

  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (roleLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    // Note: If role is still 'user' but they have a doctor profile, we might want to allow it
    // but here we follow the role-based redirect logic.
    if (role !== 'doctor') {
      router.push('/dashboard')
      return
    }

    const loadData = async () => {
      try {
        const doctorData = await getDoctorByUserId(user.id)
        if (!doctorData) {
          router.push('/dashboard')
          return
        }
        setDoctor(doctorData)

        // Load all dashboard metrics
        const [upcoming, active, recent, earnings, stats, notifs] = await Promise.all([
          getUpcomingConsultations(doctorData.id),
          getActiveConsultation(doctorData.id),
          getRecentConsultations(doctorData.id),
          getTodayEarnings(doctorData.id),
          getMonthlyStats(doctorData.id),
          getUnreadNotifications(doctorData.id)
        ])

        setData({ upcoming, active, recent, earnings, stats, notifications: notifs })
      } catch (error) {
        console.error('Error loading doctor data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Setup real-time notifications
    const channel = supabase
      .channel('notif-status')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'doctor_notifications' },
        (payload) => {
          setData(prev => ({ ...prev, notifications: [payload.new, ...prev.notifications] }))
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user, role, roleLoading, router, supabase])

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => n.id === id ? { ...n, is_read: true } : n)
      }))
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading || roleLoading) {
    return <LoadingScreen message="Menyiapkan Dashboard Dokter..." />
  }

  return (
    <div className="min-h-screen bg-floral pb-20">
      <TopStatsBar 
        isOnline={true}
        todayEarnings={data.earnings}
        activeCount={data.upcoming.length}
        avgRating={data.stats?.avgRating || '0.0'}
        unreadCount={data.notifications.filter(n => !n.is_read).length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Row 1: Upcoming & Active Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 xl:col-span-7">
            <UpcomingConsultationsWidget consultations={data.upcoming} />
          </div>
          <div className="lg:col-span-12 xl:col-span-5">
            <ActiveConsultationWidget consultation={data.active} doctor={doctor} />
          </div>
        </div>

        {/* Row 2: Recent & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 xl:col-span-7">
            <RecentConsultationsWidget consultations={data.recent} />
          </div>
          <div className="lg:col-span-12 xl:col-span-5">
            <NotificationsPanel 
              notifications={data.notifications} 
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        </div>

        {/* Row 3: Performance Charts */}
        <DoctorStatsSection stats={data.stats} />
      </div>
    </div>
  )
}
