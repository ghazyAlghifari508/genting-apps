'use client'

import React from 'react'
import { DoctorSidebar } from '@/components/doctor/layout/DoctorSidebar'
import { DoctorMobileHeader } from '@/components/doctor/layout/DoctorMobileHeader'
import { useCheckDoctorApproval } from '@/hooks/useCheckDoctorApproval'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protecting and checking are called to trigger side-effects (redirects).
  const { role, loading: authLoading, isProfileLoaded } = useProtectedRoute(['doctor'])
  const { checking: approvalChecking } = useCheckDoctorApproval()

  const isLoading = authLoading || approvalChecking || !isProfileLoaded
  const isAuthorized = role === 'doctor' || role === 'doctor-pending'

  // Strict UI Guard: Only render content if confirmed as Doctor and data is ready.
  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-doccure-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Menyiapkan Dashboard...</p>
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
