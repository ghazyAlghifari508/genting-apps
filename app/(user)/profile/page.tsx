'use client'

import { ComponentType, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Baby,
  Calendar,
  Camera,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Ruler,
  Save,
  Scale,
  ShieldAlert,
  Trash2,
  User,
  Sparkles,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { calculateTrimester } from '@/lib/date-utils'
import { upsertUserProfile, deleteUserProfile } from '@/services/userService'
import { UserProfile } from '@/types/education'
import { usePregnancyData } from '@/hooks/usePregnancyData'

type ProfileTab = 'personal' | 'pregnancy' | 'child' | 'security'

function toNumber(value: string): number | undefined {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

function formatJoinDate(dateValue?: string) {
  if (!dateValue) return '-'
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

function derivePregnancyData(startDate?: string) {
  if (!startDate) return { week: undefined, trimester: undefined, dueDate: '' }
  const start = new Date(startDate)
  if (Number.isNaN(start.getTime())) return { week: undefined, trimester: undefined, dueDate: '' }

  const today = new Date()
  const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const week = Math.max(1, Math.floor(diffDays / 7) + 1)

  const due = new Date(start)
  due.setDate(due.getDate() + 280)

  return {
    week,
    trimester: calculateTrimester(week),
    dueDate: due.toISOString().slice(0, 10),
  }
}

function getAgeInMonths(dateValue?: string) {
  if (!dateValue) return null
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return null

  const now = new Date()
  const months = Math.max(
    0,
    (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
  )
  return months
}

export default function ProfilePage() {
  const { profile, loading: dataLoading, user } = usePregnancyData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal')
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (profile) setFormData(profile)
  }, [profile])

  const derivedPregnancy = useMemo(
    () => derivePregnancyData(formData.pregnancy_start_date),
    [formData.pregnancy_start_date]
  )

  const effectiveStatus = formData.status || 'hamil'

  const profileChecks = useMemo(() => {
    const personal = [
      Boolean(formData.full_name?.trim()),
      Boolean(formData.username?.trim()),
      Boolean(formData.status),
      Boolean(user?.email),
    ]
    const pregnancy = [
      Boolean(formData.pregnancy_start_date),
      Boolean(derivedPregnancy.week || formData.pregnancy_week),
      Boolean(derivedPregnancy.dueDate || formData.due_date),
      Boolean(formData.current_weight),
      Boolean(formData.height),
    ]
    const child = [
      Boolean(formData.child_name?.trim()),
      Boolean(formData.child_birth_date),
      Boolean(formData.child_weight),
      Boolean(formData.child_height),
    ]

    return { personal, pregnancy, child }
  }, [formData, user?.email, derivedPregnancy.week, derivedPregnancy.dueDate])

  const completionPercent = useMemo(() => {
    const all = [...profileChecks.personal, ...profileChecks.pregnancy, ...profileChecks.child]
    const done = all.filter(Boolean).length
    return Math.round((done / all.length) * 100)
  }, [profileChecks])

  const initials = (formData.full_name || formData.username || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('')
  const childAgeMonths = getAgeInMonths(formData.child_birth_date)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSubmitting(true)

    try {
      const payload: Partial<UserProfile> & { id: string } = {
        ...(profile || {}),
        ...formData,
        id: user.id,
        due_date: derivedPregnancy.dueDate || formData.due_date,
        pregnancy_week: derivedPregnancy.week || formData.pregnancy_week,
        trimester: derivedPregnancy.trimester || formData.trimester,
        updated_at: new Date().toISOString(),
      }
      await upsertUserProfile(payload)
      setLastSavedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
      toast({ title: 'Profil diperbarui', description: 'Perubahan profil berhasil disimpan.' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal memperbarui profil.'
      toast({ title: 'Error', description: message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return
    if (deleteConfirmText !== 'HAPUS') {
      toast({
        title: 'Konfirmasi belum valid',
        description: 'Ketik HAPUS untuk melanjutkan penghapusan akun.',
        variant: 'destructive',
      })
      return
    }
    if (!confirm('Akun akan dihapus permanen. Lanjutkan?')) return

    setIsSubmitting(true)
    try {
      await deleteUserProfile(user.id)
      toast({ title: 'Akun dihapus', description: 'Akun berhasil dihapus.' })
      router.push('/login')
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus akun.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-white pb-24 pt-12">
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-8 w-64 rounded-xl" />
                <Skeleton className="h-4 w-96 rounded-full mt-2" />
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            <aside className="space-y-6">
              <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                <Skeleton className="h-32 w-full" />
                <div className="px-6 pb-8 text-center">
                  <div className="flex justify-center -mt-16 mb-6">
                    <Skeleton className="h-32 w-32 rounded-[32px] border-4 border-white" />
                  </div>
                  <Skeleton className="h-8 w-48 mx-auto rounded-xl" />
                  <Skeleton className="h-4 w-32 mx-auto rounded-full mt-2" />
                  <div className="mt-8 space-y-4">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                  </div>
                </div>
              </div>
            </aside>
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
                <div className="px-8 pt-8 pb-4 bg-slate-50/50 border-b border-slate-100">
                  <Skeleton className="h-8 w-48 rounded-xl mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-32 rounded-xl" />
                    <Skeleton className="h-12 w-32 rounded-xl" />
                    <Skeleton className="h-12 w-32 rounded-xl" />
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32 rounded-full" />
                        <Skeleton className="h-14 w-full rounded-2xl" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!user) return null

  const tabItems: Array<{ key: ProfileTab; label: string }> = [
    { key: 'personal', label: 'Data Pribadi' },
    { key: 'pregnancy', label: 'Data Kehamilan' },
    { key: 'child', label: 'Data Si Kecil' },
    { key: 'security', label: 'Keamanan' },
  ]

  return (
    <div className="min-h-screen bg-white pb-24 pt-12">
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb / Title Row */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">Profil Bunda & Data</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Pengaturan akun, data pribadi, dan informasi kesehatan si Kecil.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm shrink-0">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Akun Terverifikasi
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Left Column: Profile Summary Card */}
          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-colors duration-300">
              {/* Card Header Background */}
              <div className="h-32 w-full bg-gradient-to-br from-doccure-dark to-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
              </div>
              
              <div className="relative px-6 pb-8 pt-0">
                {/* Avatar positioned partially over header bg */}
                <div className="-mt-16 mb-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      toast({
                        title: 'Upload foto',
                        description: 'Fitur upload/crop foto profil akan segera tersedia.',
                      })
                    }
                    className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[32px] border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-xl"
                  >
                    {formData.avatar_url ? (
                      <Image
                        src={formData.avatar_url}
                        alt="Avatar"
                        fill
                        sizes="128px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-doccure-teal to-emerald-500 text-4xl font-black text-white">
                        {initials}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="mr-1.5 h-4 w-4" />
                      GANTI
                    </div>
                  </button>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{formData.full_name || formData.username || 'Bunda'}</h2>
                  <p className="mt-1 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {effectiveStatus === 'hamil' ? 'Pendampingan Kehamilan' : 'Pendampingan Pasca Lahir'}
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {/* Completion Stats */}
                  <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-4 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kelengkapan Profil</span>
                       <span className="text-sm font-black text-doccure-teal">{completionPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercent}%` }}
                        className="h-full bg-doccure-teal rounded-full" 
                      />
                    </div>
                  </div>

                  {/* Vertical Quick Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5 group">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Email</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5 group">
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <Target className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Aktif</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Pekan ke-{derivedPregnancy.week || formData.pregnancy_week || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5 group">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:scale-110 transition-transform">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Lokasi</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Indonesia</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Bergabung sejak {formatJoinDate(profile?.created_at)}</p>
                </div>
              </div>
            </div>


          </aside>

          {/* Right Column: Tabbed Workspace */}
          <div className="flex flex-col gap-6 min-w-0">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm flex flex-col transition-colors duration-300">
              {/* Custom Tabs Navigation */}
              <div className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 px-4 pt-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Pengaturan Detail</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {lastSavedAt ? `Terakhir disimpan: ${lastSavedAt}` : 'Perubahan Belum Disimpan'}
                  </p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-0 no-scrollbar">
                  {tabItems.map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        'relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap',
                        activeTab === tab.key
                          ? 'text-doccure-teal'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      )}
                    >
                      {tab.label}
                      {activeTab === tab.key && (
                        <motion.div 
                          layoutId="activeTabProfile" 
                          className="absolute bottom-0 left-0 right-0 h-1 bg-doccure-teal rounded-t-full" 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleUpdate} className="p-8">
                <div className="space-y-10">
                  {activeTab === 'personal' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <Field
                          label="Nama Lengkap Bunda"
                          icon={User}
                          value={formData.full_name || ''}
                          onChange={(value) => setFormData(prev => ({ ...prev, full_name: value }))}
                        />
                        <Field
                          label="Username Publik"
                          icon={User}
                          value={formData.username || ''}
                          onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
                          prefix="@"
                        />

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Informasi Login</label>
                          <div className="relative group">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                              disabled
                               value={user.email || ''}
                              className="h-14 w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-12 pr-12 text-base font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            />
                            <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 pl-1 italic">Email digunakan sebagai identifikasi akun dan tidak dapat diubah secara mandiri.</p>
                        </div>

                        <div className="md:col-span-2 space-y-3 pt-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Status Utama Akun</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { key: 'hamil', label: 'Ibu Sedang Hamil', sub: 'Pendampingan 280 hari' },
                              { key: 'punya_anak', label: 'Ibu Memiliki Balita', sub: 'Pendampingan pasca lahir' },
                            ].map(option => (
                              <button
                                key={option.key}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, status: option.key as UserProfile['status'] }))}
                                className={cn(
                                  'flex flex-col p-4 rounded-2xl border-2 text-left transition-all group relative overflow-hidden',
                                   effectiveStatus === option.key
                                    ? 'border-doccure-teal bg-doccure-teal/5 ring-4 ring-doccure-teal/5'
                                    : 'border-slate-100 dark:border-white/10 bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-white/20'
                                )}
                              >
                                 <span className={cn('text-base font-black', effectiveStatus === option.key ? 'text-doccure-teal' : 'text-slate-800 dark:text-slate-200')}>
                                  {option.label}
                                </span>
                                <span className="text-xs font-medium text-slate-400">{option.sub}</span>
                                {effectiveStatus === option.key && (
                                  <div className="absolute top-2 right-2 text-doccure-teal">
                                    <Sparkles size={16} />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'pregnancy' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-8">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <InfoStat
                          label="Minggu"
                          value={String(derivedPregnancy.week || formData.pregnancy_week || '-')}
                          tone="teal"
                        />
                        <InfoStat
                          label="Trimester"
                          value={String(derivedPregnancy.trimester || formData.trimester || '-')}
                          tone="amber"
                        />
                        <InfoStat
                          label="HPL (Perkiraan)"
                          value={
                            derivedPregnancy.dueDate || formData.due_date
                              ? new Date(derivedPregnancy.dueDate || formData.due_date || '').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '-'
                          }
                          tone="slate"
                        />
                      </div>

                      <div className="rounded-[24px] border border-doccure-teal/20 bg-doccure-teal/[0.02] p-6 flex gap-4">
                         <div className="h-10 w-10 shrink-0 rounded-xl bg-doccure-teal/10 flex items-center justify-center text-doccure-teal">
                            <Baby className="h-5 w-5" />
                         </div>
                          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                          {derivedPregnancy.week
                            ? 'Berdasarkan data HPHT yang Bunda masukkan, sistem kami telah melakukan kalibrasi otomatis untuk siklus kehamilan Bunda.'
                            : 'Silakan masukkan tanggal Hari Pertama Haid Terakhir (HPHT) Bunda agar sistem dapat menghitung fase kehamilan secara presisi.'}
                         </p>
                      </div>

                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <DateField
                          label="Hari Pertama Haid Terakhir (HPHT)"
                          value={formData.pregnancy_start_date || ''}
                          onChange={(value) => setFormData(prev => ({ ...prev, pregnancy_start_date: value }))}
                        />

                        <DateField
                          label="Perkiraan Tanggal Lahir (HPL)"
                          value={derivedPregnancy.dueDate || formData.due_date || ''}
                          onChange={(value) => setFormData(prev => ({ ...prev, due_date: value }))}
                          readOnly={Boolean(derivedPregnancy.dueDate)}
                        />

                        <div className="hidden sm:block md:col-span-2 border-t border-slate-100 dark:border-white/5 my-2" />

                        <Field
                          label="Berat Badan Bunda (kg)"
                          icon={Scale}
                          type="number"
                          step="0.1"
                          value={String(formData.current_weight ?? '')}
                          onChange={(value) => setFormData(prev => ({ ...prev, current_weight: toNumber(value) }))}
                        />

                        <Field
                          label="Tinggi Badan Bunda (cm)"
                          icon={Ruler}
                          type="number"
                          value={String(formData.height ?? '')}
                          onChange={(value) => setFormData(prev => ({ ...prev, height: toNumber(value) }))}
                        />

                        <div className="md:col-span-2 grid grid-cols-2 gap-4 opacity-70">
                           <Field
                            label="Minggu (System Read)"
                            icon={Calendar}
                            type="text"
                            value={String(derivedPregnancy.week || formData.pregnancy_week || '')}
                            onChange={() => {}}
                            readOnly
                          />
                          <Field
                            label="Trimester (System Read)"
                            icon={Calendar}
                            type="text"
                            value={String(derivedPregnancy.trimester || formData.trimester || '')}
                            onChange={() => {}}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'child' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-8">
                      {childAgeMonths !== null && (
                        <div className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 flex items-center justify-between">
                          <div className="flex gap-4 items-center">
                             <div className="h-12 w-12 rounded-2xl bg-doccure-teal flex items-center justify-center text-white shadow-lg">
                                <Baby className="h-6 w-6" />
                             </div>
                             <div>
                                 <h4 className="font-black text-slate-900 dark:text-white leading-none">Usia Si Kecil</h4>
                                <p className="text-sm font-bold text-slate-500 mt-1">Status saat ini: {childAgeMonths} Bulan</p>
                             </div>
                          </div>
                          <div className="bg-doccure-teal/10 text-doccure-teal px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                             Fase 1000 HPK
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <Field
                          label="Nama Lengkap Si Kecil"
                          icon={Baby}
                          value={formData.child_name || ''}
                          onChange={(value) => setFormData(prev => ({ ...prev, child_name: value }))}
                        />

                        <DateField
                          label="Tanggal Lahir Si Kecil"
                          value={formData.child_birth_date || ''}
                          onChange={(value) => setFormData(prev => ({ ...prev, child_birth_date: value }))}
                        />

                         <div className="md:col-span-2 border-t border-slate-100 dark:border-white/5 my-2" />

                        <Field
                          label="Berat Si Kecil (kg)"
                          icon={Scale}
                          type="number"
                          step="0.1"
                          value={String(formData.child_weight ?? '')}
                          onChange={(value) => setFormData(prev => ({ ...prev, child_weight: toNumber(value) }))}
                        />

                        <Field
                          label="Tinggi Si Kecil (cm)"
                          icon={Ruler}
                          type="number"
                          value={String(formData.child_height ?? '')}
                          onChange={(value) => setFormData(prev => ({ ...prev, child_height: toNumber(value) }))}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-8 max-w-2xl">
                       <div className="rounded-[24px] border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10 p-8 space-y-6">
                        <div className="flex gap-4">
                           <div className="h-12 w-12 shrink-0 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                              <ShieldAlert className="h-6 w-6" />
                           </div>
                           <div className="space-y-1 pt-1">
                               <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Penghapusan Akun Permanen</h3>
                              <p className="text-sm font-bold text-slate-500 leading-relaxed">
                                Tindakan ini tidak dapat dibatalkan. Seluruh data medis, riwayat kehamilan, dan pengaturan personal Bunda akan dihapus secara permanen dari server GENTING+.
                              </p>
                           </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-rose-100/50 dark:border-rose-900/30">
                          <label className="text-xs font-black text-rose-600/60 uppercase tracking-widest pl-1">Ketikan kata &quot;HAPUS&quot; untuk konfirmasi</label>
                          <input
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="HAPUS"
                             className="h-14 w-full rounded-2xl border-2 border-rose-100 dark:border-rose-900/30 bg-white dark:bg-slate-950 px-6 text-base font-black transition dark:text-white focus:border-rose-500 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)] outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={isSubmitting}
                          className="w-full h-14 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                        >
                          <Trash2 className="h-5 w-5" />
                          Hapus Akun Saya Selamanya
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                 {activeTab !== 'security' && (
                  <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-400">
                      Semua data terenkripsi dan aman sesuai standar privasi GENTING+.
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 w-full sm:w-auto rounded-2xl bg-doccure-teal px-10 text-base font-black text-white hover:bg-doccure-dark transition-all shadow-xl shadow-teal-100 active:scale-95"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-5 w-5" />
                      )}
                      Simpan Perubahan
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

interface FieldProps {
  label: string
  icon: ComponentType<{ className?: string }>
  value: string
  onChange: (value: string) => void
  prefix?: string
  type?: 'text' | 'number'
  step?: string
  readOnly?: boolean
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  prefix,
  type = 'text',
  step,
  readOnly = false,
}: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
            {prefix}
          </span>
        ) : (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          type={type}
          step={step}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-11 w-full rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 pr-3 text-sm dark:text-white outline-none transition',
            prefix ? 'pl-8' : 'pl-9',
            readOnly
              ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-900 text-slate-500'
              : 'focus:border-doccure-teal focus:shadow-[0_0_0_3px_rgba(19,122,116,0.12)]'
          )}
        />
      </div>
    </div>
  )
}

interface DateFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

function DateField({ label, value, onChange, readOnly = false }: DateFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="date"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-11 w-full rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 pl-9 pr-3 text-sm dark:text-white outline-none transition',
            readOnly
              ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-900 text-slate-500'
              : 'focus:border-doccure-teal focus:shadow-[0_0_0_3px_rgba(19,122,116,0.12)]'
          )}
        />
      </div>
    </div>
  )
}

function InfoStat({ label, value, tone }: { label: string; value: string; tone: 'teal' | 'amber' | 'slate' }) {
  const toneClass =
    tone === 'teal'
      ? 'border-doccure-teal/25 bg-doccure-teal/10 dark:bg-doccure-teal/20 text-doccure-dark dark:text-doccure-teal'
      : tone === 'amber'
        ? 'border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-500'
        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white'

  return (
    <div className={cn('rounded-2xl border px-4 py-3', toneClass)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-70">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  )
}
