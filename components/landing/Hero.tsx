import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Brain, Camera, CheckCircle2, ChevronRight, Heart, Link, MessageCircle, Sparkles, Stethoscope, TrendingUp } from 'lucide-react'
import React from 'react'



const Hero = () => {

    const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
}

const features = [
  {
    icon: Camera,
    title: "GENTING Vision",
    description: "Foto makanan Anda, AI akan analisis kandungan nutrisi untuk cegah stunting",
    color: "bg-lavender/10 text-lavender"
  },
  {
    icon: MessageCircle,
    title: "Gemi-Mom Chat",
    description: "Tanya apa saja tentang kehamilan & nutrisi ke asisten AI yang ramah",
    color: "bg-green/10 text-green"
  },
  {
    icon: Stethoscope,
    title: "Konsultasi Dokter",
    description: "Terhubung langsung dengan dokter spesialis gizi dan kandungan",
    color: "bg-lavender/10 text-lavender"
  }
]

const stats = [
  { value: "21.6%", label: "Prevalensi Stunting di Indonesia (2022)" },
  { value: "1000", label: "Hari Pertama Kehidupan yang Krusial" },
  { value: "24/7", label: "Pendampingan AI Non-stop" }
]

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-lavender" />
                <span className="text-sm font-medium">Platform Anti-Stunting #1 di Indonesia</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Cegah <span className="gradient-text">Stunting</span> Sejak
                <br />
                <span className="text-lavender">1000 Hari</span> Pertama
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg text-foreground/70 mb-8 max-w-xl">
                GENTING mendampingi perjalanan kehamilan dan tumbuh kembang anak dengan 
                teknologi AI, gamifikasi, dan konsultasi dokter untuk memastikan nutrisi 
                optimal dan mencegah stunting.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button size="lg" className="bg-lavender hover:bg-lavender/90 text-white rounded-xl px-8 h-14 text-lg w-full sm:w-auto">
                    Mulai Sekarang
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-lg border-2 w-full sm:w-auto">
                    Pelajari Lebih
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Illustration - Floating Cards */}
            <motion.div 
              className="relative hidden lg:block"
              initial="initial"
              animate="animate"
            >
              <motion.div 
                variants={floatVariants}
                className="absolute top-0 right-0 w-64"
              >
                <Card className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Skor Nutrisi Hari Ini</p>
                      <p className="text-2xl font-bold text-green">92/100</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div 
                variants={floatVariants}
                className="absolute top-32 left-0 w-72"
                style={{ animationDelay: '1s' }}
              >
                <Card className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-lavender/20 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-lavender" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">AI Analysis</p>
                      <p className="text-lg font-semibold flex items-center gap-2">Protein: 45g <CheckCircle2 className="w-4 h-4 text-green" /></p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div 
                variants={floatVariants}
                className="absolute bottom-0 right-10 w-60"
                style={{ animationDelay: '2s' }}
              >
                <Card className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-salmon/20 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-salmon" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Risiko Stunting</p>
                      <p className="text-lg font-bold text-green">Rendah</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Center decorative element */}
              <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-lavender/30 to-green/30 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>
  )
}

export default Hero