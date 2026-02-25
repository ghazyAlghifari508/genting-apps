'use client'

import { motion } from 'framer-motion'
import { Heart, MessageCircle, Baby, Laptop } from 'lucide-react'

export default function WhatIsStunting() {
  return (
    <section className="py-20 bg-[#F0F5E9]" id="about">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left - Image Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-[#0F6856]/15 to-[#E8C84A]/10 overflow-hidden relative">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[#0F6856]/20 font-bold text-xl">Ibu & Anak</span>
                </div>
              </div>
              
              {/* Yellow circle decoration */}
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full border-[3px] border-[#E8C84A]" />
              
              {/* Experience badge */}
              <div className="absolute -right-4 top-1/3 bg-white rounded-2xl shadow-xl p-4 z-10">
                <div className="text-3xl font-bold text-[#0F6856]">1000+</div>
                <div className="text-xs text-muted-foreground font-medium">Hari Pertama<br/>Kehidupan</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >

            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Kami Memahami Setiap Anak itu Unik &{' '}
              <span className="italic text-[#0F6856] underline decoration-[#E8C84A] underline-offset-4">
                Perjalanan Kesehatannya.
              </span>
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis. Genting hadir sebagai platform digital yang membantu orang tua memantau, mencegah, dan mengatasi stunting sejak dini.
            </p>

            {/* Mission card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F6856] flex items-center justify-center flex-shrink-0">
                  <Heart size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Misi Kami</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Membantu menciptakan generasi Indonesia yang sehat dan bebas stunting melalui teknologi, edukasi, dan akses ke layanan kesehatan berkualitas.
                  </p>
                </div>
              </div>
            </div>

            {/* Bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                { icon: MessageCircle, text: 'Konsultasi dokter online' },
                { icon: Baby, text: 'Pantau tumbuh kembang' },
                { icon: Laptop, text: 'Edukasi interaktif' },
                { icon: Heart, text: 'Deteksi dini stunting' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <div className="w-2 h-2 rounded-full bg-[#0F6856]" />
                  {item.text}
                </div>
              ))}
            </div>

            <button className="inline-flex items-center gap-2 text-sm font-bold text-[#0F6856] hover:underline group">
              Selengkapnya Tentang Genting
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
