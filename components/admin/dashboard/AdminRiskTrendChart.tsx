'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import { ArrowUpRight, TrendingUp } from 'lucide-react'

const mockRiskTrend = [
  { month: 'Jan', risk: 42 },
  { month: 'Feb', risk: 38 },
  { month: 'Mar', risk: 35 },
  { month: 'Apr', risk: 32 },
  { month: 'May', risk: 28 },
  { month: 'Jun', risk: 25 },
]

export function AdminRiskTrendChart() {
  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-800 h-full relative overflow-hidden transition-colors">
       <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
            <TrendingUp className="w-5 h-5 text-medical-green" /> 
            Tren Risiko Stunting
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">Platform-wide average risk index</p>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </button>
      </div>

      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockRiskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.1} vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8" 
              fontSize={12} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: '#FFD93D', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#00A699"
              strokeWidth={3}
              dot={{ fill: '#00A699', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#FFD93D', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
