'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  User, 
  Stethoscope, 
  Loader2, 
  Lock, 
  Leaf,
  ChevronLeft,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type RoleType = 'user' | 'doctor'

interface AuthSliderProps {
  initialMode?: 'login' | 'register'
}

export function AuthSlider({ initialMode = 'login' }: AuthSliderProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'register')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<RoleType>('user')
  const [mounted, setMounted] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setFormVisible(true), 300)
  }, [])

  const toggleMode = (mode: 'login' | 'register') => {
    setIsSignUp(mode === 'register')
    router.replace(`/${mode}`, { scroll: false })
    setError(null)
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Kata sandi tidak cocok')
        }
        if (!formData.username) {
          throw new Error('Username wajib diisi')
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              full_name: formData.fullName || formData.username,
              role: selectedRole
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        if (error) throw error
        
        // After signup, Supabase might require email confirmation or log user in
        // If it logs in automatically or needs confirmation:
        setError('Berhasil daftar! Silakan cek email kamu untuk verifikasi atau silakan login.')
        setIsSignUp(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (isSignUp) {
        localStorage.setItem('genting_register_role', selectedRole)
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback${isSignUp ? '?register=true' : ''}`,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat autentikasi')
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className={`min-h-[85vh] w-full max-w-6xl mx-auto overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-cerulean/10 border border-cerulean/10 transition-all duration-500 ease-out ${formVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left side - Statistics and Images Collage */}
        <div className="hidden md:block w-full md:w-3/5 bg-slate-50 p-8 overflow-hidden relative">
          <div className="grid grid-cols-2 grid-rows-3 gap-6 h-full relative">
            
            {/* Top left - Mother & Baby */}
            <div className="overflow-hidden rounded-2xl relative group shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1555252333-978fe3f72093?q=80&w=1470&auto=format&fit=crop" 
                alt="Ibu dan Bayi" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cerulean/40 to-transparent" />
            </div>
            
            {/* Top right - Stat 1 */}
            <div 
              className="rounded-2xl flex flex-col justify-center items-center p-8 text-white bg-gradient-to-br from-cerulean to-sea-green shadow-lg shadow-cerulean/20"
              style={{
                transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: formVisible ? 1 : 0,
                transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                transitionDelay: '0.2s',
              }}
            >
              <h2 className="text-5xl font-bold mb-2">21.5%</h2>
              <p className="text-center text-sm font-light leading-relaxed">Prevalensi stunting di Indonesia tahun 2023. GENTING hadir untuk menurunkannya.</p>
            </div>
            
            {/* Middle left - Healthy Food */}
            <div className="overflow-hidden rounded-2xl relative group shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop" 
                alt="Makanan Sehat" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sea-green/40 to-transparent" />
            </div>
            
            {/* Middle right - Doctor/Healthcare */}
            <div className="overflow-hidden rounded-2xl relative group shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1480&auto=format&fit=crop" 
                alt="Dokter GENTING" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cerulean/40 to-transparent" />
            </div>
            
            {/* Bottom left - Stat 2 */}
            <div 
              className="rounded-2xl flex flex-col justify-center items-center p-8 text-white bg-gradient-to-br from-grapefruit to-apricot shadow-lg shadow-grapefruit/20"
              style={{
                transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: formVisible ? 1 : 0,
                transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                transitionDelay: '0.4s',
              }}
            >
              <h2 className="text-5xl font-bold mb-2">1000</h2>
              <p className="text-center text-sm font-light leading-relaxed">Hari Pertama Kehidupan adalah periode emas pencegahan stunting pada si kecil.</p>
            </div>
            
            {/* Bottom right - Caring Hands */}
            <div className="overflow-hidden rounded-2xl relative group shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1440&auto=format&fit=crop" 
                alt="Perawatan Bayi" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-grapefruit/40 to-transparent" />
            </div>
          </div>
          
          {/* Decorative Logo Background */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cerulean/5 rounded-full blur-3xl" />
        </div>
        
        {/* Right side - Auth form */}
        <div 
          className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between relative"
          style={{
            transform: formVisible ? 'translateX(0)' : 'translateX(20px)',
            opacity: formVisible ? 1 : 0,
            transition: 'transform 0.6s ease-out, opacity 0.6s ease-out'
          }}
        >
          {/* Header Action */}
          <div className="flex justify-end mb-8">
            <p className="text-sm text-slate-500">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button 
                onClick={() => toggleMode(isSignUp ? 'login' : 'register')} 
                className="ml-2 font-semibold text-cerulean hover:text-cerulean/80 transition-colors inline-flex items-center gap-1"
              >
                {isSignUp ? 'Masuk' : 'Daftar Sekarang'}
                <ArrowRight size={14} />
              </button>
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full">
            {/* Branding */}
            <div className="mb-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-4 bg-cerulean/10 px-4 py-2 rounded-full">
                <Leaf className="w-5 h-5 text-cerulean" />
                <span className="text-cerulean font-bold tracking-tight">GENTING Platform</span>
              </div>
              <h1 className="text-3xl font-bold mb-3 text-slate-900 tracking-tight">
                {isSignUp ? 'Bergabung dengan ' : 'Selamat Datang di '}
                <span className="gradient-text">GENTING</span>
              </h1>
              <p className="text-slate-500 leading-relaxed">
                {isSignUp 
                  ? 'Langkah awal untuk memberikan masa depan terbaik bagi janin dan si kecil.' 
                  : 'Masuk untuk melanjutkan pendampingan 1000 Hari Pertama Kehidupan si kecil.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3"
              >
                <MinusCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formData.username ? 'text-cerulean' : 'text-slate-400 group-focus-within:text-cerulean'}`} />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none transition-all focus:border-cerulean/50 focus:bg-white focus:ring-4 focus:ring-cerulean/5"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors flex items-center justify-center ${formData.email ? 'text-cerulean' : 'text-slate-400 group-focus-within:text-cerulean'}`}>
                    <span className="text-lg font-bold">@</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none transition-all focus:border-cerulean/50 focus:bg-white focus:ring-4 focus:ring-cerulean/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formData.password ? 'text-cerulean' : 'text-slate-400 group-focus-within:text-cerulean'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Kata Sandi"
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none transition-all focus:border-cerulean/50 focus:bg-white focus:ring-4 focus:ring-cerulean/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formData.confirmPassword ? 'text-cerulean' : 'text-slate-400 group-focus-within:text-cerulean'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Konfirmasi Kata Sandi"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none transition-all focus:border-cerulean/50 focus:bg-white focus:ring-4 focus:ring-cerulean/5"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-7 rounded-2xl bg-cerulean hover:bg-cerulean/90 text-white font-bold text-lg shadow-lg shadow-cerulean/20 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  isSignUp ? 'Buat Akun' : 'Masuk Sekarang'
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-semibold tracking-wider">Atau</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Role Selection Removal: Defaulting to 'user' (Ibu Hamil) */}

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white border-2 border-slate-100 py-4 px-6 font-bold shadow-sm transition-all duration-300 hover:border-cerulean/50 hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-cerulean" />
                ) : (
                  <>
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-slate-700">{isSignUp ? 'Daftar' : 'Masuk'} dengan Google</span>
                  </>
                )}
                <div className="absolute inset-0 -z-10 bg-cerulean/5 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-xs tracking-wide uppercase font-semibold">
              Pendamping Kesehatan Ibu & Janin Indonesia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MinusCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
    </svg>
  )
}
