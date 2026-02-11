'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Dumbbell, Salad, Clock, Calendar, Sparkles, ChevronRight } from 'lucide-react'
import { MagicCard } from '@/components/ui/magic-card'

interface Activity {
  id: string
  activity_name: string
  category: string
  description: string
  difficulty_level: number
  duration_minutes: number
  frequency_per_week: number
  xp_reward: number
}

interface ActivityCardProps {
  activity: Activity
  index: number
  status: 'not_started' | 'in_progress' | 'completed'
  statusInfo: { label: string; icon: any; color: string; bg: string }
  difficulty: { label: string; color: string; bg: string }
  onClick: () => void
}

export const ActivityCard = React.memo(({ 
  activity, 
  index, 
  status, 
  statusInfo, 
  difficulty, 
  onClick 
}: ActivityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div
        className="cursor-pointer"
        onClick={onClick}
      >
        <MagicCard
          className={`p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border-white group ${
            status === 'completed' ? 'opacity-75' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                activity.category === 'exercise' ? 'bg-cerulean/10' : 'bg-sea-green/10'
              }`}>
                {activity.category === 'exercise' 
                  ? <Dumbbell className={`w-7 h-7 ${activity.category === 'exercise' ? 'text-cerulean' : 'text-sea-green'}`} />
                  : <Salad className="w-7 h-7 text-sea-green" />
                }
              </div>
              <div>
                <h3 className={`text-lg font-black text-slate-900 ${status === 'completed' ? 'line-through' : ''}`}>
                  {activity.activity_name}
                </h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${difficulty.bg} ${difficulty.color}`}>
                  {difficulty.label}
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusInfo.bg}`}>
              <statusInfo.icon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
              <span className={`text-[10px] font-black ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
          </div>

          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">
            {activity.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
              {activity.duration_minutes > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activity.duration_minutes}m
                </span>
              )}
              {activity.frequency_per_week > 0 && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activity.frequency_per_week}x/mg
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cerulean flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                +{activity.xp_reward} XP
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cerulean group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </MagicCard>
      </div>
    </motion.div>
  )
})

ActivityCard.displayName = 'ActivityCard'
