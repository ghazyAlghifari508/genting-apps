'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Wallet, TrendingUp, History, Download } from 'lucide-react'
import { useDoctorContext } from '@/components/providers/Providers'
import type { DoctorEarningRecord } from '@/types/consultation'

export default function DoctorEarningsPage() {
  const doctorContext = useDoctorContext()
  const earnings = (doctorContext?.earnings || []) as DoctorEarningRecord[]
  const loading = doctorContext?.loading

  const totalEarnings = earnings.reduce((acc, curr) => acc + (curr.total_cost || 0), 0)

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen relative overflow-hidden">
      
      <main className="space-y-8">
        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-cerulean to-cerulean/90 text-white rounded-[2.5rem] border-none shadow-xl shadow-cerulean/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 text-xs rounded-xl">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
            <p className="text-white/70 text-sm font-medium relative z-10">Total Pendapatan Bersih</p>
            <h2 className="text-4xl font-black mt-1 relative z-10">Rp {totalEarnings.toLocaleString('id-ID')}</h2>
          </Card>

          <Card className="p-6 bg-white rounded-[2.5rem] border-none shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sea-green/20 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-cerulean" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Sesi Selesai (Dibayar)</p>
                <h3 className="text-2xl font-black text-slate-900">{earnings.length} <span className="text-sm font-bold text-slate-400">Konsultasi</span></h3>
              </div>
            </div>
          </Card>
        </div>

        {/* History Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h2>
          </div>

          {loading && earnings.length === 0 ? (
             <div className="py-20 text-center text-slate-400">Memuat transaksi...</div>
          ) : earnings.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 bg-transparent rounded-[2rem]">
              <p className="text-slate-500 font-medium">Belum ada riwayat pendapatan</p>
            </Card>
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
               {earnings.map((tx, idx) => (
                 <div key={tx.id} className={`flex items-center justify-between p-6 ${idx !== earnings.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-slate-50 transition-colors`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs text-center">
                        #{tx.id.substring(0, 4)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{tx.user?.full_name || 'Pembayaran Sesi'}</p>
                        <p className="text-xs text-slate-400">
                          {tx.ended_at
                            ? new Date(tx.ended_at).toLocaleDateString('id-ID', { dateStyle: 'long' })
                            : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900 mb-1">Rp {(tx.total_cost || 0).toLocaleString('id-ID')}</p>
                       <span className="text-[10px] px-2 py-0.5 rounded-full bg-sea-green/20 text-cerulean font-bold uppercase tracking-wider">Berhasil</span>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </main>

      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -ml-32 -mt-32" />
    </div>
  )
}
