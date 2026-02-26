import { motion } from 'framer-motion'
import Link from 'next/link'
import { Camera, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VisionBanner() {
  return (
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

              <div className="absolute inset-2 overflow-hidden rounded-xl">
                <motion.div
                  animate={{ top: ['0%', '98%', '0%'] }}
                  transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                  className="absolute inset-x-0 w-full"
                >
                  <div className="h-32 w-full bg-gradient-to-b from-transparent via-doccure-yellow/20 to-transparent absolute top-1/2 -translate-y-1/2 z-10" />
                  <div className="h-[2px] w-full bg-doccure-yellow shadow-[0_0_20px_rgba(221,242,71,1)] absolute top-1/2 -translate-y-1/2 z-20" />
                </motion.div>
              </div>

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
  )
}
