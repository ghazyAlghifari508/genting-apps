'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationUIProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const PaginationUI = React.memo(({ currentPage, totalPages, onPageChange }: PaginationUIProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-10 pb-6">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="w-12 h-12 rounded-2xl border-slate-100 shadow-sm"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600" />
      </Button>
      
      <div className="flex items-center gap-1 mx-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) pageNum = i + 1;
          else if (currentPage <= 3) pageNum = i + 1;
          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
          else pageNum = currentPage - 2 + i;

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "ghost"}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "w-12 h-12 rounded-2xl font-black transition-all",
                currentPage === pageNum 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="w-12 h-12 rounded-2xl border-slate-100 shadow-sm"
      >
        <ChevronRight className="w-5 h-5 text-slate-600" />
      </Button>
    </div>
  )
})

PaginationUI.displayName = 'PaginationUI'
