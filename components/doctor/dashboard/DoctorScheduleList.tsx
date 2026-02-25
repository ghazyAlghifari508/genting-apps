'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Clock, Calendar } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getDoctorConsultations } from '@/services/consultationService'
import { getDoctorByUserId } from '@/services/doctorService'
import { useAuth } from '@/hooks/useAuth'
import type { Consultation } from '@/types/consultation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export function DoctorScheduleList() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const load = async () => {
      try {
        const doc = await getDoctorByUserId(user.id)
        if (!doc) return
        
        const fetchSchedules = async () => {
          const data = await getDoctorConsultations(doc.id, { order: 'asc' })
          const upcoming = (data || []).filter(c => 
            c.status === 'scheduled' || c.status === 'ongoing'
          )
          setSchedules(upcoming.slice(0, 5))
        }

        await fetchSchedules()

        // Realtime Subscription
        const subscription = supabase
          .channel('consultation_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'consultations',
              filter: `doctor_id=eq.${doc.id}`
            },
            () => {
              console.log('Consultation changed, refreshing...')
              fetchSchedules()
            }
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (e) {
        console.error("Failed to load schedule", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-800 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-48 rounded-full opacity-50" />
                </div>
                <Skeleton className="w-12 h-6 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-800 transition-colors">
        <div className="flex justify-between items-start mb-4">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Jadwal Konsultasi</h3>
           <Link href="/doctor/consultations" className="text-xs text-doccure-teal font-bold hover:underline">
             Lihat Semua
           </Link>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada jadwal konsultasi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => {
               const date = new Date(schedule.scheduled_at)
               const timeString = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
               
               return (
                 <div key={schedule.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-xl shrink-0 transition-colors">
                       <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{date.toLocaleDateString('id-ID', { month: 'short' })}</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white">{date.getDate()}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate transition-colors">
                         {schedule.user?.full_name || 'Pasien Tanpa Nama'}
                       </h4>
                       <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">
                         <Clock className="w-3 h-3" />
                         {timeString}
                         <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                         {schedule.title || 'Konsultasi Umum'}
                       </div>
                    </div>

                    <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      schedule.status === 'ongoing' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      {schedule.status === 'ongoing' ? 'Live' : 'Booked'}
                    </div>
                 </div>
               )
            })}
          </div>
        )}
      </Card>
      
      {/* Quick Stat (Contextual) */}
      <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-gradient-to-br from-doccure-teal to-teal-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
               <p className="text-sm font-medium text-white/80">Total Sesi Bulan Ini</p>
               <h3 className="text-2xl font-bold text-white">{schedules.length > 0 ? 'Aktif' : '0'}</h3>
            </div>
          </div>
      </Card>
    </div>
  )
}
