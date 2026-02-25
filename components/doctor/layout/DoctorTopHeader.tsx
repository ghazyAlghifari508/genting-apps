'use client'

import React from 'react'
import { Search, Bell, Calendar, Menu, LayoutDashboard, Stethoscope, CalendarDays, MessageSquare, History, LogOut, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor' },
  { icon: Stethoscope, label: 'Profil Dokter', href: '/doctor/profile' },
  { icon: CalendarDays, label: 'Jadwal Konsultasi', href: '/doctor/consultations' },
  { icon: MessageSquare, label: 'Pesan', href: '/doctor/messages' },
  { icon: History, label: 'Riwayat Transaksi', href: '/doctor/earnings' },
]

interface DoctorTopHeaderProps {
  title?: string
  showSearch?: boolean
}

export function DoctorTopHeader({ title, showSearch = true }: DoctorTopHeaderProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      {/* Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-3 w-full max-w-xl">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0 bg-white dark:bg-slate-800 shadow-sm rounded-full">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
            <SheetHeader className="p-8 pb-4 flex flex-row items-center gap-3 space-y-0">
              <div className="w-8 h-8 bg-doccure-teal/10 rounded-lg flex items-center justify-center border border-doccure-teal/20">
                <div className="w-4 h-4 bg-doccure-teal rounded-sm transform rotate-45" />
              </div>
              <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Genting<span className="text-doccure-teal">Doc</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/doctor' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href} className="block">
                    <div 
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group font-bold",
                        isActive 
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm" 
                          : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? (isActive && pathname.startsWith('/doctor') ? "text-inherit" : "text-white") : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </nav>

            {/* Profile & Logout (Bottom of Mobile Drawer) */}
            <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800 transition-colors">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3 mb-4 border border-slate-100 dark:border-slate-800 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border-2 border-doccure-teal/20 shadow-sm overflow-hidden relative flex items-center justify-center transition-colors">
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
                      <User className="w-5 h-5 text-doccure-teal" />
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                     {user?.user_metadata?.full_name || 'Dokter'}
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Tenaga Medis</p>
                 </div>
              </div>
              
              <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border-0 transition-colors px-4 py-3 h-auto"
                  onClick={async () => {
                    await signOut()
                    window.location.href = '/login'
                  }}
              >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-bold text-sm">Keluar Akun</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {showSearch ? (
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <Input 
               placeholder="Search" 
               className="pl-12 h-12 rounded-[2rem] border-none bg-white dark:bg-slate-800 shadow-sm text-slate-700 dark:text-white transition-colors"
             />
          </div>
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors truncate">{title}</h1>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
         <button className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
           <Bell className="w-5 h-5" />
         </button>
         <button className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
           <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center">
             <span className="text-xs">?</span>
           </div>
         </button>
         
         <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-sm text-slate-600 dark:text-slate-300 font-bold border border-transparent dark:border-white/10 transition-colors">
            <Calendar className="w-4 h-4" />
            October 23, 2025
         </div>
         
         <Button className="rounded-full bg-doccure-teal hover:bg-green-600 text-white px-6 h-12 font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all">
           Generate Report
         </Button>
      </div>
    </div>
  )
}
