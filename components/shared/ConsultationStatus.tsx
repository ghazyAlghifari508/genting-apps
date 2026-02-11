'use client'

import type { ConsultationStatus as Status } from '@/types/consultation'

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  scheduled: { label: 'Dijadwalkan', className: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Berlangsung', className: 'bg-green-100 text-green-700 animate-pulse' },
  completed: { label: 'Selesai', className: 'bg-slate-100 text-slate-600' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-600' },
  no_show: { label: 'Tidak Hadir', className: 'bg-amber-100 text-amber-700' },
}

export function ConsultationStatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.scheduled
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${config.className}`}>
      {config.label}
    </span>
  )
}
