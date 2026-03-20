'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthContext } from '@/components/providers/Providers'
import { getOwnRegistration } from '@/services/doctorRegistrationService'

/**
 * Hook to check if a doctor has a pending approval message/redirect.
 * This is used in the doctor layout to catch newly approved doctors and send 
 * them to the "Welcome/Success" page once.
 */
export function useCheckDoctorApproval() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuthContext()
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null)
  const isChecking = useRef(false)
  const hasCheckedThisSession = useRef(false)

  useEffect(() => {
    // 1. Basic guards
    if (authLoading || !user || user.id === checkedUserId || isChecking.current) return
    
    // 2. Already on the target page: skip check to avoid recursion
    if (pathname === '/onboarding/doctor-approved') {
      setCheckedUserId(user.id)
      return
    }

    // 3. Session guard: only check once per browser session to prevent any loop
    const storageKey = `genting_approval_redirect_checked_${user.id}`
    if (typeof window !== 'undefined' && (sessionStorage.getItem(storageKey) === 'true' || hasCheckedThisSession.current)) {
      setCheckedUserId(user.id)
      return
    }

    const checkStatus = async () => {
      isChecking.current = true
      try {
        const registration = await getOwnRegistration()
        
        // Mark as checked to prevent re-triggers regardless of result
        hasCheckedThisSession.current = true
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(storageKey, 'true')
        }

        if (registration && registration.status === 'approved' && registration.show_approval_msg === true) {
          // Redirect the user. The target page MUST clear the 'show_approval_msg' flag in DB.
          router.replace('/onboarding/doctor-approved')
        } else {
          setCheckedUserId(user.id)
        }
      } catch (err) {
        console.error('[useCheckDoctorApproval] Error:', err)
        setCheckedUserId(user.id)
      } finally {
        isChecking.current = false
      }
    }

    checkStatus()
  }, [user, authLoading, pathname, router, checkedUserId])

  return { checking: authLoading || (!!user && checkedUserId !== user.id) }
}
