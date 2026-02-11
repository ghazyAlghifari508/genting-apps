export interface Doctor {
  id: string
  user_id: string
  full_name: string
  email: string
  phone?: string
  profile_picture_url?: string
  bio?: string
  specialization: string
  license_number: string
  certification_url?: string
  years_of_experience?: number
  hourly_rate: number
  currency: string
  is_verified: boolean
  is_active: boolean
  verification_date?: string
  created_at: string
  updated_at: string
}

export interface DoctorSchedule {
  id: string
  doctor_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface DoctorRegistrationFormData {
  fullName: string
  phone: string
  bio: string
  profilePicture: File | null
  specialization: string
  licenseNumber: string
  yearsOfExperience: string
  certification: File | null
  hourlyRate: string
  acceptTerms: boolean
}

export const SPECIALIZATIONS = [
  'Pediatri',
  'Gizi',
  'Umum',
  'Obgyn',
  'Psikologi',
] as const

export type Specialization = typeof SPECIALIZATIONS[number]

export const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const
