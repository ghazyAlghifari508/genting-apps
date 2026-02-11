'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, Stethoscope, LogOut } from 'lucide-react'

export default function DoctorPendingPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from('doctors').select('is_verified').eq('user_id', user.id).single()
      if (data?.is_verified) router.push('/dashboard/doctor')
    }

    check()
    const interval = setInterval(check, 10000)
    return () => clearInterval(interval)
  }, [supabase, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="rounded-3xl p-8 text-center border-0 shadow-lg bg-white">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6"
          >
            <Clock className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold mb-2">Menunggu Verifikasi</h1>
          <p className="text-slate-500 mb-8 text-sm">
            Akun dokter Anda sedang diverifikasi oleh admin. Kami akan memberitahu setelah akun disetujui.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { icon: CheckCircle, label: 'Pendaftaran Berhasil', desc: 'Akun telah terdaftar', active: false, done: true },
              { icon: Clock, label: 'Verifikasi Admin', desc: 'Sedang diproses...', active: true, done: false },
              { icon: Stethoscope, label: 'Mulai Konsultasi', desc: 'Segera tersedia', active: false, done: false },
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${step.active ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50'} ${!step.done && !step.active ? 'opacity-50' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.done ? 'bg-green-100' : step.active ? 'bg-blue-100' : 'bg-slate-200'}`}>
                  <step.icon className={`w-5 h-5 ${step.done ? 'text-green-600' : step.active ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-bold text-sm ${step.active ? 'text-blue-600' : ''}`}>{step.label}</p>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            variant="outline"
            className="w-full h-12 rounded-xl"
          >
            <LogOut className="w-5 h-5 mr-2" /> Keluar
          </Button>
        </Card>
        <p className="text-center text-xs text-slate-400 mt-4">Halaman ini otomatis refresh saat terverifikasi</p>
      </motion.div>
    </div>
  )
}
