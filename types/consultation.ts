export type ConsultationStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'no_show'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded'

export interface Consultation {
  id: string
  user_id: string
  doctor_id: string
  title?: string
  description?: string
  scheduled_at: string
  started_at?: string
  ended_at?: string
  duration_minutes?: number
  hourly_rate: number
  total_cost?: number
  payment_status: PaymentStatus
  payment_method: string
  payment_reference?: string
  payment_date?: string
  status: ConsultationStatus
  notes?: string
  rating?: number
  review?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
  // Joined fields
  doctor?: {
    full_name: string
    specialization: string
    profile_picture_url?: string
  }
  user?: {
    full_name: string
    avatar_url?: string
  }
}

export interface ConsultationMessage {
  id: string
  consultation_id: string
  sender_id: string
  sender_type: 'user' | 'doctor'
  message: string
  message_type: string
  file_url?: string
  created_at: string
  updated_at: string
}
