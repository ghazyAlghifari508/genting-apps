'use client'

import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { getUserProfile } from '@/services/userService'
import { UserProfile } from '@/types/education'
import { calculatePregnancyWeek, calculateTrimester } from '@/lib/date-utils'
import { getRoadmapActivities, getUserRoadmapProgress } from '@/services/roadmapService'
import { getAllEducationContent, getUserProgress as getEducationProgress, getProgressStats } from '@/services/educationService'
import { getUserConsultations, getDoctorConsultations, getDoctorEarnings } from '@/services/consultationService'
import { getDoctorStats, getDoctorByUserId, getDoctorSchedules, getDoctors } from '@/services/doctorService'
import { getOwnRegistration } from '@/services/doctorRegistrationService'
import { fetchDashboardStats, fetchPendingDoctors, fetchEducationContents, fetchRoadmapActivities, DashboardStats, fetchAdminDashboardData } from '@/services/adminService'
import { RoadmapActivity, UserRoadmapProgress } from '@/types/roadmap'
import { EducationContent, UserProgress } from '@/types/education'
import { Consultation, DoctorEarningRecord } from '@/types/consultation'
import { Doctor, DoctorSchedule, DoctorStats, DoctorRegistration } from '@/types/doctor'

// --- AUTH CONTEXT ---
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      initialized.current = true
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (!initialized.current) {
        setLoading(false)
        initialized.current = true
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      // 1. Clear Supabase session on server and local
      await supabase.auth.signOut({ scope: 'global' })
      
      // 2. Clear known localStorage keys as a fallback
      Object.keys(localStorage).forEach(key => {
        if (key.includes('-auth-token')) {
          localStorage.removeItem(key)
        }
      })
      
      // 3. Clear transient memory state
      setUser(null)
      setSession(null)
      
      // 4. Hard redirect to login to clear all React contexts
      window.location.replace('/login')
    } catch (error) {
      console.error('[AuthProvider] Logout error:', error)
      // Fallback redirect
      window.location.replace('/login')
    }
  }

  const authContextValue = useMemo(() => ({ 
    user, 
    session, 
    loading, 
    signOut 
  }), [user, session, loading])

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuthContext must be used within an AuthProvider')
  return context
}

// --- USER DATA CONTEXT ---
interface UserContextType {
  profile: UserProfile | null
  role: string | null
  loading: boolean
  isProfileLoaded: boolean
  error: string | null
  weekNumber: number
  trimester: number
  refreshProfile: () => Promise<void>
  // ... (rest of the fields)
  // Cached Data
  roadmap: { activities: RoadmapActivity[]; progress: UserRoadmapProgress[]; loading: boolean }
  education: { content: EducationContent[]; progress: UserProgress[]; stats: Record<string, number> | null; loading: boolean }
  consultations: { data: Consultation[]; loading: boolean }
  doctors: { data: Doctor[]; loading: boolean }
  loadRoadmap: (force?: boolean) => Promise<void>
  loadEducation: (force?: boolean) => Promise<void>
  loadConsultations: (force?: boolean) => Promise<void>
  loadDoctors: (force?: boolean) => Promise<void>
  resetState: () => void
  saveDailyJournal: (payload: { user_id: string; content: string; date: string }) => Promise<void>
  getDailyJournal: (userId: string, date: string) => Promise<any>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuthContext()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // fulfillmentMap tracks which data types have been successfully synced for which userId.
  // This is the definitive "Success Guard" that prevents re-fetching empty data.
  const fulfillmentMap = useRef<Record<string, string>>({})
  const fetchingRef = useRef<Record<string, boolean>>({})
  const lastFetchedId = useRef<string | null>(null)
  
  const userId = user?.id

  const [roadmap, setRoadmap] = useState<{ activities: RoadmapActivity[]; progress: UserRoadmapProgress[]; loading: boolean }>({ activities: [], progress: [], loading: false })
  const [education, setEducation] = useState<{ content: EducationContent[]; progress: UserProgress[]; stats: Record<string, number> | null; loading: boolean }>({ content: [], progress: [], stats: null, loading: false })
  const [consultations, setConsultations] = useState<{ data: Consultation[]; loading: boolean }>({ data: [], loading: false })
  const [doctors, setDoctors] = useState<{ data: Doctor[]; loading: boolean }>({ data: [], loading: false })


