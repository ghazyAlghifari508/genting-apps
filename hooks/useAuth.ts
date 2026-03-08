'use client'

import { useAuthContext } from '@/components/providers/Providers'

export function useAuth() {
  const { user, session, loading, signOut } = useAuthContext()

  return {
    user,
    session,
    loading,
    signOut,
  }
}
