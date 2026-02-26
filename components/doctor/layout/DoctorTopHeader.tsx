'use client'

import React from 'react'
import { Search, Bell, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DoctorTopHeaderProps {
  title?: string
  showSearch?: boolean
}

export function DoctorTopHeader({ title, showSearch = true }: DoctorTopHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      {/* Search or Title Section */}
      <div className="flex items-center gap-3 w-full max-w-xl">
        {showSearch ? (
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <Input 
               placeholder="Search" 
               className="pl-12 h-12 rounded-[2rem] border-none bg-white dark:bg-slate-800 shadow-sm text-slate-700 dark:text-white transition-colors"
             />
          </div>
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white transition-colors truncate">{title}</h1>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
         <button className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
           <Bell className="w-5 h-5" />
         </button>
         <button className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
           <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center">
             <span className="text-xs">?</span>
           </div>
         </button>
         
         <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-sm text-slate-600 dark:text-slate-300 font-bold border border-transparent dark:border-white/10 transition-colors">
            <Calendar className="w-4 h-4" />
            October 23, 2025
         </div>
         
         <Button className="rounded-full bg-doccure-teal hover:bg-green-600 text-white px-6 h-12 font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all">
           Generate Report
         </Button>
      </div>
    </div>
  )
}
