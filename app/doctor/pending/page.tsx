'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Stethoscope, LogOut, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DoctorPendingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check verification status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: doctorProfile } = await supabase
        .from('doctor_profiles')
        .select('is_verified')
        .eq('user_id', user.id)
        .single()

      if (doctorProfile?.is_verified) {
        router.push('/doctor/dashboard')
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [supabase, router])

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card rounded-3xl p-8 text-center">
          {/* Animated icon */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lavender to-green flex items-center justify-center mx-auto mb-6"
          >
            <Clock className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold mb-2">Menunggu Verifikasi</h1>
          <p className="text-foreground/60 mb-8">
            Akun dokter Anda sedang dalam proses verifikasi oleh admin. 
            Kami akan mengirimkan notifikasi setelah akun Anda disetujui.
          </p>

          {/* Status steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 glass rounded-xl">
              <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green" />
              </div>
              <div className="text-left">
                <p className="font-medium">Pendaftaran Berhasil</p>
                <p className="text-sm text-foreground/60">Akun Anda telah terdaftar</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 glass rounded-xl border-2 border-lavender">
              <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-5 h-5 text-lavender" />
                </motion.div>
              </div>
              <div className="text-left">
                <p className="font-medium text-lavender">Verifikasi Admin</p>
                <p className="text-sm text-foreground/60">Sedang diproses...</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 glass rounded-xl opacity-50">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-foreground/40" />
              </div>
              <div className="text-left">
                <p className="font-medium">Mulai Konsultasi</p>
                <p className="text-sm text-foreground/60">Segera tersedia</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={loading}
            className="w-full h-12 rounded-xl"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Keluar
          </Button>
        </Card>

        <p className="text-center text-sm text-foreground/50 mt-6">
          Halaman ini akan otomatis diperbarui saat akun terverifikasi
        </p>
      </motion.div>
    </div>
  )
}
