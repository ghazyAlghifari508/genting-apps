'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/paymentService'
import { ArrowLeft, CheckCircle, Stethoscope, Calendar, Clock, CreditCard } from 'lucide-react'
import Link from 'next/link'
import type { Consultation } from '@/types/consultation'

export default function PaymentPage() {
  const { consultationId } = useParams<{ consultationId: string }>()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [method, setMethod] = useState<PaymentMethod>('e_wallet')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [payRef, setPayRef] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('consultations')
        .select('*, doctor:doctor_id(full_name, specialization)')
        .eq('id', consultationId)
        .single()

      if (data) setConsultation(data)
      setLoading(false)
    }
    load()
  }, [consultationId, supabase])

  const handleConfirm = async () => {
    if (!agreed || !consultation) return
    setProcessing(true)

    // Dummy payment: simulate 1.5s delay
    await new Promise((r) => setTimeout(r, 1500))

    const ref = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    await supabase.from('consultations').update({
      payment_status: 'confirmed',
      payment_method: method,
      payment_reference: ref,
      payment_date: new Date().toISOString(),
    }).eq('id', consultationId)

    setPayRef(ref)
    setSuccess(true)
    setProcessing(false)
  }

  if (loading) return <LoadingScreen message="Memuat pembayaran..." fullScreen />
  if (!consultation) return <div className="p-8 text-center text-slate-500">Konsultasi tidak ditemukan</div>

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <Card className="p-8 rounded-3xl border-0 shadow-lg bg-white text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-sm text-slate-500 mb-1">Ref: {payRef}</p>
            <p className="text-sm text-slate-500 mb-6">
              Konsultasi dijadwalkan pada {new Date(consultation.scheduled_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
            <div className="space-y-2">
              <Link href={`/consultations/${consultation.id}`}>
                <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 font-bold">Lihat Konsultasi</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full rounded-xl font-bold">Kembali ke Dashboard</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-8">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-lg font-black text-slate-900">Konfirmasi Pembayaran</h1>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Summary */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <h3 className="font-bold text-slate-900 mb-3">Ringkasan Konsultasi</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><Stethoscope size={14} /> Dokter</span>
              <span className="font-bold text-slate-900">{(consultation as any).doctor?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><Calendar size={14} /> Jadwal</span>
              <span>{new Date(consultation.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><Clock size={14} /> Durasi</span>
              <span>{consultation.duration_minutes} menit</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-slate-900 text-base">
              <span>Total</span>
              <span>Rp {(consultation.total_cost || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm bg-white">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-1"><CreditCard size={16} /> Metode Pembayaran</h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((pm) => (
              <label key={pm.value} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${method === pm.value ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'}`}>
                <input type="radio" name="payment" value={pm.value} checked={method === pm.value} onChange={() => setMethod(pm.value)} className="hidden" />
                <span className="text-lg">{pm.icon}</span>
                <span className="font-bold text-sm text-slate-700">{pm.label}</span>
                {method === pm.value && <CheckCircle size={16} className="ml-auto text-blue-500" />}
              </label>
            ))}
          </div>
        </Card>

        {/* Terms */}
        <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 rounded" />
          <span className="text-xs text-slate-500">Saya menyetujui syarat dan ketentuan layanan konsultasi GENTING.</span>
        </label>

        <Button onClick={handleConfirm} disabled={!agreed || processing} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-base">
          {processing ? 'Memproses Pembayaran...' : `Bayar Rp ${(consultation.total_cost || 0).toLocaleString('id-ID')}`}
        </Button>
      </main>
    </div>
  )
}
