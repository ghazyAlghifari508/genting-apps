'use client'

import { motion } from 'framer-motion'
import { Stethoscope, BookOpen, Route } from 'lucide-react'

export default function Featured() {
  const services = [
    {
      icon: Stethoscope,
      title: 'Konsultasi Dokter',
      description: 'Terhubung langsung dengan dokter ahli untuk pendampingan kesehatan Bunda & si Kecil.',
      gradient: 'from-[#0F6856]/80 to-[#0F6856]/40'
    },
    {
      icon: Route,
      title: 'Peta Jalan 1000 HPK',
      description: 'Panduan harian adaptif selama 1000 hari pertama kehidupan untuk cegah stunting.',
      gradient: 'from-[#0F6856]/80 to-[#0F6856]/40'
    },
    {
      icon: BookOpen,
      title: 'Edukasi Stunting',
      description: 'Materi terstruktur dan teruji untuk pengetahuan nutrisi ibu hamil dan keluarga.',
      gradient: 'from-[#0F6856]/80 to-[#0F6856]/40'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">

          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Layanan Profesional untuk{' '}
            <span className="italic text-[#0F6856] underline decoration-[#E8C84A] underline-offset-4">
              Pencegahan Stunting
            </span>
          </h2>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative rounded-2xl overflow-hidden h-[320px] cursor-pointer"
            >
              {/* Background color */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F6856]/10 to-[#0FA88F]/10" />
              
              {/* Icon centered */}
              <div className="absolute inset-0 flex items-center justify-center opacity-15">
                <service.icon size={140} strokeWidth={1} className="text-[#0F6856]" />
              </div>
              
              {/* Gradient overlay at bottom */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${service.gradient} p-6 pt-16`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <service.icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{service.title}</h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
