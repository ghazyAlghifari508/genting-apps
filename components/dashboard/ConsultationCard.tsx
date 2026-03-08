import Link from 'next/link'
import { Stethoscope, Activity, Calendar, Clock3, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConsultationCardProps {
  nextSchedule?: string | null
  isHealthMonitored?: boolean
}

export function ConsultationCard({ nextSchedule, isHealthMonitored }: ConsultationCardProps) {
  const formattedSchedule = nextSchedule 
    ? new Date(nextSchedule).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : '-'

  return (
    <div className="bg-white  border border-slate-200  rounded-2xl p-6 shadow-sm overflow-hidden relative group transition-colors">
      <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] [0.06] group-hover:opacity-[0.06] transition-opacity duration-700 transition-colors">
        <Stethoscope className="w-48 h-48  transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-slate-900  mb-4 flex items-center justify-between transition-colors">
        <span>Konsultasi Dokter</span>
        <Activity size={16} className="text-doccure-teal animate-pulse" />
      </h3>
      
      <div className="space-y-3 mb-6 relative z-10 transition-colors">
        <div className={`flex items-center gap-3 text-sm font-medium p-2 rounded-xl border transition-colors ${
          isHealthMonitored 
            ? 'text-emerald-700 bg-emerald-50 border-emerald-100 italic' 
            : 'text-slate-600 bg-slate-50 border-slate-100'
        }`}>
          <Calendar className={`w-4 h-4 ${isHealthMonitored ? 'text-emerald-500' : 'text-doccure-teal'}`} />
          <span>{isHealthMonitored ? 'Suhu tubuh & berat terpantau' : 'Data kesehatan belum lengkap'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600  font-medium p-2 transition-colors">
          <Clock3 className="w-4 h-4 text-doccure-teal" />
          <span>Jadwal kontrol berikutnya: {formattedSchedule}</span>
        </div>
      </div>

      <Link href="/konsultasi-dokter" className="block relative z-10">
        <Button className="w-full bg-doccure-dark  hover:bg-black  text-white rounded-xl h-11 font-bold shadow-md group transition-all transition-colors">
          Cari Dokter Spesialis <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  )
}
