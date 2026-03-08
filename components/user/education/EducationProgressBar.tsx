'use client'

import { motion } from 'framer-motion';
import { Trophy, Flame, BookCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationProgressBarProps {
  readCount: number;
  totalDays?: number;
  streakDays?: number;
  className?: string;
}

export function EducationProgressBar({
  readCount,
  totalDays = 1000,
  streakDays = 0,
  className
}: EducationProgressBarProps) {
  const percentage = Math.round((readCount / totalDays) * 100 * 10) / 10;
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] text-doccure-teal">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-tight text-slate-900">{readCount}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Artikel Dibaca</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] text-orange-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-tight text-slate-900">{streakDays}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Hari Streak</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-semibold uppercase tracking-[0.08em] text-slate-500">Total Estafet</span>
          </div>
          <span className="font-bold text-slate-900">{percentage}%</span>
        </div>
        
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-doccure-teal"
          />
        </div>
      </div>
    </div>
  );
}



