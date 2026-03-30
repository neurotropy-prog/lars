'use client'

/**
 * Shared states for the copy editor: Loading skeleton, Error, Empty.
 */

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function CopyEditorSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid rgba(30, 19, 16, 0.06)',
        }}>
          {/* Accordion header skeleton */}
          <div
            className="skeleton-pulse"
            style={{
              height: 52,
              background: 'rgba(30, 19, 16, 0.03)',
            }}
          />
          {/* Field skeletons (first one open) */}
          {i === 0 && (
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="skeleton-pulse"
                  style={{
                    height: 80,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(30, 19, 16, 0.03)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Error ───────────────────────────────────────────────────────────────────

interface CopyEditorErrorProps {
  message: string
  onRetry: () => void
}

export function CopyEditorError({ message, onRetry }: CopyEditorErrorProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-10)',
    }}>
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-body)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-4)',
      }}>
        Error al cargar el copy: {message}
      </p>
      <button
        onClick={onRetry}
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: '#B45A32',
          background: 'none',
          border: '1px solid rgba(180, 90, 50, 0.3)',
          borderRadius: 'var(--radius-pill)',
          padding: 'var(--space-2) var(--space-4)',
          cursor: 'pointer',
        }}
      >
        Reintentar
      </button>
    </div>
  )
}

// ─── Empty ───────────────────────────────────────────────────────────────────

export function CopyEditorEmpty() {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-10)',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(61, 154, 95, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto var(--space-4)',
        fontSize: 24,
      }}>
        ✓
      </div>
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-body)',
        color: 'var(--color-text-secondary)',
        margin: 0,
      }}>
        Todo el copy está usando los textos originales.
      </p>
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-body-sm)',
        color: 'var(--color-text-tertiary)',
        marginTop: 'var(--space-2)',
      }}>
        Haz clic en cualquier campo para personalizarlo.
      </p>
    </div>
  )
}
