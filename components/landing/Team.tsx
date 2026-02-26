'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Facebook } from 'lucide-react'

const professionals = [
  {
    name: 'Dokter Spesialis Anak',
    role: 'Konsultan Tumbuh Kembang',
    img: '/images/unsplash/doctor-clean-rbg.png',
    bgColor: 'bg-indigo-400',
    imgClass: 'h-[95%] w-auto object-contain object-bottom'
  },
  {
    name: 'Dokter Gizi Anak',
    role: 'Konsultan Nutrisi',
    img: '/images/unsplash/foto2-rbg.png',
    bgColor: 'bg-lime-400',
    imgClass: 'h-[110%] w-auto object-contain'
  },
  {
    name: 'Dokter Imunisasi',
    role: 'Konsultan Imunisasi',
    img: '/images/unsplash/foto3-rbg.png',
    bgColor: 'bg-sky-400',
    imgClass: 'h-[90%] w-auto object-contain object-bottom mb-[-5px]'
  },
  {
    name: 'Dokter Laktasi',
    role: 'Konsultan Laktasi',
    img: '/images/unsplash/foto4-rbg.png',
    bgColor: 'bg-teal-400',
    imgClass: 'h-[110%] w-auto object-contain'
  }
]

const socialIcons = [Facebook, Twitter, Linkedin]

export default function Team() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors overflow-hidden" id="team">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
          <div className="inline-flex items-center text-[10px] md:text-xs font-bold bg-doccure-teal text-white rounded-full px-4 py-1.5 mb-6 relative">
            <div className="absolute -left-1 w-2.5 h-2.5 bg-doccure-yellow rounded-full" />
            Tim Kami
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight transition-colors">
            Kenalan dengan <span className="text-doccure-teal border-b-[3px] border-doccure-teal pb-1">Profesional Kami</span>
          </h2>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {professionals.map((person, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col group cursor-pointer"
            >
              {/* Member Card UI from Dribbble */}
              <div className="relative mb-6">
                {/* Background colored shape with a notch/curve at the top right */}
                <div className={`absolute inset-x-0 bottom-0 h-[85%] rounded-3xl ${person.bgColor} z-0 overflow-hidden`}>
                   {/* Notch/Tab shape at top-right - approximating with a white circle slice */}
                   <div className="absolute top-0 right-0 w-20 h-20 bg-white dark:bg-slate-900 rounded-full -translate-y-1/2 translate-x-1/2 transition-colors" />
                </div>

                {/* Person Image */}
                <div className="relative z-10 aspect-[4/5] overflow-visible flex items-end justify-center">
                  <Image
                    src={person.img}
                    alt={person.name}
                    width={400}
                    height={500}
                    className={`${person.imgClass || 'h-[110%] w-auto object-contain'} transition-transform duration-500 group-hover:scale-105`}
                  />
                  
                  {/* Social Overlay on hover */}
                  <div className="absolute bottom-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {socialIcons.map((Icon, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-doccure-teal transition-colors">{person.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">{person.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
