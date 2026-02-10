'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Camera, 
  Upload, 
  X, 
  Loader2,
  Sparkles,
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Target,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  AlertTriangle,
  CircleDot,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect'
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input'
import { MagicCard } from '@/components/ui/magic-card'

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
  vitaminA?: number
  stuntingNutritionScore: number
  tip: string
  isHealthy: boolean
}

export default function VisionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const placeholders = [
    "Apa ini aman untuk ibu hamil?",
    "Cek nutrisi dalam produk ini...",
    "Apakah ada bahan berbahaya di sini?",
    "Berapa kadar gula dalam minuman ini?",
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      await performAnalysis(selectedFile)
    }
  }

  const performAnalysis = async (targetFile: File) => {
    setUploading(true)
    setScanning(true)
    setError(null)

    try {
      const { data: { user } } = await createClient().auth.getUser()
      if (!user) throw new Error('Silakan login untuk menggunakan Vision')

      // Use FormData as expected by the API
      const formData = new FormData()
      formData.append('image', targetFile)
      formData.append('userId', user.id)

      const response = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Gagal menganalisis gambar')
      }

      const result = await response.json()
      if (result.success && result.analysis) {
        setAnalysis(result.analysis)
        toast({
          title: "Analisis Berhasil",
          description: "GENTING Vision telah selesai memindai produk Anda.",
        })
      } else {
        throw new Error('Hasil analisis tidak valid')
      }
    } catch (err: any) {
      setError(err.message)
      toast({
        variant: "destructive",
        title: "Ups! Ada kesalahan",
        description: err.message,
      })
    } finally {
      setUploading(false)
      setTimeout(() => setScanning(false), 1500)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-cerulean/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-cerulean" />
             </div>
             <span className="text-xs font-black text-cerulean uppercase tracking-[0.3em]">AI-Powered Scanner</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-2">
            GENTING <span className="gradient-text">Vision</span>
          </h1>
          <p className="text-slate-500 font-bold text-lg max-w-xl">
            Deteksi nutrisi & keamanan produk secara instan dengan kecerdasan buatan terapan HPK.
          </p>
        </motion.div>

        <div className="hidden md:block">
           <PlaceholdersAndVanishInput 
              placeholders={placeholders}
              onChange={() => {}}
              onSubmit={(e: React.FormEvent) => e.preventDefault()}
           />
        </div>
      </section>

      {/* Main Scanner Area */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
          <MagicCard className="relative overflow-hidden min-h-[500px] flex items-center justify-center bg-slate-50">
            <AnimatePresence>
              {scanning && (
                <motion.div 
                  key="scanning-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20"
                >
                  <CanvasRevealEffect
                    animationSpeed={3}
                    containerClassName="bg-black"
                    colors={[[34, 124, 157]]}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-48 h-48 rounded-full border-4 border-cerulean/50 flex items-center justify-center bg-cerulean/10 backdrop-blur-xl"
                    >
                       <Zap className="w-16 h-16 text-cerulean animate-pulse" />
                    </motion.div>
                    <p className="text-white font-black text-2xl mt-8 tracking-widest uppercase">Menganalisis Molekul...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!analysis && !scanning && (
              <div className="relative z-10 w-full max-w-2xl px-8">
                <label className="group block cursor-pointer">
                  <div className="flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-[4rem] py-24 transition-all group-hover:border-cerulean/30 group-hover:bg-cerulean/5">
                    <div className="w-24 h-24 rounded-3xl bg-cerulean flex items-center justify-center shadow-2xl shadow-cerulean/20 mb-8 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Ambil Foto Produk</h2>
                    <p className="text-slate-400 font-bold text-lg mb-8 text-center max-w-sm">
                      Scan label nutrisi atau bahan makanan Bunda hari ini.
                    </p>
                    <div 
                      className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg flex items-center justify-center transition-all active:scale-95 shadow-xl shadow-slate-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Pilih dari Galeri
                    </div>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleUpload} 
                  />
                </label>
              </div>
            )}

            {analysis && !scanning && (
              <div className="w-full h-full p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500 relative z-10 bg-white overflow-y-auto max-h-[800px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
                  <div className="space-y-8">
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 h-[350px]">
                      {file && <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-white/70 font-black text-[10px] uppercase tracking-widest mb-2">Analisis AI Selesai</p>
                        <h3 className="text-white text-3xl font-black">{analysis.foodName}</h3>
                      </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Skor Nutrisi Bunda</p>
                          <div className={`text-6xl font-black ${
                            analysis.stuntingNutritionScore >= 80 ? 'text-sea-green' : 
                            analysis.stuntingNutritionScore >= 60 ? 'text-cerulean' : 'text-grapefruit'
                          }`}>
                            {analysis.stuntingNutritionScore} <span className="text-xl text-slate-300">/ 100</span>
                          </div>
                        </div>
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
                          analysis.stuntingNutritionScore >= 70 ? 'bg-sea-green/10 text-sea-green' : 'bg-grapefruit/10 text-grapefruit'
                        }`}>
                          {analysis.stuntingNutritionScore >= 70 ? <ShieldCheck className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">{analysis.tip}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-8">
                    <div className="space-y-4">
                      <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Rincian Nutrisi:</p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Energi', value: analysis.calories, unit: 'kkal', icon: Flame, color: 'text-grapefruit', bg: 'bg-grapefruit/10' },
                          { label: 'Protein', value: analysis.protein, unit: 'g', icon: Beef, color: 'text-cerulean', bg: 'bg-cerulean/10' },
                          { label: 'Karbo', value: analysis.carbs, unit: 'g', icon: Wheat, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                          { label: 'Lemak', value: analysis.fat, unit: 'g', icon: Droplets, color: 'text-sea-green', bg: 'bg-sea-green/10' },
                        ].map((item, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                              <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <p className="text-sm font-bold text-slate-400">{item.label}</p>
                            <p className="text-xl font-black text-slate-900">{item.value} <span className="text-xs font-medium text-slate-400">{item.unit}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Mikronutrisi Esensial:</p>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { name: 'Zat Besi', value: analysis.iron, unit: 'mg' },
                          { name: 'Zinc', value: analysis.zinc, unit: 'mg' },
                          { name: 'Kalsium', value: analysis.calcium, unit: 'mg' },
                          { name: 'Asam Folat', value: analysis.folicAcid, unit: 'mcg' },
                        ].map((n, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                   <CircleDot className="w-4 h-4 text-cerulean" />
                                </div>
                                <span className="text-sm font-bold text-slate-600">{n.name}</span>
                             </div>
                             <span className="text-sm font-black text-slate-900">{n.value} {n.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                       <Button onClick={() => { setAnalysis(null); setFile(null); }} variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 font-black text-sm">
                          Scan Ulang
                       </Button>
                       <Button className="flex-1 h-14 rounded-2xl bg-cerulean hover:bg-cerulean/90 text-white font-black text-sm shadow-xl shadow-cerulean/20">
                          Simpan Riwayat
                       </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </MagicCard>
        </div>
      </section>

      {/* Benefits / Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: ShieldCheck, title: 'Keamanan Grade Medis', desc: 'AI terlatih dengan dataset nutrisi medis.' },
          { icon: Zap, title: 'Analisis Real-time', desc: 'Hasil didapat dalam hitungan detik.' },
          { icon: Heart, title: 'Fokus HPK', desc: 'Dioptimalkan untuk 1000 Hari Pertama Kehidupan.' },
          { icon: Camera, title: 'Input Mudah', desc: 'Cukup foto dan biarkan AI bekerja.' }
        ].map((item, i) => (
          <MagicCard key={i} className="p-6">
             <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-slate-400" />
             </div>
             <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
             <p className="text-xs font-bold text-slate-500 leading-relaxed">{item.desc}</p>
          </MagicCard>
        ))}
      </section>
    </div>
  )
}
