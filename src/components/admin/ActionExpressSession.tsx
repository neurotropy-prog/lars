'use client'

import { useState } from 'react'
import type { LeadDetail } from './LeadDetailPanel'

interface Props {
  lead: LeadDetail
  defaultMessage: string
  onSubmit: (content: string, notifyLead: boolean) => void
  onCancel: () => void
  submitting: boolean
}

export default function ActionExpressSession({ lead, defaultMessage, onSubmit, onCancel, submitting }: Props) {
  const [content, setContent] = useState(defaultMessage)
  const [notifyLead, setNotifyLead] = useState(true)

  const profile = lead.profile_intelligence

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
          📞 Sesión express para {lead.email ?? 'este lead'}
        </p>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '13px',
          color: 'var(--color-text-tertiary)',
          margin: 0,
        }}>
          10 minutos · Sin compromiso
        </p>
      </div>

      {/* Info */}
      <div style={{
        background: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
      }}>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Se creará un slot de 10 minutos para mañana a las 10:00.
          El lead recibirá una oferta en su mapa y por email.
        </p>
      </div>

      {/* Profile hint */}
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
            💡 En la sesión con {profile.shortLabel}:
          </p>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {profile.behaviors.booked_session}
          </p>
        </div>
      )}

      {/* Optional message */}
      <div>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          margin: '0 0 6px',
        }}>
          Mensaje personalizado (opcional):
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Mensaje que aparecerá en su mapa y email..."
          style={{
            width: '100%',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-secondary)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </div>

      {/* Notify checkbox */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
      }}>
        <input
          type="checkbox"
          checked={notifyLead}
          onChange={(e) => setNotifyLead(e.target.checked)}
          style={{ accentColor: 'var(--color-accent)' }}
        />
        Notificar al lead por email
      </label>

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
          onClick={() => onSubmit(content, notifyLead)}
          disabled={submitting}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: submitting ? 'var(--color-bg-tertiary)' : 'var(--color-accent)',
            color: submitting ? 'var(--color-text-tertiary)' : 'var(--color-text-inverse)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Creando...' : 'Ofrecer sesión'}
        </button>
      </div>
    </div>
  )
}
