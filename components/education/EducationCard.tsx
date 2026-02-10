'use client'

import React from 'react';
import Image from 'next/image';
import { ChevronRight, Calendar, Star, CheckCircle2 } from 'lucide-react';
import { EducationContent } from '@/types/education';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface EducationCardProps {
  content: EducationContent;
  isRead?: boolean;
  isFavorite?: boolean;
  onClick: () => void;
  onFavorite?: (e: React.MouseEvent) => void;
}

export function EducationCard({ 
  content, 
  isRead, 
  isFavorite, 
  onClick,
  onFavorite 
}: EducationCardProps) {
  return (
    <div 
      onClick={onClick}
      className='w-full group mx-auto bg-white dark:bg-[#252525] p-2 border border-slate-100 hover:border-slate-200 dark:border-0 overflow-hidden rounded-[2rem] dark:text-white text-black shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer'
    >
      <figure className='w-full h-64 group-hover:h-60 transition-all duration-300 bg-slate-50 dark:bg-[#0a121a] rounded-[1.5rem] relative overflow-hidden'>
        <div
          style={{
            background: 'linear-gradient(123.9deg, #0B65ED 1.52%, rgba(0, 0, 0, 0) 68.91%)',
          }}
          className='absolute top-0 left-0 w-full h-full group-hover:opacity-100 opacity-0 transition-all duration-300 z-10'
        ></div>
        
        {/* Helper Actions (Favorite/Read) - Overlay */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
            {isRead && (
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-sea-green">
                    <CheckCircle2 className="w-4 h-4" />
                </div>
            )}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onFavorite?.(e);
                }}
                className={cn(
                    "p-2 rounded-full shadow-sm transition-colors",
                    isFavorite ? "bg-amber-50 text-amber-500" : "bg-white/90 backdrop-blur-sm text-slate-400 hover:text-amber-500"
                )}
            >
                <Star className={cn("w-4 h-4", isFavorite && "fill-amber-500")} />
            </button>
        </div>

        <Image
          src={content.thumbnail_url || 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2070&auto=format&fit=crop'}
          alt={content.title}
          width={600}
          height={600}
          className='absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
        />
        
        {/* Badge Overlay */}
        <div className="absolute top-3 left-3 z-20">
             <Badge className="bg-white/90 backdrop-blur-md text-slate-900 shadow-sm hover:bg-white">
                Hari {content.day}
             </Badge>
        </div>
      </figure>
      
      <article className='p-5 space-y-3'>
        <div className="flex items-center justify-between">
           <div className='h-1 w-12 bg-cerulean/50 rounded-full group-hover:w-20 transition-all duration-300'></div>
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{content.category}</span>
        </div>
        
        <h1 className='text-xl font-black text-slate-900 capitalize leading-tight line-clamp-2 group-hover:text-cerulean transition-colors'>
          {content.title}
        </h1>
        
        <p className='text-sm text-slate-500 leading-relaxed line-clamp-2'>
          {content.description}
        </p>
        
        <div
          className='text-sm font-bold text-cerulean group-hover:opacity-100 opacity-0 translate-y-2 group-hover:translate-y-0 pt-3 flex items-center gap-1 transition-all duration-300'
        >
          Baca Selengkapnya
          <span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </div>
  );
}
