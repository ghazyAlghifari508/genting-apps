'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { 
  Users, 
  Stethoscope, 
  Clock, 
  BookOpen
} from 'lucide-react'
import { StatCard, StatProgress } from '@/components/doctor/dashboard/StatCard'

interface AdminStats {
  totalUsers: number
  totalDoctors: number
  pendingVerifications: number
  totalEducation: number
  totalRoadmap: number
}

// Mock Data for Bars
const MockBars = () => (
  <div className="flex items-end gap-[2px] h-10 w-full mt-2">
    {[35, 60, 45, 70, 50, 65, 40, 55, 75, 50, 60, 45, 35, 60, 45, 70, 50, 65, 40, 55, 75, 50, 60].map((h, i) => (
      <div 
        key={i} 
        className={`w-full rounded-t-sm transition-colors ${i % 2 === 0 ? 'bg-doccure-teal/80' : 'bg-slate-200 dark:bg-slate-700'}`} 
        style={{ height: `${h}%` }} 
      />
    ))}
  </div>
)

const MockLines = () => (
  <div className="flex items-end gap-[2px] h-10 w-full mt-2">
    {[20, 40, 30, 50, 35, 55, 25, 45, 60, 40, 50, 35, 20, 40, 30, 50, 35, 55, 25, 45, 60, 40, 50].map((h, i) => (
      <div 
        key={i} 
        className={`w-full rounded-t-sm transition-colors ${i % 3 === 0 ? 'bg-cerulean/60' : 'bg-slate-200 dark:bg-slate-700'}`} 
        style={{ height: `${h}%` }} 
      />
    ))}
  </div>
)

export const AdminMetricsGrid = ({ stats }: { stats: AdminStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* 1. Total Users */}
      <StatCard 
        title="Total Patients" 
        value={stats.totalUsers || 0} 
        icon={Users}
        chart={<MockBars />}
        footer={
          <div className="flex justify-between items-end">
            <div className="text-xs">
              <span className="text-slate-400 dark:text-slate-500">Active</span>
              <p className="font-bold text-slate-700 dark:text-slate-300 transition-colors">{Math.floor((stats.totalUsers || 0) * 0.8)}</p>
            </div>
            <div className="text-xs text-right">
              <span className="text-slate-400">Inactive</span>
              <p className="font-bold text-slate-700">{Math.ceil((stats.totalUsers || 0) * 0.2)}</p>
            </div>
          </div>
        }
      />

      {/* 2. Total Doctors */}
      <StatCard 
        title="Active Doctors" 
        value={stats.totalDoctors || 0} 
        icon={Stethoscope}
        chart={<MockLines />}
        footer={
          <div className="flex justify-between items-end">
             <div className="text-xs">
              <span className="text-slate-400 dark:text-slate-500">Available</span>
              <p className="font-bold text-slate-700 dark:text-slate-300 transition-colors">{Math.floor((stats.totalDoctors || 0) * 0.9)}</p>
            </div>
            <div className="text-xs text-right">
              <span className="text-slate-400">On Leave</span>
              <p className="font-bold text-slate-700">{Math.ceil((stats.totalDoctors || 0) * 0.1)}</p>
            </div>
          </div>
        }
      />

      {/* 3. Pending Approvals */}
      <StatCard 
        title="Pending Verifications" 
        value={stats.pendingVerifications || 0} 
        icon={Clock}
        footer={
          <div className="flex gap-4 mt-2">
            <div className="flex-1 space-y-3">
               <StatProgress label="New Request" value={stats.pendingVerifications > 0 ? stats.pendingVerifications - 1 : 0} total={stats.pendingVerifications} color="bg-yellow-400" />
            </div>
            <div className="flex-1 space-y-3">
               <StatProgress label="Reviewed" value={stats.pendingVerifications > 0 ? 1 : 0} total={stats.pendingVerifications} color="bg-slate-200" />
            </div>
          </div>
        }
      />

      {/* 4. Education & Roadmap */}
      <StatCard 
        title="System Engagement" 
        value={stats.totalRoadmap + stats.totalEducation || 0} 
        icon={BookOpen}
        footer={
          <div className="mt-2 text-xs font-semibold text-doccure-teal bg-doccure-teal/10 p-2 rounded-xl flex items-center justify-center gap-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Articles: {stats.totalEducation}</span>
            <span className="text-slate-300 dark:text-slate-700 mx-1">|</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Roadmaps: {stats.totalRoadmap}</span>
          </div>
        }
      />
    </div>
  )
}
