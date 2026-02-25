'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getDoctors } from '@/services/doctorService'
import { getUserConsultations } from '@/services/consultationService'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import {
  Search,
  Stethoscope,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  PlusCircle,
  UserCheck
} from 'lucide-react'
import type { Doctor } from '@/types/doctor'
import type { Consultation } from '@/types/consultation'
import { SPECIALIZATIONS } from '@/types/doctor'

export default function KonsultasiDokterPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const [doctorData, userConsultations] = await Promise.all([
          getDoctors({
            specialization: category !== 'Semua' ? category : undefined,
            search: search || undefined,
          }),
          user ? getUserConsultations(user.id) : Promise.resolve([])
        ])

        if (active) {
          setDoctors(doctorData || [])
          if (user) {
            const activeCons = (userConsultations || []).filter((c) => c.status === 'ongoing' || c.status === 'scheduled')
            setConsultations(activeCons)
          } else {
            setConsultations([])
          }
        }
      } catch (error) {
        console.error('Error loading doctors:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [category, search, user?.id])

  const categories = useMemo(() => ['Semua', ...SPECIALIZATIONS], [])

  if (loading) {
    return (
      <div className="pb-32 text-slate-900 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-doccure-teal/10 rounded-full blur-[120px] pointer-events-none opacity-30" />
        <section className="w-full bg-white border-b border-slate-100 relative overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 rounded-lg mb-4" />
                <Skeleton className="h-10 w-64 rounded-xl" />
                <Skeleton className="h-4 w-96 rounded-full mt-2" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="hidden lg:block h-16 w-60 rounded-2xl" />
                <Skeleton className="h-12 w-40 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 -mt-8 sm:px-6 lg:px-8 relative z-20">
          <div className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-6">
              <Skeleton className="h-[400px] rounded-[36px]" />
            </aside>
            <div className="space-y-6">
              <div className="rounded-[40px] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-10 flex justify-between items-end">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 rounded-full" />
                    <Skeleton className="h-10 w-60 rounded-xl" />
                  </div>
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 rounded-[40px]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header Section - Aligned with Roadmap Style */}
      <section className="w-full bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pusat Bantuan</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Konsultasi <span className="text-doccure-teal italic relative inline-block">
                  1000 HPK
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">
                Terhubung dengan tenaga medis profesional kapan pun Bunda & Si Kecil butuhkan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 mt-12 sm:px-6 lg:px-8 relative z-20">
          <div className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start flex justify-center">
              <div className="rounded-[32px] sm:rounded-[36px] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm relative overflow-hidden w-full max-w-2xl mx-auto transition-colors duration-300">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-slate-50 rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cari Dokter</h2>

                <div className="relative mt-6 group">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-doccure-teal transition-colors" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nama spesialis..."
                    className="h-12 rounded-[20px] border-slate-200 dark:border-white/10 pl-11 bg-white/60 dark:bg-white/5 backdrop-blur-md focus:bg-white dark:focus:bg-slate-800 dark:text-white focus:ring-4 focus:ring-doccure-teal/10 shadow-sm transition-all duration-300"
                  />
                </div>

                <div className="mt-8">
                  <p className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-doccure-teal" />
                    Kategori Spesialis
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                          category === cat
                            ? 'border-doccure-teal bg-doccure-teal text-white shadow-lg shadow-doccure-teal/15 animate-in zoom-in-95'
                            : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6 flex flex-col items-center">
            <div className="rounded-[32px] sm:rounded-[40px] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm md:p-8 relative overflow-hidden w-full max-w-2xl mx-auto transition-colors duration-300">
              {/* Subtle Horizontal Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-doccure-teal/20 to-transparent" />
              
              <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-1.5 w-8 rounded-full bg-doccure-teal" />
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-doccure-teal">Pilih Ahli</p>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Rekomendasi Spesialis</h2>
                </div>
                <div className="flex items-center self-start sm:self-auto gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                   <UserCheck size={14} className="text-emerald-500" />
                   <p className="text-xs font-black uppercase tracking-widest text-slate-500">{doctors.length} Terverifikasi</p>
                </div>
              </div>

              {doctors.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 py-32 text-center group">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[32px] bg-white dark:bg-slate-800 shadow-sm mb-8 border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Stethoscope className="h-10 w-10 text-slate-300" />
                  </div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dokter tidak ditemukan</h3>
                  <p className="mt-4 text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">Mohon ganti kata kunci pencarian atau bersihkan filter spesialisasi Bunda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {doctors.map((doctor, i) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: i * 0.05 }}
                      className="w-full flex justify-center"
                    >
                      <div className="group relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 transition-all duration-500 hover:border-doccure-teal/50 hover:shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12)] hover:-translate-y-1 w-full max-w-2xl">
                        {/* Interactive Shine Effect */}
                        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1.5s] pointer-events-none" />
                        
                        <div className="flex flex-col gap-6 p-4 sm:p-5 md:flex-row md:items-center relative z-10">
                          <div className="flex flex-1 items-center gap-4 sm:gap-6">
                            <div className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-[24px] sm:rounded-[32px] bg-slate-50 dark:bg-slate-700 ring-4 ring-slate-50 dark:ring-slate-700 shadow-sm transition-transform group-hover:scale-105 group-hover:-rotate-3 duration-500">
                              {doctor.profile_picture_url ? (
                                <Image src={doctor.profile_picture_url} alt={doctor.full_name} fill unoptimized className="object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                  <Stethoscope className="h-8 w-8 sm:h-10 sm:w-10" />
                                </div>
                              )}
                              {/* Trust Overlapping Item */}
                              <div className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-lg p-1 animate-pulse">
                                 <ShieldCheck size={12} />
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                 <PlusCircle className="h-3 w-3 text-doccure-teal" fill="currentColor" />
                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-doccure-teal">Dokter Terverifikasi</span>
                              </div>
                              <h3 className="mt-1 truncate text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{doctor.full_name}</h3>
                              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{doctor.specialization}</p>
                              
                              <div className="mt-5 flex items-center gap-4">
                                 <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-1.5 border border-slate-100 dark:border-white/10 shadow-sm">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">{doctor.years_of_experience || 5} Thn Pengalaman</span>
                                 </div>
                                 <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 border border-amber-100 dark:border-amber-900/30 shadow-sm">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    <span className="text-[11px] font-black text-amber-700">4.9/5 Rating</span>
                                 </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 border-t border-slate-50 pt-6 md:flex-col md:items-end md:border-t-0 md:pt-0">
                            <div className="text-left md:text-right">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Fee Konsultasi</p>
                              <div className="flex items-baseline md:justify-end gap-1">
                                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                  Rp {doctor.hourly_rate.toLocaleString('id-ID')}
                                </p>
                                <span className="text-xs font-bold text-slate-400">/Sesi</span>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Link href={`/doctors/${doctor.id}`} className="w-full sm:w-auto">
                                <button className="flex h-12 sm:h-14 w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-white px-6 sm:px-8 text-sm font-black text-white dark:text-slate-900 transition-all hover:bg-black dark:hover:bg-slate-100 hover:px-10 active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none">
                                  Booking Sekarang
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div id="konsultasi-history" className="rounded-[32px] sm:rounded-[40px] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm md:p-8 relative overflow-hidden mt-12 w-full max-w-2xl mx-auto transition-colors duration-300">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
               
               <div className="mb-10 flex flex-wrap items-end justify-between gap-4 relative z-10">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                      <div className="h-1.5 w-8 rounded-full bg-emerald-500" />
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Past Sessions</p>
                   </div>
                   <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Riwayat Konsultasi</h2>
                 </div>
               </div>

               {consultations.length === 0 ? (
                 <div className="flex flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 py-24 text-center">
                    <Clock className="h-12 w-12 text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum ada riwayat sesi.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {consultations.map((c) => (
                     <div key={c.id} className="group relative overflow-hidden rounded-[28px] border border-slate-100 dark:border-white/10 bg-[#fbfcfc] dark:bg-white/5 p-4 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:border-emerald-500/30">
                        <div className="flex items-center justify-between gap-4">
                           <div className="flex items-center gap-4">
                              <div className="relative h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                                 {c.doctor?.profile_picture_url ? (
                                    <Image
                                      src={c.doctor.profile_picture_url}
                                      alt={c.doctor?.full_name || 'Foto profil dokter'}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                      unoptimized
                                    />
                                 ) : <Stethoscope className="text-slate-400" size={20} />}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900 dark:text-white">{c.doctor?.full_name || 'Spesialis'}</p>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.scheduled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <ConsultationStatusBadge status={c.status} />
                              <Link href={`/konsultasi-dokter/${c.id}`}>
                                 <Button variant="ghost" size="sm" className="rounded-xl font-bold bg-white border border-slate-100 hover:bg-slate-50">Detail</Button>
                              </Link>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
            </div>
          </div>
        </section>
    </div>
  )
}
