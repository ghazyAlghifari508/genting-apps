'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Doctor } from '@/types/doctor'

export function useDoctorProfile() {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setDoctor(data)
      setLoading(false)
    }

    load()
  }, [supabase])

  return { doctor, loading, setDoctor }
}
