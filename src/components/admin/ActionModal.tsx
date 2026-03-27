'use client'

import { useState, useEffect, useCallback } from 'react'
import type { LeadDetail } from './LeadDetailPanel'
import type { ActionType } from '@/lib/profile-intelligence'
import ActionNote from './ActionNote'
import ActionVideo from './ActionVideo'
import ActionUnlock from './ActionUnlock'
import ActionExpressSession from './ActionExpressSession'
import ActionEmail from './ActionEmail'

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  lead: LeadDetail
  isOpen: boolean
  onClose: () => void
  onActionComplete: () => void
}

type Step = 'select' | ActionType

// ── Constants ────────────────────────────────────────────────────────────────

const ACTIONS: { type: ActionType; icon: string; label: string; desc: string; time: string }[] = [
  { type: 'personal_note', icon: '✍️', label: 'Nota personal', desc: 'Una nota que aparece en su mapa vivo.', time: '30 seg' },
  { type: 'video', icon: '🎬', label: 'Video personalizado', desc: 'Un video que aparece en su mapa.', time: '60-90 seg' },
  { type: 'early_unlock', icon: '🔓', label: 'Desbloqueo anticipado', desc: 'Desbloquea contenido antes de tiempo.', time: '1 clic' },
  { type: 'express_session', icon: '📞', label: 'Sesión express (10 min)', desc: 'Ofrece una llamada breve.', time: '1 clic' },
  { type: 'manual_email', icon: '📧', label: 'Email manual', desc: 'Email personalizado directo.', time: '2-3 min' },
]

