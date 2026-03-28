'use client'

/**
 * AnalyticsAmplify — Sección de métricas AMPLIFY en Analytics.
 *
 * 4 métricas en fila: Invitaciones | Completadas (%) | Comparaciones | K-Factor.
 * Con color coding del K-factor.
 */

interface AmplifyStats {
  invites_sent: number
  invites_completed: number
  completion_rate: number
  comparisons_accepted: number
  conversions_from_amplify: number
  k_factor: number
}

interface Props {
  data: AmplifyStats | null
  loading: boolean
}

function getKColor(k: number): string {
  if (k > 0.5) return 'var(--color-success)'
  if (k >= 0.2) return 'var(--color-warning)'
  return 'var(--color-error)'
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div
      style={{
        background: 'var(--color-bg-tertiary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
      }}
    >
      <div style={{
        width: '200px',
        height: '12px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-bg-secondary)',
        marginBottom: 'var(--space-5)',
        animation: 'hubPulse 1.5s ease-in-out infinite',
      }} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div style={{ width: '40px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-secondary)', marginBottom: 8, animation: 'hubPulse 1.5s ease-in-out infinite', animationDelay: `${0.1 * i}s` }} />
            <div style={{ width: '80px', height: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-secondary)', animation: 'hubPulse 1.5s ease-in-out infinite', animationDelay: `${0.15 * i}s` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

export default function AnalyticsAmplify({ data, loading }: Props) {
  if (loading || !data) return <Skeleton />

  const metrics = [
    { label: 'Invitaciones', value: data.invites_sent, color: 'var(--color-text-primary)' },
    { label: 'Completadas', value: `${data.invites_completed} (${data.completion_rate}%)`, color: 'var(--color-text-primary)' },
    { label: 'Comparaciones', value: data.comparisons_accepted, color: 'var(--color-text-primary)' },
    { label: 'K-Factor', value: data.k_factor.toFixed(2), color: getKColor(data.k_factor) },
  ]

  return (
    <div
      style={{
        background: 'var(--color-bg-tertiary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
      }}
    >
      {/* Header */}
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-caption)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-accent)',
          marginBottom: 'var(--space-5)',
        }}
      >
        AMPLIFY — Crecimiento orgánico
      </p>

      {/* Metrics grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {metrics.map((m) => (
          <div key={m.label}>
            <p
              style={{
                fontFamily: 'var(--font-lora)',
                fontSize: 'var(--text-h3)',
                fontWeight: 700,
                color: m.color,
                lineHeight: 1.1,
                marginBottom: 'var(--space-1)',
              }}
            >
              {m.value}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Conversion line */}
      {data.conversions_from_amplify > 0 && (
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-success)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {data.conversions_from_amplify} {data.conversions_from_amplify === 1 ? 'conversión' : 'conversiones'} desde AMPLIFY ({data.conversions_from_amplify * 97}€)
        </p>
      )}

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '12px',
          color: 'var(--color-text-tertiary)',
        }}
      >
        Coste de adquisición AMPLIFY: 0€/lead
      </p>
    </div>
  )
}
