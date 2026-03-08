'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Clock, Activity, BookOpen, AlertCircle } from 'lucide-react'

const mockActivities = [
  {
    id: 1,
    type: 'system',
    title: 'System Backup Completed',
    time: '10 mins ago',
    icon: Activity,
    color: 'text-doccure-teal',
    bgColor: 'bg-doccure-teal/10',
  },
  {
    id: 2,
    type: 'content',
    title: 'New Education Article Published',
    time: '2 hours ago',
    icon: BookOpen,
    color: 'text-cerulean',
    bgColor: 'bg-cerulean/10',
  },
  {
    id: 3,
    type: 'alert',
    title: 'High Server Load Detected',
    time: '5 hours ago',
    icon: AlertCircle,
    color: 'text-grapefruit',
    bgColor: 'bg-grapefruit/10',
  },
  {
    id: 4,
    type: 'user',
    title: '15 New Users Registered Today',
    time: '8 hours ago',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
]

export function RecentActivityList() {
  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white  h-full relative overflow-hidden transition-colors">
       {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50  rounded-bl-[4rem] -z-10 transition-colors" />

      <div className="flex justify-between items-start mb-6 relative z-10 transition-colors">
        <div>
          <h3 className="text-lg font-bold text-slate-900  transition-colors">Recent Activity</h3>
          <p className="text-xs text-slate-400  mt-1 transition-colors">Platform updates & logs</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="absolute left-6 top-16 bottom-0 w-[2px] bg-slate-100  -z-10 transition-colors" />
        
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex gap-4 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white  ${activity.bgColor} ${activity.color} group-hover:scale-110 transition-transform transition-colors`}>
              <activity.icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="text-sm font-bold text-slate-800  line-clamp-2 leading-tight group-hover:text-cerulean transition-colors">{activity.title}</h4>
              <p className="text-xs text-slate-400  mt-2 font-medium flex items-center gap-1.5 transition-colors">
                <Clock className="w-3 h-3" />
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 py-3 bg-slate-50  hover:bg-slate-100  text-slate-600  text-sm font-bold rounded-xl transition-colors">
        View Full Logs
      </button>
    </Card>
  )
}
