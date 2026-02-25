'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function BlogSection() {
  const posts = [
    {
      category: 'Tumbuh Kembang',
      date: '21 Feb 2026',
      title: 'Tips Memantau Pertumbuhan Anak di 1000 Hari Pertama',
      img: '/images/unsplash/img_fcb70719.png' // Using an alternative baby/parenting photo
    },
    {
      category: 'Imunisasi',
      date: '10 Feb 2026',
      title: 'Kenapa Jadwal Imunisasi Tepat Waktu Itu Penting',
      img: '/images/unsplash/img_92c6c82b.png'
    },
    {
      category: 'Nutrisi',
      date: '28 Jan 2026',
      title: 'Panduan Gizi Seimbang untuk Cegah Stunting',
      img: '/images/unsplash/img_cad8a401.png'
    }
  ]

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors" id="blog">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center text-xs font-bold bg-doccure-teal text-white rounded-full px-4 py-1.5 mb-6 relative">
              <div className="absolute -left-1 w-2.5 h-2.5 bg-doccure-yellow rounded-full" />
              Artikel Terbaru
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4 transition-colors">
              Blog & Artikel Edukasi
              <span className="text-doccure-teal"> dari Genting</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed max-w-md mb-8 transition-colors">
              Dapatkan insight praktis seputar nutrisi, tumbuh kembang, dan pencegahan stunting
              untuk mendukung kesehatan anak.
            </p>
            <Link href="/education" className="inline-flex items-center gap-2 text-sm font-bold text-doccure-teal hover:underline">
              Lihat Semua Artikel
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="space-y-6">
            {posts.map((post, idx) => (
              <div key={idx} className="flex gap-5 items-center group cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-2 transition-colors">
                    <span className="px-3 py-1 rounded-full bg-doccure-gray dark:bg-slate-800 text-doccure-teal font-bold transition-colors">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-doccure-teal transition-colors">
                    {post.title}
                  </h3>
                </div>
                <Image
                  src={post.img}
                  alt={post.title}
                  width={112}
                  height={80}
                  className="w-28 h-20 rounded-2xl object-cover flex-shrink-0 grayscale-[0.2] group-hover:grayscale-0 transition-all shadow-md dark:shadow-none border border-transparent dark:border-white/10"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
