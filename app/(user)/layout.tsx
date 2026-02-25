'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { TopNavbar } from '@/components/layout/top-navbar'
import { AiChatFloating } from '@/components/ai-chat-floating'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { loading } = useProtectedRoute(['user'])
  const pathname = usePathname()
  const isReplicaDashboard =
    pathname === '/dashboard' ||
    pathname === '/roadmap' ||
    pathname === '/vision' ||
    pathname === '/profile' ||
    pathname.startsWith('/education') ||
    pathname.startsWith('/konsultasi-dokter') ||
    pathname.startsWith('/booking') ||
    pathname.startsWith('/doctors') ||
    pathname === '/riwayat-transaksi'

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col transition-colors">
        <div className="h-20 w-full border-b border-slate-100 dark:border-slate-800 animate-pulse bg-white/80 dark:bg-slate-900/80" />
        <div className="flex-1 animate-pulse opacity-30 bg-slate-50 dark:bg-slate-800" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <TopNavbar />
      <div className="flex flex-col min-h-screen relative pt-20">
        <main className={isReplicaDashboard
          ? 'flex-1 w-full px-0 py-0'
          : 'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}
        >
          {children}
        </main>
        <AiChatFloating />
        
        {/* Modern Background Accents */}
        {!isReplicaDashboard && (
          <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cerulean/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-doccure-teal/5 rounded-full blur-[150px] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}
