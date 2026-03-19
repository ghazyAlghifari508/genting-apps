'use client'

import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ArrowRight, ArrowLeft, Baby, Heart, CalendarIcon, Check, Users, Mail } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { UserStatus, calculateCurrentDay } from '@/types/education'
import { cn } from '@/lib/utils'

export interface OnboardingFormData {
  status: UserStatus
  pregnancyMonth?: number
  pregnancyWeek?: number
  dueDate?: Date
  weight?: number
  height?: number
  childName?: string
  childBirthDate?: Date
  childWeight?: number
  childHeight?: number
  currentDay: number
}

interface OnboardingFormProps {
  onComplete: (data: OnboardingFormData) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<UserStatus | null>(null)
  const [pregnancyMonth, setPregnancyMonth] = useState<number | undefined>()
  const [pregnancyWeek, setPregnancyWeek] = useState<string>('')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [weight, setWeight] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [childName, setChildName] = useState<string>('')
  const [childBirthDate, setChildBirthDate] = useState<Date | undefined>()
  const [childWeight, setChildWeight] = useState<string>('')
  const [childHeight, setChildHeight] = useState<string>('')

  // Auto-calculate HPL based on month and week
  useEffect(() => {
    if (status === 'hamil') {
      const month = pregnancyMonth ?? -1
      const week = pregnancyWeek ? parseInt(pregnancyWeek) : 0
      
      if (month !== -1 && week > 0) {
        const currentDay = (month * 4 + (week - 1)) * 7 + 1
        const daysRemaining = 280 - currentDay
        
        if (daysRemaining >= 0) {
          setDueDate(addDays(new Date(), daysRemaining))
        }
      }
    }
  }, [pregnancyMonth, pregnancyWeek, status])

  const totalSteps = 3

  const steps = useMemo(() => ([
    { id: 1, title: 'Data Bunda', desc: 'Profil kehamilan atau si kecil', icon: Heart },
    { id: 2, title: 'Lengkapi Detail', desc: 'Isi data penting untuk rekomendasi', icon: Baby },
    { id: 3, title: 'Selesai', desc: 'Mulai perjalanan 1000 HPK', icon: Check }
  ]), [])

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    if (!status) return

    const currentDay = calculateCurrentDay(status, pregnancyMonth, childBirthDate, pregnancyWeek ? parseInt(pregnancyWeek) : undefined)

