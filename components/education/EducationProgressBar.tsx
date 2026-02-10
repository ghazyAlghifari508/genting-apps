'use client'

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
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
    <div className={cn("space-y-4", className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Read Count */}
        <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100/50 flex flex-col items-center justify-center text-center gap-3 transition-colors hover:bg-slate-100/80 group/stat">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-cerulean shadow-sm group-hover/stat:scale-110 transition-transform">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 leading-tight">{readCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Artikel Dibaca</p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100/50 flex flex-col items-center justify-center text-center gap-3 transition-colors hover:bg-slate-100/80 group/stat">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-orange-500 shadow-sm group-hover/stat:scale-110 transition-transform">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 leading-tight">{streakDays}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari Streak</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-500 uppercase tracking-wider">Total Estafet</span>
          </div>
          <span className="font-black text-slate-900">{percentage}%</span>
        </div>
        
        <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cerulean to-sea-green rounded-full shadow-[0_2px_10px_rgba(14,165,233,0.3)] relative"
          >
             <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30" />
             <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/5" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}