'use client'

/**
 * BisagraSequence — A-09 + A-10 unified
 *
 * Secuencia orquestada de ~10 segundos. Fusiona CalculandoScreen + BisagraScreen.
 * Cada paso espera al anterior. Las pausas son intencionales.
 *
 * T=0.0s  Componente monta. Nada visible.
 * T=0.8s  Caja oscura scale-in + glow radial pulsante
 * T=1.2s  "Calculando tu perfil..." typing (35ms/char)
 * T=3.0s  Typing termina. Cursor parpadea 3 veces.
 * T=4.0s  Texto se desvanece. 300ms de oscuridad.
 * T=4.3s  "TU NIVEL DE REGULACIÓN" fade in
 * T=4.8s  Counter score 0→[score] (1200ms)
 * T=6.0s  Etiqueta severidad con color
 * T=6.5s  1 segundo de silencio
 * T=7.5s  Benchmark texto + counter
 * T=8.5s  Texto brecha en accent
 * T=9.0s  Línea datos sociales
 * T=9.5s  Botón CTA
 */

import { useState, useEffect } from 'react'
import Counter from '@/components/ui/Counter'
import TypeWriter from '@/components/ui/TypeWriter'
import type { DimensionScores } from '@/lib/scoring'

const BENCHMARK = 72
const CALCULANDO_TEXT = 'Calculando tu perfil de regulación\u2026'

interface BisagraSequenceProps {
  scores: DimensionScores
  onContinue: () => void
}

function getSeverity(score: number): { label: string; color: string } {
  if (score < 30) return { label: 'CRÍTICO', color: '#C44040' }
  if (score <= 50) return { label: 'MODERADO', color: '#D4A017' }
  return { label: 'EN RANGO', color: '#3D9A5F' }
}

/** Fade-in con estado booleano */
function fadeStyle(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(12px)',
    transition: `opacity 500ms var(--ease-out-expo) ${delay}ms, transform 500ms var(--ease-out-expo) ${delay}ms`,
  }
}

