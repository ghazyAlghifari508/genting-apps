'use client'

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, Calendar as CalendarIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EducationContent, PHASES, getPhaseFromDay, getPhaseInfo } from '@/types/education';

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
  // 1000 days is approx 33-34 months (assuming 30 days/month for simplicity in this view or strict 1000 days)
  // Let's group by "Months" of 30 days for easier navigation, or use Phases.
  // The user image suggestion "foto3" usually implies a grid of days 1-30, 31-60 etc.
  // Let's use 30-day "Page" chunks as "Months".
  
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

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
             <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Kalender Edukasi</h3>
            <p className="text-sm font-medium text-slate-500">
              Bulan ke-{currentMonth} <span className="text-slate-300 mx-2">|</span> Hari {monthStartDay} - {monthEndDay}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(prev => Math.max(1, prev - 1))}
            disabled={currentMonth === 1}
            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Button>
          
          <div className="px-4 font-black text-slate-900 text-lg min-w-[100px] text-center">
            Bulan {currentMonth}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(prev => Math.min(totalMonths, prev + 1))}
            disabled={currentMonth === totalMonths}
            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6 md:p-8">
         <div className="text-center mb-8">
            <Badge className={cn(
              "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-2",
              phaseInfo?.color || "bg-slate-900"
            )}>
              {phaseInfo?.label}
            </Badge>
         </div>

         <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 md:gap-4">
            {daysInMonth.map((day) => {
              const isRead = readDays.has(day);
              const isFavorite = favoriteDays.has(day);
              const isCurrent = day === currentDay;
              const isLocked = day > currentDay + 7; // Example locking logic (can adjust)
              
              // Get content existence (some days might not have content?? usually 1000 days content exists)
              // For now assume content exists for all days or handle verify click
              const contentExists = contents.some(c => c.day === day);

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCardClick(day)}
                  disabled={!contentExists}
                  className={cn(
                    "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 relative group transition-all",
                    isCurrent 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 ring-4 ring-slate-100" 
                      : isRead 
                        ? "bg-cerulean/10 text-cerulean hover:bg-cerulean hover:text-white"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                     !contentExists && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isFavorite && (
                    <div className="absolute top-1.5 right-1.5">
                      <Star className={cn("w-3 h-3 fill-amber-400 text-amber-400")} />
                    </div>
                  )}
                  
                  <span className={cn("text-lg font-black", isCurrent ? "text-white" : "")}>{day}</span>
                  
                  {isRead && (
                    <CheckCircle2 className={cn("w-4 h-4", isCurrent ? "text-sea-green" : "text-current")} />
                  )}
                  
                  {!isRead && !isCurrent && (
                     <div className={cn("w-1.5 h-1.5 rounded-full", contentExists ? "bg-slate-300 group-hover:bg-white/50" : "bg-transparent")} />
                  )}
                </motion.button>
              );
            })}
         </div>
      </div>
      
      {/* Legend */}
      <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-wrap justify-center gap-6">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-cerulean/10 ring-2 ring-cerulean/20" />
           <span className="text-xs font-bold text-slate-500">Sudah Dibaca</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-slate-900" />
           <span className="text-xs font-bold text-slate-500">Hari Ini</span>
        </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-slate-200" />
           <span className="text-xs font-bold text-slate-500">Belum Dibaca</span>
        </div>
         <div className="flex items-center gap-2">
           <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
           <span className="text-xs font-bold text-slate-500">Favorit</span>
        </div>
      </div>
    </div>
  );
}
