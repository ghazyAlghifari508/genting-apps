'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard,
  Route,
  Camera,
  Stethoscope,
  MessageCircle,
  History as HistoryIcon,
  LogOut,
  BookOpen
} from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Route, label: 'Roadmap', href: '/roadmap' },
  { icon: Camera, label: 'GENTING Vision', href: '/vision' },
  { icon: BookOpen, label: 'Education Hub', href: '/education' },
  { icon: Stethoscope, label: 'Konsultasi', href: '/konsultasi-dokter' },
  { icon: MessageCircle, label: 'Chat', href: '/chat' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="hidden lg:flex flex-col w-80 p-6 sticky top-0 h-screen overflow-visible transition-colors duration-300">
      <div className="flex-1 flex flex-col bg-white/70  backdrop-blur-3xl rounded-3xl border border-white/50  shadow-2xl shadow-cerulean/5 overflow-hidden transition-colors duration-300">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-0 group overflow-visible -ml-4">
            <Image src="/images/unsplash/logo-genting.png" alt="Genting Logo" width={100} height={100} className="w-[90px] h-[90px] scale-[1.3] object-contain transition-all group-hover:scale-110 group-hover:rotate-3 drop-shadow-md" />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={`group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-slate-900  text-white shadow-lg' 
                    : 'text-slate-500  hover:bg-white  hover:shadow-lg  hover:shadow-slate-200/50 hover:text-slate-900 '
                }`}>
                  <div className="flex items-center gap-4">
                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400  group-hover:text-cerulean'}`} />
                    <span className="font-black text-sm tracking-tight">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="active-indicator" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-cerulean" />
                    </motion.div>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 space-y-2">
          <button 
            onClick={() => router.push('/riwayat-transaksi')}
            className="flex w-full items-center gap-4 px-5 py-4 rounded-2xl text-slate-500  hover:bg-white  hover:shadow-lg  transition-all font-black text-sm"
          >
            <HistoryIcon className="w-5 h-5 text-slate-400 " />
            Riwayat Transaksi
          </button>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-5 py-4 rounded-2xl text-slate-500  hover:bg-slate-50  transition-all font-black text-sm"
          >
            <LogOut className="w-5 h-5" />
            Keluar Akun
          </button>
        </div>

        <div className="p-6 mt-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cerulean/5 to-sea-green/5   border border-cerulean/10  relative overflow-hidden group/status transition-colors">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-cerulean uppercase tracking-[0.2em] mb-3">Status Bunda</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-3 bg-white  shadow-inner rounded-full overflow-hidden p-0.5 transition-colors">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-gradient-to-r from-cerulean to-sea-green rounded-full shadow-sm" 
                  />
                </div>
                <span className="text-xs font-black text-slate-800  transition-colors">65%</span>
              </div>
              <p className="text-[10px] text-slate-500  font-bold leading-relaxed transition-colors">Terus pantau tumbuh kembang si kecil!</p>
            </div>
            {/* Soft decorative blob */}
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-cerulean/5 rounded-full blur-2xl group-hover/status:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </aside>
  )
}
