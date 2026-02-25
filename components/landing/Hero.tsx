'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const reviewImages = [
    { src: '/images/unsplash/img_5b9c332c.png', zIndex: 'z-10' },
    { src: '/images/unsplash/img_9f51ae17.png', zIndex: 'z-20' },
    { src: '/images/unsplash/img_18c7def4.png', zIndex: 'z-30' },
  ]

  return (
    <section className="relative pt-24 md:pt-36 lg:pt-40 pb-20 md:pb-40 overflow-hidden bg-doccure-dark" id="home">
      {/* Background concentric rings - Scattered and Vivid */}
      <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] rounded-full border-[70px] border-[#137A74] opacity-80 pointer-events-none" />
      <div className="absolute top-[10%] left-[80%] w-[500px] h-[500px] rounded-full border-[60px] border-[#DDF247] opacity-50 pointer-events-none" />
      <div className="absolute top-[60%] left-[10%] w-[450px] h-[450px] rounded-full border-[50px] border-[#137A74] opacity-40 pointer-events-none" />
      <div className="absolute top-[-20%] left-[60%] w-[400px] h-[400px] rounded-full border-[40px] border-[#DDF247] opacity-30 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left">
        
        {/* Left Side: Floating Reviews & Content */}
        <div className="flex w-full lg:w-1/2 flex-col lg:flex-row items-center lg:items-start">
          {/* Vertical Reviews Badge */}
          <div className="hidden lg:flex flex-col items-center justify-center mr-10 relative">
            <div className="bg-doccure-teal/50 rounded-full p-2 py-4 flex flex-col items-center gap-4 w-14 backdrop-blur-sm border border-doccure-teal">
              <span className="text-white text-xs font-semibold whitespace-nowrap -rotate-90 translate-y-24 mb-32 tracking-wider">
                Lebih dari 25 ribu ulasan orang tua
              </span>
              <div className="flex flex-col -space-y-3 mt-auto mb-2 relative z-10">
                {reviewImages.map((img, idx) => (
                  <Image key={idx} src={img.src} alt={`Reviewer ${idx + 1}`} width={40} height={40} className={`w-10 h-10 rounded-full border-2 border-doccure-teal/50 object-cover relative ${img.zIndex}`} />
                ))}
                <div className="w-10 h-10 rounded-full bg-doccure-yellow flex items-center justify-center border-2 border-doccure-teal/50 relative z-40 font-bold text-doccure-dark text-xs">
                  +25k
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-bold text-white mb-6 leading-[1.2] lg:leading-[1.15] tracking-tight">
              Perawatan Aman untuk<br className="hidden sm:block"/>
              Kesehatan Anak<br className="hidden sm:block"/>
              dengan <span className="text-doccure-yellow relative inline-block">
                Nutrisi
                {/* Yellow underline svg */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-doccure-yellow" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M2 9.5C50 3 150 2 198 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="text-white/80 text-sm md:text-[15px] mb-8 md:mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Konsultasi terpercaya untuk ibu dan anak mencegah stunting, dengan keahlian dokter spesialis dan kepedulian pada setiap tahap pertumbuhan.
            </p>

            <Link href="#services">
              <Button className="rounded-full bg-white text-doccure-dark hover:bg-white/90 h-12 px-6 text-[15px] font-bold shadow-lg group">
                Lihat Layanan
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Image Composition */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative hidden lg:block w-1/2 h-[600px] mt-10 lg:mt-0"
        >
          {/* Yellow Shape Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[450px] h-[500px] bg-doccure-yellow rounded-b-full rounded-tr-[250px] rounded-tl-full z-0 overflow-hidden" />
          
          {/* Main Character Image */}
          <Image
            src="/images/unsplash/foto1-rbg.png"
            alt="Doctor and Child"
            width={800}
            height={750}
            priority
            className="absolute bottom-[-100px] left-1/2 -translate-x-[45%] h-[750px] w-auto object-cover object-top z-10 drop-shadow-2xl"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)'
            }}
          />

          {/* Floating Pill/Capsule Element */}
          <div className="absolute bottom-10 left-10 w-24 h-8 bg-doccure-teal rounded-full rotate-[-30deg] shadow-lg z-20 flex border-2 border-white/20" />
          <div className="absolute bottom-12 left-8 w-12 h-12 bg-doccure-yellow rounded-full shadow-lg z-10 border-2 border-white/20" />
          
          {/* Floating Circle top right */}
          <div className="absolute top-[20%] right-[10%] w-12 h-12 bg-doccure-yellow rounded-full shadow-lg z-20 border-2 border-white/20" />
        </motion.div>

      </div>
      
      {/* Bottom Pointed Shape (SVG) */}
      <div className="absolute bottom-[-1px] left-0 w-full z-20 leading-none">
        <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-[80px] text-white dark:text-slate-900 transition-colors">
          <path d="M0 100H1440V0L720 100L0 0V100Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  )
}
