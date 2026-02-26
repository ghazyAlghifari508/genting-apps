import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface DashboardHeroProps {
  firstName: string
}

export function DashboardHero({ firstName }: DashboardHeroProps) {
  return (
    <section className="relative w-full overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center justify-center pt-24 md:pt-28 pb-20 md:pb-32">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/dashboard-hero.png" 
          alt="Dashboard Hero" 
          fill 
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/80" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] md:leading-[1.05] mb-6 md:mb-8 tracking-tight px-4">
              Selamat Datang,<br />
              <span className="text-doccure-yellow italic">{firstName}</span>.
            </h1>
            
            <p className="text-base sm:text-xl text-white/80 font-medium leading-relaxed mb-8 md:mb-10 max-w-2xl px-6">
              Bersama GENTING+, wujudkan perkembangan optimal si kecil melalui pendampingan cerdas, nutrisi molekuler, dan konsultasi ahli.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/roadmap" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-doccure-yellow hover:bg-[#cbe33a] text-doccure-dark rounded-2xl px-10 h-14 font-black text-base shadow-[0_20px_40px_rgba(221,242,71,0.3)] transition-all active:scale-95 group">
                  Mulai Aktivitas
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/education" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-2xl px-10 h-14 font-bold text-base backdrop-blur-md transition-all active:scale-95">
                  Lihat Edukasi
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
