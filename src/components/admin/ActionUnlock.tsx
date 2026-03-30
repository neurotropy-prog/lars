'use client'

import type { LeadDetail } from './LeadDetailPanel'

interface Props {
  lead: LeadDetail
  onSubmit: () => void
  onCancel: () => void
  submitting: boolean
}

export default function ActionUnlock({ lead, onSubmit, onCancel, submitting }: Props) {
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
          🔓 Desbloqueo anticipado para {lead.email ?? 'este lead'}
        </p>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '13px',
          color: 'var(--color-text-tertiary)',
          margin: 0,
        }}>
          Día {lead.days_since} desde el análisis
        </p>
      </div>

      {/* What will be unlocked */}
      <div style={{
        background: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
      }}>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: '0 0 12px',
        }}>
          Se desbloqueará:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '🧬', label: 'Arquetipo del Sistema Nervioso', day: 3 },
            { icon: '📊', label: 'Insight de Inteligencia Colectiva (D7)', day: 7 },
            { icon: '🔬', label: 'Subdimensiones detalladas', day: 14 },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              <span style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
              }}>
                {item.label}
              </span>
              {lead.days_since < item.day && (
                <span style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '11px',
                  color: 'var(--color-accent)',
                  background: 'rgba(180, 90, 50, 0.08)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-pill)',
                }}>
                  anticipado
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation */}
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: '13px',
        color: 'var(--color-text-tertiary)',
        margin: 0,
        lineHeight: 1.5,
      }}>
        El lead verá el contenido desbloqueado en su próxima visita al mapa.
        Se le notificará por email automáticamente.
      </p>

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
          onClick={onSubmit}
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
          {submitting ? 'Desbloqueando...' : 'Desbloquear ahora'}
        </button>
      </div>
    </div>
  )
}
