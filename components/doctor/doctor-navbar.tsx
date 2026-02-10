'use client'

import { Stethoscope, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DoctorNavbarProps {
  doctorName: string
  onLogout: () => void
}

export function DoctorNavbar({ doctorName, onLogout }: DoctorNavbarProps) {
  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender to-green flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">Dashboard Dokter</h1>
            <p className="text-xs text-foreground/60">Selamat datang, {doctorName}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
