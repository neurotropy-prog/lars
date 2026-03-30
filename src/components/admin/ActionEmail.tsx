'use client'

import { useState } from 'react'
import type { LeadDetail } from './LeadDetailPanel'

interface Props {
  lead: LeadDetail
  defaultTemplate: string
  onSubmit: (content: string) => void
  onCancel: () => void
  submitting: boolean
}

export default function ActionEmail({ lead, defaultTemplate, onSubmit, onCancel, submitting }: Props) {
  const [content, setContent] = useState(defaultTemplate)

  const profile = lead.profile_intelligence
  const canSubmit = content.trim().length > 0 && !submitting

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: '0 0 4px',
        }}>
          📧 Email para {lead.email ?? 'este lead'}
        </p>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '13px',
          color: 'var(--color-text-tertiary)',
          margin: 0,
        }}>
          Se envía directamente por email (no aparece en el mapa)
        </p>
      </div>

      {/* Tone hint */}
      {profile && (
        <div style={{
          background: 'var(--color-bg-tertiary)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 12px',
          borderLeft: `3px solid ${profile.color}`,
        }}>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            margin: '0 0 4px',
          }}>
            💡 Tono para {profile.shortLabel}:
          </p>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {profile.email_tone}
          </p>
        </div>
      )}

      {/* Textarea */}
      <div>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          margin: '0 0 6px',
        }}>
          Mensaje:
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          style={{
            width: '100%',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-secondary)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </div>

      {/* Never actions warning */}
      {profile && profile.never_actions.length > 0 && (
        <div style={{
          background: 'rgba(196, 64, 64, 0.05)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
        }}>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--color-error)',
            margin: '0 0 4px',
          }}>
            ⚠️ NUNCA usar con este perfil:
          </p>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {profile.never_actions.join(' · ')}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          disabled={submitting}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'var(--border-subtle)',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={() => onSubmit(content)}
          disabled={!canSubmit}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: canSubmit ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
            color: canSubmit ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {submitting ? 'Enviando...' : 'Enviar email'}
        </button>
      </div>
    </div>
  )
}
