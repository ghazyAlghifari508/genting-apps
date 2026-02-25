'use server'

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-server'
import { TopNavbar } from '@/components/layout/top-navbar'
import Hero from '@/components/landing/Hero'
import Services from '@/components/landing/Services'
import Statistik from '@/components/landing/Statistik'
import AboutUs from '@/components/landing/AboutUs'
import WhyChooseUs from '@/components/landing/WhyChooseUs'
import Team from '@/components/landing/Team'
import Marquee from '@/components/landing/Marquee'
import FaqContact from '@/components/landing/FaqContact'
import VideoHighlight from '@/components/landing/VideoHighlight'
import Testi from '@/components/landing/Testi'
import BlogSection from '@/components/landing/BlogSection'
import IconStrip from '@/components/landing/IconStrip'
import Footer from '@/components/layout/footer'

export default async function LandingPage() {
  const user = await getCurrentUser()
  if (user) {
    if (user.role === 'doctor') redirect('/doctor')
    if (user.role === 'admin') redirect('/admin/dashboard')
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-doccure-dark">
      <TopNavbar />
      <main>
        <Hero />
        <Services />
        <Statistik />
        <AboutUs />
        <WhyChooseUs />
        <Team />
        <Marquee />
        <FaqContact />
        <VideoHighlight />
        <Testi />
        <BlogSection />
        <IconStrip />
      </main>
      <Footer />
    </div>
  )
}
