'use client'

import { Star } from 'lucide-react'

export function RatingStars({
  rating,
  size = 16,
  interactive = false,
  onRate,
}: {
  rating: number
  size?: number
  interactive?: boolean
  onRate?: (r: number) => void
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        >
          <Star
            size={size}
            className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
          />
        </button>
      ))}
    </div>
  )
}
