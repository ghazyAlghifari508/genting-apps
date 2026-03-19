'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Eye,
  EyeOff,
  User,
  Loader2,
  Lock,
  ArrowLeft,
  Users,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'




interface AuthSliderProps {
  initialMode?: 'login' | 'register'
}

export function AuthSlider({ initialMode = 'login' }: AuthSliderProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'register')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setFormVisible(true), 200)
  }, [])

  const toggleMode = (mode: 'login' | 'register') => {
    setFormVisible(false)
    setTimeout(() => {
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
    }, 300)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const normalizedEmail = formData.email.trim().toLowerCase()

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Kata sandi tidak cocok')
        }
        if (!formData.username) {
          throw new Error('Username wajib diisi')
        }

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: formData.password,
          options: {
            data: {
              name: formData.fullName || formData.username,
              username: formData.username,
              full_name: formData.fullName || formData.username,
              role: 'user',
            }
          }
        })
        if (error) throw new Error(error.message || 'Gagal mendaftar')

        // If 'Confirm Email' is DISABLED in Supabase, 'data.session' will exist immediately.
        // If 'Confirm Email' is ENABLED, 'data.session' will be null.
        if (data.session) {
          window.location.href = '/onboarding'
        } else {
          setNeedsConfirmation(true)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: formData.password,
        })
        if (error) throw new Error(error.message || 'Email atau kata sandi salah')

        const role = data.user?.user_metadata?.role
        if (role === 'admin') {
          window.location.href = '/admin/dashboard'
          return
        } else if (role === 'doctor') {
          window.location.href = '/doctor'
          return
        }

        // For 'user' role, check onboarding status
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user?.id)
          .single()

        if (profile && !profile.onboarding_completed) {
          window.location.href = '/onboarding'
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className={`min-h-[85vh] w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white  shadow-xl border border-slate-100  transition-all duration-500 ease-out ${formVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] min-h-[640px]">
        <div className="p-8 md:p-12 lg:p-14 flex flex-col">
          {/* Back button inside card */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-400 hover:text-doccure-teal font-bold transition-colors group mb-6 text-xs"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-0 text-doccure-teal mb-10 -ml-4 overflow-visible">
            <Image src="/images/unsplash/logo-rembg.png" alt="Genting Logo" width={130} height={130} className="w-[100px] h-[100px] scale-[1.3] object-contain drop-shadow-sm" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900  mb-3">
              {isSignUp ? 'Buat Akun' : 'Selamat Datang Kembali'}
            </h1>
            <p className="text-slate-500  text-sm md:text-base">
              {isSignUp
                ? 'Daftarkan akun untuk memulai pendampingan 1000 HPK.'
                : 'Masuk untuk melanjutkan pemantauan tumbuh kembang si kecil.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
              <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {needsConfirmation ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="mb-2 flex items-center justify-center overflow-visible">
                <Image src="/images/unsplash/logo-rembg.png" alt="Genting Logo" width={180} height={180} className="w-[160px] h-[160px] scale-[1.2] object-contain drop-shadow-lg" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 ">Pendaftaran Berhasil!</h3>
                <p className="text-slate-500  text-sm max-w-xs mx-auto">
                  Silakan periksa email <span className="font-bold text-doccure-teal">{formData.email}</span> untuk memverifikasi akun Anda sebelum masuk.
                </p>
              </div>
              <Button 
                onClick={() => {
                  setNeedsConfirmation(false)
                  setIsSignUp(false)
                  router.replace('/login')
                }}
                className="bg-doccure-teal hover:bg-doccure-teal/90 text-white font-bold px-8 py-6 rounded-xl shadow-md"
              >
                Kembali ke Login
              </Button>
            </div>
          ) : (
            <>
            <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <div className="relative group">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formData.username ? 'text-doccure-teal' : 'text-slate-400 group-focus-within:text-doccure-teal'}`} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200  bg-white  text-slate-900  outline-none transition-all focus:border-doccure-teal focus:ring-4 focus:ring-doccure-teal/10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors flex items-center justify-center ${formData.email ? 'text-doccure-teal' : 'text-slate-400 group-focus-within:text-doccure-teal'}`}>
                  <span className="text-lg font-bold">@</span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200  bg-white  text-slate-900  outline-none transition-all focus:border-doccure-teal focus:ring-4 focus:ring-doccure-teal/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formData.password ? 'text-doccure-teal' : 'text-slate-400 group-focus-within:text-doccure-teal'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Kata Sandi"
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200  bg-white  text-slate-900  outline-none transition-all focus:border-doccure-teal focus:ring-4 focus:ring-doccure-teal/10"
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
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${formData.confirmPassword ? 'text-doccure-teal' : 'text-slate-400 group-focus-within:text-doccure-teal'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Konfirmasi Kata Sandi"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200  bg-white  text-slate-900  outline-none transition-all focus:border-doccure-teal focus:ring-4 focus:ring-doccure-teal/10"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Remember me
                </label>
                <button type="button" className="text-doccure-teal hover:underline">
                  Lupa kata sandi?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-xl bg-doccure-teal hover:bg-doccure-teal/90 text-white font-bold text-base shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                isSignUp ? 'Buat Akun' : 'Masuk'
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100 "></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white  px-4 text-slate-400 font-bold tracking-widest transition-colors">Atau</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              setLoading(true)
              try {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                  }
                })
                if (error) throw error
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal masuk dengan Google')
                setLoading(false)
              }
            }}
            disabled={loading}
            className="w-full py-6 rounded-xl border border-slate-200  hover:border-doccure-teal/30 hover:bg-slate-50  transition-all font-bold text-slate-700  flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
          </Button>

          <div className="mt-auto pt-8 flex flex-col gap-4">
            <div className="text-xs text-slate-400">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
              <button
                onClick={() => toggleMode(isSignUp ? 'login' : 'register')}
                className="text-doccure-teal font-semibold hover:underline"
              >
                {isSignUp ? 'Masuk' : 'Daftar Sekarang'}
              </button>
            </div>

            <Link 
              href="/register-doctor"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-doccure-teal/30 text-doccure-teal text-xs font-bold hover:bg-doccure-teal/5 transition-all group"
            >
              <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Daftar sebagai Doctor</span>
            </Link>
          </div>
          </>
        )}
        </div>

        <div className="hidden md:flex relative p-10 lg:p-12 bg-doccure-dark text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="relative z-10 flex flex-col w-full">
            <div className="ml-auto w-full max-w-xs rounded-3xl bg-white/10 border border-white/10 p-4 mb-8">
              <p className="text-xs text-white/70 mb-2 font-semibold">GENTING+ Overview</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-end gap-2 h-16">
                  <div className="w-1/3 h-[75%] relative rounded-xl overflow-hidden bg-doccure-teal/20 border border-white/5">
                     <Image src="/images/unsplash/trimester1.jpg" alt="TM1" fill sizes="100px" className="object-cover opacity-80" />
                  </div>
                  <div className="w-1/3 h-full relative rounded-xl overflow-hidden bg-doccure-teal/40 border border-white/5">
                     <Image src="/images/unsplash/trimester2.jpg" alt="TM2" fill sizes="100px" className="object-cover opacity-90" />
                  </div>
                  <div className="w-1/3 h-[85%] relative rounded-xl overflow-hidden bg-doccure-teal/20 border border-white/5">
                     <Image src="/images/unsplash/trimester3.jpg" alt="TM3" fill sizes="100px" className="object-cover opacity-80" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-white/50 font-medium px-1">
                  <span>Trimester 1</span>
                  <span>Trimester 2</span>
                  <span>Trimester 3</span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold leading-snug mb-4">
              Pantau tumbuh kembang anak lebih mudah dan terarah.
            </h2>
            <p className="text-white/70 text-sm mb-8 max-w-sm">
              Satu platform untuk konsultasi dokter, edukasi nutrisi, dan pemantauan 1000 Hari Pertama Kehidupan.
            </p>

            <div className="mt-auto rounded-3xl overflow-hidden relative shadow-2xl">
              <Image
                src="/images/unsplash/img_22b8c27b.png"
                alt="Ilustrasi layanan Genting"
                width={1200}
                height={560}
                className="w-full h-56 md:h-[280px] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-doccure-dark/80 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                 <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-doccure-dark bg-doccure-dark flex items-center justify-center">
                        <Users className="w-4 h-4 text-doccure-teal" />
                     </div>
                   ))}
                 </div>
                 <div className="text-xs font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    Grup Diskusi
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
