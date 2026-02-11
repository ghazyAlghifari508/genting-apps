-- Comprehensive Doctor Dashboard Migration

-- 1. Table: consultation_messages (Update/Modify)
-- Assuming the table already exists, we add columns for attachments and message types
ALTER TABLE IF EXISTS consultation_messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text';
ALTER TABLE IF EXISTS consultation_messages ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE IF EXISTS consultation_messages ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE IF EXISTS consultation_messages ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE IF EXISTS consultation_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_consultation_messages_is_read ON consultation_messages(is_read);

-- 2. Table: prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  medicines JSONB, -- Array of {name, dosage, frequency, duration}
  instructions TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, expired, archived
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_consultation_id ON prescriptions(consultation_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_user_id ON prescriptions(user_id);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own prescriptions" ON prescriptions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

-- 3. Table: doctor_notifications
CREATE TABLE IF NOT EXISTS doctor_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL, -- new_consultation, message, payment, etc
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_notifications_doctor_id ON doctor_notifications(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_notifications_is_read ON doctor_notifications(is_read);

ALTER TABLE doctor_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors can manage own notifications" ON doctor_notifications
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

-- 4. Table: doctor_availability_status
CREATE TABLE IF NOT EXISTS doctor_availability_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE UNIQUE,
  status VARCHAR(50) DEFAULT 'offline', -- online, busy, break, offline
  status_message VARCHAR(255),
  set_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  until TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE doctor_availability_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view doctor status" ON doctor_availability_status
  FOR SELECT USING (true);
CREATE POLICY "Doctors can update own status" ON doctor_availability_status
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

-- 5. Table: doctor_notes (internal)
CREATE TABLE IF NOT EXISTS doctor_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE doctor_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors can manage own patient notes" ON doctor_notes
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));
