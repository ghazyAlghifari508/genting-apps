'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Calendar, 
  Scale, 
  Ruler, 
  Save, 
  Trash2, 
  Loader2,
  AlertCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Baby
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (error) throw error
        
        // If no profile exists, use basic user data or empty object to avoid crash
        setProfile(data || { 
          username: user.email?.split('@')[0], 
          full_name: user.user_metadata?.full_name 
        })
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    getProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          full_name: profile.full_name,
          pregnancy_week: profile.pregnancy_week,
          current_weight: profile.current_weight,
          height: profile.height,
          due_date: profile.due_date,
          child_name: profile.child_name,
          child_birth_date: profile.child_birth_date,
          child_weight: profile.child_weight,
          child_height: profile.child_height,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      
      toast({
        title: "Profil Diperbarui",
        description: "Data kamu berhasil disimpan.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui profil.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Apakah kamu yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) return

    setLoading(true)
    try {
      // Logic for account deletion usually requires a service role or a specific API route
      // For now, we'll suggest contacting support or provide a placeholder
      // supabase.auth.admin.deleteUser(user.id) is not available on client
      
      const { error } = await supabase.from('profiles').delete().eq('id', user.id)
      if (error) throw error
      
      await supabase.auth.signOut()
      router.push('/')
      
      toast({
        title: "Akun Dihapus",
        description: "Akun kamu telah berhasil dihapus.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus akun.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <LoadingScreen message="Memuat Profil Bunda..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Profil</h1>
        <p className="text-slate-500">Kelola informasi pribadi dan data kehamilan kamu.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Col - Avatar & Overview */}
        <div className="space-y-6">
          <Card className="p-6 text-center shadow-lg border-cerulean/10 bg-white/50 backdrop-blur-sm">
            <div className="w-24 h-24 bg-gradient-to-tr from-cerulean to-sea-green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
              {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
            </div>
            <h3 className="font-bold text-lg text-slate-800">{profile?.full_name || profile?.username}</h3>
            <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
            <div className="flex justify-center gap-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                profile?.status === 'hamil' ? "bg-cerulean/10 text-cerulean" : "bg-sea-green/10 text-sea-green"
              )}>
                {profile?.status === 'hamil' ? 'Ibu Hamil' : 'Ibu Balita'}
              </span>
            </div>
          </Card>

          <Card className="p-6 shadow-md border-slate-100">
            <h4 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-widest">Keamanan</h4>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Akun
            </Button>
          </Card>
        </div>

        {/* Right Col - Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleUpdateProfile}>
            <Card className="p-8 shadow-xl border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <User size={120} />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 relative">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cerulean transition-colors" />
                    <input 
                      type="text"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-cerulean/50 transition-all bg-slate-50/30 focus:bg-white"
                      value={profile?.full_name || ''}
                      onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Username</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input 
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-cerulean/50 transition-all bg-slate-50/30 focus:bg-white"
                      value={profile?.username || ''}
                      onChange={(e) => setProfile({...profile, username: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <div className="relative group opacity-60">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 outline-none bg-slate-100 cursor-not-allowed"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                </div>

                {profile?.status === 'hamil' ? (
                  <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-sea-green" />
                      Data Kehamilan 
                      <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-2 px-2 py-0.5 bg-slate-100 rounded">Ibu Hamil</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Usia Kandungan (Minggu)</label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="number"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sea-green/50 transition-all"
                            placeholder="Contoh: 12"
                            value={profile?.pregnancy_week || ''}
                            onChange={(e) => setProfile({...profile, pregnancy_week: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Perkiraan Lahir (HPL)</label>
                        <input 
                          type="date"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sea-green/50 transition-all font-sans"
                          value={profile?.due_date || ''}
                          onChange={(e) => setProfile({...profile, due_date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Berat Badan (kg)</label>
                        <div className="relative group">
                          <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="number"
                            step="0.1"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sea-green/50 transition-all"
                            placeholder="65.5"
                            value={profile?.current_weight || ''}
                            onChange={(e) => setProfile({...profile, current_weight: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Tinggi Badan (cm)</label>
                        <div className="relative group">
                          <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="number"
                            step="0.1"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sea-green/50 transition-all"
                            placeholder="160"
                            value={profile?.height || ''}
                            onChange={(e) => setProfile({...profile, height: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                       <Baby className="w-5 h-5 text-sea-green" />
                       Data Si Kecil
                       <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-2 px-2 py-0.5 bg-slate-100 rounded">Ibu Balita</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="sm:col-span-2 space-y-2">
                          <label className="text-sm font-bold text-slate-700">Nama Si Kecil</label>
                          <input 
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sea-green/50 transition-all"
                            placeholder="Nama panggilan..."
                            value={profile?.child_name || ''}
                            onChange={(e) => setProfile({...profile, child_name: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Tanggal Lahir</label>
                          <input 
                            type="date"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sea-green/50 transition-all"
                            value={profile?.child_birth_date || ''}
                            onChange={(e) => setProfile({...profile, child_birth_date: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Berat Si Kecil (kg)</label>
                          <input 
                            type="number"
                            step="0.1"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sea-green/50 transition-all"
                            value={profile?.child_weight || ''}
                            onChange={(e) => setProfile({...profile, child_weight: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Tinggi Si Kecil (cm)</label>
                          <input 
                            type="number"
                            step="0.1"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-sea-green/50 transition-all"
                            value={profile?.child_height || ''}
                            onChange={(e) => setProfile({...profile, child_height: e.target.value})}
                          />
                       </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-cerulean hover:bg-cerulean/90 text-white px-8 py-6 rounded-2xl font-bold shadow-lg shadow-cerulean/20 transition-all active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
