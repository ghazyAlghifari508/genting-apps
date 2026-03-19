import { motion } from 'framer-motion'
import { Sparkles, ChevronDown, TrendingUp, CheckCircle2, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DailyTasksCardProps {
  currentWeek: number
  dailyTasks: string[]
  isCompleted?: boolean
}

export function DailyTasksCard({ currentWeek, dailyTasks, isCompleted }: DailyTasksCardProps) {
  return (
    <div className="bg-white  border border-slate-200  rounded-2xl p-8 shadow-sm relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-doccure-teal/[0.03] rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900  flex items-center gap-2 transition-colors">
               Agenda Hari Ini
               <Sparkles size={18} className="text-doccure-yellow" />
            </h2>
            <p className="text-slate-500  font-medium text-sm mt-1 transition-colors">
              Minggu {currentWeek} • Bulan {Math.ceil(currentWeek / 4)} • Pastikan aktivitas terpenuhi.
            </p>
          </div>
        </div>

        {isCompleted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 px-6 bg-emerald-50/50  rounded-3xl border border-emerald-100  text-center space-y-4 min-h-[260px]"
          >
            <div className="w-16 h-16 bg-emerald-100  rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900  flex items-center justify-center gap-2">
                Luar Biasa, Bunda! <PartyPopper className="w-5 h-5 text-doccure-yellow" />
              </h3>
              <p className="text-slate-600  max-w-md mx-auto">
                Semua kegiatan roadmap untuk trimester ini telah selesai. Istirahat yang cukup dan terus pantau kesehatan ya!
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 min-h-[260px]">
            {dailyTasks.map((task, idx) => (
              <motion.div 
                key={task} 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 4 }}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50  border border-slate-100  hover:border-doccure-teal/30 hover:bg-white  hover:shadow-md transition-all cursor-pointer transition-colors"
              >
                <div className="w-6 h-6 rounded-lg border-2 border-slate-200  group-hover:border-doccure-teal flex items-center justify-center group-hover:bg-doccure-teal/10 transition-all duration-300">
                  <div className="w-2 h-2 rounded-sm bg-doccure-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-slate-700  font-bold flex-1 group-hover:text-slate-900  transition-colors">{task}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronDown className="w-4 h-4 text-doccure-teal" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100  flex justify-between items-center transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 ">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Streak: 5 Hari</span>
          </div>
          <Button asChild variant="ghost" className="text-doccure-teal font-bold hover:bg-doccure-teal/5  rounded-xl transition-colors">
            <Link href="/roadmap">Lihat Roadmap</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
