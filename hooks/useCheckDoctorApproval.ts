'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'

/**
 * Hook that checks if the current user has a pending approval notification.
 * If `profiles.show_approval_msg` is true, redirect to the approval page.
 * Used in the doctor dashboard layout to catch newly approved doctors.
 */
export function useCheckDoctorApproval() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || !user) return
    if (checkedUserId === user.id) return

    // Session Guard: If user dismissed approval msg in this session, don't check/redirect
    if (typeof window !== 'undefined' && sessionStorage.getItem('dismissed_approval_msg')) {
      setCheckedUserId(user.id)
      return
    }

    let mounted = true

    const checkFlag = async () => {
      try {
        // Force fetch fresh data
        const { data, error } = await supabase
          .from('profiles')
          .select('show_approval_msg')
          .eq('id', user.id)
          .single()

        if (!error && data?.show_approval_msg === true) {
          // Check if we are already on the approval page to prevent loop
          if (window.location.pathname === '/onboarding/doctor-approved') {
            if (mounted) setCheckedUserId(user.id)
            return
          }

          router.replace('/onboarding/doctor-approved')
        } else {
          if (mounted) setCheckedUserId(user.id)
        }
      } catch (err) {
        console.error('[useCheckDoctorApproval] Error:', err)
        if (mounted) setCheckedUserId(user.id)
      }
    }

    checkFlag()

    return () => {
      mounted = false
    }
  }, [user, authLoading, router, checkedUserId])

  const checking = authLoading || (!!user && checkedUserId !== user.id)
  return { checking }
}
