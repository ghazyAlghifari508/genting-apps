'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf, Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-floral flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-sea-green/5 rounded-full blur-[120px] -mr-64 -mt-32" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-cerulean/5 rounded-full blur-[100px] -ml-32 -mb-32" />

      <div className="max-w-md w-full text-center space-y-8 relative">
        {/* Animated Icon */}
        <motion.div
           initial={{ scale: 0, rotate: -20 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ 
             type: "spring",
             stiffness: 260,
             damping: 20,
             delay: 0.1 
           }}
           className="relative inline-block"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center border border-white/50 mb-4 mx-auto">
            <div className="relative">
               <Search className="w-12 h-12 md:w-16 md:h-16 text-slate-200" />
               <motion.div
                 animate={{ 
                   y: [0, -10, 0],
                   rotate: [0, 5, -5, 0]
                 }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute inset-0 flex items-center justify-center"
               >
                 <Leaf className="w-8 h-8 md:w-10 md:h-10 text-cerulean opacity-80" />
               </motion.div>
            </div>
          </div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-cerulean flex items-center justify-center text-white text-xs font-black shadow-lg"
          >
            404
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900"
          >
            Aduh, Bunda <span className="gradient-text">Nyasar</span> ya?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 font-bold text-lg leading-relaxed"
          >
            Halaman yang Bunda cari nggak ketemu nih. Mungkin alamatnya salah ketik atau halamannya udah pindah tempat.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <Button 
            asChild
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 h-14 font-black shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <Link href="/dashboard">
              <Home className="w-5 h-5" />
              Ke Dashboard
            </Link>
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-white/50 border-white/50 text-slate-600 rounded-2xl px-8 h-14 font-black hover:bg-white hover:text-slate-900 transition-all active:scale-95 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cerulean/5 rounded-full border border-cerulean/10">
             <div className="w-1.5 h-1.5 rounded-full bg-cerulean animate-pulse" />
             <span className="text-[10px] font-black text-cerulean uppercase tracking-widest">GENTING Anti-Stunting</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
