'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowRight, ArrowLeft, Baby, Heart, CalendarIcon, Check, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { UserStatus, calculateCurrentDay } from '@/types/education';
import { cn } from '@/lib/utils';

interface OnboardingFormProps {
  onComplete: (data: {
    status: UserStatus;
    pregnancyMonth?: number;
    childBirthDate?: Date;
    currentDay: number;
  }) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [pregnancyMonth, setPregnancyMonth] = useState<number | undefined>();
  const [childBirthDate, setChildBirthDate] = useState<Date | undefined>();

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (!status) return;
    
    const currentDay = calculateCurrentDay(status, pregnancyMonth, childBirthDate);
    
    onComplete({
      status,
      pregnancyMonth,
      childBirthDate,
      currentDay
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return status !== null;
      case 2:
        if (status === 'hamil') return pregnancyMonth !== undefined;
        if (status === 'punya_anak') return childBirthDate !== undefined;
        return false;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getCurrentDay = () => {
    if (!status) return 1;
    return calculateCurrentDay(status, pregnancyMonth, childBirthDate);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cerulean via-sea-green to-cerulean" />
        
        <CardHeader className="text-center pt-10 pb-6">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-cerulean/10 flex items-center justify-center relative shadow-inner"
          >
            <Baby className="w-10 h-10 text-cerulean" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-sea-green rounded-full flex items-center justify-center border-2 border-white">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </motion.div>
          
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Halo, Bunda!</CardTitle>
          <CardDescription className="text-slate-500 font-medium text-lg mt-2 px-6">
            Bantu kami menyesuaikan panduan untuk si kecil
          </CardDescription>
          
          {/* Custom Progress Tracker */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500",
                    s === step 
                      ? "bg-cerulean text-white shadow-lg shadow-cerulean/20 scale-110" 
                      : s < step 
                        ? "bg-sea-green text-white" 
                        : "bg-slate-100 text-slate-400"
                  )}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={cn(
                    "w-8 h-1 transition-colors duration-500 rounded-full mx-1",
                    s < step ? "bg-sea-green" : "bg-slate-100"
                  )} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 px-10 pb-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="font-bold text-xl text-slate-800">Bagaimana kondisi Bunda?</h3>
                </div>
                
                <RadioGroup
                  value={status || ''}
                  onValueChange={(value) => setStatus(value as UserStatus)}
                  className="grid grid-cols-1 gap-4"
                >
                  <label
                    htmlFor="hamil"
                    className={cn(
                      "flex items-center gap-5 p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300",
                      status === 'hamil' 
                        ? "border-cerulean bg-cerulean/5 shadow-inner" 
                        : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                    )}
                  >
                    <RadioGroupItem value="hamil" id="hamil" className="sr-only" />
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                      status === 'hamil' ? "bg-cerulean text-white shadow-lg" : "bg-white text-rose-400"
                    )}>
                      <Heart className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <span className="font-black text-slate-900 block text-lg">Sedang Hamil</span>
                      <p className="text-sm font-medium text-slate-400">
                        Memulai persiapan menyambut buah hati
                      </p>
                    </div>
                    {status === 'hamil' && <div className="w-6 h-6 rounded-full bg-cerulean flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                  </label>
                  
                  <label
                    htmlFor="punya_anak"
                    className={cn(
                      "flex items-center gap-5 p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300",
                      status === 'punya_anak' 
                        ? "border-sea-green bg-sea-green/5 shadow-inner" 
                        : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                    )}
                  >
                    <RadioGroupItem value="punya_anak" id="punya_anak" className="sr-only" />
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                      status === 'punya_anak' ? "bg-sea-green text-white shadow-lg" : "bg-white text-blue-400"
                    )}>
                      <Baby className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <span className="font-black text-slate-900 block text-lg">Punya Balita</span>
                      <p className="text-sm font-medium text-slate-400">
                        Anak berusia antara 0 hingga 2 tahun
                      </p>
                    </div>
                    {status === 'punya_anak' && <div className="w-6 h-6 rounded-full bg-sea-green flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                  </label>
                </RadioGroup>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                {status === 'hamil' ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="font-bold text-xl text-slate-800">Usia Kehamilan</h3>
                      <p className="text-sm font-medium text-slate-400 mt-2">
                        Pilih bulan kehamilan Bunda saat ini
                      </p>
                    </div>
                    
                    <Select
                      value={pregnancyMonth?.toString()}
                      onValueChange={(value) => setPregnancyMonth(parseInt(value))}
                    >
                      <SelectTrigger className="w-full h-16 rounded-2xl border-slate-100 bg-slate-50 px-6 font-bold text-slate-900 focus:ring-cerulean">
                        <SelectValue placeholder="Pilih bulan kehamilan" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 p-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((month) => (
                          <SelectItem key={month} value={month.toString()} className="rounded-xl py-3 font-bold text-slate-700 focus:bg-cerulean/5 focus:text-cerulean">
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>Bulan ke-{month}</span>
                              <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {month <= 3 ? 'Trimester 1' : month <= 6 ? 'Trimester 2' : 'Trimester 3'}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="font-bold text-xl text-slate-800">Tanggal Lahir Si Kecil</h3>
                      <p className="text-sm font-medium text-slate-400 mt-2">
                        Agar panduan MPASI & vaksinasi tepat sasaran
                      </p>
                    </div>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-16 rounded-2xl border-slate-100 bg-slate-50 justify-start px-6 font-bold text-slate-900 hover:bg-slate-50 transition-all",
                            !childBirthDate && "text-slate-400"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 text-cerulean" />
                          {childBirthDate ? (
                            format(childBirthDate, "PPP", { locale: idLocale })
                          ) : (
                            "Pilih tanggal lahir"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-3xl overflow-hidden" align="center">
                        <Calendar
                          mode="single"
                          selected={childBirthDate}
                          onSelect={setChildBirthDate}
                          disabled={(date) =>
                            date > new Date() || 
                            date < new Date(new Date().setFullYear(new Date().getFullYear() - 2))
                          }
                          initialFocus
                          className="p-4"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-sea-green/10 flex items-center justify-center shadow-inner">
                    <motion.div
                      initial={{ rotate: -45, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <Check className="w-10 h-10 text-sea-green" />
                    </motion.div>
                  </div>
                  <h3 className="font-black text-2xl text-slate-900 tracking-tight">Data Berhasil Disimpan!</h3>
                  <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                    Berdasarkan informasi Bunda, kami akan memulai edukasi dari:
                  </p>
                </div>
                
                <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-cerulean via-sea-green to-cerulean shadow-xl shadow-cerulean/20 overflow-hidden group">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 text-center">
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] mb-2">Perjalanan Dimulai</p>
                    <p className="text-5xl font-black text-white mb-2 tracking-tighter">
                      Hari ke-{getCurrentDay()}
                    </p>
                    <p className="text-sm font-bold text-white/80">
                      Menuju 1000 Hari Generasi Unggul
                    </p>
                  </div>
                  
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                </div>
                
                <p className="text-sm text-center text-slate-400 font-bold px-4 leading-relaxed">
                  Bunda tetap bisa membaca artikel dari hari sebelumnya untuk melengkapi wawasan.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Improved Navigation */}
          <div className="flex gap-4 pt-6">
            {step > 1 && (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex-1 h-16 rounded-2xl font-black text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all border border-slate-100"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                KEMBALI
              </Button>
            )}
            
            <Button
              onClick={step < 3 ? handleNext : handleComplete}
              disabled={!canProceed()}
              className={cn(
                "flex-[2] h-16 rounded-2xl font-black transition-all duration-300 group shadow-xl",
                step === 3 ? "bg-slate-900 text-white shadow-slate-200" : "bg-cerulean text-white shadow-cerulean/20"
              )}
            >
              {step < 3 ? 'LANJUTKAN' : 'MULAI SEKARANG'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