    onComplete({
      status,
      pregnancyMonth,
      pregnancyWeek: pregnancyWeek ? parseInt(pregnancyWeek) : undefined,
      dueDate,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      childName,
      childBirthDate,
      childWeight: childWeight ? parseFloat(childWeight) : undefined,
      childHeight: childHeight ? parseFloat(childHeight) : undefined,
      currentDay
    })
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return status !== null
      case 2:
        if (status === 'hamil') {
          return pregnancyMonth !== undefined && pregnancyWeek !== '' && dueDate !== undefined
        }
        if (status === 'punya_anak') {
          return childName !== '' && childBirthDate !== undefined
        }
        return false
      case 3:
        return true
      default:
        return false
    }
  }

  const getCurrentDay = () => {
    if (!status) return 1
    return calculateCurrentDay(status, pregnancyMonth, childBirthDate, pregnancyWeek ? parseInt(pregnancyWeek) : undefined)
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-[640px]">
        {/* Sidebar */}
        <aside className="bg-slate-50 px-6 py-8 border-r border-slate-100 relative">
          <div className="flex items-center gap-2 mb-10">
            <div className="flex items-center justify-center h-12 overflow-visible">
              <Image 
                src="/images/unsplash/logo-rembg.png" 
                alt="Genting Logo" 
                width={100} 
                height={100} 
                className="w-[80px] h-[80px] scale-[1.3] object-contain drop-shadow-md" 
              />
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((s) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isDone = step > s.id
              return (
                <div key={s.id} className="flex items-start gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center border',
                    isActive ? 'bg-cerulean text-white border-cerulean' :
                    isDone ? 'bg-sea-green text-cerulean border-sea-green' :
                    'bg-white text-slate-400 border-slate-200'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={cn('text-sm font-semibold', isActive ? 'text-slate-900' : 'text-slate-500')}>{s.title}</p>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-400">
            <button type="button" className="hover:text-slate-600">Kembali ke beranda</button>
            <button type="button" className="hover:text-slate-600">Masuk</button>
          </div>
        </aside>

        {/* Content */}
        <div className="px-8 md:px-12 py-10 flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl mx-auto"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Profil Awal</h2>
                    <p className="text-sm text-slate-500 mt-2">Pilih kondisi untuk menyesuaikan panduan Genting.</p>
                  </div>

                  <RadioGroup
                    value={status || ''}
                    onValueChange={(value: string) => setStatus(value as UserStatus)}
                    className="grid grid-cols-1 gap-4"
                  >
                    <label
                      htmlFor="hamil"
                      className={cn(
                        'flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all',
                        status === 'hamil' ? 'border-cerulean bg-cerulean/5' : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <RadioGroupItem value="hamil" id="hamil" className="sr-only" />
                      <div className="w-12 h-12 rounded-xl bg-cerulean/10 text-cerulean flex items-center justify-center">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Sedang Hamil</p>
                        <p className="text-xs text-slate-500">Mulai pendampingan 1000 HPK sejak awal</p>
                      </div>
                    </label>

                    <label
                      htmlFor="punya_anak"
                      className={cn(
                        'flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all',
                        status === 'punya_anak' ? 'border-doccure-teal bg-doccure-teal/5' : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <RadioGroupItem value="punya_anak" id="punya_anak" className="sr-only" />
                      <div className="w-12 h-12 rounded-xl bg-cerulean/10 text-cerulean flex items-center justify-center">
                        <Baby className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Punya Balita</p>
                        <p className="text-xs text-slate-500">Pantau tumbuh kembang anak secara berkala</p>
                      </div>
                    </label>
                  </RadioGroup>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl mx-auto"
                >
                  {status === 'hamil' ? (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Detail Kehamilan</h2>
                        <p className="text-sm text-slate-500 mt-2">Isi data untuk rekomendasi nutrisi dan kontrol.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500">Bulan Kehamilan</Label>
                          <Select
                            value={pregnancyMonth?.toString() || ""}
                            onValueChange={(value: string) => setPregnancyMonth(parseInt(value))}
                          >
                            <SelectTrigger className="w-full h-11 rounded-xl border-slate-200">
                              <SelectValue placeholder="Pilih bulan" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100">
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((month) => (
                                <SelectItem key={month} value={month.toString()} className="rounded-lg">
                                  Bulan {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500">Minggu (wajib)</Label>
                          <input
                            type="number"
                            min="1"
                            max="4"
                            placeholder="Contoh: 1"
                            className="w-full h-11 rounded-xl border border-slate-200 px-3"
                            value={pregnancyWeek}
                            onChange={(e) => setPregnancyWeek(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500">Perkiraan Lahir (HPL)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full h-11 rounded-xl border-slate-200 justify-start',
                                !dueDate && 'text-slate-400'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-doccure-teal" />
                              {dueDate ? format(dueDate, 'PPP', { locale: idLocale }) : 'Pilih tanggal'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl" align="center">
                            <Calendar
                              mode="single"
                              selected={dueDate}
                              onSelect={setDueDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500">Berat Badan (kg)</Label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Contoh: 60"
                            className="w-full h-11 rounded-xl border border-slate-200 px-3"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500">Tinggi (cm)</Label>
                          <input
                            type="number"
                            placeholder="160"
                            className="w-full h-11 rounded-xl border border-slate-200 px-3"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Detail Si Kecil</h2>
                        <p className="text-sm text-slate-500 mt-2">Isi data untuk pemantauan tumbuh kembang.</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500">Nama Si Kecil</Label>
                        <input
                          type="text"
                          placeholder="Nama panggilan"
                          className="w-full h-11 rounded-xl border border-slate-200 px-3"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500">Tanggal Lahir</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full h-11 rounded-xl border-slate-200 justify-start',
                                !childBirthDate && 'text-slate-400'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-doccure-teal" />
                              {childBirthDate ? format(childBirthDate, 'PPP', { locale: idLocale }) : 'Pilih tanggal'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl" align="center">
                            <Calendar
                              mode="single"
                              selected={childBirthDate}
                              onSelect={setChildBirthDate}
                              disabled={(date) => date > new Date() || date < new Date(new Date().setFullYear(new Date().getFullYear() - 2))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500">Berat (kg)</Label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="3.2"
                            className="w-full h-11 rounded-xl border border-slate-200 px-3"
                            value={childWeight}
                            onChange={(e) => setChildWeight(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500">Tinggi (cm)</Label>
                          <input
                            type="number"
                            placeholder="50"
                            className="w-full h-11 rounded-xl border border-slate-200 px-3"
                            value={childHeight}
                            onChange={(e) => setChildHeight(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl mx-auto text-center"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Selamat Datang!</h2>
                  <p className="text-sm text-slate-500 mt-2">GENTING siap mendampingi perjalanan 1000 HPK.</p>

                  <div className="mt-8 rounded-2xl overflow-hidden border border-slate-100">
                    <Image
                      src="/images/unsplash/img_60a01e01.png"
                      alt="Pendampingan Genting"
                      width={1200}
                      height={224}
                      className="w-full h-56 object-cover"
                    />
                  </div>

                  <div className="mt-6 p-5 rounded-2xl bg-cerulean text-white">
                    <p className="text-xs uppercase tracking-wider text-white/70">Perjalanan Dimulai</p>
                    <p className="text-3xl font-bold">Hari ke-{getCurrentDay()}</p>
                    <p className="text-xs text-white/80">Menuju 1000 Hari Generasi Sehat</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 w-10 rounded-full',
                      step === i + 1 ? 'bg-cerulean' : 'bg-slate-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">Langkah {step} dari {totalSteps}</span>
            </div>

            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="h-11 px-5 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              )}

              <Button
                onClick={step < totalSteps ? handleNext : handleComplete}
                disabled={!canProceed()}
                className="h-11 px-6 rounded-xl bg-cerulean hover:bg-cerulean/90 text-white"
              >
                {step < totalSteps ? 'Lanjutkan' : 'Selesai'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
