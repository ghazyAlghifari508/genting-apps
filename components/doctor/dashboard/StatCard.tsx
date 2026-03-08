'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  subLabel?: string
  footer?: React.ReactNode
  chart?: React.ReactNode
  className?: string
}

export function StatCard({ title, value, icon: Icon, subLabel, footer, chart, className }: StatCardProps) {
  return (
    <Card className={cn("p-6 rounded-[2rem] border-none shadow-sm bg-white  hover:shadow-md transition-all duration-300", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500  mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900  tracking-tight">{value}</h3>
        </div>
        <div className="p-2.5 rounded-full bg-slate-50  text-slate-600 ">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {subLabel && (
        <p className="text-xs text-slate-400  mb-4">{subLabel}</p>
      )}

      {chart && (
        <div className="h-12 w-full mb-2">
          {chart}
        </div>
      )}

      {footer && (
        <div className="pt-4 mt-2 border-t border-slate-50 ">
          {footer}
        </div>
      )}
    </Card>
  )
}

interface StatProgressProps {
  label: string
  value: number
  total: number
  color: string
}

export function StatProgress({ label, value, total, color }: StatProgressProps) {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-400  font-medium">{label}</span>
        <span className="text-slate-600  font-bold">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100  rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full", color)} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
