'use client'

/**
 * DimensionCard.tsx — Card de dimensión individual (extraída de MapaClient)
 *
 * Renderiza una dimensión con su nombre, score, barra, insight,
 * y opcionalmente: badge D7 actualizado, subdimensiones completadas.
 */

import { useCopy } from '@/lib/copy'
import Badge from '@/components/ui/Badge'
import type { DimensionResult, DimensionKey } from '@/lib/insights'

interface SubdimensionScore {
  key: string
  name: string
  score: number
}

interface Props {
  dim: DimensionResult
  isMostCompromised: boolean
  showPriorityTag: boolean
  /** Insight D7 nuevo (solo en la dimensión más comprometida) */
  d7Insight?: string | null
  d7IsNew?: boolean
  /** Subdimensiones completadas */
  subdimensionScores?: SubdimensionScore[] | null
}

export default function DimensionCard({
  dim,
  isMostCompromised,
  showPriorityTag,
  d7Insight,
  d7IsNew,
  subdimensionScores,
}: Props) {
  const { getCopy } = useCopy()
  const isD2 = dim.key === 'd2'

  return (
    <div
      className={`mapa-fade-up${showPriorityTag ? ' mapa-priority' : ''}`}
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: showPriorityTag
          ? `1px solid ${dim.color}33`
          : 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
      }}
    >
      {/* Tags */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginBottom:
            showPriorityTag || isD2 || d7IsNew ? 'var(--space-3)' : 0,
        }}
      >
        {showPriorityTag && (
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              background: `${dim.color}18`,
              color: dim.color,
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Tu prioridad nº1
          </span>
        )}
        {isD2 && (
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(61,154,95,0.1)',
              color: 'var(--color-success)',
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Mejorable en 72 horas
          </span>
        )}
        {d7IsNew && <Badge status="actualizado">ACTUALIZADO</Badge>}
      </div>

      {/* Nombre + score */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-3)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h4)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--lh-h4)',
          }}
        >
          {dim.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h3)',
            fontWeight: 700,
            color: dim.color,
            lineHeight: 1,
          }}
        >
          {dim.score}
          <span
            style={{
              fontSize: 'var(--text-caption)',
              fontWeight: 400,
              color: 'var(--color-text-tertiary)',
            }}
          >
            /100
          </span>
        </span>
      </div>

      {/* Barra semáforo */}
      <div
        style={{
          height: '6px',
          borderRadius: '3px',
          background: 'rgba(38,66,51,0.08)',
          marginBottom: 'var(--space-4)',
          overflow: 'hidden',
        }}
      >
        <div
          className="mapa-bar-fill"
          style={{ width: `${dim.score}%`, background: dim.color }}
        />
      </div>

      {/* Insight original */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {dim.insight}
      </p>

      {/* Insight D7 — dato nuevo */}
      {d7Insight && (
        <div
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(205,121,108,0.06)',
            border: '1px solid rgba(205,121,108,0.12)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              lineHeight: 'var(--lh-body)',
              color: 'var(--color-text-primary)',
            }}
          >
            {d7Insight}
          </p>
        </div>
      )}

      {/* Subdimensiones completadas */}
      {subdimensionScores && subdimensionScores.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          {subdimensionScores.map((sub) => (
            <div key={sub.key} style={{ marginBottom: 'var(--space-3)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-1)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  {sub.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-caption)',
                    fontWeight: 500,
                    color: dim.color,
                  }}
                >
                  {sub.score}/100
                </span>
              </div>
              <div
                style={{
                  height: '3px',
                  borderRadius: '2px',
                  background: 'rgba(38,66,51,0.06)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${sub.score}%`,
                    height: '100%',
                    borderRadius: '2px',
                    background: dim.color,
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
