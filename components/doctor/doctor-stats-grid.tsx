'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Users, MessageCircle, TrendingUp } from 'lucide-react'

interface DoctorStats {
  totalClients: number
  pendingChats: number
  todayEarnings: number
}

interface DoctorStatsGridProps {
  stats: DoctorStats
}

export function DoctorStatsGrid({ stats }: DoctorStatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-lavender/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-lavender" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalClients}</p>
          <p className="text-sm text-foreground/60">Total Pasien</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.pendingChats}</p>
          <p className="text-sm text-foreground/60">Chat Aktif</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-salmon/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-salmon" />
            </div>
          </div>
          <p className="text-2xl font-bold">Rp {stats.todayEarnings.toLocaleString('id-ID')}</p>
          <p className="text-sm text-foreground/60">Hari Ini</p>
        </Card>
      </motion.div>
    </div>
  )
}
