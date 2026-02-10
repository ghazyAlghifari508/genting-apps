'use client'

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Stethoscope, 
  FileText, 
  Building2, 
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from "@/components/ui/use-toast"

interface DoctorApplicationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DoctorApplicationModal({ isOpen, onClose }: DoctorApplicationModalProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: '',
    specialization: '',
    strNumber: '',
    hospital: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call to Supabase
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitted(true)
      toast({
        title: "Pengajuan Terkirim!",
        description: "Data kamu sedang diverifikasi oleh tim admin GENTING.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: "Silakan coba lagi nanti.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8"
            >
              <DialogHeader className="mb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-cerulean/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <Stethoscope className="w-8 h-8 text-cerulean" />
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Ajukan Sebagai Dokter</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium leading-relaxed">
                  Bantu turunkan angka stunting di Indonesia dengan bergabung bersama GENTING. 
                  Data medis kamu akan diverifikasi oleh admin.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Nama Lengkap & Gelar</Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="dr. Jane Doe, Sp.OG"
                        required
                        className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-cerulean/50 transition-all font-semibold pl-4"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Spesialisasi</Label>
                      <Input
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="Kandungan/Gizi"
                        required
                        className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-cerulean/50 transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="strNumber" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Nomor STR</Label>
                      <Input
                        id="strNumber"
                        name="strNumber"
                        value={formData.strNumber}
                        onChange={handleInputChange}
                        placeholder="123456789"
                        required
                        className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-cerulean/50 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Instansi / Rumah Sakit</Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <Input
                        id="hospital"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        placeholder="RS Ibu dan Anak, Jakarta"
                        required
                        className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-cerulean/50 transition-all font-semibold pl-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
                   <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                   <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                     Dengan menekan tombol di bawah, Anda menyatakan bahwa data yang diberikan adalah benar dan bersedia diverifikasi oleh tim internal kami.
                   </p>
                </div>

                <DialogFooter className="mt-8">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-cerulean hover:bg-cerulean/90 text-white font-black text-lg shadow-xl shadow-cerulean/20 transition-all active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Kirim Data Verifikasi'}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-sea-green/10 flex items-center justify-center mb-6 mx-auto">
                <CheckCircle2 className="w-12 h-12 text-sea-green" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Pengajuan Berhasil!</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Terima kasih telah bergabung! Tim admin GENTING akan memverifikasi data Anda dalam 1-2 hari kerja. 
                Anda akan menerima notifikasi jika akun telah diverifikasi.
              </p>
              <Button 
                onClick={onClose}
                className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg transition-all"
              >
                Kembali ke Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
