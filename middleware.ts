import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // This will refresh the session if it's expired
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
       // Only log critical auth errors, ignore "no session" errors usually
    }

    const role = user?.user_metadata?.role || user?.role
    const path = request.nextUrl.pathname

    // PARANOID ROUTE PROTECTION
    // 1. Admin Protection
    if (path.startsWith('/admin')) {
      if (!user) return NextResponse.redirect(new URL('/login', request.url))
      if (role !== 'admin' && role !== 'super-admin') {
        console.warn(`Unauthorized Admin Access Attempt: [${user?.email}] [Role: ${role}] Path: ${path}`)
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // 2. Doctor Protection (Strict check to avoid matching /doctors)
    if (path === '/doctor' || path.startsWith('/doctor/')) {
      if (!user) return NextResponse.redirect(new URL('/login', request.url))
      if (role !== 'doctor' && role !== 'doctor-pending') {
        console.warn(`Unauthorized Doctor Access Attempt: [${user?.email}] [Role: ${role}] Path: ${path}`)
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // 3. User Route Protection (Home Dashboard, Profile, etc.)
    const userOnlyPaths = [
      '/dashboard', 
      '/profile', 
      '/roadmap', 
      '/vision', 
      '/konsultasi-dokter',
      '/doctors',
      '/booking',
      '/riwayat-transaksi'
    ]
    const isUserPath = userOnlyPaths.some(p => path.startsWith(p))

    if (isUserPath) {
      if (!user) return NextResponse.redirect(new URL('/login', request.url))
      
      // Allow 'authenticated' (Supabase default) or 'user' roles for user paths
      const isUserOrAuth = role === 'user' || role === 'authenticated' || !role;
      
      if (!isUserOrAuth) {
        // Redirect Admin and Doctor to their own dashboards if they try to access user pages
        if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
        if (role === 'doctor' || role === 'doctor-pending') return NextResponse.redirect(new URL('/doctor', request.url))
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Middleware Critical Error:', error)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
