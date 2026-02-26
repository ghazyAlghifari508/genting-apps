'use client'

type CategoryFilter = 'all' | 'exercise' | 'nutrition'

interface CategoryFiltersProps {
  category: CategoryFilter
  setCategory: (val: CategoryFilter) => void
  categoryTabs: Array<{ key: CategoryFilter; label: string }>
  categoryCounts: Record<CategoryFilter, number>
  trimester: number
  setTrimester: (val: number) => void
}

export function CategoryFilters({
  category,
  setCategory,
  categoryTabs,
  categoryCounts,
  trimester,
  setTrimester
}: CategoryFiltersProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 -mt-10 sm:px-6 lg:px-8 relative z-30">
      <div className="rounded-[32px] border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 shadow-[0_24px_54px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCategory(tab.key)}
                className={`inline-flex items-center gap-3 rounded-2xl border px-5 py-3 text-xs font-bold transition-all duration-300 ${
                  category === tab.key
                    ? 'border-doccure-teal bg-doccure-teal text-white shadow-lg shadow-doccure-teal/20 active:scale-95'
                    : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <span className="tracking-wide">{tab.label}</span>
                <span
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${
                    category === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {categoryCounts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 p-1.5">
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                onClick={() => setTrimester(t)}
                className={`h-11 rounded-xl px-5 text-[11px] font-black uppercase tracking-[0.1em] transition-all ${
                  trimester === t
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-white/5'
                }`}
              >
                TM {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
