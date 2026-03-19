'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface DoctorTopHeaderProps {
  title?: string
  isLoading?: boolean
}

export function DoctorTopHeader({ title, isLoading = false }: DoctorTopHeaderProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 transition-colors truncate">
        {title || 'Dashboard'}
      </h1>
    </div>
  )
}
