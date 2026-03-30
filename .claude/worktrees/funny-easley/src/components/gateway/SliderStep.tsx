'use client'

/**
 * SliderStep — P7: 5 sliders de autoevaluación 1-10.
 *
 * Reglas UX del feature doc:
 * - Sin valor por defecto — la persona debe mover cada uno.
 * - Feedback de color en tiempo real sobre el track:
 *     ≤ 3 → error (rojo), 4-6 → warning (amarillo), ≥ 7 → success (verde).
 * - Valor numérico visible a la derecha, actualizado al instante.
 * - Área táctil mínimo 44px por slider (mobile-first).
 * - Validación: 1er intento sin completar todos → mensaje + highlight.
 *   2º intento → puede avanzar igualmente.
 */

import { useState, useCallback } from 'react'
import type { SliderDimension } from '@/lib/gateway-bloque2-data'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export type SliderValues = Record<string, number | null>

interface SliderStepProps {
  question: string
  sliders: SliderDimension[]
  onContinue: (values: SliderValues) => void
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getSliderColor(value: number | null): string {
  if (value === null) return 'var(--color-text-tertiary)'
  if (value <= 3) return 'var(--color-error)'
  if (value <= 6) return 'var(--color-warning)'
  return 'var(--color-success)'
}

function getTrackGradient(value: number | null): string {
  if (value === null) return 'var(--color-bg-elevated)'
  const pct = ((value - 1) / 9) * 100
  const color = getSliderColor(value)
  return `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--color-bg-elevated) ${pct}%, var(--color-bg-elevated) 100%)`
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function SliderStep({ question, sliders, onContinue }: SliderStepProps) {
  const initialValues: SliderValues = Object.fromEntries(
    sliders.map((s) => [s.id, null])
  )

  const [values, setValues] = useState<SliderValues>(initialValues)
  const [attempts, setAttempts] = useState(0)
  const [highlighted, setHighlighted] = useState<string[]>([])

  const handleChange = useCallback((id: string, raw: string) => {
    const num = parseInt(raw, 10)
    setValues((prev) => ({ ...prev, [id]: num }))
    // Limpia el highlight del slider que acaban de mover
    setHighlighted((prev) => prev.filter((h) => h !== id))
  }, [])

  function handleContinue() {
    const missing = sliders
      .filter((s) => values[s.id] === null)
      .map((s) => s.id)

    if (missing.length > 0 && attempts === 0) {
      setHighlighted(missing)
      setAttempts(1)
      return
    }

    // Segundo intento o todos completos → avanzar
    onContinue(values)
  }

  const allMoved = sliders.every((s) => values[s.id] !== null)
  const showWarning = highlighted.length > 0

  return (
    <div className="step-enter" style={{ width: '100%' }}>
      {/* Pregunta */}
      <p
        style={{
          fontFamily: 'var(--font-inter-tight)',
          fontSize: 'var(--text-h3)',
          lineHeight: 'var(--lh-h3)',
          letterSpacing: 'var(--ls-h3)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {question}
      </p>

      {/* Sliders */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {sliders.map((slider) => {
          const val = values[slider.id]
          const isHighlighted = highlighted.includes(slider.id)
          const color = getSliderColor(val)

          return (
            <div
              key={slider.id}
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: isHighlighted
                  ? '1px solid var(--color-error)'
                  : 'var(--border-subtle)',
                background: 'var(--color-bg-elevated)',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              {/* Label + valor */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 'var(--space-3)',
                  gap: 'var(--space-4)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    lineHeight: 'var(--lh-body-sm)',
                    color: 'var(--color-text-secondary)',
                    flex: 1,
                  }}
                >
                  {slider.label}
                </p>

                {/* Valor numérico — siempre reserva espacio */}
                <div
                  style={{
                    fontFamily: 'var(--font-inter-tight)',
                    fontSize: 'var(--text-h3)',
                    lineHeight: 1,
                    fontWeight: 600,
                    color: val !== null ? color : 'var(--color-text-tertiary)',
                    minWidth: '24px',
                    textAlign: 'right',
                    transition: 'color var(--transition-fast)',
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {val !== null ? val : '–'}
                </div>
              </div>

              {/* Wrapper del slider — área táctil 44px */}
              <div
                style={{
                  position: 'relative',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={val ?? 5}
                  aria-label={slider.label}
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={val ?? undefined}
                  onChange={(e) => handleChange(slider.id, e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',       // área táctil completa
                    cursor: 'pointer',
                    // Estilos del track via CSS custom property
                    '--slider-gradient': getTrackGradient(val),
                    '--slider-thumb-color': val !== null ? color : 'var(--color-text-tertiary)',
                  } as React.CSSProperties}
                  className="lars-slider"
                />
              </div>

              {/* Escala 1-10 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'var(--space-1)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '11px',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  1 — Muy mal
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '11px',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  10 — Muy bien
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mensaje de validación */}
      {showWarning && (
        <p
          role="alert"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-error)',
            marginBottom: 'var(--space-4)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
          }}
        >
          Mueve todos los indicadores para un diagnóstico preciso.
        </p>
      )}

      {/* CTA */}
      <button
        onClick={handleContinue}
        style={{
          width: '100%',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: allMoved ? '1px solid var(--color-accent)' : 'var(--border-subtle)',
          background: allMoved ? 'var(--color-accent-subtle)' : 'transparent',
          color: allMoved ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          cursor: 'pointer',
          transition:
            'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
          minHeight: '44px',
        }}
      >
        Continuar →
      </button>
    </div>
  )
}
