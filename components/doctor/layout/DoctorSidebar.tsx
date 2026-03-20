'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Stethoscope, 
  CalendarDays, 
  MessageSquare, 
  History,
  LogOut,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useUserContext } from '@/components/providers/Providers'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor' },
  { icon: Stethoscope, label: 'Profil Dokter', href: '/doctor/profile' },
  { icon: CalendarDays, label: 'Jadwal Konsultasi', href: '/doctor/consultations' },
  { icon: MessageSquare, label: 'Pesan', href: '/doctor/messages' },
  { icon: History, label: 'Riwayat Transaksi', href: '/doctor/earnings' },
]

export function DoctorSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { profile } = useUserContext()

  return (
    <div className="w-64 h-screen bg-white  fixed left-0 top-0 border-r border-slate-100  flex flex-col z-50 hidden lg:flex overflow-hidden transition-colors duration-300">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-cerulean/10 rounded-lg flex items-center justify-center border border-cerulean/20">
          <div className="w-4 h-4 bg-cerulean rounded-sm transform rotate-45" />
        </div>
        <span className="text-xl font-bold text-slate-900  tracking-tight transition-colors">Genting<span className="text-cerulean">Doc</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto relative z-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/doctor' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} className="block">
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group font-bold",
                  isActive 
                    ? "bg-cerulean text-white shadow-md shadow-cerulean/20" 
                    : "text-slate-500 hover:bg-slate-50  hover:text-cerulean"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? (isActive && pathname.startsWith('/doctor') ? "text-inherit" : "text-white") : "text-slate-400 group-hover:text-slate-900 ")} />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Logic (Bottom) */}
      <div className="p-6 mt-auto relative z-10">
        <div className="p-4 bg-cerulean/5  rounded-2xl flex items-center gap-3 mb-4 border border-cerulean/10 transition-colors">
           <div className="w-10 h-10 rounded-full bg-white  border-2 border-white  shadow-sm overflow-hidden relative flex items-center justify-center transition-colors">
             {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profile"
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
             ) : (
                <User className="w-5 h-5 text-cerulean" />
             )}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-slate-900  truncate transition-colors">
               {profile?.full_name || 'Dokter'}
             </p>
             <p className="text-xs text-cerulean truncate">Active</p>
           </div>
        </div>
        
        <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-500 hover:text-slate-900  hover:bg-transparent border-0 transition-colors px-4 py-3 h-auto"
            onClick={async () => {
              await signOut()
              window.location.href = '/login'
            }}
        >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-bold text-sm">Keluar</span>
        </Button>
      </div>
    </div>
  )
}
