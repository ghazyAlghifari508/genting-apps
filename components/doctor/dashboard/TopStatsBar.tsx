'use client'

import React from 'react'
import { Bell, Heart, DollarSign, Users, ChevronDown, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopStatsBarProps {
  isOnline: boolean
  todayEarnings: number
  activeCount: number
  avgRating: string
  unreadCount: number
  onStatusChange?: (status: string) => void
}

export default function TopStatsBar({
  isOnline,
  todayEarnings,
  activeCount,
  avgRating,
  unreadCount,
  onStatusChange
}: TopStatsBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section: Status & Quick Stats */}
        <div className="flex flex-wrap items-center gap-6 text-slate-600">
          {/* Status Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`relative flex items-center justify-center`}>
               <Circle className={`w-3 h-3 fill-current ${isOnline ? 'text-green-500 animate-pulse' : 'text-slate-300'}`} />
            </div>
            <span className="text-sm font-bold text-slate-900">{isOnline ? 'Online' : 'Offline'}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl hover:bg-white">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="rounded-2xl p-2 border-slate-200">
                <DropdownMenuItem onClick={() => onStatusChange?.('online')} className="rounded-xl cursor-pointer font-bold text-green-600">
                  Set Online
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.('offline')} className="rounded-xl cursor-pointer font-bold text-slate-600">
                  Set Offline
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.('busy')} className="rounded-xl cursor-pointer font-bold text-orange-600">
                  Set Busy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block" />

          {/* Stats Items */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center transition-transform group-hover:scale-110">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Earnings Today</p>
                <p className="text-sm font-bold text-slate-900">Rp {todayEarnings.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-cerulean/5 flex items-center justify-center transition-transform group-hover:scale-110">
                <Users className="w-5 h-5 text-cerulean" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">In Progress</p>
                <p className="text-sm font-bold text-slate-900">{activeCount} Pasien</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center transition-transform group-hover:scale-110">
                <Heart className="w-5 h-5 text-rose-500 fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Rating</p>
                <p className="text-sm font-bold text-slate-900">{avgRating} ⭐</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Notifications */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="relative w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
            <Bell className="w-6 h-6 text-slate-600 group-hover:text-cerulean transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-4 ring-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
