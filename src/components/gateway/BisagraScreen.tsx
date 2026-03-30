'use client'

/**
 * BisagraScreen — A-10
 *
 * Revelación secuencial del score. ZONA 3 — Revelación.
 * Cada elemento aparece con fade-in escalonado vía useEffect timers.
 *
 * Secuencia:
 *   T+0ms    step-enter (el contenedor ya visible)
 *   T+200ms  Overline "TU NIVEL DE REGULACIÓN"
 *   T+600ms  Counter score (0→score, 1200ms) + "de 100"
 *   T+2000ms Texto de comparación
 *   T+2400ms Counter benchmark (0→72, 800ms)
 *   T+3400ms Texto de brecha (accent)
 *   T+4000ms Separador + coste oculto
 *   T+5000ms Amplificador social
 *   T+5800ms Botón "Ver mi análisis completo"
 */

import { useState, useEffect } from 'react'
import Counter from '@/components/ui/Counter'
import type { DimensionScores } from '@/lib/scoring'

const BENCHMARK = 72

interface BisagraScreenProps {
  scores: DimensionScores
  onContinue: () => void
}

/** Fade-in con estado booleano */
function fadeStyle(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(12px)',
    transition: `opacity 500ms var(--ease-out-expo) ${delay}ms, transform 500ms var(--ease-out-expo) ${delay}ms`,
  }
}

export default function BisagraScreen({ scores, onContinue }: BisagraScreenProps) {
  const [showOverline, setShowOverline]     = useState(false)
  const [showScore, setShowScore]           = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showBenchmark, setShowBenchmark]   = useState(false)
  const [showGap, setShowGap]               = useState(false)
  const [showCost, setShowCost]             = useState(false)
  const [showSocial, setShowSocial]         = useState(false)
  const [showButton, setShowButton]         = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowOverline(true),    200),
      setTimeout(() => setShowScore(true),        600),
      setTimeout(() => setShowComparison(true),  2000),
      setTimeout(() => setShowBenchmark(true),   2400),
      setTimeout(() => setShowGap(true),         3400),
      setTimeout(() => setShowCost(true),        4000),
      setTimeout(() => setShowSocial(true),      5000),
      setTimeout(() => setShowButton(true),      5800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  /* prefers-reduced-motion: muestra todo inmediatamente */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setShowOverline(true)
      setShowScore(true)
      setShowComparison(true)
      setShowBenchmark(true)
      setShowGap(true)
      setShowCost(true)
      setShowSocial(true)
      setShowButton(true)
    }
  }, [])

  return (
    <div
      className="step-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      {/* ── Card bisagra ── */}
      <div
        style={{
          background: 'linear-gradient(160deg, #07181d 0%, #0a1e24 100%)',
          border: '1px solid rgba(198,200,238,0.15)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8) var(--space-6)',
        }}
      >
        {/* Overline */}
        <p
          style={{
            ...fadeStyle(showOverline),
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            letterSpacing: 'var(--ls-overline)',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: 'var(--space-5)',
          }}
        >
          Tu nivel de regulación
        </p>

        {/* Score principal */}
        <div
          style={{
            ...fadeStyle(showScore),
            marginBottom: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-display)',
              lineHeight: 1,
              letterSpacing: 'var(--ls-display)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            {showScore ? (
              <Counter
                from={0}
                to={scores.global}
                duration={1200}
              />
            ) : 0}
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

        {/* Separador */}
        <div
          style={{
            ...fadeStyle(showComparison),
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            margin: 'var(--space-6) 0',
          }}
        />

        {/* Texto de comparación */}
        <p
          style={{
            ...fadeStyle(showComparison),
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          El promedio de personas en tu situación que empezaron a regularse:
        </p>

        {/* Benchmark */}
        <div
          style={{
            ...fadeStyle(showBenchmark),
            marginBottom: 'var(--space-5)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-display)',
              lineHeight: 1,
              letterSpacing: 'var(--ls-display)',
              fontWeight: 600,
              color: 'var(--color-accent)',
            }}
          >
            {showBenchmark ? (
              <Counter
                from={0}
                to={BENCHMARK}
                duration={800}
              />
            ) : 0}
          </span>
        </div>

        {/* Brecha */}
        <p
          style={{
            ...fadeStyle(showGap),
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--color-accent)',
            fontWeight: 500,
            marginBottom: 'var(--space-6)',
          }}
        >
          La distancia entre ambos números es donde está tu oportunidad.
        </p>

        {/* Separador */}
        <div
          style={{
            ...fadeStyle(showCost),
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: 'var(--space-5)',
          }}
        />

        {/* Coste oculto */}
        <p
          style={{
            ...fadeStyle(showCost),
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Con un nivel de regulación de{' '}
          <strong>{scores.global}</strong>, tu cuerpo pierde unas{' '}
          12-15 horas semanales de rendimiento real. No en tiempo — en calidad
          de decisiones, en paciencia, en energía para lo que importa. En los
          últimos meses, eso se acumula.
        </p>

        {/* Amplificador social */}
        <p
          style={{
            ...fadeStyle(showSocial),
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          De las 5.247 personas con un score similar al tuyo, las que actuaron
          en la primera semana mejoraron un 34% más rápido que las que esperaron
          un mes.
        </p>
      </div>

      {/* Botón continuar */}
      <button
        onClick={onContinue}
        style={{
          ...fadeStyle(showButton),
          width: '100%',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(198,200,238,0.25)',
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
          e.currentTarget.style.borderColor = 'rgba(198,200,238,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)'
          e.currentTarget.style.borderColor = 'rgba(198,200,238,0.25)'
        }}
      >
        Ver mi análisis completo →
      </button>
    </div>
  )
}
