'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  icon?: React.ReactNode
  className?: string
  align?: 'left' | 'center'
  children?: React.ReactNode
}

export function SectionHeader({ 
  title, 
  subtitle, 
  badge, 
  badgeColor = "bg-cerulean", 
  icon, 
  className,
  align = 'left',
  children
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "space-y-4", 
        align === 'center' ? "text-center" : "text-left",
        className
      )}
    >
      <div className={cn("flex items-center gap-3", align === 'center' ? "justify-center" : "justify-start")}>
        {badge && (
          <span className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white",
            badgeColor
          )}>
            {badge}
          </span>
        )}
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      
      {children}
      
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
