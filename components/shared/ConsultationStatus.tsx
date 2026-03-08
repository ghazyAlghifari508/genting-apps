'use client'

import type { ConsultationStatus as Status } from '@/types/consultation'

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  scheduled: { label: 'Dijadwalkan', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  ongoing: { label: 'Berlangsung', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  completed: { label: 'Selesai', className: 'bg-slate-100 text-slate-700 border border-slate-200' },
  cancelled: { label: 'Dibatalkan', className: 'bg-rose-50 text-rose-700 border border-rose-200' },
  no_show: { label: 'Tidak Hadir', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
}

export function ConsultationStatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.scheduled
  return (
    <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-[11px] font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}



