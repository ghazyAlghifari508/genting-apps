-- ========================================================
-- GENTING: MASTER DATABASE REBUILD (ULTIMATE START)
-- WARNING: This will DELETE ALL DATA and start from scratch!
-- ========================================================

-- 1. CLEANUP (Drop everything to ensure a clean slate)
-- Drop triggers & functions first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_progress_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_progress_stats(TEXT) CASCADE;

-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS public.doctor_notes CASCADE;
DROP TABLE IF EXISTS public.doctor_availability_status CASCADE;
DROP TABLE IF EXISTS public.doctor_notifications CASCADE;
DROP TABLE IF EXISTS public.prescriptions CASCADE;
DROP TABLE IF EXISTS public.consultation_messages CASCADE;
DROP TABLE IF EXISTS public.consultations CASCADE;
DROP TABLE IF EXISTS public.doctor_schedules CASCADE;
DROP TABLE IF EXISTS public.doctors CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.user_roadmap_progress CASCADE;
DROP TABLE IF EXISTS public.roadmap_activities CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.education_contents CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. CORE: PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'doctor', 'admin')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  -- Info Onboarding & Pregnancy
  status TEXT CHECK (status IN ('hamil', 'punya_anak')),
  pregnancy_month INTEGER CHECK (pregnancy_month BETWEEN 1 AND 9),
  child_birth_date DATE,
  current_day INTEGER DEFAULT 1 CHECK (current_day BETWEEN 1 AND 1000),
  
  -- Data Fisik
  pregnancy_week INTEGER,
  current_weight DECIMAL,
  height DECIMAL,
  due_date DATE,
  
  -- Anak data
  child_name TEXT,
  child_weight DECIMAL,
  child_height DECIMAL,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 4. ROLES: USER_ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  registration_status VARCHAR(50) DEFAULT 'pending',
  registered_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. DOCTOR: DOCTORS & SCHEDULES
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_picture_url TEXT,
  bio TEXT,
  specialization VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  certification_url TEXT,
  years_of_experience INT,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  registration_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  rejection_reason TEXT,
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.doctor_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. CONSULTATION: CORE FLOW
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  scheduled_at TIMESTAMP NOT NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_minutes INT,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed', 'refunded')),
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled', 'no_show')),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'doctor')),
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  file_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. DOCTOR DASHBOARD FEATURES
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  medicines JSONB,
  instructions TEXT,
  status VARCHAR(50) DEFAULT 'active',
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.doctor_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL, 
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.doctor_availability_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE UNIQUE,
  status VARCHAR(50) DEFAULT 'offline',
  status_message VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.doctor_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. EDUCATION MODULE
CREATE TABLE public.education_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day INTEGER NOT NULL UNIQUE,
    phase TEXT NOT NULL CHECK (phase IN ('kehamilan', 'bayi_0_3', 'bayi_3_12', 'anak_1_2')),
    month INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    tips JSONB DEFAULT '[]'::jsonb,
    category TEXT NOT NULL CHECK (category IN ('nutrisi', 'kesehatan', 'stimulasi', 'perkembangan', 'aktivitas', 'imunisasi')),
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day INTEGER NOT NULL REFERENCES public.education_contents(day) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, day)
);

-- 9. ROADMAP MODULE
CREATE TABLE public.roadmap_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('exercise', 'nutrition')),
    description TEXT NOT NULL,
    difficulty_level INTEGER NOT NULL,
    icon_name TEXT DEFAULT 'Activity',
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES public.roadmap_activities(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started',
    streak_count INTEGER DEFAULT 0,
    last_completed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, activity_id)
);

-- 10. PAYMENTS
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  midtrans_order_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. SECURITY & RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 12. POLICIES (Simplified Master Policies)
CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own role" ON public.user_roles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors are public" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors manage own profile" ON public.doctors FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Consultation visibility" ON public.consultations FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));
CREATE POLICY "Users create consultations" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Message visibility" ON public.consultation_messages FOR SELECT USING (consultation_id IN (SELECT id FROM consultations WHERE user_id = auth.uid() OR doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())));
CREATE POLICY "Participants send messages" ON public.consultation_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Notify doctors" ON public.doctor_notifications FOR ALL USING (auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

CREATE POLICY "Everyone see doctor availability" ON public.doctor_availability_status FOR SELECT USING (true);
CREATE POLICY "Doctors manage availability" ON public.doctor_availability_status FOR ALL USING (auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

CREATE POLICY "Public read education" ON public.education_contents FOR SELECT USING (true);
CREATE POLICY "Users manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- 13. AUTH TRIGGER
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
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'role', 'user'));
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. REALTIME ENABLEMENT
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctor_notifications;

-- 15. STORAGE BUCKET SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES ('genting-files', 'genting-files', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'genting-files');

DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'genting-files');

-- 16. SEED DATA (Minimal)
INSERT INTO public.roadmap_activities (activity_name, category, description, difficulty_level, icon_name) VALUES
('Jalan Kaki Pagi', 'exercise', 'Jalan kaki santai 30 menit.', 1, 'Footprints'),
('Asam Folat Boost', 'nutrition', 'Penuhi asupan asam folat harian.', 1, 'Pill');
