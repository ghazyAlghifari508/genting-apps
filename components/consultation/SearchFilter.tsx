'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchFilterProps {
  search: string
  setSearch: (val: string) => void
  category: string
  setCategory: (val: string) => void
  categories: string[]
}

export function SearchFilter({
  search,
  setSearch,
  category,
  setCategory,
  categories
}: SearchFilterProps) {
  return (
    <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start flex justify-center">
      <div className="rounded-3xl border border-slate-100  bg-white  p-5 sm:p-6 shadow-sm relative overflow-hidden w-full max-w-2xl mx-auto transition-colors duration-300">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-slate-50 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-slate-900  tracking-tight">Cari Dokter</h2>

          <div className="relative mt-6 group">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-doccure-teal transition-colors" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nama spesialis..."
              className="h-12 rounded-[20px] border-slate-200  pl-11 bg-white/60  backdrop-blur-md focus:bg-white   focus:ring-4 focus:ring-doccure-teal/10 shadow-sm transition-all duration-300"
            />
          </div>

          <div className="mt-8">
            <p className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <SlidersHorizontal className="h-3.5 w-3.5 text-doccure-teal" />
              Kategori Spesialis
            </p>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                    category === cat
                      ? 'border-doccure-teal bg-doccure-teal text-white shadow-md animate-in zoom-in-95'
                      : 'border-slate-100  bg-white  text-slate-500  hover:border-slate-300 '
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