  const resetState = useCallback(() => {
    setProfile(null)
    setProfileLoading(false)
    setRoadmap({ activities: [], progress: [], loading: false })
    setEducation({ content: [], progress: [], stats: null, loading: false })
    setConsultations({ data: [], loading: false })
    setDoctors({ data: [], loading: false })
    lastFetchedId.current = null
    fetchingRef.current = {}
    fulfillmentMap.current = {} // Clear fulfillment on logout/reset
  }, [])

  const loadData = useCallback(async (force = false) => {
    if (!userId) {
      resetState()
      return
    }

    // Strict Fetch Lock: 
    // - Prevent parallel fetches (fetchingRef)
    // - Prevent re-fetching if we already have the profile for this user (fulfillmentMap)
    // - Unless 'force' is true (manual refresh)
    if (!force && (fetchingRef.current['profile'] || fulfillmentMap.current['profile'] === userId)) {
      if (profileLoading) setProfileLoading(false)
      return
    }

    fetchingRef.current['profile'] = true
    if (!profile) setProfileLoading(true)

    try {
      const data = await getUserProfile(userId)
      if (data) {
        if (!data.pregnancy_week && data.pregnancy_start_date) {
          data.pregnancy_week = calculatePregnancyWeek(data.pregnancy_start_date)
        }
        setProfile(data)
        lastFetchedId.current = userId
      }
      
      // Success Mark: Mark as fulfilled for this specific userId
      fulfillmentMap.current['profile'] = userId
    } catch (err) {
      console.error('[UserDataProvider] Profile error:', err)
      setError('Gagal memuat data profil.')
    } finally {
      setProfileLoading(false)
      fetchingRef.current['profile'] = false
    }
  }, [userId, resetState, profileLoading, profile])
  // Note: purposefully removed 'profile' from dependencies to stabilize. 
  // We use lastFetchedId ref to check if a new fetch is needed.

  const role = profile?.role || user?.user_metadata?.role || (user ? 'user' : null)
  const isProfileLoaded = !!profile || (!profileLoading && !!user)
  const loadRoadmap = useCallback(async (force = false) => {
    if (!userId) return
    // Success Guard: Stop if already fetching or if we already synced for this userId
    if (!force && (fetchingRef.current['roadmap'] || fulfillmentMap.current['roadmap'] === userId)) return

    fetchingRef.current['roadmap'] = true
    if (roadmap.activities.length === 0) {
      setRoadmap(prev => ({ ...prev, loading: true }))
    }
    
    try {
      const { getRoadmapActivities, getUserRoadmapProgress } = await import('@/services/roadmapService')
      const [acts, prog] = await Promise.all([
        getRoadmapActivities(),
        getUserRoadmapProgress(userId),
      ])
      setRoadmap({ activities: acts || [], progress: prog || [], loading: false })
      fulfillmentMap.current['roadmap'] = userId
    } catch (err) {
      console.error('[UserDataProvider] Roadmap error:', err)
      setRoadmap(prev => ({ ...prev, loading: false }))
    } finally {
      fetchingRef.current['roadmap'] = false
    }
  }, [userId, roadmap.activities.length])
  // Note: dependencies reduced to stabilize

  const loadEducation = useCallback(async (force = false) => {
    if (!userId) return
    // Success Guard: Stop if already fetching or if we already synced for this userId
    if (!force && (fetchingRef.current['education'] || fulfillmentMap.current['education'] === userId)) return

    fetchingRef.current['education'] = true
    if (education.content.length === 0) {
      setEducation(prev => ({ ...prev, loading: true }))
    }

    try {
      const { getAllEducationContent, getUserProgress: getEducationProgress, getProgressStats } = await import('@/services/educationService')
      const [content, progress, stats] = await Promise.all([
        getAllEducationContent(),
        getEducationProgress(userId),
        getProgressStats(userId)
      ])
      setEducation({ content: content || [], progress: progress || [], stats: stats || null, loading: false })
      fulfillmentMap.current['education'] = userId
    } catch (err) {
      console.error('[UserDataProvider] Education error:', err)
      setEducation(prev => ({ ...prev, loading: false }))
    } finally {
      fetchingRef.current['education'] = false
    }
  }, [userId, education.content.length])

