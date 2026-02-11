'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { useToast } from '@/components/ui/use-toast'
import { Save, ArrowLeft, User, Stethoscope, DollarSign, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import type { Doctor } from '@/types/doctor'
import { SPECIALIZATIONS } from '@/types/doctor'

export default function DoctorProfilePage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', bio: '',
    specialization: 'Umum', license_number: '', years_of_experience: 0,
    hourly_rate: 50000, profile_picture_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      setForm((f) => ({ ...f, email: user.email || '' }))

      const { data: doc } = await supabase.from('doctors').select('*').eq('user_id', user.id).single()
      if (doc) {
        setDoctorId(doc.id)
        setForm({
          full_name: doc.full_name || '',
          email: doc.email || user.email || '',
          phone: doc.phone || '',
          bio: doc.bio || '',
          specialization: doc.specialization || 'Umum',
          license_number: doc.license_number || '',
          years_of_experience: doc.years_of_experience || 0,
          hourly_rate: doc.hourly_rate || 50000,
          profile_picture_url: doc.profile_picture_url || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [supabase, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const payload = { ...form, user_id: user.id, updated_at: new Date().toISOString() }

      if (doctorId) {
        await supabase.from('doctors').update(payload).eq('id', doctorId)
      } else {
        const { data } = await supabase.from('doctors').insert(payload).select().single()
        if (data) setDoctorId(data.id)
      }

      toast({ title: 'Profil disimpan!', description: 'Data profil dokter berhasil diperbarui.' })
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan profil.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const completionFields = ['full_name', 'email', 'phone', 'specialization', 'license_number', 'hourly_rate'] as const
  const completion = Math.round((completionFields.filter((f) => form[f]).length / completionFields.length) * 100)

  if (loading) return <LoadingScreen message="Memuat profil..." fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-8">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/doctor">
              <Button variant="ghost" size="sm" className="rounded-xl"><ArrowLeft size={18} /></Button>
            </Link>
            <h1 className="text-lg font-black text-slate-900">Profil Dokter</h1>
          </div>
          <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-blue-600 hover:bg-blue-700 font-bold">
            <Save size={16} className="mr-2" />{saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Completion */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-slate-700">Kelengkapan Profil</p>
            <span className="text-sm font-black text-blue-600">{completion}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${completion}%` }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
          </div>
        </Card>

        {/* Personal Info */}
        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-blue-500" />
            <h2 className="font-bold text-slate-900">Informasi Pribadi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Lengkap *</label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="rounded-xl" placeholder="Dr. Nama Lengkap" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Email *</label>
              <Input value={form.email} readOnly className="rounded-xl bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Telepon *</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">URL Foto Profil</label>
              <Input value={form.profile_picture_url} onChange={(e) => setForm({ ...form, profile_picture_url: e.target.value })} className="rounded-xl" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 mb-1 block">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ceritakan tentang diri Anda..." />
              <p className="text-xs text-slate-400 mt-1">{form.bio.length}/500</p>
            </div>
          </div>
        </Card>

        {/* Professional Info */}
        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope size={18} className="text-green-500" />
            <h2 className="font-bold text-slate-900">Informasi Profesional</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Spesialisasi *</label>
              <select value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500">
                {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Nomor STR *</label>
              <Input value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} className="rounded-xl" placeholder="STR-XXXXXXXX" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Pengalaman (tahun)</label>
              <Input type="number" value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: Number(e.target.value) })} className="rounded-xl" min={0} />
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-purple-500" />
            <h2 className="font-bold text-slate-900">Tarif Konsultasi</h2>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Tarif per Jam (IDR) *</label>
            <Input type="number" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: Number(e.target.value) })} className="rounded-xl" min={0} step={5000} />
            <p className="text-xs text-slate-400 mt-1">Rp {form.hourly_rate.toLocaleString('id-ID')}/jam</p>
          </div>
        </Card>
      </main>
    </div>
  )
}
