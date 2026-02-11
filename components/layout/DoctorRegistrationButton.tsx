'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DoctorRegistrationModal } from '@/components/doctor/registration/DoctorRegistrationModal'
import { Stethoscope } from 'lucide-react'

export interface DoctorRegistrationButtonProps {
  userRole?: string | null
  isLoggedIn: boolean
}

export function DoctorRegistrationButton({ userRole, isLoggedIn }: DoctorRegistrationButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Don't show if user is already a doctor or not logged in
  if (!isLoggedIn || userRole === 'doctor' || userRole === 'admin') {
    return null
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-cerulean to-sea-green hover:from-cerulean/90 hover:to-sea-green/90 text-white shadow-lg shadow-cerulean/20 rounded-full px-6 transition-all duration-300 transform hover:-translate-y-0.5"
        size="sm"
      >
        <Stethoscope size={16} className="mr-2" />
        <span className="font-semibold">Jadi Dokter</span>
      </Button>

      <DoctorRegistrationModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}
