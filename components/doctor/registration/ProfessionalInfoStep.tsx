'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Upload, X, FileText } from 'lucide-react'
import { DoctorRegistrationFormData, SPECIALIZATIONS } from '@/types/doctor'
import { Checkbox } from '../../ui/checkbox'

interface ProfessionalInfoStepProps {
  formData: DoctorRegistrationFormData
  setFormData: (data: DoctorRegistrationFormData) => void
}

export function ProfessionalInfoStep({ formData, setFormData }: ProfessionalInfoStepProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, certification: file })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="specialization">Spesialisasi *</Label>
        <Select
          value={formData.specialization}
          onValueChange={(val) => setFormData({ ...formData, specialization: val })}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Pilih spesialisasi" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="w-[var(--radix-select-trigger-width)] bg-white border-slate-200 shadow-xl rounded-xl">
            {SPECIALIZATIONS.map((spec) => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="licenseNumber">Nomor STR / Lisensi *</Label>
        <Input
          id="licenseNumber"
          value={formData.licenseNumber}
          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
          placeholder="Nomor STR valid"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="experience">Pengalaman (Tahun) *</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
            placeholder="Contoh: 5"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="rate">Tarif (Rp/Jam) *</Label>
          <Input
            id="rate"
            type="number"
            min="0"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
            placeholder="100000"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>Dokumen Sertifikasi (Opsional)</Label>
        <div className="mt-2 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-cerulean hover:bg-cerulean/5 transition-all relative bg-slate-50/50 group">
          {formData.certification ? (
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-cerulean/10 flex items-center justify-center shrink-0">
                  <FileText className="text-cerulean" size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{formData.certification.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready to upload</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFormData({ ...formData, certification: null })}
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 h-10 w-10 rounded-xl transition-all"
              >
                <X size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-cerulean group-hover:scale-110 transition-all shadow-sm">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Upload Sertifikat</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">PDF / JPG / PNG Max 5MB</p>
              </div>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start space-x-3 pt-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 animate-in fade-in">
        <Checkbox 
          id="terms" 
          required 
          className="mt-1 rounded-md border-amber-200 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500" 
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: !!checked })}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-black text-amber-900 leading-none cursor-pointer"
          >
            Saya menyetujui syarat & ketentuan
          </label>
          <p className="text-xs text-amber-700/70 font-bold">
            Data Anda akan diverifikasi oleh tim medis Genting sebelum aktif.
          </p>
        </div>
      </div>
    </div>
  )
}
