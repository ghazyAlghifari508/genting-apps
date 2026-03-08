'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConsultationStatusBadge } from '@/components/shared/ConsultationStatus'
import type { Consultation } from '@/types/consultation'

interface ConsultationHistoryProps {
  consultations: Consultation[]
}

export function ConsultationHistory({ consultations }: ConsultationHistoryProps) {
  return (
    <div id="konsultasi-history" className="rounded-[32px] sm:rounded-[40px] border border-slate-100  bg-white  p-4 sm:p-6 shadow-sm md:p-8 relative overflow-hidden w-full transition-colors duration-300">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
       
       <div className="mb-10 flex flex-wrap items-end justify-between gap-4 relative z-10">
         <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="h-1.5 w-8 rounded-full bg-emerald-500" />
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Past Sessions</p>
           </div>
           <h2 className="text-3xl font-black tracking-tight text-slate-900 ">Riwayat Konsultasi</h2>
         </div>
       </div>

       {consultations.length === 0 ? (
         <div className="flex flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200  bg-slate-50/50  py-24 text-center">
            <Clock className="h-12 w-12 text-slate-200 mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum ada riwayat sesi.</p>
         </div>
       ) : (
         <div className="space-y-4">
           {consultations.map((c) => (
             <div key={c.id} className="group relative overflow-hidden rounded-[28px] border border-slate-100  bg-[#fbfcfc]  p-4 transition-all hover:bg-white  hover:shadow-lg hover:border-emerald-500/30">
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
                         <p className="text-sm font-black text-slate-900 ">{c.doctor?.full_name || 'Spesialis'}</p>
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
  )
}
