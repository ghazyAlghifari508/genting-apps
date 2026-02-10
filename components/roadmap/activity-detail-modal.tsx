'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  X,
  Clock,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Star,
  CheckCircle2,
  Loader2,
  Sparkles,
  ChevronRight,
  Heart,
  Shield,
  Zap,
  ListChecks	
} from 'lucide-react'

interface Activity {
  id: string
  activity_name: string
  category: string
  description: string
  benefits: string[]
  difficulty_level: number
  min_trimester: number
  max_trimester: number
  duration_minutes: number
  frequency_per_week: number
  instructions: string[]
  tips: string | null
  warnings: string | null
  xp_reward: number
  icon_name: string
}

interface ActivityDetailModalProps {
  activity: Activity | null
  isOpen: boolean
  onClose: () => void
  onComplete: (activityId: string) => Promise<void>
  status: 'not_started' | 'in_progress' | 'completed'
  isLoading?: boolean
}

const difficultyConfig = {
  1: { label: 'Pemula', color: 'bg-sea-green/10 text-sea-green border-sea-green/20', stars: 1 },
  2: { label: 'Menengah', color: 'bg-apricot/10 text-amber-700 border-apricot/20', stars: 2 },
  3: { label: 'Lanjutan', color: 'bg-grapefruit/10 text-grapefruit border-grapefruit/20', stars: 3 },
}

export function ActivityDetailModal({ activity, isOpen, onClose, onComplete, status, isLoading }: ActivityDetailModalProps) {
  if (!activity) return null

  const difficulty = difficultyConfig[activity.difficulty_level as keyof typeof difficultyConfig]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 top-16 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-[5vh] md:bottom-[5vh] md:w-[600px] z-50 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className={`relative px-8 pt-8 pb-6 ${activity.category === 'exercise' ? 'bg-gradient-to-br from-cerulean/5 to-cerulean/10' : 'bg-gradient-to-br from-sea-green/5 to-sea-green/10'}`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${difficulty.color}`}>
                  {difficulty.label}
                  <span className="ml-1">{'⭐'.repeat(difficulty.stars)}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                  Trimester {activity.min_trimester === activity.max_trimester ? activity.min_trimester : `${activity.min_trimester}-${activity.max_trimester}`}
                </span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {activity.activity_name}
              </h2>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">
                {activity.description}
              </p>

              <div className="flex items-center gap-6 mt-5">
                {activity.duration_minutes > 0 && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold">{activity.duration_minutes} menit</span>
                  </div>
                )}
                {activity.frequency_per_week > 0 && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold">{activity.frequency_per_week}x/minggu</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-cerulean">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-black">+{activity.xp_reward} XP</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              {/* Benefits */}
              {activity.benefits && activity.benefits.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-sea-green/10 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-sea-green" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">Manfaat</h3>
                  </div>
                  <div className="space-y-2">
                    {activity.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-sea-green/5">
                        <CheckCircle2 className="w-4 h-4 text-sea-green mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {activity.instructions && activity.instructions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-cerulean/10 flex items-center justify-center">
                      <ListChecks className="w-4 h-4 text-cerulean" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">Langkah-Langkah</h3>
                  </div>
                  <div className="space-y-3">
                    {activity.instructions.map((step, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-cerulean/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-black text-cerulean">{i + 1}</span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {activity.tips && (
                <div className="p-5 rounded-2xl bg-apricot/10 border border-apricot/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    <h3 className="font-black text-amber-800">Tips</h3>
                  </div>
                  <p className="text-sm text-amber-800/80 font-medium leading-relaxed">{activity.tips}</p>
                </div>
              )}

              {/* Warnings */}
              {activity.warnings && (
                <div className="p-5 rounded-2xl bg-grapefruit/5 border border-grapefruit/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-grapefruit" />
                    <h3 className="font-black text-grapefruit">Peringatan</h3>
                  </div>
                  <p className="text-sm text-grapefruit/80 font-medium leading-relaxed">{activity.warnings}</p>
                </div>
              )}
            </div>

            {/* Bottom Action */}
            <div className="px-8 py-6 border-t border-slate-100 bg-white">
              {status === 'completed' ? (
                <div className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-sea-green/10 text-sea-green font-black">
                  <CheckCircle2 className="w-5 h-5" />
                  Aktivitas Selesai!
                </div>
              ) : (
                <Button
                  onClick={() => onComplete(activity.id)}
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-base shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : status === 'in_progress' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Tandai Selesai
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Mulai Aktivitas
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
