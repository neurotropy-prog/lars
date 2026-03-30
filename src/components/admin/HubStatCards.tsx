'use client'

/**
 * HubStatCards — 4 stat cards for the Hub dashboard.
 *
 * 1. Análisis hoy (+ vs ayer)
 * 2. Próxima sesión (hora + email)
 * 3. Leads calientes (count + link)
 * 4. Conversión 7d (% + delta)
 */

import { useState } from 'react'
import Link from 'next/link'

interface Stats {
  diagnostics_today: number
  diagnostics_yesterday: number
  hot_leads: number
  conversion_7d: number
  conversion_7d_prev: number
  next_session: { time: string; email: string; profile: string; hash: string } | null
}

interface HubStatCardsProps {
  data: Stats | null
  loading: boolean
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--color-bg-tertiary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        minHeight: '130px',
      }}
    >
      <div
        style={{
          width: '100px',
          height: '12px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-secondary)',
          marginBottom: 'var(--space-4)',
          animation: 'hubPulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          width: '60px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-secondary)',
          marginBottom: 'var(--space-3)',
          animation: 'hubPulse 1.5s ease-in-out infinite',
          animationDelay: '0.2s',
        }}
      />
      <div
        style={{
          width: '120px',
          height: '13px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-secondary)',
          animation: 'hubPulse 1.5s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      />
    </div>
  )
}

// ── Comparison badge ────────────────────────────────────────────────────────

function CompBadge({ current, previous, suffix }: { current: number; previous: number; suffix?: string }) {
  if (previous === 0 && current === 0) return null
  const diff = current - previous
  const isPositive = diff > 0
  const isNegative = diff < 0

  let text: string
  if (previous === 0) {
    text = current > 0 ? `+${current}${suffix ?? ''}` : '—'
  } else {
    const pct = Math.round(((current - previous) / previous) * 100)
    text = `${pct >= 0 ? '+' : ''}${pct}% vs ayer`
  }

  return (
    <span
      style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: '13px',
        fontWeight: 500,
        color: isPositive
          ? 'var(--color-success)'
          : isNegative
            ? 'var(--color-error)'
            : 'var(--color-text-tertiary)',
      }}
    >
      {isPositive ? '↑' : isNegative ? '↓' : ''} {text}
    </span>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

export default function HubStatCards({ data, loading }: HubStatCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  if (loading || !data) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-5)',
        }}
      >
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  const cardBase: React.CSSProperties = {
    background: 'var(--color-bg-tertiary)',
    border: 'var(--border-subtle)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-6)',
    minHeight: '130px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }

  const overlineStyle: React.CSSProperties = {
    fontFamily: 'var(--font-host-grotesk)',
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--color-accent)',
    marginBottom: 'var(--space-3)',
  }

  const numberStyle: React.CSSProperties = {
    fontFamily: 'var(--font-host-grotesk)',
    fontSize: '36px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: 1.1,
    marginBottom: 'var(--space-2)',
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-5)',
      }}
    >
      {/* Card 1: Análisis hoy */}
      <div
        style={{
          ...cardBase,
          transition: 'all var(--transition-base)',
          boxShadow: hoveredCard === 0 ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
          transform: hoveredCard === 0 ? 'translateY(-1px)' : 'none',
        }}
        onMouseEnter={() => setHoveredCard(0)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div>
          <p style={overlineStyle}>Análisis hoy</p>
          <p style={numberStyle}>{data.diagnostics_today}</p>
        </div>
        <CompBadge current={data.diagnostics_today} previous={data.diagnostics_yesterday} />
      </div>

      {/* Card 2: Próxima sesión */}
      <div
        style={{
          ...cardBase,
          transition: 'all var(--transition-base)',
          boxShadow: hoveredCard === 1 ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
          transform: hoveredCard === 1 ? 'translateY(-1px)' : 'none',
        }}
        onMouseEnter={() => setHoveredCard(1)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div>
          <p style={overlineStyle}>Próxima sesión</p>
          {data.next_session ? (
            <>
              <p style={{ ...numberStyle, fontSize: '28px' }}>{data.next_session.time}</p>
              <p
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--space-1)',
                }}
              >
                {data.next_session.email}
                {data.next_session.profile !== '—' && (
                  <span style={{ color: 'var(--color-text-tertiary)' }}>
                    {' '}
                    · {data.next_session.profile}
                  </span>
                )}
              </p>
            </>
          ) : (
            <>
              <p
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-tertiary)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Sin sesiones próximas
              </p>
              <Link
                href="/admin/agenda"
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-accent)',
                  textDecoration: 'none',
                }}
              >
                Ir a Agenda →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Card 3: Leads calientes */}
      <div
        style={{
          ...cardBase,
          transition: 'all var(--transition-base)',
          boxShadow: hoveredCard === 2 ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
          transform: hoveredCard === 2 ? 'translateY(-1px)' : 'none',
        }}
        onMouseEnter={() => setHoveredCard(2)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div>
          <p style={overlineStyle}>Leads calientes</p>
          <p style={numberStyle}>{data.hot_leads}</p>
        </div>
        {data.hot_leads > 0 ? (
          <Link
            href="/admin/leads?filter=hot"
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-accent)',
              textDecoration: 'none',
            }}
          >
            Necesitan atención →
          </Link>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '13px',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Sin leads calientes
          </span>
        )}
      </div>

      {/* Card 4: Conversión 7d */}
      <div
        style={{
          ...cardBase,
          transition: 'all var(--transition-base)',
          boxShadow: hoveredCard === 3 ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
          transform: hoveredCard === 3 ? 'translateY(-1px)' : 'none',
        }}
        onMouseEnter={() => setHoveredCard(3)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div>
          <p style={overlineStyle}>Conversión 7 días</p>
          <p style={numberStyle}>{data.conversion_7d}%</p>
        </div>
        {data.conversion_7d_prev > 0 || data.conversion_7d > 0 ? (
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '13px',
              fontWeight: 500,
              color:
                data.conversion_7d > data.conversion_7d_prev
                  ? 'var(--color-success)'
                  : data.conversion_7d < data.conversion_7d_prev
                    ? 'var(--color-error)'
                    : 'var(--color-text-tertiary)',
            }}
          >
            {data.conversion_7d > data.conversion_7d_prev
              ? '↑'
              : data.conversion_7d < data.conversion_7d_prev
                ? '↓'
                : ''}
            {' '}
            {data.conversion_7d - data.conversion_7d_prev >= 0 ? '+' : ''}
            {data.conversion_7d - data.conversion_7d_prev}% vs semana anterior
          </span>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '13px',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Sin datos previos
          </span>
        )}
      </div>
    </div>
  )
}
