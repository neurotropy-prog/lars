'use client'

/**
 * LeadDetailPanel — Slide-in panel showing full lead detail.
 *
 * This is the heart of the LAM. It doesn't show raw data —
 * it tells Javi a NARRATIVE about what's happening with this person
 * and what he can do about it.
 *
 * Uses profile-intelligence.ts behaviors to generate the narrative.
 */

import { useEffect, useCallback, useState } from 'react'
import { IconX, IconExternalLink, IconArrowLeft } from './AdminIcons'
import HeatIndicator from './HeatIndicator'
import LeadDimensions from './LeadDimensions'
import LeadTimeline from './LeadTimeline'
import LeadEmailStatus from './LeadEmailStatus'
import type { HeatLevel, ProfileIntelligence } from '@/lib/profile-intelligence'

// ── Types ──────────────────────────────────────────────────────────────────

interface TimelineEvent {
  type: string
  at: string
  details?: Record<string, unknown>
}

interface EmailStatusItem {
  key: string
  name: string
  subject: string
  day: number
  status: 'opened' | 'sent' | 'not_sent' | 'suppressed'
  opened_at: string | null
}

interface PersonalActionItem {
  type: string
  content: string
  created_at: string
  notify_lead?: boolean
}

export interface LeadDetail {
  hash: string
  email: string | null
  created_at: string
  days_since: number
  scores: { global?: number; label?: string; d1?: number; d2?: number; d3?: number; d4?: number; d5?: number } | null
  profile: { ego_primary?: string; shame_level?: string } | null
  funnel: {
    email_captured: boolean
    map_visits: number
    last_visit: string | null
    emails_opened: string[]
    session_booked: boolean
    converted_week1: boolean
    unsubscribed: boolean
  }
  meta: { country?: string; city?: string; region?: string; source?: string } | null
  heat: { score: number; level: HeatLevel }
  suggested_action: { type: string; reason: string; template?: string; urgency: string } | null
  profile_intelligence: ProfileIntelligence | null
  timeline: TimelineEvent[]
  email_status: EmailStatusItem[]
  personal_actions: PersonalActionItem[]
}

interface LeadDetailPanelProps {
  hash: string | null
  data: LeadDetail | null
  loading: boolean
  onClose: () => void
}

// ── Constants ──────────────────────────────────────────────────────────────

const PROFILE_COLORS: Record<string, string> = {
  'Productivo Colapsado': '#B45A32',
  'Fuerte Invisible': '#4A6FA5',
  'Cuidador Exhausto': '#7B8F6A',
  'Controlador Paralizado': '#8B7355',
}

const ACTION_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
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

function scoreColor(score: number): string {
  if (score < 40) return 'var(--color-error)'
  if (score <= 60) return '#D97706'
  return '#059669'
}

// ── Behavior determination ─────────────────────────────────────────────────

type BehaviorKey = keyof ProfileIntelligence['behaviors']

