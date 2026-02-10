'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { DoctorNavbar } from '@/components/doctor/doctor-navbar'
import { DoctorStatsGrid } from '@/components/doctor/doctor-stats-grid'
import { ClientList } from '@/components/doctor/client-list'

interface Client {
  id: string
  paymentId: string
  userName: string
  userAvatar: string | null
  createdAt: string
}

interface DoctorStats {
  totalClients: number
  pendingChats: number
  todayEarnings: number
}

export default function DoctorDashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState<DoctorStats>({
    totalClients: 0,
    pendingChats: 0,
    todayEarnings: 0
  })
  const [loading, setLoading] = useState(true)
  const [doctorName, setDoctorName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        setDoctorName(profile?.full_name || 'Dokter')

        const { data: payments } = await supabase
          .from('payments')
          .select(`
            id,
            created_at,
            amount,
            status,
            profiles:user_id (id, full_name, avatar_url)
          `)
          .eq('doctor_id', user.id)
          .eq('status', 'success')
          .order('created_at', { ascending: false })
          .limit(10)

        if (payments) {
          const formattedClients: Client[] = payments.map((p: any) => ({
            id: p.profiles?.id,
            paymentId: p.id,
            userName: p.profiles?.full_name || 'Pasien',
            userAvatar: p.profiles?.avatar_url,
            createdAt: p.created_at,
          }))
          setClients(formattedClients)

          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const todayPayments = payments.filter(
            (p: any) => new Date(p.created_at) >= today
          )

          setStats({
            totalClients: payments.length,
            pendingChats: payments.length,
            todayEarnings: todayPayments.reduce((sum: number, p: any) => sum + p.amount, 0)
          })
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lavender border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg pb-8">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender/15 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-green/10 rounded-full blur-3xl" />
      </div>

      <DoctorNavbar doctorName={doctorName} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <DoctorStatsGrid stats={stats} />
        <ClientList clients={clients} />
      </main>
    </div>
  )
}
