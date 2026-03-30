'use client'

/**
 * HubFunnel — Mini horizontal funnel for the last 30 days.
 *
 * 4 bars: Análisis → Email capturado → Mapa visitado → Pagado
 * Terracotta with decreasing opacity.
 */

interface FunnelData {
  diagnostics: number
  email_captured: number
  map_visited: number
  paid: number
}

interface HubFunnelProps {
  data: FunnelData | null
  loading: boolean
}

const STAGES = [
  { key: 'diagnostics' as const, label: 'Análisis', opacity: 1 },
  { key: 'email_captured' as const, label: 'Email capturado', opacity: 0.75 },
  { key: 'map_visited' as const, label: 'Mapa visitado', opacity: 0.5 },
  { key: 'paid' as const, label: 'Pagado', opacity: 0.3 },
]

// ── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonBar({ width }: { width: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div
        style={{
          width: '110px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '80px',
            height: '12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-secondary)',
            animation: 'hubPulse 1.5s ease-in-out infinite',
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            width,
            height: '32px',
            borderRadius: '8px',
            background: 'var(--color-bg-secondary)',
            animation: 'hubPulse 1.5s ease-in-out infinite',
            animationDelay: '0.2s',
          }}
        />
      </div>
      <div
        style={{
          width: '60px',
          height: '14px',
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

export default function HubFunnel({ data, loading }: HubFunnelProps) {
  return (
    <section>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h4)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          Embudo 30 días
        </h2>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--color-surface-subtle)',
          }}
        />
      </div>

      {loading || !data ? (
        <div
          style={{
            background: 'var(--color-bg-tertiary)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <SkeletonBar width="100%" />
          <SkeletonBar width="80%" />
          <SkeletonBar width="55%" />
          <SkeletonBar width="20%" />
        </div>
      ) : (
        <div
          style={{
            background: 'var(--color-bg-tertiary)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          {STAGES.map((stage) => {
            const value = data[stage.key]
            const max = data.diagnostics || 1
            const pct = Math.round((value / max) * 100)
            const widthPct = Math.max((value / max) * 100, 4) // min 4% for visibility

            return (
              <div
                key={stage.key}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
              >
                {/* Label */}
                <span
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-secondary)',
                    width: '110px',
                    flexShrink: 0,
                  }}
                >
                  {stage.label}
                </span>

                {/* Bar */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <div
                    style={{
                      width: `${widthPct}%`,
                      height: '32px',
                      borderRadius: '8px',
                      background: `rgba(180, 90, 50, ${stage.opacity})`,
                      transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>

                {/* Value */}
                <span
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-body)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    minWidth: '60px',
                    textAlign: 'right',
                  }}
                >
                  {value}
                  <span
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: 'var(--color-text-tertiary)',
                      marginLeft: '4px',
                    }}
                  >
                    {stage.key !== 'diagnostics' ? `(${pct}%)` : ''}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
