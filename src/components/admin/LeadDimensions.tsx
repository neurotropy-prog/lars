'use client'

/**
 * LeadDimensions — Mini horizontal bar chart for 5 regulation dimensions.
 * Shows D1-D5 scores with color-coded bars (red < 40, orange 40-60, green > 60).
 */

interface LeadDimensionsProps {
  scores: {
    d1?: number | null
    d2?: number | null
    d3?: number | null
    d4?: number | null
    d5?: number | null
  } | null
}

const DIMENSIONS = [
  { key: 'd1' as const, label: 'Regulación' },
  { key: 'd2' as const, label: 'Sueño' },
  { key: 'd3' as const, label: 'Claridad' },
  { key: 'd4' as const, label: 'Emocional' },
  { key: 'd5' as const, label: 'Alegría' },
]

function scoreColor(score: number): string {
  if (score < 40) return 'var(--color-error)'
  if (score <= 60) return '#D97706'
  return '#059669'
}

export default function LeadDimensions({ scores }: LeadDimensionsProps) {
  if (!scores) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {DIMENSIONS.map((dim) => {
        const val = scores[dim.key]
        const score = typeof val === 'number' ? val : 0

        return (
          <div
            key={dim.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 32px',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
              }}
            >
              {dim.label}
            </span>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: 'rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.max(0, score))}%`,
                  borderRadius: 3,
                  background: scoreColor(score),
                  transition: 'width 300ms ease',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                fontWeight: 600,
                color: scoreColor(score),
                textAlign: 'right',
              }}
            >
              {score}
            </span>
          </div>
        )
      })}
    </div>
  )
}
