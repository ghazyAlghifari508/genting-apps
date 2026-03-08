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
  // Neutral Shell: Always render the structure.
  // Protecting and checking are still called to trigger side-effects (redirects).
  useProtectedRoute(['doctor'])
  useCheckDoctorApproval()

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
