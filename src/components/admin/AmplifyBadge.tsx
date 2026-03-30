'use client'

/**
 * AmplifyBadge — Pill badge "REFERIDO" para leads que vinieron por AMPLIFY.
 *
 * Se usa en LeadsTable (junto al heat indicator) y LeadDetailPanel.
 * Color: azul (#4A6FA5) — diferenciado de los badges existentes.
 */

export default function AmplifyBadge() {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(74, 109, 165, 0.1)',
        color: '#4A6FA5',
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      Referido
    </span>
  )
}
