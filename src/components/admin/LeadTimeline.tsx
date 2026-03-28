'use client'

/**
 * LeadTimeline — Chronological event timeline for a lead.
 * Shows all events: gateway, emails, opens, unlocks, actions, bookings.
 * Most recent first.
 */

interface TimelineEvent {
  type: string
  at: string
  details?: Record<string, unknown>
}

interface LeadTimelineProps {
  events: TimelineEvent[]
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(isoStr: string): string {
  const date = new Date(isoStr)
  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  if (date >= todayStart) {
    return 'Hoy ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }
  if (date >= yesterdayStart) {
    return 'Ayer'
  }
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const EVENT_CONFIG: Record<string, { icon: string; color: string; label: (d?: Record<string, unknown>) => string }> = {
  gateway_completed: {
    icon: '📋',
    color: 'var(--color-accent)',
    label: (d) => `Completó gateway${d?.score ? ` (score: ${d.score})` : ''}`,
  },
  email_sent: {
    icon: '📧',
    color: '#4A8DB7',
    label: (d) => `Email ${String(d?.key ?? '').toUpperCase()} enviado`,
  },
  email_opened: {
    icon: '✅',
    color: 'var(--color-success)',
    label: (d) => `Email ${String(d?.key ?? '').toUpperCase()} abierto`,
  },
  evolution_unlock: {
    icon: '🧬',
    color: '#D97706',
    label: (d) => {
      const map: Record<string, string> = {
        archetype: 'Arquetipo desbloqueado',
        insight_d7: 'Insight colectivo desbloqueado',
        subdimensions: 'Subdimensiones desbloqueadas',
        book_excerpt: 'Extracto del libro desbloqueado',
      }
      return map[String(d?.content)] ?? 'Contenido desbloqueado'
    },
  },
  personal_action: {
    icon: '🎯',
    color: 'var(--color-accent)',
    label: (d) => {
      const typeMap: Record<string, string> = {
        personal_note: 'Nota personal enviada',
        video: 'Video personalizado enviado',
        early_unlock: 'Desbloqueo anticipado',
        express_session: 'Sesión express ofrecida',
        manual_email: 'Email manual enviado',
      }
      return typeMap[String(d?.action_type)] ?? 'Acción de Javi'
    },
  },
  session_booked: {
    icon: '📅',
    color: 'var(--color-success)',
    label: () => 'Sesión agendada',
  },
  session_completed: {
    icon: '✔️',
    color: 'var(--color-success)',
    label: () => 'Sesión completada',
  },
  amplify_invite_sent: {
    icon: '🔗',
    color: '#8B5CF6',
    label: () => 'Invitación AMPLIFY enviada',
  },
  amplify_comparison_ready: {
    icon: '🤝',
    color: '#8B5CF6',
    label: () => 'Comparación AMPLIFY activa',
  },
  amplify_comparison_email: {
    icon: '📨',
    color: '#8B5CF6',
    label: (d) => `Email comparación enviado${d?.role === 'inviter' ? ' (como invitador)' : ' (como invitado)'}`,
  },
}

// ── Component ──────────────────────────────────────────────────────────────

export default function LeadTimeline({ events }: LeadTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center',
          padding: 'var(--space-4) 0',
          margin: 0,
        }}
      >
        Sin eventos registrados.
      </p>
    )
  }

  // Most recent first
  const sorted = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  return (
    <div style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
      {sorted.map((event, i) => {
        const config = EVENT_CONFIG[event.type] ?? {
          icon: '•',
          color: 'var(--color-text-tertiary)',
          label: () => event.type,
        }
        const isLast = i === sorted.length - 1

        return (
          <div
            key={`${event.type}-${event.at}-${i}`}
            style={{
              display: 'flex',
              gap: 12,
              position: 'relative',
              paddingBottom: isLast ? 0 : 16,
            }}
          >
            {/* Dot + line */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 24,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14, lineHeight: '20px' }}>{config.icon}</span>
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    width: 1,
                    background: 'rgba(30, 19, 16, 0.08)',
                    marginTop: 4,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: '20px',
                }}
              >
                {config.label(event.details)}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '11px',
                  color: 'var(--color-text-tertiary)',
                  margin: '2px 0 0',
                }}
              >
                {formatDate(event.at)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
