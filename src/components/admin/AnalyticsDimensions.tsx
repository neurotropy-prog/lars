'use client'

/**
 * AnalyticsDimensions — 5 barras horizontales con score promedio por dimensión.
 *
 * Color por rango: rojo (<40), naranja (40-60), verde (>60).
 * Insight automático: "El X% tienen [dimensión] como peor dimensión".
 */

import Card from '@/components/ui/Card'

interface AnalyticsDimensionsProps {
  dimensions: Record<string, number>
  worstDimensionDist: Record<string, number>
  total: number
}

const DIMENSION_LABELS: Record<string, string> = {
  d1_regulacion: 'Regulación Nerviosa',
  d2_sueno: 'Calidad de Sueño',
  d3_claridad: 'Claridad Cognitiva',
  d4_emocional: 'Equilibrio Emocional',
  d5_alegria: 'Alegría de Vivir',
}

const DIMENSION_SHORT: Record<string, string> = {
  d1_regulacion: 'D1',
  d2_sueno: 'D2',
  d3_claridad: 'D3',
  d4_emocional: 'D4',
  d5_alegria: 'D5',
}

function scoreColor(score: number): string {
  if (score < 40) return 'var(--color-error)'
  if (score <= 60) return '#D4895C'
  return 'var(--color-success)'
}

function scoreBg(score: number): string {
  if (score < 40) return 'rgba(196, 64, 64, 0.1)'
  if (score <= 60) return 'rgba(212, 137, 92, 0.1)'
  return 'rgba(61, 154, 95, 0.1)'
}

export default function AnalyticsDimensions({ dimensions, worstDimensionDist, total }: AnalyticsDimensionsProps) {
  const dimKeys = Object.keys(DIMENSION_LABELS)

  // Find the worst dimension (highest count in distribution)
  let worstKey = dimKeys[0]
  let worstCount = 0
  for (const key of dimKeys) {
    const count = worstDimensionDist[key] ?? 0
    if (count > worstCount) {
      worstCount = count
      worstKey = key
    }
  }
  const worstPct = total > 0 ? Math.round((worstCount / total) * 100) : 0

  return (
    <Card>
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-caption)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-5)',
      }}>
        Dimensiones colectivas
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {dimKeys.map((key) => {
          const avg = dimensions[key] ?? 0
          const label = DIMENSION_LABELS[key]
          const short = DIMENSION_SHORT[key]
          const color = scoreColor(avg)

          return (
            <div key={key}>
              {/* Label row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 'var(--space-2)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--color-text-tertiary)',
                    width: 22,
                  }}>
                    {short}
                  </span>
                  {label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 700,
                  color,
                }}>
                  {avg}
                </span>
              </div>

              {/* Bar */}
              <div style={{
                height: 8,
                borderRadius: 4,
                background: 'rgba(30, 19, 16, 0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.max(2, avg)}%`,
                  borderRadius: 4,
                  background: color,
                  transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Automatic insight */}
      {total > 0 && worstCount > 0 && (
        <div style={{
          marginTop: 'var(--space-5)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          background: scoreBg(dimensions[worstKey] ?? 0),
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-2)',
        }}>
          <span style={{ fontSize: '14px' }}>💡</span>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            El <strong style={{ color: 'var(--color-text-primary)' }}>{worstPct}%</strong> de tus leads tienen{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>{DIMENSION_LABELS[worstKey]}</strong>{' '}
            como peor dimensión
          </p>
        </div>
      )}
    </Card>
  )
}