function determineBehaviorKey(data: LeadDetail): BehaviorKey {
  if (data.funnel.unsubscribed) return 'unsubscribed'
  if (data.funnel.session_booked) return 'booked_session'

  // Check if opened the session email (d10)
  const openedD10 = data.email_status?.some(
    (e) => e.key === 'd10' && e.status === 'opened'
  )
  if (openedD10 && !data.funnel.session_booked) return 'opened_session_email'

  if (data.funnel.map_visits >= 3 && !data.funnel.converted_week1) return 'visited_but_not_paid'

  if (data.days_since >= 14 && data.funnel.map_visits >= 1) return 'long_time_no_action'

  // Check if any email was opened
  const anyEmailOpened = data.email_status?.some((e) => e.status === 'opened')
  if (!anyEmailOpened && data.days_since >= 5) return 'no_email_opens'

  if (data.funnel.map_visits >= 1) return 'multiple_map_visits'

  return 'multiple_map_visits' // fallback
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function PanelSkeleton() {
  const base = {
    background: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    animation: 'hubPulse 1.5s ease-in-out infinite',
  }
  return (
    <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ ...base, width: 80, height: 24 }} />
        <div style={{ ...base, width: '70%', height: 18 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ ...base, width: 50, height: 22, animationDelay: '0.15s' }} />
          <div style={{ ...base, width: 60, height: 22, animationDelay: '0.2s' }} />
        </div>
      </div>
      {/* Narrative skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ ...base, width: '50%', height: 14, animationDelay: '0.1s' }} />
        <div style={{ ...base, width: '100%', height: 60, animationDelay: '0.2s' }} />
      </div>
      {/* Bars skeleton */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ ...base, width: 60, height: 12, animationDelay: `${0.1 * i}s` }} />
          <div style={{ ...base, flex: 1, height: 6, animationDelay: `${0.15 * i}s` }} />
        </div>
      ))}
      {/* Timeline skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', gap: 10 }}>
            <div style={{ ...base, width: 20, height: 20, borderRadius: '50%', animationDelay: `${0.1 * i}s` }} />
            <div style={{ ...base, width: `${60 + i * 8}%`, height: 14, animationDelay: `${0.15 * i}s` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Section header helper ──────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </h3>
      <div style={{ flex: 1, height: 1, background: 'rgba(30, 19, 16, 0.06)' }} />
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────

export default function LeadDetailPanel({ hash, data, loading, onClose }: LeadDetailPanelProps) {
  const [isMobile, setIsMobile] = useState(false)
  const isOpen = hash !== null

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when panel is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen, isMobile])

  const profileName = data?.profile?.ego_primary ?? ''
  const profileColor = PROFILE_COLORS[profileName] ?? 'var(--color-text-tertiary)'

  return (
    <>
      {/* Overlay */}
      {isOpen && !isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.25)',
            zIndex: 99,
            transition: 'opacity 200ms ease',
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: isMobile ? '100vw' : '420px',
          maxWidth: '100vw',
          background: 'var(--color-bg-primary)',
          borderLeft: isMobile ? 'none' : '1px solid rgba(30, 19, 16, 0.08)',
          zIndex: 100,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {loading || !data ? (
          <>
            {/* Close button even during loading */}
            <div style={{ padding: 'var(--space-4) var(--space-6) 0', display: 'flex', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-tertiary)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  padding: 4,
                }}
              >
                {isMobile ? <><IconArrowLeft size={16} /> Volver</> : <IconX size={18} />}
              </button>
            </div>
            <PanelSkeleton />
          </>
        ) : (
          <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-8)' }}>
            {/* ── Header ── */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              {/* Close + map link */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <button
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-tertiary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '13px',
                    padding: 4,
                  }}
                >
                  {isMobile ? <><IconArrowLeft size={16} /> Volver a leads</> : <IconX size={18} />}
                </button>
                <a
                  href={`/mapa/${data.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                  }}
                >
                  Ver mapa <IconExternalLink size={13} />
                </a>
              </div>

              {/* Heat + profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <HeatIndicator level={data.heat.level} score={data.heat.score} size="md" />
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    background: `${profileColor}14`,
                    color: profileColor,
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {profileName || '—'}
                </span>
              </div>

              {/* Email */}
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 6px',
                  wordBreak: 'break-all',
                }}
              >
                {data.email ?? 'Sin email'}
              </p>

              {/* Score + meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: scoreColor(data.scores?.global ?? 0),
                  }}
                >
                  Score: {data.scores?.global ?? '—'}/100
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '13px',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  Día {data.days_since}
                </span>
                {data.meta?.city && (
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '13px',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    📍 {data.meta.city}{data.meta.country ? `, ${data.meta.country}` : ''}
                  </span>
                )}
              </div>
            </div>

            {/* ── Lo que está pasando ── */}
            {data.profile_intelligence && (
              <section style={{ marginBottom: 'var(--space-6)' }}>
                <SectionHeader title="Lo que está pasando" />
                <div
                  style={{
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-5)',
                    borderLeft: `3px solid ${profileColor}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '14px',
                      lineHeight: 1.65,
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                    }}
                  >
                    {data.profile_intelligence.behaviors[determineBehaviorKey(data)]}
                  </p>
                </div>
              </section>
            )}

            {/* ── Acción sugerida ── */}
            {data.suggested_action && (
              <section style={{ marginBottom: 'var(--space-6)' }}>
                <SectionHeader title="Acción sugerida" />
                <div
                  style={{
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-5)',
                    borderLeft: '3px solid var(--color-accent)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    {/* Urgency badge */}
                    {(() => {
                      const urg = URGENCY_CONFIG[data.suggested_action!.urgency] ?? URGENCY_CONFIG.low
                      return (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-pill)',
                            background: urg.bg,
                            color: urg.color,
                            fontFamily: 'var(--font-inter)',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {urg.label}
                        </span>
                      )
                    })()}
                    {/* Action type */}
                    <span
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {ACTION_TYPE_LABELS[data.suggested_action!.type]?.icon}{' '}
                      {ACTION_TYPE_LABELS[data.suggested_action!.type]?.label ?? data.suggested_action!.type}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '13px',
                      lineHeight: 1.55,
                      color: 'var(--color-text-secondary)',
                      margin: '0 0 12px',
                    }}
                  >
                    {data.suggested_action!.reason}
                  </p>
                  <button
                    disabled
                    title="Disponible en Sprint 4"
                    style={{
                      padding: '8px 20px',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      background: 'var(--color-accent)',
                      color: 'var(--color-text-inverse)',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'not-allowed',
                      opacity: 0.5,
                    }}
                  >
                    Tomar acción →
                  </button>
                </div>
              </section>
            )}

            {/* ── Dimensiones ── */}
            <section style={{ marginBottom: 'var(--space-6)' }}>
              <SectionHeader title="Dimensiones" />
              <LeadDimensions scores={data.scores} />
            </section>

            {/* ── Timeline ── */}
            <section style={{ marginBottom: 'var(--space-6)' }}>
              <SectionHeader title="Timeline" />
              <LeadTimeline events={data.timeline} />
            </section>

            {/* ── Emails ── */}
            <section style={{ marginBottom: 'var(--space-6)' }}>
              <SectionHeader title="Emails" />
              <LeadEmailStatus emailStatus={data.email_status} />
            </section>

            {/* ── Acciones de Javi ── */}
            <section style={{ marginBottom: 'var(--space-4)' }}>
              <SectionHeader title="Acciones de Javi" />
              {!data.personal_actions || data.personal_actions.length === 0 ? (
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-tertiary)',
                    fontStyle: 'italic',
                    margin: 0,
                  }}
                >
                  Sin acciones previas
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {data.personal_actions.map((action, i) => {
                    const meta = ACTION_TYPE_LABELS[action.type] ?? { label: action.type, icon: '•' }
                    return (
                      <div
                        key={`${action.created_at}-${i}`}
                        style={{
                          background: 'var(--color-bg-tertiary)',
                          border: 'var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {meta.icon} {meta.label}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: '11px',
                              color: 'var(--color-text-tertiary)',
                            }}
                          >
                            {new Date(action.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '13px',
                            color: 'var(--color-text-secondary)',
                            margin: 0,
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {action.content}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  )
}
