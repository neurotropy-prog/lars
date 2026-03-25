'use client'

/**
 * /admin/agenda — Panel de configuración de disponibilidad (renombrado de disponibilidad)
 *
 * 4 secciones:
 * 1. Horario semanal (reglas recurrentes)
 * 2. Bloqueo de fechas (vacaciones, festivos)
 * 3. Próximas sesiones agendadas
 * 4. Historial de sesiones
 */

import { useState, useEffect, useCallback, Fragment } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Separator from '@/components/ui/Separator'
import AdminLayout from '@/components/admin/AdminLayout'

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
]

function generateTimeBlocks() {
  const blocks: { start: string; end: string; label: string; section: 'morning' | 'afternoon' }[] = []
  const pad = (n: number) => n.toString().padStart(2, '0')

  for (let h = 9; h < 13; h++) {
    for (let m = 0; m < 60; m += 20) {
      const endM = m + 20
      const endH = endM >= 60 ? h + 1 : h
      const endMin = endM >= 60 ? endM - 60 : endM
      if (endH > 13 || (endH === 13 && endMin > 0 && m + 20 > 60)) continue
      blocks.push({
        start: `${pad(h)}:${pad(m)}`,
        end: `${pad(endH)}:${pad(endMin)}`,
        label: `${pad(h)}:${pad(m)}`,
        section: 'morning',
      })
    }
  }

  for (let h = 16; h < 19; h++) {
    for (let m = 0; m < 60; m += 20) {
      const endM = m + 20
      const endH = endM >= 60 ? h + 1 : h
      const endMin = endM >= 60 ? endM - 60 : endM
      if (endH > 19) continue
      blocks.push({
        start: `${pad(h)}:${pad(m)}`,
        end: `${pad(endH)}:${pad(endMin)}`,
        label: `${pad(h)}:${pad(m)}`,
        section: 'afternoon',
      })
    }
  }

  return blocks
}

const TIME_BLOCKS = generateTimeBlocks()

interface AvailabilityRule {
  id: string
  day_of_week: number | null
  start_time: string | null
  end_time: string | null
  specific_date: string | null
  is_blocked: boolean
}

interface Booking {
  id: string
  email: string
  map_hash: string
  slot_start: string
  slot_end: string
  status: string
  google_meet_url: string | null
  google_event_id?: string | null
  diagnostico_id?: string | null
  completed_at?: string | null
  cancelled_at?: string | null
}

