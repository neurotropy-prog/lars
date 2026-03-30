'use client'

/**
 * EmailCapture — A-11
 *
 * 5 barras de dimensión borrosas al fondo (blur 8px, opacity 0.3) —
 * la persona CASI ve su mapa. El score global SÍ se lee. Las dimensiones
 * son la recompensa de dar el email.
 *
 * Zeigarnik al máximo: el score ya lo vio en bisagra, aquí lo ve de nuevo
 * y el mapa está a un campo de texto de distancia.
 *
 * On submit → llama onComplete(email). El guardado en Supabase + envío
 * de email con Resend se gestiona desde GatewayBloque3 / API route.
 */

import { useState, useCallback } from 'react'
import type { DimensionScores } from '@/lib/scoring'

const DIMENSION_LABELS = [
  { id: 'd1', label: 'Regulación Nerviosa' },
  { id: 'd2', label: 'Calidad de Sueño' },
  { id: 'd3', label: 'Claridad Cognitiva' },
  { id: 'd4', label: 'Equilibrio Emocional' },
  { id: 'd5', label: 'Alegría de Vivir' },
]

/** Color semáforo según score 0-100 */
function barColor(score: number): string {
  if (score <= 39) return 'var(--color-error)'
  if (score <= 59) return '#CC796C' // naranja para Comprometido
  if (score <= 79) return 'var(--color-warning)'
  return 'var(--color-success)'
}

/** Validación básica de email en tiempo real */
function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

interface EmailCaptureProps {
  scores: DimensionScores
  onComplete: (email: string) => void
}

export default function EmailCapture({ scores, onComplete }: EmailCaptureProps) {
  const [email, setEmail]           = useState('')
  const [touched, setTouched]       = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)

  const valid = isEmailValid(email)
  const showError = touched && email.length > 0 && !valid

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setTouched(true)
      if (!valid || isSubmitting) return
      setSubmitting(true)
      onComplete(email.trim())
    },
    [email, valid, isSubmitting, onComplete]
  )

  return (
    <div
      className="step-enter"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      {/* ── Score visible arriba ── */}
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-display)',
            lineHeight: 1,
            letterSpacing: 'var(--ls-display)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {scores.global}
          <span
            style={{
              fontSize: 'var(--text-h4)',
              fontWeight: 400,
              color: 'var(--color-text-secondary)',
              marginLeft: 'var(--space-2)',
            }}
          >
            /100
          </span>
        </p>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            letterSpacing: 'var(--ls-overline)',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginTop: 'var(--space-2)',
          }}
        >
          {scores.label}
        </p>
      </div>

      {/* ── Mapa borroso — A-11 ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid rgba(38,66,51,0.06)',
          padding: 'var(--space-5) var(--space-6)',
          background: 'rgba(249,241,222,0.95)',
        }}
      >
        {/* Barras de dimensión borrosas */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            filter: 'blur(6px)',
            opacity: 0.35,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {DIMENSION_LABELS.map(({ id, label }) => {
            const score = scores[id as keyof DimensionScores] as number
            const pct = Math.round(score)
            const color = barColor(score)
            return (
              <div key={id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 600,
                      color,
                    }}
                  >
                    {score}
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(38,66,51,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: color,
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Overlay con mensaje de desbloqueo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
              textAlign: 'center',
              letterSpacing: '0.01em',
            }}
          >
            Tu evaluación completa está aquí
          </p>
        </div>
      </div>

      {/* ── Formulario ── */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h3)',
            lineHeight: 'var(--lh-h3)',
            letterSpacing: 'var(--ls-h3)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
            textAlign: 'center',
          }}
        >
          Tu evaluación está lista
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginBottom: 'var(--space-6)',
          }}
        >
          Lo guardamos en una página personal para ti. Evoluciona con el tiempo — cada semana hay algo nuevo.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Campo email */}
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setTouched(true)
            }}
            onBlur={() => setTouched(true)}
            autoComplete="email"
            inputMode="email"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 'var(--radius-pill)',
              border: showError
                ? '1px solid var(--color-error)'
                : '1px solid rgba(38,66,51,0.12)',
              background: 'rgba(38,66,51,0.05)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '16px', /* 16px: evita zoom en iOS */
              outline: 'none',
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
              marginBottom: showError ? 'var(--space-2)' : 'var(--space-4)',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              if (!showError) {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(180, 90, 50, 0.15)'
              }
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              if (!showError) {
                e.currentTarget.style.borderColor = 'rgba(38,66,51,0.12)'
              }
            }}
          />

          {/* Error de validación */}
          {showError && (
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-error)',
                marginBottom: 'var(--space-4)',
                animation: 'fade-in-quick 200ms ease',
              }}
            >
              Revisa tu email — lo necesitamos correcto para guardarte el mapa.
            </p>
          )}

          {/* Botón principal */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '16px var(--space-6)',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: valid ? 'var(--color-accent)' : 'rgba(205,121,108,0.2)',
              color: valid ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              cursor: valid ? 'pointer' : 'default',
              transition: 'all var(--transition-base)',
              minHeight: '44px',
              marginBottom: 'var(--space-3)',
            }}
            onMouseEnter={(e) => {
              if (valid) e.currentTarget.style.background = 'var(--color-accent-hover)'
            }}
            onMouseLeave={(e) => {
              if (valid) e.currentTarget.style.background = 'var(--color-accent)'
            }}
          >
            {isSubmitting ? 'Guardando tu evaluación…' : 'Acceder a mi evaluación'}
          </button>

          {/* Disuelve fricción */}
          <p
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              lineHeight: 'var(--lh-caption)',
              color: 'var(--color-text-tertiary)',
              textAlign: 'center',
            }}
          >
            Solo email. Cero spam. Tu evaluación es confidencial.
          </p>
        </form>
      </div>
    </div>
  )
}
