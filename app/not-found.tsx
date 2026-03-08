'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Stethoscope, HeartPulse } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-doccure-dark flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Concentric ring decorations - matching landing page */}
      <div className="absolute top-[-30%] left-[-15%] w-[700px] h-[700px] border-[50px] border-doccure-teal/15 rounded-full pointer-events-none" />
      <div className="absolute top-[-25%] left-[-10%] w-[600px] h-[600px] border-[35px] border-doccure-teal/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] border-[40px] border-doccure-yellow/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] border-[25px] border-doccure-yellow/5 rounded-full pointer-events-none" />

      {/* Floating medical decor */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] right-[15%] w-14 h-14 rounded-2xl bg-doccure-teal/20 flex items-center justify-center"
      >
        <HeartPulse className="w-7 h-7 text-doccure-yellow/60" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[20%] left-[12%] w-12 h-12 rounded-2xl bg-doccure-yellow/10 flex items-center justify-center"
      >
        <Stethoscope className="w-6 h-6 text-doccure-teal/40" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Large 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <h1 className="text-[140px] sm:text-[180px] font-black leading-none tracking-tighter select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-doccure-yellow to-doccure-yellow/40">
              4
            </span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/20">
                0
              </span>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-doccure-yellow/30" />
              </motion.div>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-doccure-yellow to-doccure-yellow/40">
              4
            </span>
          </h1>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-base sm:text-lg text-white/50 font-medium leading-relaxed max-w-sm mx-auto">
            Maaf Bunda, halaman yang dicari tidak tersedia. Mungkin sudah dipindahkan atau alamatnya salah.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4"
        >
          <Button
            asChild
            className="w-full sm:w-auto bg-doccure-yellow hover:bg-[#cbe33a] text-doccure-dark rounded-full px-8 h-14 font-black shadow-md transition-all active:scale-95 flex items-center gap-2.5 text-base"
          >
            <Link href="/dashboard">
              <Home className="w-5 h-5" />
              Ke Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-white/5 border-white/15 text-white/80 rounded-full px-8 h-14 font-bold hover:bg-white/10 hover:text-white transition-all active:scale-95 flex items-center gap-2.5 text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </Button>
        </motion.div>

        {/* Bottom branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-10"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-doccure-yellow animate-pulse" />
            <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">GENTING Anti-Stunting</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
