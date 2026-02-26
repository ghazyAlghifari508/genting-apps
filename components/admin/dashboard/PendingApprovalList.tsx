'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, Check, X, ShieldAlert } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPendingDoctors } from '@/services/adminService'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import NextImage from 'next/image'

interface DoctorRegistration {
  id: string
  user_id: string
  full_name: string
  specialization: string
  hospital_name: string
  profile_photo_url: string | null
  status: string
}

export function PendingApprovalList() {
  const [pendingDoctors, setPendingDoctors] = useState<DoctorRegistration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPendingDoctors() as DoctorRegistration[]
        // Take top 5 for dashboard
        setPendingDoctors(data?.slice(0, 5) || [])
      } catch (e) {
        console.error("Failed to load pending doctors", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-800 h-full transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Pending Approvals</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">Dokter menunggu verifikasi</p>
        </div>
        <Link href="/admin/approvals">
          <button className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </button>
        </Link>
      </div>

      {loading ? (
         <div className="space-y-4">
           {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-center gap-4">
               <Skeleton className="w-12 h-12 rounded-full" />
               <div className="space-y-2 flex-1">
                 <Skeleton className="h-4 w-32" />
                 <Skeleton className="h-3 w-24" />
               </div>
               <Skeleton className="h-8 w-20 rounded-full" />
             </div>
           ))}
         </div>
      ) : pendingDoctors.length === 0 ? (
        <div className="h-40 flex flex-col justify-center items-center text-slate-400">
           <ShieldAlert className="w-8 h-8 mb-2 opacity-20" />
           <p className="text-sm font-medium">Tidak ada dokter pending</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingDoctors.map((doc) => (
             <div key={doc.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm shrink-0 transition-colors relative">
                {doc.profile_photo_url ? (
                   <NextImage src={doc.profile_photo_url} alt={doc.full_name} fill className="object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-cerulean/10 dark:bg-cerulean/20 text-cerulean font-bold text-sm transition-colors">
                     {doc.full_name?.charAt(0) || 'D'}
                   </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-cerulean transition-colors">
                  {doc.full_name || 'Unnamed Doctor'}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">{doc.specialization}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors" />
                  <span className="text-xs text-slate-400 dark:text-slate-500 truncate transition-colors">{doc.hospital_name}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-doccure-teal hover:bg-doccure-teal/10 hover:text-doccure-teal">
                   <Check className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-grapefruit hover:bg-grapefruit/10 hover:text-grapefruit">
                   <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
