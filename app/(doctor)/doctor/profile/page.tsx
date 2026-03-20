'use client'

import { useEffect, useState, useRef } from 'react'
import { upsertDoctorProfile } from '@/services/doctorService'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { Save, User, Stethoscope, DollarSign } from 'lucide-react'
import { SPECIALIZATIONS } from '@/types/doctor'
import { useDoctorContext } from '@/components/providers/Providers'
import { DoctorTopHeader } from '@/components/doctor/layout/DoctorTopHeader'

export default function DoctorProfilePage() {
  const doctorContext = useDoctorContext()
  const doc = doctorContext?.doctor
  const loading = doctorContext?.loading
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', bio: '',
    specialization: 'Umum', license_number: '', years_of_experience: 0,
    hourly_rate: 50000, profile_picture_url: '',
  })
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const initializedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!doc && !user) return

    // Track initialization with a unique key based on relevant data
    const currentDataKey = `${user?.id || 'no-user'}_${doc?.id || 'no-doc'}_${doc?.updated_at || 'no-update'}`
    if (initializedRef.current === currentDataKey) return

    // Hallucination Guard: Prioritize user.email if doc.email is suspicious or missing
    const rawEmail = doc?.email || user?.email || ''
    const isSuspicious = rawEmail.includes('sakura.121b') || rawEmail.endsWith('@genting.id')
    const finalEmail = isSuspicious ? (user?.email || rawEmail) : rawEmail

    setForm({
      full_name: doc?.full_name || '',
      email: finalEmail,
      phone: doc?.phone || '',
      bio: doc?.bio || '',
      specialization: doc?.specialization || 'Umum',
      license_number: doc?.license_number || '',
      years_of_experience: doc?.years_of_experience || 0,
      hourly_rate: doc?.hourly_rate || 50000,
      profile_picture_url: doc?.profile_picture_url || '',
    })

    initializedRef.current = currentDataKey
  }, [doc, user?.id, user?.email])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await upsertDoctorProfile({
        user_id: user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        specialization: form.specialization,
        license_number: form.license_number,
        years_of_experience: form.years_of_experience,
        hourly_rate: form.hourly_rate,
        profile_picture_url: form.profile_picture_url,
      })

      await doctorContext?.loadDoctorData(true)
      toast({ title: 'Profil disimpan!', description: 'Data profil dokter berhasil diperbarui.' })
    } catch (error) {
      console.error('Error saving doctor profile:', error)
      toast({ title: 'Error', description: 'Gagal menyimpan profil.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const completionFields = ['full_name', 'email', 'phone', 'specialization', 'license_number', 'hourly_rate'] as const
  const completion = Math.round((completionFields.filter((f) => form[f]).length / completionFields.length) * 100)

  if (loading && !doc) {
    return (
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
        <DoctorTopHeader title="Pengaturan Profil" isLoading />

        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white space-y-3">
             <Skeleton className="h-4 w-32 rounded-full" />
             <Skeleton className="h-3 w-full rounded-full" />
          </Card>
          <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white space-y-4">
             <Skeleton className="h-6 w-48 rounded-md" />
             <div className="grid grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="space-y-2">
                   <Skeleton className="h-3 w-20 rounded-full" />
                   <Skeleton className="h-10 w-full rounded-xl" />
                 </div>
               ))}
             </div>
          </Card>
          <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white space-y-4">
             <Skeleton className="h-6 w-48 rounded-md" />
             <div className="grid grid-cols-2 gap-4">
               {[1, 2].map(i => (
                 <div key={i} className="space-y-2">
                   <Skeleton className="h-3 w-20 rounded-full" />
                   <Skeleton className="h-10 w-full rounded-xl" />
                 </div>
               ))}
             </div>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      <DoctorTopHeader title="Pengaturan Profil" isLoading={loading} />
      
      <div className="flex items-center justify-end mb-6">
        <Button onClick={handleSave} disabled={saving} className="rounded-full bg-cerulean hover:bg-[#0c594a] text-white px-6 h-12 font-bold shadow-md ml-auto transition-all">
          <Save size={18} className="mr-2" />{saving ? 'Menyimpan...' : 'Simpan Profil'}
        </Button>
      </div>

      <main className="space-y-6">
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-slate-700">Kelengkapan Profil</p>
            <span className="text-sm font-black text-cerulean">{completion}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${completion}%` }} className="h-full bg-gradient-to-r from-cerulean to-sea-green rounded-full" />
          </div>
        </Card>

        {/* Personal Info */}
        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-cerulean" />
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
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none h-24 focus:ring-2 focus:ring-cerulean focus:border-transparent outline-none transition-all" placeholder="Ceritakan tentang diri Anda..." />
              <p className="text-xs text-slate-400 mt-1">{form.bio.length}/500</p>
            </div>
          </div>
        </Card>

        {/* Professional Info */}
        <Card className="p-6 rounded-2xl border-0 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope size={18} className="text-sea-green" />
            <h2 className="font-bold text-slate-900">Informasi Profesional</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Spesialisasi *</label>
              <select value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white focus:ring-2 focus:ring-cerulean outline-none transition-all tracking-tight">
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
            <DollarSign size={18} className="text-cerulean" />
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
