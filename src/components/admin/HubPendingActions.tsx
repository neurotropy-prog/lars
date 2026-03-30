'use client'

/**
 * HubPendingActions — "Acciones pendientes" section for the Hub.
 *
 * Shows leads that have a suggested action but haven't been acted on recently.
 * Gives Javi visibility without having to enter each lead individually.
 */

import Link from 'next/link'

interface PendingAction {
  hash: string
  email: string
  profile: string
  profileColor: string
  heat: string
  actionType: string
  actionReason: string
  urgency: string
  hasRecentAction?: boolean
}

interface HubPendingActionsProps {
  actions: PendingAction[] | null
  loading: boolean
}

const ACTION_LABELS: Record<string, { label: string; icon: string }> = {
  personal_note: { label: 'Nota personal', icon: '✉️' },
  video: { label: 'Video personalizado', icon: '🎬' },
  early_unlock: { label: 'Desbloqueo anticipado', icon: '🔓' },
  express_session: { label: 'Sesión express', icon: '📞' },
  manual_email: { label: 'Email manual', icon: '📧' },
}

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: 'Alta', color: 'var(--color-error)', bg: 'rgba(196, 64, 64, 0.08)' },
  medium: { label: 'Media', color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)' },
  low: { label: 'Baja', color: 'var(--color-text-tertiary)', bg: 'rgba(138, 126, 117, 0.08)' },
}

function SkeletonAction() {
  const base = {
    background: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    animation: 'hubPulse 1.5s ease-in-out infinite',
  }
  return (
    <div
      style={{
        background: 'var(--color-bg-tertiary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ ...base, width: 32, height: 32, borderRadius: '50%' }} />
        <div>
          <div style={{ ...base, width: 120, height: 13, marginBottom: 6 }} />
          <div style={{ ...base, width: 80, height: 11 }} />
        </div>
      </div>
      <div style={{ ...base, width: 60, height: 22 }} />
    </div>
  )
}

export default function HubPendingActions({ actions, loading }: HubPendingActionsProps) {
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
            whiteSpace: 'nowrap',
          }}
        >
          Acciones pendientes
        </h2>
        {!loading && actions && actions.filter(a => !a.hasRecentAction).length > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 22,
              height: 22,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-accent)',
              color: '#fff',
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '11px',
              fontWeight: 700,
              padding: '0 6px',
            }}
          >
            {actions.filter(a => !a.hasRecentAction).length}
          </span>
        )}
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--color-surface-subtle)',
          }}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <SkeletonAction />
          <SkeletonAction />
          <SkeletonAction />
        </div>
      )}

      {/* Empty */}
      {!loading && actions && actions.length === 0 && (
        <div
          style={{
            background: 'var(--color-bg-tertiary)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
              margin: 0,
            }}
          >
            No hay acciones pendientes. Todos los leads están al día.
          </p>
        </div>
      )}

      {/* Actions list */}
      {!loading && actions && actions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {actions.map((action) => {
            const actionInfo = ACTION_LABELS[action.actionType] ?? { label: action.actionType, icon: '📋' }
            const urgency = URGENCY_CONFIG[action.urgency] ?? URGENCY_CONFIG.low
            const dimmed = action.hasRecentAction

            return (
              <Link
                key={action.hash}
                href={`/admin/leads?detail=${action.hash}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: 'var(--color-bg-tertiary)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `3px solid ${dimmed ? 'var(--color-text-tertiary)' : action.profileColor}`,
                    padding: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    transition: 'all 150ms ease',
                    cursor: 'pointer',
                    opacity: dimmed ? 0.55 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-bg-elevated)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-bg-tertiary)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: urgency.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}
                  >
                    {actionInfo.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: 'var(--color-text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {action.email}
                      </span>
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-pill)',
                          background: `${action.profileColor}14`,
                          color: action.profileColor,
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: '10px',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {action.profile}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: '12px',
                        color: 'var(--color-text-tertiary)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {action.actionReason}
                    </p>
                  </div>

                  {/* Action badge */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    {dimmed ? (
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-pill)',
                          background: 'rgba(61, 154, 95, 0.08)',
                          color: 'var(--color-success)',
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: '11px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Atendido
                      </span>
                    ) : (
                      <>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            background: urgency.bg,
                            color: urgency.color,
                            fontFamily: 'var(--font-host-grotesk)',
                            fontSize: '11px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {actionInfo.label}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-host-grotesk)',
                            fontSize: '10px',
                            color: urgency.color,
                            fontWeight: 500,
                          }}
                        >
                          {urgency.label}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
