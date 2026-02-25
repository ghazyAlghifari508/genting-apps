'use client'

import { motion } from 'framer-motion'
import { Camera, Route, BookOpen, Stethoscope } from 'lucide-react'

export default function HowItWork() {
  const reasons = [
    {
      icon: Camera,
      title: 'Vision AI — Deteksi Nutrisi',
      description: 'Scan makanan untuk mengukur kandungan gizi secara instan menggunakan teknologi AI.',
    },
    {
      icon: Route,
      title: 'Roadmap Kehamilan',
      description: 'Panduan perjalanan kehamilan lengkap dengan milestone dan tips kesehatan setiap trimester.',
    },
    {
      icon: BookOpen,
      title: 'Edukasi Interaktif',
      description: 'Konten edukasi terstruktur tentang nutrisi, imunisasi, dan tumbuh kembang anak.',
    },
    {
      icon: Stethoscope,
      title: 'Konsultasi Dokter Online',
      description: 'Reservasi dan konsultasi langsung dengan dokter spesialis anak terverifikasi.',
    }
  ]

  return (
    <section className="py-20 bg-[#0F6856]">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">

          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Kenapa Orang Tua{' '}
            <span className="italic underline decoration-[#E8C84A] underline-offset-4">
              Memilih Genting
            </span>
          </h2>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0F6856]/10 flex items-center justify-center mb-5 group-hover:bg-[#0F6856] transition-colors duration-300">
                <reason.icon size={28} className="text-[#0F6856] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-3">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
