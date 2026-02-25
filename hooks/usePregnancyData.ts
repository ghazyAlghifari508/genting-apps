'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserProfile } from '@/services/userService'
import { UserProfile } from '@/types/education'
import { calculatePregnancyWeek, calculateTrimester } from '@/lib/date-utils'

export function usePregnancyData() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Stable primitive dependency to avoid re-fetching when TOKEN_REFRESHED
  // creates a new user object reference with the same ID.
  const userId = user?.id

  useEffect(() => {
    if (authLoading) return

    if (!userId) {
      setProfileLoading(false)
      return
    }

    // If we already loaded for this user, skip
    if (profile && (profile as UserProfile & { _userId?: string })._userId === userId) {
      setProfileLoading(false)
      return
    }

    async function loadData() {
      setProfileLoading(true)
      try {
        const data = await getUserProfile(userId!)
        if (data) {
          if (!data.pregnancy_week && data.pregnancy_start_date) {
            data.pregnancy_week = calculatePregnancyWeek(data.pregnancy_start_date)
          }
          // Tag the profile with the userId so we can detect stale data
          ;(data as UserProfile & { _userId?: string })._userId = userId
          setProfile(data)
        }
      } catch (err) {
        console.error('Error loading pregnancy data:', err)
        setError('Gagal memuat data profil.')
      } finally {
        setProfileLoading(false)
      }
    }

    loadData()
  }, [userId, authLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  const weekNumber = profile?.pregnancy_week || 0
  const trimester = profile?.trimester || calculateTrimester(weekNumber)

  return { 
    profile, 
    loading: authLoading || profileLoading, 
    error,
    weekNumber,
    trimester,
    user
  }
}
