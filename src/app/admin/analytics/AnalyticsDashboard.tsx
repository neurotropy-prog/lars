'use client'

/**
 * AnalyticsDashboard — Panel visual del embudo L.A.R.S.
 *
 * Diseño con tokens de DESIGN.md. Mismo nivel que el gateway.
 * Counter animados, embudo degradado, tabla con semáforo.
 */

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Counter from '@/components/ui/Counter'

// ─── TIPOS ──────────────────────────────────────────────────────────────────

interface FunnelData {
  diagnostics: number
  p1_started: number
  email_captured: number
  map_visited: number
  paid: number
}

interface DashboardData {
  period: string
  total: number
  funnel: FunnelData
  metrics: {
    avg_score: number
    sessions_booked: number
    return_rate: number
    worst_dimension: { key: string; label: string; avg: number } | null
  }
  profiles: Record<string, number>
  dimensions: Record<string, number>
  recent: Array<{
    created_at: string
    hash: string
    score: number
    label: string
    profile: string
    email_captured: boolean
    map_visited: boolean
    paid: boolean
    session_booked: boolean
  }>
}

type Period = '1d' | '7d' | '30d' | 'all'

// ─── HELPERS ────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score <= 39) return 'var(--color-error)'
  if (score <= 59) return '#D4895C'
  if (score <= 79) return 'var(--color-warning)'
  return 'var(--color-success)'
}

