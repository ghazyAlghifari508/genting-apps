-- ============================================
-- GENTING: ROADMAP KEHAMILAN & PENCEGAHAN STUNTING
-- ============================================

-- 0. CLEAN START (Optional: Uncomment if you want to wipe and restart)
-- DROP TABLE IF EXISTS public.user_roadmap_progress CASCADE;
-- DROP TABLE IF EXISTS public.roadmap_activities CASCADE;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: Roadmap Activities
CREATE TABLE IF NOT EXISTS public.roadmap_activities (
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

-- 3. TABLE: User Roadmap Progress
CREATE TABLE IF NOT EXISTS public.user_roadmap_progress (
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

-- Indexes
CREATE INDEX idx_roadmap_category ON public.roadmap_activities(category);
CREATE INDEX idx_roadmap_trimester ON public.roadmap_activities(min_trimester, max_trimester);
CREATE INDEX idx_roadmap_difficulty ON public.roadmap_activities(difficulty_level);
CREATE INDEX idx_user_roadmap_user ON public.user_roadmap_progress(user_id);
CREATE INDEX idx_user_roadmap_status ON public.user_roadmap_progress(status);

-- 4. SET UP RLS
ALTER TABLE public.roadmap_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- Policies: Activities
DROP POLICY IF EXISTS "Public read roadmap_activities" ON public.roadmap_activities;
CREATE POLICY "Public read roadmap_activities" ON public.roadmap_activities FOR SELECT USING (TRUE);

-- Policies: User Progress
DROP POLICY IF EXISTS "Users view own progress" ON public.user_roadmap_progress;
CREATE POLICY "Users view own progress" ON public.user_roadmap_progress FOR SELECT USING (auth.uid() = user_id::UUID);
DROP POLICY IF EXISTS "Users insert own progress" ON public.user_roadmap_progress;
CREATE POLICY "Users insert own progress" ON public.user_roadmap_progress FOR INSERT WITH CHECK (auth.uid() = user_id::UUID);
DROP POLICY IF EXISTS "Users update own progress" ON public.user_roadmap_progress;
CREATE POLICY "Users update own progress" ON public.user_roadmap_progress FOR UPDATE USING (auth.uid() = user_id::UUID);
DROP POLICY IF EXISTS "Users delete own progress" ON public.user_roadmap_progress;
CREATE POLICY "Users delete own progress" ON public.user_roadmap_progress FOR DELETE USING (auth.uid() = user_id::UUID);

-- 5. SEED DATA
-- ============================================

INSERT INTO public.roadmap_activities (activity_name, category, description, benefits, difficulty_level, min_trimester, max_trimester, duration_minutes, frequency_per_week, instructions, tips, warnings, xp_reward, icon_name) 
VALUES
('Jalan Kaki Pagi', 'exercise', 'Jalan kaki santai di pagi hari.', '["Melancarkan darah"]'::jsonb, 1, 1, 3, 30, 5, '["Gunakan sepatu nyaman"]'::jsonb, 'Mulai 15 menit.', 'Hentikan jika pusing.', 10, 'Footprints'),
('Asam Folat Boost', 'nutrition', 'Memastikan asupan asam folat.', '["Mencegah cacat tabung saraf"]'::jsonb, 1, 1, 2, 0, 7, '["Konsumsi suplemen"]'::jsonb, 'Mulai sebelum hamil.', 'Jangan melebihi dosis.', 10, 'Pill')
ON CONFLICT DO NOTHING;

-- === OLAHRAGA TRIMESTER 2 ===
INSERT INTO roadmap_activities (activity_name, category, description, benefits, difficulty_level, min_trimester, max_trimester, duration_minutes, frequency_per_week, instructions, tips, warnings, xp_reward, icon_name) VALUES
('Prenatal Yoga', 'exercise', 'Yoga khusus ibu hamil yang aman dan bermanfaat untuk trimester kedua. Fokus pada relaksasi dan pernapasan.', '["Meningkatkan keseimbangan dan postur tubuh", "Mengurangi nyeri punggung bawah", "Melatih teknik pernapasan untuk persalinan", "Meningkatkan koneksi dengan bayi"]'::jsonb, 2, 2, 3, 45, 3, '["Mulai dengan posisi duduk nyaman dan pernapasan dalam", "Child pose: berlutut dan rentangkan tangan ke depan", "Cat-cow stretch: posisi merangkak, lengkungkan punggung", "Modified warrior pose: kaki terbuka, tangan di pinggul", "Akhiri dengan savasana (berbaring miring kiri)"]'::jsonb, 'Ikuti kelas prenatal yoga jika tersedia di daerah Anda. Gunakan bantal untuk support tambahan.', 'Hindari posisi telungkup dan twisting yang keras. Hentikan jika ada cramping atau ketidaknyamanan.', 15, 'Flower2'),

('Berenang', 'exercise', 'Berenang adalah olahraga rendah dampak yang sangat baik untuk ibu hamil di trimester kedua.', '["Mengurangi tekanan pada sendi dan tulang belakang", "Meningkatkan sirkulasi darah", "Mengurangi pembengkakan kaki", "Latihan kardio yang aman untuk ibu hamil"]'::jsonb, 2, 2, 3, 30, 2, '["Lakukan pemanasan ringan sebelum masuk kolam", "Gunakan gaya dada atau gaya bebas yang rileks", "Berenang dengan kecepatan sedang selama 20-30 menit", "Istirahat setiap 5-10 menit jika diperlukan", "Pendinginan dengan berjalan di air selama 5 menit"]'::jsonb, 'Pilih kolam renang dengan suhu air yang nyaman (tidak terlalu dingin/panas). Berenang di pagi/sore hari.', 'Pastikan kolam bersih dan tidak terlalu ramai. Hindari menyelam atau melompat ke kolam. Hati-hati lantai licin.', 15, 'Waves'),

('Senam Hamil', 'exercise', 'Senam hamil terstruktur untuk menjaga kebugaran dan mempersiapkan tubuh untuk persalinan.', '["Memperkuat otot-otot yang digunakan saat persalinan", "Meningkatkan daya tahan tubuh", "Mengurangi keluhan kehamilan seperti sakit punggung", "Memperlancar sirkulasi darah"]'::jsonb, 2, 2, 3, 30, 3, '["Pemanasan: jalan di tempat selama 3 menit", "Latihan lengan: angkat tangan ke atas dan ke samping", "Latihan kaki: squat ringan dengan tangan di pinggang", "Latihan pernapasan: tarik napas dalam, buang perlahan", "Pendinginan: stretching ringan selama 5 menit"]'::jsonb, 'Ikuti video panduan senam hamil yang tersertifikasi. Lakukan di ruangan yang berventilasi baik.', 'Jangan memaksakan gerakan. Istirahat jika merasa lelah. Hindari gerakan melompat atau terlalu cepat.', 15, 'Dumbbell');

-- === OLAHRAGA TRIMESTER 3 ===
INSERT INTO roadmap_activities (activity_name, category, description, benefits, difficulty_level, min_trimester, max_trimester, duration_minutes, frequency_per_week, instructions, tips, warnings, xp_reward, icon_name) VALUES
('Latihan Pernapasan', 'exercise', 'Teknik pernapasan khusus untuk mempersiapkan persalinan dan mengelola kontraksi.', '["Mempersiapkan teknik breathing untuk labor", "Mengurangi kecemasan menjelang persalinan", "Meningkatkan oksigen untuk bayi", "Membantu relaksasi di trimester akhir"]'::jsonb, 1, 3, 3, 15, 7, '["Pernapasan diafragma: tarik napas dalam ke perut, tahan 4 detik, buang 6 detik", "Pernapasan cepat (panting): napas pendek dan cepat dari mulut", "Pernapasan slow blow: tarik napas dari hidung, buang perlahan dari mulut", "Latih setiap teknik selama 3-5 menit", "Akhiri dengan pernapasan normal dan rileks"]'::jsonb, 'Latih setiap hari agar menjadi kebiasaan. Libatkan suami sebagai pendamping latihan pernapasan.', 'Jangan berlatih terlalu lama hingga pusing. Hentikan jika merasa tidak nyaman.', 10, 'Wind'),

('Jalan Santai Sore', 'exercise', 'Jalan santai dengan kecepatan rendah di sore hari untuk menjaga mobilitas tanpa membebani tubuh.', '["Menjaga mobilitas di trimester akhir", "Membantu posisi bayi yang optimal", "Mengurangi bengkak di kaki", "Meningkatkan kualitas tidur malam"]'::jsonb, 1, 3, 3, 20, 5, '["Pilih waktu sore yang sejuk (pukul 16:00-17:00)", "Jalan dengan kecepatan santai dan nyaman", "Istirahat setiap 10 menit jika perlu", "Jalan di area yang datar dan aman", "Bawa air minum dan selalu didampingi"]'::jsonb, 'Gunakan support belt jika perut terasa berat. Pakai sepatu yang sangat nyaman dan mendukung.', 'Hindari jalan terlalu jauh atau terlalu lama. Hentikan segera jika ada kontraksi atau kebocoran cairan.', 10, 'TreePalm'),

('Senam Lantai Pelvic', 'exercise', 'Latihan lantai panggul khusus untuk mempersiapkan otot-otot persalinan di trimester akhir.', '["Memperkuat otot panggul untuk persalinan", "Mengurangi risiko robek saat melahirkan", "Memudahkan proses pushing saat persalinan", "Mempercepat pemulihan pasca melahirkan"]'::jsonb, 2, 3, 3, 20, 5, '["Posisi butterfly: duduk dengan telapak kaki saling bersentuhan, tekan lutut ke bawah perlahan", "Pelvic tilt: berbaring telentang (atau miring kiri), kencangkan otot perut", "Bridge pose: berbaring, tekuk lutut, angkat pinggul perlahan", "Deep squat: squat dengan bantuan dinding atau kursi", "Tahan setiap posisi 10-15 detik, ulangi 10 kali"]'::jsonb, 'Lakukan di atas matras yang empuk. Gunakan bantal untuk support ekstra.', 'Jangan berbaring telentang terlalu lama di trimester 3. Ganti ke posisi miring kiri jika pusing.', 15, 'Target');

-- === NUTRISI TRIMESTER 1 ===
INSERT INTO roadmap_activities (activity_name, category, description, benefits, difficulty_level, min_trimester, max_trimester, duration_minutes, frequency_per_week, instructions, tips, warnings, xp_reward, icon_name) VALUES
('Asam Folat Boost', 'nutrition', 'Memastikan asupan asam folat yang cukup untuk perkembangan tabung saraf bayi di trimester pertama.', '["Mencegah cacat tabung saraf (spina bifida)", "Mendukung pembentukan sel darah merah", "Penting untuk perkembangan otak janin", "Mencegah anemia pada ibu hamil"]'::jsonb, 1, 1, 2, 0, 7, '["Konsumsi suplemen asam folat 400-600 mcg per hari", "Makan sayuran hijau gelap: bayam, brokoli, asparagus", "Tambahkan kacang-kacangan: kacang merah, edamame", "Konsumsi buah jeruk dan alpukat", "Pilih roti dan sereal yang difortifikasi asam folat"]'::jsonb, 'Mulai konsumsi asam folat bahkan sebelum hamil jika memungkinkan. Konsultasikan dosis dengan dokter.', 'Jangan melebihi dosis yang direkomendasikan tanpa konsultasi dokter. Beberapa wanita memerlukan dosis lebih tinggi.', 10, 'Pill'),

('Protein Harian', 'nutrition', 'Memenuhi kebutuhan protein harian untuk mendukung pertumbuhan janin dan menjaga kesehatan ibu.', '["Mendukung pertumbuhan jaringan janin", "Menjaga massa otot ibu hamil", "Membantu pembentukan plasenta", "Mencegah stunting sejak dalam kandungan"]'::jsonb, 1, 1, 3, 0, 7, '["Target protein: 60-75 gram per hari", "Sarapan: telur rebus atau omelette dengan sayuran", "Makan siang: ayam/ikan/tempe/tahu dengan nasi dan sayur", "Snack: yogurt, kacang almond, atau susu", "Makan malam: sup daging atau ikan panggang"]'::jsonb, 'Kombinasikan protein hewani dan nabati. Masak daging hingga matang sempurna.', 'Hindari ikan mentah (sushi), daging yang kurang matang, dan telur setengah matang.', 10, 'Beef'),

('Hidrasi Optimal', 'nutrition', 'Memastikan asupan cairan yang cukup untuk mendukung volume darah yang meningkat selama kehamilan.', '["Mendukung pembentukan air ketuban", "Mencegah dehidrasi dan konstipasi", "Membantu transportasi nutrisi ke janin", "Mengurangi risiko infeksi saluran kemih"]'::jsonb, 1, 1, 3, 0, 7, '["Minum minimal 8-10 gelas air putih per hari (2-2.5 liter)", "Mulai hari dengan segelas air hangat", "Bawa botol air ke mana-mana sebagai pengingat", "Tambahkan irisan lemon atau mentimun untuk variasi rasa", "Minum lebih banyak saat cuaca panas atau setelah olahraga"]'::jsonb, 'Set alarm di HP setiap 2 jam sebagai reminder minum air. Warna urin yang baik adalah kuning pucat.', 'Hindari minuman berkafein berlebihan (max 200mg/hari). Kurangi minum berlebihan menjelang tidur agar tidak sering ke toilet malam.', 10, 'Droplets');

-- === NUTRISI TRIMESTER 2 ===
INSERT INTO roadmap_activities (activity_name, category, description, benefits, difficulty_level, min_trimester, max_trimester, duration_minutes, frequency_per_week, instructions, tips, warnings, xp_reward, icon_name) VALUES
('Zat Besi & Kalsium', 'nutrition', 'Meningkatkan asupan zat besi dan kalsium yang sangat penting di trimester kedua untuk cegah stunting.', '["Mencegah anemia pada ibu hamil", "Mendukung pembentukan tulang dan gigi bayi", "Mencegah stunting sejak dalam kandungan", "Menjaga kepadatan tulang ibu"]'::jsonb, 2, 2, 3, 0, 7, '["Zat besi: konsumsi daging merah, hati ayam, bayam, dan kacang-kacangan", "Kalsium: susu, yogurt, keju, ikan teri, dan brokoli", "Konsumsi vitamin C bersama makanan kaya zat besi untuk penyerapan", "Target zat besi: 27 mg/hari, kalsium: 1000 mg/hari", "Minum suplemen sesuai resep dokter"]'::jsonb, 'Jangan minum suplemen zat besi bersamaan dengan susu/kalsium karena menghambat penyerapan. Beri jarak 2 jam.', 'Suplemen zat besi bisa menyebabkan BAB kehitaman, ini normal. Konsultasikan jika ada efek samping berat.', 15, 'Apple'),

('Menu Seimbang', 'nutrition', 'Menyusun pola makan seimbang dengan panduan isi piringku yang disesuaikan untuk ibu hamil trimester 2.', '["Memastikan asupan gizi seimbang", "Mendukung pertumbuhan optimal janin", "Menjaga berat badan kehamilan ideal", "Mencegah defisiensi nutrisi penyebab stunting"]'::jsonb, 1, 2, 3, 0, 7, '["Isi piring: 1/3 karbohidrat (nasi/roti/kentang)", "1/4 protein (lauk hewani + nabati)", "1/3 sayuran beragam warna", "Buah-buahan 2-3 porsi per hari", "Tambahan: susu atau produk susu 2 gelas/hari"]'::jsonb, 'Masak sendiri di rumah untuk kontrol kebersihan dan nutrisi. Variasi menu setiap hari agar tidak bosan.', 'Hindari makanan olahan berlebihan, MSG tinggi, dan makanan mentah. Batasi gula dan garam.', 10, 'Salad'),

('Omega-3 Power', 'nutrition', 'Memastikan asupan omega-3 (DHA & EPA) yang cukup untuk perkembangan otak dan mata bayi.', '["Mendukung perkembangan otak janin", "Meningkatkan perkembangan penglihatan bayi", "Mengurangi risiko kelahiran prematur", "Mencegah stunting melalui perkembangan kognitif optimal"]'::jsonb, 2, 2, 3, 0, 5, '["Konsumsi ikan salmon, sarden, atau kembung 2-3 kali/minggu", "Tambahkan alpukat dan kacang kenari ke menu harian", "Gunakan minyak zaitun untuk memasak atau salad", "Pertimbangkan suplemen minyak ikan (konsultasi dokter)", "Target DHA: 200-300 mg per hari"]'::jsonb, 'Pilih ikan laut kecil yang rendah merkuri. Suplemen ikan harus bersertifikasi bebas kontaminan.', 'Hindari ikan predator besar (hiu, todak, king mackerel) karena tinggi merkuri. Batasi tuna max 2 porsi/minggu.', 15, 'Fish');

-- === NUTRISI TRIMESTER 3 ===
INSERT INTO roadmap_activities (activity_name, category, description, benefits, difficulty_level, min_trimester, max_trimester, duration_minutes, frequency_per_week, instructions, tips, warnings, xp_reward, icon_name) VALUES
('Kalori Terkontrol', 'nutrition', 'Mengatur asupan kalori yang tepat di trimester ketiga untuk mendukung pertumbuhan akhir bayi tanpa berat badan berlebih.', '["Mendukung pertumbuhan berat badan bayi yang optimal", "Mencegah bayi terlalu besar (makrosomia)", "Menjaga berat badan kehamilan sehat", "Mempersiapkan energi untuk persalinan"]'::jsonb, 2, 3, 3, 0, 7, '["Tambah 300-450 kalori dari kebutuhan normal", "Makan dalam porsi kecil tapi sering (5-6x/hari)", "Prioritaskan nutrient-dense food, bukan empty calories", "Contoh snack sehat: buah + kacang, roti gandum + selai kacang", "Catat asupan harian untuk monitoring"]'::jsonb, 'Jangan berdiet di trimester 3! Fokus pada kualitas makanan, bukan mengurangi kuantitas.', 'Hindari junk food dan makanan tinggi gula. Konsultasikan dengan dokter jika kenaikan berat badan terlalu cepat atau terlalu lambat.', 15, 'Scale'),

('Vitamin D & K', 'nutrition', 'Memastikan asupan vitamin D dan K yang cukup untuk pembentukan tulang kuat bayi menjelang kelahiran.', '["Mendukung penyerapan kalsium untuk tulang bayi", "Mencegah risiko rakhitis pada bayi baru lahir", "Mendukung sistem imun ibu dan bayi", "Mencegah stunting melalui pembentukan tulang optimal"]'::jsonb, 2, 3, 3, 0, 7, '["Berjemur matahari pagi (08:00-10:00) selama 15-20 menit", "Konsumsi ikan berlemak, kuning telur, dan susu fortifikasi", "Vitamin K: sayuran hijau (bayam, kale, brokoli)", "Pertimbangkan suplemen vitamin D (konsultasi dokter)", "Target vitamin D: 600 IU per hari"]'::jsonb, 'Berjemur pagi adalah cara terbaik dan gratis mendapatkan vitamin D. Pakai sunscreen setelah 15 menit.', 'Jangan mengonsumsi vitamin D dosis tinggi tanpa resep dokter. Over-dosis vitamin D bisa berbahaya.', 15, 'Sun'),

('Persiapan ASI', 'nutrition', 'Nutrisi khusus untuk mempersiapkan produksi ASI yang berkualitas setelah melahirkan.', '["Mempersiapkan produksi ASI yang berkualitas", "Mendukung nutrisi awal bayi pasca lahir", "Mencegah stunting di 6 bulan pertama kehidupan", "Mempercepat pemulihan ibu pasca melahirkan"]'::jsonb, 1, 3, 3, 0, 7, '["Konsumsi makanan galaktagog: daun katuk, oats, almond", "Tingkatkan asupan protein untuk produksi ASI", "Tambahkan omega-3 dari ikan dan kacang-kacangan", "Minum air putih lebih banyak (3 liter/hari)", "Konsumsi buah-buahan kaya vitamin C: pepaya, jambu, jeruk"]'::jsonb, 'Mulai dari sekarang agar tubuh siap memproduksi ASI sejak hari pertama. Jangan stres, itu menghambat produksi ASI.', 'Konsultasikan dengan konselor laktasi jika ada kekhawatiran tentang menyusui. Hindari herbal yang belum terbukti aman.', 10, 'Baby');
