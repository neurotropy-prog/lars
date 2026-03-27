/**
 * /api/admin/copy — GET / POST / DELETE
 *
 * GET: Returns all copy entries merging defaults + overrides from Supabase.
 * POST: Saves a single override (or deletes if value === default).
 * DELETE: Restores all overrides for a section.
 *
 * Protected with Supabase Auth (same pattern as /api/admin/templates).
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin-auth'
import {
  COPY_DEFAULTS,
  COPY_DEFAULTS_MAP,
  VALID_COPY_KEYS,
  COPY_SECTIONS,
} from '@/lib/copy-defaults'
import type { CopySectionName } from '@/lib/copy-defaults'

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const supabase = createAdminClient()
  const { data: overrides } = await supabase
    .from('copy_overrides')
    .select('copy_key, value')

  const overrideMap = new Map(
    (overrides ?? []).map((o) => [o.copy_key, o.value as string]),
  )

  const sections: Record<string, unknown[]> = {}
  const stats: Record<string, number> = {}

  for (const sec of COPY_SECTIONS) {
    sections[sec] = []
    stats[sec] = 0
  }

  for (const entry of COPY_DEFAULTS) {
    const override = overrideMap.get(entry.id)
    const isCustomized = override !== undefined

    sections[entry.section].push({
      id: entry.id,
      subsection: entry.subsection,
      label: entry.label,
      defaultValue: entry.defaultValue,
      currentValue: override ?? entry.defaultValue,
      isCustomized,
      fieldType: entry.fieldType,
      hint: entry.hint ?? null,
    })

    if (isCustomized) stats[entry.section]++
  }

  return NextResponse.json({ sections, stats })
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const body = await req.json()
  const { key, value } = body as { key?: string; value?: string }

  if (!key || typeof value !== 'string') {
    return NextResponse.json(
      { error: 'Missing key or value' },
      { status: 400 },
    )
  }

  if (!VALID_COPY_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Invalid copy key' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const defaultEntry = COPY_DEFAULTS_MAP[key]

  // If value matches default, delete the override (auto-restore)
  if (value === defaultEntry.defaultValue) {
    await supabase.from('copy_overrides').delete().eq('copy_key', key)
    return NextResponse.json({ ok: true, isCustomized: false })
  }

  // Upsert the override
  const { error } = await supabase.from('copy_overrides').upsert(
    {
      copy_key: key,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'copy_key' },
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, isCustomized: true })
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const body = await req.json()
  const { section } = body as { section?: string }

  if (!section || !COPY_SECTIONS.includes(section as CopySectionName)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }

  // Get all keys for this section
  const keysToDelete = COPY_DEFAULTS
    .filter((d) => d.section === section)
    .map((d) => d.id)

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('copy_overrides')
    .delete()
    .in('copy_key', keysToDelete)
    .select('copy_key')

  return NextResponse.json({ ok: true, deleted: data?.length ?? 0 })
}
