'use client'

/**
 * HubActivity — Recent activity feed for the Hub.
 *
 * Timeline of the last 15 actions: diagnostics, emails, payments, bookings.
 * Relative timestamps: hour if today, "Ayer" if yesterday, "Hace X días".
 */

interface ActivityItem {
  type: 'diagnostic' | 'email' | 'payment' | 'booking'
  at: string
  description: string
  icon: string
}

interface HubActivityProps {
  items: ActivityItem[] | null
  loading: boolean
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function relativeTime(isoStr: string): string {
  const date = new Date(isoStr)
  const now = new Date()

  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  if (date >= todayStart) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  if (date >= yesterdayStart) {
    return 'Ayer'
  }

  const diffMs = now.getTime() - date.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (days <= 7) {
    return `Hace ${days} días`
  }

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonItem() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) 0' }}>
      <div
        style={{
          width: '52px',
          height: '12px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-secondary)',
          flexShrink: 0,
          animation: 'hubPulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'var(--color-bg-secondary)',
          flexShrink: 0,
          animation: 'hubPulse 1.5s ease-in-out infinite',
          animationDelay: '0.15s',
        }}
      />
      <div
        style={{
          width: `${60 + Math.random() * 30}%`,
          height: '14px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-secondary)',
          animation: 'hubPulse 1.5s ease-in-out infinite',
          animationDelay: '0.3s',
        }}
      />
    </div>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

export default function HubActivity({ items, loading }: HubActivityProps) {
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
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h4)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          Actividad reciente
        </h2>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--color-surface-subtle)',
          }}
        />
      </div>

      <div
        style={{
          background: 'var(--color-bg-tertiary)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5) var(--space-6)',
        }}
      >
        {loading || !items ? (
          <div>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
              textAlign: 'center',
              padding: 'var(--space-6) 0',
              margin: 0,
            }}
          >
            No hay actividad reciente.
          </p>
        ) : (
          <div>
            {items.map((item, i) => (
              <div
                key={`${item.at}-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-3) 0',
                  borderBottom:
                    i < items.length - 1 ? '1px solid rgba(30, 19, 16, 0.04)' : 'none',
                }}
              >
                {/* Timestamp */}
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-tertiary)',
                    width: '52px',
                    flexShrink: 0,
                    paddingTop: '2px',
                  }}
                >
                  {relativeTime(item.at)}
                </span>

                {/* Icon */}
                <span
                  style={{
                    fontSize: '16px',
                    lineHeight: 1.3,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>

                {/* Description */}
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
