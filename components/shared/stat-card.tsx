'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  iconBg?: string
  iconColor?: string
  className?: string
  variant?: 'light' | 'dark'
}

export function StatCard({ 
  label, 
  value, 
  icon, 
  iconBg = "bg-cerulean/10", 
  iconColor = "text-cerulean",
  className,
  variant = 'light'
}: StatCardProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-2xl border transition-all",
      variant === 'light' 
        ? "bg-white/50 backdrop-blur-sm border-slate-100" 
        : "bg-white/5 border-white/10 text-white",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-110",
          iconBg
        )}>
          <div className={cn("w-5 h-5", iconColor)}>
            {icon}
          </div>
        </div>
        <span className={variant === 'light' ? "font-bold text-sm text-slate-600" : "font-bold text-sm"}>
          {label}
        </span>
      </div>
      <span className={cn(
        "font-black",
        variant === 'light' ? iconColor : "text-white"
      )}>
        {value}
      </span>
    </div>
  )
}
