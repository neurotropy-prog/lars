'use client'

/**
 * CompararClient — Vista comparativa animada AMPLIFY.
 *
 * Orquesta la secuencia de 7 segundos:
 *   0.0s  Header fade-in
 *   0.5s  Ambos scores globales (Counter)
 *   2.0s  D1-D5 barras paralelas (stagger 1s)
 *   6.5s  Mayor brecha destaca, resto opacity 0.7
 *   7.0s  Insight + CTA fade-in-up
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Counter from '@/components/ui/Counter'
import { getScoreColor, getScoreLabel } from '@/lib/insights'
import { useCopy } from '@/lib/copy'
import type { DimensionScores, Brecha } from '@/lib/amplify-insights'
import ComparisonDimensionBar from './ComparisonDimensionBar'
import ComparisonInsightBlock from './ComparisonInsightBlock'

const DIMENSIONS: { key: keyof Omit<DimensionScores, 'global'>; label: string }[] = [
  { key: 'd1', label: 'Regulación Nerviosa' },
  { key: 'd2', label: 'Calidad de Sueño' },
  { key: 'd3', label: 'Claridad Cognitiva' },
  { key: 'd4', label: 'Equilibrio Emocional' },
  { key: 'd5', label: 'Alegría de Vivir' },
]

interface CompararProps {
  myScores: DimensionScores
  theirScores: DimensionScores
  myProfile: string
  theirProfile: string
  theirInitials: string
  insight: string
  brechaMayor: Brecha
  mapaHash: string
  stripeUrl?: string
}

export default function CompararClient({
  myScores,
  theirScores,
  theirInitials,
  insight,
  brechaMayor,
  mapaHash,
  stripeUrl,
}: CompararProps) {
  const { getCopy } = useCopy()
  // Animation phases: 0=mount, 1=header, 2=scores, 3=bars, 4=highlight, 5=insight
  const [phase, setPhase] = useState(0)

  // Detect prefers-reduced-motion
  const [instant, setInstant] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setInstant(true)
      setPhase(5)
      return
    }

    // Orchestrated reveal
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setPhase(1), 0))       // Header
    timers.push(setTimeout(() => setPhase(2), 500))      // Scores
    timers.push(setTimeout(() => setPhase(3), 2000))     // Bars start
    timers.push(setTimeout(() => setPhase(4), 6500))     // Highlight
    timers.push(setTimeout(() => setPhase(5), 7000))     // Insight

    return () => timers.forEach(clearTimeout)
  }, [])

  const myGlobalColor = getScoreColor(myScores.global)
  const theirGlobalColor = getScoreColor(theirScores.global)
  const myLabel = getScoreLabel(myScores.global)
  const theirLabel = getScoreLabel(theirScores.global)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: 'var(--space-6) var(--space-4)',
        maxWidth: '640px',
        margin: '0 auto',
      }}
    >
      {/* Back link */}
      <Link
        href={`/mapa/${mapaHash}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-tertiary)',
          textDecoration: 'none',
          marginBottom: 'var(--space-8)',
          transition: 'color var(--transition-base)',
        }}
      >
        ← {getCopy('amplify.comparison.back')}
      </Link>

      {/* ── HEADER ── */}
      <div
        style={{
          opacity: phase >= 1 || instant ? 1 : 0,
          transition: instant ? 'none' : 'opacity 500ms ease',
          marginBottom: 'var(--space-8)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-accent)',
            marginBottom: 'var(--space-6)',
          }}
        >
          {getCopy('amplify.comparison.header')}
        </p>

        {/* Two scores side by side */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-4)',
          }}
        >
          {/* My score */}
          <div
            style={{
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--space-2)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {getCopy('amplify.comparison.you_label')}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '40px',
                fontWeight: 700,
                color: myGlobalColor,
                lineHeight: 1.1,
              }}
            >
              {phase >= 2 || instant ? (
                <Counter
                  to={myScores.global}
                  duration={1200}
                  suffix="/100"
                  autoStart
                />
              ) : (
                <span style={{ opacity: 0 }}>0/100</span>
              )}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-2)',
              }}
            >
              {myLabel}
            </p>
          </div>

          {/* Their score */}
          <div
            style={{
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--space-2)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {theirInitials}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '40px',
                fontWeight: 700,
                color: theirGlobalColor,
                lineHeight: 1.1,
              }}
            >
              {phase >= 2 || instant ? (
                <Counter
                  to={theirScores.global}
                  duration={1200}
                  suffix="/100"
                  autoStart
                />
              ) : (
                <span style={{ opacity: 0 }}>0/100</span>
              )}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-2)',
              }}
            >
              {theirLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ── DIMENSION BARS ── */}
      <div
        style={{
          opacity: phase >= 3 || instant ? 1 : 0,
          transition: instant ? 'none' : 'opacity 400ms ease',
          marginBottom: 'var(--space-8)',
        }}
      >
        {DIMENSIONS.map((dim, i) => (
          <ComparisonDimensionBar
            key={dim.key}
            dimensionKey={dim.key}
            label={dim.label}
            myScore={myScores[dim.key]}
            theirScore={theirScores[dim.key]}
            theirInitials={theirInitials}
            delay={i * 1000}
            isHighlighted={brechaMayor.dimension === dim.key}
            highlightActive={phase >= 4}
            active={phase >= 3}
            instant={instant}
          />
        ))}
      </div>

      {/* ── INSIGHT + CTA ── */}
      <ComparisonInsightBlock
        insight={insight}
        visible={phase >= 5}
        instant={instant}
        stripeUrl={stripeUrl}
      />

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--space-8) 0 var(--space-12)',
          borderTop: 'var(--border-subtle)',
          marginTop: 'var(--space-8)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {getCopy('amplify.comparison.footer')}
        </p>
      </div>
    </div>
  )
}
