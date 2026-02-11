-- ========================================================
-- GENTING: MASTER RESET & REBUILD (FRESH START)
-- WARNING: This will DELETE ALL DATA and start from scratch!
-- ========================================================

-- 1. CLEANUP (Hapus semua yang ada sebelumnya)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop ALL variants of get_user_progress_stats to avoid overloading errors
DROP FUNCTION IF EXISTS public.get_user_progress_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_progress_stats(TEXT) CASCADE;

DROP TABLE IF EXISTS public.user_roadmap_progress CASCADE;
DROP TABLE IF EXISTS public.roadmap_activities CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.education_contents CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. PROFILES TABLE (Cetak Biru Utama)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'doctor', 'admin')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  -- Info Onboarding
  status TEXT CHECK (status IN ('hamil', 'punya_anak')),
  pregnancy_month INTEGER CHECK (pregnancy_month BETWEEN 1 AND 9),
  child_birth_date DATE,
  current_day INTEGER DEFAULT 1 CHECK (current_day BETWEEN 1 AND 1000),
  
  -- Data Fisik
  pregnancy_week INTEGER,
  current_weight DECIMAL,
  height DECIMAL,
  due_date DATE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 4. PAYMENTS TABLE
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'challenge')),
  midtrans_order_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. EDUCATION TABLES
CREATE TABLE public.education_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day INTEGER NOT NULL UNIQUE,
    phase TEXT NOT NULL CHECK (phase IN ('kehamilan', 'bayi_0_3', 'bayi_3_12', 'anak_1_2')),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 34),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    tips JSONB DEFAULT '[]'::jsonb,
    category TEXT NOT NULL CHECK (category IN ('nutrisi', 'kesehatan', 'stimulasi', 'perkembangan', 'aktivitas', 'imunisasi')),
    thumbnail_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    related_days INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT education_contents_day_range CHECK (day >= 1 AND day <= 1000)
);

CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day INTEGER NOT NULL REFERENCES public.education_contents(day) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_favorite BOOLEAN DEFAULT FALSE,
    favorited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, day)
);

CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_type TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- 6. ROADMAP TABLES
CREATE TABLE public.roadmap_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('exercise', 'nutrition')),
    description TEXT NOT NULL,
    benefits JSONB DEFAULT '[]'::jsonb,
    difficulty_level INTEGER NOT NULL CHECK (difficulty_level IN (1, 2, 3)),
    min_trimester INTEGER NOT NULL DEFAULT 1 CHECK (min_trimester >= 1 AND min_trimester <= 3),
    max_trimester INTEGER NOT NULL DEFAULT 3 CHECK (max_trimester >= 1 AND max_trimester <= 3),
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    frequency_per_week INTEGER NOT NULL DEFAULT 3,
    instructions JSONB DEFAULT '[]'::jsonb,
    tips TEXT,
    warnings TEXT,
    xp_reward INTEGER NOT NULL DEFAULT 10,
    icon_name TEXT DEFAULT 'Activity',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES public.roadmap_activities(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completion_date TIMESTAMPTZ,
    notes TEXT,
    streak_count INTEGER DEFAULT 0,
    last_completed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, activity_id)
);

-- 7. SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Doctors view own payments" ON public.payments FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Public read education" ON public.education_contents FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own education progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read roadmap" ON public.roadmap_activities FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own roadmap progress" ON public.user_roadmap_progress FOR ALL USING (auth.uid() = user_id);

-- 8. FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION get_user_progress_stats(p_user_id UUID)
RETURNS TABLE(
    total_read INTEGER,
    total_favorite INTEGER,
    progress_percentage NUMERIC,
    current_streak INTEGER,
    longest_streak INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE is_read = TRUE)::INTEGER as total_read,
        COUNT(*) FILTER (WHERE is_favorite = TRUE)::INTEGER as total_favorite,
        ROUND((COUNT(*) FILTER (WHERE is_read = TRUE)::NUMERIC / 1000.0) * 100, 2) as progress_percentage,
        0 as current_streak,
        0 as longest_streak
    FROM public.user_progress
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 9. AUTO-SYNC EXISTING USERS
-- Supaya user yang udah daftar di Auth nggak ilang profilnya
INSERT INTO public.profiles (id, role)
SELECT id, 'user' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 10. SEED DATA MINIMAL
INSERT INTO public.roadmap_activities (activity_name, category, description, difficulty_level, min_trimester, max_trimester, duration_minutes, frequency_per_week, icon_name) VALUES
('Jalan Kaki Pagi', 'exercise', 'Jalan kaki santai.', 1, 1, 3, 30, 5, 'Footprints'),
('Asam Folat Boost', 'nutrition', 'Penuhi asam folat.', 1, 1, 2, 0, 7, 'Pill');
