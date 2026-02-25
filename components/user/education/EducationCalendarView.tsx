'use client'

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar as CalendarIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EducationContent, getPhaseFromDay, getPhaseInfo } from '@/types/education';

interface EducationCalendarViewProps {
  contents: EducationContent[];
  readDays: Set<number>;
  favoriteDays: Set<number>;
  onCardClick: (day: number) => void;
  currentDay: number;
}

export function EducationCalendarView({
  contents,
  readDays,
  favoriteDays,
  onCardClick,
  currentDay
}: EducationCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => Math.ceil(currentDay / 30) || 1);
  const itemsPerMonth = 30;
  const totalMonths = Math.ceil(1000 / itemsPerMonth);

  const monthStartDay = (currentMonth - 1) * itemsPerMonth + 1;
  const monthEndDay = Math.min(currentMonth * itemsPerMonth, 1000);

  const daysInMonth = useMemo(() => {
    return Array.from(
      { length: monthEndDay - monthStartDay + 1 }, 
      (_, i) => monthStartDay + i
    );
  }, [monthStartDay, monthEndDay]);

  const currentMonthPhase = getPhaseFromDay(monthStartDay);
  const phaseInfo = getPhaseInfo(currentMonthPhase);
  const phaseTone =
    currentMonthPhase === 'kehamilan'
      ? 'bg-doccure-teal'
      : currentMonthPhase === 'bayi_0_3'
        ? 'bg-sky-500'
        : currentMonthPhase === 'bayi_3_12'
          ? 'bg-emerald-500'
          : 'bg-slate-700';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
             <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Kalender Edukasi</h3>
            <p className="text-sm font-medium text-slate-500">
              Bulan ke-{currentMonth} <span className="text-slate-300 mx-2">|</span> Hari {monthStartDay} - {monthEndDay}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(prev => Math.max(1, prev - 1))}
            disabled={currentMonth === 1}
            className="h-8 w-8 rounded-xl hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </Button>
          
          <div className="min-w-[88px] px-2 text-center text-base font-bold text-slate-900">
            Bulan {currentMonth}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(prev => Math.min(totalMonths, prev + 1))}
            disabled={currentMonth === totalMonths}
            className="h-8 w-8 rounded-xl hover:bg-white"
          >
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-5">
         <div className="mb-5 text-center">
            <Badge className={cn(
              "mb-2 rounded-xl px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
              phaseTone
            )}>
              {phaseInfo?.label}
            </Badge>
         </div>

         <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
            {daysInMonth.map((day) => {
              const isRead = readDays.has(day);
              const isFavorite = favoriteDays.has(day);
              const isCurrent = day === currentDay;
              const contentExists = contents.some(c => c.day === day);

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCardClick(day)}
                  disabled={!contentExists}
                  className={cn(
                    "group relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl transition-all",
                    isCurrent 
                      ? "bg-doccure-dark text-white ring-2 ring-doccure-teal/20" 
                      : isRead 
                        ? "bg-doccure-teal/10 text-doccure-dark hover:bg-doccure-teal/15"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                     !contentExists && "cursor-not-allowed opacity-50"
                  )}
                >
                  {isFavorite && (
                    <div className="absolute top-1.5 right-1.5">
                      <Star className={cn("w-3 h-3 fill-amber-400 text-amber-400")} />
                    </div>
                  )}
                  
                  <span className={cn("text-lg font-black", isCurrent ? "text-white" : "")}>{day}</span>
                  
                  {isRead && (
                    <CheckCircle2 className={cn("h-4 w-4", isCurrent ? "text-emerald-300" : "text-current")} />
                  )}
                  
                  {!isRead && !isCurrent && (
                     <div className={cn("h-1.5 w-1.5 rounded-full", contentExists ? "bg-slate-300 group-hover:bg-slate-400" : "bg-transparent")} />
                  )}
                </motion.button>
              );
            })}
         </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 border-t border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-doccure-teal/15 ring-2 ring-doccure-teal/20" />
           <span className="text-xs font-semibold text-slate-500">Sudah Dibaca</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-doccure-dark" />
           <span className="text-xs font-semibold text-slate-500">Hari Ini</span>
        </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-slate-200" />
           <span className="text-xs font-semibold text-slate-500">Belum Dibaca</span>
        </div>
         <div className="flex items-center gap-2">
           <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
           <span className="text-xs font-semibold text-slate-500">Favorit</span>
        </div>
      </div>
    </div>
  );
}



