'use client'

import { motion } from 'framer-motion'
import { Flame, Trophy, Target, Star, Sparkles } from 'lucide-react'

interface RoadmapProgressProps {
  completedCount: number
  totalCount: number
  streakDays: number
  totalXp: number
}

const milestones = [
  { id: 'first_complete', label: 'Langkah Pertama', desc: 'Selesaikan 1 aktivitas', threshold: 1, icon: Star },
  { id: 'five_complete', label: 'Bunda Aktif', desc: 'Selesaikan 5 aktivitas', threshold: 5, icon: Target },
  { id: 'ten_complete', label: 'Bunda Hebat', desc: 'Selesaikan 10 aktivitas', threshold: 10, icon: Trophy },
  { id: 'all_complete', label: 'Bunda Champion', desc: 'Selesaikan semua aktivitas', threshold: 18, icon: Sparkles },
]

export function RoadmapProgress({ completedCount, totalCount, streakDays, totalXp }: RoadmapProgressProps) {
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Progress Ring + Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl">
        {/* Circular Progress */}
        <div className="relative w-36 h-36 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="text-cerulean"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              initial={{ strokeDasharray: '0, 100' }}
              animate={{ strokeDasharray: `${progressPercentage}, 100` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900">{progressPercentage}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selesai</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="p-4 rounded-2xl bg-cerulean/5 border border-cerulean/10">
            <p className="text-[10px] font-black text-cerulean uppercase tracking-widest mb-1">Misi Selesai</p>
            <p className="text-2xl font-black text-slate-900">{completedCount}<span className="text-sm text-slate-400">/{totalCount}</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-grapefruit/5 border border-grapefruit/10">
            <p className="text-[10px] font-black text-grapefruit uppercase tracking-widest mb-1">Streak</p>
            <p className="text-2xl font-black text-slate-900 flex items-center gap-1">
              {streakDays} <Flame className="w-5 h-5 text-grapefruit fill-grapefruit" />
            </p>
          </div>
          <div className="col-span-2 p-4 rounded-2xl bg-sea-green/5 border border-sea-green/10">
            <p className="text-[10px] font-black text-sea-green uppercase tracking-widest mb-1">Total XP</p>
            <p className="text-2xl font-black text-slate-900 flex items-center gap-2">
              {totalXp} XP <Sparkles className="w-5 h-5 text-amber-400" />
            </p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="p-8 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Achievement
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {milestones.map((milestone) => {
            const isUnlocked = completedCount >= milestone.threshold
            return (
              <motion.div
                key={milestone.id}
                whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                className={`relative p-5 rounded-2xl text-center transition-all overflow-hidden ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-2 border-amber-200 shadow-lg shadow-amber-100/50'
                    : 'bg-slate-50 border border-slate-100 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                  isUnlocked ? 'bg-amber-200/50' : 'bg-slate-200/50'
                }`}>
                  <milestone.icon className={`w-6 h-6 ${isUnlocked ? 'text-amber-600' : 'text-slate-400'}`} />
                </div>
                <p className={`text-xs font-black mb-1 ${isUnlocked ? 'text-amber-800' : 'text-slate-400'}`}>
                  {milestone.label}
                </p>
                <p className={`text-[10px] font-bold ${isUnlocked ? 'text-amber-600' : 'text-slate-300'}`}>
                  {milestone.desc}
                </p>
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-sea-green flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
