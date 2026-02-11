'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  ChevronLeft, 
  Stethoscope, 
  Star, 
  Clock,
  Wallet,
  Loader2,
  CheckCircle,
  Search,
  Users,
  AlertCircle,
  Bell,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Script from 'next/script'
import { LoadingScreen } from '@/components/ui/loading-screen'

interface Doctor {
  id: string
  fullName: string
  avatarUrl: string | null
  specialization: string
  consultationFee: number
  isVerified: boolean
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: unknown) => void
        onPending: (result: unknown) => void
        onError: (result: unknown) => void
        onClose: () => void
      }) => void
    }
  }
}

const categories = ['Semua', 'Obgyn', 'Pediatrik', 'Nutrisi', 'Psikologi']

export default function ConsultPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setUserId(user.id)

        const { data: doctorProfiles } = await supabase
          .from('doctor_profiles')
          .select(`
            user_id,
            specialization,
            consultation_fee,
            is_verified,
            profiles:user_id (full_name, avatar_url)
          `)
          .eq('is_verified', true)

        if (doctorProfiles) {
          const formattedDoctors: Doctor[] = doctorProfiles.map((d: any) => ({
            id: d.user_id,
            fullName: d.profiles?.full_name || 'Dokter',
            avatarUrl: d.profiles?.avatar_url,
            specialization: d.specialization || 'Umum',
            consultationFee: d.consultation_fee || 50000,
            isVerified: d.is_verified,
          }))
          setDoctors(formattedDoctors)
        }
      } catch (error) {
        console.error('Error loading doctors:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  const handlePayment = async (doctor: Doctor) => {
    if (!userId || paying) return

    try {
      setPaying(doctor.id)

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          userId,
          amount: doctor.consultationFee,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      window.snap.pay(data.snapToken, {
        onSuccess: () => {
          window.location.href = `/consult/${data.paymentId}`
        },
        onPending: () => {
          alert('Menunggu pembayaran...')
        },
        onError: () => {
          alert('Pembayaran gagal')
        },
        onClose: () => {
          setPaying(null)
        },
      })
    } catch (error) {
      console.error('Payment error:', error)
      alert('Gagal memproses pembayaran')
    } finally {
      setPaying(null)
    }
  }

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Semua' || doc.specialization.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return <LoadingScreen message="Mencari Dokter Terbaik..." />;
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />

      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header & Search */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-xl border border-border/50">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Konsultasi Spesialis</h1>
                <p className="text-slate-500 font-medium text-sm">Pilih dokter terverifikasi untuk Bunda 🩺</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-sea-green/5 px-4 py-2 rounded-2xl border border-sea-green/10">
               <ShieldCheck className="w-5 h-5 text-sea-green" />
               <span className="text-xs font-bold text-sea-green uppercase tracking-wider">Terverifikasi SIP & STR</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Cari nama dokter atau spesialisasi..." 
                className="pl-12 h-14 rounded-2xl border-0 shadow-xl shadow-slate-200/50 bg-white font-medium focus-visible:ring-cerulean"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
               {categories.map(cat => (
                 <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl h-14 px-6 font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-cerulean hover:bg-cerulean/90 shadow-lg shadow-cerulean/20' 
                      : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                  }`}
                 >
                   {cat}
                 </Button>
               ))}
            </div>
          </div>
        </section>

        {/* Info Card */}
        <Card className="p-6 rounded-[2rem] border-0 shadow-2xl shadow-cerulean/5 bg-gradient-to-r from-cerulean to-cerulean/90 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
               <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
               <h3 className="text-xl font-extrabold mb-1">Sesi Konsultasi Berdurasi 1 Jam</h3>
               <p className="text-white/80 text-sm font-medium">Bunda mendapatkan waktu eksklusif 60 menit dengan spesialis pilihan Bunda untuk tanya jawab detail.</p>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </Card>

        {/* Grid Content */}
        <section>
          <AnimatePresence mode="wait">
            {filteredDoctors.length > 0 ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredDoctors.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group p-6 rounded-[2.5rem] border-0 shadow-xl shadow-slate-200/50 bg-white hover:shadow-2xl hover:shadow-cerulean/10 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                            {doc.avatarUrl ? (
                              <img src={doc.avatarUrl} alt={doc.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-cerulean/10 text-cerulean">
                                <Users className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sea-green rounded-full border-4 border-white animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="font-extrabold text-slate-900 truncate group-hover:text-cerulean transition-colors">{doc.fullName}</h3>
                            <CheckCircle className="w-4 h-4 text-sea-green shrink-0" />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-tight truncate">{doc.specialization}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                             <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                             <span className="text-xs font-black text-slate-700">4.9</span>
                             <span className="text-[10px] font-bold text-slate-400 ml-1">(12 thn exp)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl mb-6">
                         <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-sea-green" />
                            <p className="font-black text-slate-900">Rp {doc.consultationFee.toLocaleString('id-ID')}</p>
                         </div>
                         <div className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">1 Jam</span>
                         </div>
                      </div>

                      <Button 
                        onClick={() => handlePayment(doc)}
                        disabled={paying === doc.id}
                        className="w-full rounded-2xl h-12 bg-slate-900 hover:bg-slate-800 font-bold shadow-lg shadow-slate-400/20 group"
                      >
                        {paying === doc.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <span className="flex items-center gap-2">
                            Mulai Konsultasi <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                   <AlertCircle className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Dokter Tidak Ditemukan</h2>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                  Mohon maaf Bunda, spesialis yang Bunda cari sedang tidak bertugas atau belum terdaftar.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                   <Button className="rounded-2xl h-12 px-8 bg-cerulean font-bold shadow-xl shadow-cerulean/20">
                      <Bell className="w-4 h-4 mr-2" /> Kabari Saat Online
                   </Button>
                   <Button 
                     variant="outline" 
                     onClick={() => {setSearchQuery(''); setSelectedCategory('Semua')}}
                     className="rounded-2xl h-12 px-8 border-slate-200 font-bold"
                   >
                      Reset Filter
                   </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Trust Banner */}
        <section className="pb-12">
           <Card className="p-8 rounded-[3rem] border-0 shadow-2xl shadow-cerulean/5 bg-gradient-to-br from-white to-slate-50/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-slate-100">
              <div className="w-20 h-20 rounded-[2rem] bg-cerulean/10 flex items-center justify-center shrink-0">
                 <ShieldCheck className="w-10 h-10 text-cerulean" />
              </div>
              <div>
                 <h3 className="text-xl font-extrabold text-slate-900 mb-2">Privasi Bunda Prioritas Kami</h3>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                   Sesi konsultasi Bunda bersifat privat dan rahasia. Semua catatan medis yang dibagikan hanya dapat diakses oleh Bunda dan dokter yang bersangkutan untuk mendukung tumbuh kembang optimal si kecil.
                 </p>
              </div>
              <div className="absolute bottom-[-40px] right-[-40px] w-64 h-64 bg-slate-100/50 rounded-full blur-3xl -z-10" />
           </Card>
        </section>
      </div>
    </>
  )
}
