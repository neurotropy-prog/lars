'use client'

/**
 * LeadEmailStatus — Compact visualization of email sequence status.
 * Shows each email in the automated sequence with its delivery/open status.
 */

interface EmailStatusItem {
  key: string
  name: string
  day: number
  status: 'opened' | 'sent' | 'not_sent' | 'suppressed'
  opened_at: string | null
}

interface LeadEmailStatusProps {
  emailStatus: EmailStatusItem[]
}

const STATUS_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  opened: { icon: '✅', color: 'var(--color-success)', label: 'Abierto' },
  sent: { icon: '📧', color: 'var(--color-info, #4A8DB7)', label: 'Enviado' },
  not_sent: { icon: '⏳', color: 'var(--color-text-tertiary)', label: 'Pendiente' },
  suppressed: { icon: '🚫', color: 'var(--color-error)', label: 'Suprimido' },
}

export default function LeadEmailStatus({ emailStatus }: LeadEmailStatusProps) {
  if (!emailStatus || emailStatus.length === 0) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {emailStatus.map((em) => {
        const config = STATUS_CONFIG[em.status] ?? STATUS_CONFIG.not_sent
        return (
          <div
            key={em.key}
            title={`${em.name} — ${config.label}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: em.status === 'opened'
                ? 'rgba(61, 154, 95, 0.06)'
                : em.status === 'sent'
                ? 'rgba(74, 141, 183, 0.06)'
                : 'rgba(138, 126, 117, 0.04)',
              border: '1px solid',
              borderColor: em.status === 'opened'
                ? 'rgba(61, 154, 95, 0.15)'
                : em.status === 'sent'
                ? 'rgba(74, 141, 183, 0.15)'
                : 'rgba(138, 126, 117, 0.08)',
            }}
          >
            <span style={{ fontSize: 12, lineHeight: 1 }}>{config.icon}</span>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '11px',
                fontWeight: 500,
                color: config.color,
              }}
            >
              {em.key === 'goodbye' ? 'Despedida' : em.key.toUpperCase()}
            </span>
          </div>
        )
      })}
    </div>
  )
}
