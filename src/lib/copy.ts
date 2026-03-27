/**
 * copy.ts — Helper functions for reading copy with overrides.
 *
 * Three access patterns:
 * 1. getCopyServer(key) — async, for server components (direct Supabase query)
 * 2. useCopy() — React hook for client components (fetches /api/copy)
 * 3. getCopySync(key, overrides?) — pure sync, for data files
 *
 * IMPORTANT: Do NOT modify public components yet.
 * This file provides the helpers for the next session.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { COPY_DEFAULTS_MAP } from '@/lib/copy-defaults'

// ─── Sync getter (for data files, no hooks) ──────────────────────────────────

/**
 * Returns override value if present, otherwise the default from copy-defaults.
 * Use in gateway-bloque*-data.ts or other non-component files.
 */
export function getCopySync(
  key: string,
  overrides?: Record<string, string>,
): string {
  if (overrides && key in overrides) return overrides[key]
  return COPY_DEFAULTS_MAP[key]?.defaultValue ?? key
}

// ─── React hook (for client components) ──────────────────────────────────────

interface UseCopyReturn {
  getCopy: (key: string) => string
  loading: boolean
}

// Module-level cache so multiple components share the same fetch
let cachedOverrides: Record<string, string> | null = null
let fetchPromise: Promise<void> | null = null

function fetchOverrides(): Promise<void> {
  if (fetchPromise) return fetchPromise
  fetchPromise = fetch('/api/copy')
    .then((res) => (res.ok ? res.json() : {}))
    .then((data: Record<string, string>) => {
      cachedOverrides = data
    })
    .catch(() => {
      cachedOverrides = {}
    })
  return fetchPromise
}

/**
 * Hook for client components. Fetches overrides once, then returns sync getter.
 *
 * Usage:
 *   const { getCopy, loading } = useCopy()
 *   return <h1>{getCopy('hero.headline')}</h1>
 */
export function useCopy(): UseCopyReturn {
  const [loading, setLoading] = useState(cachedOverrides === null)

  useEffect(() => {
    if (cachedOverrides !== null) return
    fetchOverrides().then(() => setLoading(false))
  }, [])

  const getCopy = useCallback((key: string): string => {
    if (cachedOverrides && key in cachedOverrides) {
      return cachedOverrides[key]
    }
    return COPY_DEFAULTS_MAP[key]?.defaultValue ?? key
  }, [])

  return { getCopy, loading }
}
