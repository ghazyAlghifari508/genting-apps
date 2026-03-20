'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/hooks/useUserRole'

export default function DoctorPendingPage() {
  const { role, loading, dbLoading } = useUserRole()
  const router = useRouter()

  const isChecking = loading || dbLoading

  // Check if user just registered (bypass session check for dummy testing)
  const isJustRegistered = typeof window !== 'undefined' && localStorage.getItem('genting_just_registered') === 'true'

  // Graceful fallback for unauthenticated users or those awaiting email verification
  const renderAwaitingState = () => (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 transition-colors font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden transition-all p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/20"
        >
          <Mail className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Pendaftaran Terkirim! 📮</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
          Terima kasih atas ketertarikan Anda. Formulir pendaftaran Anda telah kami terima dan kini sedang dalam tahap peninjauan oleh tim admin Genting+.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 text-left">
          <p className="text-sm text-slate-600 mb-2 font-medium">Langkah Selanjutnya:</p>
          <ul className="text-sm text-slate-500 space-y-2 list-disc pl-4">
            <li>Tim kami akan melakukan verifikasi berkas medis Anda.</li>
            <li>Anda akan menerima notifikasi pendaftaran disetujui melalui email.</li>
            <li>Setelah disetujui, Anda dapat mulai melayani pasien di Dasbor Dokter.</li>
          </ul>
        </div>

        <Button 
          onClick={() => {
            localStorage.removeItem('genting_just_registered')
            router.push('/')
          }} 
          className="w-full h-14 rounded-2xl bg-doccure-teal text-white font-black hover:opacity-90 transition-all shadow-lg shadow-doccure-teal/20"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-doccure-teal animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Memverifikasi Status...</p>
        </div>
      </div>
    )
  }

  // If user has the 'just registered' flag, show success state even if role/session is missing
  if (isJustRegistered && role !== 'doctor-pending') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(15,104,86,0.1)] border border-slate-100 overflow-hidden">
            <div className="p-8 sm:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 mx-auto mb-8 rounded-[2.5rem] bg-gradient-to-br from-doccure-teal to-genting-cerulean flex items-center justify-center shadow-xl"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Pendaftaran Sukses! 🎉</h1>
              <p className="text-xl text-slate-500 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
                Formulir pendaftaran tenaga medis Anda telah berhasil dikirimkan ke sistem Genting+. Akun Anda kini masuk dalam antrean verifikasi.
              </p>

              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 text-left mb-8">
                <div className="flex gap-4 items-start">
                  <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1 leading-none">Status: Menunggu Tinjauan Admin</h3>
                    <p className="text-sm text-amber-700/80 leading-relaxed font-medium">
                      Tim admin kami akan memvalidasi STR dan sertifikasi Anda dalam kurun waktu 1x24 jam kerja. Harap pantau email Anda secara berkala.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  localStorage.removeItem('genting_just_registered')
                  router.push('/')
                }}
                className="w-full h-16 rounded-[1.5rem] bg-doccure-dark text-white font-black hover:opacity-90 transition-all flex items-center justify-center gap-3 text-lg"
              >
                Kembali ke Beranda <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If loading finished and role is not doctor-pending
  if (!isChecking && role !== 'doctor-pending') {
    // If user is already approved, redirect to dashboard
    if (role === 'doctor') {
      router.push('/doctor')
      return null
    }
    
    // If no session or other role, show the "Check Email / Login" friendly state
    return renderAwaitingState()
  }


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 transition-colors font-sans">
      {/* Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(15,104,86,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-doccure-teal/5 rounded-full blur-[100px] -mr-48 -mb-48" />
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-doccure-yellow/5 rounded-full blur-[80px] -ml-36" />
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden transition-all p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-gradient-to-br from-doccure-dark to-doccure-teal flex items-center justify-center shadow-2xl shadow-doccure-dark/20"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight transition-colors">
          Pendaftaran Berhasil! 🎉
        </h2>
        <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto transition-colors">
          Tim medis Genting akan meninjau data Anda dalam waktu 1-3 hari kerja. Anda akan menerima notifikasi via email.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
          <div className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 transition-colors">
            <Clock className="w-6 h-6 text-amber-500 mb-3" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">Status Review</h4>
            <p className="text-xs text-slate-500">Pendaftaran Anda sedang dalam antrean verifikasi.</p>
          </div>
          <div className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-doccure-teal mb-3" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">Langkah Terakhir</h4>
            <p className="text-xs text-slate-500">Akun Anda akan otomatis beralih ke fitur Dokter.</p>
          </div>
        </div>

        <Button 
          onClick={() => router.push('/')} 
          className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black hover:opacity-90 transition-all"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}
