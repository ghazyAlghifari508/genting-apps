import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load env vars
dotenv.config({ path: ".env.local" });

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing required environment variables.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log("Cleaning up existing data...");
    // Optional: Delete existing data to avoid conflicts or duplicates if desired
    // await supabase.from('education_contents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // await supabase.from('roadmap_activities').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log("Seeding Education Contents...");
    const educationItems = [
      // PHASE: Kehamilan
      { day: 1, phase: 'kehamilan', month: 1, title: 'Keajaiban Awal: Pembuahan', description: 'Memahami proses luar biasa di minggu pertama.', category: 'kesehatan', content: 'Minggu pertama kehamilan sebenarnya adalah masa menstruasi terakhir Anda. Tubuh sedang bersiap untuk ovulasi dan pembuahan yang akan datang.', tips: ['Mulai konsumsi asam folat 400mcg harian', 'Hentikan kebiasaan merokok dan alkohol', 'Catat tanggal haid terakhir dengan teliti'] },
      { day: 14, phase: 'kehamilan', month: 1, title: 'Nutrisi Penting Trimester Pertama', description: 'Zink dan Protein untuk pembelahan sel.', category: 'nutrisi', content: 'Pada fase ini, pembelahan sel terjadi sangat cepat. Protein berkualitas tinggi dan Zink sangat dibutuhkan untuk mendukung proses ini.', tips: ['Konsumsi telur matang sempurna', 'Tambahkan kacang-kacangan dalam menu harian', 'Tetap terhidrasi dengan air putih'] },
      { day: 30, phase: 'kehamilan', month: 1, title: 'Mengelola Morning Sickness', description: 'Tips menghadapi mual dan muntah di pagi hari.', category: 'kesehatan', content: 'Mual adalah tanda hormon kehamilan bekerja. Jahe dan porsi makan kecil namun sering dapat membantu meredakan gejala.', tips: ['Makan biskuit gandum saat bangun tidur', 'Hindari bau-bauan yang tajam', 'Konsultasi jika muntah terlalu sering'] },
      { day: 60, phase: 'kehamilan', month: 2, title: 'Pembentukan Organ Vital', description: 'Jantung dan saraf Si Kecil mulai terbentuk.', category: 'perkembangan', content: 'Di bulan kedua, jantung janin mulai berdenyut. Ini adalah periode sensitif di mana paparan zat berbahaya harus dihindari sepenuhnya.', tips: ['Lakukan pemeriksaan ANC pertama', 'Hindari paparan asap rokok', 'Minum vitamin prenatal secara rutin'] },
      { day: 90, phase: 'kehamilan', month: 3, title: 'Kesehatan Gigi Saat Hamil', description: 'Mencegah radang gusi akibat perubahan hormon.', category: 'kesehatan', content: 'Hormon kehamilan dapat membuat gusi lebih sensitif. Infeksi gusi yang parah dapat berdampak pada kesehatan kehamilan.', tips: ['Gunakan sikat gigi berbulu halus', 'Rutin flossing', 'Lakukan pemeriksaan gigi ringan'] },
      { day: 120, phase: 'kehamilan', month: 4, title: 'Bonding Melalui Suara', description: 'Si Kecil mulai bisa mendengar detak jantung Bunda.', category: 'stimulasi', content: 'Pada trimester kedua, sistem pendengaran janin berkembang. Mulailah berbicara atau membacakan buku untuk Si Kecil.', tips: ['Bicaralah dengan lembut pada perut', 'Putar musik yang menenangkan', 'Ajak Ayah untuk ikut berkomunikasi'] },
      { day: 150, phase: 'kehamilan', month: 5, title: 'Gerakan Pertama yang Menakjubkan', description: 'Mengenal tendangan halus atau "quickening".', category: 'perkembangan', content: 'Banyak Bunda mulai merasakan gerakan janin di bulan kelima. Ini adalah tanda perkembangan saraf dan otot yang baik.', tips: ['Luangkan waktu untuk memantau pergerakan', 'Gunakan bantal penyangga saat tidur', 'Tetap aktif dengan olahraga ringan'] },
      { day: 180, phase: 'kehamilan', month: 6, title: 'Waspada Diabetes Gestasional', description: 'Menjaga kadar gula darah selama kehamilan.', category: 'nutrisi', content: 'Pemeriksaan gula darah penting dilakukan di trimester kedua untuk memastikan metabolisme Bunda tetap stabil demi pertumbuhan janin.', tips: ['Kurangi konsumsi gula tambahan', 'Perbanyak serat dari buah dan sayur', 'Lakukan tes glukosa jika direkomendasikan dokter'] },
      { day: 210, phase: 'kehamilan', month: 7, title: 'Persiapan Ruang Bersalin', description: 'Menyiapkan mental dan perlengkapan persalinan.', category: 'aktivitas', content: 'Memasuki trimester ketiga, saatnya mulai merencanakan tempat persalinan dan menyiapkan "Hospital Bag".', tips: ['Ikuti kelas senam hamil', 'Pelajari teknik pernapasan', 'Siapkan rujukan medis jika diperlukan'] },
      { day: 240, phase: 'kehamilan', month: 8, title: 'Nutrisi untuk Perkembangan Otak', description: 'DHA dan Omega-3 di akhir kehamilan.', category: 'nutrisi', content: 'Di bulan-bulan terakhir, otak janin berkembang sangat pesat. Asam lemak esensial sangat dibutuhkan untuk maturitas saraf.', tips: ['Konsumsi ikan laut dalam yang rendah merkuri', 'Tambahkan alpukat atau minyak zaitun', 'Tetap konsumsi suplemen dari dokter'] },
      { day: 270, phase: 'kehamilan', month: 9, title: 'Tanda-tanda Persalinan Sudah Dekat', description: 'Membedakan kontraksi asli dan palsu.', category: 'kesehatan', content: 'Kenali tanda persalinan seperti pecah ketuban, munculnya lendir darah, atau kontraksi yang teratur dan semakin kuat.', tips: ['Catat frekuensi kontraksi', 'Tetap tenang dan atur napas', 'Segera ke fasilitas kesehatan jika ketuban pecah'] },

      // PHASE: Bayi 0-3 Bulan
      { day: 280, phase: 'bayi_0_3', month: 10, title: 'Manfaat Emas Kolostrum', description: 'Imunisasi alami pertama untuk bayi baru lahir.', category: 'nutrisi', content: 'Cairan kuning kental yang keluar pertama kali dari payudara mengandung antibodi yang sangat tinggi untuk melindungi bayi.', tips: ['Lakukan IMD minimal 1 jam', 'Jangan buang kolostrum', 'Susui sesering mungkin'] },
      { day: 310, phase: 'bayi_0_3', month: 11, title: 'Pola Tidur Bayi Baru Lahir', description: 'Memahami ritme sirkadian Si Kecil.', category: 'kesehatan', content: 'Bayi baru lahir tidur 16-18 jam sehari namun sering terbangun untuk menyusu. Bantu Si Kecil mengenal siang dan malam.', tips: ['Pencahayaan redup saat malam', 'Tetap tenang saat menyusui di malam hari', 'Ikut tidur saat bayi tidur'] },

      // PHASE: Bayi 3-12 Bulan
      { day: 450, phase: 'bayi_3_12', month: 15, title: 'Kesiapan MPASI 6 Bulan', description: 'Tanda bayi siap mengenal makanan padat.', category: 'nutrisi', content: 'ASI tetap yang utama, namun di usia 6 bulan bayi butuh zat besi tambahan dari makanan pendamping.', tips: ['Pastikan bayi bisa duduk tegak', 'Pilih menu MPASI bergizi seimbang', 'Mulai dengan tekstur bubur halus'] },
      { day: 540, phase: 'bayi_3_12', month: 18, title: 'Stimulasi Merangkak', description: 'Mendukung perkembangan motorik kasar.', category: 'stimulasi', content: 'Merangkak melatih koordinasi otak kanan dan kiri. Pastikan area bermain bayi aman dan bersih.', tips: ['Lakukan "tummy time" secara rutin', 'Letakkan mainan sedikit di luar jangkauan', 'Beri pujian saat bayi berusaha bergerak'] },

      // PHASE: Anak 1-2 Tahun
      { day: 700, phase: 'anak_1_2', month: 24, title: 'Mengatasi Fase "Picky Eater"', description: 'Tips saat anak mulai pemilih makanan.', category: 'nutrisi', content: 'Wajar jika balita mulai memilih makanan. Tetap sajikan berbagai jenis nutrisi dengan cara yang kreatif.', tips: ['Jangan paksa anak makan', 'Beri contoh makan bersama', 'Sajikan makanan dalam bentuk menarik'] },
    ];

    for (const item of educationItems) {
      const { error } = await supabase.from('education_contents').upsert(item, { onConflict: 'day' });
      if (error) console.error(`Error seeding education day ${item.day}:`, error);
    }

    console.log("Seeding Roadmap Activities...");
    const activities = [
      // CATEGORY: Exercise
      { activity_name: 'Jalan Santai Pagi', category: 'exercise', description: 'Aktivitas ringan untuk menjaga stamina dan menghirup udara segar.', difficulty_level: 1, min_trimester: 1, max_trimester: 3, duration_minutes: 20, frequency_per_week: 3, benefits: ['Peredaran darah lancar', 'Mengurangi pembengkakan kaki'], instructions: ['Gunakan sepatu olahraga yang nyaman', 'Cari area hijau atau udara segar', 'Berjalan dengan ritme santai selama 20 menit'], tips: 'Lakukan sebelum jam 8 pagi untuk mendapatkan vitamin D gratis.', warnings: 'Berhenti segera jika merasa pusing atau sesak napas.' },
      { activity_name: 'Yoga Prenatal Dasar', category: 'exercise', description: 'Peregangan lembut untuk kelenturan panggul.', difficulty_level: 2, min_trimester: 2, max_trimester: 3, duration_minutes: 30, frequency_per_week: 2, benefits: ['Mengurangi nyeri punggung', 'Mempersiapkan area panggul'], instructions: ['Gunakan matras yoga yang tidak licin', 'Fokus pada gerakan peregangan punggung dan panggul', 'Jangan menahan napas saat melakukan pose'], tips: 'Gunakan bantuan bantal atau blok jika diperlukan.', warnings: 'Hindari pose berbaring telentang terlalu lama di trimester 3.' },
      
      // CATEGORY: Nutrition
      { activity_name: 'Minum Suplemen Asam Folat', category: 'nutrition', description: 'Kewajiban harian untuk mencegah cacat tabung saraf janin.', difficulty_level: 1, min_trimester: 1, max_trimester: 1, duration_minutes: 2, frequency_per_week: 7, benefits: ['Pencegahan cacat bawaan', 'Mendukung pertumbuhan sel janin'], instructions: ['Minum satu tablet sesuai dosis dokter', 'Gunakan air putih, hindari teh atau kopi saat meminumnya'], tips: 'Siapkan alarm agar tidak terlewat setiap harinya.', warnings: 'Konsultasikan dosis yang tepat dengan bidan atau dokter.' },
      { activity_name: 'Konsumsi Protein Berkualitas', category: 'nutrition', description: 'Memenuhi kuota protein harian untuk membangun jaringan tubuh janin.', difficulty_level: 1, min_trimester: 1, max_trimester: 3, duration_minutes: 30, frequency_per_week: 7, benefits: ['Perkembangan organ janin', 'Mencegah anemia pada Bunda'], instructions: ['Sediakan telur, tempe, tahu, ikan, atau daging tanpa lemak', 'Pastikan dimasak sampai matang sempurna'], tips: 'Variasikan sumber protein agar Bunda tidak bosan.', warnings: 'Hindari daging mentah atau setengah matang (seperti sushi/steak medium).' },
      
      // CATEGORY: Sleep
      { activity_name: 'Deep Sleep 8 Jam', category: 'sleep', description: 'Memberikan waktu tubuh untuk regenerasi dan menghemat energi.', difficulty_level: 1, min_trimester: 1, max_trimester: 3, duration_minutes: 480, frequency_per_week: 7, benefits: ['Mencegah kelelahan kronis', 'Optimalisasi hormon pertumbuhan janin'], instructions: ['Gunakan bantal penyangga di antara kaki', 'Matikan lampu dan perangkat elektronik 30 menit sebelum tidur'], tips: 'Tidur dengan posisi miring ke kiri untuk sirkulasi darah terbaik.', warnings: 'Gunakan bantal tambahan jika Bunda merasa sesak saat tidur miring.' },

      // CATEGORY: Mental
      { activity_name: 'Meditasi Syukur 10 Menit', category: 'mental', description: 'Menenangkan pikiran dan membangun aura positif.', difficulty_level: 1, min_trimester: 1, max_trimester: 3, duration_minutes: 10, frequency_per_week: 5, benefits: ['Mengurangi kecemasan persalinan', 'Menurunkan hormon stres (kortisol)'], instructions: ['Duduk dengan posisi nyaman', 'Tutup mata dan fokus pada napas', 'Ucapkan rasa syukur atas setiap perkembangan janin'], tips: 'Gunakan wewangian aromaterapi yang Bunda sukai.', warnings: 'Jika pikiran negatif datang, jangan dilawan, pelan-pelan kembalikan fokus ke napas.' },

      // CATEGORY: Checkup
      { activity_name: 'Update Log Berat Badan harian', category: 'checkup', description: 'Memantau kenaikan berat badan agar tetap dalam batas ideal.', difficulty_level: 1, min_trimester: 1, max_trimester: 3, duration_minutes: 5, frequency_per_week: 7, benefits: ['Deteksi dini komplikasi (preeklamsia)', 'Kontrol nutrisi Bunda'], instructions: ['Timbang berat badan di pagi hari saat baru bangun', 'Catat hasil di aplikasi untuk melihat tren'], tips: 'Gunakan timbangan yang sama setiap kalinya untuk konsistensi.', warnings: 'Laporkan jika terjadi kenaikan yang sangat mendadak.' },

      // CATEGORY: Bonding
      { activity_name: 'Membaca Cerita untuk Janin', category: 'bonding', description: 'Mulai mengenalkan suara Bunda dan membangun kedekatan sejak dini.', difficulty_level: 1, min_trimester: 2, max_trimester: 3, duration_minutes: 15, frequency_per_week: 4, benefits: ['Stimulasi pendengaran janin', 'Memberikan rasa aman pada bayi'], instructions: ['Pilih buku dengan narasi yang menenangkan', 'Bicaralah dengan intonasi yang jelas dan lembut dekat perut'], tips: 'Ajak Ayah untuk membacakan satu paragraf agar bayi kenal suara Ayah.', warnings: 'Pastikan lingkungan sekitar tenang agar Bunda bisa fokus.' },
    ];

    for (const activity of activities) {
      // Manual check because activity_name is not unique in schema
      const { data: existing } = await supabase
        .from('roadmap_activities')
        .select('id')
        .eq('activity_name', activity.activity_name)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('roadmap_activities')
          .update(activity)
          .eq('id', existing.id);
        if (error) console.error(`Error updating activity ${activity.activity_name}:`, error);
      } else {
        const { error } = await supabase
          .from('roadmap_activities')
          .insert(activity);
        if (error) console.error(`Error inserting activity ${activity.activity_name}:`, error);
      }
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Critical error during seeding:", err);
  } finally {
    process.exit();
  }
}

seed();
