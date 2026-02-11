'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserRole } from '@/lib/userRoleService'

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const fetchRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          if (mounted) { setRole(null); setLoading(false) }
          return
        }

        // Try getting role from metadata first (faster)
        // const metaRole = user.user_metadata?.role
        // if (metaRole) {
        //   if (mounted) setRole(metaRole)
        // }

        // Fetch from DB to be sure
        const dbRole = await getUserRole(user.id)
        if (mounted) {
          setRole(dbRole)
          setLoading(false)
        }
      } catch (error) {
        // Silently handle error
        if (mounted) setLoading(false)
      }
    }

    fetchRole()

    return () => { mounted = false }
  }, [supabase])

  return { role, loading }
}
