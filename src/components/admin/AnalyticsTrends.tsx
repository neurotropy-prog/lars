'use client'

/**
 * AnalyticsTrends — Gráfico SVG de tendencias diarias.
 *
 * Línea terracotta (análisis) + línea verde fina (conversiones).
 * Sin librerías externas — SVG puro.
 */

import { useState } from 'react'
import Card from '@/components/ui/Card'

interface DailyCount {
  date: string
  diagnostics: number
  conversions: number
}

interface AnalyticsTrendsProps {
  dailyCounts: DailyCount[]
}

// SVG dimensions
const W = 600
const H = 220
const PAD_LEFT = 40
const PAD_RIGHT = 16
const PAD_TOP = 16
const PAD_BOTTOM = 40
const PLOT_W = W - PAD_LEFT - PAD_RIGHT
const PLOT_H = H - PAD_TOP - PAD_BOTTOM

function formatShortDate(iso: string): string {
  const parts = iso.split('-')
  return `${parts[2]}/${parts[1]}`
}

export default function AnalyticsTrends({ dailyCounts }: AnalyticsTrendsProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  if (!dailyCounts || dailyCounts.length === 0) {
    return (
      <Card style={{ marginBottom: 'var(--space-6)' }}>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-caption)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-4)',
        }}>
          Tendencias
        </p>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center',
          padding: 'var(--space-8)',
        }}>
          Sin datos en este periodo
        </p>
      </Card>
    )
  }

  const data = dailyCounts
  const maxDiag = Math.max(...data.map((d) => d.diagnostics), 1)
  const maxConv = Math.max(...data.map((d) => d.conversions), 0)
  const maxY = Math.max(maxDiag, maxConv, 1)

  // Round maxY up to a nice number for gridlines
  const niceMax = Math.ceil(maxY / 5) * 5 || 5
  const gridLines = [0, Math.round(niceMax * 0.25), Math.round(niceMax * 0.5), Math.round(niceMax * 0.75), niceMax]

  function xPos(i: number): number {
    if (data.length === 1) return PAD_LEFT + PLOT_W / 2
    return PAD_LEFT + (i / (data.length - 1)) * PLOT_W
  }

  function yPos(val: number): number {
    return PAD_TOP + PLOT_H - (val / niceMax) * PLOT_H
  }

  // Build paths
  const diagPoints = data.map((d, i) => `${xPos(i)},${yPos(d.diagnostics)}`).join(' ')
  const diagAreaPoints = `${xPos(0)},${yPos(0)} ${diagPoints} ${xPos(data.length - 1)},${yPos(0)}`
  const convPoints = data.map((d, i) => `${xPos(i)},${yPos(d.conversions)}`).join(' ')

  // X-axis labels: show every Nth label to avoid overlap
  const labelStep = Math.max(1, Math.ceil(data.length / 10))

  return (
    <Card style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-caption)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-4)',
      }}>
        Tendencias
      </p>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-5)',
        marginBottom: 'var(--space-3)',
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-secondary)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: 12, height: 3, borderRadius: 2, background: '#B45A32' }} />
          Análisis
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: 12, height: 2, borderRadius: 2, background: 'var(--color-success)' }} />
          Conversiones
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Gridlines */}
          {gridLines.map((val) => (
            <g key={`grid-${val}`}>
              <line
                x1={PAD_LEFT}
                y1={yPos(val)}
                x2={W - PAD_RIGHT}
                y2={yPos(val)}
                stroke="rgba(30, 19, 16, 0.06)"
                strokeWidth={1}
              />
              <text
                x={PAD_LEFT - 6}
                y={yPos(val) + 4}
                textAnchor="end"
                fill="var(--color-text-tertiary)"
                fontSize="10"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <polygon
            points={diagAreaPoints}
            fill="rgba(180, 90, 50, 0.08)"
          />

          {/* Diagnostics line */}
          <polyline
            points={diagPoints}
            fill="none"
            stroke="#B45A32"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Conversions line */}
          {maxConv > 0 && (
            <polyline
              points={convPoints}
              fill="none"
              stroke="var(--color-success)"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
          )}

          {/* Data points + hover zones */}
          {data.map((d, i) => (
            <g key={i}>
              {/* Invisible hover target */}
              <rect
                x={xPos(i) - (PLOT_W / data.length) / 2}
                y={PAD_TOP}
                width={PLOT_W / data.length}
                height={PLOT_H}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
              />
              {/* Diagnostic point */}
              <circle
                cx={xPos(i)}
                cy={yPos(d.diagnostics)}
                r={hoverIndex === i ? 5 : 3}
                fill={hoverIndex === i ? '#B45A32' : 'var(--color-bg-tertiary)'}
                stroke="#B45A32"
                strokeWidth={2}
                style={{ transition: 'r 150ms ease' }}
              >
                <title>{`${formatShortDate(d.date)}: ${d.diagnostics} análisis, ${d.conversions} conversiones`}</title>
              </circle>
              {/* Conversion point */}
              {d.conversions > 0 && (
                <circle
                  cx={xPos(i)}
                  cy={yPos(d.conversions)}
                  r={hoverIndex === i ? 4 : 2}
                  fill={hoverIndex === i ? 'var(--color-success)' : 'var(--color-bg-tertiary)'}
                  stroke="var(--color-success)"
                  strokeWidth={1.5}
                  style={{ transition: 'r 150ms ease' }}
                />
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => {
            if (i % labelStep !== 0 && i !== data.length - 1) return null
            return (
              <text
                key={`x-${i}`}
                x={xPos(i)}
                y={H - 8}
                textAnchor="middle"
                fill="var(--color-text-tertiary)"
                fontSize="10"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {formatShortDate(d.date)}
              </text>
            )
          })}

          {/* Hover vertical line */}
          {hoverIndex !== null && (
            <line
              x1={xPos(hoverIndex)}
              y1={PAD_TOP}
              x2={xPos(hoverIndex)}
              y2={PAD_TOP + PLOT_H}
              stroke="rgba(30, 19, 16, 0.12)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
        </svg>

        {/* Tooltip */}
        {hoverIndex !== null && data[hoverIndex] && (
          <div style={{
            position: 'absolute',
            top: 8,
            left: `${((xPos(hoverIndex)) / W) * 100}%`,
            transform: 'translateX(-50%)',
            background: 'var(--color-bg-dark)',
            color: 'var(--color-text-inverse)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            <div style={{ fontWeight: 600 }}>{formatShortDate(data[hoverIndex].date)}</div>
            <div style={{ color: '#D4895C' }}>{data[hoverIndex].diagnostics} análisis</div>
            <div style={{ color: 'var(--color-success)' }}>{data[hoverIndex].conversions} conversiones</div>
          </div>
        )}
      </div>
    </Card>
  )
}
