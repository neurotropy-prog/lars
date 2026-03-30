'use client'

/**
 * AnalyticsFunnel — Embudo mejorado de 4 pasos con barras proporcionales.
 *
 * Análisis → Email capturado → Mapa visitado → Pagado
 * Barras terracotta con opacidad decreciente + animación stagger.
 */

import { useState, useEffect } from 'react'
import Counter from '@/components/ui/Counter'

interface FunnelData {
  diagnostics: number
  email_captured: number
  map_visited: number
  paid: number
}

interface AnalyticsFunnelProps {
  funnel: FunnelData
  counterKey: number
}

const STEPS = [
  { key: 'diagnostics' as const, label: 'Análisis' },
  { key: 'email_captured' as const, label: 'Email capturado' },
  { key: 'map_visited' as const, label: 'Mapa visitado' },
  { key: 'paid' as const, label: 'Pagaron' },
]

function getPrevValue(funnel: FunnelData, index: number): number {
  if (index === 0) return funnel.diagnostics
  const prevKey = STEPS[index - 1].key
  return funnel[prevKey]
}

export default function AnalyticsFunnel({ funnel, counterKey }: AnalyticsFunnelProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Reset animation on data change
  useEffect(() => {
    setMounted(false)
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [counterKey])

  const maxValue = funnel.diagnostics || 1

  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      {/* Section label */}
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-caption)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-4)',
      }}>
        Embudo de conversión
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        {STEPS.map((step, i) => {
          const value = funnel[step.key]
          const prevValue = getPrevValue(funnel, i)
          const pctVsPrev = i === 0 ? 100 : (prevValue > 0 ? Math.round((value / prevValue) * 100) : 0)
          const barPct = Math.max(6, (value / maxValue) * 100)
          const isLast = i === STEPS.length - 1
          const opacities = [1, 0.75, 0.5, 0.25]
          const barColor = isLast
            ? 'var(--color-success)'
            : `rgba(180, 90, 50, ${opacities[i]})`

          return (
            <div
              key={step.key}
              title={i > 0 ? `${value} de ${prevValue} (${pctVsPrev}%)` : `${value} análisis totales`}
              style={{
                position: 'relative',
                background: 'var(--color-bg-secondary)',
                border: '1px solid rgba(30, 19, 16, 0.06)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4) var(--space-5)',
                overflow: 'hidden',
              }}
            >
              {/* Background bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: mounted ? `${barPct}%` : '0%',
                background: barColor,
                opacity: 0.12,
                borderRadius: 'var(--radius-lg)',
                transition: `width 800ms cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${i * 300}ms`,
              }} />

              {/* Content */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
              }}>
                {/* Number */}
                <div style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-h2)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1,
                  minWidth: '52px',
                }}>
                  <Counter key={`funnel-${counterKey}-${i}`} to={value} duration={800} startDelay={i * 300} autoStart />
                </div>

                {/* Label */}
                <span style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-secondary)',
                  flex: 1,
                }}>
                  {step.label}
                </span>

                {/* Percentage vs previous */}
                {i > 0 && (
                  <span style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-caption)',
                    fontWeight: 600,
                    color: pctVsPrev >= 70 ? 'var(--color-success)' : pctVsPrev >= 40 ? 'var(--color-warning)' : 'var(--color-error)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: pctVsPrev >= 70
                      ? 'rgba(61, 154, 95, 0.1)'
                      : pctVsPrev >= 40
                        ? 'rgba(212, 160, 23, 0.1)'
                        : 'rgba(196, 64, 64, 0.1)',
                  }}>
                    {pctVsPrev}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Conversion total */}
      {funnel.diagnostics > 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-4)',
          marginTop: 'var(--space-3)',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(61, 154, 95, 0.06)',
          border: '1px solid rgba(61, 154, 95, 0.15)',
        }}>
          <span style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
          }}>
            Conversión total:{' '}
          </span>
          <span style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h3)',
            fontWeight: 700,
            color: 'var(--color-success)',
          }}>
            {Math.round((funnel.paid / funnel.diagnostics) * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
