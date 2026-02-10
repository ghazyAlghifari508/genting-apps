'use client'

import { TopNavbar } from '@/components/layout/top-navbar'
import Hero from '@/components/landing/Hero'
import WhatIsStunting from '@/components/landing/WhatIsStunting'
import Featured from '@/components/landing/Featured'
import HowItWork from '@/components/landing/HowItWork'
import Statistik from '@/components/landing/Statistik'
import Testi from '@/components/landing/Testi'
import Milestone from '@/components/landing/Milestone'
import Faq from '@/components/landing/Faq'
import Cta from '@/components/landing/Cta'
import Footer from '@/components/layout/footer'
import DashboardPreview from '@/components/landing/DashboardPrev'

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg overflow-x-hidden">
      <TopNavbar />
      
      <main>
        <Hero />
        <Statistik />
        <WhatIsStunting />
        <Featured />
        <HowItWork />
        <DashboardPreview />
        <Milestone />
        <Testi />
        <Faq />
        <Cta />
      </main>

      <Footer />
    </div>
  )
}
