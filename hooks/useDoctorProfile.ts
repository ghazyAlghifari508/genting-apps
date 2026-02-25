'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getDoctorByUserId } from '@/services/doctorService'
import type { Doctor } from '@/types/doctor'

export function useDoctorProfile() {
  const { user, loading: authLoading } = useAuth()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }

    const load = async () => {
      try {
        const data = await getDoctorByUserId(user.id)
        setDoctor(data)
      } catch (error) {
        console.error('Failed to load doctor profile:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user, authLoading])

  return { doctor, loading, setDoctor }
}
