'use client'

/**
 * HeatIndicator — Visual pill badge showing lead "temperature".
 * Used in LeadsTable rows and LeadDetailPanel header.
 */

import type { HeatLevel } from '@/lib/profile-intelligence'

interface HeatIndicatorProps {
  level: HeatLevel
  score: number
  size?: 'sm' | 'md'
}

const HEAT_CONFIG: Record<HeatLevel, { label: string; color: string; bg: string }> = {
  hot: { label: 'Caliente', color: 'var(--color-error)', bg: 'rgba(196, 64, 64, 0.08)' },
  warm: { label: 'Tibio', color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)' },
  cold: { label: 'Frío', color: 'var(--color-text-tertiary)', bg: 'rgba(138, 126, 117, 0.08)' },
  converted: { label: 'Convertido', color: 'var(--color-success)', bg: 'rgba(61, 154, 95, 0.08)' },
  paused: { label: 'Pausado', color: 'var(--color-text-tertiary)', bg: 'rgba(138, 126, 117, 0.08)' },
  lost: { label: 'Perdido', color: 'var(--color-text-tertiary)', bg: 'rgba(138, 126, 117, 0.08)' },
}

export default function HeatIndicator({ level, score, size = 'sm' }: HeatIndicatorProps) {
  const config = HEAT_CONFIG[level] ?? HEAT_CONFIG.cold
  const isSmall = size === 'sm'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? 6 : 8,
        padding: isSmall ? '3px 10px' : '5px 14px',
        borderRadius: 'var(--radius-pill)',
        background: config.bg,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: isSmall ? 7 : 9,
          height: isSmall ? 7 : 9,
          borderRadius: '50%',
          background: config.color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: isSmall ? '11px' : '13px',
          fontWeight: 500,
          color: config.color,
          lineHeight: 1,
        }}
      >
        {config.label}
      </span>
      {!isSmall && (
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '11px',
            fontWeight: 400,
            color: 'var(--color-text-tertiary)',
            lineHeight: 1,
          }}
        >
          ({score})
        </span>
      )}
    </span>
  )
}
