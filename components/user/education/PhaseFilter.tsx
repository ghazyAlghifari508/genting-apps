'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phase, PHASES } from '@/types/education'
import { cn } from '@/lib/utils'
import { Baby, Heart, Utensils, User, Filter, Star, Check } from 'lucide-react'

interface PhaseFilterProps {
  selectedPhase: Phase | 'all'
  onPhaseChange: (phase: Phase | 'all') => void
  showFavorites?: boolean
  onFavoritesChange?: (show: boolean) => void
  showRead?: boolean
  onReadChange?: (show: boolean) => void
}

const phaseIcons: Record<Phase, React.ReactNode> = {
  kehamilan: <Heart className="h-4 w-4" />,
  bayi_0_3: <Baby className="h-4 w-4" />,
  bayi_3_12: <Utensils className="h-4 w-4" />,
  anak_1_2: <User className="h-4 w-4" />,
}

export function PhaseFilter({
  selectedPhase,
  onPhaseChange,
  showFavorites = false,
  onFavoritesChange,
  showRead = false,
  onReadChange,
}: PhaseFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-3">
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="h-10 w-full justify-between rounded-xl border-slate-300 bg-white"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="h-4 w-4 text-doccure-teal" />
            Filter Artikel
          </span>
          {selectedPhase !== 'all' && (
            <Badge className="rounded-lg bg-doccure-teal text-white">
              {PHASES.find((p) => p.id === selectedPhase)?.label.split(' ')[0]}
            </Badge>
          )}
        </Button>
      </div>

      <div
        className={cn(
          'space-y-4 rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-4 lg:block',
          isExpanded ? 'block animate-in fade-in slide-in-from-top-2 duration-300' : 'hidden lg:block'
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <Filter className="h-4 w-4 text-doccure-teal" />
          <h3 className="text-base font-bold text-slate-900">Filter</h3>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Fase</h4>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className={cn(
                'h-10 justify-start rounded-xl border-slate-200 px-4 text-sm font-semibold transition-colors',
                selectedPhase === 'all'
                  ? 'border-doccure-teal bg-doccure-teal text-white hover:bg-doccure-dark hover:text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-50'
              )}
              onClick={() => onPhaseChange('all')}
            >
              Semua Fase
            </Button>

            {PHASES.map((phase) => (
              <Button
                key={phase.id}
                variant="outline"
                className={cn(
                  'h-10 justify-start gap-3 rounded-xl border-slate-200 px-4 text-sm font-semibold transition-colors',
                  selectedPhase === phase.id
                    ? 'border-doccure-teal bg-doccure-teal text-white hover:bg-doccure-dark hover:text-white'
                    : 'bg-white text-slate-900 hover:bg-slate-50'
                )}
                onClick={() => onPhaseChange(phase.id)}
              >
                <span className={cn('shrink-0 transition-colors', selectedPhase === phase.id ? 'text-white' : 'text-slate-900')}>
                  {phaseIcons[phase.id]}
                </span>
                <span className="truncate">{phase.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-3">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Filter Lain</h4>

          <div className="flex flex-col gap-2">
            {onFavoritesChange && (
              <Button
                variant="outline"
                className={cn(
                  'h-10 justify-start gap-3 rounded-xl border-slate-200 px-4 text-sm font-semibold transition-colors',
                  showFavorites
                    ? 'border-doccure-teal bg-doccure-teal text-white hover:bg-doccure-dark hover:text-white'
                    : 'bg-white text-slate-900 hover:bg-slate-50'
                )}
                onClick={() => onFavoritesChange(!showFavorites)}
              >
                <Star className={cn('h-4 w-4', showFavorites && 'fill-current')} />
                Favorit
              </Button>
            )}

            {onReadChange && (
              <Button
                variant="outline"
                className={cn(
                  'h-10 justify-start gap-3 rounded-xl border-slate-200 px-4 text-sm font-semibold transition-colors',
                  showRead
                    ? 'border-doccure-teal bg-doccure-teal text-white hover:bg-doccure-dark hover:text-white'
                    : 'bg-white text-slate-900 hover:bg-slate-50'
                )}
                onClick={() => onReadChange(!showRead)}
              >
                <Check className="h-4 w-4" />
                Sudah Dibaca
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



