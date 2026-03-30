'use client'

/**
 * ProfileInfoPanel — Slide-in panel showing complete profile type information.
 *
 * When Javi clicks on a profile in "Distribución de perfiles", this panel
 * explains everything about that profile type: who they are, how they behave,
 * what to do, what NOT to do, and how to communicate with them.
 */

import { useEffect, useCallback, useState } from 'react'
import { getProfileIntelligence, type ProfileIntelligence } from '@/lib/profile-intelligence'

interface ProfileInfoPanelProps {
  profileName: string | null
  onClose: () => void
}

const ACTION_LABELS: Record<string, string> = {
  personal_note: 'Nota personal',
  video: 'Video personalizado',
  early_unlock: 'Desbloqueo anticipado',
  express_session: 'Sesión express',
  manual_email: 'Email manual',
}

const BEHAVIOR_LABELS: Record<string, string> = {
  multiple_map_visits: 'Cuando visita el mapa varias veces',
  no_email_opens: 'Cuando no abre los emails',
  long_time_no_action: 'Cuando pasa tiempo sin actuar',
  visited_but_not_paid: 'Cuando ha visitado pero no ha pagado',
  opened_session_email: 'Cuando abre el email de sesión',
  booked_session: 'Cuando agenda una sesión',
  unsubscribed: 'Cuando se da de baja',
}

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
          fontFamily: 'var(--font-host-grotesk)',
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

export default function ProfileInfoPanel({ profileName, onClose }: ProfileInfoPanelProps) {
  const [isMobile, setIsMobile] = useState(false)
  const isOpen = profileName !== null
  const profile = profileName ? getProfileIntelligence(profileName) : null

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

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

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen, isMobile])

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
          width: isMobile ? '100vw' : '460px',
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
        {profile && (
          <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-8)' }}>

            {/* ── Close button ── */}
            <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'flex-end', marginBottom: 'var(--space-4)' }}>
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
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '13px',
                  padding: 4,
                }}
              >
                {isMobile ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Volver
                  </>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </button>
            </div>

            {/* ── Header ── */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: '28px' }}>{profile.icon}</span>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-h3)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}>
                    {profile.label}
                  </h2>
                  <span style={{
                    display: 'inline-block',
                    marginTop: 4,
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-pill)',
                    background: `${profile.color}18`,
                    color: profile.color,
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    {profile.shortLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Quién es ── */}
            <div style={{ marginBottom: 'var(--space-7)' }}>
              <SectionHeader title="Quién es este perfil" />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}>
                <InfoBlock
                  label="Su mayor miedo"
                  text={profile.core_fear}
                  color="var(--color-error)"
                  icon="😰"
                />
                <InfoBlock
                  label="Lo que realmente desea"
                  text={profile.core_desire}
                  color="var(--color-success)"
                  icon="🎯"
                />
                <InfoBlock
                  label="Lo que le bloquea para decidir"
                  text={profile.decision_blocker}
                  color="#D97706"
                  icon="🚧"
                />
              </div>
            </div>

            {/* ── Cómo se comporta ── */}
            <div style={{ marginBottom: 'var(--space-7)' }}>
              <SectionHeader title="Cómo se comporta" />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}>
                {(Object.keys(BEHAVIOR_LABELS) as Array<keyof typeof BEHAVIOR_LABELS>).map((key) => (
                  <div
                    key={key}
                    style={{
                      background: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      borderLeft: `3px solid ${profile.color}`,
                    }}
                  >
                    <p style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: profile.color,
                      margin: '0 0 6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {BEHAVIOR_LABELS[key]}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: '14px',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                      lineHeight: 1.6,
                    }}>
                      {profile.behaviors[key as keyof ProfileIntelligence['behaviors']]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Qué hacer ── */}
            <div style={{ marginBottom: 'var(--space-7)' }}>
              <SectionHeader title="Acciones recomendadas" />

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
              }}>
                {profile.suggested_actions.map((action, i) => (
                  <span
                    key={action}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      background: i === 0 ? `${profile.color}14` : 'var(--color-bg-tertiary)',
                      color: i === 0 ? profile.color : 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: '13px',
                      fontWeight: i === 0 ? 600 : 400,
                      border: i === 0 ? `1px solid ${profile.color}30` : 'var(--border-subtle)',
                    }}
                  >
                    {i === 0 && '★ '}{ACTION_LABELS[action] ?? action}
                  </span>
                ))}
              </div>
              {profile.suggested_actions[0] && (
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '12px',
                  color: 'var(--color-text-tertiary)',
                  marginTop: 'var(--space-2)',
                }}>
                  ★ = acción principal recomendada para este perfil
                </p>
              )}
            </div>

            {/* ── Qué NO hacer ── */}
            <div style={{ marginBottom: 'var(--space-7)' }}>
              <SectionHeader title="Lo que NUNCA debes hacer" />

              <div style={{
                background: 'rgba(196, 64, 64, 0.04)',
                border: '1px solid rgba(196, 64, 64, 0.12)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                {profile.never_actions.map((action) => (
                  <div
                    key={action}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <span style={{ color: 'var(--color-error)', fontSize: '13px', lineHeight: '20px', flexShrink: 0 }}>✕</span>
                    <span style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: '14px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '20px',
                    }}>
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tono de comunicación ── */}
            <div style={{ marginBottom: 'var(--space-7)' }}>
              <SectionHeader title="Tono de comunicación" />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}>
                <div style={{
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-tertiary)',
                    margin: '0 0 6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    Emails
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    {profile.email_tone}
                  </p>
                </div>

                <div style={{
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-tertiary)',
                    margin: '0 0 6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    Videos
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    {profile.video_script_hint}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Plantillas de notas ── */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <SectionHeader title="Plantillas de notas" />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}>
                <NoteTemplate label="Reengagement" text={profile.note_templates.reengagement} color={profile.color} />
                <NoteTemplate label="Motivación" text={profile.note_templates.encouragement} color={profile.color} />
                <NoteTemplate label="Post-sesión" text={profile.note_templates.post_session} color={profile.color} />
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  )
}

// ── Helper components ────────────────────────────────────────────────────────

function InfoBlock({ label, text, color, icon }: { label: string; text: string; color: string; icon: string }) {
  return (
    <div style={{
      background: 'var(--color-bg-tertiary)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: '24px' }}>{icon}</span>
      <div>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '12px',
          fontWeight: 600,
          color,
          margin: '0 0 4px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          margin: 0,
          lineHeight: 1.6,
        }}>
          {text}
        </p>
      </div>
    </div>
  )
}

function NoteTemplate({ label, text, color }: { label: string; text: string; color: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div style={{
      background: 'var(--color-bg-tertiary)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '12px',
          fontWeight: 600,
          color,
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {label}
        </p>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? 'rgba(61, 154, 95, 0.1)' : 'rgba(30, 19, 16, 0.04)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 10px',
            cursor: 'pointer',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '11px',
            fontWeight: 500,
            color: copied ? 'var(--color-success)' : 'var(--color-text-tertiary)',
            transition: 'all 150ms ease',
          }}
        >
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        margin: 0,
        lineHeight: 1.7,
        whiteSpace: 'pre-line',
      }}>
        {text}
      </p>
    </div>
  )
}
