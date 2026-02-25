'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Stethoscope,
  Check,
  Loader2,
  Search,
  FileText,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPendingDoctors, approveDoctor, rejectDoctor } from '@/services/adminService'
import Image from 'next/image'
import { AdminTopHeader } from '@/components/admin/AdminTopHeader'

interface DoctorRegistration {
  id: string
  user_id: string
  full_name: string
  phone: string | null
  bio: string | null
  specialization: string
  license_number: string
  certification_url: string | null
  years_of_experience: number | null
  hourly_rate: number
  status: string
  submitted_at: string
  profile_photo_url: string | null
  users?: {
    avatar_url?: string | null
  }
}

export default function DoctorApprovalsPage() {
  const [doctors, setDoctors] = useState<DoctorRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ id: string; userId: string } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      const data = await fetchPendingDoctors()
      setDoctors(data)
    } catch (error) {
      console.error('Error loading doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (doctorId: string) => {
    if (processingId) return
    try {
      setProcessingId(doctorId)
      await approveDoctor(doctorId)
      setDoctors((prev) => prev.filter((d) => d.id !== doctorId))
    } catch (error) {
      console.error('Error approving doctor:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async () => {
    if (!rejectModal || processingId) return
    try {
      setProcessingId(rejectModal.id)
      await rejectDoctor(rejectModal.id, rejectModal.userId, rejectReason)
      setDoctors((prev) => prev.filter((d) => d.id !== rejectModal.id))
      setRejectModal(null)
      setRejectReason('')
    } catch (error) {
      console.error('Error rejecting doctor:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const filteredDoctors = doctors.filter(
    (d) =>
      d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.license_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-white dark:bg-slate-900 transition-colors">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <Skeleton className="h-10 w-full sm:max-w-md rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-xl" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm flex items-center justify-between transition-colors">
               <div className="flex items-center gap-4">
                 <Skeleton className="w-14 h-14 rounded-2xl" />
                 <div className="space-y-2">
                   <Skeleton className="h-5 w-40" />
                   <Skeleton className="h-4 w-56" />
                   <Skeleton className="h-3 w-32" />
                 </div>
               </div>
               <div className="space-y-2">
                 <Skeleton className="h-8 w-24 rounded-xl" />
                 <Skeleton className="h-8 w-24 rounded-xl" />
               </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <AdminTopHeader title="Doctor Approvals" showSearch={false} />

      <div className="mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Verifikasi pendaftaran dokter baru</p>
      </div>

      <div className="space-y-4">
        {/* Search & Pending Count */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari nama, spesialisasi, atau STR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 transition-all font-medium transition-all transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 w-full sm:w-auto shrink-0 justify-center transition-colors">
            <div className="w-2 h-2 rounded-full bg-doccure-yellow animate-pulse" />
            <span className="font-bold text-slate-600 dark:text-slate-300 transition-colors">
              {filteredDoctors.length} Menunggu Verifikasi
            </span>
          </div>
        </div>

        {/* Doctor Cards */}
        {filteredDoctors.length === 0 ? (
          <Card className="p-12 rounded-2xl border-0 shadow-sm bg-white dark:bg-slate-800 text-center mt-6 transition-colors transition-colors">
            <Check className="w-12 h-12 text-medical-green mx-auto mb-4" />
            <p className="font-bold text-slate-800 dark:text-white text-lg transition-colors">Semua Terverifikasi!</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Tidak ada dokter yang menunggu verifikasi saat ini.</p>
          </Card>
        ) : (
          <div className="space-y-4 mt-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow group transition-colors transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-doccure-teal/10 dark:bg-doccure-teal/20 flex items-center justify-center shrink-0 overflow-hidden relative transition-colors transition-colors">
                         {doctor.users?.avatar_url ? (
                           <Image src={doctor.users.avatar_url} alt={doctor.full_name} fill className="object-cover" unoptimized/>
                         ) : (
                           <Stethoscope className="w-7 h-7 text-doccure-teal" />
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-base transition-colors">{doctor.full_name}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-doccure-teal/10 dark:bg-doccure-teal/20 text-doccure-teal uppercase tracking-wider transition-colors">
                            {doctor.specialization}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors" />
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">STR: {doctor.license_number}</span>
                          {doctor.years_of_experience && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors" />
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">{doctor.years_of_experience} thn peng.</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-slate-500 transition-colors">
                          <span className="font-medium">Dikirim: {new Date(doctor.submitted_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                          {doctor.certification_url && (
                            <a
                              href={doctor.certification_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-doccure-teal hover:text-[#0f605c] font-bold transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              Lihat Dokumen
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:w-32 shrink-0">
                      <Button
                        onClick={() => handleApprove(doctor.id)}
                        disabled={processingId === doctor.id}
                        size="sm"
                        className="rounded-xl w-full bg-doccure-teal hover:bg-[#0f605c] text-white font-bold transition-colors"
                      >
                        {processingId === doctor.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                          <Check className="w-4 h-4 mr-1" />
                        )}
                        Terima
                      </Button>
                      <Button
                        onClick={() => setRejectModal({ id: doctor.id, userId: doctor.user_id })}
                        disabled={processingId === doctor.id}
                        variant="outline"
                        size="sm"
                        className="rounded-xl w-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-grapefruit/10 hover:text-grapefruit hover:border-grapefruit/20 font-bold transition-colors"
                      >
                        Tolak
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative bg-white dark:bg-slate-800 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl transition-colors"
            >
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2 transition-colors">Tolak Pendaftaran</h3>
              <p className="text-sm border-l-2 pl-3 border-doccure-yellow text-slate-600 dark:text-slate-400 mb-4 font-medium transition-colors">
                Berikan alasan mengapa pendaftaran dokter ini ditolak (Opsional):
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Dokumen STR tidak valid, foto tidak jelas..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-grapefruit/30 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium transition-colors"
              />
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setRejectModal(null)} className="flex-1 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Batal
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={processingId !== null}
                  className="flex-1 rounded-xl bg-grapefruit hover:bg-red-600 text-white font-bold shadow-lg shadow-grapefruit/20 transition-colors"
                >
                  {processingId ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Tolak
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
