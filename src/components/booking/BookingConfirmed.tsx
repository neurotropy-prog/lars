'use client'

/**
 * BookingConfirmed.tsx — Estado confirmado de la reserva
 *
 * Muestra:
 * - Checkmark animado con icono de success
 * - Fecha y hora confirmada
 * - Link de Google Meet
 * - Descarga .ics para anadir al calendario
 * - Cancelacion con confirmacion
 *
 * Usa tokens de DESIGN.md y componentes UI del sistema.
 */

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Props {
  slotStart: string
  meetUrl: string | null
  mapHash: string
  onCancelled: () => void
}

export default function BookingConfirmed({ slotStart, meetUrl, mapHash, onCancelled }: Props) {
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const date = new Date(slotStart)
  const userTz = typeof window !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'Europe/Madrid'

  const dateLabel = date.toLocaleDateString('es-ES', {
    timeZone: userTz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const timeLabel = date.toLocaleTimeString('es-ES', {
    timeZone: userTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  function generateICS(): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(date)}`,
      `DTEND:${fmt(new Date(date.getTime() + 20 * 60 * 1000))}`,
      'SUMMARY:Sesión con Javier — Instituto Epigenético',
      `DESCRIPTION:Revisión de tu Mapa de Regulación.${meetUrl ? `\\nEnlace: ${meetUrl}` : ''}`,
      meetUrl ? `URL:${meetUrl}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n')
  }

  function downloadICS() {
    const blob = new Blob([generateICS()], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sesion-javier.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function cancelBooking() {
    setCancelling(true)
    try {
      const res = await fetch('/api/booking/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapHash }),
      })
      if (res.ok) onCancelled()
    } catch { /* silencioso */ }
    setCancelling(false)
  }

  return (
    <div style={{
      marginTop: 'var(--space-4)',
      animation: 'fadeInUp 0.4s var(--ease-out-expo) both',
    }}>
      {/* Checkmark + estado */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(61,154,95,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10L8 14L16 6"
              stroke="var(--color-success)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 600,
            color: 'var(--color-success)',
            margin: 0,
          }}>
            Sesión confirmada
          </p>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h4)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--lh-h4)',
            margin: '2px 0 0 0',
          }}>
            {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)} · {timeLabel}
          </p>
        </div>
      </div>

      {/* Meet link */}
      {meetUrl && (
        <Card style={{
          background: 'rgba(96,165,250,0.06)',
          border: '1px solid rgba(96,165,250,0.15)',
          padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-4)',
        }}>
          <a
            href={meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-info)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 6.5L15 4.5V11.5L11 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Abrir Google Meet
          </a>
        </Card>
      )}

      {/* Acciones */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <Button variant="secondary" size="small" onClick={downloadICS}>
          Añadir a mi calendario
        </Button>

        {!showCancelConfirm ? (
          <Button variant="ghost" size="small" onClick={() => setShowCancelConfirm(true)} style={{ color: 'var(--color-text-tertiary)' }}>
            Cancelar sesión
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
            }}>
              ¿Seguro?
            </span>
            <button
              onClick={cancelBooking}
              disabled={cancelling}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(248,113,113,0.3)',
                background: 'rgba(248,113,113,0.08)',
                color: 'var(--color-error)',
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                fontWeight: 600,
                cursor: cancelling ? 'wait' : 'pointer',
              }}
            >
              {cancelling ? '...' : 'Sí, cancelar'}
            </button>
            <button
              onClick={() => setShowCancelConfirm(false)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: 'var(--border-subtle)',
                background: 'transparent',
                color: 'var(--color-text-tertiary)',
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
