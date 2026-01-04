import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const refreshToken = requestUrl.searchParams.get('refresh_token')
  const accessToken = requestUrl.searchParams.get('access_token')

  if (code || refreshToken || accessToken) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
    } else if (refreshToken) {
      await supabase.auth.refreshSession({ refresh_token: refreshToken })
    } else if (accessToken) {
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken || '' })
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
