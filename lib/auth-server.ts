import { createClient } from "@/lib/supabase-server";
import { cache } from "react";

/**
 * Get the current session on the server side.
 * Use this in Server Components, API routes, and Server Actions.
 */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
});

/**
 * Get the current user on the server side.
 * Returns null if not authenticated.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Optimization: If role is already in metadata, use it to avoid DB hit for common checks
  const metaRole = user.user_metadata?.role;
  const metaOnboarding = user.user_metadata?.onboarding_completed;

  // For Admin, we can trust the metadata role
  if (metaRole === 'admin') {
    return {
      ...user,
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      image: user.user_metadata?.avatar_url,
      role: 'admin',
      is_doctor_applicant: false,
      onboarding_completed: metaOnboarding ?? true,
    };
  }

  // Fetch profile from database
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name, onboarding_completed')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error(`[AuthServer] Error fetching profile for ${user.id}:`, profileError)
  }

  const dbRole = profile?.role;
  const finalRole = dbRole || metaRole || 'user';

  // Fallback check for doctor applicants
  let isDoctorApplicant = user.user_metadata?.is_doctor_applicant ?? false;
  
  if (!isDoctorApplicant && finalRole === 'user') {
    const { data: registration } = await supabase
      .from('doctor_registrations')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (registration) {
      isDoctorApplicant = true;
    }
  }

  return {
    ...user,
    id: user.id,
    email: user.email,
    name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name,
    image: user.user_metadata?.avatar_url,
    role: finalRole,
    is_doctor_applicant: isDoctorApplicant,
    onboarding_completed: profile?.onboarding_completed ?? metaOnboarding ?? false,
  };
});
