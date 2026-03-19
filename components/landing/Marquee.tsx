'use client'

import { motion } from 'framer-motion'

const items = [
  'Deteksi Dini Stunting',
  'Konsultasi Dokter Spesialis',
  'Vision AI - Scan Nutrisi',
  'Roadmap Kehamilan',
  'Edukasi Interaktif',
  'Genting Vision AI',
  'Roadmap 1000 HPK',
  'Rekomendasi Gizi'
]

export default function Marquee() {
  return (
    <section className="py-4 bg-[#0F6856] overflow-hidden">
      <div className="relative flex">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        >
          {[...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-white font-semibold text-sm tracking-wide">
                {item}
              </span>
              <span className="text-[#E8C84A] text-lg">*</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
