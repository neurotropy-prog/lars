'use client'

import { useState } from 'react'

/**
 * EmailFlowNode — Individual email node in the automation flow.
 *
 * Shows: day badge, name, subject, trigger, stats, and expandable preview.
 * Connected by a vertical terracotta line on the left.
 */

interface EmailData {
  key: string
  name: string
  subject: string
  trigger: string
  day: number
  sent: number
  opened: number
  open_rate: number
}

interface EmailFlowNodeProps {
  email: EmailData
  description: string
  cta: string
  conditions?: string
  isLast?: boolean
  isSpecial?: boolean
  onEdit?: (emailKey: string) => void
  isCustomized?: boolean
}

export default function EmailFlowNode({
  email,
  description,
  cta,
  conditions,
  isLast = false,
  isSpecial = false,
  onEdit,
  isCustomized = false,
}: EmailFlowNodeProps) {
  const [expanded, setExpanded] = useState(false)

  const dayLabel =
    email.key === 'goodbye'
      ? 'Supresión'
      : isSpecial
        ? 'Evento'
        : `Día ${email.day}`

  const rateColor =
    email.open_rate >= 60
      ? 'var(--color-success)'
      : email.open_rate >= 40
        ? 'var(--color-warning)'
        : 'var(--color-error)'

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
        {/* Connector line above dot */}
        <div
          style={{
            width: '2px',
            height: '24px',
            background: 'rgba(180, 90, 50, 0.3)',
          }}
        />
        {/* Dot */}
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            flexShrink: 0,
          }}
        />
        {/* Connector line below dot */}
        {!isLast && (
          <div
            style={{
              width: '2px',
              flex: 1,
              background: 'rgba(180, 90, 50, 0.3)',
            }}
          />
        )}
      </div>

      {/* ── Content card ──────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          background: 'var(--color-bg-tertiary)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-4)',
          marginLeft: 'var(--space-3)',
        }}
      >
        {/* Row 1: Day badge + name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-2)',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-accent)',
              background: 'rgba(180, 90, 50, 0.08)',
              padding: '3px 10px',
              borderRadius: '100px',
              whiteSpace: 'nowrap',
            }}
          >
            {dayLabel}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}
          >
            {email.name}
          </span>
          {isCustomized && (
            <span
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--color-success)',
                background: 'rgba(61, 154, 95, 0.08)',
                padding: '2px 8px',
                borderRadius: '100px',
                whiteSpace: 'nowrap',
              }}
            >
              Editado
            </span>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(email.key)
              }}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-text-tertiary)',
                cursor: 'pointer',
                padding: '2px 8px',
                borderRadius: 'var(--radius-md)',
                transition: 'color 150ms ease, background 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)'
                e.currentTarget.style.background = 'rgba(180, 90, 50, 0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-tertiary)'
                e.currentTarget.style.background = 'none'
              }}
            >
              Editar
            </button>
          )}
        </div>

        {/* Row 2: Subject */}
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            margin: '0 0 var(--space-1) 0',
          }}
        >
          {email.subject}
        </p>

        {/* Row 3: Trigger */}
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            color: 'var(--color-text-tertiary)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          {email.trigger}
        </p>

        {/* Row 4: Stats */}
        {!isSpecial ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-3)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
              }}
            >
              Enviados: {email.sent}
            </span>
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}>·</span>
            <span
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
              }}
            >
              Abiertos: {email.opened}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '11px',
                fontWeight: 600,
                color: rateColor,
                background:
                  email.open_rate >= 60
                    ? 'rgba(61, 154, 95, 0.08)'
                    : email.open_rate >= 40
                      ? 'rgba(212, 160, 23, 0.08)'
                      : 'rgba(196, 64, 64, 0.08)',
                padding: '2px 8px',
                borderRadius: '100px',
              }}
            >
              {email.open_rate}%
            </span>
          </div>
        ) : (
          <div
            style={{
              marginBottom: 'var(--space-3)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '13px',
                color: 'var(--color-text-tertiary)',
                fontStyle: 'italic',
              }}
            >
              Estadísticas no disponibles
            </span>
          </div>
        )}

        {/* Row 5: Expandable preview */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {expanded ? 'Ocultar contenido' : 'Ver contenido'}
          <span
            style={{
              display: 'inline-block',
              transition: 'transform 200ms ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: '12px',
            }}
          >
            ▾
          </span>
        </button>

        {expanded && (
          <div
            style={{
              marginTop: 'var(--space-3)',
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              maxHeight: '400px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-secondary)',
                margin: '0 0 var(--space-3) 0',
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: conditions ? 'var(--space-3)' : 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                CTA:
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                  background: 'rgba(180, 90, 50, 0.08)',
                  padding: '2px 10px',
                  borderRadius: '100px',
                }}
              >
                {cta}
              </span>
            </div>
            {conditions && (
              <p
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '12px',
                  color: 'var(--color-warning)',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                ⚠ {conditions}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
