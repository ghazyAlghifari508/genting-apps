import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-20 text-slate-900 dark:text-white relative overflow-hidden transition-colors">
      {/* Background Motifs */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Hero Header Skeleton */}
      <section className="relative w-full overflow-hidden min-h-[600px] flex items-center justify-center pt-28 pb-32 bg-slate-50 dark:bg-slate-800/50">
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
             <Skeleton className="h-6 w-64 rounded-full mb-8 opacity-20 dark:bg-slate-700" />
             <Skeleton className="h-20 w-3/4 rounded-3xl mb-8 dark:bg-slate-700" />
             <Skeleton className="h-6 w-1/2 rounded-full mb-10 dark:bg-slate-700" />
             <div className="flex gap-4">
                <Skeleton className="h-14 w-40 rounded-2xl dark:bg-slate-700" />
                <Skeleton className="h-14 w-40 rounded-2xl dark:bg-slate-700" />
             </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content Skeleton */}
      <section className="mx-auto -mt-12 relative z-20 max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Service Cards Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-[28px] dark:bg-slate-800" />
              ))}
            </div>
            {/* Pregnancy Status Card Skeleton */}
            <Skeleton className="h-64 rounded-[32px] dark:bg-slate-800" />
            {/* Daily Tasks Skeleton */}
            <Skeleton className="h-96 rounded-[32px] dark:bg-slate-800" />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-48 rounded-[32px] dark:bg-slate-800" />
            <Skeleton className="h-80 rounded-[32px] dark:bg-slate-800" />
            <Skeleton className="h-64 rounded-[32px] dark:bg-slate-800" />
          </div>
        </div>
      </section>
    </div>
  )
}
