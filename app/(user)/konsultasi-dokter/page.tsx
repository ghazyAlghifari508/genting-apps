'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getDoctors } from '@/services/doctorService'
import { usePregnancyData } from '@/hooks/usePregnancyData'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Components - Lazy Loaded
const SearchFilter = dynamic(() => import('@/components/consultation/SearchFilter').then(mod => mod.SearchFilter))
const DoctorCard = dynamic(() => import('@/components/consultation/DoctorCard').then(mod => mod.DoctorCard))
const ConsultationHistory = dynamic(() => import('@/components/consultation/ConsultationHistory').then(mod => mod.ConsultationHistory))

import { Skeleton } from '@/components/ui/skeleton'
import { Stethoscope, UserCheck } from 'lucide-react'
import type { Doctor } from '@/types/doctor'
import type { Consultation } from '@/types/consultation'
import { SPECIALIZATIONS } from '@/types/doctor'

export default function KonsultasiDokterPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const { profile, loading: dataLoading, consultations: consultationsData, doctors: doctorsContext, loadDoctors, loadConsultations } = usePregnancyData()
  const doctors = doctorsContext.data
  const router = useRouter() // Added initialization for useRouter

  useEffect(() => {
    if (dataLoading) return
    if (!profile) {
      router.push('/login')
    }
  }, [dataLoading, profile, router])

  useEffect(() => {
    // Rely on Provider internal guard for doctors loading
    if (!dataLoading && profile) {
      loadDoctors()
    }
  }, [dataLoading, profile, doctors.length, loadDoctors])

  useEffect(() => {
    if (dataLoading || !profile) return
    loadConsultations()
  }, [profile, dataLoading, loadConsultations])

  const [apiFilteredDoctors, setApiFilteredDoctors] = useState<Doctor[] | null>(null)

  useEffect(() => {
    if (!search && category === 'Semua') {
      setApiFilteredDoctors(null)
      return
    }

    let active = true
    const fetchFilteredDoctors = async () => {
      try {
        const data = await getDoctors({
          specialization: category !== 'Semua' ? category : undefined,
          search: search || undefined,
        })
        if (active) setApiFilteredDoctors(data || [])
      } catch (error) {
        console.error('Error filtering doctors:', error)
      }
    }

    fetchFilteredDoctors()
    return () => { active = false }
  }, [category, search])

  const filteredDoctors = useMemo(() => {
    if (!search && category === 'Semua') return doctors
    return apiFilteredDoctors || []
  }, [search, category, doctors, apiFilteredDoctors])

  const categories = useMemo(() => ['Semua', ...SPECIALIZATIONS], [])

  const activeConsultations = useMemo(() => {
    return (consultationsData.data || []).filter((c) => c.status === 'ongoing' || c.status === 'scheduled')
  }, [consultationsData.data])

  if ((dataLoading || doctorsContext.loading) && doctors.length === 0) {
    return (
      <div className="pb-32 text-slate-900 relative min-h-screen bg-slate-50/50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-doccure-teal/10 rounded-full blur-[120px] pointer-events-none opacity-30" />
        
        {/* Header Skeleton */}
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

        {/* Content Skeleton */}
        <section className="mx-auto max-w-[1400px] px-4 -mt-8 sm:px-6 lg:px-8 relative z-20">
          <div className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
            {/* Sidebar Filter Skeleton */}
            <aside className="space-y-6">
              <Skeleton className="h-[400px] rounded-3xl" />
            </aside>
            
            {/* Doctor List Skeleton */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-10 flex justify-between items-end">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 rounded-full" />
                    <Skeleton className="h-10 w-60 rounded-xl" />
                  </div>
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 rounded-3xl" />
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
    <div className="min-h-screen bg-slate-50/50  transition-colors duration-300">
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
              
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900  leading-none">
                Konsultasi <span className="text-doccure-teal italic relative inline-block">
                  1000 HPK
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-slate-500  font-medium max-w-lg">
                Terhubung dengan tenaga medis profesional kapan pun Bunda & Si Kecil butuhkan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 mt-12 sm:px-6 lg:px-8 relative z-20">
        <div className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
          <SearchFilter
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            categories={categories}
          />

          <div className="space-y-6 flex flex-col min-w-0">
            <div className="rounded-3xl sm:rounded-3xl border border-slate-100  bg-white  p-4 sm:p-6 shadow-sm md:p-8 relative overflow-hidden w-full transition-colors duration-300">
              {/* Subtle Horizontal Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-doccure-teal/20 to-transparent" />
              
              <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-1.5 w-8 rounded-full bg-doccure-teal" />
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-doccure-teal">Pilih Ahli</p>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 ">Rekomendasi Spesialis</h2>
                </div>
                <div className="flex items-center self-start sm:self-auto gap-2 px-4 py-2 bg-slate-50  rounded-xl border border-slate-100 ">
                   <UserCheck size={14} className="text-emerald-500" />
                   <p className="text-xs font-black uppercase tracking-widest text-slate-500">{doctors.length} Terverifikasi</p>
                </div>
              </div>

              {filteredDoctors.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200  bg-slate-50/50  py-32 text-center group">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white  shadow-sm mb-8 border border-slate-100  group-hover:scale-110 transition-transform duration-500">
                    <Stethoscope className="h-10 w-10 text-slate-300" />
                  </div>
                   <h3 className="text-3xl font-black text-slate-900  tracking-tight">Dokter tidak ditemukan</h3>
                  <p className="mt-4 text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">Mohon ganti kata kunci pencarian atau bersihkan filter spesialisasi Bunda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredDoctors.map((doctor, i) => (
                    <DoctorCard key={doctor.id} doctor={doctor} index={i} />
                  ))}
                </div>
              )}
            </div>
            
            <ConsultationHistory consultations={activeConsultations} />
            </div>
          </div>
        </section>
    </div>
  )
}
