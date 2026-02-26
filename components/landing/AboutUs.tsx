'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckCircle2, Target } from 'lucide-react'

const features = [
  "Konsultasi dokter online",
  "Pantau tumbuh kembang",
  "Edukasi interaktif",
  "Deteksi dini stunting"
]

export default function AboutUs() {

  return (
    <section className="py-24 bg-doccure-dark overflow-hidden relative" id="about">
      {/* Background concentric rings similar to Hero to keep consistency */}
      <div className="absolute top-[-30%] left-[-20%] w-[1000px] h-[1000px] border-[60px] border-doccure-teal/20 rounded-full" />
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] border-[20px] border-doccure-teal/10 rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Images Composition */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[600px] flex items-center justify-center"
          >
            {/* 12+ Years Text - Hidden on small mobile */}
            <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-doccure-teal/30 font-bold text-4xl tracking-[0.2em] whitespace-nowrap lg:-ml-12 pointer-events-none">
              10+ TAHUN PENGALAMAN
            </div>

            <div className="relative w-full max-w-[320px] md:max-w-[450px] aspect-[4/5] md:h-[550px]">
              {/* Giant Yellow Circle Accent */}
              <div className="absolute top-[-20px] left-[-30px] w-full h-[500px] bg-doccure-yellow rounded-l-full rounded-tr-[150px] rounded-br-[150px] z-0" />
              
              {/* Main Image Large Wrapper */}
              <div className="absolute top-0 right-0 w-[400px] h-[450px] rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-[40px] overflow-hidden border-8 border-doccure-dark z-10">
                <Image
                  src="/images/unsplash/img_422bb52c.png"
                  alt="Doctor with child"
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>

              {/* Smaller Overlapping Image - Adjusted for mobile */}
              <div className="absolute bottom-[-10px] md:bottom-[-20px] left-[-20px] md:left-[-40px] w-[150px] md:w-[250px] h-[150px] md:h-[250px] rounded-full overflow-hidden border-4 md:border-8 border-doccure-dark z-20">
                <Image
                  src="/images/unsplash/img_f4ea17f2.png"
                  alt="Pediatrician exam"
                  fill
                  sizes="250px"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col items-start"
          >
            <div className="inline-flex items-center text-xs font-bold bg-doccure-teal text-white rounded-full px-4 py-1.5 mb-6 relative">
              <div className="absolute -left-1 w-2.5 h-2.5 bg-doccure-yellow rounded-full" />
              Tentang Kami
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight text-center lg:text-left w-full">
              Kami Paham Setiap Anak<br className="hidden md:block"/>
              Itu Unik & <span className="text-doccure-yellow border-b-[3px] border-doccure-yellow pb-2 inline-block">Perjalanan Sehatnya.</span>
            </h2>

            <p className="text-white/80 text-[15px] mb-8 leading-relaxed max-w-lg">
              Genting hadir sebagai platform digital yang membantu orang tua memantau, mencegah, dan mengatasi stunting sejak dini dengan layanan yang mudah diakses.
            </p>

            {/* Mission Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 flex gap-5 items-start w-full max-w-xl mb-10 shadow-xl border border-transparent dark:border-slate-700 transition-colors">
              <div className="w-14 h-14 shrink-0 bg-doccure-yellow rounded-xl flex items-center justify-center text-doccure-dark">
                <Target className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Misi Kami</h4>
                <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-snug">
                  Menciptakan generasi Indonesia yang sehat melalui teknologi, edukasi, dan akses ke layanan kesehatan berkualitas.
                </p>
              </div>
            </div>

            {/* Bullet Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 w-full max-w-xl mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white bg-doccure-teal rounded-full" />
                  <span className="text-white/90 text-[15px] font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* New section based on the provided snippet, placed after bullet points */}
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 px-4"> {/* Added px-4 for padding refinement */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white transition-colors leading-tight">
                Ketika Kepedulian Bertemu <span className="text-doccure-teal border-b-2 border-doccure-teal">Layanan Terbaik</span>
              </h2>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
