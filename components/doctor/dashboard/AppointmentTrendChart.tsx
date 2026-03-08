'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { ArrowUpRight } from 'lucide-react'

interface AppointmentTrendChartProps {
  data?: { name: string; value: number }[]
  summary?: {
    completed: number
    pending: number
  }
}

export function AppointmentTrendChart({ data: liveData, summary }: AppointmentTrendChartProps) {
  const chartData = liveData || [
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ]

  const totalThisWeek = chartData.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white  h-full relative overflow-hidden transition-colors">
       <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900  transition-colors">Appointment Trends</h3>
          <p className="text-xs text-slate-400 mt-1">Activity this week</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900  transition-colors">{totalThisWeek}</span>
            <span className="text-xs font-bold text-cerulean flex items-center bg-sea-green/20  px-1.5 py-0.5 rounded-full transition-colors">
               Live Data
            </span>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-50  transition-colors">
          <ArrowUpRight className="w-5 h-5 text-slate-400 " />
        </button>
      </div>

       <div className="flex gap-4 mb-6">
         <div className="flex items-center gap-2">
           <div className="w-2.5 h-2.5 rounded-full bg-cerulean"></div>
           <span className="text-xs font-bold text-slate-600  transition-colors">{summary?.completed || 0} Completed</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-2.5 h-2.5 rounded-full bg-slate-200  transition-colors"></div>
           <span className="text-xs font-bold text-slate-400  transition-colors">{summary?.pending || 0} Pending</span>
         </div>
       </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F6856" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0F6856" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ background: '#0F6856', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ display: 'none' }}
              cursor={{ stroke: '#0F6856', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#0F6856" 
              strokeWidth={3}
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute top-[40%] right-[30%] bg-cerulean text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">
        Total: {totalThisWeek}
      </div>
    </Card>
  )
}
