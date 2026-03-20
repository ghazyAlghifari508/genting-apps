'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePregnancyData } from '@/hooks/usePregnancyData'

import Link from 'next/link'
import Image from 'next/image'

import dynamic from 'next/dynamic'

// Components - Lazy Loaded for Performance
const DashboardHero = dynamic(() => import('@/components/dashboard/DashboardHero').then(mod => mod.DashboardHero))
const ServiceCards = dynamic(() => import('@/components/dashboard/ServiceCards').then(mod => mod.ServiceCards))
const PregnancyStatusCard = dynamic(() => import('@/components/dashboard/PregnancyStatusCard').then(mod => mod.PregnancyStatusCard))
const DailyTasksCard = dynamic(() => import('@/components/dashboard/DailyTasksCard').then(mod => mod.DailyTasksCard))
const ProfileCard = dynamic(() => import('@/components/dashboard/ProfileCard').then(mod => mod.ProfileCard))
const RemindersCard = dynamic(() => import('@/components/dashboard/RemindersCard').then(mod => mod.RemindersCard))
const ConsultationCard = dynamic(() => import('@/components/dashboard/ConsultationCard').then(mod => mod.ConsultationCard))
const NutritionCard = dynamic(() => import('@/components/dashboard/NutritionCard').then(mod => mod.NutritionCard))
const VisionBanner = dynamic(() => import('@/components/dashboard/VisionBanner').then(mod => mod.VisionBanner))

import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { ArrowRight } from 'lucide-react'

// Data & Helpers
import { 
  dailyTasksByTrimester, 
  educationByTrimester 
} from '@/constants/dashboard-data'

