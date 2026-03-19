'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(1)

  const faqs = [
    {
      question: 'Usia berapa saja yang bisa dipantau di Genting?',
      answer: 'Genting dirancang khusus untuk mendampingi ibu hamil dan orang tua selama periode krusial 1000 Hari Pertama Kehidupan (HPK) melalui fitur Peta Jalan cerdas.'
    },
    {
      question: 'Apa itu fitur Peta Jalan 1000 HPK?',
      answer: 'Peta Jalan 1000 HPK adalah panduan harian adaptif yang memberikan tugas dan edukasi sesuai fase kehamilan hingga anak usia 2 tahun untuk memastikan tumbuh kembang optimal.'
    },
    {
      question: 'Apakah saya bisa konsultasi secara online?',
      answer: 'Ya! Anda bisa melakukan reservasi dan konsultasi langsung dengan dokter ahli yang terverifikasi melalui fitur Konsultasi Dokter di aplikasi Genting.'
    },
    {
      question: 'Apakah data medis anak saya aman?',
      answer: 'Ya, kami menggunakan enkripsi untuk melindungi seluruh data medis dan privasi pengguna. Keamanan data adalah prioritas utama kami.'
    },
    {
      question: 'Bagaimana cara kerja fitur Vision AI?',
      answer: 'Vision AI memungkinkan Anda scan makanan menggunakan kamera untuk mendapatkan informasi nutrisi secara instan. Cukup arahkan kamera ke makanan, dan AI kami akan menganalisis kandungan gizinya.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left - FAQ Accordion */}
          <div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Pertanyaan yang Sering{' '}
              <span className="italic text-[#0F6856] underline decoration-[#E8C84A] underline-offset-4">
                Ditanyakan
              </span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`border rounded-xl overflow-hidden transition-colors ${
                    openIndex === index ? 'border-[#0F6856]/20 bg-white shadow-sm' : 'border-slate-100 bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className={`font-semibold text-sm pr-4 ${openIndex === index ? 'text-[#0F6856]' : 'text-foreground'}`}>
                      {faq.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      openIndex === index ? 'bg-[#0F6856] text-white' : 'bg-slate-100 text-foreground'
                    }`}>
                      {openIndex === index ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Butuh bantuan? Hubungi kami.
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Isi form di bawah dan tim kami akan segera menghubungi Anda.</p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Nama"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6856]/20 focus:border-[#0F6856] transition-colors bg-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6856]/20 focus:border-[#0F6856] transition-colors bg-white"
                />
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F6856]/20 focus:border-[#0F6856] transition-colors bg-white appearance-none">
                  <option value="">Pilih Kategori</option>
                  <option value="konsultasi">Konsultasi Dokter</option>
                  <option value="roadmap">Peta Jalan 1000 HPK</option>
                  <option value="vision">Vision AI</option>
                  <option value="lainnya">Lainnya</option>
                </select>
                <textarea
                  placeholder="Pesan Anda..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6856]/20 focus:border-[#0F6856] transition-colors bg-white resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#0F6856] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#0D5A4B] transition-colors shadow-lg shadow-[#0F6856]/20"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
