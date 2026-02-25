'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'

export function useUserRole() {
  const { user, loading: authLoading } = useAuth()
  const [dbRole, setDbRole] = useState<{ userId: string; role: string } | null>(null)

  // Depend on user?.id (stable primitive) instead of the entire user object.
  // This is critical: if we use `user` as a dependency, every TOKEN_REFRESHED
  // event creates a new object reference and triggers an unnecessary DB fetch.
  const userId = user?.id

  useEffect(() => {
    if (authLoading || !userId) return

    // Already fetched role for this exact user – skip
    if (dbRole?.userId === userId) return

    let mounted = true

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (data && !error) {
        if (mounted) setDbRole({ userId, role: data.role })
        return
      }

      // Fallback to metadata
      const metadataRole = user?.user_metadata?.role
      if (mounted) {
        setDbRole({
          userId,
          role: typeof metadataRole === 'string' ? metadataRole : 'user',
        })
      }
    }

    fetchRole()

    return () => {
      mounted = false
    }
  }, [userId, authLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  const role = user
    ? dbRole?.userId === user.id
      ? dbRole.role
      : typeof user.user_metadata?.role === 'string'
        ? user.user_metadata.role
        : 'user'
    : null

  const loading = authLoading || (!!user && dbRole?.userId !== user.id)

  return { role, loading }
}
