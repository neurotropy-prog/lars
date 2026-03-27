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
  const { authorized, status, user } = await verifyAdmin(cookieStore)
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
  const changedBy = user?.email ?? 'unknown'

  // Get current value for audit log
  const { data: current } = await supabase
    .from('copy_overrides')
    .select('value')
    .eq('copy_key', key)
    .single()

  const oldValue = (current?.value as string) ?? defaultEntry.defaultValue

  // If value matches default, delete the override (auto-restore)
  if (value === defaultEntry.defaultValue) {
    await supabase.from('copy_overrides').delete().eq('copy_key', key)

    // Log restore only if there was an override
    if (current) {
      await supabase.from('copy_audit_log').insert({
        copy_key: key,
        old_value: oldValue,
        new_value: null,
        action: 'restore',
        changed_by: changedBy,
      })
    }

    return NextResponse.json({ ok: true, isCustomized: false })
  }

  // Skip if value hasn't changed
  if (oldValue === value) {
    return NextResponse.json({ ok: true, isCustomized: true })
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

  // Audit log
  await supabase.from('copy_audit_log').insert({
    copy_key: key,
    old_value: oldValue,
    new_value: value,
    action: 'update',
    changed_by: changedBy,
  })

  return NextResponse.json({ ok: true, isCustomized: true })
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies()
  const { authorized, status, user } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const body = await req.json()
  const { section } = body as { section?: string }

  if (!section || !COPY_SECTIONS.includes(section as CopySectionName)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }

  const keysToDelete = COPY_DEFAULTS
    .filter((d) => d.section === section)
    .map((d) => d.id)

  const supabase = createAdminClient()
  const changedBy = user?.email ?? 'unknown'

  // Read current overrides before deleting (for audit log)
  const { data: currentOverrides } = await supabase
    .from('copy_overrides')
    .select('copy_key, value')
    .in('copy_key', keysToDelete)

  // Delete overrides
  const { data } = await supabase
    .from('copy_overrides')
    .delete()
    .in('copy_key', keysToDelete)
    .select('copy_key')

  // Log each restored key
  if (currentOverrides && currentOverrides.length > 0) {
    const auditRows = currentOverrides.map((o) => ({
      copy_key: o.copy_key,
      old_value: o.value as string,
      new_value: null,
      action: 'restore_section',
      changed_by: changedBy,
    }))
    await supabase.from('copy_audit_log').insert(auditRows)
  }

  return NextResponse.json({ ok: true, deleted: data?.length ?? 0 })
}
