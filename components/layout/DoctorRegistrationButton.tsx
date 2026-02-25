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
        className="bg-doccure-yellow hover:bg-[#cbe33a] text-doccure-dark shadow-lg shadow-doccure-yellow/20 rounded-full px-6 transition-all duration-300 transform hover:-translate-y-0.5 font-bold"
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
