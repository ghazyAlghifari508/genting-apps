'use client'

import { motion } from 'framer-motion';
import { EducationContent, PHASES } from '@/types/education';
import { EducationCard } from './EducationCard';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface TimelineViewProps {
  contents: EducationContent[];
  readDays: Set<number>;
  favoriteDays: Set<number>;
  onCardClick: (day: number) => void;
  onFavorite: (day: number) => void;
  currentDay?: number;
}

export function TimelineView({
  contents,
  readDays,
  favoriteDays,
  onCardClick,
  onFavorite,
  currentDay = 1
}: TimelineViewProps) {
  const phaseTone: Record<string, string> = {
    kehamilan: 'bg-doccure-teal',
    bayi_0_3: 'bg-sky-500',
    bayi_3_12: 'bg-emerald-500',
    anak_1_2: 'bg-slate-700',
  };

  const groupedContents = PHASES.map(phase => ({
    phase,
    contents: contents.filter(c => c.phase === phase.id)
  }));

  return (
    <div className="space-y-10 py-2">
      {groupedContents.map(({ phase, contents: phaseContents }) => (
        <div key={phase.id} className="relative">
          <div className="sticky top-20 z-20 mb-6">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] px-3 py-2">
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-white",
                phaseTone[phase.id] || 'bg-doccure-teal'
              )}>
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold leading-tight text-slate-900">{phase.label}</h3>
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <span>Hari {phase.dayRange[0]} - {phase.dayRange[1]}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-doccure-teal">{phaseContents.length} Artikel</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className={cn(
              "absolute bottom-0 left-5 top-0 w-[2px] rounded-full opacity-25",
              phaseTone[phase.id] || 'bg-doccure-teal'
            )} />
            
            <div className="space-y-4 pl-11">
              {phaseContents.length > 0 ? (
                phaseContents.map((content, index) => {
                  const isCurrent = content.day === currentDay;
                  const isRead = readDays.has(content.day);
                  
                  return (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: index % 5 * 0.1, duration: 0.5 }}
                      className="relative"
                    >
                      <div className={cn(
                        "absolute -left-[28px] top-5 z-10 h-4 w-4 rounded-full border-2 border-white shadow-sm transition-all duration-300",
                        isCurrent 
                          ? `${phaseTone[phase.id] || 'bg-doccure-teal'} scale-110 ring-4 ring-doccure-teal/15` 
                          : isRead 
                            ? "bg-emerald-500" 
                            : "bg-slate-200"
                      )} />
                      
                      {isCurrent && (
                        <div className="absolute -left-[94px] top-4 hidden lg:block">
                          <div className="flex items-center gap-2 rounded-full bg-doccure-teal px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm">
                            <span>Hari Ini</span>
                            <div className="w-2 h-2 border-t-2 border-r-2 border-white rotate-45" />
                          </div>
                        </div>
                      )}
                      
                      <EducationCard
                        content={content}
                        isRead={isRead}
                        isFavorite={favoriteDays.has(content.day)}
                        onClick={() => onCardClick(content.day)}
                        onFavorite={() => onFavorite(content.day)}
                      />
                    </motion.div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-semibold italic text-slate-500">
                    Belum ada konten edukasi tersedia untuk fase ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