  const loadConsultations = useCallback(async (force = false) => {
    if (!userId) return
    // Success Guard
    if (!force && (fetchingRef.current['consultations'] || fulfillmentMap.current['consultations'] === userId)) return
    
    fetchingRef.current['consultations'] = true
    setConsultations(prev => ({ ...prev, loading: true }))
    try {
      const data = await getUserConsultations(userId)
      setConsultations({ data: data || [], loading: false })
      fulfillmentMap.current['consultations'] = userId
    } catch (err) {
      console.error('[UserDataProvider] Consultations error:', err)
      setConsultations(prev => ({ ...prev, loading: false }))
    } finally {
      fetchingRef.current['consultations'] = false
    }
  }, [userId])

  const loadDoctors = useCallback(async (force = false) => {
    // Success Guard (using static key since doctors are global, but we still want to guard per User mount context if possible)
    // Actually, doctors can stay global, but let's just guard it similarly.
    if (!force && (fetchingRef.current['doctors'] || fulfillmentMap.current['doctors'] === 'loaded')) return
    
    fetchingRef.current['doctors'] = true
    setDoctors(prev => ({ ...prev, loading: true }))
    try {
      const data = await getDoctors()
      setDoctors({ data: data || [], loading: false })
      fulfillmentMap.current['doctors'] = 'loaded'
    } catch (err) {
      console.error('[UserDataProvider] Doctors error:', err)
      setDoctors(prev => ({ ...prev, loading: false }))
    } finally {
      fetchingRef.current['doctors'] = false
    }
  }, [])

  const saveDailyJournal = useCallback(async (payload: { user_id: string; content: string; date: string }) => {
    const { saveDailyJournal: saveJournal } = await import('@/services/roadmapService')
    await saveJournal(payload)
  }, [])

  const getDailyJournal = useCallback(async (userId: string, date: string) => {
    const { getDailyJournal: fetchJournal } = await import('@/services/roadmapService')
    return await fetchJournal(userId, date)
  }, [])

  const refreshProfile = useCallback(() => loadData(true), [loadData])

  useEffect(() => {
    if (!authLoading) {
      loadData()
    }
  }, [userId, authLoading, loadData])

  const weekNumber = profile?.pregnancy_week || 0
  const trimester = profile?.trimester || calculateTrimester(weekNumber)

  const userContextValue = useMemo(() => {
    const value: UserContextType = {
      profile,
      role,
      loading: profileLoading,
      isProfileLoaded,
      error,
      weekNumber,
      trimester,
      refreshProfile: () => loadData(true),
      roadmap,
      education,
      consultations,
      doctors,
      loadRoadmap,
      loadEducation,
      loadConsultations,
      loadDoctors,
      resetState,
      saveDailyJournal,
      getDailyJournal
    }
    return value
  }, [
    profile, role, profileLoading, isProfileLoaded, error, weekNumber, trimester, 
    loadData, roadmap, education, consultations, doctors, 
    loadRoadmap, loadEducation, loadConsultations, loadDoctors, 
    resetState, saveDailyJournal, getDailyJournal
  ])

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (context === undefined) throw new Error('useUserContext must be used within a UserDataProvider')
  return context
}

// --- DOCTOR DATA CONTEXT ---
interface DoctorContextType {
  doctor: Doctor | null
  stats: DoctorStats | null
  consultations: Consultation[]
  schedules: DoctorSchedule[]
  earnings: DoctorEarningRecord[]
  loading: boolean
  loadDoctorData: (force?: boolean) => Promise<void>
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined)

