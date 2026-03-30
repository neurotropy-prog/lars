'use client'

/**
 * SuppressionNode — Visual rule node in the automation flow.
 *
 * Shows a diamond (◆) connector instead of a circle, with warning-tinted card.
 * Describes the suppression rule: 3+ consecutive emails unopened → goodbye → stop.
 */

export default function SuppressionNode() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        position: 'relative',
      }}
    >
      {/* ── Left connector column ──────────────────────────────────────── */}
      <div
        style={{
          width: '40px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Connector line above diamond */}
        <div
          style={{
            width: '2px',
            height: '24px',
            background: 'rgba(180, 90, 50, 0.3)',
          }}
        />
        {/* Diamond ◆ */}
        <div
          style={{
            width: '12px',
            height: '12px',
            background: 'var(--color-warning)',
            transform: 'rotate(45deg)',
            flexShrink: 0,
          }}
        />
        {/* Connector line below diamond */}
        <div
          style={{
            width: '2px',
            flex: 1,
            background: 'rgba(180, 90, 50, 0.3)',
          }}
        />
      </div>

      {/* ── Content card ──────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          background: 'rgba(212, 160, 23, 0.04)',
          border: '1px solid rgba(212, 160, 23, 0.12)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-4)',
          marginLeft: 'var(--space-3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span style={{ fontSize: '14px', color: 'var(--color-warning)' }}>◆</span>
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-warning)',
            }}
          >
            Regla de supresión
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          3+ emails consecutivos sin abrir → se envía email de despedida → la secuencia se detiene automáticamente.
        </p>
      </div>
    </div>
  )
}
