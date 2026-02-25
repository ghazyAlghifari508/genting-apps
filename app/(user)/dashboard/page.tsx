'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { usePregnancyData } from '@/hooks/usePregnancyData'
import {
  Baby,
  Bell,
  BookOpen,
  Camera,
  ChevronDown,
  Clock3,
  Route,
  ShieldCheck,
  Stethoscope,
  Users,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles,
  Activity,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const serviceCards = [
  {
    title: 'Roadmap',
    desc: 'Langkah harian 1000 HPK sesuai fase kehamilan.',
    href: '/roadmap',
    icon: Route,
    color: 'bg-blue-500',
  },
  {
    title: 'Vision',
    desc: 'Analisis nutrisi molekuler dengan GENTING Vision.',
    href: '/vision',
    icon: Camera,
    color: 'bg-indigo-500',
  },
  {
    title: 'Edukasi',
    desc: 'Materi terstruktur untuk ibu hamil dan keluarga.',
    href: '/education',
    icon: BookOpen,
    color: 'bg-emerald-500',
  },
  {
    title: 'Konsultasi',
    desc: 'Terhubung dengan dokter untuk pendampingan aktif.',
    href: '/konsultasi-dokter',
    icon: Stethoscope,
    color: 'bg-doccure-teal',
  },
]

const dailyTasksByTrimester: Record<number, string[]> = {
  1: [
    'Konsumsi asam folat dan zat besi sesuai anjuran',
    'Minum air putih minimal 8 gelas hari ini',
    'Catat keluhan mual untuk bahan konsultasi',
  ],
  2: [
    'Konsumsi zat besi 60mg sesuai rekomendasi',
    'Cek gerakan janin (10 gerakan per 2 jam)',
    'Jadwalkan kontrol rutin pekan ini',
  ],
  3: [
    'Pantau kontraksi dan gerakan janin setiap hari',
    'Siapkan tas persalinan dan dokumen penting',
    'Konfirmasi rencana kontrol dan persalinan',
  ],
}

const remindersByTrimester: Record<number, string[]> = {
  1: [
    'USG awal kehamilan penting untuk konfirmasi usia janin.',
    'Baca edukasi: nutrisi penting trimester pertama.',
    'Catat gejala yang berulang untuk dibahas saat konsultasi.',
  ],
  2: [
    'USG trimester 2 biasanya dilakukan pada minggu 18-22.',
    'Artikel baru: makanan kaya folat untuk trimester 2.',
    'Pastikan jadwal kontrol ke bidan tidak terlewat.',
  ],
  3: [
    'Pantau tanda persalinan dan konsultasikan bila muncul gejala.',
    'Baca edukasi: persiapan menyusui di minggu akhir kehamilan.',
    'Pastikan kontak dokter aktif untuk kondisi darurat.',
  ],
}

const educationByTrimester: Record<number, Array<{ title: string; href: string }>> = {
  1: [
    { title: 'Nutrisi trimester 1 untuk cegah risiko stunting', href: '/education' },
    { title: 'Tanda bahaya awal kehamilan yang wajib dipantau', href: '/education' },
    { title: 'Panduan aktivitas aman di trimester pertama', href: '/education' },
  ],
  2: [
    { title: 'Kenali tanda bahaya preeklamsia lebih dini', href: '/education' },
    { title: 'Panduan nutrisi trimester 2 untuk ibu hamil', href: '/education' },
    { title: 'Video gerakan ringan untuk ibu hamil trimester 2', href: '/education' },
  ],
  3: [
    { title: 'Checklist persiapan persalinan yang perlu disiapkan', href: '/education' },
    { title: 'Strategi nutrisi trimester 3 jelang persalinan', href: '/education' },
    { title: 'Rencana menyusui dan perawatan awal bayi', href: '/education' },
  ],
}

function getNutritionStatus(hasWeight: boolean) {
  if (hasWeight) {
    return {
      label: 'Terpantau',
      className: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    }
  }

  return {
    label: 'Perlu perhatian',
    className: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  }
}

export default function DashboardPage() {
  const { loading, user, profile, weekNumber, trimester } = usePregnancyData()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen pb-20 text-slate-900 dark:text-white relative overflow-hidden transition-colors">
        {/* Background Motifs */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        {/* Hero Header Skeleton */}
        <section className="relative w-full overflow-hidden min-h-[600px] flex items-center justify-center pt-28 pb-32 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
               <Skeleton className="h-6 w-64 rounded-full mb-8 opacity-20 dark:bg-slate-700" />
               <Skeleton className="h-20 w-3/4 rounded-3xl mb-8 dark:bg-slate-700" />
               <Skeleton className="h-6 w-1/2 rounded-full mb-10 dark:bg-slate-700" />
               <div className="flex gap-4">
                  <Skeleton className="h-14 w-40 rounded-2xl dark:bg-slate-700" />
                  <Skeleton className="h-14 w-40 rounded-2xl dark:bg-slate-700" />
               </div>
            </div>
          </div>
        </section>

        {/* Main Grid Content Skeleton */}
        <section className="mx-auto -mt-12 relative z-20 max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* Service Cards Skeletons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-[28px] dark:bg-slate-800" />
                ))}
              </div>
              {/* Pregnancy Status Card Skeleton */}
              <Skeleton className="h-64 rounded-[32px] dark:bg-slate-800" />
              {/* Daily Tasks Skeleton */}
              <Skeleton className="h-96 rounded-[32px] dark:bg-slate-800" />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Skeleton className="h-48 rounded-[32px] dark:bg-slate-800" />
              <Skeleton className="h-80 rounded-[32px] dark:bg-slate-800" />
              <Skeleton className="h-64 rounded-[32px] dark:bg-slate-800" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Bunda'
  const activeTrimester = trimester || 2
  const currentWeek = weekNumber || profile?.pregnancy_week || 24
  const currentDay = profile?.current_day || Math.min(1000, Math.max(1, currentWeek * 7))
  const daysTo1000 = Math.max(0, 1000 - currentDay)

  const pregnancyProgress = Math.min(100, Math.round((Math.min(currentWeek, 40) / 40) * 100))
  const profileFields = [
    profile?.full_name,
    profile?.pregnancy_week,
    profile?.pregnancy_start_date,
    profile?.due_date,
    profile?.current_weight,
    profile?.height,
  ]
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100)

  const dailyTasks = dailyTasksByTrimester[activeTrimester] || dailyTasksByTrimester[2]
  const reminders = remindersByTrimester[activeTrimester] || remindersByTrimester[2]
  const relevantEducation = educationByTrimester[activeTrimester] || educationByTrimester[2]
  const nutritionStatus = getNutritionStatus(!!profile?.current_weight)

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-20 text-slate-900 dark:text-white relative overflow-hidden transition-colors">
      {/* Background Motifs */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Hero Header Section - Redesigned Centered Layout */}
      <section className="relative w-full overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center justify-center pt-24 md:pt-28 pb-20 md:pb-32">
        {/* Background Image with Premium Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/dashboard-hero.png" 
            alt="Dashboard Hero" 
            fill 
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />
          
          {/* Subtle Gradient Polish */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/80" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] md:leading-[1.05] mb-6 md:mb-8 tracking-tight px-4">
                Selamat Datang,<br />
                <span className="text-doccure-yellow italic">{firstName}</span>.
              </h1>
              
              <p className="text-base sm:text-xl text-white/80 font-medium leading-relaxed mb-8 md:mb-10 max-w-2xl px-6">
                Bersama GENTING+, wujudkan perkembangan optimal si kecil melalui pendampingan cerdas, nutrisi molekuler, dan konsultasi ahli.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link href="/roadmap" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-doccure-yellow hover:bg-[#cbe33a] text-doccure-dark rounded-2xl px-10 h-14 font-black text-base shadow-[0_20px_40px_rgba(221,242,71,0.3)] transition-all active:scale-95 group">
                    Mulai Aktivitas
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/education" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-2xl px-10 h-14 font-bold text-base backdrop-blur-md transition-all active:scale-95">
                    Lihat Edukasi
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="mx-auto -mt-12 relative z-20 max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Quick Actions & Primary Focus */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Service Cards Grid - Moved to Top */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceCards.map((item) => (
                <Link key={item.title} href={item.href} className="group transition-all duration-500">
                  <div className="h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] p-6 shadow-sm hover:shadow-[0_22px_48px_-12px_rgba(15,23,42,0.12)] hover:border-doccure-teal/50 transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden flex flex-col transition-colors">
                    {/* Abstract Mini Shape */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-bl-[48px] -mr-4 -mt-4 transition-all duration-500 group-hover:bg-doccure-teal/10 group-hover:scale-110" />
                    
                    <div className="relative z-10 flex-1">
                      <div className={`${item.color} w-13 h-13 rounded-[18px] flex items-center justify-center text-white mb-5 shadow-lg shadow-${item.color.split('-')[1]}-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-[19px] font-black text-slate-900 dark:text-white group-hover:text-doccure-teal transition-colors tracking-tight">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-2.5 opacity-80 group-hover:opacity-100 transition-opacity transition-colors">{item.desc}</p>
                    </div>

                    <div className="relative z-10 mt-6 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between text-doccure-teal font-black text-[11px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pregnancy Status Card - Moved below Service Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-doccure-dark rounded-[32px] p-8 border border-slate-700 shadow-2xl relative overflow-hidden group"
            >
              {/* Decorative Pulse Accent */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-doccure-yellow/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-doccure-yellow/10 p-2 rounded-xl">
                      <Baby className="w-5 h-5 text-doccure-yellow" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Status Kehamilan Aktif</h3>
                    <div className="ml-auto md:ml-0 bg-doccure-yellow/20 text-doccure-yellow px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">Trimester {activeTrimester}</div>
                  </div>
                  
                  <div className="relative h-3 bg-white/5 rounded-full mb-3 overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pregnancyProgress}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-doccure-yellow via-yellow-400 to-yellow-200 rounded-full shadow-[0_0_30px_rgba(221,242,71,0.4)]" 
                    />
                  </div>
                  <div className="flex justify-between text-white/40 text-[10px] font-bold uppercase tracking-[0.1em]">
                    <span>Minggu 1</span>
                    <span className="text-doccure-yellow">{pregnancyProgress}% Kehamilan Terlewati</span>
                    <span>Minggu 40</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 md:w-[320px]">
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-wider mb-1">Minggu</p>
                    <p className="text-2xl font-bold text-white leading-none">{currentWeek}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-wider mb-1">Hari</p>
                    <p className="text-2xl font-bold text-white leading-none">{currentDay}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-wider mb-1">Sisa</p>
                    <p className="text-2xl font-bold text-white leading-none">{daysTo1000}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Daily Tasks - Enhanced with Organic Blob */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 shadow-sm relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-doccure-teal/[0.03] rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                       Agenda Hari Ini
                       <Sparkles size={18} className="text-doccure-yellow" />
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors">Minggu {currentWeek} • Pastikan aktivitas terpenuhi.</p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors">A</div>
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-colors">N</div>
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {dailyTasks.map((task, idx) => (
                    <motion.div 
                      key={task} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-doccure-teal/30 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-500 group-hover:border-doccure-teal flex items-center justify-center group-hover:bg-doccure-teal/10 transition-all duration-300">
                        <div className="w-2 h-2 rounded-sm bg-doccure-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-bold flex-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{task}</p>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronDown className="w-4 h-4 text-doccure-teal" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Streak: 5 Hari</span>
                  </div>
                  <Button variant="ghost" className="text-doccure-teal font-bold hover:bg-doccure-teal/5 dark:hover:bg-slate-700 rounded-xl transition-colors">
                    Lihat Riwayat Agenda
                  </Button>
                </div>
              </div>
            </div>

            {/* Educational Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relevantEducation.slice(0, 2).map((edu, idx) => (
                <div key={edu.title} className="relative overflow-hidden rounded-[28px] group aspect-[4/3] sm:aspect-auto sm:h-64 shadow-lg lg:border-2 border-transparent hover:border-doccure-teal transition-all">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                   <Image
                    src={idx === 0 ? "/images/unsplash/img_4ba8ae38.png" : "/images/unsplash/img_58db8649.png"}
                    alt={edu.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                    <span className="bg-doccure-teal text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full mb-3 inline-block">Materi Baru</span>
                    <h4 className="text-xl font-bold text-white leading-tight mt-1 transition-colors">{edu.title}</h4>
                    <Link href={edu.href} className="mt-4 inline-flex items-center text-white/80 text-sm font-bold hover:text-white transition-colors group/link">
                      Pelajari Sekarang <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Profile Completion Card - with Decorative Badge */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 shadow-sm relative overflow-hidden transition-colors">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-xl" />
              
              <div className="flex gap-4 mb-6 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-4 border-slate-50 dark:border-slate-800 shadow-inner overflow-hidden transition-colors">
                    <div className="w-12 h-12 rounded-full bg-doccure-teal flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  {/* Floating Micro Icon */}
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 bg-doccure-yellow rounded-full p-1 border-2 border-white dark:border-slate-800 shadow-sm transition-colors"
                  >
                    <Star size={10} className="text-doccure-dark" fill="currentColor" />
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate transition-colors">{profile?.full_name || firstName}</h4>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none transition-colors">Profil Kehamilan</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600 mb-6 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kelengkapan Data</span>
                  <span className="text-sm font-bold text-doccure-teal">{profileCompletion}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden transition-colors">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    className="h-full bg-doccure-teal rounded-full" 
                  />
                </div>
              </div>

              <Button variant="outline" className="w-full border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold h-11 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Edit Profil Lengkap
              </Button>
            </div>

            {/* Smart Reminders - Enhanced with Pattern */}
            <div className="bg-[#1e293b] rounded-[32px] p-1 shadow-xl overflow-hidden relative group transition-colors">
              {/* Pattern Elemental Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" 
                   style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
              
              <div className="p-6 relative z-10 transition-colors">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Bell className="w-5 h-5 text-doccure-yellow" />
                  </motion.div>
                  Smart Reminders
                </h3>
                
                <div className="space-y-4 transition-colors">
                  {reminders.map((reminder, idx) => (
                    <div key={idx} className="flex gap-4 group/item">
                      <div className="w-1 h-12 bg-doccure-teal/20 group-hover/item:bg-doccure-teal rounded-full transition-colors shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white/90 leading-snug group-hover/item:text-white transition-colors">{reminder}</p>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 inline-block transition-colors">PENTING • MINGGU {currentWeek}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 p-4 flex justify-center transition-colors">
                <Button variant="ghost" className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest px-8">
                  Lihat Semua Notifikasi
                </Button>
              </div>
            </div>

            {/* Consultation Status */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 shadow-sm overflow-hidden relative group transition-colors">
              <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] dark:opacity-[0.06] group-hover:opacity-[0.06] transition-opacity duration-700 transition-colors">
                <Stethoscope className="w-48 h-48 dark:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between transition-colors">
                <span>Konsultasi Dokter</span>
                <Activity size={16} className="text-doccure-teal animate-pulse" />
              </h3>
              
              <div className="space-y-3 mb-6 relative z-10 transition-colors">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600 italic transition-colors">
                  <Calendar className="w-4 h-4 text-doccure-teal" />
                  <span>Suhu tubuh & berat terpantau</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium p-2 transition-colors">
                  <Clock3 className="w-4 h-4 text-doccure-teal" />
                  <span>Jadwal kontrol berikutnya: -</span>
                </div>
              </div>

              <Link href="/konsultasi-dokter" className="block relative z-10">
                <Button className="w-full bg-doccure-dark dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white rounded-xl h-11 font-bold shadow-md group transition-all transition-colors">
                  Cari Dokter Spesialis <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Health Stats */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-[32px] p-6 border border-emerald-100 dark:border-emerald-800 shadow-inner relative overflow-hidden transition-colors">
               {/* Organic Shape Accent */}
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-200/40 dark:bg-emerald-700/20 rounded-full blur-2xl transition-colors" />
              
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300 mb-4 flex items-center gap-2 relative z-10 transition-colors">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Ringkasan Nutrisi
              </h3>
              <div className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 mb-4 relative z-10 transition-colors">
                <div className="flex justify-between items-center mb-1 transition-colors">
                  <span className="text-xs font-bold text-emerald-800/60 dark:text-emerald-400/60 uppercase tracking-wider transition-colors">Status Mingguan</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${nutritionStatus.className} transition-colors`}>{nutritionStatus.label}</span>
                </div>
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 leading-snug transition-colors">
                  {profile?.current_weight ? "Data berat badan terupdate. Tetap jaga asupan gizi seimbang." : "Lengkapi data berat badan untuk analisis nutrisi akurat."}
                </p>
              </div>
              <Link href="/profile">
                <Button variant="link" className="text-emerald-700 dark:text-emerald-400 font-bold text-sm p-0 h-auto hover:text-emerald-900 dark:hover:text-emerald-200 relative z-10 transition-colors">
                  Lengkapi Data <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Section: Partner Invite */}
      <section className="mx-auto mt-12 max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="bg-doccure-teal rounded-[42px] overflow-hidden relative min-h-[400px] flex items-center group/hero">
          <div className="absolute inset-0 bg-[url('/images/unsplash/img_be51761e.png')] bg-cover bg-center group-hover/hero:scale-105 transition-transform duration-[4s]" />
          <div className="absolute inset-0 bg-gradient-to-r from-doccure-dark via-doccure-teal/80 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
              Analisis Nutrisi<br />Sekali Jepret.
            </h2>
            <p className="text-lg text-white/80 font-medium leading-relaxed mb-8">
              Bunda ragu dengan kandungan gizi di piring? Gunakan GENTING+ Vision untuk membedah profil nutrisi molekuler makanan Bunda secara instan berbasis AI.
            </p>
            <Link href="/vision">
              <Button className="bg-white hover:bg-slate-100 text-doccure-teal rounded-full px-10 h-14 font-bold text-base shadow-xl group transition-all">
                Mulai Analisis <Camera className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* AI Vision Scanner Overlay */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-12 translate-x-12">
              <div className="relative w-full max-w-[420px] aspect-square">
                {/* Viewfinder Frame */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-[3px] border-l-[3px] border-white/60 rounded-tl-3xl shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-[3px] border-r-[3px] border-white/60 rounded-tr-3xl shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[3px] border-l-[3px] border-white/60 rounded-bl-3xl shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[3px] border-r-[3px] border-white/60 rounded-br-3xl shadow-[0_0_15px_rgba(255,255,255,0.1)]" />

                {/* Scanning Range Area */}
                <div className="absolute inset-2 overflow-hidden rounded-xl">
                  <motion.div
                    animate={{ top: ['0%', '98%', '0%'] }}
                    transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                    className="absolute inset-x-0 w-full"
                  >
                    {/* Glow trail */}
                    <div className="h-32 w-full bg-gradient-to-b from-transparent via-doccure-yellow/20 to-transparent absolute top-1/2 -translate-y-1/2 z-10" />
                    {/* Laser line */}
                    <div className="h-[2px] w-full bg-doccure-yellow shadow-[0_0_20px_rgba(221,242,71,1)] absolute top-1/2 -translate-y-1/2 z-20" />
                  </motion.div>
                </div>

                {/* Crosshairs Reticle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-full">
                    <div className="w-1.5 h-1.5 bg-doccure-yellow rounded-full animate-ping" />
                    <div className="w-1.5 h-1.5 bg-doccure-yellow rounded-full absolute" />
                    <div className="absolute top-1/2 -left-6 w-4 h-[0.5px] bg-white/70" />
                    <div className="absolute top-1/2 -right-6 w-4 h-[0.5px] bg-white/70" />
                    <div className="absolute -top-6 left-1/2 w-[0.5px] h-4 bg-white/70" />
                    <div className="absolute -bottom-6 left-1/2 w-[0.5px] h-4 bg-white/70" />
                  </div>
                </div>

                {/* Info popups */}
                <div className="absolute top-6 right-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-doccure-yellow animate-pulse" />
                    <span className="text-white text-[9px] font-black tracking-widest uppercase shadow-sm">AI Scan Active</span>
                  </motion.div>
                </div>
                
                <div className="absolute bottom-6 -left-12">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 w-56 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-doccure-teal/20 to-transparent" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-doccure-yellow mb-auto p-2 rounded-xl">
                          <Activity className="w-4 h-4 text-doccure-dark" />
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold leading-tight">Analisis Nutrisi</p>
                          <p className="text-doccure-yellow text-[9px] font-black mt-1 tracking-wider uppercase">On-Progress...</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div animate={{ width: ['0%', '85%', '85%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} className="h-full bg-doccure-yellow rounded-full" />
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div animate={{ width: ['0%', '60%', '60%'] }} transition={{ duration: 2, delay: 0.2, repeat: Infinity, repeatDelay: 1 }} className="h-full bg-emerald-400 rounded-full" />
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div animate={{ width: ['0%', '75%', '75%'] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity, repeatDelay: 1 }} className="h-full bg-cyan-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Bottom Padding */}
      <div className="h-20" />
    </div>
  )
}
