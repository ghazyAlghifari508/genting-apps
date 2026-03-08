import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, role')
        .eq('id', session.user.id)
        .maybeSingle()

      // If profile doesn't exist yet (trigger delay) or onboarding is incomplete
      // we redirect to onboarding if it's a standard user
      const userRole = profile?.role || session.user.user_metadata?.role || 'user'
      const onboardingCompleted = profile?.onboarding_completed ?? false

      if (userRole === 'admin') {
        return NextResponse.redirect(`${origin}/admin/dashboard`)
      }

      if (userRole === 'doctor') {
        return NextResponse.redirect(`${origin}/doctor`)
      }

      if (userRole === 'user' && !onboardingCompleted) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}
