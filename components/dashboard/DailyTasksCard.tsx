import { motion } from 'framer-motion'
import { Sparkles, Users, ChevronDown, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DailyTasksCardProps {
  currentWeek: number
  dailyTasks: string[]
}

export function DailyTasksCard({ currentWeek, dailyTasks }: DailyTasksCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-8 shadow-sm relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-doccure-teal/[0.03] rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
               Agenda Hari Ini
               <Sparkles size={18} className="text-doccure-yellow" />
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors">Minggu {currentWeek} • Pastikan aktivitas terpenuhi.</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors">A</div>
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-colors">N</div>
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {dailyTasks.map((task, idx) => (
            <motion.div 
              key={task} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 4 }}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-doccure-teal/30 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-500 group-hover:border-doccure-teal flex items-center justify-center group-hover:bg-doccure-teal/10 transition-all duration-300">
                <div className="w-2 h-2 rounded-sm bg-doccure-teal opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-bold flex-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{task}</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronDown className="w-4 h-4 text-doccure-teal" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Streak: 5 Hari</span>
          </div>
          <Button variant="ghost" className="text-doccure-teal font-bold hover:bg-doccure-teal/5 dark:hover:bg-slate-700 rounded-xl transition-colors">
            Lihat Riwayat Agenda
          </Button>
        </div>
      </div>
    </div>
  )
}
