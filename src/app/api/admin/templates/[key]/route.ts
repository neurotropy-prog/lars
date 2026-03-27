/**
 * /api/admin/templates/[key] — PUT, DELETE
 *
 * PUT: Upsert un override de template.
 * DELETE: Elimina el override (revierte al default).
 * Protegido con Supabase Auth.
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'
import { VALID_EMAIL_KEYS } from '@/lib/email-defaults'
import { verifyAdmin } from '@/lib/admin-auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  if (!VALID_EMAIL_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Email key no válido' }, { status: 400 })
  }

  let body: { subject?: string | null; body_content?: string | null; cta_text?: string | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('email_templates')
    .upsert({
      email_key: key,
      subject: body.subject ?? null,
      body_content: body.body_content ?? null,
      cta_text: body.cta_text ?? null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'email_key',
    })

  if (error) {
    console.error('[admin/templates] Upsert error:', error)
    return NextResponse.json({ error: 'Error guardando template' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  if (!VALID_EMAIL_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Email key no válido' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('email_templates')
    .delete()
    .eq('email_key', key)

  if (error) {
    console.error('[admin/templates] Delete error:', error)
    return NextResponse.json({ error: 'Error eliminando template' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
