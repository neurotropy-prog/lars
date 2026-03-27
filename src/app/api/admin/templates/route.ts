/**
 * /api/admin/templates — GET
 *
 * Devuelve todos los templates fusionando defaults + overrides de Supabase.
 * Protegido con Supabase Auth.
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'
import { EMAIL_DEFAULTS, VALID_EMAIL_KEYS } from '@/lib/email-defaults'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const supabase = createAdminClient()

  // Fetch all overrides from DB
  const { data: overrides } = await supabase
    .from('email_templates')
    .select('email_key, subject, body_content, cta_text, updated_at')

  const overrideMap = new Map(
    (overrides ?? []).map((o) => [o.email_key, o])
  )

  const templates = VALID_EMAIL_KEYS.map((key) => {
    const defaults = EMAIL_DEFAULTS[key]
    const override = overrideMap.get(key)
    const isCustomized = !!override && (
      override.subject !== null ||
      override.body_content !== null ||
      override.cta_text !== null
    )

    return {
      email_key: key,
      subject: override?.subject ?? defaults.subject,
      body_content: override?.body_content ?? defaults.bodyContent,
      cta_text: override?.cta_text ?? defaults.ctaText,
      is_customized: isCustomized,
      is_dynamic: defaults.isDynamic ?? false,
      dynamic_note: defaults.dynamicNote ?? null,
      updated_at: override?.updated_at ?? null,
    }
  })

  return NextResponse.json({ templates })
}
