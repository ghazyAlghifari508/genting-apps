import { 
  Route, 
  Camera, 
  BookOpen, 
  Stethoscope 
} from 'lucide-react'

export const serviceCards = [
  {
    title: 'Roadmap',
    desc: 'Langkah harian 1000 HPK sesuai fase kehamilan.',
    href: '/roadmap',
    icon: Route,
    color: 'bg-blue-500',
  },
  {
    title: 'Vision',
    desc: 'Analisis nutrisi molekuler dengan GENTING Vision.',
    href: '/vision',
    icon: Camera,
    color: 'bg-indigo-500',
  },
  {
    title: 'Edukasi',
    desc: 'Materi terstruktur untuk ibu hamil dan keluarga.',
    href: '/education',
    icon: BookOpen,
    color: 'bg-emerald-500',
  },
  {
    title: 'Konsultasi',
    desc: 'Terhubung dengan dokter untuk pendampingan aktif.',
    href: '/konsultasi-dokter',
    icon: Stethoscope,
    color: 'bg-doccure-teal',
  },
]

export const dailyTasksByTrimester: Record<number, string[]> = {
  1: [
    'Konsumsi asam folat dan zat besi sesuai anjuran',
    'Minum air putih minimal 8 gelas hari ini',
    'Catat keluhan mual untuk bahan konsultasi',
  ],
  2: [
    'Konsumsi zat besi 60mg sesuai rekomendasi',
    'Cek gerakan janin (10 gerakan per 2 jam)',
    'Jadwalkan kontrol rutin pekan ini',
  ],
  3: [
    'Pantau kontraksi dan gerakan janin setiap hari',
    'Siapkan tas persalinan dan dokumen penting',
    'Konfirmasi rencana kontrol dan persalinan',
  ],
}

export const remindersByTrimester: Record<number, string[]> = {
  1: [
    'USG awal kehamilan penting untuk konfirmasi usia janin.',
    'Baca edukasi: nutrisi penting trimester pertama.',
    'Catat gejala yang berulang untuk dibahas saat konsultasi.',
  ],
  2: [
    'USG trimester 2 biasanya dilakukan pada minggu 18-22.',
    'Artikel baru: makanan kaya folat untuk trimester 2.',
    'Pastikan jadwal kontrol ke bidan tidak terlewat.',
  ],
  3: [
    'Pantau tanda persalinan dan konsultasikan bila muncul gejala.',
    'Baca edukasi: persiapan menyusui di minggu akhir kehamilan.',
    'Pastikan kontak dokter aktif untuk kondisi darurat.',
  ],
}

export const educationByTrimester: Record<number, Array<{ title: string; href: string }>> = {
  1: [
    { title: 'Nutrisi trimester 1 untuk cegah risiko stunting', href: '/education' },
    { title: 'Tanda bahaya awal kehamilan yang wajib dipantau', href: '/education' },
    { title: 'Panduan aktivitas aman di trimester pertama', href: '/education' },
  ],
  2: [
    { title: 'Kenali tanda bahaya preeklamsia lebih dini', href: '/education' },
    { title: 'Panduan nutrisi trimester 2 untuk ibu hamil', href: '/education' },
    { title: 'Video gerakan ringan untuk ibu hamil trimester 2', href: '/education' },
  ],
  3: [
    { title: 'Checklist persiapan persalinan yang perlu disiapkan', href: '/education' },
    { title: 'Strategi nutrisi trimester 3 jelang persalinan', href: '/education' },
    { title: 'Rencana menyusui dan perawatan awal bayi', href: '/education' },
  ],
}
