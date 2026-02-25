'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PersonalInfoStep } from './PersonalInfoStep'
import { ProfessionalInfoStep } from './ProfessionalInfoStep'
import { StepIndicator } from './StepIndicator'
import { DoctorRegistrationFormData } from '@/types/doctor'
import { submitDoctorRegistration } from '@/services/doctorRegistrationService'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DoctorRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DoctorRegistrationModal({ isOpen, onClose }: DoctorRegistrationModalProps) {
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

  const handleSubmit = async () => {
    if (!formData.specialization || !formData.licenseNumber || !formData.hourlyRate) {
      toast({ title: 'Mohon lengkapi data wajib', variant: 'destructive' })
      return
    }

    if (!formData.acceptTerms) {
      toast({ title: 'Mohon setujui syarat & ketentuan', variant: 'destructive' })
      return
    }

    if (!user) {
      toast({ title: 'Sesi habis', description: 'Silakan login kembali.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      // Submit registration (role stays 'user' until admin approves)
      await submitDoctorRegistration(user.id, formData)
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

  const handleClose = () => {
    // Reset state when closing
    setStep(1)
    setSubmitted(false)
    setFormData({
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
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg w-full h-[700px] max-h-[90vh] flex flex-col p-0 rounded-[2rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        {!submitted ? (
          <>
            {/* 1. Header (Static/Fixed) */}
            <div className="p-8 pb-4 shrink-0 border-b border-slate-50 dark:border-white/5 bg-white dark:bg-slate-900 z-10 transition-colors">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black text-center tracking-tight text-slate-900 dark:text-white transition-colors">Daftar Jadi Dokter</DialogTitle>
                <DialogDescription className="text-center font-medium text-slate-500 dark:text-slate-400 mt-2 transition-colors">
                  Bergabunglah dengan tim medis profesional kami
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8">
                <StepIndicator currentStep={step} totalSteps={2} />
              </div>
            </div>

            {/* 2. Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-slate-900 custom-scrollbar transition-colors">
              <div className="px-8 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 1 && <PersonalInfoStep formData={formData} setFormData={setFormData} />}
                    {step === 2 && <ProfessionalInfoStep formData={formData} setFormData={setFormData} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* 3. Footer (Static/Fixed) */}
            <div className="p-8 pt-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row justify-end items-center gap-3 shrink-0 z-10 transition-colors">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => setStep(step - 1)} 
                  disabled={loading}
                  className="w-full sm:w-auto order-2 sm:order-1 h-12 rounded-xl font-bold border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition-colors"
                >
                  Kembali
                </Button>
              )}

              {step < 2 ? (
                <Button 
                  onClick={() => setStep(step + 1)} 
                  className={`h-12 px-8 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold w-full sm:w-auto order-1 sm:order-2 transition-all ${(!formData.fullName || !formData.phone) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!formData.fullName || !formData.phone}
                >
                  Lanjut
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="h-12 px-8 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto order-1 sm:order-2 shadow-lg shadow-green-200 dark:shadow-none transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Memproses...
                    </>
                  ) : 'Daftar Sekarang'}
                </Button>
              )}
            </div>
          </>
        ) : (
          /* ✅ SUCCESS STATE */
          <div className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-slate-900 transition-colors">
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200 dark:shadow-none"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 transition-colors">Pendaftaran Berhasil Dikirim! 🎉</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 max-w-sm mx-auto transition-colors">
                  Terima kasih telah mendaftar sebagai dokter di GENTING. Tim kami akan mereview aplikasi Anda.
                </p>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 mb-6 transition-colors">
                  <div className="flex items-center gap-3 justify-center">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                      Estimasi review: 1-3 hari kerja
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 text-left space-y-2 transition-colors">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Apa yang terjadi selanjutnya?</p>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-doccure-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-black text-doccure-teal">1</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Tim admin mereview data dan dokumen Anda</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-doccure-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-black text-doccure-teal">2</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Jika disetujui, akun Anda otomatis menjadi akun Dokter</p>
                  </div>
                </div>

                <Button onClick={handleClose} className="w-full rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 h-12 text-sm font-bold text-white dark:text-slate-900 transition-colors">
                  Mengerti, Tutup
                </Button>
              </motion.div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
