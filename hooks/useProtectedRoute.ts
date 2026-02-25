'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole } from '@/hooks/useUserRole'

export function useProtectedRoute(allowedRoles: string[]) {
  const { role, loading } = useUserRole()
  const router = useRouter()
  const allowedRolesKey = useMemo(() => allowedRoles.join('|'), [allowedRoles])

  useEffect(() => {
    if (loading) return

    if (!role) {
      router.push('/login')
      return
    }

    const allowed = allowedRolesKey.split('|').filter(Boolean)
    if (!allowed.includes(role)) {
      // Redirect to appropriate dashboard if role is not allowed
      if (role === 'doctor') router.push('/doctor')
      else if (role === 'admin') router.push('/admin/dashboard')
      else router.push('/')
    }
  }, [role, loading, router, allowedRolesKey])

  return { role, loading }
}
