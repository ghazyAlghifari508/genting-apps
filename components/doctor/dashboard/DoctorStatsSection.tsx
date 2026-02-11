'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Star, 
  ArrowUpRight,
  Settings,
  User,
  HelpCircle,
  FileText
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
} from 'recharts'

const data = [
  { name: 'Sen', val: 400 },
  { name: 'Sel', val: 300 },
  { name: 'Rab', val: 600 },
  { name: 'Kam', val: 800 },
  { name: 'Jum', val: 500 },
  { name: 'Sab', val: 900 },
  { name: 'Min', val: 1200 },
]

interface DoctorStatsSectionProps {
  stats: any
}

export default function DoctorStatsSection({ stats }: DoctorStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Analytics Chart */}
      <Card className="lg:col-span-8 rounded-[2.5rem] p-8 border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900">Performa Mingguan</h3>
              <p className="text-sm text-slate-500 font-medium">Tren pendapatan & konsultasi Anda</p>
            </div>
            <div className="flex gap-2">
               <div className="px-4 py-2 bg-slate-900 rounded-xl text-white text-xs font-black flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-sea-green" />
                  +12.5%
               </div>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#00AEEF" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Quick Stats & Actions */}
      <div className="lg:col-span-4 space-y-6">
         <Card className="rounded-[2.5rem] p-8 bg-slate-900 border-none shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
            <div className="relative z-10 text-white">
               <h4 className="text-lg font-black mb-6">Ringkasan Bulan Ini</h4>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Total Earned</p>
                     <p className="text-xl font-black text-sea-green">Rp {stats?.totalEarnings?.toLocaleString('id-ID') || 0}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Total Sesi</p>
                     <p className="text-xl font-black text-cerulean">{stats?.completedConsultations || 0}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Rata-rata Rating</p>
                     <p className="text-xl font-black text-amber-400">{stats?.avgRating || '0.0'} ⭐</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Pasien Baru</p>
                     <p className="text-xl font-black text-rose-400">+5</p>
                  </div>
               </div>
               
               <Button className="w-full mt-8 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 group">
                  Detail Laporan
                  <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
               </Button>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cerulean/20 rounded-full blur-3xl" />
         </Card>

         <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 rounded-[2rem] border-white/50 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center gap-2 group hover:border-cerulean hover:bg-white transition-all shadow-sm">
               <div className="w-10 h-10 rounded-xl bg-cerulean/10 flex items-center justify-center text-cerulean group-hover:bg-cerulean group-hover:text-white transition-all">
                  <Settings className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Settings</span>
            </Button>
            <Button variant="outline" className="h-24 rounded-[2rem] border-white/50 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center gap-2 group hover:border-sea-green hover:bg-white transition-all shadow-sm">
               <div className="w-10 h-10 rounded-xl bg-sea-green/10 flex items-center justify-center text-sea-green group-hover:bg-sea-green group-hover:text-white transition-all">
                  <FileText className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Profile</span>
            </Button>
         </div>
      </div>
    </div>
  )
}
