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
    console.log("Seeding Education Contents...");
    const educationItems = [
      {
        day: 1,
        phase: 'kehamilan',
        month: 1,
        title: 'Nutrisi Awal Kehamilan',
        description: 'Pentingnya asam folat di bulan pertama.',
        content: 'Pada bulan pertama kehamilan, asam folat sangat krusial untuk mencegah cacat tabung saraf pada janin.',
        category: 'nutrisi',
        tips: ['Konsumsi sayuran hijau', 'Minum suplemen asam folat', 'Hindari kafein berlebih']
      },
      {
        day: 30,
        phase: 'kehamilan',
        month: 1,
        title: 'Mengatasi Mual Pagi Hari',
        description: 'Tips menghadapi morning sickness.',
        content: 'Mual di pagi hari adalah hal normal. Cobalah makan dalam porsi kecil tapi sering.',
        category: 'kesehatan',
        tips: ['Makan biskuit kering', 'Minum air jahe hangat', 'Istirahat cukup']
      },
      {
        day: 280,
        phase: 'bayi_0_3',
        month: 10,
        title: 'Inisiasi Menyusui Dini (IMD)',
        description: 'Langkah pertama pemberian ASI.',
        content: 'IMD membantu bayi mendapatkan kolostrum yang kaya akan antibodi.',
        category: 'nutrisi',
        tips: ['Skin-to-skin contact', 'Tenangkan pikiran Bunda', 'Minta bantuan bidan']
      },
      {
        day: 400,
        phase: 'bayi_3_12',
        month: 14,
        title: 'Mulai Mengenal MPASI',
        description: 'Persiapan pemberian makanan pendamping.',
        content: 'Setelah 6 bulan, bayi mulai membutuhkan nutrisi tambahan dari makanan selain ASI.',
        category: 'nutrisi',
        tips: ['Gunakan tekstur lembut', 'Pilih sayuran organik', 'Mulai satu jenis makanan']
      }
    ];

    for (const item of educationItems) {
      const { error } = await supabase.from('education_contents').upsert(item, { onConflict: 'day' });
      if (error) console.error(`Error seeding education day ${item.day}:`, error);
    }

    console.log("Seeding Roadmap Activities...");
    const activities = [
      {
        activity_name: 'Jalan Santai Pagi',
        category: 'exercise',
        description: 'Aktivitas ringan untuk menjaga stamina.',
        difficulty_level: 1,
        icon_name: 'Footprints',
        xp_reward: 20,
        min_trimester: 1,
        max_trimester: 3,
        duration_minutes: 20,
        frequency_per_week: 3,
        benefits: ['Peredaran darah lancar', 'Mengurangi stres'],
        instructions: ['Gunakan sepatu nyaman', 'Cari area udara segar', 'Jalan selama 20 menit'],
        tips: 'Lakukan di bawah sinar matahari pagi.',
        warnings: 'Berhenti jika merasa pusing.'
      },
      {
        activity_name: 'Konsumsi Protein Tinggi',
        category: 'nutrition',
        description: 'Menu wajib harian untuk pertumbuhan janin.',
        difficulty_level: 1,
        icon_name: 'Egg',
        xp_reward: 15,
        min_trimester: 1,
        max_trimester: 3,
        duration_minutes: 15,
        frequency_per_week: 7,
        benefits: ['Pembentukan jaringan otak', 'Energi untuk Bunda'],
        instructions: ['Sediakan telur, tempe, atau ikan', 'Masak hingga matang sempurna'],
        tips: 'Variasikan jenis protein setiap hari.',
        warnings: 'Pastikan bahan makanan segar.'
      }
    ];

    for (const activity of activities) {
      const { error } = await supabase.from('roadmap_activities').upsert(activity, { onConflict: 'activity_name' });
      if (error) console.error(`Error seeding activity ${activity.activity_name}:`, error);
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Critical error during seeding:", err);
  } finally {
    process.exit();
  }
}

seed();
