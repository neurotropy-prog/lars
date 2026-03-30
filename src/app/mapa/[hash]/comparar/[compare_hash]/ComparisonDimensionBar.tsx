'use client'

/**
 * ComparisonDimensionBar — Par de barras paralelas para una dimensión.
 *
 * Muestra "Tú" vs "Otro" con barras de color semáforo, scores numéricos,
 * y opcionalmente un badge de "Mayor brecha".
 *
 * Mobile-first: barras apiladas verticalmente.
 */

import { getScoreColor } from '@/lib/insights'

interface Props {
  /** d1, d2, etc. */
  dimensionKey: string
  /** e.g. "Regulación Nerviosa" */
  label: string
  myScore: number
  theirScore: number
  theirInitials: string
  /** Delay in ms before bars fill (for stagger animation) */
  delay: number
  /** Whether this dimension has the biggest gap */
  isHighlighted: boolean
  /** Whether highlight phase has triggered (others dim to 0.7) */
  highlightActive: boolean
  /** Whether bars should be filled (animation phase reached) */
  active: boolean
  /** Skip animation (prefers-reduced-motion) */
  instant: boolean
}

export default function ComparisonDimensionBar({
  dimensionKey,
  label,
  myScore,
  theirScore,
  theirInitials,
  delay,
  isHighlighted,
  highlightActive,
  active,
  instant,
}: Props) {
  const myColor = getScoreColor(myScore)
  const theirColor = getScoreColor(theirScore)
  const gap = Math.abs(myScore - theirScore)

  const shouldDim = highlightActive && !isHighlighted

  return (
    <div
      role="img"
      aria-label={`${label}: Tú ${myScore} de 100, ${theirInitials} ${theirScore} de 100`}
      style={{
        opacity: shouldDim ? 0.7 : 1,
        transition: 'opacity 400ms ease',
        marginBottom: 'var(--space-6)',
      }}
    >
      {/* Dimension label */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {dimensionKey.toUpperCase()} — {label}
      </p>

      {/* My bar */}
      <div style={{ marginBottom: 'var(--space-2)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              minWidth: '36px',
            }}
          >
            Tú
          </span>
          <div
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              background: 'rgba(30,19,16,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '4px',
                background: myColor,
                width: active || instant ? `${myScore}%` : '0%',
                transition: instant ? 'none' : `width 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body)',
              fontWeight: 700,
              color: myColor,
              minWidth: '32px',
              textAlign: 'right',
            }}
          >
            {myScore}
          </span>
        </div>
      </div>

      {/* Their bar */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              minWidth: '36px',
            }}
          >
            {theirInitials}
          </span>
          <div
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              background: 'rgba(30,19,16,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '4px',
                background: theirColor,
                width: active || instant ? `${theirScore}%` : '0%',
                transition: instant ? 'none' : `width 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body)',
              fontWeight: 700,
              color: theirColor,
              minWidth: '32px',
              textAlign: 'right',
            }}
          >
            {theirScore}
          </span>
        </div>
      </div>

      {/* Gap badge (only on highlighted dimension) */}
      {isHighlighted && highlightActive && gap > 0 && (
        <div
          style={{
            marginTop: 'var(--space-3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(180, 90, 50, 0.08)',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            fontWeight: 500,
            animation: 'fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          ← Mayor brecha: {gap} puntos
        </div>
      )}
    </div>
  )
}
