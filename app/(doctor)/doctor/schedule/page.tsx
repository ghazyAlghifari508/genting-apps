'use client'

import { useState } from 'react'
import { upsertSchedule, updateSchedule, deleteSchedule } from '@/services/doctorService'
import { useDoctorContext } from '@/components/providers/Providers'
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
  const doctorContext = useDoctorContext()
  const doctorId = doctorContext?.doctor?.id
  const schedules = (doctorContext?.schedules || []) as DoctorSchedule[]
  const loading = doctorContext?.loading
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const addSlot = async (dayOfWeek: number) => {
    if (!doctorId) return
    setSaving(true)
    try {
      await upsertSchedule({ 
        doctor_id: doctorId, 
        day_of_week: dayOfWeek, 
        start_time: '09:00', 
        end_time: '17:00', 
        is_available: true 
      })

      await doctorContext?.loadDoctorData(true) // Refresh global data
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
      await updateSchedule(id, updates)
      await doctorContext?.loadDoctorData(true)
    } catch (error) {
      console.error('Error updating slot:', error)
      toast({ title: 'Gagal update jadwal', variant: 'destructive' })
    }
  }

  const deleteSlot = async (id: string) => {
    try {
      await deleteSchedule(id)
      await doctorContext?.loadDoctorData(true)
      toast({ title: 'Jadwal dihapus' })
    } catch (error) {
      console.error('Error deleting slot:', error)
      toast({ title: 'Gagal hapus jadwal', variant: 'destructive' })
    }
  }

  if (loading && schedules.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
        <DoctorTopHeader title="Jadwal Praktik" isLoading />
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
      <DoctorTopHeader title="Jadwal Praktik" isLoading={loading} />

      <main className="space-y-4">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const daySlots = schedules.filter((s) => s.day_of_week === dayIndex)
          return (
            <motion.div key={dayIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dayIndex * 0.05 }}>
              <Card className="p-6 bg-gradient-to-br from-cerulean to-cerulean/90 text-white rounded-[2.5rem] border-none shadow-xl shadow-cerulean/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">{dayName}</h3>
                  <Button variant="ghost" size="sm" onClick={() => addSlot(dayIndex)} disabled={saving} className="rounded-xl text-white hover:bg-white/20">
                    <Plus size={16} className="mr-1" /> Tambah
                  </Button>
                </div>
                {daySlots.length === 0 ? (
                  <p className="text-xs text-white/80 py-2">Tidak ada jadwal</p>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 hover:bg-white/80 transition-all">
                        <Clock size={14} className="text-cerulean" />
                        <input type="time" value={slot.start_time} onChange={(e) => updateSlot(slot.id, { start_time: e.target.value })} className="text-sm border rounded-lg px-2 py-1 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cerulean/50" />
                        <span className="text-cerulean font-bold"> - </span>
                        <input type="time" value={slot.end_time} onChange={(e) => updateSlot(slot.id, { end_time: e.target.value })} className="text-sm border rounded-lg px-2 py-1 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cerulean/50" />
                        <label className="flex items-center gap-2 cursor-pointer ml-2 text-slate-700">
                          <input type="checkbox" checked={slot.is_available} onChange={(e) => updateSlot(slot.id, { is_available: e.target.checked })} className="rounded focus:ring-2 focus:ring-cerulean text-cerulean" />
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
