'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Utensils, Dumbbell, BookOpen, Clock, ChevronRight, LucideIcon } from 'lucide-react'

interface Task {
  icon: LucideIcon
  title: string
  xp: number
  completed: boolean
  time: string
}

const todayTasks: Task[] = [
  { icon: Utensils, title: 'Sarapan Tinggi Protein', xp: 10, completed: true, time: '08:00' },
  { icon: Dumbbell, title: 'Senam Hamil Ringan', xp: 15, completed: false, time: '10:00' },
  { icon: BookOpen, title: 'Modul: Mengenal Stunting', xp: 5, completed: false, time: '13:00' },
]

export function AgendaSection() {
  return (
    <section className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-10 border border-white/50 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cerulean/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-sea-green flex items-center justify-center shadow-lg shadow-sea-green/20">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
             <h2 className="text-3xl font-black text-slate-900">Agenda Hari Ini</h2>
             <p className="text-slate-500 font-bold">Terorganisir untuk kenyamanan Bunda</p>
          </div>
        </div>
        <Link href="/roadmap">
          <Button variant="outline" className="h-12 px-8 rounded-2xl border-slate-200 font-black text-sm hover:bg-slate-900 hover:text-white transition-all">
            Lihat Roadmap Lengkap
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {todayTasks.map((task, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center gap-6 p-6 rounded-[2rem] transition-all bg-white shadow-sm border border-slate-100/50 ${task.completed ? 'bg-slate-50/80 opacity-60' : ''}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
              task.completed ? 'bg-slate-200 text-slate-500' : 'bg-gradient-to-br from-slate-50 to-white text-cerulean shadow-inner border border-slate-100'
            }`}>
              <task.icon className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-xl font-black text-slate-800 truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                {task.completed && <CheckCircle2 className="w-5 h-5 text-sea-green" />}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-cerulean">+{task.xp} XP</span>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                  <Clock className="w-3.5 h-3.5" />
                  {task.time}
                </div>
              </div>
            </div>
            {!task.completed && (
              <Button className="h-12 w-12 rounded-2xl p-0 bg-slate-900 text-white shadow-lg active:scale-95 transition-all">
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </motion.div>
        ))}
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-center p-6 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-cerulean/30 transition-all group pointer-events-none opacity-50"
        >
           <p className="text-slate-400 font-black group-hover:text-cerulean transition-colors">+ Tambah Agenda Kustom</p>
        </motion.div>
      </div>
    </section>
  )
}
