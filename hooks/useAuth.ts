'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  // Tracks whether we've ever finished the initial session check
  const initialized = useRef(false)

  useEffect(() => {
    // Initial session check – happens once on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      // Compare by ID to avoid creating a new object reference for the same user.
      // This is crucial: a new object reference causes all downstream hooks
      // (useUserRole, usePregnancyData, etc.) to re-run their useEffect, which
      // causes the "refresh on tab switch" symptom.
      setUser(prev =>
        prev?.id === (session?.user?.id ?? null) ? prev : (session?.user ?? null)
      )
      setLoading(false)
      initialized.current = true
    })

    // Auth state change listener – fires on login, logout, TOKEN_REFRESHED.
    // TOKEN_REFRESHED fires every time the browser tab regains focus.
    // We MUST NOT set loading back to true here – only update the user
    // if the ID actually changed (i.e. real login/logout, not just a refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(prev => {
        const newId = session?.user?.id ?? null
        const prevId = prev?.id ?? null
        // Same user – keep the same object reference to prevent re-renders
        if (prevId === newId) return prev
        return session?.user ?? null
      })
      // Only set loading=false, never flip it back to true
      if (!initialized.current) {
        setLoading(false)
        initialized.current = true
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return {
    user,
    session,
    loading,
    signOut,
  }
}
