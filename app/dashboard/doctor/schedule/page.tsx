'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Plus, Trash2, Clock } from 'lucide-react'
import Link from 'next/link'
import type { DoctorSchedule } from '@/types/doctor'
import { DAY_NAMES } from '@/types/doctor'

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: doc } = await supabase.from('doctors').select('id').eq('user_id', user.id).single()
      if (!doc) { router.push('/dashboard/doctor/profile'); return }
      setDoctorId(doc.id)

      const { data } = await supabase.from('doctor_schedules').select('*').eq('doctor_id', doc.id).order('day_of_week').order('start_time')
      setSchedules(data || [])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  const addSlot = async (dayOfWeek: number) => {
    if (!doctorId) return
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('doctor_schedules')
        .insert({ doctor_id: doctorId, day_of_week: dayOfWeek, start_time: '09:00', end_time: '17:00', is_available: true })
        .select()
        .single()

      if (error) throw error
      if (data) setSchedules((prev) => [...prev, data].sort((a, b) => a.day_of_week - b.day_of_week))
      toast({ title: 'Jadwal ditambahkan!' })
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const updateSlot = async (id: string, updates: Partial<DoctorSchedule>) => {
    const { error } = await supabase.from('doctor_schedules').update(updates).eq('id', id)
    if (!error) setSchedules((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSlot = async (id: string) => {
    await supabase.from('doctor_schedules').delete().eq('id', id)
    setSchedules((prev) => prev.filter((s) => s.id !== id))
    toast({ title: 'Jadwal dihapus' })
  }

  if (loading) return <LoadingScreen message="Memuat jadwal..." fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-8">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard/doctor"><Button variant="ghost" size="sm" className="rounded-xl"><ArrowLeft size={18} /></Button></Link>
          <h1 className="text-lg font-black text-slate-900">Jadwal Praktik</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const daySlots = schedules.filter((s) => s.day_of_week === dayIndex)
          return (
            <motion.div key={dayIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dayIndex * 0.05 }}>
              <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900">{dayName}</h3>
                  <Button variant="ghost" size="sm" onClick={() => addSlot(dayIndex)} disabled={saving} className="rounded-xl text-blue-500 hover:bg-blue-50">
                    <Plus size={16} className="mr-1" /> Tambah
                  </Button>
                </div>
                {daySlots.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">Tidak ada jadwal</p>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                        <Clock size={14} className="text-slate-400" />
                        <input type="time" value={slot.start_time} onChange={(e) => updateSlot(slot.id, { start_time: e.target.value })} className="text-sm border rounded-lg px-2 py-1 bg-white" />
                        <span className="text-xs text-slate-400">-</span>
                        <input type="time" value={slot.end_time} onChange={(e) => updateSlot(slot.id, { end_time: e.target.value })} className="text-sm border rounded-lg px-2 py-1 bg-white" />
                        <label className="flex items-center gap-1 text-xs cursor-pointer ml-auto">
                          <input type="checkbox" checked={slot.is_available} onChange={(e) => updateSlot(slot.id, { is_available: e.target.checked })} className="rounded" />
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
