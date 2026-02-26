import Link from 'next/link'
import { Stethoscope, Activity, Calendar, Clock3, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ConsultationCard() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 shadow-sm overflow-hidden relative group transition-colors">
      <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] dark:opacity-[0.06] group-hover:opacity-[0.06] transition-opacity duration-700 transition-colors">
        <Stethoscope className="w-48 h-48 dark:text-white transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between transition-colors">
        <span>Konsultasi Dokter</span>
        <Activity size={16} className="text-doccure-teal animate-pulse" />
      </h3>
      
      <div className="space-y-3 mb-6 relative z-10 transition-colors">
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600 italic transition-colors">
          <Calendar className="w-4 h-4 text-doccure-teal" />
          <span>Suhu tubuh & berat terpantau</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium p-2 transition-colors">
          <Clock3 className="w-4 h-4 text-doccure-teal" />
          <span>Jadwal kontrol berikutnya: -</span>
        </div>
      </div>

      <Link href="/konsultasi-dokter" className="block relative z-10">
        <Button className="w-full bg-doccure-dark dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white rounded-xl h-11 font-bold shadow-md group transition-all transition-colors">
          Cari Dokter Spesialis <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  )
}
