'use client'

/**
 * /admin/tools — Fast-Forward Testing + Config (renombrado de fast-forward)
 */

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface EvolutionResult {
  previousCreatedAt: string
  newCreatedAt: string
  daysSinceCreation: number
  evolution: {
    archetype: boolean
    insightD7: boolean
    session: boolean
    subdimensions: boolean
    bookExcerpt: boolean
    reevaluation: boolean
    nextQuarterly: boolean
  }
}

const PRESETS = [
  { label: 'Día 4 → Arquetipo', days: 4, color: 'var(--color-accent)' },
  { label: 'Día 8 → Insight D7', days: 4, color: 'var(--color-accent)' },
  { label: 'Día 11 → Sesión', days: 3, color: 'var(--color-success)' },
  { label: 'Día 15 → Subdimensiones', days: 4, color: 'var(--color-accent)' },
  { label: 'Día 22 → Libro', days: 7, color: 'var(--color-success)' },
  { label: 'Día 31 → Reevaluación', days: 9, color: 'var(--color-warning)' },
  { label: 'Día 91 → Trimestral', days: 60, color: 'var(--color-warning)' },
]

const COLOR_HEX: Record<string, string> = {
  'var(--color-accent)': '#B45A32',
  'var(--color-success)': '#3D9A5F',
  'var(--color-warning)': '#D4A017',
}

export default function ToolsPage() {
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EvolutionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function fastForward(daysToAdd: number, label: string) {
    if (!hash.trim()) {
      setError('Escribe el hash de la evaluación primero')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/fast-forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: hash.trim(), daysToAdd }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Error desconocido')
        setLoading(false)
        return
      }

      setResult(data)
      setLog((prev) => [
        `✓ ${label} — ahora ${data.daysSinceCreation} días desde creación`,
        ...prev,
      ])
    } catch {
      setError('Error de conexión')
    }

    setLoading(false)
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '600px', opacity: mounted ? 1 : 0, transition: 'opacity 200ms ease-out' }}>
        <h1
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Fast-Forward Testing
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            lineHeight: 'var(--lh-body-sm)',
            marginBottom: 'var(--space-8)',
          }}
        >
          Simula el paso del tiempo para verificar las evoluciones del mapa.
          Cada botón avanza N días adicionales (se acumulan).
        </p>

        {/* Hash input */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.02em',
              marginBottom: 'var(--space-2)',
            }}
          >
            Hash de la evaluación (de la URL /mapa/XXXXXXXXXXXX)
          </label>
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="ej: a1b2c3d4e5f6"
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: 'var(--border-interactive)',
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              fontFamily: 'monospace',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Preset buttons */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <p
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.02em',
              marginBottom: 'var(--space-3)',
            }}
          >
            Pulsa en orden de arriba a abajo para simular la progresión:
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            {PRESETS.map((preset) => {
              const hex = COLOR_HEX[preset.color] ?? '#B45A32'
              return (
                <button
                  key={preset.label}
                  onClick={() => fastForward(preset.days, preset.label)}
                  disabled={loading || !hash.trim()}
                  style={{
                    width: '100%',
                    padding: 'var(--space-4) var(--space-5)',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${hex}33`,
                    backgroundColor: `${hex}0A`,
                    color: preset.color,
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 500,
                    cursor: loading || !hash.trim() ? 'not-allowed' : 'pointer',
                    opacity: loading || !hash.trim() ? 0.4 : 1,
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  <span>{preset.label}</span>
                  <span style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: 'var(--text-caption)',
                  }}>
                    +{preset.days} días
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(196,64,64,0.08)',
              border: '1px solid rgba(196,64,64,0.2)',
              color: 'var(--color-error)',
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {error}
          </div>
        )}

        {/* Current state */}
        {result && (
          <div
            style={{
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-bg-secondary)',
              border: 'var(--border-subtle)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-tertiary)',
                letterSpacing: '0.02em',
                marginBottom: 'var(--space-3)',
              }}
            >
              Estado actual: {result.daysSinceCreation} días desde creación
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-2)',
              }}
            >
              {Object.entries(result.evolution).map(([key, unlocked]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-caption)',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: unlocked ? 'var(--color-success)' : 'rgba(30,19,16,0.15)',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: unlocked ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    }}
                  >
                    {key}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={`/mapa/${hash.trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 'var(--space-4)',
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-success)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all var(--transition-base)',
              }}
            >
              Ver mapa →
            </a>
          </div>
        )}

        {/* Log */}
        {log.length > 0 && (
          <div>
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-tertiary)',
                letterSpacing: '0.02em',
                marginBottom: 'var(--space-2)',
              }}
            >
              Historial:
            </p>
            <div
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {log.map((entry, i) => (
                <p key={i} style={{ margin: 'var(--space-1) 0' }}>
                  {entry}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
