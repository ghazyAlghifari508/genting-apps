'use client'

import React from 'react'
import { Search, Bell, Calendar, Menu, LayoutDashboard, Stethoscope, BookOpen, Route, ShieldAlert, User, LogOut } from 'lucide-react'
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

interface AdminTopHeaderProps {
  title?: string
  showSearch?: boolean
}

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Stethoscope, label: 'Doctor Approvals', href: '/admin/doctor-approvals' },
  { icon: BookOpen, label: 'Manage Edukasi', href: '/admin/education' },
  { icon: Route, label: 'Manage Roadmap', href: '/admin/roadmap' },
]

export function AdminTopHeader({ title, showSearch = true }: AdminTopHeaderProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      {/* Mobile Menu & Search/Title Bar */}
      <div className="flex items-center gap-3 w-full max-w-xl">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0 bg-white dark:bg-slate-800 shadow-sm rounded-full">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-doccure-dark border-none">
            <SheetHeader className="p-8 pb-4 flex flex-row items-center gap-3 space-y-0">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shadow-sm border border-white/20">
                <ShieldAlert className="w-4 h-4 text-doccure-yellow" />
              </div>
              <SheetTitle className="text-xl font-bold text-white tracking-tight">
                Genting<span className="text-doccure-yellow">Admin</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {adminMenuItems.map((item) => {
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

            {/* Profile & Logout (Bottom of Mobile Drawer) */}
            <div className="p-6 mt-auto border-t border-white/10">
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
                      <User className="w-5 h-5 text-doccure-teal" />
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
          </SheetContent>
        </Sheet>

        {showSearch ? (
          <div className="h-12 relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
             <Input 
               placeholder="Search data..." 
               className="pl-12 h-12 rounded-[2rem] border-none bg-white dark:bg-slate-800 shadow-sm text-slate-700 dark:text-white transition-all transition-colors"
             />
          </div>
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors">{title}</h1>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
         <button className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm relative transition-colors">
           <Bell className="w-5 h-5" />
         </button>
         
         <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-sm text-slate-600 dark:text-slate-300 font-bold transition-colors">
            <Calendar className="w-4 h-4 text-doccure-teal" />
            {currentDate}
         </div>
         
         <Button className="rounded-full bg-doccure-teal hover:bg-[#0f605c] text-white px-6 h-12 font-bold shadow-lg shadow-doccure-teal/30 transition-colors">
           Export
         </Button>
      </div>
    </div>
  )
}
