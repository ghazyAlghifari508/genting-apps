'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import { 
  History as HistoryIcon, 
  LogOut, 
  LayoutDashboard, 
  Route, 
  Camera, 
  BookOpen, 
  Stethoscope,
  User,
  Menu,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { DoctorRegistrationButton } from '@/components/layout/DoctorRegistrationButton'
import { useUserRole } from '@/hooks/useUserRole'
import { supabase } from '@/lib/supabase'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const dashboardNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Route, label: 'Roadmap', href: '/roadmap' },
  { icon: Camera, label: 'Vision', href: '/vision' },
  { icon: BookOpen, label: 'Education', href: '/education' },
  { icon: Stethoscope, label: 'Konsultasi', href: '/konsultasi-dokter', },
]

const landingNavItems: { label: string; href: string }[] = [
  { label: 'Beranda', href: '/#home' },
  { label: 'Layanan', href: '/#services' },
  { label: 'Statistik', href: '/#stats' },
  { label: 'Tentang', href: '/#about' },
  { label: 'Tim', href: '/#team' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Blog', href: '/#blog' },
]

export function TopNavbar() {
  const pathname = usePathname()

  const { user } = useAuth()
  const { role } = useUserRole()
  const [scrolled, setScrolled] = useState(false)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // Deterministic check for dashboard area to prevent flickering
  const dashboardPaths = [
    '/dashboard', '/roadmap', '/vision', '/konsultasi-dokter',
    '/education', '/profile', '/admin', '/booking', '/payment',
    '/doctors', '/riwayat-transaksi'
  ]
  const isDashboardArea = dashboardPaths.some(path => pathname.startsWith(path))

  const activeNavItems = (user || isDashboardArea) ? dashboardNavItems : landingNavItems
  const logoHref = (user || isDashboardArea) ? "/dashboard" : "/"

  const isLanding = !user && !isDashboardArea

  if (!mounted) return null

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isLanding ? 'bg-doccure-dark' : (isDashboardArea || scrolled ? 'bg-doccure-dark shadow-md' : 'bg-transparent')} transition-colors duration-200`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`h-20 flex items-center justify-between ${isDashboardArea ? 'lg:grid lg:grid-cols-[auto_1fr_auto]' : ''} items-center`}>
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href={logoHref} className="flex items-center gap-2 group shrink-0">
              <div className="flex items-center justify-center transition-transform group-hover:scale-105 h-16 overflow-visible">
                <Image src="/images/unsplash/logo-genting.png" alt="Genting Logo" width={120} height={120} className="w-[90px] h-[90px] scale-[1.4] object-contain drop-shadow-md" />
              </div>
            </Link>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden lg:flex items-center justify-center gap-8">
            {activeNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className="group relative">
                  <div className={`relative text-[15px] font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                  }`}>
                    <span>{item.label}</span>
                    <span
                      className={`absolute left-0 -bottom-2 h-[2px] w-full bg-white transform origin-left transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* User Actions - Desktop & Mobile */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0 lg:ml-0">
            {/* User Account / Auth - Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {!user && !isDashboardArea ? (
                <div className="hidden lg:flex items-center gap-4">
                  <Link href="/login">
                    <Button className="bg-doccure-yellow hover:bg-doccure-yellow/90 text-doccure-dark font-bold rounded-full px-6">
                      Login
                    </Button>
                  </Link>
                </div>
              ) : user && (
                <div className="flex items-center gap-6">
                  {role === 'user' && !pathname.includes('/doctor') && (
                    <div className="hidden md:block">
                      <DoctorRegistrationButton isLoggedIn={!!user} userRole={role} />
                    </div>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center hover:opacity-80 transition-all outline-none">
                        <Avatar className="h-10 w-10 border-2 border-white/20 shadow-sm ring-offset-2 ring-offset-doccure-dark active:scale-95 transition-transform">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-slate-100 text-slate-400">
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 mt-4 rounded-3xl p-3 bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.2)]" align="end">
                      <DropdownMenuLabel className="font-bold px-4 pt-3 pb-2 text-slate-400 text-[11px] uppercase tracking-[0.2em]">Akun Saya</DropdownMenuLabel>
                      <DropdownMenuSeparator className="mx-2 my-2 bg-slate-100/80" />
                      
                      <div className="space-y-1">
                        <Link href={role === 'doctor' ? '/doctor/profile' : '/profile'}>
                          <DropdownMenuItem className="rounded-2xl px-4 py-3.5 cursor-pointer font-bold focus:bg-slate-50 text-[#1e293b] transition-colors">
                            <User className="mr-3 h-5 w-5 text-doccure-teal" />
                            <span className="text-[15px]">Profil</span>
                          </DropdownMenuItem>
                        </Link>
                        
                        <Link href="/riwayat-transaksi">
                          <DropdownMenuItem className="rounded-2xl px-4 py-3.5 cursor-pointer font-bold focus:bg-slate-50 text-[#1e293b] transition-colors">
                            <HistoryIcon className="mr-3 h-5 w-5 text-doccure-teal" />
                            <span className="text-[15px]">Riwayat Transaksi</span>
                          </DropdownMenuItem>
                        </Link>
                      </div>

                      <DropdownMenuSeparator className="mx-2 my-2 bg-slate-100/80" />
                      
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="rounded-2xl px-4 py-3.5 cursor-pointer font-bold text-red-500 focus:text-red-600 focus:bg-red-50 transition-colors mt-1"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        <span className="text-[15px]">Keluar Akun</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            {mounted && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-doccure-dark border-white/10 p-0 overflow-hidden">
                  <SheetHeader className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-left">
                        <div className="flex items-center overflow-visible">
                          <Image src="/images/unsplash/logo-genting.png" alt="Genting Logo" width={100} height={100} className="w-[80px] h-[80px] scale-[1.3] object-contain drop-shadow-md" />
                        </div>
                      </SheetTitle>
                    </div>
                  </SheetHeader>
                  <div className="flex flex-col py-4">
                    {activeNavItems.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = ('icon' in item ? item.icon : null) as React.ElementType
                      return (
                        <Link 
                          key={item.href} 
                          href={item.href}
                          className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                            isActive ? 'bg-white/10 text-doccure-yellow' : 'text-white/80 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                          <span className="font-bold text-base">{item.label}</span>
                        </Link>
                      )
                    })}
                    
                    {role === 'user' && !isDashboardArea && (
                      <div className="mt-4 px-6">
                        <DoctorRegistrationButton isLoggedIn={!!user} userRole={role} />
                      </div>
                    )}

                    {!user && !isDashboardArea && (
                      <div className="mt-8 px-6 flex flex-col gap-3">
                        <Link href="/login" className="w-full">
                          <Button className="w-full bg-doccure-yellow hover:bg-doccure-yellow/90 text-doccure-dark font-bold rounded-xl h-12">
                            Login
                          </Button>
                        </Link>
                      </div>
                    )}

                    {user && (
                      <div className="mt-auto p-6 border-t border-white/10">
                        <Link href={role === 'doctor' ? '/doctor/profile' : '/profile'} className="flex items-center gap-4 mb-6 hover:opacity-80 transition-opacity">
                          <Avatar className="h-12 w-12 border-2 border-doccure-teal">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-doccure-teal text-white">
                              {user.email?.[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-white truncate max-w-[150px]">
                              {user.user_metadata?.full_name || 'User'}
                            </span>
                            <span className="text-xs text-white/50 truncate max-w-[150px]">
                              {user.email}
                            </span>
                          </div>
                        </Link>
                        
                        <Link href="/riwayat-transaksi" className="flex items-center gap-3 mb-6 px-1 text-white/80 hover:text-white transition-colors">
                          <HistoryIcon className="w-5 h-5 text-doccure-teal" />
                          <span className="font-bold">Riwayat Transaksi</span>
                        </Link>

                        <Button 
                          onClick={handleLogout}
                          variant="outline" 
                          className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold rounded-xl h-12 justify-start px-4"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Keluar Akun
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
