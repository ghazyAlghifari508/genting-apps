'use client'

import { useMemo } from 'react'
import { useUserContext } from '@/components/providers/Providers'

export function usePregnancyData() {
  const { 
    profile, 
    loading, 
    error, 
    weekNumber, 
    trimester,
    roadmap,
    education,
    consultations,
    doctors,
    loadRoadmap,
    loadEducation,
    loadConsultations,
    loadDoctors,
    saveDailyJournal
  } = useUserContext()

  const memoizedUser = useMemo(() => (profile ? { id: profile.id } : null), [profile?.id])

  return useMemo(() => ({ 
    profile, 
    loading, 
    error,
    weekNumber,
    trimester,
    user: memoizedUser,
    roadmap,
    education,
    consultations,
    doctors,
    loadRoadmap,
    loadEducation,
    loadConsultations,
    loadDoctors,
    saveDailyJournal
  }), [
    profile, loading, error, weekNumber, trimester, memoizedUser,
    roadmap, education, consultations, doctors,
    loadRoadmap, loadEducation, loadConsultations, loadDoctors,
    saveDailyJournal
  ])
}
