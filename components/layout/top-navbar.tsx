'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Leaf, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Route, 
  Camera, 
  BookOpen, 
  Stethoscope,
  MessageCircle,
  ChevronDown,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DoctorApplicationModal } from '@/components/doctor-application-modal'

const dashboardNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Route, label: 'Roadmap', href: '/roadmap' },
  { icon: Camera, label: 'Vision', href: '/vision' },
  { icon: BookOpen, label: 'Education', href: '/education' },
  { icon: Stethoscope, label: 'Konsultasi', href: '/consult' },
]

const landingNavItems = [
  { icon: Leaf, label: 'Fitur', href: '/#features' },
  { icon: BookOpen, label: 'Tentang', href: '/#about' },
]

export function TopNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [showDocModal, setShowDocModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const userRole = user?.user_metadata?.role || 'user'
  
  // Deterministic check for dashboard area to prevent flickering
  const isDashboardArea = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/roadmap') || 
                          pathname.startsWith('/vision') || 
                          pathname.startsWith('/consult') ||
                          pathname.startsWith('/education') ||
                          pathname.startsWith('/profile') ||
                          pathname.startsWith('/doctor') ||
                          pathname.startsWith('/admin')

  const activeNavItems = (user || isDashboardArea) ? dashboardNavItems : landingNavItems
  const logoHref = (user || isDashboardArea) ? "/dashboard" : "/"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-floral/80 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={logoHref} className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cerulean to-sea-green flex items-center justify-center shadow-lg shadow-cerulean/20 transition-transform group-hover:scale-110">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter gradient-text">
              GENTING
            </span>
          </Link>

          {/* Navigation Items - Desktop */}
          <div className="hidden lg:flex items-center gap-1 mx-4">
            <div className="p-1.5 rounded-2xl flex items-center gap-1 bg-white/40 border border-white/50 shadow-sm">
              {activeNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                        : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                    }`}>
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <>
                {userRole === 'user' && (
                  <Button 
                    onClick={() => setShowDocModal(true)}
                    variant="outline"
                    className="hidden md:flex items-center gap-2 border-cerulean/20 bg-cerulean/5 text-cerulean hover:bg-cerulean hover:text-white rounded-xl font-bold transition-all border-2"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Jadi Dokter
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 border-2 border-white/50 shadow-sm overflow-hidden bg-white/50 hover:bg-white transition-all">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-cerulean/10 to-sea-green/10">
                          <User className="h-6 w-6 text-cerulean" />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-white/50 shadow-2xl backdrop-blur-xl bg-white/90">
                    <DropdownMenuLabel className="font-bold text-slate-900 px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-sm truncate">{user?.user_metadata?.full_name || 'Bunda GENTING'}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{userRole === 'doctor' ? 'Dokter Terverifikasi' : 'Ibu Hamil'}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100 mx-1" />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm text-slate-600 focus:bg-cerulean/5 focus:text-cerulean">
                      <User className="mr-2 h-4 w-4" />
                      Profil Saya
                    </DropdownMenuItem>
                    
                    {userRole === 'user' && (
                      <DropdownMenuItem 
                        onClick={() => setShowDocModal(true)} 
                        className="md:hidden rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm text-cerulean focus:bg-cerulean/5 focus:text-cerulean"
                      >
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Jadi Dokter
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => router.push('/settings')} className="rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm text-slate-600 focus:bg-cerulean/5 focus:text-cerulean">
                      <Settings className="mr-2 h-4 w-4" />
                      Pengaturan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100 mx-1" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar Akun
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (isMounted && !isLoading) ? (
              <Link href="/login">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-slate-900/10">
                  Masuk
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      
      {/* Mobile Doc Apply Button */}
      {userRole === 'user' && (
        <DoctorApplicationModal 
          isOpen={showDocModal} 
          onClose={() => setShowDocModal(false)} 
        />
      )}
    </nav>
  )
}
