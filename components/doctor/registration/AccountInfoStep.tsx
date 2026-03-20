'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DoctorRegistrationFormData } from '@/types/doctor'
import { Mail, Lock, ShieldCheck } from 'lucide-react'

interface AccountInfoStepProps {
  formData: DoctorRegistrationFormData
  setFormData: (data: DoctorRegistrationFormData) => void
}

export function AccountInfoStep({ formData, setFormData }: AccountInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-doccure-teal/5 border border-doccure-teal/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-doccure-teal/10 flex items-center justify-center text-doccure-teal shrink-0">
          <ShieldCheck size={20} />
        </div>
        <p className="text-xs font-semibold text-slate-600 leading-relaxed">
          Akun ini akan menjadi kredensial login Anda sebagai tenaga medis profesional di Genting+.
        </p>
      </div>

      <div>
        <Label htmlFor="email" className="text-slate-700 font-bold mb-1.5 block">Alamat Email Kerja *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="nama@rumah-sakit.com"
            className="pl-10 h-12 rounded-xl border-slate-200 focus:border-doccure-teal transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password" className="text-slate-700 font-bold mb-1.5 block">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="password"
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="pl-10 h-12 rounded-xl border-slate-200 focus:border-doccure-teal transition-all"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="text-slate-700 font-bold mb-1.5 block">Konfirmasi Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword || ''}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="pl-10 h-12 rounded-xl border-slate-200 focus:border-doccure-teal transition-all"
            />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 font-medium italic">
        * Pastikan email aktif untuk menerima notifikasi status verifikasi akun Anda.
      </p>
    </div>
  )
}
