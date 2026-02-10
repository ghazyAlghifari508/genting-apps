import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const isRegister = searchParams.get('register') === 'true'
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      // Check if this is a new registration
      if (isRegister) {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          // Create new profile - role will be set from localStorage on client side
          // Default to 'user' role, onboarding will handle the rest
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url,
            role: 'user', // Default, will be updated in onboarding
          })
          
          // Redirect to onboarding for new users
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }
      
      // Get user role to determine redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Check if user needs onboarding
      const { data: pregnancyData } = await supabase
        .from('pregnancy_data')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (profile?.role === 'user' && !pregnancyData) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      // Redirect based on role
      if (profile?.role === 'admin') {
        return NextResponse.redirect(`${origin}/admin/dashboard`)
      } else if (profile?.role === 'doctor') {
        return NextResponse.redirect(`${origin}/doctor/dashboard`)
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