export default function DashboardPage() {
  const { 
    loading, 
    user, 
    profile, 
    weekNumber, 
    trimester, 
    roadmap, 
    loadRoadmap,
    education,
    loadEducation,
    consultations,
    loadConsultations
  } = usePregnancyData()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    
    if (user) {
      // Pre-load data in background
      loadRoadmap()
      loadEducation()
      loadConsultations()
    } else {
      router.push('/login')
      return
    }

    // New User / Incomplete Profile Protection
    // If no profile exists OR onboarding isn't completed for a normal user
    if ((!profile && !loading) || (profile && !profile.onboarding_completed && profile.role === 'user')) {
      router.push('/onboarding')
    }
  }, [loading, user, profile, router, loadRoadmap, loadEducation, loadConsultations])

  if (loading && !profile) {
    return <DashboardSkeleton />
  }

  // Derived Data
  const firstName = profile?.full_name?.split(' ')[0] || 'Bunda'
  const activeTrimester = trimester || 2
  const currentWeek = weekNumber || profile?.pregnancy_week || 24
  
  // HPK (1000 Hari Pertama Kehidupan) calculation
  // Pregnancy is roughly 280 days (40 weeks)
  const currentDay = Math.min(1000, Math.max(1, currentWeek * 7))
  const daysTo1000 = Math.max(0, 1000 - currentDay)
  const pregnancyProgress = Math.min(100, Math.round((Math.min(currentWeek, 40) / 40) * 100))
  
  const profileFields = [
    profile?.full_name,
    profile?.username,
    profile?.avatar_url,
    profile?.pregnancy_week,
    profile?.pregnancy_month,
    profile?.pregnancy_start_date,
    profile?.due_date,
    profile?.current_weight,
    profile?.height,
    profile?.onboarding_completed
  ]
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100)

  // Filter roadmap activities based on current trimester AND NOT completed
  const completedActivityIds = new Set(
    roadmap.progress
      .filter(p => p.status === 'completed')
      .map(p => p.activity_id)
  )

  const trimesterActivities = roadmap.activities.filter(act => 
    activeTrimester >= act.min_trimester && 
    activeTrimester <= act.max_trimester
  )

  const isTrimesterCompleted = trimesterActivities.length > 0 && 
    trimesterActivities.every(act => completedActivityIds.has(act.id))

  const activeActivities = trimesterActivities.filter(act => 
    !completedActivityIds.has(act.id)
  )

  const dailyTasks = activeActivities.length > 0
    ? activeActivities.map(act => act.activity_name).slice(0, 3) 
    : (isTrimesterCompleted ? [] : (dailyTasksByTrimester[activeTrimester] || dailyTasksByTrimester[2]))

  // Smart Reminders from Education
  const filteredEducation = education.content
    .filter(edu => {
      const eduTrimester = Math.floor((edu.month - 1) / 3) + 1
      return eduTrimester === activeTrimester
    })
    .slice(0, 3)

  const reminders = filteredEducation.length > 0
    ? filteredEducation.map(edu => ({
        title: edu.title,
        week: Math.ceil(edu.day / 7)
      }))
    : educationByTrimester[activeTrimester]?.slice(0, 3).map(edu => ({
        title: edu.title,
        week: currentWeek // Fallback to current week for legacy constants
      })) || []

  interface DisplayEducation {
    title: string;
    day?: number;
    href?: string;
  }

  const relevantEducation: DisplayEducation[] = filteredEducation.length > 0
    ? filteredEducation.slice(0, 2)
    : educationByTrimester[activeTrimester]?.slice(0, 2) || []

  // Consultation Logic
  const nextConsultation = consultations.data
    .filter(c => c.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0]

  const isHealthMonitored = !!(profile?.current_weight && profile?.height)

  return (
    <div className="bg-white  min-h-screen pb-20 text-slate-900  relative overflow-hidden transition-colors">
      {/* Background Motifs */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] [0.05]" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <DashboardHero firstName={firstName} />

      {/* Main Grid Content */}
      <section className="mx-auto -mt-12 relative z-20 max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Quick Actions & Primary Focus */}
          <div className="lg:col-span-8 space-y-6">
            <ServiceCards />

            <PregnancyStatusCard 
              activeTrimester={activeTrimester}
              pregnancyProgress={pregnancyProgress}
              currentWeek={currentWeek}
              currentDay={currentDay}
              daysTo1000={daysTo1000}
            />

            <DailyTasksCard 
              currentWeek={currentWeek}
              dailyTasks={dailyTasks}
              isCompleted={isTrimesterCompleted}
            />

            {/* Educational Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relevantEducation.map((edu, idx) => (
                <div key={edu.title} className="relative overflow-hidden rounded-3xl group aspect-[4/3] sm:aspect-auto sm:h-64 shadow-lg lg:border-2 border-transparent hover:border-doccure-teal transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <Image
                    src={idx === 0 ? "/images/unsplash/img_4ba8ae38.png" : "/images/unsplash/img_58db8649.png"}
                    alt={edu.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                    <span className="bg-doccure-teal text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full mb-3 inline-block">Materi Baru</span>
                    <h4 className="text-xl font-bold text-white leading-tight mt-1">{edu.title}</h4>
                    <Link 
                      href={'day' in edu && edu.day ? `/education/${edu.day}` : (edu.href || '#')} 
                      className="mt-4 inline-flex items-center text-white/80 text-sm font-bold hover:text-white transition-colors group/link"
                    >
                      Pelajari Sekarang <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileCard 
              fullName={profile?.full_name || ''}
              firstName={firstName}
              profileCompletion={profileCompletion}
              avatarUrl={profile?.avatar_url}
            />

            <RemindersCard 
              reminders={reminders}
              currentWeek={currentWeek}
            />

            <ConsultationCard 
              nextSchedule={nextConsultation?.scheduled_at}
              isHealthMonitored={isHealthMonitored}
            />

            <NutritionCard 
              hasWeight={!!profile?.current_weight}
            />
          </div>
        </div>
      </section>

      <VisionBanner />

      <div className="h-20" />
    </div>
  )
}
