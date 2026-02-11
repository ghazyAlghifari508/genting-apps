'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Calendar,
  Utensils,
  Dumbbell,
  Sparkles,
  TrendingUp,
  Heart,
  Baby,
  Sprout,
  Grape,
  Citrus,
  Nut,
  CircleDot
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { BabyJourneyCard } from '@/components/dashboard/baby-journey-card'
import { QuickActionsGrid } from '@/components/dashboard/quick-actions-grid'
import { AgendaSection } from '@/components/dashboard/agenda-section'
import { MagicCard } from '@/components/ui/magic-card'
import { LoadingScreen } from '@/components/ui/loading-screen'

interface UserData {
  fullName: string
  avatarUrl: string | null
  xpPoints: number
  trimester: number | null
  dueDate: string | null
  weekNumber: number
}

const chartData = [
  { day: 'Sen', xp: 40 },
  { day: 'Sel', xp: 30 },
  { day: 'Rab', xp: 60 },
  { day: 'Kam', xp: 45 },
  { day: 'Jum', xp: 90 },
  { day: 'Sab', xp: 75 },
  { day: 'Min', xp: 120 },
]

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    avatarUrl: null,
    xpPoints: 0,
    trimester: null,
    dueDate: null,
    weekNumber: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, xp_points')
          .eq('id', user.id)
          .single()

        const { data: pregnancy } = await supabase
          .from('pregnancy_data')
          .select('start_date, due_date, trimester')
          .eq('user_id', user.id)
          .single()

        let weekNumber = 0
        if (pregnancy?.start_date) {
          const startDate = new Date(pregnancy.start_date)
          const today = new Date()
          weekNumber = Math.floor((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
        }

        setUserData({
          fullName: profile?.full_name || user.email?.split('@')[0] || 'User',
          avatarUrl: profile?.avatar_url,
          xpPoints: profile?.xp_points || 0,
          trimester: pregnancy?.trimester,
          dueDate: pregnancy?.due_date,
          weekNumber
        })
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [supabase, router])

  const getBabySize = (week: number) => {
    if (week <= 4) return { name: 'Biji Poppy', icon: <Sprout className="w-full h-full text-sea-green" />, desc: 'Si kecil masih sangat mungil!' }
    if (week <= 8) return { name: 'Buah Raspberry', icon: <Grape className="w-full h-full text-pink-500" />, desc: 'Jantung si kecil mulai berdetak.' }
    if (week <= 12) return { name: 'Buah Lemon', icon: <Citrus className="w-full h-full text-yellow-400" />, desc: 'Si kecil sudah mulai bergerak.' }
    if (week <= 16) return { name: 'Buah Alpukat', icon: <Nut className="w-full h-full text-green-500" />, desc: 'Si kecil sudah bisa menghisap jempol.' }
    if (week <= 20) return { name: 'Bawang Bombay', icon: <CircleDot className="w-full h-full text-amber-600" />, desc: 'Indera si kecil mulai berkembang.' }
    if (week <= 24) return { name: 'Buah Mangga', icon: <CircleDot className="w-full h-full text-orange-500" />, desc: 'Si kecil sudah bisa mendengar suara Bunda.' }
    if (week <= 28) return { name: 'Kembang Kol', icon: <Sprout className="w-full h-full text-green-300" />, desc: 'Si kecil mulai membuka matanya.' }
    if (week <= 32) return { name: 'Nanas', icon: <CircleDot className="w-full h-full text-yellow-500" />, desc: 'Si kecil sedang bersiap untuk lahir.' }
    if (week <= 36) return { name: 'Melon', icon: <CircleDot className="w-full h-full text-green-400" />, desc: 'Paru-paru si kecil hampir matang.' }
    return { name: 'Semangka', icon: <CircleDot className="w-full h-full text-red-500" />, desc: 'Si kecil sudah siap menyapa dunia!' }
  }

  const babySize = getBabySize(userData.weekNumber)

  if (loading) {
    return <LoadingScreen message="Memuat Dashboard..." />;
  }

  return (
    <div className="space-y-10 pb-24 relative">
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-sea-green/5 rounded-full blur-[120px] -mr-64 -mt-32" />
      <div className="absolute top-1/2 left-0 -z-10 w-[300px] h-[300px] bg-cerulean/5 rounded-full blur-[100px] -ml-32" />

      <section className="relative px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cerulean to-sea-green rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-white p-1 shadow-2xl border border-white/50 overflow-hidden">
              <div className="w-full h-full rounded-[2.8rem] bg-gradient-to-br from-cerulean/10 to-sea-green/10 flex items-center justify-center overflow-hidden">
                {userData.avatarUrl ? (
                  <img src={userData.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cerulean/5">
                    <Baby className="w-16 h-16 text-cerulean/40" />
                  </div>
                )}
              </div>
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-xl border border-white/50"
            >
              <Sparkles className="w-6 h-6 text-amber-400" />
            </motion.div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-black text-cerulean uppercase tracking-[0.3em] mb-3">Selamat Pagi, Bunda!</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
              Apa kabar <span className="gradient-text">{userData.fullName.split(' ')[0]}</span> hari ini?
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-5 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white/50 text-slate-600 font-bold text-sm shadow-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cerulean" />
                Minggu ke-{userData.weekNumber}
              </div>
              <div className="px-5 py-2 bg-sea-green/10 rounded-full text-sea-green font-black text-sm shadow-sm flex items-center gap-2 border border-sea-green/10">
                <Sparkles className="w-4 h-4" />
                Level 4: Bunda Siaga
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 xl:col-span-8">
          <BabyJourneyCard weekNumber={userData.weekNumber} babySize={babySize} />
        </div>

        <div className="lg:col-span-12 xl:col-span-4">
          <MagicCard className="p-8 h-full bg-slate-900 text-white border-0 shadow-2xl shadow-slate-900/20 overflow-hidden relative">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black tracking-tight">Vitals Hari Ini</h3>
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-sea-green" />
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-cerulean/20 flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-cerulean" />
                         </div>
                         <span className="font-bold text-sm">Nutrisi</span>
                      </div>
                      <span className="font-black text-cerulean">8.5/10</span>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-sea-green/20 flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-sea-green" />
                         </div>
                         <span className="font-bold text-sm">Aktivitas</span>
                      </div>
                      <span className="font-black text-sea-green">45m</span>
                   </div>

                   <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-grapefruit/20 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-grapefruit" />
                         </div>
                         <span className="font-bold text-sm">Kesehatan</span>
                      </div>
                      <span className="font-black text-grapefruit">Stabil</span>
                   </div>
                </div>

                <Button className="w-full mt-8 h-14 rounded-2xl bg-white text-slate-900 font-black hover:bg-slate-100 transition-all active:scale-95">
                   Lihat Statistik Lengkap
                </Button>
             </div>
             
             <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-10 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <Area type="monotone" dataKey="xp" stroke="#fff" fill="none" strokeWidth={2} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </MagicCard>
        </div>
      </div>

      <QuickActionsGrid />

      <AgendaSection />
    </div>
  )
}
