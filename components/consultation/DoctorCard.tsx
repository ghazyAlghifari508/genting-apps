'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Stethoscope, ShieldCheck, PlusCircle, Clock, Sparkles, ArrowRight } from 'lucide-react'
import type { Doctor } from '@/types/doctor'

interface DoctorCardProps {
  doctor: Doctor
  index: number
}

export function DoctorCard({ doctor, index }: DoctorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05 }}
      className="w-full"
    >
      <div className="group relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 transition-all duration-500 hover:border-doccure-teal/50 hover:shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12)] hover:-translate-y-1 w-full">
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
  )
}
