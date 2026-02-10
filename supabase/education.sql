-- ============================================
-- GENTING: 1000 HARI EDUKASI - FRESH INSTALL
-- ============================================

-- 0. Clean start (Drop existing to avoid constraint mismatches)
-- IMPORTANT: This will delete your current education data!
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;
DROP TABLE IF EXISTS education_contents CASCADE;

-- 1. Table: Education Contents (1000 artikel edukasi)
-- ============================================
CREATE TABLE education_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day INTEGER NOT NULL,
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
    -- Explicitly define UNIQUE constraint on day
    CONSTRAINT education_contents_day_key UNIQUE (day),
    CONSTRAINT education_contents_day_range CHECK (day >= 1 AND day <= 1000)
);

-- Indexes for performance
CREATE INDEX idx_edu_day ON education_contents(day);
CREATE INDEX idx_edu_phase ON education_contents(phase);
CREATE INDEX idx_edu_category ON education_contents(category);

-- 2. Table: User Profile (Info user untuk personalisasi)
-- ============================================
CREATE TABLE user_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('hamil', 'punya_anak')),
    pregnancy_month INTEGER CHECK (pregnancy_month >= 1 AND pregnancy_month <= 9),
    child_birth_date DATE,
    current_day INTEGER DEFAULT 1,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: User Progress (Track artikel yang sudah dibaca)
-- ============================================
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    day INTEGER NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_favorite BOOLEAN DEFAULT FALSE,
    favorited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, day),
    -- Foreign key referencing the UNIQUE day column
    CONSTRAINT fk_education_day FOREIGN KEY (day) REFERENCES education_contents(day) ON DELETE CASCADE
);

-- 4. Table: User Achievements
-- ============================================
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    achievement_type TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- Enable RLS
ALTER TABLE education_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read education_contents" ON education_contents FOR SELECT USING (TRUE);
CREATE POLICY "User view profile" ON user_profile FOR SELECT USING (TRUE);
CREATE POLICY "User insert profile" ON user_profile FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "User update profile" ON user_profile FOR UPDATE USING (TRUE);
CREATE POLICY "User progress all" ON user_progress FOR ALL USING (TRUE);

-- Function: Stats
CREATE OR REPLACE FUNCTION get_user_progress_stats(p_user_id TEXT)
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
    FROM user_progress
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
