'use client'

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EducationSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function EducationSearchBar({
  value,
  onChange,
  placeholder = 'Cari artikel edukasi...',
  className
}: EducationSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative group", className)}>
      <div className={cn(
        "relative flex items-center overflow-hidden rounded-[20px] border bg-white/70 backdrop-blur-md transition-all duration-300",
        isFocused ? "border-doccure-teal shadow-[0_20px_48px_-12px_rgba(15,23,42,0.12)] ring-4 ring-doccure-teal/10" : "border-slate-200"
      )}>
        <Search className={cn(
          "absolute left-3 h-4 w-4 transition-colors duration-200",
          isFocused ? "text-doccure-teal" : "text-slate-400"
        )} />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="h-10 border-none bg-transparent pl-9 pr-10 text-sm font-medium text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus-visible:ring-0"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 h-8 w-8 rounded-xl transition-colors hover:bg-slate-100"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4 text-slate-400" />
          </Button>
        )}
      </div>
      
      <div className={cn(
        "absolute inset-0 -z-10 rounded-2xl bg-doccure-teal/10 blur-xl transition-opacity duration-200",
        isFocused ? "opacity-100" : "opacity-0"
      )} />
      
      {isFocused && value.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-doccure-teal animate-pulse" />
            <p className="text-sm font-semibold text-slate-900">
              Menampilkan hasil untuk: <span className="text-doccure-teal italic">&quot;{value}&quot;</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



