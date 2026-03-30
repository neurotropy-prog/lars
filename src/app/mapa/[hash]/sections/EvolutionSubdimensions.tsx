'use client'

/**
 * EvolutionSubdimensions.tsx — Sección Día 14: Subdimensiones
 *
 * Si no completadas: muestra intro + 2 preguntas inline + botón submit.
 * Si completadas: muestra scores de subdimensiones (renderizados en DimensionCard).
 */

import { useState, useCallback } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { SubdimensionConfig } from '@/lib/content/subdimensions'

interface Props {
  config: SubdimensionConfig
  completed: boolean
  isNew: boolean
  hash: string
  onCompleted?: () => void
}

export default function EvolutionSubdimensions({
  config,
  completed,
  isNew,
  hash,
  onCompleted,
}: Props) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(completed)

  const allAnswered = config.questions.every((q) => responses[q.id])

  const handleSelect = useCallback((questionId: string, optionKey: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: optionKey }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!allAnswered || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/mapa/${hash}/subdimensions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      })
      if (!res.ok) {
        setError('Error al guardar. Inténtalo de nuevo.')
        setSubmitting(false)
        return
      }
      setDone(true)
      onCompleted?.()
      // Reload para mostrar las subdimensiones en el DimensionCard
      window.location.reload()
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
      setSubmitting(false)
    }
  }, [allAnswered, submitting, hash, responses, onCompleted])

  if (done) {
    return (
      <div
        className="mapa-fade-up"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-success)',
          }}
        >
          ✓ Subdimensiones calculadas — mira las barras en tu dimensión más
          comprometida.
        </p>
      </div>
    )
  }

  return (
    <div
      className="mapa-fade-up"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
      }}
    >
      {/* Badge */}
      {isNew && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <Badge status="nuevo">NUEVO</Badge>
        </div>
      )}

      {/* Intro */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}
      >
        {config.intro}
      </p>

      {/* Subdimensiones listadas */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 var(--space-4) 0',
        }}
      >
        {config.subdimensions.map((sub) => (
          <li
            key={sub.key}
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-1)',
            }}
          >
            · {sub.name}
          </li>
        ))}
      </ul>

      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {config.questions.length} preguntas más para calcularlas.
      </p>

      {/* Preguntas */}
      {config.questions.map((q, qi) => (
        <div key={q.id} style={{ marginBottom: 'var(--space-6)' }}>
          <p
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              lineHeight: 'var(--lh-body)',
              marginBottom: 'var(--space-3)',
            }}
          >
            {qi + 1}. {q.text}
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            {q.options.map((opt) => {
              const selected = responses[q.id] === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(q.id, opt.key)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: selected
                      ? '1px solid var(--color-accent)'
                      : 'var(--border-subtle)',
                    background: selected
                      ? 'rgba(205,121,108,0.08)'
                      : 'transparent',
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-body-sm)',
                    lineHeight: 'var(--lh-body)',
                    color: selected
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transition:
                      'border-color var(--transition-base), background var(--transition-base)',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Error */}
      {error && (
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-error)',
            marginBottom: 'var(--space-3)',
          }}
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <Button
        variant="secondary"
        size="small"
        onClick={handleSubmit}
        disabled={!allAnswered || submitting}
        style={{ width: '100%' }}
      >
        {submitting ? 'Calculando...' : 'Profundizar mi evaluación'}
      </Button>
    </div>
  )
}
