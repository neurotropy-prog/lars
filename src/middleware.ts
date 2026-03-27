import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          response.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  // If accessing /admin/* without session, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow /admin/login to be accessed without session
    if (request.nextUrl.pathname === '/admin/login') {
      return response
    }

    // For all other /admin/* routes, require session
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Verify that user email is in admin_users table
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('email, role')
      .eq('email', session.user.email)
      .single()

    // If user is not authorized, sign out and redirect to login
    if (!adminUser) {
      await supabase.auth.signOut()
      const loginUrl = new URL('/admin/login?error=unauthorized', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
