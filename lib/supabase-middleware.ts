import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const startTime = Date.now()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  const duration = Date.now() - startTime
  
  if (duration > 1000) {
    console.warn(`[SupabaseMiddleware] auth.getUser took ${duration}ms - potentially problematic`)
  }

  let role = user?.user_metadata?.role || "user"
  
  // Only fetch authoritative role if it's missing or if we're on a path that strictly needs it
  // For most requests, relying on the JWT metadata is enough and much faster
  const needsAuthoritativeRole = user && !user.user_metadata?.role && (
    request.nextUrl.pathname.startsWith('/admin') || 
    request.nextUrl.pathname.startsWith('/doctor')
  )

  if (needsAuthoritativeRole) {
    const dbStartTime = Date.now()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role) {
      role = profile.role
    }
    const dbDuration = Date.now() - dbStartTime
    console.log(`[SupabaseMiddleware] Authoritative role fetch took ${dbDuration}ms`)
  }

  if (user) {
    // console.log(`[SupabaseMiddleware] User: ${user.email} | Role: ${role}`)
  } else if (error && !request.nextUrl.pathname.startsWith('/login')) {
    // console.error(`[SupabaseMiddleware] Session error: ${error.message}`)
  }

  return { supabaseResponse, user, role }
}
