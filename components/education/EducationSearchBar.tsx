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
        "relative flex items-center transition-all duration-300 rounded-2xl bg-white border overflow-hidden",
        isFocused ? "border-cerulean shadow-lg shadow-cerulean/5 translate-y-[-2px]" : "border-slate-100 shadow-sm"
      )}>
        <Search className={cn(
          "absolute left-4 w-5 h-5 transition-colors duration-300",
          isFocused ? "text-cerulean" : "text-slate-400"
        )} />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-14 border-none bg-transparent focus-visible:ring-0 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-medium"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 h-10 w-10 hover:bg-slate-50 transition-colors rounded-xl"
            onClick={() => onChange('')}
          >
            <X className="w-5 h-5 text-slate-400" />
          </Button>
        )}
      </div>
      
      {/* Glow effect on focus */}
      <div className={cn(
        "absolute inset-0 -z-10 bg-cerulean/10 blur-xl transition-opacity duration-300 rounded-2xl",
        isFocused ? "opacity-100" : "opacity-0"
      )} />
      
      {/* Search suggestions info */}
      {isFocused && value.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cerulean animate-pulse" />
            <p className="text-sm font-bold text-slate-900">
              Menampilkan hasil untuk: <span className="text-cerulean italic">"{value}"</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
