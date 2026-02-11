'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PersonalInfoStep } from './PersonalInfoStep'
import { ProfessionalInfoStep } from './ProfessionalInfoStep'
import { StepIndicator } from './StepIndicator'
import { DoctorRegistrationFormData } from '@/types/doctor'
import { createDoctorProfile } from '@/lib/doctorRegistrationService'
import { updateUserRole } from '@/lib/userRoleService'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface DoctorRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DoctorRegistrationModal({ isOpen, onClose }: DoctorRegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
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
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!formData.specialization || !formData.licenseNumber || !formData.hourlyRate) {
      toast({ title: 'Mohon lengkapi data wajib', variant: 'destructive' })
      return
    }

    if (!formData.acceptTerms) {
      toast({ title: 'Mohon setujui syarat & ketentuan', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      console.log('--- HandleSubmit Tracing Start ---')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('Submit Error: Auth User NOT found')
        throw new Error('User not found. Silakan login kembali.')
      }
      console.log('User detected:', user.id)

      // 1. Create Profile
      console.log('Calling createDoctorProfile...')
      await createDoctorProfile(user.id, formData)
      console.log('Profile created/verified successfully')

      // 2. Update Role
      console.log('Calling updateUserRole...')
      await updateUserRole(user.id, 'doctor')
      console.log('User role updated successfully')

      toast({ title: 'Pendaftaran Berhasil!', description: 'Selamat datang, Dokter.' })
      
      console.log('Redirecting to dashboard...')
      onClose()
      // Use router for SPA transition if possible, fallback to href
      router.push('/dashboard/doctor')
      setTimeout(() => {
        window.location.href = '/dashboard/doctor'
      }, 500)
      
    } catch (error: any) {
      // Direct log for best visibility in console
      console.log('--- Registration Error Details Start ---')
      // Safely serialize error for console
      const serializedError = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
      console.error(serializedError)
      console.log('--- Registration Error Details End ---')
      
      let errorMessage = error?.message || 'Terjadi kesalahan sistem.'
      
      // Safer check for duplicate key error
      const isDuplicateKey = error?.code === '23505' || 
                            (errorMessage && typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('duplicate key')) ||
                            error?.status === 409;

      if (isDuplicateKey) {
        errorMessage = 'Anda sudah terdaftar sebagai dokter.'
      }

      toast({ 
        title: 'Gagal Mendaftar', 
        description: errorMessage, 
        variant: 'destructive' 
      })

      if (isDuplicateKey) {
        setTimeout(() => {
          onClose()
          window.location.href = '/dashboard/doctor'
        }, 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] flex flex-col p-0 rounded-[2rem] border-none shadow-2xl overflow-hidden">
        <div className="p-8 pb-0 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-center tracking-tight text-slate-900">Daftar Jadi Dokter</DialogTitle>
            <DialogDescription className="text-center font-medium text-slate-500 mt-2">
              Bergabunglah dengan tim medis profesional kami
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8">
            <StepIndicator currentStep={step} totalSteps={2} />
          </div>
        </div>

        <div className="px-8 py-6 flex-1 overflow-y-auto">
          <div>
            {step === 1 && <PersonalInfoStep formData={formData} setFormData={setFormData} />}
            {step === 2 && <ProfessionalInfoStep formData={formData} setFormData={setFormData} />}
          </div>
        </div>

        <div className="p-8 pt-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center gap-4 shrink-0">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
              Kembali
            </Button>
          ) : (
            <div /> // Spacer
          )}

          {step < 2 ? (
            <Button 
              onClick={() => setStep(step + 1)} 
              className={`bg-blue-600 hover:bg-blue-700 ${(!formData.fullName || !formData.phone) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!formData.fullName || !formData.phone}
            >
              Lanjut
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
