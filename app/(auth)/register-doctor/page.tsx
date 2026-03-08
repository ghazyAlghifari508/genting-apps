'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PersonalInfoStep } from '@/components/doctor/registration/PersonalInfoStep'
import { ProfessionalInfoStep } from '@/components/doctor/registration/ProfessionalInfoStep'
import { StepIndicator } from '@/components/doctor/registration/StepIndicator'
import { DoctorRegistrationFormData } from '@/types/doctor'
import { submitDoctorRegistration } from '@/services/doctorRegistrationService'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, Clock, Loader2, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterDoctorPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<DoctorRegistrationFormData>({
    fullName: '',
    phone: '',
    bio: '',
    profilePicture: null,
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    hourlyRate: '',
    certification: null,
    acceptTerms: false
  })
  
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!formData.specialization || !formData.licenseNumber || !formData.hourlyRate) {
      toast({ title: 'Mohon lengkapi data wajib', variant: 'destructive' })
      return
    }

    if (!formData.acceptTerms) {
      toast({ title: 'Mohon setujui syarat & ketentuan', variant: 'destructive' })
      return
    }

    // Get the live session at submit time (avoids race condition with AuthContext init)
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
      toast({ 
        title: 'Sesi habis', 
        description: 'Silakan login terlebih dahulu sebagai user biasa.', 
        variant: 'destructive' 
      })
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      await submitDoctorRegistration(currentUser.id, formData)
      setSubmitted(true)

      toast({ 
        title: '🎉 Pendaftaran Terkirim!', 
        description: 'Tim kami akan mereview aplikasi Anda dalam 1-3 hari kerja.' 
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan sistem.'
      
      toast({ 
        title: 'Gagal Mendaftar', 
        description: errorMessage, 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]  flex flex-col items-center justify-center p-4 sm:p-6 transition-colors font-sans">
      {/* Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(15,104,86,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-doccure-teal/5 rounded-full blur-[100px] -mr-48 -mb-48" />
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-doccure-yellow/5 rounded-full blur-[80px] -ml-36" />
      </div>

      <div className="w-full max-w-2xl bg-white  rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)]  border border-slate-100  overflow-hidden transition-all">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="p-8 sm:p-10 pb-4 border-b border-slate-50  transition-colors">
              <div className="flex items-center justify-between mb-8">
                <Link 
                  href="/login" 
                  className="p-3 rounded-2xl bg-slate-50  text-slate-400  hover:text-doccure-teal hover:bg-doccure-teal/5 transition-all"
                >
                  <ArrowLeft size={20} />
                </Link>
                <div className="w-10" /> {/* Spacer */}
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900  tracking-tight transition-colors">
                  Daftar Jadi Dokter
                </h1>
                <p className="text-slate-500  font-medium transition-colors">
                  Bergabunglah dengan ekosistem medis Genting+
                </p>
              </div>

              <div className="mt-10 max-w-md mx-auto">
                <StepIndicator currentStep={step} totalSteps={2} />
              </div>
            </div>

            {/* Body */}
            <div className="px-8 sm:px-12 py-8 bg-white  transition-colors">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {step === 1 && <PersonalInfoStep formData={formData} setFormData={setFormData} />}
                  {step === 2 && <ProfessionalInfoStep formData={formData} setFormData={setFormData} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 bg-slate-50  border-t border-slate-100  flex flex-col sm:flex-row justify-between items-center gap-3 transition-colors">
              <div>
                <p className="text-[10px] font-black text-slate-400  uppercase tracking-[0.2em]">Step {step} of 2</p>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                {step > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(step - 1)} 
                    disabled={loading}
                    className="flex-1 sm:flex-none h-10 px-6 rounded-xl font-bold border-slate-200     transition-all hover:shadow-md"
                  >
                    Kembali
                  </Button>
                )}

                {step < 2 ? (
                  <Button 
                    onClick={() => setStep(step + 1)} 
                    disabled={!formData.fullName || !formData.phone}
                    className="flex-1 sm:flex-none h-10 px-8 rounded-xl bg-doccure-teal hover:bg-doccure-teal/90 text-white font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    Lanjut
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    className="flex-1 sm:flex-none h-10 px-8 rounded-xl bg-doccure-dark hover:bg-doccure-dark/90 text-white font-black shadow-md transition-all active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Memproses...
                      </>
                    ) : 'Kirim Pendaftaran'}
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="p-12 text-center bg-white  transition-colors">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-gradient-to-br from-doccure-dark to-doccure-teal flex items-center justify-center shadow-2xl shadow-doccure-dark/20 "
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-3xl font-black text-slate-900  mb-3 tracking-tight transition-colors">
              Pendaftaran Berhasil! 🎉
            </h2>
            <p className="text-slate-500  font-medium mb-8 max-w-sm mx-auto transition-colors">
              Tim medis Genting akan meninjau data Anda dalam waktu 1-3 hari kerja. Anda akan menerima notifikasi via email.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
              <div className="p-6 rounded-[1.5rem] bg-slate-50  border border-slate-100  transition-colors">
                <Clock className="w-6 h-6 text-amber-500 mb-3" />
                <h4 className="font-bold text-slate-900  text-sm mb-1">Status Review</h4>
                <p className="text-xs text-slate-500 ">Pendaftaran Anda sedang dalam antrean verifikasi.</p>
              </div>
              <div className="p-6 rounded-[1.5rem] bg-slate-50  border border-slate-100  transition-colors">
                <CheckCircle2 className="w-6 h-6 text-doccure-teal mb-3" />
                <h4 className="font-bold text-slate-900  text-sm mb-1">Langkah Terakhir</h4>
                <p className="text-xs text-slate-500 ">Akun Anda akan otomatis beralih ke fitur Dokter.</p>
              </div>
            </div>

            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full h-14 rounded-2xl bg-slate-900  text-white  font-black hover:opacity-90 transition-all"
            >
              Kembali ke Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