const DIM_NAMES: Record<string, string> = {
  d1: 'Regulación', d2: 'Sueño', d3: 'Claridad', d4: 'Emocional', d5: 'Alegría',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function replaceTemplateVars(template: string, lead: LeadDetail): string {
  // Name from email
  const emailPart = lead.email ? lead.email.split('@')[0] : ''
  const name = emailPart
    ? emailPart.charAt(0).toUpperCase() + emailPart.slice(1).toLowerCase()
    : 'Hola'

  // Score
  const score = String(lead.scores?.global ?? '—')

  // Worst dimension
  const scores = lead.scores ?? {}
  type DimKey = 'd1' | 'd2' | 'd3' | 'd4' | 'd5'
  const dimKeys: DimKey[] = ['d1', 'd2', 'd3', 'd4', 'd5']
  const worst = dimKeys.reduce((min, k) => {
    const val = scores[k] ?? 100
    const minVal = scores[min] ?? 100
    return val < minVal ? k : min
  }, 'd1' as DimKey)
  const worstDim = DIM_NAMES[worst] ?? 'Regulación'

  return template
    .replace(/\[Nombre\]/g, name)
    .replace(/\[score\]/g, score)
    .replace(/\[worstDim\]/g, worstDim)
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ActionModal({ lead, isOpen, onClose, onActionComplete }: Props) {
  const [step, setStep] = useState<Step>('select')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('select')
      setSubmitting(false)
      setSuccess(null)
      setError(null)
    }
  }, [isOpen])

  // Escape to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen && !submitting) onClose()
  }, [isOpen, submitting, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // ── API call ─────────────────────────────────────────────────────────────

  async function executeAction(type: ActionType, content: string, notifyLead: boolean) {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/leads/${lead.hash}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, content, notify_lead: notifyLead }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(data.error ?? 'Error ejecutando acción')
      }

      const actionLabels: Record<string, string> = {
        personal_note: 'Nota enviada',
        video: 'Video guardado',
        early_unlock: 'Contenido desbloqueado',
        express_session: 'Sesión ofrecida',
        manual_email: 'Email enviado',
      }

      setSuccess(actionLabels[type] ?? 'Acción completada')

      // Auto-close after brief success display
      setTimeout(() => {
        onActionComplete()
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setSubmitting(false)
    }
  }

  // ── Handlers for each action ─────────────────────────────────────────────

  function handleNoteSubmit(content: string, notifyLead: boolean) {
    executeAction('personal_note', content, notifyLead)
  }

  function handleVideoSubmit(videoUrl: string, notifyLead: boolean) {
    executeAction('video', videoUrl, notifyLead)
  }

  function handleUnlockSubmit() {
    executeAction('early_unlock', '', true)
  }

  function handleExpressSubmit(content: string, notifyLead: boolean) {
    executeAction('express_session', content, notifyLead)
  }

  function handleEmailSubmit(content: string) {
    executeAction('manual_email', content, true)
  }

  // ── Pre-filled templates ─────────────────────────────────────────────────

  const profile = lead.profile_intelligence

  const noteTemplate = profile
    ? replaceTemplateVars(
        lead.suggested_action?.type === 'personal_note' && lead.suggested_action?.template
          ? lead.suggested_action.template
          : profile.note_templates.reengagement,
        lead,
      )
    : ''

  const emailTemplate = profile
    ? replaceTemplateVars(profile.note_templates.encouragement, lead)
    : ''

  const expressMessage = profile
    ? replaceTemplateVars(
        profile.note_templates.encouragement.split('\n')[0] ?? '',
        lead,
      )
    : ''

  // ── Render ───────────────────────────────────────────────────────────────

  if (!isOpen) return null

  const suggestedType = lead.suggested_action?.type as ActionType | undefined

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => !submitting && onClose()}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 200,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '480px',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          zIndex: 201,
          padding: 'var(--space-6)',
        }}
      >
        {/* Success state */}
        {success && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-6)',
          }}>
            <p style={{
              fontSize: '32px',
              margin: '0 0 12px',
            }}>
              ✓
            </p>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '15px',
              fontWeight: 600,
              color: '#059669',
              margin: 0,
            }}>
              {success}
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && !success && (
          <div style={{
            background: 'rgba(196, 64, 64, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            marginBottom: 'var(--space-4)',
          }}>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
              color: 'var(--color-error)',
              margin: 0,
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Main content (hidden when success) */}
        {!success && (
          <>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--space-5)',
            }}>
              <div>
                {step !== 'select' && (
                  <button
                    onClick={() => { setStep('select'); setError(null) }}
                    disabled={submitting}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '12px',
                      color: 'var(--color-text-tertiary)',
                      cursor: 'pointer',
                      padding: '0 0 6px',
                      display: 'block',
                    }}
                  >
                    ← Volver
                  </button>
                )}
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: '0 0 4px',
                }}>
                  {step === 'select' ? 'Tomar acción' : ACTIONS.find(a => a.type === step)?.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  color: 'var(--color-text-tertiary)',
                  margin: 0,
                }}>
                  {lead.email ?? '—'} · {profile?.shortLabel ?? '—'} · Score {lead.scores?.global ?? '—'} · Día {lead.days_since}
                </p>
              </div>
              <button
                onClick={() => !submitting && onClose()}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  color: 'var(--color-text-tertiary)',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  padding: 4,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Action selector */}
            {step === 'select' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {ACTIONS.map((action) => {
                  const isRecommended = action.type === suggestedType
                  return (
                    <button
                      key={action.type}
                      onClick={() => setStep(action.type)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        background: 'var(--color-bg-secondary)',
                        border: isRecommended ? '1.5px solid #B45A32' : 'var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border-color 150ms',
                      }}
                    >
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{action.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                          }}>
                            {action.label}
                          </span>
                          {isRecommended && (
                            <span style={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: '10px',
                              fontWeight: 600,
                              color: '#B45A32',
                              background: 'rgba(180, 90, 50, 0.08)',
                              padding: '1px 6px',
                              borderRadius: 'var(--radius-pill)',
                              textTransform: 'uppercase',
                            }}>
                              Recomendado
                            </span>
                          )}
                        </div>
                        <p style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '12px',
                          color: 'var(--color-text-tertiary)',
                          margin: '2px 0 0',
                        }}>
                          {action.desc} <span style={{ opacity: 0.7 }}>{action.time}</span>
                        </p>
                      </div>
                    </button>
                  )
                })}

                {/* Recommendation reason */}
                {lead.suggested_action && (
                  <div style={{
                    background: 'rgba(180, 90, 50, 0.04)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    marginTop: 'var(--space-2)',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '12px',
                      color: '#B45A32',
                      margin: 0,
                      lineHeight: 1.5,
                    }}>
                      💡 <strong>Recomendado:</strong> {lead.suggested_action.reason.slice(0, 120)}{lead.suggested_action.reason.length > 120 ? '...' : ''}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action forms */}
            {step === 'personal_note' && (
              <ActionNote
                lead={lead}
                defaultTemplate={noteTemplate}
                onSubmit={handleNoteSubmit}
                onCancel={() => setStep('select')}
                submitting={submitting}
              />
            )}

            {step === 'video' && (
              <ActionVideo
                lead={lead}
                onSubmit={handleVideoSubmit}
                onCancel={() => setStep('select')}
                submitting={submitting}
              />
            )}

            {step === 'early_unlock' && (
              <ActionUnlock
                lead={lead}
                onSubmit={handleUnlockSubmit}
                onCancel={() => setStep('select')}
                submitting={submitting}
              />
            )}

            {step === 'express_session' && (
              <ActionExpressSession
                lead={lead}
                defaultMessage={expressMessage}
                onSubmit={handleExpressSubmit}
                onCancel={() => setStep('select')}
                submitting={submitting}
              />
            )}

            {step === 'manual_email' && (
              <ActionEmail
                lead={lead}
                defaultTemplate={emailTemplate}
                onSubmit={handleEmailSubmit}
                onCancel={() => setStep('select')}
                submitting={submitting}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
