'use client'

import { AuthSlider } from '@/components/auth-slider'

export default function RegisterPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-green/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-lavender/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <AuthSlider initialMode="register" />
    </div>
  )
}
