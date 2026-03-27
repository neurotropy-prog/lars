/**
 * copy-server.ts — Server-side copy helper.
 *
 * For server components and API routes.
 * Direct Supabase query, no fetch to /api/copy.
 */

import { createAdminClient } from '@/lib/supabase'
import { COPY_DEFAULTS_MAP } from '@/lib/copy-defaults'

/**
 * Returns the copy value for a key, checking Supabase for overrides.
 * Falls back to the default from copy-defaults.
 *
 * Usage (server component):
 *   const headline = await getCopyServer('hero.headline')
 */
export async function getCopyServer(key: string): Promise<string> {
  const defaultValue = COPY_DEFAULTS_MAP[key]?.defaultValue ?? key

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('copy_overrides')
      .select('value')
      .eq('copy_key', key)
      .single()

    return data?.value ?? defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Bulk fetch all overrides, returns a map.
 * More efficient than calling getCopyServer for each key.
 */
export async function getAllCopyOverrides(): Promise<Record<string, string>> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('copy_overrides')
      .select('copy_key, value')

    const result: Record<string, string> = {}
    for (const o of data ?? []) {
      result[o.copy_key] = o.value
    }
    return result
  } catch {
    return {}
  }
}
