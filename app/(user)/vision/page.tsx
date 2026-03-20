'use client'

import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Sparkles,
  LayoutDashboard,
  RotateCcw,
  Dna,
  Search,
  Check,
  Smartphone,
  History,
  Trash2,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { usePregnancyData } from '@/hooks/usePregnancyData'

interface AnalysisResult {
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  iron: number
  zinc: number
  calcium: number
  folicAcid: number
  vitaminA: number
  stuntingNutritionScore: number
  tip: string
  isHealthy: boolean
  isFallback?: boolean
}

interface FoodScan {
  id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  iron: number
  zinc: number
  calcium: number
  folic_acid: number
  vitamin_a: number
  stunting_nutrition_score: number
  tip: string
  is_healthy: boolean
  created_at: string
}

const NUTRITION_GOALS = {
  calories: 2500,
  protein: 70,
  carbs: 300,
  fat: 80,
  fiber: 25
}

export default function VisionPage() {
  const { profile, loading: dataLoading } = usePregnancyData()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanState, setScanState] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [scanHistory, setScanHistory] = useState<FoodScan[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [expandedScanId, setExpandedScanId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastScanId, setLastScanId] = useState<string | null>(null)

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error: fetchError } = await supabase
        .from('food_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
      if (!fetchError && data) setScanHistory(data)
    } catch { /* ignore */ } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => { loadHistory() }, [loadHistory])

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Maksimal ukuran file adalah 5MB",
          variant: "destructive"
        })
        return
      }
      setFile(selectedFile)
      setError(null)
      setScanState('idle')
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setScanState('analyzing')
    setError(null)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000)

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      const formData = new FormData()
      formData.append('image', file)
      if (currentUser) formData.append('userId', currentUser.id)

      const response = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Gagal menganalisis gambar Bunda. Silakan coba lagi nanti ya. 🙏')
      }

      const data = await response.json()
      if (data.analysis) {
        setAnalysis(data.analysis)
        setScanState('done')
        if (data.scanId) setLastScanId(data.scanId)
        loadHistory()
        
        toast({
          title: "Analisis Berhasil",
          description: "Data nutrisi telah berhasil diekstraksi."
        })
      } else {
        throw new Error('Hasil analisis tidak ditemukan')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menganalisis gambar.'
      console.error('Vision analysis error:', err)
      setError(message)
      setScanState('idle')
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      })
    }
  }

  const reset = () => {
    setFile(null)
    setAnalysis(null)
    setError(null)
    setScanState('idle')
    setLastScanId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (dataLoading && !profile) {
    return (
      <div className="min-h-screen bg-white transition-colors">
        <section className="relative pt-32 pb-24 lg:pt-36 lg:pb-32 bg-doccure-dark overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:justify-between">
              <div className="flex-1 max-w-2xl space-y-6 text-center lg:text-left">
                <Skeleton className="h-6 w-32 rounded-lg bg-white/10 mx-auto lg:mx-0" />
                <Skeleton className="h-16 w-full rounded-2xl bg-white/10" />
                <Skeleton className="h-6 w-3/4 rounded-full bg-white/10 mx-auto lg:mx-0" />
                <div className="flex gap-4 justify-center lg:justify-start">
                   <Skeleton className="h-12 w-32 rounded-xl bg-white/10" />
                   <Skeleton className="h-12 w-32 rounded-xl bg-white/10" />
                </div>
              </div>
              <Skeleton className="w-[400px] h-[460px] rounded-3xl bg-white/10 hidden lg:block" />
            </div>
          </div>
        </section>
        <section className="mx-auto -mt-10 relative z-20 max-w-[1400px] px-4 sm:px-6 lg:px-8">
           <Skeleton className="h-[500px] w-full rounded-3xl shadow-xl" />
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white  pb-24 overflow-hidden font-sans transition-colors duration-300">
      {/* Header Section - Dark Theme Consistent with Landing Page */}
      <section className="relative pt-32 pb-24 lg:pt-36 lg:pb-32 bg-doccure-dark overflow-hidden">
        {/* Background Concentric Rings (Matching Landing Page Hero) - Scattered and Vivid */}
        <div className="absolute top-[-20%] left-[-15%] w-[700px] h-[700px] border-[80px] border-[#137A74] opacity-70 rounded-full pointer-events-none" />
        <div className="absolute top-[10%] left-[75%] w-[600px] h-[600px] border-[70px] border-[#DDF247] opacity-40 rounded-full pointer-events-none" />
        <div className="absolute top-[60%] left-[-5%] w-[500px] h-[500px] border-[60px] border-[#137A74] opacity-50 rounded-full pointer-events-none" />
        
        {/* Floating Shapes to match Hero */}
        <div className="absolute top-20 right-[5%] w-16 h-16 bg-doccure-yellow/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-[5%] w-24 h-8 bg-doccure-teal/20 rounded-full rotate-[-30deg] blur-lg animate-pulse" />
        
        {/* Floating Food Images */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="absolute top-[15%] left-[10%] w-32 h-32 md:w-48 md:h-48 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 z-10 hidden md:block"
        >
          <Image src="/images/food/avocado_nobg.png" alt="Floating Avocado" fill className="object-contain drop-shadow-2xl" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }} 
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
          className="absolute bottom-[10%] left-[40%] w-40 h-40 md:w-56 md:h-56 opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 z-10 hidden lg:block"
        >
          <Image src="/images/food/salad_nobg.png" alt="Floating Salad" fill className="object-contain drop-shadow-2xl" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, delay: 2 }}
          className="absolute top-[25%] right-[2%] w-28 h-28 md:w-40 md:h-40 opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 z-10 hidden lg:block"
        >
          <Image src="/images/food/milk_nobg.png" alt="Floating Milk" fill className="object-contain drop-shadow-2xl" />
        </motion.div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:justify-between">
            {/* Left side: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 max-w-2xl text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Analisis Nutrisi Mandiri dengan <br/>
                <span className="text-doccure-yellow relative">
                  GENTING Vision.
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg text-white/70 font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                Teknologi AI tercanggih untuk mendeteksi profil nutrisi makanan hanya dari satu foto. Pastikan asupan gizi Bunda & Si Kecil selalu terjaga.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-doccure-teal/20 flex items-center justify-center border border-doccure-teal/30">
                    <Smartphone className="w-5 h-5 text-doccure-teal" />
                  </div>
                  <span className="text-sm font-bold text-white/80">Ambil Foto</span>
                </div>
                <div className="w-px h-6 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-doccure-teal/20 flex items-center justify-center border border-doccure-teal/30">
                    <Search className="w-5 h-5 text-doccure-teal" />
                  </div>
                  <span className="text-sm font-bold text-white/80">Analisis AI</span>
                </div>
                <div className="w-px h-6 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-doccure-teal/20 flex items-center justify-center border border-doccure-teal/30">
                    <Check className="w-5 h-5 text-doccure-teal" />
                  </div>
                  <span className="text-sm font-bold text-white/80">Rekomendasi</span>
                </div>
              </div>
            </motion.div>

            {/* Right side: Upload/Scan Interactive Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="relative group p-1">
                <div className="absolute inset-0 bg-doccure-teal/30 rounded-3xl blur-3xl group-hover:bg-doccure-teal/40 transition-colors duration-700" />
                
                <div className="relative bg-[#0a2f2d]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden min-h-[460px] flex flex-col items-center justify-center">
                  
                  <AnimatePresence mode="wait">
                    {scanState === 'idle' && (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center w-full"
                      >
                        <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-8 cursor-pointer group/upload" onClick={() => fileInputRef.current?.click()}>
                          {file ? (
                            <div className="relative w-full h-full rounded-3xl overflow-hidden ring-4 ring-white/20 ring-offset-4 ring-offset-doccure-dark">
                              {previewUrl ? (
                                <Image
                                  src={previewUrl}
                                  alt="Preview makanan"
                                  fill
                                  unoptimized
                                  sizes="280px"
                                  className="object-cover"
                                />
                              ) : null}
                              <div className="absolute inset-0 bg-doccure-dark/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                <RotateCcw className="text-white w-8 h-8" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all">
                              <div className="w-20 h-20 rounded-2xl bg-doccure-yellow/10 flex items-center justify-center shadow-inner group-hover/upload:scale-110 transition-transform">
                                <Camera className="w-10 h-10 text-doccure-yellow" />
                              </div>
                              <div>
                                <p className="text-white font-bold text-lg">Pilih Foto Makanan</p>
                                <p className="text-white/40 text-xs mt-1">PNG, JPG, WebP up to 5MB</p>
                              </div>
                            </div>
                          )}
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </div>

                        {file && (
                          <Button 
                            onClick={handleAnalyze}
                            className="w-full h-14 bg-doccure-yellow hover:bg-[#cbe33a] text-doccure-dark rounded-2xl font-black text-base shadow-xl group transition-all"
                          >
                            Mulai Analisis AI
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        )}
                        {!file && (
                          <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Ready for scanning</div>
                        )}
                        {error && <p className="mt-3 text-xs font-bold text-red-300">{error}</p>}
                      </motion.div>
                    )}

                    {scanState === 'analyzing' && (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center w-full py-10"
                      >
                        <div className="relative w-56 h-56 mx-auto mb-10 flex items-center justify-center">
                          <div className="absolute inset-0 border-[8px] border-doccure-teal/20 rounded-full scale-110" />
                          <div className="absolute inset-0 border-4 border-doccure-teal border-t-transparent rounded-full animate-spin" />
                          
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-32 h-32 bg-doccure-teal/20 rounded-full blur-2xl absolute"
                          />
                          
                          <Dna className="w-20 h-20 text-doccure-teal animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Mengidentifikasi Nutrisi...</h3>
                        <p className="text-white/40 text-sm">GENTING Vision sedang mengekstraksi data nutrisi dari makanan Bunda.</p>
                      </motion.div>
                    )}

                    {scanState === 'done' && (
                      <motion.div
                        key="done"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center w-full"
                      >
                        <div className="w-24 h-24 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 underline decoration-doccure-yellow decoration-4 underline-offset-8">Analisis Selesai!</h3>
                        <p className="text-white/60 mb-8 font-medium">Data nutrisi telah berhasil diproses.</p>
                        
                        <Button 
                          onClick={() => document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' })}
                          className="w-full h-14 bg-white hover:bg-white/90 text-doccure-dark rounded-2xl font-black text-base shadow-xl mb-4"
                        >
                          Lihat Detail Laporan
                        </Button>
                        <Button variant="ghost" onClick={reset} className="text-white/60 hover:text-white font-bold h-12">
                          Mulai Analisis Baru
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Container / Analysis Results Area */}
      <div id="analysis-results" className="max-w-[1400px] mx-auto px-4 -mt-10 sm:px-6 lg:px-8 relative z-20">
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Analysis Overview Card */}
              <div className="bg-white  rounded-2xl border border-slate-100  shadow-[0_24px_54px_rgba(15,23,42,0.1)] p-8 lg:p-12 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                <div className="flex flex-col lg:flex-row gap-12 lg:items-center relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-doccure-teal text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl">Verified Analysis</span>
                      {analysis && analysis.isFallback ? (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border border-amber-200">Local Safety</span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border border-emerald-200">AI Powered</span>
                      )}
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900  leading-tight tracking-tighter">
                      Profil Nutrisi <br/>
                      <span className="text-doccure-teal italic underline decoration-doccure-yellow decoration-8 underline-offset-2">{analysis.foodName}</span>.
                    </h2>
                    <p className="mt-8 text-lg font-medium text-slate-500 leading-relaxed max-w-xl">
                      Berdasarkan analisis visual GENTING+, hidangan ini mengandung komponen mikronutrisi penting untuk Si Kecil.
                    </p>
                    
                    <div className="mt-10 flex flex-wrap gap-4">
                      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                          <Zap size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Energi</p>
                          <p className="text-2xl font-black text-slate-900  transition-colors">{analysis.calories} Kcal</p>
                        </div>
                      </div>
                      <div className="bg-slate-900 rounded-2xl p-5 flex items-center gap-4 text-white shadow-xl">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-doccure-teal shadow-inner">
                          <Sparkles size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Nutrisi Score</p>
                          <p className="text-2xl font-black">{analysis.stuntingNutritionScore}/100</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-1/3 flex flex-col items-center justify-center text-center p-8 bg-slate-50  rounded-2xl border border-slate-100  relative group/score overflow-hidden">
                    <div className="h-48 w-48 mb-6 relative">
                        <svg className="h-full w-full transform -rotate-90">
                           <circle cx="96" cy="96" r="88" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                           <motion.circle
                              cx="96"
                              cy="96"
                              r="88"
                              stroke="currentColor"
                              strokeWidth="12"
                              strokeDasharray={553}
                              initial={{ strokeDashoffset: 553 }}
                              animate={{ strokeDashoffset: 553 - (553 * analysis.stuntingNutritionScore) / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              fill="transparent"
                              className="text-doccure-teal"
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <div className="flex flex-col items-center">
                             <span className="text-4xl font-black text-slate-900 ">{analysis.stuntingNutritionScore}%</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                           </div>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900  uppercase tracking-widest leading-none mb-1">Status Gizi</p>
                    <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">{analysis.stuntingNutritionScore > 70 ? 'SANGAT OPTIMAL' : 'PERLU TAMBAHAN'}</p>
                  </div>
                </div>
              </div>

              {/* Nutritional Grid Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white  rounded-2xl border border-slate-100  shadow-sm p-8 flex flex-col">
                  <h3 className="text-2xl font-black text-slate-900  mb-8 flex items-center justify-between">
                    Makronutrisi
                    <div className="h-1.5 w-8 rounded-full bg-doccure-teal" />
                  </h3>
                  
                  <div className="space-y-10 flex-1">
                    {[
                      { label: 'Protein', value: analysis.protein, goal: NUTRITION_GOALS.protein, unit: 'g', color: 'bg-doccure-teal' },
                      { label: 'Karbohidrat', value: analysis.carbs, goal: NUTRITION_GOALS.carbs, unit: 'g', color: 'bg-amber-500' },
                      { label: 'Lemak', value: analysis.fat, goal: NUTRITION_GOALS.fat, unit: 'g', color: 'bg-indigo-500' },
                    ].map((macro) => {
                      const percentage = Math.min(100, Math.round((macro.value / macro.goal) * 100))
                      return (
                        <div key={macro.label}>
                          <div className="flex justify-between items-end mb-3">
                            <div>
                               <p className="text-sm font-black text-slate-900  uppercase tracking-wider">{macro.label}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-black text-slate-900 ">{macro.value}{macro.unit}</p>
                            </div>
                          </div>
                          <div className="h-3 bg-slate-100  rounded-full overflow-hidden p-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full ${macro.color} rounded-full`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#1e293b] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                      <div className="p-2 bg-doccure-yellow rounded-xl">
                        <CheckCircle2 size={18} className="text-doccure-dark" />
                      </div>
                      Rekomendasi Ahli
                    </h3>
                    
                    <div className="flex-1">
                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-8">
                        <p className="text-lg font-medium text-white/90 leading-relaxed italic">
                          &ldquo;{analysis.tip}&rdquo;
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-4 group">
                           <div className="h-6 w-1 rounded-full bg-emerald-500 shrink-0" />
                           <p className="text-sm font-bold text-white/70 uppercase tracking-wide">
                              {analysis.isHealthy ? 'Direkomendasikan' : 'Perhatikan Porsi'}
                           </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-8 flex gap-4">
                       <Button 
                         disabled={!!lastScanId || isSaving} 
                         onClick={async () => {
                           if (!analysis || lastScanId) return
                           setIsSaving(true)
                           try {
                             const { data: { user } } = await supabase.auth.getUser()
                             if (!user) { toast({ title: 'Error', description: 'Silakan login terlebih dahulu', variant: 'destructive' }); return }
                             const res = await fetch('/api/ai/save-scan', {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify({ userId: user.id, analysis })
                             })
                             const result = await res.json()
                             if (!res.ok) throw new Error(result.error || 'Gagal menyimpan')
                             if (result.scanId) setLastScanId(result.scanId)
                             loadHistory()
                             toast({ title: 'Tersimpan!', description: 'Laporan berhasil disimpan ke riwayat Bunda.' })
                           } catch { toast({ title: 'Gagal Menyimpan', description: 'Tidak dapat menyimpan laporan saat ini.', variant: 'destructive' }) } finally { setIsSaving(false) }
                         }}
                         className="flex-1 bg-doccure-teal hover:bg-doccure-dark text-white rounded-xl h-11 font-bold disabled:opacity-50"
                       >
                           {lastScanId ? '✓ Tersimpan' : isSaving ? 'Menyimpan...' : 'Simpan Laporan'}
                       </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {!analysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
              <div className="bg-white  rounded-2xl border border-slate-100  shadow-sm p-12 text-center relative overflow-hidden">
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-24 h-24 bg-slate-50  border border-slate-100  rounded-3xl flex items-center justify-center mx-auto mb-8 transition-colors">
                    <LayoutDashboard className="w-10 h-10 text-slate-200  transition-colors" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900  tracking-tight">Siap Menganalisis.</h3>
                  <p className="mt-4 text-[17px] font-medium text-slate-500 leading-relaxed">
                    Unggah foto hidangan Bunda untuk mendeteksi nutrisi secara instan.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 lg:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-doccure-teal/10 flex items-center justify-center">
                  <History className="w-5 h-5 text-doccure-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Riwayat Scan</h3>
                  <p className="text-xs text-slate-400 font-medium">{scanHistory.length} hasil analisis</p>
                </div>
              </div>
            </div>

            {historyLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : scanHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold">Belum ada riwayat scan.</p>
                <p className="text-slate-300 text-sm mt-1">Mulai analisis makanan pertama Bunda!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scanHistory.map((scan) => {
                  const isExpanded = expandedScanId === scan.id
                  const scoreColor = scan.stunting_nutrition_score > 70 ? 'text-emerald-500' : scan.stunting_nutrition_score > 40 ? 'text-amber-500' : 'text-red-500'
                  const scoreBg = scan.stunting_nutrition_score > 70 ? 'bg-emerald-50' : scan.stunting_nutrition_score > 40 ? 'bg-amber-50' : 'bg-red-50'
                  return (
                    <motion.div
                      key={scan.id}
                      layout
                      className="border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 transition-colors"
                    >
                      <button
                        onClick={() => setExpandedScanId(isExpanded ? null : scan.id)}
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/50 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl ${scoreBg} flex items-center justify-center shrink-0`}>
                          <span className={`text-sm font-black ${scoreColor}`}>{scan.stunting_nutrition_score}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{scan.food_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-300" />
                            <span className="text-xs text-slate-400">
                              {new Date(scan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-bold text-slate-500">{scan.calories} kcal</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-slate-100 pt-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                {[
                                  { label: 'Protein', value: `${scan.protein}g` },
                                  { label: 'Karbo', value: `${scan.carbs}g` },
                                  { label: 'Lemak', value: `${scan.fat}g` },
                                  { label: 'Zat Besi', value: `${scan.iron}mg` },
                                  { label: 'Zinc', value: `${scan.zinc}mg` },
                                  { label: 'Kalsium', value: `${scan.calcium}mg` },
                                  { label: 'Asam Folat', value: `${scan.folic_acid}mcg` },
                                  { label: 'Vit A', value: `${scan.vitamin_a}mcg` },
                                ].map(n => (
                                  <div key={n.label} className="bg-slate-50 rounded-lg p-2.5 text-center">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{n.label}</p>
                                    <p className="text-sm font-black text-slate-900">{n.value}</p>
                                  </div>
                                ))}
                              </div>
                              {scan.tip && (
                                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                  <p className="text-xs text-slate-500 italic">&ldquo;{scan.tip}&rdquo;</p>
                                </div>
                              )}
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 text-xs h-8"
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    const { error: delErr } = await supabase.from('food_scans').delete().eq('id', scan.id)
                                    if (!delErr) {
                                      setScanHistory(prev => prev.filter(s => s.id !== scan.id))
                                      toast({ title: 'Dihapus', description: 'Riwayat scan berhasil dihapus.' })
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
