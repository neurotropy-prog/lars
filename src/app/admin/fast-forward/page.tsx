'use client'

/**
 * /admin/fast-forward — Herramienta visual de testing
 *
 * Permite simular el paso del tiempo en un diagnóstico para verificar
 * que las evoluciones del mapa se desbloquean correctamente.
 *
 * Solo funciona en development.
 */

import { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'

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
  { label: 'Día 4 → Arquetipo', days: 4, color: '#c6c8ee' },
  { label: 'Día 8 → Insight D7', days: 4, color: '#c6c8ee' },
  { label: 'Día 11 → Sesión', days: 3, color: '#4ADE80' },
  { label: 'Día 15 → Subdimensiones', days: 4, color: '#c6c8ee' },
  { label: 'Día 22 → Libro', days: 7, color: '#4ADE80' },
  { label: 'Día 31 → Reevaluación', days: 9, color: '#FBBF24' },
  { label: 'Día 91 → Trimestral', days: 60, color: '#FBBF24' },
]

export default function FastForwardPage() {
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EvolutionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([])

  async function fastForward(daysToAdd: number, label: string) {
    if (!hash.trim()) {
      setError('Escribe el hash del diagnóstico primero')
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
    } catch (err) {
      setError('Error de conexión')
    }

    setLoading(false)
  }

  return (
    <>
    <SiteHeader variant="admin" />
    <main
      style={{
        minHeight: '100vh',
        padding: 'calc(var(--header-height, 56px) + 48px) 24px 48px',
        background: '#0B0F0E',
        color: '#E8EAE9',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          Fast-Forward Testing
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: '#8A9E98',
            marginBottom: '32px',
          }}
        >
          Simula el paso del tiempo para verificar las evoluciones del mapa.
          Cada botón avanza N días adicionales (se acumulan).
        </p>

        {/* Hash input */}
        <div style={{ marginBottom: '32px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#8A9E98',
              marginBottom: '8px',
            }}
          >
            Hash del diagnóstico (de la URL /mapa/XXXXXXXXXXXX)
          </label>
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="ej: a1b2c3d4e5f6"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: '#E8EAE9',
              fontSize: '16px',
              fontFamily: 'monospace',
              outline: 'none',
            }}
          />
        </div>

        {/* Botones de preset */}
        <div style={{ marginBottom: '32px' }}>
          <p
            style={{
              fontSize: '13px',
              color: '#8A9E98',
              marginBottom: '12px',
            }}
          >
            Pulsa en orden de arriba a abajo para simular la progresión:
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => fastForward(preset.days, preset.label)}
                disabled={loading || !hash.trim()}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  border: `1px solid ${preset.color}33`,
                  background: `${preset.color}08`,
                  color: preset.color,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: loading || !hash.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !hash.trim() ? 0.4 : 1,
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  transition: 'background 0.2s',
                }}
              >
                <span>{preset.label}</span>
                <span style={{ color: '#8A9E98', fontSize: '12px' }}>
                  +{preset.days} días
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {/* Estado actual */}
        {result && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: '#8A9E98',
                marginBottom: '12px',
              }}
            >
              Estado actual: {result.daysSinceCreation} días desde creación
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {Object.entries(result.evolution).map(([key, unlocked]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: unlocked ? '#4ADE80' : '#506258',
                    }}
                  />
                  <span
                    style={{
                      color: unlocked ? '#E8EAE9' : '#506258',
                    }}
                  >
                    {key}
                  </span>
                </div>
              ))}
            </div>

            {/* Link al mapa */}
            <a
              href={`/mapa/${hash.trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '16px',
                padding: '10px 20px',
                borderRadius: '100px',
                background: '#4ADE80',
                color: '#0B0F0E',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
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
                fontSize: '13px',
                color: '#8A9E98',
                marginBottom: '8px',
              }}
            >
              Historial:
            </p>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#6B7572',
              }}
            >
              {log.map((entry, i) => (
                <p key={i} style={{ margin: '4px 0' }}>
                  {entry}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  )
}
