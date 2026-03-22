'use client'

/**
 * /admin/disponibilidad — Panel de configuración de disponibilidad
 *
 * 3 secciones:
 * 1. Horario semanal (reglas recurrentes)
 * 2. Bloqueo de fechas (vacaciones, festivos)
 * 3. Próximas sesiones agendadas
 *
 * Usa tokens de DESIGN.md y componentes UI del sistema.
 * Protegido con ADMIN_SECRET.
 */

import { useState, useEffect, useCallback, Fragment } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Separator from '@/components/ui/Separator'

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
]

// Genera bloques de 20 min: mañana 09:00–13:00, tarde 16:00–19:00
function generateTimeBlocks() {
  const blocks: { start: string; end: string; label: string; section: 'morning' | 'afternoon' }[] = []
  const pad = (n: number) => n.toString().padStart(2, '0')

  // Mañana: 09:00 a 12:40 (último slot que cabe antes de las 13:00)
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

  // Tarde: 16:00 a 18:40 (último slot que cabe antes de las 19:00)
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
}

export default function DisponibilidadPage() {
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blockDate, setBlockDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_secret')
    if (saved) {
      setSecret(saved)
      setAuthenticated(true)
    } else {
      // Sin contraseña → redirigir al home de admin
      window.location.href = '/admin'
    }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/disponibilidad', {
        headers: { 'x-admin-secret': secret },
      })
      if (!res.ok) {
        if (res.status === 401) {
          setAuthenticated(false)
          sessionStorage.removeItem('admin_secret')
          setError('Contraseña incorrecta')
          setLoading(false)
          return
        }
        throw new Error('Error cargando datos')
      }
      const data = await res.json()
      setRules(data.config ?? [])
      setBookings(data.upcomingBookings ?? [])
      setError(null)
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }, [secret])

  useEffect(() => {
    if (authenticated) fetchData()
  }, [authenticated, fetchData])

  function handleLogin() {
    if (!secret.trim()) return
    sessionStorage.setItem('admin_secret', secret.trim())
    setAuthenticated(true)
  }

  function isSlotActive(dayOfWeek: number, startTime: string, endTime: string): boolean {
    return rules.some(
      (r) =>
        r.day_of_week === dayOfWeek &&
        r.start_time === startTime &&
        r.end_time === endTime &&
        !r.is_blocked
    )
  }

  function getRuleId(dayOfWeek: number, startTime: string, endTime: string): string | null {
    return rules.find(
      (r) =>
        r.day_of_week === dayOfWeek &&
        r.start_time === startTime &&
        r.end_time === endTime &&
        !r.is_blocked
    )?.id ?? null
  }

  async function toggleSlot(dayOfWeek: number, startTime: string, endTime: string) {
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
    try {
      await fetch('/api/admin/disponibilidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ specificDate: blockDate }),
      })
      setBlockDate('')
      showSuccess('Fecha bloqueada')
      await fetchData()
    } catch {
      setError('Error al bloquear fecha')
    }
  }

  async function removeBlockedDate(ruleId: string) {
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

  // ─── Login ─────────────────────────────────────────────────────────────

  if (!authenticated) {
    return (
      <main
        className="container"
        style={{
          paddingTop: 'var(--space-24)',
          paddingBottom: 'var(--space-24)',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h1 style={{
          fontFamily: 'var(--font-plus-jakarta)',
          fontSize: 'var(--text-h2)',
          fontWeight: 600,
          lineHeight: 'var(--lh-h2)',
          letterSpacing: 'var(--ls-h2)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)',
        }}>
          Panel de Disponibilidad
        </h1>

        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-8)',
        }}>
          Introduce la contraseña de administrador
        </p>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Contraseña"
          />
        </div>

        <Button variant="primary" onClick={handleLogin} style={{ width: '100%' }}>
          Entrar
        </Button>

        {error && (
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-error)',
            marginTop: 'var(--space-4)',
          }}>
            {error}
          </p>
        )}
      </main>
    )
  }

  // ─── Panel principal ───────────────────────────────────────────────────

  return (
    <main
      className="container"
      style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-24)',
        maxWidth: '720px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{
          fontFamily: 'var(--font-plus-jakarta)',
          fontSize: 'var(--text-h1)',
          fontWeight: 700,
          lineHeight: 'var(--lh-h1)',
          letterSpacing: 'var(--ls-h1)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)',
        }}>
          Disponibilidad
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
          background: 'rgba(74,222,128,0.08)',
          border: '1px solid rgba(74,222,128,0.2)',
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

      {/* ═══ Sección 1: Horario semanal ═══════════════════════════════════ */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <p style={{
          fontFamily: 'var(--font-inter-tight)',
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
                  fontFamily: 'var(--font-inter-tight)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--color-text-tertiary)',
                  padding: 'var(--space-1)',
                  textAlign: 'center',
                  width: '52px',
                }} />
                {DAYS_OF_WEEK.map((day) => (
                  <th key={day.value} style={{
                    fontFamily: 'var(--font-inter-tight)',
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
                // Separador visual entre mañana y tarde
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
                            borderTop: '1px dashed rgba(255,255,255,0.08)',
                            fontSize: '10px',
                            fontFamily: 'var(--font-inter-tight)',
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
                        fontFamily: 'var(--font-inter-tight)',
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
                                  ? '1px solid rgba(74,222,128,0.3)'
                                  : '1px solid rgba(255,255,255,0.06)',
                                backgroundColor: active
                                  ? 'rgba(74,222,128,0.15)'
                                  : 'rgba(255,255,255,0.03)',
                                color: active ? 'var(--color-success)' : 'rgba(255,255,255,0.15)',
                                cursor: loading ? 'wait' : 'pointer',
                                fontFamily: 'var(--font-inter-tight)',
                                fontSize: '10px',
                                fontWeight: 500,
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

        {/* Resumen de slots activos */}
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

      {/* ═══ Sección 2: Bloquear fechas ═══════════════════════════════════ */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <p style={{
          fontFamily: 'var(--font-inter-tight)',
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
          Bloquea días puntuales para que no aparezcan slots.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
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
              colorScheme: 'dark',
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

      {/* ═══ Sección 3: Próximas sesiones ═════════════════════════════════ */}
      <section>
        <p style={{
          fontFamily: 'var(--font-inter-tight)',
          fontSize: 'var(--text-overline)',
          letterSpacing: 'var(--ls-overline)',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-3)',
        }}>
          Próximas sesiones
        </p>
        <Separator style={{ marginTop: 0, marginBottom: 'var(--space-5)' }} />

        {bookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {bookings.map((booking) => (
              <Card key={booking.id} style={{ padding: 'var(--space-4) var(--space-5)' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-2)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-plus-jakarta)',
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
                      fontFamily: 'var(--font-inter-tight)',
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
              </Card>
            ))}
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
    </main>
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
