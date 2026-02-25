'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Cta() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#0F6856]">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#0E7A66]/50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0D5A4B]/50 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-[20%] left-[15%] w-8 h-8 rounded-full border-2 border-[#E8C84A]/40" />
      <div className="absolute bottom-[25%] right-[20%] w-12 h-12 rounded-full border-2 border-[#E8C84A]/30" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">


          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Siap Mencegah Stunting Bersama{' '}
            <span className="text-[#E8C84A] italic">Genting?</span>
          </h2>

          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Bergabung dengan ribuan orang tua lainnya. Pantau tumbuh kembang anak, konsultasi dengan dokter, dan akses edukasi kesehatan dalam satu platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <button className="rounded-full bg-white text-[#0F6856] hover:bg-white/90 h-14 px-8 text-base font-bold shadow-xl transition-all hover:shadow-2xl inline-flex items-center gap-2 group">
                Daftar Gratis Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