export default function AgendaPage() {
  const [loading, setLoading] = useState(false)
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])
  const [blockDate, setBlockDate] = useState('')
  const [blockMode, setBlockMode] = useState<'full_day' | 'time_range'>('full_day')
  const [blockStartTime, setBlockStartTime] = useState('09:00')
  const [blockEndTime, setBlockEndTime] = useState('13:00')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const getSecret = () => sessionStorage.getItem('admin_secret') ?? ''

  const fetchData = useCallback(async () => {
    const secret = getSecret()
    if (!secret) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/disponibilidad', {
        headers: { 'x-admin-secret': secret },
      })
      if (!res.ok) {
        throw new Error('Error cargando datos')
      }
      const data = await res.json()
      setRules(data.config ?? [])
      setBookings(data.upcomingBookings ?? [])
      setPastBookings(data.pastBookings ?? [])
      setError(null)
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function normalizeTime(t: string | null): string {
    if (!t) return ''
    return t.slice(0, 5)
  }

  function isSlotActive(dayOfWeek: number, startTime: string, endTime: string): boolean {
    return rules.some(
      (r) =>
        r.day_of_week === dayOfWeek &&
        normalizeTime(r.start_time) === startTime &&
        normalizeTime(r.end_time) === endTime &&
        !r.is_blocked
    )
  }

  function getRuleId(dayOfWeek: number, startTime: string, endTime: string): string | null {
    return rules.find(
      (r) =>
        r.day_of_week === dayOfWeek &&
        normalizeTime(r.start_time) === startTime &&
        normalizeTime(r.end_time) === endTime &&
        !r.is_blocked
    )?.id ?? null
  }

  async function toggleSlot(dayOfWeek: number, startTime: string, endTime: string) {
    const secret = getSecret()
    const existingId = getRuleId(dayOfWeek, startTime, endTime)
    try {
      const dayLabel = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label ?? ''
      if (existingId) {
        await fetch(`/api/admin/disponibilidad?id=${existingId}`, {
          method: 'DELETE',
          headers: { 'x-admin-secret': secret },
        })
        showSuccess(`${dayLabel} ${startTime}–${endTime} desactivado`)
      } else {
        await fetch('/api/admin/disponibilidad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
          body: JSON.stringify({ dayOfWeek, startTime, endTime }),
        })
        showSuccess(`${dayLabel} ${startTime}–${endTime} activado`)
      }
      await fetchData()
    } catch {
      setError('Error al actualizar')
    }
  }

  async function addBlockedDate() {
    if (!blockDate) return
    const secret = getSecret()
    try {
      const payload: Record<string, string | boolean> = { specificDate: blockDate }
      if (blockMode === 'time_range') {
        payload.startTime = blockStartTime
        payload.endTime = blockEndTime
      }
      await fetch('/api/admin/disponibilidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify(payload),
      })
      setBlockDate('')
      showSuccess(blockMode === 'time_range'
        ? `Franja ${blockStartTime}–${blockEndTime} bloqueada`
        : 'Fecha bloqueada')
      await fetchData()
    } catch {
      setError('Error al bloquear fecha')
    }
  }

  async function handleBookingAction(bookingId: string, action: 'cancel_booking' | 'complete_booking' | 'noshow_booking') {
    const labels = {
      cancel_booking: 'cancelar esta sesion',
      complete_booking: 'marcar como completada',
      noshow_booking: 'marcar como no-show',
    }
    if (!confirm(`¿Seguro que quieres ${labels[action]}?`)) return

    const secret = getSecret()
    try {
      const res = await fetch('/api/admin/disponibilidad', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ action, bookingId }),
      })
      if (!res.ok) throw new Error('Error')
      const statusLabels = {
        cancel_booking: 'Sesion cancelada',
        complete_booking: 'Sesion completada',
        noshow_booking: 'Marcada como no-show',
      }
      showSuccess(statusLabels[action])
      await fetchData()
    } catch {
      setError('Error al actualizar la sesion')
    }
  }

  async function removeBlockedDate(ruleId: string) {
    const secret = getSecret()
    try {
      await fetch(`/api/admin/disponibilidad?id=${ruleId}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      })
      showSuccess('Fecha desbloqueada')
      await fetchData()
    } catch {
      setError('Error al desbloquear')
    }
  }

  function showSuccess(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 2500)
  }

  const blockedDates = rules.filter((r) => r.specific_date && r.is_blocked)

  return (
    <AdminLayout>
      <div style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <h1 style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h1)',
            fontWeight: 700,
            lineHeight: 'var(--lh-h1)',
            letterSpacing: 'var(--ls-h1)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)',
          }}>
            Agenda
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--lh-body)',
          }}>
            Configura tus horarios semanales y bloquea fechas puntuales.
            Cada celda = 1 slot de 20 min. Pulsa para activar/desactivar.
          </p>
        </div>

        {/* Feedback */}
        {error && (
          <Card style={{
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.2)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-5)',
          }}>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-error)',
              margin: 0,
            }}>
              {error}
            </p>
          </Card>
        )}
        {success && (
          <Card style={{
            background: 'rgba(61,154,95,0.08)',
            border: '1px solid rgba(61,154,95,0.2)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-5)',
          }}>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-success)',
              margin: 0,
            }}>
              {success}
            </p>
          </Card>
        )}

        {/* ═══ Sección 1: Horario semanal ═══ */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-overline)',
            letterSpacing: 'var(--ls-overline)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
          }}>
            Mi horario semanal
          </p>
          <Separator style={{ marginTop: 0, marginBottom: 'var(--space-3)' }} />
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-5)',
            lineHeight: 'var(--lh-body-sm)',
          }}>
            Pulsa en un bloque para activar/desactivar. Los bloques verdes están disponibles para reservas.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--color-text-tertiary)',
                    padding: 'var(--space-1)',
                    textAlign: 'center',
                    width: '52px',
                  }} />
                  {DAYS_OF_WEEK.map((day) => (
                    <th key={day.value} style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      padding: 'var(--space-1)',
                      textAlign: 'center',
                    }}>
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_BLOCKS.map((block, idx) => {
                  const prevBlock = idx > 0 ? TIME_BLOCKS[idx - 1] : null
                  const showSeparator = prevBlock && prevBlock.section === 'morning' && block.section === 'afternoon'

                  return (
                    <Fragment key={block.start}>
                      {showSeparator && (
                        <tr>
                          <td
                            colSpan={DAYS_OF_WEEK.length + 1}
                            style={{
                              padding: 'var(--space-2) 0',
                              textAlign: 'center',
                            }}
                          >
                            <div style={{
                              borderTop: '1px dashed rgba(30,19,16,0.08)',
                              fontSize: '10px',
                              fontFamily: 'var(--font-inter)',
                              color: 'var(--color-text-tertiary)',
                              paddingTop: 'var(--space-1)',
                              opacity: 0.6,
                            }}>
                              Pausa 13:00–16:00
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr key={block.start}>
                        <td style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '11px',
                          color: 'var(--color-text-tertiary)',
                          padding: '2px 4px',
                          whiteSpace: 'nowrap',
                          textAlign: 'right',
                        }}>
                          {block.label}
                        </td>
                        {DAYS_OF_WEEK.map((day) => {
                          const active = isSlotActive(day.value, block.start, block.end)
                          return (
                            <td key={day.value} style={{ padding: '2px' }}>
                              <button
                                onClick={() => toggleSlot(day.value, block.start, block.end)}
                                disabled={loading}
                                style={{
                                  width: '100%',
                                  height: '30px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: active
                                    ? '1px solid rgba(61,154,95,0.4)'
                                    : '1px solid rgba(30,19,16,0.06)',
                                  backgroundColor: active
                                    ? 'rgba(61,154,95,0.15)'
                                    : 'rgba(30,19,16,0.03)',
                                  color: active ? 'var(--color-success)' : 'rgba(30,19,16,0.15)',
                                  cursor: loading ? 'wait' : 'pointer',
                                  fontFamily: 'var(--font-inter)',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  transition: 'all var(--transition-base)',
                                }}
                              >
                                {active ? '✓' : ''}
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {(() => {
            const activeCount = TIME_BLOCKS.reduce((count, block) =>
              count + DAYS_OF_WEEK.filter(day => isSlotActive(day.value, block.start, block.end)).length, 0
            )
            return activeCount > 0 ? (
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '12px',
                color: 'var(--color-text-tertiary)',
                marginTop: 'var(--space-3)',
                opacity: 0.7,
              }}>
                {activeCount} slot{activeCount !== 1 ? 's' : ''} activo{activeCount !== 1 ? 's' : ''} de 20 min
              </p>
            ) : null
          })()}
        </section>

        {/* ═══ Sección 2: Bloquear fechas ═══ */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-overline)',
            letterSpacing: 'var(--ls-overline)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
          }}>
            Bloquear fechas
          </p>
          <Separator style={{ marginTop: 0, marginBottom: 'var(--space-3)' }} />
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-4)',
          }}>
            Bloquea dias completos o franjas horarias puntuales.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: 'var(--border-medium)',
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                outline: 'none',
                colorScheme: 'light',
              }}
            />
            <Button
              variant="secondary"
              size="small"
              onClick={addBlockedDate}
              disabled={!blockDate}
              style={{ opacity: blockDate ? 1 : 0.4 }}
            >
              Bloquear
            </Button>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div style={{
              display: 'flex',
              borderRadius: 'var(--radius-md)',
              border: 'var(--border-medium)',
              overflow: 'hidden',
            }}>
              {(['full_day', 'time_range'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setBlockMode(mode)}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: blockMode === mode ? 'var(--color-accent-subtle)' : 'transparent',
                    color: blockMode === mode ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  {mode === 'full_day' ? 'Todo el dia' : 'Franja horaria'}
                </button>
              ))}
            </div>

            {blockMode === 'time_range' && (
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <input
                  type="time"
                  value={blockStartTime}
                  onChange={(e) => setBlockStartTime(e.target.value)}
                  step="1200"
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: 'var(--border-medium)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    outline: 'none',
                    colorScheme: 'light',
                  }}
                />
                <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>a</span>
                <input
                  type="time"
                  value={blockEndTime}
                  onChange={(e) => setBlockEndTime(e.target.value)}
                  step="1200"
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: 'var(--border-medium)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    outline: 'none',
                    colorScheme: 'light',
                  }}
                />
              </div>
            )}
          </div>

          {blockedDates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {blockedDates.map((rule) => (
                <Card
                  key={rule.id}
                  style={{
                    background: 'rgba(248,113,113,0.06)',
                    border: '1px solid rgba(248,113,113,0.15)',
                    padding: 'var(--space-3) var(--space-4)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-error)',
                  }}>
                    {formatDateSpanish(rule.specific_date!)}
                    {rule.start_time && rule.end_time
                      ? ` · ${normalizeTime(rule.start_time)}–${normalizeTime(rule.end_time)}`
                      : ' · Todo el dia'}
                  </span>
                  <button
                    onClick={() => removeBlockedDate(rule.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-tertiary)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-inter)',
                      fontSize: 'var(--text-body)',
                      padding: '0 var(--space-1)',
                    }}
                  >
                    ✕
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
            }}>
              No hay fechas bloqueadas.
            </p>
          )}
        </section>

        {/* ═══ Sección 3: Próximas sesiones ═══ */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-overline)',
            letterSpacing: 'var(--ls-overline)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
          }}>
            Proximas sesiones
          </p>
          <Separator style={{ marginTop: 0, marginBottom: 'var(--space-5)' }} />

          {bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {bookings.map((booking) => {
                const slotTime = new Date(booking.slot_start).getTime()
                const isPast = slotTime < Date.now()

                return (
                  <Card key={booking.id} style={{ padding: 'var(--space-4) var(--space-5)' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-2)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-lora)',
                        fontSize: 'var(--text-body)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}>
                        {formatDateTimeSpanish(booking.slot_start)}
                      </span>
                      <Badge status="disponible">Confirmada</Badge>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {booking.email}
                      </span>
                      <a
                        href={`/mapa/${booking.map_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 'var(--text-caption)',
                          color: 'var(--color-accent)',
                          textDecoration: 'none',
                        }}
                      >
                        Ver mapa →
                      </a>
                    </div>

                    {booking.google_meet_url && (
                      <a
                        href={booking.google_meet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          marginTop: 'var(--space-2)',
                          fontFamily: 'var(--font-inter)',
                          fontSize: 'var(--text-caption)',
                          color: 'var(--color-info)',
                          textDecoration: 'none',
                        }}
                      >
                        Google Meet →
                      </a>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: 'var(--space-2)',
                      marginTop: 'var(--space-3)',
                      paddingTop: 'var(--space-3)',
                      borderTop: '1px solid rgba(30,19,16,0.06)',
                    }}>
                      {!isPast && (
                        <button
                          onClick={() => handleBookingAction(booking.id, 'cancel_booking')}
                          style={{
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(248,113,113,0.3)',
                            backgroundColor: 'rgba(248,113,113,0.08)',
                            color: '#C44040',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-inter)',
                            fontSize: '12px',
                            fontWeight: 500,
                            transition: 'all var(--transition-base)',
                          }}
                        >
                          Cancelar sesion
                        </button>
                      )}
                      {isPast && (
                        <>
                          <button
                            onClick={() => handleBookingAction(booking.id, 'complete_booking')}
                            style={{
                              padding: 'var(--space-2) var(--space-3)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid rgba(61,154,95,0.3)',
                              backgroundColor: 'rgba(61,154,95,0.08)',
                              color: '#3D9A5F',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-inter)',
                              fontSize: '12px',
                              fontWeight: 500,
                              transition: 'all var(--transition-base)',
                            }}
                          >
                            Completar
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking.id, 'noshow_booking')}
                            style={{
                              padding: 'var(--space-2) var(--space-3)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid rgba(212,160,23,0.3)',
                              backgroundColor: 'rgba(212,160,23,0.08)',
                              color: '#D4A017',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-inter)',
                              fontSize: '12px',
                              fontWeight: 500,
                              transition: 'all var(--transition-base)',
                            }}
                          >
                            No-show
                          </button>
                        </>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
            }}>
              No hay sesiones agendadas.
            </p>
          )}
        </section>

        {/* ═══ Sección 4: Historial de sesiones ═══ */}
        <section>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-overline)',
            letterSpacing: 'var(--ls-overline)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
          }}>
            Historial de sesiones
          </p>
          <Separator style={{ marginTop: 0, marginBottom: 'var(--space-5)' }} />

          {pastBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {pastBookings.map((booking) => {
                const statusConfig = {
                  completed: { label: 'Completada', color: '#3D9A5F', bg: 'rgba(61,154,95,0.08)', border: 'rgba(61,154,95,0.2)' },
                  cancelled: { label: 'Cancelada', color: '#C44040', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
                  no_show: { label: 'No-show', color: '#D4A017', bg: 'rgba(212,160,23,0.08)', border: 'rgba(212,160,23,0.2)' },
                }[booking.status] ?? { label: booking.status, color: 'var(--color-text-tertiary)', bg: 'transparent', border: 'var(--border-medium)' }

                return (
                  <Card key={booking.id} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: statusConfig.bg,
                    border: `1px solid ${statusConfig.border}`,
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div>
                        <span style={{
                          fontFamily: 'var(--font-lora)',
                          fontSize: 'var(--text-body-sm)',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                        }}>
                          {formatDateTimeSpanish(booking.slot_start)}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 'var(--text-caption)',
                          color: 'var(--color-text-secondary)',
                          marginLeft: 'var(--space-3)',
                        }}>
                          {booking.email}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: statusConfig.color,
                        }}>
                          {statusConfig.label}
                        </span>
                        <a
                          href={`/mapa/${booking.map_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: 'var(--text-caption)',
                            color: 'var(--color-accent)',
                            textDecoration: 'none',
                          }}
                        >
                          Ver mapa →
                        </a>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
            }}>
              No hay sesiones en el historial.
            </p>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateSpanish(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const label = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function formatDateTimeSpanish(isoStr: string): string {
  const date = new Date(isoStr)
  const dateStr = date.toLocaleDateString('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const timeStr = date.toLocaleTimeString('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} · ${timeStr}`
}
