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
  // Group contents by phase
  const groupedContents = PHASES.map(phase => ({
    phase,
    contents: contents.filter(c => c.phase === phase.id)
  }));

  return (
    <div className="space-y-16 py-4">
      {groupedContents.map(({ phase, contents: phaseContents }) => (
        <div key={phase.id} className="relative">
          {/* Phase header with modern design */}
          <div className="sticky top-20 z-20 mb-10">
            <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-100 p-3 pr-6 rounded-2xl shadow-xl shadow-slate-200/50">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                phase.color
              )}>
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 leading-tight">{phase.label}</h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Hari {phase.dayRange[0]} - {phase.dayRange[1]}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-sea-green">{phaseContents.length} Artikel</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline track */}
          <div className="relative">
            {/* Main vertical line with gradient */}
            <div className={cn(
              "absolute left-[29px] top-0 bottom-0 w-[2px] rounded-full opacity-20",
              phase.color
            )} />
            
            {/* Cards container */}
            <div className="space-y-8 pl-14">
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
                      {/* Timeline node */}
                      <div className={cn(
                        "absolute -left-[36px] top-6 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 transition-all duration-500",
                        isCurrent 
                          ? `${phase.color} scale-125 ring-8 ring-cerulean/10` 
                          : isRead 
                            ? "bg-sea-green" 
                            : "bg-slate-200"
                      )} />
                      
                      {/* Current indicator arrow (only for desktop) */}
                      {isCurrent && (
                        <div className="hidden lg:block absolute -left-[120px] top-5">
                          <div className="flex items-center gap-2 bg-cerulean text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cerulean/20 animate-bounce-x">
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
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-10 text-center">
                  <p className="text-sm font-bold text-slate-400 italic">
                    Belum ada konten edukasi tersedia untuk fase ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* CSS Animation for bounce-x */}
      <style jsx global>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
}
