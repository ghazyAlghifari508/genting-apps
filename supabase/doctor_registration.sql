-- Migration for 'Jadi Dokter' feature

-- 1. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
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

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles" ON public.user_roles
  FOR ALL USING (true);

-- 2. Update doctors table
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS registration_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 3. Storage bucket setup (idempotent)
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

-- 4. Initial insert for existing doctors (optional sync)
INSERT INTO public.user_roles (user_id, role, registration_status)
SELECT user_id, 'doctor', 'approved'
FROM public.doctors
ON CONFLICT (user_id) DO UPDATE
SET role = 'doctor', registration_status = 'approved';
