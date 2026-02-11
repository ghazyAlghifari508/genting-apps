import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes yang tidak memerlukan authentication
const publicRoutes = ['/', '/login', '/register', '/auth/callback']

// Routes berdasarkan role
const roleRoutes = {
  user: ['/dashboard', '/roadmap', '/vision', '/konsultasi-dokter', '/onboarding', '/booking', '/payment', '/consultations', '/consultation-history', '/doctors'],
  doctor: ['/dashboard/doctor'],
  admin: ['/admin'],
}

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse, supabase } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // Redirect authenticated users from landing page to dashboard
  if (pathname === '/' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Skip public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/auth'))) {
    return supabaseResponse
  }

  // Redirect to login if not authenticated
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Get user profile from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'user'
  const onboardingCompleted = profile?.onboarding_completed || false

  // Prevent users who have completed onboarding from accessing /onboarding
  if (pathname.startsWith('/onboarding') && onboardingCompleted) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Check route access based on role
  const isAdminRoute = pathname.startsWith('/admin')
  const isDoctorRoute = pathname.startsWith('/dashboard/doctor')
  const isUserRoute = roleRoutes.user.some(route => pathname.startsWith(route))

  // Redirect if user doesn't have access
  if (isAdminRoute && role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = role === 'doctor' ? '/dashboard/doctor' : '/dashboard'
    return NextResponse.redirect(url)
  }

  if (isDoctorRoute && role !== 'doctor' && role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Check if doctor is verified
  if (isDoctorRoute && role === 'doctor') {
    const { data: doctorProfile } = await supabase
      .from('doctors')
      .select('is_verified')
      .eq('user_id', user.id)
      .single()

    if (!doctorProfile?.is_verified) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/doctor/pending'
      if (pathname !== '/dashboard/doctor/pending') {
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
