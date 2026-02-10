'use client'

import { motion } from 'framer-motion'
import { MagicCard } from '@/components/ui/magic-card'
import { Flame } from 'lucide-react'

interface BabyJourneyCardProps {
  weekNumber: number
  babySize: {
    name: string
    icon: React.ReactNode
    desc: string
  }
}

export function BabyJourneyCard({ weekNumber, babySize }: BabyJourneyCardProps) {
  return (
    <MagicCard className="p-10 h-full flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-white to-cerulean/5 overflow-hidden group/journey relative">
      <div className="relative shrink-0">
         <div className="absolute inset-0 bg-cerulean/20 rounded-full blur-3xl animate-pulse" />
         <motion.div 
           animate={{ 
             y: [0, -15, 0],
             rotate: [0, 5, -5, 0]
           }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           className="relative text-9xl filter drop-shadow-2xl"
         >
           {babySize.icon}
         </motion.div>
      </div>
      
      <div className="flex-1 relative z-10 text-center md:text-left">
        <p className="text-[10px] font-black text-cerulean uppercase tracking-[0.2em] mb-4">Perkembangan Si Kecil</p>
        <h2 className="text-4xl font-black text-slate-900 mb-3">Si kecil sekarang seukuran <span className="text-cerulean">{babySize.name}</span>!</h2>
        <p className="text-lg text-slate-500 font-bold leading-relaxed mb-8 max-w-lg">
          {babySize.desc} Bunda melakukan pekerjaan hebat menjaga kesehatan si kecil.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Harian</p>
              <p className="text-xl font-black text-slate-800">85/100 XP</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-cerulean w-[85%]" />
              </div>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Nutrisi</p>
              <p className="text-xl font-black text-sea-green">Sangat Baik</p>
           </div>
           <div className="hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Streak</p>
              <p className="text-xl font-black text-grapefruit flex items-center gap-1">
                12 Hari <Flame className="w-5 h-5 fill-current" />
              </p>
           </div>
        </div>
      </div>

      {/* Background design elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cerulean/10 rounded-full blur-[100px] opacity-50" />
    </MagicCard>
  )
}
