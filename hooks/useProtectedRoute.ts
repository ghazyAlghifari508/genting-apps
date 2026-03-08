'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/hooks/useUserRole'

export function useProtectedRoute(allowedRoles: string[]) {
  const { role, loading, dbLoading } = useUserRole()
  const router = useRouter()
  const allowedRolesKey = useMemo(() => allowedRoles.join('|'), [allowedRoles])

  useEffect(() => {
    if (loading) return

    if (!role) {
      router.push('/login')
      return
    }

    const allowed = allowedRolesKey.split('|').filter(Boolean)
    const isAllowed = allowed.includes(role)

    // Critical Fix: Redirect only if we are unauthorized AND the database check is finished.
    // This handles the case where metadata might be stale/incorrect (preventing loops)
    // while still allowing immediate hydration if metadata is correct (preventing flickers).
    if (!isAllowed && !dbLoading) {
      // Redirect to appropriate dashboard if role is not allowed
      if (role === 'doctor') router.push('/doctor')
      else if (role === 'admin') router.push('/admin/dashboard')
      else router.push('/')
    }
  }, [role, loading, dbLoading, router, allowedRolesKey])

  return { role, loading }
}