function conversionColor(pct: number): string {
  if (pct >= 70) return 'var(--color-success)'
  if (pct >= 40) return 'var(--color-warning)'
  return 'var(--color-error)'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const PERIOD_LABELS: Record<Period, string> = {
  '1d': 'Hoy',
  '7d': '7 días',
  '30d': '30 días',
  all: 'Todo',
}

// ─── COMPONENTE ─────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [period, setPeriod] = useState<Period>('30d')
  const [loading, setLoading] = useState(true)
  const [counterKey, setCounterKey] = useState(0)

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?period=${p}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
        setCounterKey((k) => k + 1)
      }
    } catch (err) {
      console.error('[analytics] Error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(period)
  }, [period, fetchData])

  const handlePeriod = useCallback((p: Period) => {
    setPeriod(p)
  }, [])

  if (loading && !data) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-tertiary)' }}>
        Cargando datos...
      </div>
    )
  }

  if (!data) return null

  const { funnel, metrics, recent } = data
  const funnelSteps = [
    { label: 'Evaluaciones', value: funnel.diagnostics, pct: 100 },
    { label: 'Empezaron P1', value: funnel.p1_started, pct: funnel.diagnostics > 0 ? Math.round((funnel.p1_started / funnel.diagnostics) * 100) : 0 },
    { label: 'Dieron email', value: funnel.email_captured, pct: funnel.p1_started > 0 ? Math.round((funnel.email_captured / funnel.p1_started) * 100) : 0 },
    { label: 'Visitaron mapa', value: funnel.map_visited, pct: funnel.email_captured > 0 ? Math.round((funnel.map_visited / funnel.email_captured) * 100) : 0 },
    { label: 'Pagaron', value: funnel.paid, pct: funnel.map_visited > 0 ? Math.round((funnel.paid / funnel.map_visited) * 100) : 0 },
  ]

  return (
    <div>
      {/* ── Header + filtros ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-8)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Panel L.A.R.S.
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            marginTop: 'var(--space-1)',
          }}>
            Embudo completo en tiempo real
          </p>
        </div>

        {/* Filtros temporales */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriod(p)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-pill)',
                border: period === p ? '1px solid var(--color-accent)' : 'var(--border-subtle)',
                background: period === p ? 'var(--color-accent-subtle)' : 'transparent',
                color: period === p ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* ── EMBUDO VISUAL — tarjetas horizontales apiladas ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-6)',
      }}>
        {funnelSteps.map((step, i) => {
          const barPct = funnel.diagnostics > 0
            ? Math.max(8, (step.value / funnel.diagnostics) * 100)
            : 100
          const isFirst = i === 0
          const isLast = i === funnelSteps.length - 1
          const barColor = isLast
            ? 'var(--color-success)'
            : `rgba(180,90,50,${1 - i * 0.18})`

          return (
            <div
              key={step.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-4) var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-secondary)',
                border: 'var(--border-subtle)',
              }}
            >
              {/* Número */}
              <div style={{
                fontFamily: 'var(--font-lora)',
                fontSize: 'var(--text-h2)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1,
                minWidth: '56px',
              }}>
                <Counter key={`${counterKey}-${i}`} to={step.value} duration={800} startDelay={i * 100} />
              </div>

              {/* Label + barra */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-2)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    {step.label}
                  </span>
                  {!isFirst && (
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 'var(--text-caption)',
                      fontWeight: 600,
                      color: conversionColor(step.pct),
                    }}>
                      {step.pct}%
                    </span>
                  )}
                </div>
                <div style={{
                  height: '6px',
                  borderRadius: '3px',
                  background: 'rgba(30,19,16,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${barPct}%`,
                    borderRadius: '3px',
                    background: barColor,
                    transition: 'width 800ms ease',
                  }} />
                </div>
              </div>
            </div>
          )
        })}

        {/* Conversión total */}
        {funnel.diagnostics > 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(61,154,95,0.06)',
            border: '1px solid rgba(61,154,95,0.15)',
          }}>
            <span style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              Conversión total:{' '}
            </span>
            <span style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'var(--text-h3)',
              fontWeight: 700,
              color: 'var(--color-success)',
            }}>
              {Math.round((funnel.paid / funnel.diagnostics) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* ── MÉTRICAS CLAVE (4 cards) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}>
        {/* Score medio */}
        <Card>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-3)',
          }}>
            Score medio
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'var(--text-h1)',
              fontWeight: 700,
              color: scoreColor(metrics.avg_score),
              lineHeight: 1,
            }}>
              <Counter key={`score-${counterKey}`} to={metrics.avg_score} duration={1000} />
            </span>
            <span style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
            }}>
              /100
            </span>
          </div>
        </Card>

        {/* Sesiones agendadas */}
        <Card>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-3)',
          }}>
            Sesiones agendadas
          </p>
          <span style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h1)',
            fontWeight: 700,
            color: 'var(--color-accent)',
            lineHeight: 1,
          }}>
            <Counter key={`sessions-${counterKey}`} to={metrics.sessions_booked} duration={800} />
          </span>
        </Card>

        {/* Tasa de retorno */}
        <Card>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-3)',
          }}>
            Vuelven al mapa
          </p>
          <span style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h1)',
            fontWeight: 700,
            color: metrics.return_rate > 30 ? 'var(--color-success)' : 'var(--color-warning)',
            lineHeight: 1,
          }}>
            <Counter key={`return-${counterKey}`} to={metrics.return_rate} duration={800} suffix="%" />
          </span>
        </Card>

        {/* Dimensión peor */}
        <Card>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-3)',
          }}>
            Peor dimensión
          </p>
          {metrics.worst_dimension ? (
            <>
              <span style={{
                fontFamily: 'var(--font-lora)',
                fontSize: 'var(--text-h1)',
                fontWeight: 700,
                color: scoreColor(metrics.worst_dimension.avg),
                lineHeight: 1,
              }}>
                <Counter key={`worst-${counterKey}`} to={metrics.worst_dimension.avg} duration={800} />
              </span>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-2)',
              }}>
                {metrics.worst_dimension.label}
              </p>
            </>
          ) : (
            <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>
          )}
        </Card>
      </div>

      {/* ── ÚLTIMAS EVALUACIONES ── */}
      <Card style={{ padding: 'var(--space-6)', overflow: 'hidden' }}>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-caption)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-4)',
        }}>
          Últimas evaluaciones
        </p>

        {recent.length === 0 ? (
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
            padding: 'var(--space-8)',
          }}>
            No hay evaluaciones en este periodo.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
            }}>
              <thead>
                <tr>
                  {['Fecha', 'Score', 'Perfil', 'Email', 'Mapa', 'Pagó', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: 'var(--space-3) var(--space-3)',
                        color: 'var(--color-text-tertiary)',
                        fontSize: '11px',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        borderBottom: 'var(--border-subtle)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={i} style={{ borderBottom: 'var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatDate(r.created_at)}
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 600,
                        color: scoreColor(r.score),
                      }}>
                        {r.score}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {r.profile}
                    </td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                      {r.email_captured ? '✓' : '—'}
                    </td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                      {r.map_visited ? '✓' : '—'}
                    </td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                      <span style={{ color: r.paid ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
                        {r.paid ? '✓ 97€' : '—'}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <a
                        href={`/mapa/${r.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--color-accent)',
                          textDecoration: 'none',
                          fontSize: '11px',
                        }}
                      >
                        Ver mapa
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
