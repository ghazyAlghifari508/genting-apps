'use client'

import { motion } from 'framer-motion'

interface RoadmapHeaderProps {
  todayLabel: string
}

export function RoadmapHeader({ todayLabel }: RoadmapHeaderProps) {
  return (
    <section className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Subtle decorative motif */}
      <div className="absolute top-0 right-0 w-64 h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #227c9d 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{todayLabel}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none transition-colors">
              Roadmap <span className="text-doccure-teal italic relative inline-block">
                1000 HPK
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg transition-colors">
              Peta jalan harian adaptif untuk tumbuh kembang optimal Bunda & Si Kecil.
            </p>
          </motion.div>

          <div className="hidden lg:block w-32" />
        </div>
      </div>
    </section>
  )
}
