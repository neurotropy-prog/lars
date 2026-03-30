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
import AnalyticsAmplify from '@/components/admin/AnalyticsAmplify'

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

interface AmplifyStatsData {
  invites_sent: number
  invites_completed: number
  completion_rate: number
  comparisons_accepted: number
  conversions_from_amplify: number
  k_factor: number
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [amplifyStats, setAmplifyStats] = useState<AmplifyStatsData | null>(null)
  const [period, setPeriod] = useState<Period>('30d')
  const [loading, setLoading] = useState(true)
  const [counterKey, setCounterKey] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true)
    try {
      const [analyticsRes, amplifyRes] = await Promise.all([
        fetch(`/api/admin/analytics?period=${p}`),
        fetch('/api/admin/amplify-stats'),
      ])
      if (analyticsRes.ok) {
        const json = await analyticsRes.json()
        setData(json)
        setCounterKey((k) => k + 1)
      }
      if (amplifyRes.ok) {
        const ampJson = await amplifyRes.json()
        setAmplifyStats(ampJson)
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
    const skel = (w: string, h: string, delay = '0s') => ({
      width: w,
      height: h,
      borderRadius: 'var(--radius-md)',
      background: 'rgba(30,19,16,0.06)',
      animation: 'hubPulse 1.5s ease-in-out infinite',
      animationDelay: delay,
    })
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={skel('100%', '88px', `${i * 0.1}s`)} />
          ))}
        </div>
        <div style={skel('100%', '200px', '0.3s')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
          <div style={skel('100%', '180px', '0.4s')} />
          <div style={skel('100%', '180px', '0.5s')} />
        </div>
      </div>
    )
  }

  if (!data) return (
    <p
      style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-body-sm)',
        color: 'var(--color-text-tertiary)',
        padding: 'var(--space-8)',
        background: 'rgba(30,19,16,0.02)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        lineHeight: 'var(--lh-body)',
      }}
    >
      Aún no hay datos suficientes. Los gráficos aparecerán cuando haya al menos 5 análisis completados.
    </p>
  )

  const { funnel, metrics, recent } = data

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 200ms ease-out' }}>
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
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Analytics
          </h1>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
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
                fontFamily: 'var(--font-host-grotesk)',
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
            fontFamily: 'var(--font-host-grotesk)',
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
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-h1)',
              fontWeight: 700,
              color: scoreColor(metrics.avg_score),
              lineHeight: 1,
            }}>
              <Counter key={`score-${counterKey}`} to={metrics.avg_score} duration={1000} autoStart />
            </span>
            <span style={{
              fontFamily: 'var(--font-host-grotesk)',
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
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-3)',
          }}>
            Sesiones agendadas
          </p>
          <span style={{
            fontFamily: 'var(--font-host-grotesk)',
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
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-3)',
          }}>
            Vuelven al mapa
          </p>
          <span style={{
            fontFamily: 'var(--font-host-grotesk)',
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
            fontFamily: 'var(--font-host-grotesk)',
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
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-h1)',
                fontWeight: 700,
                color: scoreColor(metrics.worst_dimension.avg),
                lineHeight: 1,
              }}>
                <Counter key={`worst-${counterKey}`} to={metrics.worst_dimension.avg} duration={800} autoStart />
              </span>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
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

      {/* ── AMPLIFY ── */}
      <AnalyticsAmplify
        data={amplifyStats}
        loading={loading}
      />

      {/* ── Últimas Evaluaciones ── */}
      <Card style={{ padding: 'var(--space-6)', overflow: 'hidden' }}>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-caption)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-4)',
        }}>
          Últimos análisis
        </p>

        {recent.length === 0 ? (
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
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
              fontFamily: 'var(--font-host-grotesk)',
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
                        fontFamily: 'var(--font-host-grotesk)',
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
