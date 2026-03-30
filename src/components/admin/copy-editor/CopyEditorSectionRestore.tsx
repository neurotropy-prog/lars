'use client'

/**
 * CopyEditorSectionRestore — Button to restore all customized copy
 * in a section back to defaults. Shows confirmation dialog.
 */

import { useState, useCallback } from 'react'

interface CopyEditorSectionRestoreProps {
  section: string
  sectionLabel: string
  customizedCount: number
  onRestore: () => void
}

export function CopyEditorSectionRestore({
  section,
  sectionLabel,
  customizedCount,
  onRestore,
}: CopyEditorSectionRestoreProps) {
  const [confirming, setConfirming] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const handleRestore = useCallback(async () => {
    if (!confirming) {
      setConfirming(true)
      return
    }

    setRestoring(true)
    try {
      const res = await fetch('/api/admin/copy', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      onRestore()
    } catch {
      // Error handled silently — user sees data didn't change
    } finally {
      setRestoring(false)
      setConfirming(false)
    }
  }, [confirming, section, onRestore])

  if (customizedCount === 0) return null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    }}>
      {confirming ? (
        <>
          <span style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-secondary)',
          }}>
            ¿Restaurar {customizedCount} texto{customizedCount !== 1 ? 's' : ''} de {sectionLabel}?
          </span>
          <button
            onClick={handleRestore}
            disabled={restoring}
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              fontWeight: 600,
              color: 'var(--color-error)',
              background: 'none',
              border: '1px solid rgba(196, 64, 64, 0.3)',
              borderRadius: 'var(--radius-pill)',
              padding: '2px 12px',
              cursor: restoring ? 'not-allowed' : 'pointer',
              opacity: restoring ? 0.5 : 1,
            }}
          >
            {restoring ? 'Restaurando...' : 'Sí, restaurar'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Cancelar
          </button>
        </>
      ) : (
        <button
          onClick={handleRestore}
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            color: '#CD796C',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Restaurar toda la sección
        </button>
      )}
    </div>
  )
}
