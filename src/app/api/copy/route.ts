/**
 * /api/copy — GET (public)
 *
 * Returns only the overrides as a flat key→value map.
 * Cached for 60s with stale-while-revalidate.
 * The frontend uses defaults from code if no override exists.
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdminClient()
  const { data: overrides } = await supabase
    .from('copy_overrides')
    .select('copy_key, value')

  const result: Record<string, string> = {}
  for (const o of overrides ?? []) {
    result[o.copy_key] = o.value
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
