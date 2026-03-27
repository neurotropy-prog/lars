/**
 * admin-auth.ts — Helper para verificar autenticación admin en API routes
 *
 * Uso en API routes:
 * const { authorized, status, user } = await verifyAdmin(cookies())
 * if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status })
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function verifyAdmin(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    )

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return {
        authorized: false,
        error: 'No session',
        status: 401,
        user: null,
      }
    }

    // Verify user is in admin_users table
    const { data: adminUser, error: queryError } = await supabase
      .from('admin_users')
      .select('email, role')
      .eq('email', session.user.email)
      .single()

    if (queryError || !adminUser) {
      return {
        authorized: false,
        error: 'Not admin',
        status: 403,
        user: null,
      }
    }

    // Update last_login_at
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('email', session.user.email)
      .throwOnError()

    return {
      authorized: true,
      error: null,
      status: 200,
      user: {
        email: session.user.email,
        role: adminUser.role,
        session,
      },
    }
  } catch (error) {
    return {
      authorized: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      user: null,
    }
  }
}
