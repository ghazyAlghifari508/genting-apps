-- SEED DATA: 1000 HARI EDUKASI
-- Run this in your Supabase SQL Editor AFTER running education.sql

-- 1. Insert some real content for the first few days
INSERT INTO education_contents (day, phase, month, title, description, content, tips, category, tags) VALUES
(1, 'kehamilan', 1, 'Pentingnya Asam Folat', 'Asam folat sangat penting untuk perkembangan janin.', '# Mengapa Penting?\n\nAsam folat membantu pembentukan sel darah merah dan perkembangan otak.', '["Konsumsi 400mcg per hari"]'::jsonb, 'nutrisi', ARRAY['asam-folat', 'trimester-1']),
(2, 'kehamilan', 1, 'Morning Sickness', 'Cara mengatasi mual di pagi hari.', '# Mengatasi Mual\n\nMakan biskuit kering saat bangun tidur bisa membantu.', '["Makan porsi kecil tapi sering"]'::jsonb, 'kesehatan', ARRAY['mual', 'kehamilan']),
(30, 'kehamilan', 1, 'Ringkasan Bulan 1', 'Selamat bunda telah melewati bulan pertama.', '# Bulan Pertama Selesai\n\nJanin sudah mulai terbentuk organ dasarnya.', '["Tetap rileks dan bahagia"]'::jsonb, 'perkembangan', ARRAY['bulan-1']),
(271, 'bayi_0_3', 10, 'Selamat Datang Si Kecil', 'Panduan hari pertama kelahiran bayi.', '# Hari Pertama\n\nInisiasi Menyusu Dini sangat disarankan.', '["Lakukan skin-to-skin"]'::jsonb, 'kesehatan', ARRAY['bayi-lahir', 'asi']),
(426, 'bayi_3_12', 15, 'Mulai MPASI', 'Panduan pemberian makanan pendamping ASI pertama.', '# MPASI Pertama\n\nTekstur harus sangat halus (puree).', '["Mulai dengan porsi kecil"]'::jsonb, 'nutrisi', ARRAY['mpasi', '6-bulan']),
(1000, 'anak_1_2', 34, '1000 Hari Selesai!', 'Selamat Bunda telah berhasil!', '# Hari ke-1000\n\nFondasi anak sudah terbentuk dengan baik.', '["Terus berikan nutrisi terbaik"]'::jsonb, 'perkembangan', ARRAY['selesai', 'anak-2-tahun']);

-- 2. Generate dummy data for the remaining 994 days
-- This script fills the gaps so the timeline and grid don't look empty
DO $$
DECLARE
    i INTEGER;
    v_phase TEXT;
    v_month INTEGER;
    v_category TEXT;
BEGIN
    FOR i IN 1..1000 LOOP
        -- Skip if already exists
        IF NOT EXISTS (SELECT 1 FROM education_contents WHERE day = i) THEN
            -- Determine phase
            IF i <= 270 THEN v_phase := 'kehamilan';
            ELSIF i <= 365 THEN v_phase := 'bayi_0_3';
            ELSIF i <= 635 THEN v_phase := 'bayi_3_12';
            ELSE v_phase := 'anak_1_2';
            END IF;

            v_month := ceil(i / 30.0);
            
            -- Cycle categories
            CASE i % 5
                WHEN 0 THEN v_category := 'nutrisi';
                WHEN 1 THEN v_category := 'kesehatan';
                WHEN 2 THEN v_category := 'stimulasi';
                WHEN 3 THEN v_category := 'perkembangan';
                ELSE v_category := 'aktivitas';
            END CASE;

            INSERT INTO education_contents (day, phase, month, title, description, content, tips, category, tags)
            VALUES (
                i, 
                v_phase, 
                v_month,
                'Panduan Hari ke-' || i,
                'Tips dan trik harian untuk Bunda dan si kecil di hari ke-' || i,
                '# Judul Artikel Hari ke-' || i || chr(10) || chr(10) || 'Ini adalah konten edukasi otomatis untuk mengisi kekosongan. Konten asli akan segera hadir!',
                '["Selalu perhatikan tumbuh kembang", "Konsultasi ke dokter jika perlu"]'::jsonb,
                v_category,
                ARRAY[v_phase, 'hari-' || i]
            );
        END IF;
    END LOOP;
END $$;
