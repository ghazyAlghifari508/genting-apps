import { ReactNode } from 'react'
import { TopNavbar } from '@/components/layout/top-navbar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { AiChatFloating } from '@/components/ai-chat-floating'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-floral">
      <TopNavbar />
      <div className="flex flex-col min-h-screen relative pt-20">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pb-8 pb-32">
          {children}
        </main>
        <MobileNav />
        <AiChatFloating />
        
        {/* Modern Background Accents */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cerulean/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-grapefruit/5 rounded-full blur-[150px] animate-pulse" />
        </div>
      </div>
    </div>
  )
}
