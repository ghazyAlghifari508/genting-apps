'use client'

import { Fingerprint, Users, Activity, HeartPulse, Stethoscope, Microscope } from 'lucide-react'

const icons = [Fingerprint, Users, Activity, HeartPulse, Stethoscope, Microscope]

export default function IconStrip() {
  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center justify-items-center opacity-40 dark:opacity-60">
          {icons.map((Icon, idx) => (
            <div key={idx} className="w-12 h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              <Icon className="w-8 h-8 text-doccure-teal dark:text-doccure-yellow" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
