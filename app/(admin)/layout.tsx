'use client'

import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { loading } = useProtectedRoute(['admin'])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-slate-950 flex relative overflow-hidden transition-colors font-sans">
        {/* Skeleton Sidebar */}
        <div className="w-64 h-screen bg-white dark:bg-slate-900 fixed left-0 top-0 border-r border-slate-100 dark:border-slate-800 flex flex-col z-50 p-6 hidden lg:flex transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-2xl" />)}
          </div>
        </div>
        
        {/* Skeleton Main Content Area */}
        <div className="flex-1 w-full lg:ml-64 p-8">
           <Skeleton className="h-8 w-64 mb-8" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />)}
           </div>
           <div className="space-y-4">
             {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-[2rem]" />)}
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-slate-950 transition-colors">
      <AdminSidebar />
      <div className="lg:ml-64 min-h-screen transition-all duration-300">
        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
