'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Stethoscope, Route, Camera } from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'Konsultasi Dokter',
    desc: 'Terhubung dengan dokter ahli untuk pendampingan aktif.',
    img: '/images/unsplash/img_e9813f12.png',
    icon: Stethoscope
  },
  {
    id: 2,
    title: 'Peta Jalan 1000 HPK',
    desc: 'Langkah harian cerdas sesuai fase kehamilan dan pertumbuhan.',
    img: '/images/unsplash/img_75c5898e.png',
    icon: Route
  },
  {
    id: 3,
    title: 'Analisis Nutrisi (Vision AI)',
    desc: 'Analisis nutrisi molekuler instan dengan teknologi GENTING Vision.',
    img: '/images/unsplash/img_37c60b0d.png',
    icon: Camera
  }
]

export default function Services() {

  return (
    <section className="py-24 bg-white  transition-colors duration-300 overflow-hidden" id="services">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center bg-doccure-teal text-white text-sm font-semibold rounded-full px-4 py-1.5 mb-6 relative">
            <div className="absolute -left-1 w-3 h-3 bg-doccure-yellow rounded-full" />
            <div className="absolute -right-1 w-3 h-3 bg-doccure-yellow rounded-full" />
            Layanan Kami
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-slate-900  leading-tight">
            Layanan Profesional untuk<br/>
            <span className="text-doccure-teal border-b-2 border-doccure-teal">Pencegahan Stunting</span>
          </h2>
        </div>

        {/* Carousel / Cards */}
        <div className="relative">
          {/* Navigation buttons (decorative for now, or could scroll) */}
          <button className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white  border  rounded-full shadow-lg flex items-center justify-center text-slate-400 z-10 hover:text-doccure-dark  transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white  border  rounded-full shadow-lg flex items-center justify-center text-slate-400 z-10 hover:text-doccure-dark  transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative px-4">
            {services.map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-3xl overflow-hidden h-[450px] cursor-pointer"
              >
                {/* Background Image */}
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90  border border-white/50  backdrop-blur-md rounded-2xl p-4 flex gap-4 items-center shadow-lg transform transition-all duration-300">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-doccure-teal flex items-center justify-center text-white">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900  mb-1">{service.title}</h3>
                    <p className="text-slate-500  text-sm leading-tight">{service.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
