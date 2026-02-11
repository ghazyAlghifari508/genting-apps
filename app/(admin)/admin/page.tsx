'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Users, 
  Stethoscope, 
  TrendingUp,
  Check,
  X,
  LogOut,
  Clock,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface PendingDoctor {
  id: string
  userId: string
  fullName: string
  email: string
  specialization: string
  licenseNumber: string
  createdAt: string
}

interface Stats {
  totalUsers: number
  totalDoctors: number
  pendingVerifications: number
  avgStuntingRisk: number
}

const mockRiskTrend = [
  { month: 'Jan', risk: 42 },
  { month: 'Feb', risk: 38 },
  { month: 'Mar', risk: 35 },
  { month: 'Apr', risk: 32 },
  { month: 'May', risk: 28 },
  { month: 'Jun', risk: 25 },
]

const riskDistribution = [
  { name: 'Rendah', value: 45, color: '#2ECC71' },
  { name: 'Sedang', value: 35, color: '#F39C12' },
  { name: 'Tinggi', value: 20, color: '#FF7675' },
]

export default function AdminDashboardPage() {
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([])
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDoctors: 0,
    pendingVerifications: 0,
    avgStuntingRisk: 0
  })
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
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

        // Verify admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          router.push('/dashboard')
          return
        }

        // Get pending doctor verifications
        const { data: doctors } = await supabase
          .from('doctor_profiles')
          .select(`
            id,
            user_id,
            specialization,
            license_number,
            created_at,
            profiles:user_id (full_name, email:id)
          `)
          .eq('is_verified', false)
          .order('created_at', { ascending: true })

        if (doctors) {
          setPendingDoctors(doctors.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            fullName: d.profiles?.full_name || 'Dokter',
            email: d.profiles?.email || '',
            specialization: d.specialization || 'Umum',
            licenseNumber: d.license_number || '-',
            createdAt: d.created_at,
          })))
        }

        // Get stats
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'user')

        const { count: doctorCount } = await supabase
          .from('doctor_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_verified', true)

        setStats({
          totalUsers: userCount || 0,
          totalDoctors: doctorCount || 0,
          pendingVerifications: doctors?.length || 0,
          avgStuntingRisk: 32 // Mock data
        })
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, router])

  const handleVerification = async (doctorId: string, userId: string, approve: boolean) => {
    if (processingId) return

    try {
      setProcessingId(doctorId)

      if (approve) {
        await supabase
          .from('doctor_profiles')
          .update({ is_verified: true })
          .eq('id', doctorId)
      } else {
        // Reject - delete the doctor profile
        await supabase
          .from('doctor_profiles')
          .delete()
          .eq('id', doctorId)

        // Optionally change role back to user
        await supabase
          .from('profiles')
          .update({ role: 'user' })
          .eq('id', userId)
      }

      // Remove from list
      setPendingDoctors(prev => prev.filter(d => d.id !== doctorId))
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1,
        totalDoctors: approve ? prev.totalDoctors + 1 : prev.totalDoctors
      }))
    } catch (error) {
      console.error('Error processing verification:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <LoadingScreen message="Memuat Dashboard Admin..." fullScreen />;
  }

  return (
    <div className="min-h-screen gradient-bg pb-8">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender/15 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-green/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-salmon to-lavender flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Admin Dashboard</h1>
              <p className="text-xs text-foreground/60">Kelola GENTING Platform</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-foreground/60">Total Users</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-lavender/10 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-lavender" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stats.totalDoctors}</p>
              <p className="text-sm text-foreground/60">Dokter Aktif</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
              <p className="text-sm text-foreground/60">Pending</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-salmon/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-salmon" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stats.avgStuntingRisk}%</p>
              <p className="text-sm text-foreground/60">Avg Risiko</p>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="verification" className="w-full">
          <TabsList className="glass-card rounded-xl p-1 h-auto">
            <TabsTrigger value="verification" className="rounded-lg py-2 px-4">
              Verifikasi Dokter
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg py-2 px-4">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Verification Tab */}
          <TabsContent value="verification" className="mt-4">
            {pendingDoctors.length === 0 ? (
              <Card className="glass-card rounded-2xl p-8 text-center">
                <Check className="w-12 h-12 text-green mx-auto mb-4" />
                <p className="font-medium">Semua Terverifikasi!</p>
                <p className="text-sm text-foreground/60">Tidak ada dokter yang menunggu verifikasi</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass-card rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-lavender/10 flex items-center justify-center shrink-0">
                            <Stethoscope className="w-6 h-6 text-lavender" />
                          </div>
                          <div>
                            <p className="font-semibold">{doctor.fullName}</p>
                            <p className="text-sm text-foreground/60">{doctor.specialization}</p>
                            <p className="text-xs text-foreground/50 mt-1">
                              STR: {doctor.licenseNumber}
                            </p>
                            <p className="text-xs text-foreground/50">
                              Daftar: {new Date(doctor.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleVerification(doctor.id, doctor.userId, true)}
                            disabled={processingId === doctor.id}
                            size="icon"
                            className="rounded-xl bg-green hover:bg-green/90"
                          >
                            {processingId === doctor.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => handleVerification(doctor.id, doctor.userId, false)}
                            disabled={processingId === doctor.id}
                            size="icon"
                            variant="outline"
                            className="rounded-xl border-salmon text-salmon hover:bg-salmon/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Risk Trend Chart */}
              <Card className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green" />
                  Tren Risiko Stunting
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockRiskTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--foreground)/0.5)" />
                      <YAxis stroke="hsl(var(--foreground)/0.5)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="risk" 
                        stroke="#2ECC71" 
                        strokeWidth={2}
                        dot={{ fill: '#2ECC71', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Risk Distribution */}
              <Card className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-salmon" />
                  Distribusi Risiko
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {riskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
