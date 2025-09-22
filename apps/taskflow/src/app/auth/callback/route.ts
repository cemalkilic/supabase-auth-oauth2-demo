import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful authentication, redirect to dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=Authentication failed`)
}