export function DoctorDataProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuthContext()
  const { role, loading: userLoading } = useUserContext()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [stats, setStats] = useState<DoctorStats | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [earnings, setEarnings] = useState<DoctorEarningRecord[]>([])
  const [loading, setLoading] = useState(true)
  const isDoctor = role === 'doctor'
  const fetchedRef = useRef<string | null>(null)

  useEffect(() => {
    fetchedRef.current = null
  }, [user?.id])

  const loadDoctorData = useCallback(async (force = false) => {
    if (!user || !isDoctor) {
      setLoading(false)
      return
    }

    // Strict Fetch Lock for Doctor Data
    // - Prevent fetching if already marked as fetched for this user (unless forced)
    if (!force && fetchedRef.current === user.id) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      let doc = doctor
      if (!doc || force) {
        doc = await getDoctorByUserId(user.id)
        if (doc) setDoctor(doc)
      }

      if (doc && doc.is_verified) {
        // Parallel fetch for doctor sub-data
        const [s, cons, scheds, earn] = await Promise.all([
          getDoctorStats(doc.id),
          getDoctorConsultations(doc.id),
          getDoctorSchedules(doc.id),
          getDoctorEarnings(doc.id)
        ])
        setStats(s)
        setConsultations(cons || [])
        setSchedules(scheds || [])
        setEarnings(earn || [])
        
        // Mark as fulfilled for this specific user.id
        fetchedRef.current = user.id
      } else {
        // Even if not verified or no doc found, we mark as check-done for this user
        fetchedRef.current = user.id
      }
    } catch (err) {
      console.error('[DoctorDataProvider] Load error:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id, isDoctor, doctor])

  useEffect(() => {
    if (!authLoading && isDoctor) {
      loadDoctorData()
    }
  }, [authLoading, isDoctor, loadDoctorData])

  const doctorContextValue = useMemo(() => ({ 
    doctor, 
    stats, 
    consultations, 
    schedules, 
    earnings, 
    loading: authLoading || (isDoctor && loading), 
    loadDoctorData 
  }), [
    doctor, 
    stats, 
    consultations, 
    schedules, 
    earnings, 
    authLoading, 
    isDoctor, 
    loading, 
    loadDoctorData
  ])

  return (
    <DoctorContext.Provider value={doctorContextValue}>
      {children}
    </DoctorContext.Provider>
  )
}

export const useDoctorContext = () => {
  const context = useContext(DoctorContext)
  return context
}

// --- ADMIN DATA CONTEXT ---
interface AdminContextType {
  stats: DashboardStats | null
  pendingDoctors: DoctorRegistration[]
  educationContents: EducationContent[]
  roadmapActivities: RoadmapActivity[]
  loading: boolean // UI Global loading (Dashboard essential)
  statsLoading: boolean
  doctorsLoading: boolean
  educationLoading: boolean
  roadmapLoading: boolean
  loadAdminData: (force?: boolean) => Promise<void>
  loadEducation: (force?: boolean) => Promise<void>
  loadRoadmap: (force?: boolean) => Promise<void>
  loadStats: (force?: boolean) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuthContext()
  
  // Data States
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pendingDoctors, setPendingDoctors] = useState<DoctorRegistration[]>([])
  const [educationContents, setEducationContents] = useState<EducationContent[]>([])
  const [roadmapActivities, setRoadmapActivities] = useState<RoadmapActivity[]>([])
  
  // Loading States
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)
  const [doctorsLoading, setDoctorsLoading] = useState(false)
  const [educationLoading, setEducationLoading] = useState(false)
  const [roadmapLoading, setRoadmapLoading] = useState(false)

  const isAdmin = user?.user_metadata?.role === 'admin' || user?.role === 'admin'
  const statsFetchedRef = useRef<string | null>(null)
  const eduFetchedRef = useRef<string | null>(null)
  const roadFetchedRef = useRef<string | null>(null)
  const fetchingRef = useRef<Record<string, boolean>>({})

  // Sub-Loaders
  const loadStats = useCallback(async (force = false) => {
    if (!user || !isAdmin || (!force && statsFetchedRef.current === user.id)) return
    if (fetchingRef.current['stats']) return

    fetchingRef.current['stats'] = true
    setStatsLoading(true)
    try {
      const s = await fetchDashboardStats()
      setStats(s)
      statsFetchedRef.current = user.id
    } catch (err) {
      console.error('[AdminDataProvider] Stats error:', err)
    } finally {
      setStatsLoading(false)
      fetchingRef.current['stats'] = false
    }
  }, [user?.id, isAdmin])

  const loadDoctors = useCallback(async (force = false) => {
    if (!user || !isAdmin) return
    if (!force && fetchingRef.current['doctors']) return

    fetchingRef.current['doctors'] = true
    setDoctorsLoading(true)
    try {
      const d = await fetchPendingDoctors()
      setPendingDoctors(d || [])
    } catch (err) {
      console.error('[AdminDataProvider] Doctors error:', err)
    } finally {
      setDoctorsLoading(false)
      fetchingRef.current['doctors'] = false
    }
  }, [user?.id, isAdmin])

  const loadEducation = useCallback(async (force = false) => {
    if (!user || !isAdmin || (!force && eduFetchedRef.current === user.id)) return
    if (fetchingRef.current['education']) return

    fetchingRef.current['education'] = true
    setEducationLoading(true)
    try {
      const e = await fetchEducationContents()
      setEducationContents(e || [])
      eduFetchedRef.current = user.id
    } catch (err) {
      console.error('[AdminDataProvider] Education error:', err)
    } finally {
      setEducationLoading(false)
      fetchingRef.current['education'] = false
    }
  }, [user?.id, isAdmin])

  const loadRoadmap = useCallback(async (force = false) => {
    if (!user || !isAdmin || (!force && roadFetchedRef.current === user.id)) return
    if (fetchingRef.current['roadmap']) return

    fetchingRef.current['roadmap'] = true
    setRoadmapLoading(true)
    try {
      const r = await fetchRoadmapActivities()
      setRoadmapActivities(r || [])
      roadFetchedRef.current = user.id
    } catch (err) {
      console.error('[AdminDataProvider] Roadmap error:', err)
    } finally {
      setRoadmapLoading(false)
      fetchingRef.current['roadmap'] = false
    }
  }, [user?.id, isAdmin])

  // Legacy/Backwards Compatibility: Load essential data for dashboard
  const loadAdminData = useCallback(async (force = false) => {
    if (!user || !isAdmin) {
      setLoading(false)
      return
    }

    // Success Guard
    if (!force && (fetchingRef.current['adminMain'] || statsFetchedRef.current === user.id)) {
      setLoading(false)
      return
    }

    fetchingRef.current['adminMain'] = true
    setLoading(true)
    try {
      const data = await fetchAdminDashboardData()
      setStats(data.stats)
      setPendingDoctors(data.doctors || [])
      statsFetchedRef.current = user.id
    } catch (err) {
      console.error('[AdminDataProvider] Critical load error:', err)
    } finally {
      setLoading(false)
      fetchingRef.current['adminMain'] = false
    }
  }, [user?.id, isAdmin])

  useEffect(() => {
    if (!authLoading && isAdmin) {
      loadAdminData()
    }
  }, [authLoading, isAdmin, loadAdminData])

  const adminContextValue = useMemo(() => ({ 
    stats, 
    pendingDoctors, 
    educationContents, 
    roadmapActivities, 
    loading: authLoading || (isAdmin && loading),
    statsLoading,
    doctorsLoading,
    educationLoading,
    roadmapLoading,
    loadAdminData,
    loadEducation,
    loadRoadmap,
    loadStats
  }), [
    stats, pendingDoctors, educationContents, roadmapActivities, 
    authLoading, isAdmin, loading, statsLoading, doctorsLoading, 
    educationLoading, roadmapLoading, loadAdminData, loadEducation, 
    loadRoadmap, loadStats
  ])

  return (
    <AdminContext.Provider value={adminContextValue}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdminContext = () => {
  const context = useContext(AdminContext)
  return context
}

// --- GLOBAL PROVIDER COMPONENT ---
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserDataProvider>
        <DoctorDataProvider>
          <AdminDataProvider>
            {children}
          </AdminDataProvider>
        </DoctorDataProvider>
      </UserDataProvider>
    </AuthProvider>
  )
}
