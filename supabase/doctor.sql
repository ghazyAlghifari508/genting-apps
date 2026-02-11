-- ============================================
-- GENTING Doctor Feature - Database Schema
-- ============================================

-- 1. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
  currency VARCHAR(3) DEFAULT 'IDR',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);

-- 2. DOCTOR SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.doctor_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_id ON doctor_schedules(doctor_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_doctor_schedule ON doctor_schedules(doctor_id, day_of_week, start_time);

-- 3. CONSULTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.consultations (
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
  payment_method VARCHAR(50) DEFAULT 'dummy',
  payment_reference VARCHAR(255),
  payment_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled_at ON consultations(scheduled_at);

-- 4. CONSULTATION MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'doctor')),
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultation_messages_consultation_id ON consultation_messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_sender_id ON consultation_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_created_at ON consultation_messages(created_at);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

-- Doctors policies
CREATE POLICY "Doctors are viewable by everyone" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can update own profile" ON public.doctors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Doctors can insert own profile" ON public.doctors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Doctor schedules policies
CREATE POLICY "Schedules are viewable by everyone" ON public.doctor_schedules FOR SELECT USING (true);
CREATE POLICY "Doctors can manage own schedules" ON public.doctor_schedules FOR ALL USING (
  doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
);

-- Consultations policies
CREATE POLICY "Users can view own consultations" ON public.consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Doctors can view own consultations" ON public.consultations FOR SELECT USING (
  doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create consultations" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Participants can update consultations" ON public.consultations FOR UPDATE USING (
  auth.uid() = user_id OR doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
);

-- Consultation messages policies
CREATE POLICY "Participants can view messages" ON public.consultation_messages FOR SELECT USING (
  consultation_id IN (
    SELECT id FROM public.consultations WHERE user_id = auth.uid()
    UNION
    SELECT c.id FROM public.consultations c JOIN public.doctors d ON c.doctor_id = d.id WHERE d.user_id = auth.uid()
  )
);
CREATE POLICY "Participants can send messages" ON public.consultation_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- ENABLE REALTIME for consultation_messages
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_messages;
