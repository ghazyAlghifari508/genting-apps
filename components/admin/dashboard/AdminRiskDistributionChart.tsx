'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'

const riskDistribution = [
  { name: 'Rendah', value: 45, color: '#137A74' }, // medical-green
  { name: 'Sedang', value: 35, color: '#DDF247' }, // doccure-yellow
  { name: 'Tinggi', value: 20, color: '#FF6B6B' }, // medical-red
]

export function AdminRiskDistributionChart() {
  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-800 h-full flex flex-col relative overflow-hidden transition-colors">
       <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
            <AlertTriangle className="w-5 h-5 text-doccure-yellow" />
            Distribusi Risiko
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">Based on latest user assessments</p>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </button>
      </div>

      <div className="flex-1 min-h-[200px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistribution}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {riskDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'transparent' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 transition-colors">
        {riskDistribution.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors">{item.name}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
