'use client'

import React from 'react'
import { Menu, LogOut, LayoutDashboard, Stethoscope, CalendarDays, MessageSquare, History, User, Bell } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
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

export function DoctorMobileHeader() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white  border-b border-slate-100  z-50 h-16 px-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 bg-slate-50  shadow-sm rounded-full w-10 h-10">
              <Menu className="w-5 h-5 text-slate-600 " />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-white  border-r border-slate-100 flex flex-col">
            <SheetHeader className="p-8 pb-4 flex flex-row items-center gap-3 space-y-0 shrink-0">
              <div className="w-8 h-8 bg-cerulean/10 rounded-lg flex items-center justify-center border border-cerulean/20">
                <div className="w-4 h-4 bg-cerulean rounded-sm transform rotate-45" />
              </div>
              <SheetTitle className="text-xl font-bold text-slate-900  tracking-tight">
                Genting<span className="text-cerulean">Doc</span>
              </SheetTitle>
            </SheetHeader>
            
            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
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
                      <item.icon className={cn("w-5 h-5", isActive ? "text-inherit" : "text-slate-400 group-hover:text-cerulean")} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </nav>

            <div className="p-6 mt-auto border-t border-slate-100 shrink-0">
              <div className="p-4 bg-cerulean/5 rounded-2xl flex items-center gap-3 mb-4 border border-cerulean/10">
                 <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden relative flex items-center justify-center">
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
                       <User className="w-5 h-5 text-cerulean" />
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-slate-900  truncate">
                     {user?.user_metadata?.full_name || 'Dokter'}
                   </p>
                   <p className="text-[10px] text-cerulean font-bold uppercase tracking-wider">Active</p>
                 </div>
              </div>
              
              <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-500 hover:text-slate-900 hover:bg-transparent transition-colors px-4 h-12"
                  onClick={async () => {
                    await signOut()
                    window.location.href = '/login'
                  }}
              >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-bold text-sm">Keluar</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
         <span className="text-lg font-bold text-slate-900  tracking-tight">Genting<span className="text-cerulean">Doc</span></span>
      </div>

      <div className="flex items-center gap-2">
         <button className="p-2 bg-slate-50  rounded-full text-slate-500 ">
           <Bell className="w-5 h-5" />
         </button>
          <div className="w-8 h-8 rounded-full bg-cerulean/10 flex items-center justify-center overflow-hidden border border-cerulean/20">
            {user?.user_metadata?.avatar_url ? (
               <Image src={user.user_metadata.avatar_url} alt="Profile" width={32} height={32} unoptimized />
            ) : (
                 <User className="w-4 h-4 text-cerulean" />
            )}
         </div>
      </div>
    </div>
  )
}
