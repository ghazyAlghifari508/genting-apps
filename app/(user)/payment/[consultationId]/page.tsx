'use client'

import { useEffect, useState } from 'react'
import { getConsultationById, updateConsultation } from '@/services/consultationService'
import { useParams, useRouter } from 'next/navigation'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import NextImage from 'next/image'
import Link from 'next/link'
import type { Consultation } from '@/types/consultation'
import { ArrowLeft, CheckCircle, Stethoscope, Calendar, Clock, CreditCard, ShieldCheck, Loader2, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/components/ui/use-toast'
import { Card } from '@/components/ui/card'

export default function PaymentPage() {
  const { consultationId } = useParams()
  const router = useRouter()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSnapLoaded, setIsSnapLoaded] = useState(false)
  const { toast } = useToast()

  // Use staging/production Midtrans Client Key based on env
  const snapScriptSrc = "https://app.sandbox.midtrans.com/snap/snap.js"
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY

  useEffect(() => {
    const loadConsultation = async () => {
      try {
        const data = await getConsultationById(consultationId as string)
        setConsultation(data)
      } catch (error) {
        console.error('Error loading consultation:', error)
      } finally {
        setLoading(false)
      }
    }

    if (consultationId) {
      loadConsultation()
    }
  }, [consultationId])

  const handlePayment = async () => {
    if (!consultation) return
    
    setProcessing(true)
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultation_id: consultation.id })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat transaksi pembayaran')
      }

      if (!(window as any).snap) {
        throw new Error('Midtrans Snap tidak termuat dengan benar')
      }

      (window as any).snap.pay(data.token, {
        onSuccess: async (result: any) => {
          console.log('Payment success:', result)
          setShowSuccess(true)
          await updateConsultation(consultation.id, { 
            status: 'scheduled',
            payment_status: 'confirmed',
            payment_reference: result.order_id || data.order_id
          })
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result)
          toast({
            title: 'Pembayaran Tertunda',
            description: 'Silakan selesaikan pembayaran sesuai instruksi di popup Midtrans.',
          })
        },
        onError: (result: any) => {
          console.error('Payment error:', result)
          toast({
            title: 'Pembayaran Gagal',
            description: 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.',
            variant: 'destructive'
          })
        },
        onClose: () => {
          console.log('Payment popup closed')
        }
      })
    } catch (error: any) {
      console.error('Payment process error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan sistem. Silakan coba lagi.',
        variant: 'destructive'
      })
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <section className="w-full pt-8 mb-6 border-b border-slate-100 pb-6">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-8 w-64 rounded-xl" />
                <Skeleton className="h-4 w-48 rounded-full mt-2" />
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48 rounded-md mb-4" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-48 rounded-md mb-4" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    )
  }
  if (!consultation) return <div className="p-8 text-center text-slate-500">Konsultasi tidak ditemukan</div>

  // Success state will be rendered via modal component below

  return (
    <>
      <Script
        src={snapScriptSrc}
        data-client-key={clientKey}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[PaymentPage] Midtrans Snap loaded')
          setIsSnapLoaded(true)
        }}
        onError={() => {
          console.error('[PaymentPage] Midtrans Snap failed to load')
          toast({
            title: 'Gagal Memuat Pembayaran',
            description: 'Sistem pembayaran gagal dimuat. Silakan muat ulang halaman.',
            variant: 'destructive',
          })
        }}
      />

      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header Navigation */}
        <section className="bg-white border-b border-slate-200 py-4 sticky top-0 z-30">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="h-10 w-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Konfirmasi Pembayaran</h1>
          </div>
        </section>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Doctor Info Card */}
              <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-doccure-teal" />
                  Detail Konsultasi
                </h2>
                
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-6">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-doccure-teal to-doccure-dark">
                    {consultation.doctor?.profile_picture_url ? (
                      <NextImage src={consultation.doctor.profile_picture_url} alt={consultation.doctor.full_name || 'Doctor'} fill unoptimized className="object-cover" />
                    ) : (
                      <Stethoscope className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{consultation.doctor?.full_name}</p>
                    <p className="text-xs font-semibold text-doccure-teal">{consultation.doctor?.specialization}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5 p-4 border border-slate-100 rounded-2xl bg-white">
                    <label className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-doccure-teal" />
                      Tanggal
                    </label>
                    <p className="text-sm font-bold text-slate-700">
                        {new Date(consultation.scheduled_at).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                    </p>
                  </div>
                  <div className="space-y-1.5 p-4 border border-slate-100 rounded-2xl bg-white">
                    <label className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-doccure-teal" />
                      Waktu
                    </label>
                    <p className="text-sm font-bold text-slate-700">
                        {new Date(consultation.scheduled_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} WIB
                    </p>
                  </div>
                </div>
              </Card>

              {/* Secure Payment Notice */}
              <div className="mt-4 inline-flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-[11px] font-medium text-blue-800 shadow-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 text-xs text-left">Pembayaran Aman & Terenkripsi</h4>
                  <p className="leading-relaxed mt-0.5 opacity-80 text-left">
                    Genting+ bekerja sama dengan Midtrans untuk memastikan semua transaksi diproses secara aman. Data kartu atau akun bank Bunda tidak akan disimpan di server kami.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl border border-slate-100/80 bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.06)] p-6 sticky top-24">
                <h2 className="text-base font-bold text-slate-900 mb-4 items-center gap-2 flex">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-left">Biaya Konsultasi</span>
                    <span className="font-semibold text-slate-900">Rp {(consultation.hourly_rate || 0).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-left">Biaya Layanan</span>
                    <span className="font-semibold text-slate-900">Rp {5000 /* Hardcoded fallback */}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 text-left">Total Pembayaran</p>
                  <p className="mt-1.5 text-2xl font-bold text-slate-900 text-left">
                    Rp {(consultation.total_cost || 0).toLocaleString('id-ID')}
                  </p>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={processing || !isSnapLoaded}
                  className="h-12 w-full rounded-xl bg-doccure-teal text-sm font-bold text-white hover:bg-doccure-dark shadow-md shadow-doccure-teal/15 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    'Memproses...'
                  ) : (
                    <>
                      Bayar Sekarang
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed">
                  Dengan mengklik tombol di atas, Bunda menyetujui <Link href="/terms" className="underline hover:text-slate-600">Syarat & Ketentuan</Link> Genting+
                </p>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-white rounded-[2rem] p-8">
          <DialogHeader className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 mb-2">Pembayaran Berhasil!</DialogTitle>
            <p className="text-slate-500">
              Jadwal konsultasi Bunda telah dikonfirmasi. Bunda dapat melihat detailnya di halaman Konsultasi Anda.
            </p>
          </DialogHeader>
          <div className="mt-8 flex flex-col gap-3">
            <Button 
              onClick={() => router.push('/konsultasi-dokter')}
              className="h-12 rounded-xl bg-doccure-teal hover:bg-teal-600 text-white font-bold"
            >
              Lihat Konsultasi Saya
            </Button>
            <Button 
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="text-slate-500 font-bold"
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
