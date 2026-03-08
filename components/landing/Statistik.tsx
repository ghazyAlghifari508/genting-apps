'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

function CountUp({ value }: { value: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const ref = useRef<HTMLSpanElement>(null)
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0
  
  useEffect(() => {
    const controls = animate(count, target, { duration: 2, ease: "easeOut" })
    return controls.stop
  }, [target, count])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

const stats = [
  {
    value: '5000',
    suffix: '+',
    label: 'Keluarga Terlayani',
    highlight: false
  },
  {
    value: '10',
    suffix: '+',
    label: 'Tahun Pengalaman',
    highlight: true
  },
  {
    value: '98',
    suffix: '%',
    label: 'Tingkat Kepuasan',
    highlight: false
  },
  {
    value: '300',
    suffix: '+',
    label: 'Dokter Terverifikasi',
    highlight: false
  }
]

export default function Statistik() {

  return (
    <section className="py-16 bg-white  transition-colors duration-300 overflow-hidden" id="stats">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900  transition-colors duration-300">
            Ketika Kepedulian Bertemu <span className="text-doccure-teal border-b-2 border-doccure-teal">Layanan Terbaik</span>
          </h2>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 lg:p-10 text-center flex flex-col justify-center min-h-[160px] overflow-hidden transition-all duration-300 ${
                stat.highlight 
                  ? 'bg-doccure-dark text-white shadow-xl' 
                  : 'bg-slate-50  text-slate-900  shadow-sm border border-slate-100 '
              }`}
            >
              {/* Decorative concentric circles background for both light and dark, just varying opacity */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none text-current">
                <div className="w-full h-full border-[20px] border-current rounded-full scale-150" />
                <div className="absolute w-3/4 h-3/4 border-[20px] border-current rounded-full scale-150" />
              </div>

              {/* Top-left yellow square for highlighted card */}
              {stat.highlight && (
                <div className="absolute top-0 left-0 w-3 h-3 bg-doccure-yellow rounded-br-md" />
              )}

              <div className="relative z-10 text-4xl lg:text-[2.75rem] font-bold mb-3">
                <CountUp value={stat.value} />
                <span>{stat.suffix}</span>
              </div>
              <div className={`relative z-10 text-sm font-medium transition-colors duration-300 ${stat.highlight ? 'text-white/80' : 'text-slate-500 '}`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
