'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function VideoHighlight() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !isPlaying) {
        setIsFloating(false)
        return
      }

      const rect = sectionRef.current.getBoundingClientRect()
      // If the top of the video section is scrolled out of view
      setIsFloating(rect.bottom < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isPlaying])

  return (
    <section className="py-20 bg-white  transition-colors" id="video" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100  group aspect-video">
          <Image
            src="/images/unsplash/img_b359ec41.png"
            alt="Konsultasi dokter anak"
            width={1600}
            height={420}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all hover:scale-110 active:scale-95 z-20"
              aria-label="Putar video"
              type="button"
            >
              <div className="w-20 h-20 rounded-full bg-doccure-yellow text-doccure-dark flex items-center justify-center shadow-2xl pulse-animation">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <span className="text-white font-black uppercase tracking-[0.2em] text-xs drop-shadow-md">Tonton Demo Medis</span>
            </button>
          )}

          <AnimatePresence>
            {isPlaying && (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  position: isFloating ? 'fixed' : 'absolute',
                  bottom: isFloating ? '2rem' : 0,
                  right: isFloating ? '2rem' : 0,
                  width: isFloating ? '320px' : '100%',
                  height: isFloating ? '180px' : '100%',
                  zIndex: isFloating ? 40 : 30, // Stay below navbar (z-50)
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-black overflow-hidden shadow-2xl ${isFloating ? 'rounded-2xl border-4 border-white ' : ''}`}
              >
                <button 
                  onClick={() => {
                    setIsPlaying(false)
                    setIsFloating(false)
                  }}
                  className="absolute top-3 right-3 z-[60] p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-md transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <iframe
                  src="https://www.youtube.com/embed/NU_MDQ2iNYE?autoplay=1"
                  title="Video Informasi & Edukasi Pencegahan Stunting"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
