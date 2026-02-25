'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Stethoscope, 
  BookOpen, 
  Route, 
  LogOut,
  User,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Stethoscope, label: 'Doctor Approvals', href: '/admin/doctor-approvals' },
  { icon: BookOpen, label: 'Manage Edukasi', href: '/admin/education' },
  { icon: Route, label: 'Manage Roadmap', href: '/admin/roadmap' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <div className="w-64 h-screen bg-doccure-dark fixed left-0 top-0 border-r border-doccure-dark/20 flex flex-col z-50 hidden lg:flex overflow-hidden">
      
      {/* Abstract Background Circles */}
      <div className="absolute top-[-10%] left-[-30%] w-[300px] h-[300px] rounded-full bg-doccure-teal/40 pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-doccure-teal/20 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[250px] h-[250px] rounded-full bg-doccure-teal/30 pointer-events-none" />

      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3 relative z-10">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shadow-sm border border-white/20">
          <ShieldAlert className="w-4 h-4 text-doccure-yellow" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Genting<span className="text-doccure-yellow">Admin</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto relative z-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} className="block">
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group font-bold",
                  isActive 
                    ? "bg-white/10 text-doccure-yellow border border-white/10" 
                    : "text-white/80 hover:bg-white/5 hover:text-doccure-yellow"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-doccure-yellow" : "text-white/70 group-hover:text-doccure-yellow")} />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Logic (Bottom) */}
      <div className="p-6 mt-auto relative z-10">
        <div className="p-4 bg-black/10 rounded-2xl flex items-center gap-3 mb-4 backdrop-blur-sm border border-white/5">
           <div className="w-10 h-10 rounded-full bg-white border-2 border-white/50 shadow-sm overflow-hidden relative flex items-center justify-center">
             {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
             ) : (
                <User className="w-5 h-5 text-sea-green" />
             )}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-white truncate">
               {user?.user_metadata?.full_name || 'Admin'}
             </p>
             <p className="text-xs text-white/70 truncate">Active System</p>
           </div>
        </div>
        
        <Button 
            variant="ghost" 
            className="w-full justify-start text-white/80 hover:text-white hover:bg-transparent border-0 transition-colors px-4 py-3 h-auto"
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
