import { createClient } from "@/lib/supabase-server";

/**
 * Get the current session on the server side.
 * Use this in Server Components, API routes, and Server Actions.
 */
export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user on the server side.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Fetch profile from database to get authoritative role and data
  // Use maybeSingle to avoid throwing if not found
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name, onboarding_completed')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error(`[AuthServer] Error fetching profile for ${user.id}:`, profileError)
  }

  const metaRole = user.user_metadata?.role;
  const dbRole = profile?.role;
  const finalRole = dbRole || metaRole || 'user';

  // Return unified user object
  return {
    ...user,
    id: user.id,
    email: user.email,
    name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name,
    image: user.user_metadata?.avatar_url,
    role: finalRole,
    onboarding_completed: profile?.onboarding_completed ?? user.user_metadata?.onboarding_completed ?? false,
  };
}
