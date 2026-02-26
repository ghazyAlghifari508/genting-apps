'use client'

import React from 'react'
import { DoctorSidebar } from '@/components/doctor/layout/DoctorSidebar'
import { DoctorMobileHeader } from '@/components/doctor/layout/DoctorMobileHeader'
import { useCheckDoctorApproval } from '@/hooks/useCheckDoctorApproval'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { Skeleton } from '@/components/ui/skeleton'

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading: protecting } = useProtectedRoute(['doctor'])
  const { checking } = useCheckDoctorApproval()

  if (protecting || checking) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 space-y-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-48 rounded-full opacity-50" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <DoctorSidebar />
      <DoctorMobileHeader />
      <div className="lg:ml-64 min-h-screen transition-all duration-300 pt-16 lg:pt-0">
        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
