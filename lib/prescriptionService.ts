import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
}

export async function createPrescription(payload: {
  consultationId: string
  doctorId: string
  userId: string
  title: string
  description: string
  medicines: Medicine[]
  instructions: string
}) {
  const { data, error } = await supabase
    .from('prescriptions')
    .insert({
      consultation_id: payload.consultationId,
      doctor_id: payload.doctorId,
      user_id: payload.userId,
      title: payload.title,
      description: payload.description,
      medicines: payload.medicines,
      instructions: payload.instructions
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPrescriptionsByConsultation(consultationId: string) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
