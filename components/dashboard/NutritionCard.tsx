import Link from 'next/link'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NutritionCardProps {
  hasWeight: boolean
}

function getNutritionStatus(hasWeight: boolean) {
  if (hasWeight) {
    return {
      label: 'Terpantau',
      className: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    }
  }

  return {
    label: 'Perlu perhatian',
    className: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  }
}

export function NutritionCard({ hasWeight }: NutritionCardProps) {
  const nutritionStatus = getNutritionStatus(hasWeight)
  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-[32px] p-6 border border-emerald-100 dark:border-emerald-800 shadow-inner relative overflow-hidden transition-colors">
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-200/40 dark:bg-emerald-700/20 rounded-full blur-2xl transition-colors" />
      
      <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300 mb-4 flex items-center gap-2 relative z-10 transition-colors">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        Ringkasan Nutrisi
      </h3>
      <div className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 mb-4 relative z-10 transition-colors">
        <div className="flex justify-between items-center mb-1 transition-colors">
          <span className="text-xs font-bold text-emerald-800/60 dark:text-emerald-400/60 uppercase tracking-wider transition-colors">Status Mingguan</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${nutritionStatus.className} transition-colors`}>{nutritionStatus.label}</span>
        </div>
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 leading-snug transition-colors">
          {hasWeight ? "Data berat badan terupdate. Tetap jaga asupan gizi seimbang." : "Lengkapi data berat badan untuk analisis nutrisi akurat."}
        </p>
      </div>
      <Link href="/profile">
        <Button variant="link" className="text-emerald-700 dark:text-emerald-400 font-bold text-sm p-0 h-auto hover:text-emerald-900 dark:hover:text-emerald-200 relative z-10 transition-colors">
          Lengkapi Data <ArrowRight className="ml-1 w-3 h-3" />
        </Button>
      </Link>
    </div>
  )
}
