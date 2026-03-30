'use client'

/**
 * SlidersStep — P7: 5 sliders horizontales, uno por dimensión.
 *
 * A-07 / Sprint 5C redesign:
 *   - Thumb HIDDEN until first click/touch on that slider
 *   - Thumb appears AT click position with scaleIn animation (200ms spring)
 *   - Track fills with color from left to thumb (4px height)
 *   - Color: ≤3 red, 4-6 yellow, ≥7 green
 *   - Subtle pulse when crossing color boundaries (3↔4, 6↔7)
 *   - Submit button disabled (opacity 0.4, pointer-events none) until all 5 touched
 */

import { useState, useCallback, useRef, useId } from 'react'
import type { SliderDimension } from '@/lib/gateway-bloque2-data'

interface SlidersStepProps {
  question: string
  sliders: SliderDimension[]
  onContinue: (values: Record<string, number>) => void
}

/** Color del fill según valor 1-10 */
function getSliderColor(value: number): string {
  if (value <= 3) return '#C44040'
  if (value <= 6) return '#D4A017'
  return '#3D9A5F'
}

/** Porcentaje del fill para el track gradient (valor 1-10) */
function fillPercent(value: number): number {
  return ((value - 1) / 9) * 100
}

/** Detect if a value change crosses a color boundary */
function crossesBoundary(prev: number, next: number): boolean {
  const boundaries = [3, 6] // 3→4 and 6→7
  return boundaries.some(
    (b) => (prev <= b && next > b) || (prev > b && next <= b)
  )
}

/** Convert click position on track to value 1-10 */
function positionToValue(clientX: number, trackEl: HTMLElement): number {
  const rect = trackEl.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return Math.round(ratio * 9) + 1 // 1-10
}

export default function SlidersStep({ question, sliders, onContinue }: SlidersStepProps) {
  const [values, setValues] = useState<Record<string, number | undefined>>(
    () => Object.fromEntries(sliders.map((s) => [s.id, undefined]))
  )
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [pulsingSlider, setPulsingSlider] = useState<string | null>(null)
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const baseId = useId()

  const triggerPulse = useCallback((sliderId: string) => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
    setPulsingSlider(sliderId)
    pulseTimerRef.current = setTimeout(() => setPulsingSlider(null), 300)
  }, [])

  const handleChange = useCallback(
    (id: string, raw: string) => {
      const num = parseInt(raw, 10)
      const prev = values[id]

      setValues((v) => ({ ...v, [id]: num }))
      setTouched((t) => {
        if (t.has(id)) return t
        const next = new Set(t)
        next.add(id)
        return next
      })

      // Boundary crossing detection
      if (prev !== undefined && crossesBoundary(prev, num)) {
        triggerPulse(id)
      }
    },
    [values, triggerPulse]
  )

  /** Click directly on the track container → set value at click position */
  const handleTrackClick = useCallback(
    (id: string, e: React.MouseEvent<HTMLDivElement>) => {
      const trackEl = trackRefs.current[id]
      if (!trackEl) return
      const val = positionToValue(e.clientX, trackEl)
      handleChange(id, String(val))
    },
    [handleChange]
  )

  /** Touch start on track → set value at touch position */
  const handleTrackTouch = useCallback(
    (id: string, e: React.TouchEvent<HTMLDivElement>) => {
      const trackEl = trackRefs.current[id]
      if (!trackEl || !e.touches[0]) return
      const val = positionToValue(e.touches[0].clientX, trackEl)
      handleChange(id, String(val))
    },
    [handleChange]
  )

  const allTouched = sliders.every((s) => touched.has(s.id))

  const handleContinue = useCallback(() => {
    if (!allTouched) return // button is disabled anyway
    const finalValues: Record<string, number> = Object.fromEntries(
      sliders.map((s) => [s.id, values[s.id] ?? 5])
    )
    onContinue(finalValues)
  }, [sliders, values, allTouched, onContinue])

  const untouchedCount = sliders.length - touched.size

  return (
    <div className="step-enter">
      {/* Pregunta */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-h4)',
          lineHeight: 'var(--lh-h4)',
          letterSpacing: 'var(--ls-h4)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)',
        }}
      >
        {question}
      </p>

      {/* Contexto */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--lh-body-sm)',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          marginBottom: 'var(--space-8)',
        }}
      >
        Mueve cada indicador — la evaluación cruza estos valores con tus respuestas anteriores.
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
          const isTouched = touched.has(slider.id)
          const color = isTouched ? getSliderColor(val!) : 'rgba(30,19,16,0.1)'
          const percent = isTouched ? fillPercent(val!) : 0
          const isPulsing = pulsingSlider === slider.id

          const wrapperClass = [
            isTouched ? 'slider-touched' : '',
            isPulsing ? 'slider-pulse' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div key={slider.id} className={wrapperClass || undefined}>
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
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-body-sm)',
                    lineHeight: 'var(--lh-body-sm)',
                    color: 'var(--color-text-primary)',
                    flex: 1,
                    paddingRight: 'var(--space-4)',
                  }}
                >
                  {slider.label}
                </label>

                {/* Valor numérico */}
                <span
                  aria-live="polite"
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-h4)',
                    fontWeight: 600,
                    color: isTouched ? color : 'var(--color-text-tertiary)',
                    minWidth: '28px',
                    textAlign: 'right',
                    transition: 'color 200ms ease',
                  }}
                >
                  {isTouched ? val : '—'}
                </span>
              </div>

              {/* Slider track + input */}
              <div
                ref={(el) => { trackRefs.current[slider.id] = el }}
                onClick={(e) => handleTrackClick(slider.id, e)}
                onTouchStart={(e) => handleTrackTouch(slider.id, e)}
                style={{
                  position: 'relative',
                  height: '44px', /* touch target */
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {/* Track visual — 4px thin line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '4px',
                    borderRadius: '2px',
                    background: `linear-gradient(to right,
                      ${color} 0%,
                      ${color} ${percent}%,
                      rgba(30,19,16,0.1) ${percent}%,
                      rgba(30,19,16,0.1) 100%)`,
                    transition: 'background 200ms ease',
                    pointerEvents: 'none',
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
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  1
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
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

      {/* Hint when some sliders remain untouched */}
      {untouchedCount > 0 && touched.size > 0 && (
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            animation: 'fade-in-quick 300ms ease',
          }}
        >
          {untouchedCount === 1
            ? 'Queda 1 indicador por mover.'
            : `Quedan ${untouchedCount} indicadores por mover.`}
        </p>
      )}

      {/* Botón continuar — DISABLED until all 5 touched */}
      <button
        onClick={handleContinue}
        disabled={!allTouched}
        aria-disabled={!allTouched}
        style={{
          width: '100%',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--border-accent-strong)',
          background: allTouched ? 'var(--color-accent-subtle)' : 'transparent',
          color: allTouched ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          fontWeight: allTouched ? 500 : 400,
          cursor: allTouched ? 'pointer' : 'default',
          transition: 'all var(--transition-base)',
          minHeight: '44px',
          opacity: allTouched ? 1 : 0.4,
          pointerEvents: allTouched ? 'auto' : 'none',
        }}
      >
        Ver mi evaluación completa →
      </button>
    </div>
  )
}
