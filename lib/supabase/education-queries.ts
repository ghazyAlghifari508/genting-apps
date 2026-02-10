import { createClient } from '@/lib/supabase/client';
import { EducationContent, UserProfile, UserProgress, Phase, Category } from '@/types/education';

const supabase = createClient();

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { user_id: string }) {
  const { data, error } = await supabase
    .from('user_profile')
    .upsert(profile, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Supabase error in upsertUserProfile:', error.message, error.details);
    throw error;
  }
  return data;
}

export async function getAllEducationContent(): Promise<EducationContent[]> {
  const { data, error } = await supabase
    .from('education_contents')
    .select('*')
    .order('day', { ascending: true });

  if (error) {
    console.error('Supabase error in getAllEducationContent:', error.message, error.details);
    throw error;
  }
  return data || [];
}

export async function getContentByDay(day: number): Promise<EducationContent | null> {
  const { data, error } = await supabase
    .from('education_contents')
    .select('*')
    .eq('day', day)
    .single();

  if (error) return null;
  return data;
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Supabase error in getUserProgress:', error.message, error.details);
    throw error;
  }
  return data || [];
}

export async function toggleReadStatus(userId: string, day: number, isRead: boolean) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      day: day,
      is_read: isRead,
      read_at: isRead ? new Date().toISOString() : null
    }, { onConflict: 'user_id, day' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function toggleFavoriteStatus(userId: string, day: number, isFavorite: boolean) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      day: day,
      is_favorite: isFavorite,
      favorited_at: isFavorite ? new Date().toISOString() : null
    }, { onConflict: 'user_id, day' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProgressStats(userId: string) {
  const { data, error } = await supabase.rpc('get_user_progress_stats', { p_user_id: userId });
  if (error) {
    console.error('Supabase error in getProgressStats (RPC):', error.message, error.details);
    throw error;
  }
  return data[0];
}
