'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { AdminMetricsGrid } from '@/components/admin/dashboard/AdminMetricsGrid'
import { AdminRiskDistributionChart } from '@/components/admin/dashboard/AdminRiskDistributionChart'
import { PendingApprovalList } from '@/components/admin/dashboard/PendingApprovalList'
import { RecentActivityList } from '@/components/admin/dashboard/RecentActivityList'
import { AdminTopHeader } from '@/components/admin/AdminTopHeader'
import { useAdminContext } from '@/components/providers/Providers'


export default function AdminPage() {
  const adminContext = useAdminContext()
  const stats = adminContext?.stats || {
    totalUsers: 0,
    totalDoctors: 0,
    pendingVerifications: 0,
    totalEducation: 0,
    totalRoadmap: 0,
  }
  const loading = adminContext?.loading

  if (loading && adminContext?.stats === null) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-white  transition-colors">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
           {/* Space where search bar used to be */}
           <div className="hidden lg:block flex-1" />
           <div className="flex items-center gap-4">
             <Skeleton className="h-12 w-12 rounded-full" />
             <Skeleton className="h-12 w-12 rounded-full" />
             <Skeleton className="h-10 w-40 rounded-full hidden lg:block" />
             <Skeleton className="h-12 w-32 rounded-full" />
           </div>
        </div>
        
        <Skeleton className="h-8 w-64 mb-6" />

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
           {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>

        {/* Charts & Lists Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Skeleton className="h-96 w-full rounded-[2rem]" />
             <Skeleton className="h-96 w-full rounded-[2rem]" />
           </div>
           <div className="xl:col-span-1">
             <Skeleton className="h-96 w-full rounded-[2rem]" />
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      <AdminTopHeader title="Admin Overview" />

      {/* 1. Metrics Row */}
      <AdminMetricsGrid stats={stats} />

      {/* 2. Main Grid: Charts & Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Stunting Risk Distribution Chart (From User Request) */}
             <AdminRiskDistributionChart />
             
             {/* Pending Approvals List */}
             <PendingApprovalList />
           </div>
           
           {/* Placeholder for larger future items or additional stats */}
        </div>

        {/* Right Column (1/3 width) - Recant Activity */}
        <div className="xl:col-span-1">
           <RecentActivityList />
        </div>
      </div>
    </div>
  )
}
