'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Lightbulb, 
  Trophy,
  Loader2,
  X
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface Question {
  question: string
  options: string[]
  answer: number
}

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  content: string
  title: string
  day: number
}

const FALLBACK_QUIZ: Question[] = [
  {
    question: "Apa tujuan utama dari pencegahan stunting pada 1000 Hari Pertama Kehidupan (HPK)?",
    options: [
      "Optimalisasi tumbuh kembang fisik dan otak anak",
      "Hanya agar anak terlihat tinggi",
      "Mengurangi biaya makan harian",
      "Agar anak cepat bisa berjalan"
    ],
    answer: 0
  },
  {
    question: "Manakah nutrisi yang sangat krusial bagi ibu hamil untuk mencegah cacat tabung saraf janin?",
    options: [
      "Vitamin C",
      "Asam Folat",
      "Lemak Jenuh",
      "Garam Berlebih"
    ],
    answer: 1
  },
  {
    question: "Seberapa sering Bunda sebaiknya memeriksakan kandungan ke dokter atau bidan?",
    options: [
      "Hanya saat merasa sakit",
      "Satu kali selama kehamilan",
      "Rutin sesuai jadwal yang dianjurkan (minimal 6 kali)",
      "Cukup lewat chat online saja"
    ],
    answer: 2
  }
]

export function QuizModal({ isOpen, onClose, onSuccess, content, title, day }: QuizModalProps) {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentStep, setCurrentStep] = useState(0) // 0: Start, 1: Quiz, 2: Result
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)

  const fetchQuiz = async () => {
    setLoading(true)
    const controller = new AbortController()
    // Increase timeout to 25s for better reliability with free AI models
    const timeoutId = setTimeout(() => controller.abort(), 25000) 

    try {
      const response = await fetch('/api/education/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title, day }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) throw new Error('API Error')
      
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data)
        setCurrentStep(1)
      } else {
        throw new Error('Invalid quiz data')
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Quiz generation timed out, using fallback.')
      } else {
        console.error('Quiz error:', error)
      }
      // Fallback to local quiz if AI fails or times out
      setQuestions(FALLBACK_QUIZ)
      setCurrentStep(1)
    } finally {
      setLoading(false)
      clearTimeout(timeoutId)
    }
  }

  const handleAnswerSelection = (idx: number) => {
    if (isAnswered) return
    setSelectedAnswer(idx)
    setIsAnswered(true)
    if (idx === questions[currentQuestionIdx].answer) {
      setScore(s => s + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setCurrentStep(2)
    }
  }

  const isPassed = score >= 2 // At least 2 out of 3 correct

  // Better approach: use useEffect to trigger confetti when reaching result state and passed
  useEffect(() => {
    if (currentStep === 2 && isPassed) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#007E85', '#FFB800', '#FF5B5B', '#48BB78'],
        zIndex: 9999
      })
    }
  }, [currentStep, isPassed])

  const resetQuiz = () => {
    setCurrentStep(0)
    setCurrentQuestionIdx(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
  }

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetQuiz, 500)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
        <div className="relative bg-slate-50 min-h-[400px] flex flex-col">
          {/* Header/Banner */}
          <div className="bg-doccure-teal p-8 text-white relative">
             <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
             <DialogTitle className="text-xl font-black flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-doccure-yellow fill-doccure-yellow" />
                Cek Pemahaman Bunda
             </DialogTitle>
             <DialogDescription className="text-white/80 text-xs font-bold mt-1">
                Edukasi Hari ke-{day}: {title}
             </DialogDescription>
             
             {!loading && currentStep === 1 && (
               <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                    className="h-full bg-doccure-yellow" 
                  />
               </div>
             )}
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Loader2 className="w-12 h-12 text-doccure-teal animate-spin mb-4" />
                  <p className="text-sm font-bold text-slate-500">Menyiapkan kuis untuk Bunda...</p>
                </motion.div>
              ) : currentStep === 0 ? (
                <motion.div 
                  key="start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 bg-doccure-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 className="w-10 h-10 text-doccure-teal" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">Wah, hebat Bunda!</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                    Bunda sudah menyelesaikan bacaan hari ini. Selesaikan 3 pertanyaan singkat ini untuk menandai artikel sebagai &quot;Sudah Dibaca&quot;.
                  </p>
                  <Button 
                    onClick={fetchQuiz}
                    className="w-full h-12 rounded-2xl bg-doccure-teal hover:bg-doccure-dark text-white font-black shadow-lg"
                  >
                    Mulai Sekarang
                  </Button>
                </motion.div>
              ) : currentStep === 1 ? (
                <motion.div 
                  key={`q-${currentQuestionIdx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-doccure-teal uppercase tracking-widest">Pertanyaan {currentQuestionIdx + 1} dari {questions.length}</p>
                    <h4 className="text-lg font-black text-slate-900 leading-tight">
                      {questions[currentQuestionIdx].question}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {questions[currentQuestionIdx].options.map((option, idx) => {
                      const isCorrect = idx === questions[currentQuestionIdx].answer
                      const isSelected = selectedAnswer === idx
                      
                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerSelection(idx)}
                          className={cn(
                            "w-full p-4 rounded-2xl border-2 text-left text-sm font-bold transition-all relative overflow-hidden group",
                            !isAnswered && "border-slate-100 bg-white hover:border-doccure-teal/30 hover:bg-slate-50",
                            isAnswered && isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-700",
                            isAnswered && isSelected && !isCorrect && "border-rose-500 bg-rose-50 text-rose-700",
                            isAnswered && !isCorrect && !isSelected && "border-slate-50 bg-white opacity-50"
                          )}
                        >
                          <div className="flex items-center gap-3 relative z-10">
                            <span className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0",
                                !isAnswered && "bg-slate-100 text-slate-400 group-hover:bg-doccure-teal/20 group-hover:text-doccure-teal",
                                isAnswered && isCorrect && "bg-emerald-500 text-white",
                                isAnswered && isSelected && !isCorrect && "bg-rose-500 text-white"
                            )}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            {option}
                          </div>
                          {isAnswered && isCorrect && (
                            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                          )}
                          {isAnswered && isSelected && !isCorrect && (
                            <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-2"
                    >
                      <Button 
                        onClick={nextQuestion}
                        className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center gap-2"
                      >
                        {currentQuestionIdx === questions.length - 1 ? 'Lihat Hasil' : 'Lanjutkan'}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative",
                    isPassed ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-400"
                  )}>
                     {isPassed ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                     {isPassed && (
                       <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                          <CheckCircle2 className="w-4 h-4" />
                       </div>
                     )}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-1">
                    {isPassed ? 'Bunda Luar Biasa! ✨' : 'Wah, Dikit Lagi Bun! 🧩'}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 mb-8">
                    Skor Bunda: <span className="text-doccure-teal text-lg">{score}</span> / {questions.length} Benar
                  </p>

                  <div className="space-y-3">
                    {isPassed ? (
                      <Button 
                        onClick={() => {
                          onSuccess()
                          onClose()
                        }}
                        className="w-full h-12 rounded-2xl bg-doccure-teal hover:bg-doccure-dark text-white font-black shadow-lg"
                      >
                        Selesaikan Materi
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={resetQuiz}
                          className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black"
                        >
                          Coba Lagi
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={onClose}
                          className="w-full h-10 rounded-2xl text-slate-400 font-bold text-xs"
                        >
                          Nanti Saja
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative Footer */}
          <div className="p-4 bg-slate-100/50 text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100">
             Anti-Stunting Edutainment Platform
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
