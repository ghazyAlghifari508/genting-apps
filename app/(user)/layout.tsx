'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { TopNavbar } from '@/components/layout/top-navbar'
import dynamic from 'next/dynamic'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'

const AiChatFloating = dynamic(
  () => import('@/components/ai-chat-floating').then(mod => mod.AiChatFloating),
  { ssr: false }
)

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { role, loading, isProfileLoaded } = useProtectedRoute(['user', 'authenticated'])

  // Strict UI Guard: Only render content if confirmed as User or Authenticated (new user).
  if (loading || !isProfileLoaded || (role !== 'user' && role !== 'authenticated')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-doccure-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Memuat Dashboard...</p>
        </div>
      </div>
    )
  }
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

  // Neutral Shell: Always render the TopNavbar and shell structure.
  // Page-specific skeletons will be handled by the route components themselves.

  return (
    <div className="min-h-screen bg-white  transition-colors">
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
