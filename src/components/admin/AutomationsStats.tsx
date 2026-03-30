'use client'

/**
 * AutomationsStats — 3 stat cards for the Automations dashboard.
 *
 * 1. Total enviados (count)
 * 2. Tasa de apertura (% with color coding)
 * 3. Bajas (count + rate)
 */

interface GlobalStats {
  total_sent: number
  avg_open_rate: number
  unsubscribes: number
  unsubscribe_rate: number
}

interface AutomationsStatsProps {
  data: GlobalStats | null
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

// ── Component ───────────────────────────────────────────────────────────────

export default function AutomationsStats({ data, loading }: AutomationsStatsProps) {
  if (loading || !data) {
    return (
      <div className="automations-stats-grid">
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

  const rateColor =
    data.avg_open_rate >= 60
      ? 'var(--color-success)'
      : data.avg_open_rate >= 40
        ? 'var(--color-warning)'
        : 'var(--color-error)'

  return (
    <div className="automations-stats-grid">
      {/* Card 1: Total enviados */}
      <div style={cardBase}>
        <div>
          <p style={overlineStyle}>Total enviados</p>
          <p style={numberStyle}>{data.total_sent}</p>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            color: 'var(--color-text-tertiary)',
          }}
        >
          emails automáticos
        </span>
      </div>

      {/* Card 2: Tasa de apertura */}
      <div style={cardBase}>
        <div>
          <p style={overlineStyle}>Tasa de apertura</p>
          <p style={{ ...numberStyle, color: rateColor }}>{data.avg_open_rate}%</p>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            color: 'var(--color-text-tertiary)',
          }}
        >
          media global
        </span>
      </div>

      {/* Card 3: Bajas */}
      <div style={cardBase}>
        <div>
          <p style={overlineStyle}>Bajas</p>
          <p style={numberStyle}>{data.unsubscribes}</p>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {data.unsubscribe_rate}% del total
        </span>
      </div>
    </div>
  )
}
