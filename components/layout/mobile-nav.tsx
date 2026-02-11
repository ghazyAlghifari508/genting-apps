'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Route,
  Camera,
  Leaf,
  Stethoscope,
  BookOpen
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: Route, label: 'Roadmap', href: '/roadmap' },
  { icon: Camera, label: 'Vision', href: '/vision', primary: true },
  { icon: BookOpen, label: 'Edukasi', href: '/education' },
  { icon: Stethoscope, label: 'Dokter', href: '/konsultasi-dokter' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-md mx-auto h-20 bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl shadow-cerulean/10 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          if (item.primary) {
            return (
              <Link key={item.href} href={item.href} className="relative -mt-10 group">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cerulean to-sea-green flex items-center justify-center shadow-lg shadow-cerulean/20 group-active:scale-95 transition-transform">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
              </Link>
            )
          }

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-cerulean' : 'text-slate-400'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-cerulean' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-cerulean mt-0.5" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
