import { motion } from 'framer-motion'
import { Baby } from 'lucide-react'

interface PregnancyStatusCardProps {
  activeTrimester: number
  pregnancyProgress: number
  currentWeek: number
  currentDay: number
  daysTo1000: number
}

export function PregnancyStatusCard({
  activeTrimester,
  pregnancyProgress,
  currentWeek,
  currentDay,
  daysTo1000
}: PregnancyStatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-doccure-dark rounded-2xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden group"
    >
      {/* Decorative Pulse Accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-doccure-yellow/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-doccure-yellow/10 p-2 rounded-xl">
              <Baby className="w-5 h-5 text-doccure-yellow" />
            </div>
            <h3 className="text-xl font-bold text-white">Status Kehamilan Aktif</h3>
            <div className="ml-auto md:ml-0 bg-doccure-yellow/20 text-doccure-yellow px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">Trimester {activeTrimester}</div>
          </div>
          
          <div className="relative h-3 bg-white/5 rounded-full mb-3 overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pregnancyProgress}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-doccure-yellow via-yellow-400 to-yellow-200 rounded-full" 
            />
          </div>
          <div className="flex justify-between text-white/40 text-[10px] font-bold uppercase tracking-[0.1em]">
            <span>Minggu 1</span>
            <span className="text-doccure-yellow">{pregnancyProgress}% Kehamilan Terlewati</span>
            <span>Minggu 40</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:w-[320px]">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-wider mb-1">Minggu</p>
            <p className="text-2xl font-bold text-white leading-none">{currentWeek}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-wider mb-1">Hari</p>
            <p className="text-2xl font-bold text-white leading-none">{currentDay}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-wider mb-1">Sisa</p>
            <p className="text-2xl font-bold text-white leading-none">{daysTo1000}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
