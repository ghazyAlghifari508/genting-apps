'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Stethoscope, Calendar, History, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { clearApprovalFlag } from '@/app/actions/clearApprovalFlag'

export default function DoctorApprovedPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleNavigateToDashboard = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const result = await clearApprovalFlag()
      if (result.success) {
        // Force router refresh to update server components/middleware state
        router.refresh() 
        // Give a tiny moment for cache/db to settle
        setTimeout(() => {
          router.replace('/doctor')
        }, 100)
      }
    } catch (error) {
      console.error('Navigation error:', error)
      alert('Gagal membersihkan status approval. Silakan coba lagi atau hubungi support.')
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: Stethoscope, text: 'Menerima konsultasi dari pasien' },
    { icon: Calendar, text: 'Mengatur jadwal praktik' },
    { icon: History, text: 'Melihat riwayat konsultasi' },
    { icon: UserCircle, text: 'Update profil doctor' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-teal-200/30 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-100/50 p-8 sm:p-10 text-center border border-emerald-50">
          
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.3 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight"
          >
            Pendaftaran Anda Disetujui! 🎉
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-500 font-medium mb-6 text-sm sm:text-base"
          >
            Selamat! Anda sekarang terdaftar sebagai <span className="font-bold text-emerald-600">Doctor</span> di GENTING dan siap melayani pasien.
          </motion.p>

          {/* Estimation badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center gap-3 justify-center">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm font-bold text-amber-800">
                Admin telah memverifikasi data Anda
              </p>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-50 rounded-2xl p-5 mb-8 text-left"
          >
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sekarang Anda bisa:</p>
            <div className="space-y-3">
              {benefits.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <Button
              onClick={handleNavigateToDashboard}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              {isLoading ? 'Memuat...' : 'Pergi ke Dashboard Doctor →'}
            </Button>
          </motion.div>

          {/* Support link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-xs text-slate-400 mt-6"
          >
            Butuh bantuan?{' '}
            <a href="mailto:support@genting.com" className="text-emerald-500 hover:underline font-medium">
              support@genting.com
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
