'use client'

import { useMemo } from 'react'
import { useUserContext } from '@/components/providers/Providers'

export function usePregnancyData() {
  const context = useUserContext()
  const memoizedUser = useMemo(() => (context.profile ? { id: context.profile.id } : null), [context.profile?.id])

  return useMemo(() => ({ 
    ...context,
    user: memoizedUser
  }), [context, memoizedUser])
}
