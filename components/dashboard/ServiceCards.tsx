import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { serviceCards } from '@/constants/dashboard-data'

export function ServiceCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {serviceCards.map((item) => (
        <Link key={item.title} href={item.href} className="group transition-all duration-500">
          <div className="h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] p-6 shadow-sm hover:shadow-[0_22px_48px_-12px_rgba(15,23,42,0.12)] hover:border-doccure-teal/50 transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden flex flex-col transition-colors">
            {/* Abstract Mini Shape */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-bl-[48px] -mr-4 -mt-4 transition-all duration-500 group-hover:bg-doccure-teal/10 group-hover:scale-110" />
            
            <div className="relative z-10 flex-1">
              <div className={`${item.color} w-13 h-13 rounded-[18px] flex items-center justify-center text-white mb-5 shadow-lg shadow-${item.color.split('-')[1]}-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-[19px] font-black text-slate-900 dark:text-white group-hover:text-doccure-teal transition-colors tracking-tight">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-2.5 opacity-80 group-hover:opacity-100 transition-opacity transition-colors">{item.desc}</p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between text-doccure-teal font-black text-[11px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span>Explore</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
