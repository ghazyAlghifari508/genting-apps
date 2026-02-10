'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MagicCard } from '@/components/ui/magic-card'
import { Camera, MessageCircle, Route, Stethoscope, LucideIcon } from 'lucide-react'

interface QuickAction {
  icon: LucideIcon
  title: string
  desc: string
  href: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    icon: Camera,
    title: 'GENTING Vision',
    desc: 'Analisis Nutrisi Makanan',
    href: '/vision',
    color: 'bg-cerulean/10 text-cerulean'
  },
  {
    icon: MessageCircle,
    title: 'Gemi-Mom Chat',
    desc: 'Tanya Asisten AI Anda',
    href: '/chat',
    color: 'bg-sea-green/10 text-sea-green'
  },
  {
    icon: Route,
    title: 'Roadmap Bunda',
    desc: 'Panduan Olahraga & Nutrisi',
    href: '/roadmap',
    color: 'bg-grapefruit/10 text-grapefruit'
  },
  {
    icon: Stethoscope,
    title: 'Konsultasi Spesialis',
    desc: 'Chat Dokter Profesional',
    href: '/consult',
    color: 'bg-cerulean/10 text-cerulean'
  },
]

export function QuickActionsGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-black text-slate-900">Program Khusus Bunda</h2>
        <div className="text-sm font-bold text-slate-400">{quickActions.length} Layanan Aktif</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link href={action.href} className="group">
              <MagicCard className="p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl h-full border-white">
                <div className={`w-20 h-20 rounded-[2.5rem] ${action.color} flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-6 shadow-sm border border-white/50`}>
                  <action.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-cerulean transition-colors tracking-tight">{action.title}</h3>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">{action.desc}</p>
              </MagicCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
