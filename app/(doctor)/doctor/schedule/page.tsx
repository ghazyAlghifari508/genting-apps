'use client'

import { useEffect, useState } from 'react'
import { getDoctorByUserId, getDoctorSchedules, upsertSchedule, updateSchedule, deleteSchedule } from '@/services/doctorService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, Clock } from 'lucide-react'
import type { DoctorSchedule } from '@/types/doctor'
import { DAY_NAMES } from '@/types/doctor'
import { DoctorTopHeader } from '@/components/doctor/layout/DoctorTopHeader'

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login'); return }

    const load = async () => {
      try {
        const doc = await getDoctorByUserId(user.id)
        if (!doc) { router.push('/doctor/profile'); return }
        setDoctorId(doc.id)

        const data = await getDoctorSchedules(doc.id)
        setSchedules(data || [])
      } catch (error) {
        console.error('Error loading schedule:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router, user, authLoading])

  const addSlot = async (dayOfWeek: number) => {
    if (!doctorId) return
    setSaving(true)
    try {
      const data = await upsertSchedule({ 
        doctor_id: doctorId, 
        day_of_week: dayOfWeek, 
        start_time: '09:00', 
        end_time: '17:00', 
        is_available: true 
      })

      if (data) setSchedules((prev) => [...prev, data].sort((a, b) => a.day_of_week - b.day_of_week))
      toast({ title: 'Jadwal ditambahkan!' })
    } catch (error) {
      console.error('Error adding slot:', error)
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const updateSlot = async (id: string, updates: Partial<DoctorSchedule>) => {
    try {
      const updated = await updateSchedule(id, updates)
      if (updated) setSchedules((prev) => prev.map((s) => s.id === id ? updated : s))
    } catch (error) {
      console.error('Error updating slot:', error)
      toast({ title: 'Gagal update jadwal', variant: 'destructive' })
    }
  }

  const deleteSlot = async (id: string) => {
    try {
      await deleteSchedule(id)
      setSchedules((prev) => prev.filter((s) => s.id !== id))
      toast({ title: 'Jadwal dihapus' })
    } catch (error) {
      console.error('Error deleting slot:', error)
      toast({ title: 'Gagal hapus jadwal', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
        <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
           <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
        <main className="max-w-3xl mx-auto space-y-4">
           {[1, 2, 3].map(i => (
             <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />
           ))}
        </main>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      <DoctorTopHeader title="Jadwal Praktik" showSearch={false} />

      <main className="space-y-4">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const daySlots = schedules.filter((s) => s.day_of_week === dayIndex)
          return (
            <motion.div key={dayIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dayIndex * 0.05 }}>
              <Card className="p-5 rounded-[2.5rem] border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900">{dayName}</h3>
                  <Button variant="ghost" size="sm" onClick={() => addSlot(dayIndex)} disabled={saving} className="rounded-xl text-doccure-teal hover:bg-doccure-teal/10">
                    <Plus size={16} className="mr-1" /> Tambah
                  </Button>
                </div>
                {daySlots.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">Tidak ada jadwal</p>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 backdrop-blur-sm border border-slate-100/50 hover:bg-white/80 transition-all">
                        <Clock size={14} className="text-slate-400" />
                        <input type="time" value={slot.start_time} onChange={(e) => updateSlot(slot.id, { start_time: e.target.value })} className="text-sm border rounded-lg px-2 py-1 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-doccure-teal/50" />
                        <span className="text-xs text-slate-400">-</span>
                        <input type="time" value={slot.end_time} onChange={(e) => updateSlot(slot.id, { end_time: e.target.value })} className="text-sm border rounded-lg px-2 py-1 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-doccure-teal/50" />
                        <label className="flex items-center gap-1 text-xs cursor-pointer ml-auto">
                          <input type="checkbox" checked={slot.is_available} onChange={(e) => updateSlot(slot.id, { is_available: e.target.checked })} className="rounded focus:ring-2 focus:ring-doccure-teal" />
                          Tersedia
                        </label>
                        <button onClick={() => deleteSlot(slot.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )
        })}
      </main>
    </div>
  )
}
