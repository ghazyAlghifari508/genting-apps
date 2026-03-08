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

export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'reviewing'

export interface DoctorRegistration {
  id: string
  user_id: string
  status: RegistrationStatus
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
  admin_notes: string | null
  full_name: string
  phone: string | null
  bio: string | null
  profile_photo_url: string | null
  specialization: string
  license_number: string
  certification_url: string | null
  years_of_experience: number | null
  hourly_rate: number
  hospital_name: string | null
  university: string | null
  id_photo_url: string | null
  created_at: string
  updated_at: string
  users?: {
    avatar_url?: string | null
  }
}

export interface DoctorStats {
  totalPatients: number
  activeConsultations: number
  todayAppointments: {
    total: number
    completed: number
    upcoming: number
  }
  monthlyRevenue: number
  newPatientsThisMonth: number
  averageRating: number
  totalConsultations: number
  completedConsultations: number
  weeklyTrend: Array<{ name: string; value: number }>
  statusSummary: {
    completed: number
    pending: number
    cancelled: number
  }
}
