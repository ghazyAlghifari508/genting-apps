-- ==========================================
-- GENTING FINAL CONSOLIDATED SCHEMA (VERSI 5.0)
-- SINGLE SOURCE OF TRUTH
-- ==========================================

-- 1. BERSIHKAN TRIGGER & TABEL (TOTAL CLEANUP)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS 
    public.consultation_messages, public.prescriptions, public.consultations,
    public.doctor_notifications, public.doctor_availability_status, public.doctor_notes, 
    public.doctor_schedules, public.doctors, public.user_roles,
    public.user_roadmap_progress, public.roadmap_activities, 
    public.user_progress, public.user_achievements, public.education_contents,
    public.food_logs, public.payments, public.messages, public.chats,
    public.profiles, public."user", public.session, public.account, public.verification,
    public.doctor_registrations CASCADE;

-- 2. AKTIFKAN EKSTENSI
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. PROFILES (USER DATA)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  status TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  pregnancy_month INTEGER,
  pregnancy_week INTEGER,
  pregnancy_start_date DATE,
  due_date DATE,
  trimester INTEGER,
  current_day INTEGER DEFAULT 1,
  current_weight DECIMAL,
  height DECIMAL,
  child_name TEXT,
  child_birth_date DATE,
  child_weight DECIMAL,
  child_height DECIMAL,
  xp_points INTEGER DEFAULT 0,
  show_approval_msg BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DOCTOR REGISTRATIONS (PENDING APPLICATIONS)
CREATE TABLE public.doctor_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reviewing')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  admin_notes TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  profile_photo_url TEXT,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  certification_url TEXT,
  years_of_experience INTEGER,
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DOCTORS (VERIFIED DATA)
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_picture_url TEXT,
  bio TEXT,
  specialization VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  certification_url TEXT,
  years_of_experience INTEGER,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_date TIMESTAMP WITH TIME ZONE,
  registration_status VARCHAR(50) DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DOCTOR SCHEDULES
CREATE TABLE public.doctor_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 0-6 (Sunday-Saturday)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CONSULTATIONS
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  midtrans_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CONSULTATION MESSAGES (CHAT)
CREATE TABLE public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  sender_type VARCHAR(50) CHECK (sender_type IN ('user', 'doctor')),
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  file_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. EDUCATION & PROGRESS
CREATE TABLE public.education_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day INTEGER NOT NULL UNIQUE,
  phase TEXT NOT NULL,
  month INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  tips JSONB DEFAULT '[]',
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL REFERENCES public.education_contents(day) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  is_favorite BOOLEAN DEFAULT FALSE,
  favorited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day)
);

-- 10. ROADMAP & ACTIVITIES
CREATE TABLE public.roadmap_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  difficulty_level INTEGER DEFAULT 1,
  icon_name TEXT,
  xp_reward INTEGER DEFAULT 10,
  min_trimester INTEGER DEFAULT 1,
  max_trimester INTEGER DEFAULT 3,
  duration_minutes INTEGER DEFAULT 0,
  frequency_per_week INTEGER DEFAULT 0,
  benefits JSONB DEFAULT '[]',
  instructions JSONB DEFAULT '[]',
  tips TEXT,
  warnings TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.roadmap_activities(id),
  status TEXT DEFAULT 'pending',
  streak_count INTEGER DEFAULT 0,
  last_completed_date DATE,
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_id)
);

-- 11. PRESCRIPTIONS & NOTIFICATIONS
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id),
  user_id UUID REFERENCES public.profiles(id),
  title TEXT,
  description TEXT,
  medicines JSONB,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.doctor_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. AI CHAT TABLES
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Supporting anon user IDs (e.g. anon-XXXX)
  title TEXT DEFAULT 'Diskusi Baru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. DISABLE RLS (Consistent with project policy)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_contents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roadmap_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- 13. REALTIME SETUP
-- Enable Realtime for consultation_messages
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.consultation_messages;
COMMIT;

-- 14. FUNGSI & TRIGGER AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, role, updated_at)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)) || '_' || substring(new.id::text from 1 for 4),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User GENTING'),
    'user',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. BACKFILL
INSERT INTO public.profiles (id, email, username, full_name, role, updated_at)
SELECT 
    id, email,
    COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)) || '_' || substring(id::text from 1 for 4),
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'User GENTING'),
    CASE 
      WHEN email = 'admin@genting.id' THEN 'admin'
      WHEN email = 'doctor@genting.id' THEN 'doctor'
      ELSE 'user'
    END,
    NOW()
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Add test doctor to public.doctors (Backfill for testing)
INSERT INTO public.doctors (
  user_id,
  full_name,
  email,
  specialization,
  license_number,
  is_verified,
  registration_status,
  hourly_rate
)
SELECT 
  id, 
  full_name, 
  email, 
  'Umum', 
  'DOC-TEST-001', 
  true, 
  'approved', 
  50000
FROM public.profiles
WHERE email = 'doctor@genting.id'
ON CONFLICT (user_id) DO NOTHING;

-- 16. INDEXES
CREATE INDEX IF NOT EXISTS idx_doctor_reg_user_id ON public.doctor_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_reg_status ON public.doctor_registrations(status);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_consultation_id ON public.consultation_messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
