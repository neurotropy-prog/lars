'use client'

/**
 * AnalyticsDashboard — Panel completo de analytics L.A.R.S.
 *
 * Orquesta todos los componentes de Sprint 6:
 * Embudo, Tendencias, Perfiles, Dimensiones, Geo, Métricas, Tabla reciente.
 */

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Counter from '@/components/ui/Counter'
import AnalyticsFunnel from '@/components/admin/AnalyticsFunnel'
import AnalyticsTrends from '@/components/admin/AnalyticsTrends'
import AnalyticsProfiles from '@/components/admin/AnalyticsProfiles'
import AnalyticsDimensions from '@/components/admin/AnalyticsDimensions'
import AnalyticsGeo from '@/components/admin/AnalyticsGeo'

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
  daily_counts: Array<{ date: string; diagnostics: number; conversions: number }>
  worst_dimension_distribution: Record<string, number>
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

type Period = '7d' | '30d' | '90d' | 'all'

// ─── HELPERS ────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score <= 39) return 'var(--color-error)'
  if (score <= 59) return '#D4895C'
  if (score <= 79) return 'var(--color-warning)'
  return 'var(--color-success)'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 días',
  '30d': '30 días',
  '90d': '90 días',
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

  return (
    <div>
      {/* ── Header + Period Selector ── */}
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
            Analytics
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            marginTop: 'var(--space-1)',
          }}>
            Visión completa del embudo L.A.R.S.
          </p>
        </div>

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

      {/* ── Embudo ── */}
      <AnalyticsFunnel funnel={funnel} counterKey={counterKey} />

      {/* ── Métricas Clave (4 cards) ── */}
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
              <Counter key={`score-${counterKey}`} to={metrics.avg_score} duration={1000} autoStart />
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
            <Counter key={`sessions-${counterKey}`} to={metrics.sessions_booked} duration={800} autoStart />
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
            <Counter key={`return-${counterKey}`} to={metrics.return_rate} duration={800} suffix="%" autoStart />
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
                <Counter key={`worst-${counterKey}`} to={metrics.worst_dimension.avg} duration={800} autoStart />
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

      {/* ── Tendencias ── */}
      <AnalyticsTrends dailyCounts={data.daily_counts} />

      {/* ── Perfiles + Dimensiones (2 columnas) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}>
        <AnalyticsProfiles profiles={data.profiles} total={data.total} />
        <AnalyticsDimensions
          dimensions={data.dimensions}
          worstDimensionDist={data.worst_dimension_distribution}
          total={data.total}
        />
      </div>

      {/* ── Geografía ── */}
      <AnalyticsGeo period={period} />

      {/* ── Últimas Evaluaciones ── */}
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
