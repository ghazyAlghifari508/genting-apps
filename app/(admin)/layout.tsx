'use client'

import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Protecting and checking are called to trigger side-effects (redirects).
  const { role, loading, isProfileLoaded } = useProtectedRoute(['admin', 'super-admin'])

  // Strict UI Guard: Only render content if confirmed as Admin or Super-Admin.
  // We wait until isProfileLoaded is true to be 100% sure of the role.
  if (loading || !isProfileLoaded || (role !== 'admin' && role !== 'super-admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-doccure-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Memuat Dashboard Admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]  transition-colors">
      <AdminSidebar />
      <div className="lg:ml-64 min-h-screen transition-all duration-300">
        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
