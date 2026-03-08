'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Wijaya',
    location: 'Jakarta',
    content: 'Aplikasi Genting sangat membantu saya memantau gizi anak. Fitur konsultasi dokternya cepat dan dokternya ramah banget! Sekarang saya lebih tenang soal tumbuh kembang si kecil.',
    rating: 5,
    initials: 'SW'
  },
  {
    name: 'Rina Kartika',
    location: 'Bandung',
    content: 'Sangat praktis! Saya bisa cek pertumbuhan anak, scan makanan dengan Vision AI, dan konsultasi gizi langsung dari HP. Sangat recommended untuk para orang tua.',
    rating: 5,
    initials: 'RK'
  },
  {
    name: 'Dewi Sartika',
    location: 'Surabaya',
    content: 'Fitur roadmap kehamilan sangat membantu saya melewati trimester demi trimester. Edukasi tentang stunting juga sangat informatif dan mudah dipahami.',
    rating: 4,
    initials: 'DS'
  }
]

export default function Testi() {

  return (
    <section className="py-16 md:py-20 bg-white  transition-colors">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground  transition-colors leading-tight">
            Apa Kata Orang Tua{' '}
            <span className="italic text-[#0F6856]  underline decoration-[#E8C84A] underline-offset-4 transition-colors">
              Tentang Genting
            </span>
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white  rounded-2xl p-8 shadow-sm border border-slate-100  relative hover:shadow-lg transition-all"
            >
              {/* Quote mark */}
              <div className="text-4xl text-[#E8C84A] font-bold leading-none mb-4">&ldquo;&rdquo;</div>

              {/* Content */}
              <p className="text-foreground/80  text-sm leading-relaxed mb-6 transition-colors">
                {testi.content}
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < testi.rating ? 'text-[#E8C84A] fill-[#E8C84A]' : 'text-slate-200 '}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100  pt-5 flex items-center gap-4 transition-colors">
                <div className="w-11 h-11 rounded-full bg-[#0F6856] flex items-center justify-center text-white font-bold text-sm">
                  {testi.initials}
                </div>
                <div>
                  <h4 className="font-bold text-foreground  text-sm transition-colors">{testi.name}</h4>
                  <p className="text-xs text-[#0F6856]  font-medium transition-colors">{testi.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
