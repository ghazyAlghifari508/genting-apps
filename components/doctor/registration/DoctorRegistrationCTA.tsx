'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DoctorRegistrationModal } from './DoctorRegistrationModal'
import { Stethoscope, ArrowRight, ShieldCheck } from 'lucide-react'
import { useUserRole } from '@/hooks/useUserRole'
import { useAuth } from '@/hooks/useAuth'

export function DoctorRegistrationCTA() {
  const { user } = useAuth()
  const { role, loading } = useUserRole()
  const [isOpen, setIsOpen] = useState(false)

  // Only show for logged-in users who are NOT doctors/admins
  if (loading || !user || role === 'doctor' || role === 'admin') {
    return null
  }

  return (
    <>
      <Card className="relative overflow-hidden border-0 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-900/20 mb-8 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-doccure-teal/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sea-green/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-sea-green" />
              <span className="text-xs font-bold text-sea-green uppercase tracking-wider">Join Professional Team</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-3 text-white">
              Apakah Anda Seorang Dokter?
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed mb-6 md:mb-0">
              Bergabunglah dengan GENTING untuk membantu ribuan ibu hamil di Indonesia. 
              Kelola jadwal konsultasi, dapatkan penghasilan tambahan, dan perluas jangkauan praktik Anda secara digital.
            </p>
          </div>
          
          <div className="shrink-0">
            <Button 
              onClick={() => setIsOpen(true)}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-doccure-teal to-sea-green hover:from-doccure-teal/90 hover:to-sea-green/90 text-white font-bold text-lg shadow-xl shadow-doccure-teal/20 transition-all transform hover:-translate-y-1"
            >
              <Stethoscope className="mr-2 w-5 h-5" />
              Daftar Sebagai Dokter
              <ArrowRight className="ml-2 w-5 h-5 opacity-80" />
            </Button>
            <p className="text-[10px] text-slate-500 font-bold text-center mt-3">
              Proses verifikasi 1-3 hari kerja
            </p>
          </div>
        </div>
      </Card>

      <DoctorRegistrationModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}
