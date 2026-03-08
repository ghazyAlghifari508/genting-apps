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
      className: 'bg-emerald-50  text-emerald-700  border-emerald-200 ',
    }
  }

  return {
    label: 'Perlu perhatian',
    className: 'bg-amber-50  text-amber-700  border-amber-200 ',
  }
}

export function NutritionCard({ hasWeight }: NutritionCardProps) {
  const nutritionStatus = getNutritionStatus(hasWeight)
  return (
    <div className="bg-emerald-50  rounded-2xl p-6 border border-emerald-100  shadow-inner relative overflow-hidden transition-colors">
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-200/40  rounded-full blur-2xl transition-colors" />
      
      <h3 className="text-lg font-bold text-emerald-900  mb-4 flex items-center gap-2 relative z-10 transition-colors">
        <ShieldCheck className="w-5 h-5 text-emerald-600 " />
        Ringkasan Nutrisi
      </h3>
      <div className="p-4 bg-white/70  backdrop-blur-md rounded-2xl border border-emerald-200/50  mb-4 relative z-10 transition-colors">
        <div className="flex justify-between items-center mb-1 transition-colors">
          <span className="text-xs font-bold text-emerald-800/60  uppercase tracking-wider transition-colors">Status Mingguan</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${nutritionStatus.className} transition-colors`}>{nutritionStatus.label}</span>
        </div>
        <p className="text-sm font-semibold text-emerald-900  leading-snug transition-colors">
          {hasWeight ? "Data berat badan terupdate. Tetap jaga asupan gizi seimbang." : "Lengkapi data berat badan untuk analisis nutrisi akurat."}
        </p>
      </div>
      <Link href="/profile">
        <Button variant="link" className="text-emerald-700  font-bold text-sm p-0 h-auto hover:text-emerald-900  relative z-10 transition-colors">
          Lengkapi Data <ArrowRight className="ml-1 w-3 h-3" />
        </Button>
      </Link>
    </div>
  )
}
