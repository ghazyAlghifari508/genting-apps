'use client'

import React, { useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '../../ui/textarea'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import { DoctorRegistrationFormData } from '@/types/doctor'

interface PersonalInfoStepProps {
  formData: DoctorRegistrationFormData
  setFormData: (data: DoctorRegistrationFormData) => void
}

export function PersonalInfoStep({ formData, setFormData }: PersonalInfoStepProps) {
  const previewUrl = useMemo(
    () => (formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : null),
    [formData.profilePicture]
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, profilePicture: file })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName" className="text-slate-700  transition-colors">Nama Lengkap *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Dr. Nama Lengkap"
          className="mt-1    transition-colors"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-slate-700  transition-colors">Nomor Telepon *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+62 8..."
          className="mt-1    transition-colors"
        />
      </div>

      <div>
        <Label htmlFor="bio" className="text-slate-700  transition-colors">Bio / Tentang Anda</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Ceritakan pengalaman Anda..."
          className="mt-1    transition-colors"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-slate-700  transition-colors">Foto Profil</Label>
        <div className="mt-1 border-2 border-dashed border-slate-200  rounded-xl p-6 text-center hover:border-cerulean  transition-colors relative bg-slate-50 ">
          {formData.profilePicture ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 ">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              <p className="text-sm font-medium text-slate-700 ">{formData.profilePicture.name}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFormData({ ...formData, profilePicture: null })}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 "
              >
                <X size={14} className="mr-1" /> Hapus
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-cerulean/10  flex items-center justify-center text-cerulean  transition-colors">
                <Upload size={20} />
              </div>
              <p className="text-sm text-slate-500  transition-colors">Klik untuk upload foto (JPG/PNG)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
