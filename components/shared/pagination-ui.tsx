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
    <div className="flex items-center justify-center gap-2 pt-4 pb-2">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="h-9 w-9 rounded-[6px] border-slate-300"
      >
        <ChevronLeft className="h-4 w-4 text-slate-600" />
      </Button>
      
      <div className="mx-1 flex items-center gap-1">
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
                "h-9 w-9 rounded-[6px] text-sm font-semibold transition-colors",
                currentPage === pageNum 
                  ? "bg-doccure-teal text-white hover:bg-doccure-dark" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
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
        className="h-9 w-9 rounded-[6px] border-slate-300"
      >
        <ChevronRight className="h-4 w-4 text-slate-600" />
      </Button>
    </div>
  )
})

PaginationUI.displayName = 'PaginationUI'
