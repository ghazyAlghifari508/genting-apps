'use client'

import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Neutral Shell: Always render the structure.
  // The hook is called to trigger side-effects (redirects).
  useProtectedRoute(['admin'])

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
