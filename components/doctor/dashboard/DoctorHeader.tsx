'use client'

import React from 'react'
import { Bell, LogOut, User, History as HistoryIcon, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

interface DoctorHeaderProps {
  doctorName?: string
  unreadNotifications?: number
  todayEarnings?: number
  activeConsultations?: number
}

export const DoctorHeader = React.memo(function DoctorHeader({
  doctorName = "Dr. Unknown",
  unreadNotifications = 0,
  activeConsultations = 0
}: DoctorHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      
      toast({ title: "Berhasil logout", description: "Anda telah keluar dari sistem" })
      window.location.href = '/login'
    } catch {
      toast({ 
        title: "Error", 
        description: "Gagal logout. Silakan coba lagi.",
        variant: "destructive" 
      })
    }
  }

  return (
    <div className="bg-white/80  backdrop-blur-xl border-b border-white/50  rounded-[2rem] p-6 mb-8 shadow-lg shadow-slate-200/50  transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Section - Welcome & Search */}
        <div className="flex-1 w-full lg:w-auto text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 mb-2">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900  tracking-tight transition-colors">
              Selamat Pagi, <span className="text-cerulean">{doctorName}</span>
            </h1>
            <Badge variant="secondary" className="bg-cerulean/10 text-cerulean border-cerulean/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1">
              • Online
            </Badge>
          </div>
          <p className="text-slate-500  mb-6 font-medium text-lg transition-colors">
            Siap melayani pasien hari ini? Anda memiliki <span className="text-medical-orange font-bold font-mono">{activeConsultations}</span> konsultasi aktif.
          </p>
          
          <div className="relative max-w-lg mx-auto lg:mx-0 w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-cerulean transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Cari pasien (No. RM/Nama), jadwal, atau resep..."
               className="pl-12 pr-4 h-14 rounded-2xl border-slate-200  bg-slate-50/50  focus:bg-white  focus:ring-4 focus:ring-cerulean/10 focus:border-cerulean transition-all text-slate-900 "
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <div className="bg-slate-200/50  rounded-lg px-2 py-1 text-xs font-bold text-slate-500  border border-slate-300/50  hidden sm:block">
                ⌘K
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Stats & Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-2xl hover:bg-slate-100  hover:text-cerulean transition-colors text-slate-600 ">
            <Bell className="w-6 h-6" />
            {unreadNotifications > 0 && (
              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-medical-red ring-2 ring-white  animate-pulse" />
            )}
          </Button>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 pr-4 rounded-2xl hover:bg-slate-100  transition-all border border-transparent hover:border-slate-200 ">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cerulean to-cerulean/90 flex items-center justify-center shadow-md text-white">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-bold text-slate-900  leading-none mb-1 transition-colors">
                    {doctorName}
                  </p>
                  <p className="text-xs text-slate-500  font-medium transition-colors">
                    Dokter Spesialis
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-slate-200  p-2 shadow-xl bg-white  transition-colors">
              <div className="px-2 py-3 bg-slate-50  rounded-xl mb-2 transition-colors">
                <p className="text-xs font-bold text-slate-500  uppercase tracking-wider mb-1">Status Akun</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cerulean"></div>
                  <span className="text-sm font-bold text-slate-800  transition-colors">Verified Doctor</span>
                </div>
              </div>
              <DropdownMenuItem className="rounded-xl h-10 font-medium focus:bg-slate-100  cursor-pointer text-slate-700  transition-colors">
                <User className="w-4 h-4 mr-3 text-slate-400" />
                Profil Saya
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/riwayat-transaksi')} className="rounded-xl h-10 font-medium focus:bg-slate-100  cursor-pointer text-slate-700  transition-colors">
                <HistoryIcon className="w-4 h-4 mr-3 text-slate-400" />
                Riwayat Transaksi
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-slate-100 " />
              <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-10 font-medium text-red-600 focus:text-red-700 focus:bg-red-50  cursor-pointer transition-colors">
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
})
