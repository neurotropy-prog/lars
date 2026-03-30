'use client'

/**
 * BookingWidget.tsx — Widget inline de reserva de sesion con Javier
 *
 * Flujo en 3 pasos (sin modal, sin redireccion):
 * 1. Selector de dia (pills horizontales scrollables)
 * 2. Selector de hora (grid de slots)
 * 3. Confirmacion (card con fecha/hora + boton)
 *
 * Usa tokens de DESIGN.md y componentes UI del sistema.
 * Mobile-first 375px.
 */

import { useState, useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface SlotData {
  start: string
  end: string
  timeLabel: string
}

interface DayData {
  date: string
  dateLabel: string
  slots: SlotData[]
}

interface Props {
  mapHash: string
  onBooked: (booking: { slotStart: string; meetUrl: string | null }) => void
}

export default function BookingWidget({ mapHash, onBooked }: Props) {
  const [days, setDays] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const userTz = typeof window !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'Europe/Madrid'

  useEffect(() => {
    fetchSlots()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchSlots() {
    setLoading(true)
    try {
      const res = await fetch(`/api/booking/slots?tz=${encodeURIComponent(userTz)}`)
      const data = await res.json()
      setDays(data.slots ?? [])
      if (data.slots?.length > 0) {
        setSelectedDay(data.slots[0].date)
      }
    } catch {
      setError('Error cargando disponibilidad')
    }
    setLoading(false)
  }

  async function confirmBooking() {
    if (!selectedSlot) return
    setConfirming(true)
    setError(null)

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapHash,
          slotStart: selectedSlot.start,
          timezone: userTz,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError(data.error ?? 'Este horario ya no está disponible')
          setSelectedSlot(null)
          await fetchSlots()
        } else {
          setError(data.error ?? 'Error al crear la reserva')
        }
        setConfirming(false)
        return
      }

      onBooked({
        slotStart: data.booking.slotStart,
        meetUrl: data.booking.meetUrl,
      })
    } catch {
      setError('Error de conexión')
    }
    setConfirming(false)
  }

  const selectedDayData = days.find((d) => d.date === selectedDay)

  // ─── Loading ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-tertiary)',
        }}>
          Cargando disponibilidad...
        </p>
      </div>
    )
  }

  // ─── Sin slots ──────────────────────────────────────────────────────────

  if (days.length === 0) {
    return (
      <div style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--lh-body-sm)',
        }}>
          No hay horarios disponibles en este momento.
          <br />
          Vuelve a consultar en unos días.
        </p>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 'var(--space-5)' }}>
      {/* Error */}
      {error && (
        <Card style={{
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.2)',
          padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-4)',
        }}>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-error)',
            margin: 0,
          }}>
            {error}
          </p>
        </Card>
      )}

      {/* ─── Paso 1: Selector de día ──────────────────────────────────────── */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-overline)',
          letterSpacing: 'var(--ls-overline)',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-3)',
        }}>
          Elige un día
        </p>

        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-2)',
            scrollbarWidth: 'none',
          }}
        >
          {days.map((day) => {
            const isSelected = selectedDay === day.date
            const parts = day.date.split('-')
            const dayNum = parseInt(parts[2])
            const weekday = day.dateLabel.split(' ')[0].replace(',', '').slice(0, 3)

            return (
              <button
                key={day.date}
                onClick={() => {
                  setSelectedDay(day.date)
                  setSelectedSlot(null)
                  setError(null)
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected
                    ? '1px solid var(--color-accent)'
                    : 'var(--border-subtle)',
                  backgroundColor: isSelected
                    ? 'var(--color-accent-subtle)'
                    : 'var(--color-bg-tertiary)',
                  cursor: 'pointer',
                  minWidth: '60px',
                  transition: 'all var(--transition-base)',
                  flexShrink: 0,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-caption)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                }}>
                  {weekday}
                </span>
                <span style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-h3)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                }}>
                  {dayNum}
                </span>
                <span style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '10px',
                  color: isSelected ? 'var(--color-accent-muted)' : 'var(--color-text-tertiary)',
                }}>
                  {day.slots.length} {day.slots.length === 1 ? 'hora' : 'horas'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Paso 2: Selector de hora ─────────────────────────────────────── */}
      {selectedDayData && !selectedSlot && (
        <div style={{ animation: 'fadeInUp 0.3s var(--ease-out-expo) both' }}>
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-overline)',
            letterSpacing: 'var(--ls-overline)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
          }}>
            Elige una hora
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))',
            gap: 'var(--space-2)',
          }}>
            {selectedDayData.slots.map((slot, idx) => (
              <button
                key={`${slot.start}-${idx}`}
                onClick={() => {
                  setSelectedSlot(slot)
                  setError(null)
                }}
                style={{
                  padding: 'var(--space-3) var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  border: 'var(--border-subtle)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  textAlign: 'center',
                }}
              >
                {slot.timeLabel}
              </button>
            ))}
          </div>

          {userTz !== 'Europe/Madrid' && (
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              marginTop: 'var(--space-2)',
            }}>
              Horarios en tu zona: {userTz.replace(/_/g, ' ')}
            </p>
          )}
        </div>
      )}

      {/* ─── Paso 3: Confirmacion ─────────────────────────────────────────── */}
      {selectedSlot && (
        <Card
          style={{
            animation: 'fadeInUp 0.3s var(--ease-out-expo) both',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-accent-muted)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-overline)',
            letterSpacing: 'var(--ls-overline)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-4)',
          }}>
            Confirmar sesión
          </p>

          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h4)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--lh-h4)',
            marginBottom: 'var(--space-1)',
          }}>
            {selectedDayData?.dateLabel}
          </p>

          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-1)',
          }}>
            {selectedSlot.timeLabel} · 20 minutos
          </p>

          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-5)',
          }}>
            Videollamada por Google Meet
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button
              variant="primary"
              onClick={confirmBooking}
              disabled={confirming}
              style={{
                flex: 1,
                opacity: confirming ? 0.6 : 1,
                cursor: confirming ? 'wait' : 'pointer',
              }}
            >
              {confirming ? 'Reservando...' : 'Confirmar sesión gratuita'}
            </Button>

            <Button
              variant="secondary"
              size="small"
              onClick={() => setSelectedSlot(null)}
            >
              Cambiar
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
