-- ============================================
-- GENTING: 1000 HARI EDUKASI
-- ============================================

-- 0. CLEAN START (Optional: Uncomment if you want to wipe and restart)
-- DROP TABLE IF EXISTS public.user_achievements CASCADE;
-- DROP TABLE IF EXISTS public.user_progress CASCADE;
-- DROP TABLE IF EXISTS public.education_contents CASCADE;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: Education Contents
CREATE TABLE IF NOT EXISTS public.education_contents (
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

CREATE INDEX IF NOT EXISTS idx_edu_day ON public.education_contents(day);
CREATE INDEX IF NOT EXISTS idx_edu_phase ON public.education_contents(phase);
CREATE INDEX IF NOT EXISTS idx_edu_category ON public.education_contents(category);

-- 3. TABLE: User Progress
CREATE TABLE IF NOT EXISTS public.user_progress (
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

-- 4. TABLE: User Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_type TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- 5. SET UP RLS
ALTER TABLE public.education_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public read education_contents" ON public.education_contents;
CREATE POLICY "Public read education_contents" ON public.education_contents FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can manage own progress" ON public.user_progress;
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id::UUID);

DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id::UUID);

-- 6. FUNCTION: Stats
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
    WHERE user_id::UUID = p_user_id;
END;
$$ LANGUAGE plpgsql;
