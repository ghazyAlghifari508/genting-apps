'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EducationContent } from '@/types/education'

interface TodayHighlightProps {
  content: EducationContent
  currentDay: number
  onReadMore: (day: number) => void
}

export const TodayHighlight = React.memo(({ content, currentDay, onReadMore }: TodayHighlightProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cerulean to-sea-green rounded-[3rem] blur-2xl opacity-10" />
      <Card className="border-none rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-slate-200/40 relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cerulean/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row relative z-10">
          <div className="md:w-[30%] bg-slate-900 flex flex-col items-center justify-center p-10 md:p-14 text-center relative overflow-hidden rounded-t-[3rem] md:rounded-l-[3rem] md:rounded-tr-none">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute inset-0 bg-gradient-to-br from-cerulean/20 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-sea-green text-slate-900 font-extrabold mb-8 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-sea-green/20">
                Pilihan Hari Ini
              </div>

                <div className="space-y-0">
                  <p className="text-white/30 font-black tracking-[0.4em] text-[10px] uppercase mb-2">HARI</p>
                  <h3 className="text-7xl md:text-8xl font-black text-white leading-none tracking-tighter">
                    {currentDay}
                  </h3>
                </div>
            </div>
          </div>
          <div className="md:w-[70%] p-10 md:p-16 flex flex-col justify-center gap-8">
            <div className="space-y-5">
              <div className="inline-flex bg-slate-100 text-slate-500 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                Rekomendasi Personal
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {content.title}
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
                {content.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {content.tags && content.tags.length > 0 ? (
                content.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="bg-white text-slate-400 font-bold uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-xl border-slate-100 italic shadow-sm">
                    #{tag.replace('#', '')}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="bg-white text-slate-300 font-bold uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-xl border-slate-100 italic shadow-sm">
                  #EdukasiGenting
                </Badge>
              )}
            </div>
            
            <Button 
              size="lg"
              onClick={() => onReadMore(content.day)}
              className="h-16 px-12 rounded-[1.25rem] bg-cerulean hover:bg-cerulean/90 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-cerulean/25 w-full md:w-fit"
            >
              Baca Panduan Lengkap
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
})

TodayHighlight.displayName = 'TodayHighlight'
