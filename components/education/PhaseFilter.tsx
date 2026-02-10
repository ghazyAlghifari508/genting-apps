'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phase, PHASES } from '@/types/education';
import { cn } from '@/lib/utils';
import { Baby, Heart, Utensils, User, Filter, X, Bookmark, CheckCircle2 } from 'lucide-react';

interface PhaseFilterProps {
  selectedPhase: Phase | 'all';
  onPhaseChange: (phase: Phase | 'all') => void;
  showFavorites?: boolean;
  onFavoritesChange?: (show: boolean) => void;
  showRead?: boolean;
  onReadChange?: (show: boolean) => void;
}

const phaseIcons: Record<Phase, React.ReactNode> = {
  kehamilan: <Heart className="w-4 h-4" />,
  bayi_0_3: <Baby className="w-4 h-4" />,
  bayi_3_12: <Utensils className="w-4 h-4" />,
  anak_1_2: <User className="w-4 h-4" />
};

export function PhaseFilter({
  selectedPhase,
  onPhaseChange,
  showFavorites = false,
  onFavoritesChange,
  showRead = false,
  onReadChange
}: PhaseFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full justify-between h-12 rounded-xl border-slate-200 bg-white"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center gap-2 font-bold text-slate-700">
            <Filter className="w-4 h-4 text-cerulean" />
            Filter Artikel
          </span>
          {selectedPhase !== 'all' && (
            <Badge className="bg-cerulean text-white rounded-lg">
              {PHASES.find(p => p.id === selectedPhase)?.label.split(' ')[0]}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter content */}
      <div className={cn(
        "space-y-6 lg:block bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm",
        isExpanded ? "block animate-in fade-in slide-in-from-top-2 duration-300" : "hidden lg:block"
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Filter className="w-5 h-5 text-slate-900" />
          <h3 className="text-xl font-black text-slate-900">Filter</h3>
        </div>

        {/* Phase filters */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400">Fase</h4>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className={cn(
                "justify-start h-12 px-5 rounded-2xl font-black transition-all border-slate-100 shadow-none",
                selectedPhase === 'all' 
                  ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white" 
                  : "bg-white text-slate-900 hover:bg-slate-50"
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
                  "justify-start gap-4 h-12 px-5 rounded-2xl font-black transition-all border-slate-100 shadow-none",
                  selectedPhase === phase.id 
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white" 
                    : "bg-white text-slate-900 hover:bg-slate-50"
                )}
                onClick={() => onPhaseChange(phase.id)}
              >
                <span className={cn(
                  "flex-shrink-0 transition-colors",
                  selectedPhase === phase.id ? "text-white" : "text-slate-900"
                )}>
                  {phaseIcons[phase.id]}
                </span>
                <span className="truncate">{phase.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Status filters */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400">Filter Lain</h4>
          
          <div className="flex flex-col gap-2">
            {onFavoritesChange && (
              <Button
                variant="outline"
                className={cn(
                  "justify-start gap-4 h-12 px-5 rounded-2xl font-black transition-all border-slate-100 shadow-none",
                  showFavorites 
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white" 
                    : "bg-white text-slate-900 hover:bg-slate-50"
                )}
                onClick={() => onFavoritesChange(!showFavorites)}
              >
                <div className="flex items-center justify-center w-5 h-5 text-base">
                  {showFavorites ? '⭐' : '⭐'}
                </div>
                Favorit
              </Button>
            )}
            
            {onReadChange && (
              <Button
                variant="outline"
                className={cn(
                  "justify-start gap-4 h-12 px-5 rounded-2xl font-black transition-all border-slate-100 shadow-none",
                  showRead 
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white" 
                    : "bg-white text-slate-900 hover:bg-slate-50"
                )}
                onClick={() => onReadChange(!showRead)}
              >
                <div className="flex items-center justify-center w-5 h-5 text-sm font-black">
                  ✓
                </div>
                Sudah Dibaca
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
