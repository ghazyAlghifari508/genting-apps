'use client'

import React from 'react'
import Image from 'next/image'
import { ChevronRight, Star, CheckCircle2 } from 'lucide-react'
import { EducationContent } from '@/types/education'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface EducationCardProps {
  content: EducationContent
  isRead?: boolean
  isFavorite?: boolean
  onClick: () => void
  onFavorite?: () => void
  featured?: boolean
}

export function EducationCard({
  content,
  isRead,
  isFavorite,
  onClick,
  onFavorite,
  featured = false,
}: EducationCardProps) {
  if (featured) {
    return (
      <div
        onClick={onClick}
        className="group w-full cursor-pointer overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-200 hover:border-doccure-teal/40"
      >
        <div className="grid md:grid-cols-[1.08fr_0.92fr]">
          <figure className="relative h-60 overflow-hidden bg-slate-100 md:h-full">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/45 via-slate-900/15 to-transparent" />

            <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
              <Badge className="rounded-xl border border-slate-100/80 bg-white/95 text-slate-900 hover:bg-white">
                Hari {content.day}
              </Badge>
              {isRead && (
                <div className="rounded-full bg-white p-1.5 text-emerald-600 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onFavorite?.()
              }}
              className={cn(
                'absolute right-4 top-4 z-20 rounded-full p-1.5 shadow-sm transition-colors',
                isFavorite ? 'bg-amber-50 text-amber-500' : 'bg-white text-slate-400 hover:text-amber-500'
              )}
            >
              <Star className={cn('h-4 w-4', isFavorite && 'fill-amber-500')} />
            </button>

            <Image
              src={content.thumbnail_url || '/images/unsplash/img_028c4aca.png'}
              alt={content.title}
              width={1000}
              height={700}
              className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </figure>

          <article className="flex flex-col justify-between space-y-3 p-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="h-1 w-16 rounded-full bg-doccure-teal/65 transition-all duration-300 group-hover:w-24" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">{content.category}</span>
              </div>

              <h3 className="line-clamp-2 text-2xl font-bold capitalize leading-tight text-slate-900 transition-colors group-hover:text-doccure-dark">
                {content.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-slate-600">
                {content.description}
              </p>
            </div>

            <div className="inline-flex items-center gap-1 text-sm font-semibold text-doccure-teal transition group-hover:translate-x-0.5">
              Baca Selengkapnya
              <ChevronRight className="h-4 w-4" />
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="group w-full cursor-pointer overflow-hidden rounded-[28px] border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)] hover:border-doccure-teal/40 hover:-translate-y-2"
    >
      <figure className="relative h-52 w-full overflow-hidden rounded-t-[28px] bg-slate-100">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        <div className="absolute right-4 top-4 z-20 flex gap-2">
          {isRead && (
            <div className="rounded-full bg-white/90 backdrop-blur-md p-2 text-emerald-600 shadow-sm border border-emerald-50">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavorite?.()
            }}
            className={cn(
              'rounded-full p-2 shadow-sm backdrop-blur-md transition-all duration-300',
              isFavorite ? 'bg-amber-50 text-amber-500 scale-110' : 'bg-white/90 text-slate-400 hover:text-amber-500 hover:scale-110'
            )}
          >
            <Star className={cn('h-4 w-4', isFavorite && 'fill-amber-500')} />
          </button>
        </div>

        <Image
          src={content.thumbnail_url || '/images/unsplash/img_028c4aca.png'}
          alt={content.title}
          width={600}
          height={600}
          className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute left-4 top-4 z-20">
          <Badge className="rounded-xl border border-white/20 bg-black/20 backdrop-blur-md text-white font-black px-3 py-1 shadow-sm">
            HARI {content.day}
          </Badge>
        </div>
      </figure>

      <article className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="h-1 w-12 rounded-full bg-doccure-teal/40 transition-all duration-500 group-hover:w-20 group-hover:bg-doccure-teal" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{content.category}</span>
        </div>

        <div>
          <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-doccure-teal tracking-tight">
            {content.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors">
            {content.description}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 text-xs font-black uppercase tracking-widest text-doccure-teal transition-all duration-300 group-hover:gap-4">
          Baca Selengkapnya
          <ChevronRight className="h-4 w-4" />
        </div>
      </article>
    </div>
  )
}
