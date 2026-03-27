/**
 * useCopyAutoSave — Auto-saves copy changes with 1.5s debounce.
 *
 * Calls POST /api/admin/copy on change. If value equals defaultValue,
 * the backend auto-deletes the override (keeps DB clean).
 * Cancels in-flight requests when a new save starts.
 */

import { useEffect, useRef, useState } from 'react'
import type { SaveStatus } from './types'

const DEBOUNCE_MS = 1500

interface UseCopyAutoSaveOptions {
  key: string
  value: string
  defaultValue: string
  enabled?: boolean
}

export function useCopyAutoSave({
  key,
  value,
  defaultValue,
  enabled = true,
}: UseCopyAutoSaveOptions): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastSavedRef = useRef(value)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip the initial render — don't save on mount
    if (isFirstRender.current) {
      isFirstRender.current = false
      lastSavedRef.current = value
      return
    }

    if (!enabled) return

    // Value hasn't changed from last saved state
    if (value === lastSavedRef.current) return

    // Clear pending timer
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      // Abort any in-flight request
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setStatus('saving')

      try {
        const res = await fetch('/api/admin/copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        lastSavedRef.current = value
        setStatus('saved')

        // Reset to idle after 2s
        setTimeout(() => setStatus('idle'), 2000)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setStatus('error')
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [key, value, defaultValue, enabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  return status
}
