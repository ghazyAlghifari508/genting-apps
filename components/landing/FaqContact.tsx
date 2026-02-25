'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    q: 'Usia berapa saja yang bisa dipantau di Genting?',
    a: 'Genting dapat digunakan untuk memantau tumbuh kembang anak dari usia 0 hingga 5 tahun (balita), serta mendampingi ibu hamil melalui fitur Roadmap.'
  },
  {
    q: 'Bagaimana cara membaca grafik pertumbuhan anak?',
    a: 'Grafik pertumbuhan menggunakan standar WHO. Area hijau menandakan pertumbuhan normal, kuning berisiko, dan merah membutuhkan perhatian medis segera.'
  },
  {
    q: 'Apakah saya bisa konsultasi secara online?',
    a: 'Ya. Anda bisa melakukan reservasi dan konsultasi langsung dengan dokter spesialis anak terverifikasi melalui fitur Konsultasi Dokter.'
  },
  {
    q: 'Apakah data medis anak saya aman?',
    a: 'Kami menggunakan enkripsi untuk melindungi seluruh data medis dan privasi pengguna. Keamanan data adalah prioritas utama.'
  },
  {
    q: 'Bagaimana cara kerja fitur Vision AI?',
    a: 'Vision AI memungkinkan Anda scan makanan menggunakan kamera untuk mendapatkan informasi nutrisi secara instan.'
  }
]

export default function FaqContact() {
  const [open, setOpen] = useState<number | null>(1)

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors overflow-hidden" id="faq">
      {/* Marquee Strip at top - will be placed higher in page.tsx, skipping here */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Left: FAQ */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center text-[10px] md:text-xs font-bold bg-doccure-teal text-white rounded-full px-4 py-1.5 mb-6 relative">
              <div className="absolute -left-1 w-2.5 h-2.5 bg-doccure-yellow rounded-full" />
              FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4 transition-colors">
              Blog & Artikel Edukasi
              <span className="text-doccure-teal"> dari Genting</span>
            </h2>

            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={false}
                  className="py-5"
                >
                  <button
                    className="w-full flex items-center justify-between text-left gap-4"
                    onClick={() => setOpen(open === idx ? null : idx)}
                  >
                    <span className={`text-[15px] font-semibold transition-colors ${open === idx ? 'text-doccure-teal' : 'text-slate-800 dark:text-slate-200'}`}>
                      {faq.q}
                    </span>
                    <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center border transition-colors ${open === idx ? 'border-doccure-teal/40 text-doccure-teal bg-doccure-teal/5' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                      {open === idx ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                  {open === idx && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-slate-600 dark:text-slate-400 text-[14px] leading-relaxed pr-10"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Contact Form Card */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 lg:p-10 sticky top-28 transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8 transition-colors">
                Butuh bantuan? Kami siap membantu.
              </h3>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nama"
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-doccure-teal transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-doccure-teal transition-colors"
                />
                <select
                  defaultValue=""
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[15px] text-slate-400 focus:outline-none focus:border-doccure-teal transition-colors appearance-none"
                >
                  <option value="" disabled className="dark:bg-slate-800">Kategori Layanan</option>
                  <option className="dark:bg-slate-800">Konsultasi Dokter</option>
                  <option className="dark:bg-slate-800">Pantau Tumbuh Kembang</option>
                  <option className="dark:bg-slate-800">Vision AI</option>
                  <option className="dark:bg-slate-800">Edukasi Kesehatan</option>
                </select>
                <input
                  type="date"
                  placeholder="dd/mm/yyyy"
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[15px] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-doccure-teal transition-colors"
                />
                <input
                  type="time"
                  defaultValue="01:00"
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[15px] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-doccure-teal transition-colors"
                />
                <Button className="w-full bg-doccure-dark hover:bg-doccure-teal text-white rounded-xl h-13 text-[15px] font-bold mt-2 transition-colors shadow-md">
                  Buat Janji
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
