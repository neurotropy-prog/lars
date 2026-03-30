'use client'

/**
 * SlidersStep — P7: 5 sliders horizontales, uno por dimensión.
 *
 * A-07: Color dinámico en tiempo real al mover:
 *   ≤3  → --color-error   (rojo)
 *   4-6 → --color-warning (amarillo)
 *   ≥7  → --color-success (verde)
 *
 * Sin valor por defecto — el thumb aparece centrado en gris desactivado
 * hasta que el usuario lo mueve por primera vez.
 * Touch target mínimo 44px. Valor numérico visible junto al slider.
 *
 * Validación: si intenta continuar sin mover todos, resalta los pendientes.
 * Al segundo intento consecutivo, puede avanzar igualmente.
 */

import { useState, useCallback, useId } from 'react'
import type { SliderDimension } from '@/lib/gateway-bloque2-data'

interface SlidersStepProps {
  question: string
  sliders: SliderDimension[]
  onContinue: (values: Record<string, number>) => void
}

/** Color del fill según valor 1-10 */
function getSliderColor(value: number): string {
  if (value <= 3) return 'var(--color-error)'
  if (value <= 6) return 'var(--color-warning)'
  return 'var(--color-success)'
}

/** Porcentaje del fill para el track gradient (valor 1-10) */
function fillPercent(value: number): number {
  return ((value - 1) / 9) * 100
}

export default function SlidersStep({ question, sliders, onContinue }: SlidersStepProps) {
  /* null = no tocado todavía */
  const [values, setValues] = useState<Record<string, number | undefined>>(
    () => Object.fromEntries(sliders.map((s) => [s.id, undefined]))
  )
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [forceAttempts, setForceAttempts] = useState(0)
  const baseId = useId()

  const handleChange = useCallback((id: string, raw: string) => {
    const num = parseInt(raw, 10)
    setValues((prev) => ({ ...prev, [id]: num }))
    setErrors((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const handleContinue = useCallback(() => {
    const missing = sliders
      .filter((s) => values[s.id] === undefined)
      .map((s) => s.id)

    if (missing.length > 0) {
      if (forceAttempts < 1) {
        // Primer intento: resaltar pendientes
        setErrors(new Set(missing))
        setForceAttempts((n) => n + 1)
        return
      }
      // Segundo intento: puede avanzar con valor por defecto 5 para los no movidos
    }

    const finalValues: Record<string, number> = Object.fromEntries(
      sliders.map((s) => [s.id, values[s.id] ?? 5])
    )
    onContinue(finalValues)
  }, [sliders, values, forceAttempts, onContinue])

  const allMoved = sliders.every((s) => values[s.id] !== undefined)

  return (
    <div className="step-enter">
      {/* Pregunta */}
      <p
        style={{
          fontFamily: 'var(--font-inter-tight)',
          fontSize: 'var(--text-h4)',
          lineHeight: 'var(--lh-h4)',
          letterSpacing: 'var(--ls-h4)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)',
        }}
      >
        {question}
      </p>

      {/* Contexto */}
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--lh-body-sm)',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          marginBottom: 'var(--space-8)',
        }}
      >
        Mueve cada indicador — el diagnóstico cruza estos valores con tus respuestas anteriores.
      </p>

      {/* Sliders */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {sliders.map((slider) => {
          const val = values[slider.id]
          const hasError = errors.has(slider.id)
          const isTouched = val !== undefined
          const color = isTouched ? getSliderColor(val!) : 'rgba(255,255,255,0.15)'
          const percent = isTouched ? fillPercent(val!) : 50

          return (
            <div key={slider.id}>
              {/* Label + valor */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <label
                  htmlFor={`${baseId}-${slider.id}`}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    lineHeight: 'var(--lh-body-sm)',
                    color: hasError
                      ? 'var(--color-warning)'
                      : 'var(--color-text-primary)',
                    flex: 1,
                    paddingRight: 'var(--space-4)',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {slider.label}
                  {hasError && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--color-warning)',
                        marginTop: '2px',
                        fontStyle: 'italic',
                      }}
                    >
                      Mueve este indicador
                    </span>
                  )}
                </label>

                {/* Valor numérico */}
                <span
                  aria-live="polite"
                  style={{
                    fontFamily: 'var(--font-inter-tight)',
                    fontSize: 'var(--text-h4)',
                    fontWeight: 600,
                    color: isTouched ? color : 'var(--color-text-tertiary)',
                    minWidth: '28px',
                    textAlign: 'right',
                    transition: 'color 200ms ease',
                  }}
                >
                  {isTouched ? val : '–'}
                </span>
              </div>

              {/* Slider track + input */}
              <div
                style={{
                  position: 'relative',
                  height: '44px', /* touch target */
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Track visual */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '8px',
                    borderRadius: '4px',
                    background: `linear-gradient(to right,
                      ${color} 0%,
                      ${color} ${percent}%,
                      rgba(255,255,255,0.08) ${percent}%,
                      rgba(255,255,255,0.08) 100%)`,
                    transition: 'background 200ms ease',
                    pointerEvents: 'none',
                    border: hasError ? '1px solid rgba(250,204,21,0.4)' : 'none',
                  }}
                />

                {/* Input range — encima del track visual */}
                <input
                  id={`${baseId}-${slider.id}`}
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={val ?? 5}
                  onChange={(e) => handleChange(slider.id, e.target.value)}
                  aria-label={slider.label}
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={val ?? 5}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '44px',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    outline: 'none',
                    /* El track visual está en el div de arriba */
                  }}
                />
              </div>

              {/* Escala 1–10 */}
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
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  1
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  10
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mensaje de validación */}
      {errors.size > 0 && (
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-warning)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            animation: 'fade-in-quick 300ms ease',
          }}
        >
          Mueve todos los indicadores para un diagnóstico preciso.
          {forceAttempts >= 1 && ' (Toca de nuevo para continuar igualmente)'}
        </p>
      )}

      {/* Botón continuar */}
      <button
        onClick={handleContinue}
        style={{
          width: '100%',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--border-accent-strong)',
          background: allMoved ? 'var(--color-accent-subtle)' : 'transparent',
          color: allMoved ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          fontWeight: allMoved ? 500 : 400,
          cursor: 'pointer',
          transition: 'all var(--transition-base)',
          minHeight: '44px',
        }}
      >
        {allMoved ? 'Ver mi diagnóstico completo →' : 'Continuar →'}
      </button>
    </div>
  )
}
