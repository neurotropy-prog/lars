'use client'

/**
 * HubAmplifyCard — Card de métricas AMPLIFY para el Hub.
 *
 * Muestra: invitaciones enviadas, completadas (%), comparaciones activas, K-factor.
 * Sigue el mismo patrón visual que HubStatCards.
 */

import { useState } from 'react'

interface AmplifyStats {
  invites_sent: number
  invites_completed: number
  completion_rate: number
  comparisons_active: number
  k_factor: number
}

interface Props {
  data: AmplifyStats | null
  loading: boolean
}

function getKFactorColor(k: number): string {
  if (k > 0.5) return 'var(--color-success)'   // Motor activo
  if (k >= 0.2) return 'var(--color-warning)'   // Potencial
  return 'var(--color-error)'                    // No funciona
}

function getKFactorLabel(k: number): string {
  if (k > 0.5) return 'Motor activo'
  if (k >= 0.2) return 'Potencial'
  return 'Inactivo'
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--color-bg-tertiary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        minHeight: '130px',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '12px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-secondary)',
          marginBottom: 'var(--space-4)',
          animation: 'hubPulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          width: '50px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-secondary)',
          marginBottom: 'var(--space-3)',
          animation: 'hubPulse 1.5s ease-in-out infinite',
          animationDelay: '0.2s',
        }}
      />
      <div
        style={{
          width: '140px',
          height: '13px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-secondary)',
          animation: 'hubPulse 1.5s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      />
    </div>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

export default function HubAmplifyCard({ data, loading }: Props) {
  const [hovered, setHovered] = useState(false)

  if (loading || !data) return <SkeletonCard />

  const kColor = getKFactorColor(data.k_factor)
  const kLabel = getKFactorLabel(data.k_factor)

  const cardBase: React.CSSProperties = {
    background: 'var(--color-bg-tertiary)',
    border: 'var(--border-subtle)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-6)',
    minHeight: '130px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all var(--transition-base)',
    boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
    transform: hovered ? 'translateY(-1px)' : 'none',
  }

  return (
    <div
      style={cardBase}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-accent)',
            marginBottom: 'var(--space-3)',
          }}
        >
          AMPLIFY
        </p>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '36px',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.1,
            marginBottom: 'var(--space-2)',
          }}
        >
          {data.invites_sent}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {data.invites_completed} completadas ({data.completion_rate}%)
          {data.comparisons_active > 0 && ` · ${data.comparisons_active} activas`}
        </p>
      </div>

      {/* K-factor */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-3)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            fontWeight: 600,
            color: kColor,
          }}
        >
          K: {data.k_factor.toFixed(2)}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {kLabel}
        </span>
      </div>
    </div>
  )
}