export default function BisagraSequence({ scores, onContinue }: BisagraSequenceProps) {
  // ── State flags ──
  const [showBox, setShowBox]             = useState(false)
  const [calcPhase, setCalcPhase]         = useState(false)
  const [showTyping, setShowTyping]       = useState(false)
  const [fadeTyping, setFadeTyping]       = useState(false)
  const [showLabel, setShowLabel]         = useState(false)
  const [showScore, setShowScore]         = useState(false)
  const [showSeverity, setShowSeverity]   = useState(false)
  const [showBenchmark, setShowBenchmark] = useState(false)
  const [showGap, setShowGap]             = useState(false)
  const [showSocial, setShowSocial]       = useState(false)
  const [showButton, setShowButton]       = useState(false)

  // ── Orchestration ──
  useEffect(() => {
    const timers = [
      setTimeout(() => { setShowBox(true); setCalcPhase(true) }, 800),
      setTimeout(() => setShowTyping(true), 1200),
      // T=4.0s → fade out typing, stop glow
      setTimeout(() => { setFadeTyping(true); setCalcPhase(false) }, 4000),
      // T=4.3s → label
      setTimeout(() => setShowLabel(true), 4300),
      // T=4.8s → score counter
      setTimeout(() => setShowScore(true), 4800),
      // T=6.0s → severity
      setTimeout(() => setShowSeverity(true), 6000),
      // T=7.5s → benchmark (1s pause after severity)
      setTimeout(() => setShowBenchmark(true), 7500),
      // T=8.5s → gap
      setTimeout(() => setShowGap(true), 8500),
      // T=9.0s → social
      setTimeout(() => setShowSocial(true), 9000),
      // T=9.5s → button
      setTimeout(() => setShowButton(true), 9500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── prefers-reduced-motion ──
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setShowBox(true)
      setShowLabel(true)
      setShowScore(true)
      setShowSeverity(true)
      setShowBenchmark(true)
      setShowGap(true)
      setShowSocial(true)
      setShowButton(true)
      setFadeTyping(true)
    }
  }, [])

  const severity = getSeverity(scores.global)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: 'var(--space-5)',
      }}
    >
      {/* ── Bisagra box ── */}
      <div
        className={`bisagra-box${calcPhase ? ' bisagra-glow-active' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #D6E8DD 0%, #FFFFFF 100%)',
          border: '1px solid rgba(205,121,108,0.1)',
          borderRadius: '16px',
          padding: '48px 32px',
          maxWidth: '520px',
          width: '100%',
          // Scale-in animation
          opacity: showBox ? 1 : 0,
          transform: showBox ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 400ms var(--ease-out-expo), transform 400ms var(--ease-out-expo)',
          // Minimum height to prevent layout shift
          minHeight: showBox ? undefined : '0px',
          overflow: 'hidden',
        }}
      >
        {showBox && (
          <>
            {/* ═══ CALCULATION PHASE ═══ */}
            <div
              style={{
                textAlign: 'center',
                opacity: fadeTyping ? 0 : 1,
                transform: fadeTyping ? 'translateY(-8px)' : 'none',
                transition: 'opacity 300ms ease, transform 300ms ease',
                position: fadeTyping ? 'absolute' : 'relative',
                pointerEvents: fadeTyping ? 'none' : 'auto',
                width: fadeTyping ? '0' : '100%',
                height: fadeTyping ? '0' : 'auto',
                overflow: fadeTyping ? 'hidden' : 'visible',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-4)',
              }}
            >
              {/* Punto de luz central */}
              <div
                aria-hidden="true"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(205,121,108,0.18) 0%, transparent 70%)',
                  animation: 'pulse-glow 2.5s ease-in-out infinite',
                }}
              />

              {showTyping && (
                <TypeWriter
                  text={CALCULANDO_TEXT}
                  speed={35}
                  delay={0}
                  cursorPostDelay={1000}
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-body)',
                    lineHeight: 'var(--lh-body)',
                    color: 'var(--color-text-secondary)',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    display: 'block',
                    minHeight: '1.6em',
                  }}
                />
              )}
            </div>

            {/* ═══ REVEAL PHASE ═══ */}

            {/* Overline */}
            <p
              style={{
                ...fadeStyle(showLabel),
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                letterSpacing: 'var(--ls-overline)',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: 'var(--space-5)',
                // Hide during calc phase
                display: fadeTyping ? 'block' : 'none',
              }}
            >
              Tu nivel de regulación
            </p>

            {/* Score principal */}
            <div
              style={{
                ...fadeStyle(showScore),
                marginBottom: 'var(--space-2)',
                display: fadeTyping ? 'block' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '4rem',
                  lineHeight: 1,
                  letterSpacing: 'var(--ls-display)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                {showScore ? (
                  <Counter
                    from={0}
                    to={scores.global}
                    duration={1200}
                    autoStart
                  />
                ) : '0'}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-h4)',
                  lineHeight: 'var(--lh-h4)',
                  color: 'var(--color-text-secondary)',
                  marginLeft: 'var(--space-3)',
                }}
              >
                de 100
              </span>
            </div>

            {/* Severity label */}
            <p
              style={{
                ...fadeStyle(showSeverity),
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-h4)',
                fontWeight: 700,
                letterSpacing: 'var(--ls-overline)',
                color: severity.color,
                marginBottom: 'var(--space-6)',
                display: fadeTyping ? 'block' : 'none',
              }}
            >
              {severity.label}
            </p>

            {/* Separador */}
            <div
              style={{
                ...fadeStyle(showBenchmark),
                height: '1px',
                background: 'rgba(38,66,51,0.06)',
                margin: '0 0 var(--space-5)',
                display: fadeTyping ? 'block' : 'none',
              }}
            />

            {/* Texto de comparación */}
            <p
              style={{
                ...fadeStyle(showBenchmark),
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
                display: fadeTyping ? 'block' : 'none',
              }}
            >
              El promedio de personas en tu situación que empezaron a regularse:
            </p>

            {/* Benchmark counter */}
            <div
              style={{
                ...fadeStyle(showBenchmark),
                marginBottom: 'var(--space-5)',
                display: fadeTyping ? 'block' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-display)',
                  lineHeight: 1,
                  letterSpacing: 'var(--ls-display)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                }}
              >
                {showBenchmark ? (
                  <Counter
                    from={0}
                    to={BENCHMARK}
                    duration={800}
                    autoStart
                  />
                ) : '0'}
              </span>
            </div>

            {/* Gap text */}
            <p
              style={{
                ...fadeStyle(showGap),
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--lh-body)',
                color: 'var(--color-accent)',
                fontWeight: 500,
                marginBottom: 'var(--space-6)',
                display: fadeTyping ? 'block' : 'none',
              }}
            >
              La distancia entre ambos números es donde está tu oportunidad.
            </p>

            {/* Social data */}
            <p
              style={{
                ...fadeStyle(showSocial),
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-text-secondary)',
                display: fadeTyping ? 'block' : 'none',
              }}
            >
              De las 5.247 personas con un score similar al tuyo, las que actuaron
              en la primera semana mejoraron un 34% más rápido que las que esperaron
              un mes.
            </p>
          </>
        )}
      </div>

      {/* ── CTA Button ── */}
      <button
        onClick={onContinue}
        style={{
          ...fadeStyle(showButton),
          width: '100%',
          maxWidth: '520px',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(205,121,108,0.25)',
          background: 'transparent',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          cursor: 'pointer',
          transition: 'color var(--transition-fast), border-color var(--transition-fast)',
          minHeight: '44px',
          pointerEvents: showButton ? 'auto' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-text-primary)'
          e.currentTarget.style.borderColor = 'rgba(205,121,108,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)'
          e.currentTarget.style.borderColor = 'rgba(205,121,108,0.25)'
        }}
      >
        Ver mi evaluación completa →
      </button>
    </div>
  )
}
