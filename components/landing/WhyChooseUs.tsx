'use client'

import { motion } from 'framer-motion'
import { Stethoscope, ShieldCheck, CalendarCheck, HeartHandshake } from 'lucide-react'

const reasons = [
  {
    icon: Stethoscope,
    title: 'Konsultasi Dokter Terverifikasi',
    desc: 'Reservasi dan konsultasi langsung dengan dokter spesialis anak.'
  },
  {
    icon: ShieldCheck,
    title: 'Pencegahan & Holistik',
    desc: 'Fokus pada pencegahan stunting melalui edukasi dan pemantauan.'
  },
  {
    icon: CalendarCheck,
    title: 'Akses Mudah & Fleksibel',
    desc: 'Atur jadwal konsultasi dan pemantauan kapan saja.'
  },
  {
    icon: HeartHandshake,
    title: 'Perawatan Anak Menyeluruh',
    desc: 'Dari nutrisi, imunisasi, hingga tumbuh kembang terpantau.'
  }
]

export default function WhyChooseUs() {

  return (
    <section className="py-24 relative overflow-hidden bg-doccure-light-yellow  transition-colors" id="why">
      {/* Decorative horizontal wavy background lines approximation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none " 
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(221, 242, 71, 0.4) 19px, rgba(221, 242, 71, 0.4) 20px)'
           }}>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center text-xs font-bold bg-doccure-teal text-white rounded-full px-4 py-1.5 mb-6 relative">
            <div className="absolute -left-1 w-2.5 h-2.5 bg-doccure-yellow rounded-full" />
            Kenapa Genting
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900  leading-tight transition-colors">
            Kenapa Orang Tua <span className="text-doccure-teal border-b-[3px] border-doccure-teal pb-1">Memilih Genting</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#FEFCE8]  rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-yellow-100/50  flex flex-col h-full relative overflow-hidden group"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-doccure-yellow transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              
              <div className="w-14 h-14 bg-doccure-dark rounded-xl flex items-center justify-center text-doccure-yellow mb-8 shadow-md">
                <reason.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900  mb-4 leading-snug transition-colors">
                {reason.title}
              </h3>
              <p className="text-slate-600  text-sm leading-relaxed mt-auto transition-colors">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  )
}
