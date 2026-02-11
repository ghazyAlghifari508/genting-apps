import { createClient } from '@/lib/supabase/client'
import { DoctorRegistrationFormData } from '@/types/doctor'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient()

export async function uploadFile(file: File, path: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${path}/${fileName}`

  const { error } = await supabase.storage
    .from('genting-files')
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage
    .from('genting-files')
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function createDoctorProfile(userId: string, formData: DoctorRegistrationFormData) {
  let profilePictureUrl = null
  if (formData.profilePicture) {
    profilePictureUrl = await uploadFile(formData.profilePicture, `doctors/${userId}/profile-picture`)
  }

  let certificationUrl = null
  if (formData.certification) {
    certificationUrl = await uploadFile(formData.certification, `doctors/${userId}/certification`)
  }

  const email = formData.fullName.toLowerCase().replace(/\s/g, '') + '@genting.id' // Fallback if needed, but we should use passed metadata if possible
  
  // Try to get email from metadata if available, but userId is primary

  const { data, error } = await supabase
    .from('doctors')
    .insert({
      user_id: userId,
      full_name: formData.fullName,
      email: email,
      phone: formData.phone,
      bio: formData.bio,
      profile_picture_url: profilePictureUrl,
      specialization: formData.specialization,
      license_number: formData.licenseNumber,
      certification_url: certificationUrl,
      years_of_experience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : 0,
      hourly_rate: parseFloat(formData.hourlyRate),
      is_verified: true, // Auto-verify for now as per requirement
      is_active: true,
      registration_status: 'approved'
    })
    .select('id')
    .single()

  if (error) {
    // If duplicate key error (already exists), try to fetch the existing record ID
    if (error.code === '23505') {
      const { data: existing } = await supabase.from('doctors').select('id').eq('user_id', userId).maybeSingle()
      if (existing) return existing.id
    }
    throw error
  }
  return data.id
}
