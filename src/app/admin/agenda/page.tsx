'use client'

/**
 * /admin/agenda — Agenda con contexto de perfil + configuración de disponibilidad
 *
 * 6 secciones:
 * 1. Hoy — sesiones de hoy con contexto de perfil (insight, score, badge)
 * 2. Mini-calendario semanal (Lun–Dom)
 * 3. Horario semanal (reglas recurrentes)
 * 4. Bloqueo de fechas (vacaciones, festivos)
 * 5. Próximas sesiones agendadas (con perfil)
 * 6. Historial de sesiones
 */

import { useState, useEffect, useCallback, Fragment } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Separator from '@/components/ui/Separator'
import AdminLayout from '@/components/admin/AdminLayout'
import { getProfileIntelligence } from '@/lib/profile-intelligence'

// ─── Constants ──────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
]

const WEEK_DAYS_FULL = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

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

// ─── Types ──────────────────────────────────────────────────────────────────

interface AvailabilityRule {
  id: string
  day_of_week: number | null
  start_time: string | null
  end_time: string | null
  specific_date: string | null
  is_blocked: boolean
}

interface BookingProfileData {
  ego_primary: string | null
  global_score: number | null
  days_since_creation: number
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
  profile_data?: BookingProfileData | null
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function formatTimeMadrid(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function getTodayLabelSpanish(): string {
  const now = new Date()
  const label = now.toLocaleDateString('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function scoreColor(score: number | null): string {
  if (score === null) return 'var(--color-text-tertiary)'
  if (score <= 39) return '#C44040'
  if (score <= 59) return '#D4A017'
  if (score <= 79) return '#CD796C'
  return '#3D9A5F'
}

function getProfileInsight(egoPrimary: string | null): string | null {
  if (!egoPrimary) return null
  const profile = getProfileIntelligence(egoPrimary)
  if (!profile) return null
  // First sentence of booked_session behavior
  const full = profile.behaviors.booked_session
  const firstSentence = full.split('.')[0] + '.'
  return firstSentence
}

function getProfileBadge(egoPrimary: string | null): { label: string; color: string } | null {
  if (!egoPrimary) return null
  const profile = getProfileIntelligence(egoPrimary)
  if (!profile) return null
  return { label: profile.shortLabel, color: profile.color }
}

/** Returns 7 days for Mon–Sun of the current week */
function getCurrentWeekDays(): { dayName: string; dateNum: number; fullDate: string; isToday: boolean }[] {
  const now = new Date()
  const madridDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))
  const dayOfWeek = madridDate.getDay() // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(madridDate)
  monday.setDate(madridDate.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)

  const todayStr = madridDate.toISOString().slice(0, 10)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const fullDate = d.toISOString().slice(0, 10)
    return {
      dayName: WEEK_DAYS_FULL[i],
      dateNum: d.getDate(),
      fullDate,
      isToday: fullDate === todayStr,
    }
  })
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function AgendaSkeleton() {
  const skel = (w: string, h: string, delay = '0s') => ({
    width: w,
    height: h,
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(38,66,51,0.06)',
    animation: 'hubPulse 1.5s ease-in-out infinite',
    animationDelay: delay,
  })

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <div style={skel('120px', '32px')} />
        <div style={{ ...skel('300px', '16px', '0.1s'), marginTop: 'var(--space-3)' }} />
      </div>

      {/* Today section skeleton */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <div style={skel('80px', '12px')} />
        <div style={{ ...skel('100%', '100px', '0.2s'), marginTop: 'var(--space-4)' }} />
      </div>

      {/* Mini-calendar skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-10)',
      }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={skel('100%', '64px', `${i * 0.1}s`)} />
        ))}
      </div>

      {/* Schedule skeleton */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <div style={skel('160px', '12px')} />
        <div style={{ ...skel('100%', '200px', '0.3s'), marginTop: 'var(--space-4)' }} />
      </div>

      {/* Sessions skeleton */}
      <div>
        <div style={skel('140px', '12px')} />
        {[0, 1].map((i) => (
          <div key={i} style={{ ...skel('100%', '80px', `${0.4 + i * 0.15}s`), marginTop: 'var(--space-3)' }} />
        ))}
      </div>
    </div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AgendaPage() {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [todaySessions, setTodaySessions] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])
  const [blockDate, setBlockDate] = useState('')
  const [blockMode, setBlockMode] = useState<'full_day' | 'time_range'>('full_day')
  const [blockStartTime, setBlockStartTime] = useState('09:00')
  const [blockEndTime, setBlockEndTime] = useState('13:00')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/disponibilidad')
      if (!res.ok) throw new Error('Error cargando datos')
      const data = await res.json()
      setRules(data.config ?? [])
      setBookings(data.upcomingBookings ?? [])
      setTodaySessions(data.todaySessions ?? [])
      setPastBookings(data.pastBookings ?? [])
      setError(null)
      setDataLoaded(true)
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

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
    const existingId = getRuleId(dayOfWeek, startTime, endTime)
    try {
      const dayLabel = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label ?? ''
      if (existingId) {
        await fetch(`/api/admin/disponibilidad?id=${existingId}`, {
          method: 'DELETE',
        })
        showSuccess(`${dayLabel} ${startTime}–${endTime} desactivado`)
      } else {
        await fetch('/api/admin/disponibilidad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      const payload: Record<string, string | boolean> = { specificDate: blockDate }
      if (blockMode === 'time_range') {
        payload.startTime = blockStartTime
        payload.endTime = blockEndTime
      }
      await fetch('/api/admin/disponibilidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    try {
      const res = await fetch('/api/admin/disponibilidad', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
    try {
      await fetch(`/api/admin/disponibilidad?id=${ruleId}`, {
        method: 'DELETE',
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

  // Mini-calendar data
  const weekDays = getCurrentWeekDays()
  const bookingsByDate: Record<string, Booking[]> = {}
  for (const b of bookings) {
    const d = new Date(b.slot_start).toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })
    if (!bookingsByDate[d]) bookingsByDate[d] = []
    bookingsByDate[d].push(b)
  }
  const blockedDateSet = new Set(blockedDates.map(r => r.specific_date))

  return (
    <AdminLayout>
      <div style={{
        maxWidth: '720px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 200ms ease-out',
      }}>
        {/* Show skeleton on initial load */}
        {loading && !dataLoaded ? (
          <AgendaSkeleton />
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h1 style={{
                fontFamily: 'var(--font-host-grotesk)',
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
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--lh-body-sm)',
              }}>
                Tus sesiones, disponibilidad y contexto de cada lead.
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
                  fontFamily: 'var(--font-host-grotesk)',
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
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-success)',
                  margin: 0,
                }}>
                  {success}
                </p>
              </Card>
            )}

            {/* ═══ Sección 1: HOY ═══ */}
            <section style={{ marginBottom: 'var(--space-10)' }}>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-overline)',
                letterSpacing: 'var(--ls-overline)',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-1)',
              }}>
                Hoy
              </p>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--space-4)',
              }}>
                {getTodayLabelSpanish()}
              </p>

              {todaySessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {todaySessions.map((session) => {
                    const badge = getProfileBadge(session.profile_data?.ego_primary ?? null)
                    const insight = getProfileInsight(session.profile_data?.ego_primary ?? null)
                    const score = session.profile_data?.global_score ?? null
                    const days = session.profile_data?.days_since_creation ?? null

                    return (
                      <Card key={session.id} style={{
                        padding: 'var(--space-5)',
                        border: '1px solid var(--color-accent)',
                        background: 'rgba(205,121,108,0.03)',
                      }}>
                        {/* Time + badges */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          marginBottom: 'var(--space-3)',
                          flexWrap: 'wrap',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-host-grotesk)',
                            fontSize: 'var(--text-h3)',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                          }}>
                            {formatTimeMadrid(session.slot_start)}
                          </span>

                          {badge && (
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 10px',
                              borderRadius: 'var(--radius-pill)',
                              background: badge.color + '18',
                              color: badge.color,
                              fontFamily: 'var(--font-host-grotesk)',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}>
                              {badge.label}
                            </span>
                          )}

                          {score !== null && (
                            <span style={{
                              fontFamily: 'var(--font-host-grotesk)',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: scoreColor(score),
                            }}>
                              Score {score}
                            </span>
                          )}

                          {days !== null && (
                            <span style={{
                              fontFamily: 'var(--font-host-grotesk)',
                              fontSize: '11px',
                              color: 'var(--color-text-tertiary)',
                            }}>
                              Día {days}
                            </span>
                          )}
                        </div>

                        {/* Email */}
                        <p style={{
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--color-text-secondary)',
                          margin: 0,
                          marginBottom: 'var(--space-3)',
                        }}>
                          {session.email}
                        </p>

                        {/* Profile insight */}
                        {insight && (
                          <p style={{
                            fontFamily: 'var(--font-host-grotesk)',
                            fontSize: 'var(--text-caption)',
                            color: 'var(--color-text-tertiary)',
                            fontStyle: 'italic',
                            margin: 0,
                            marginBottom: 'var(--space-4)',
                            lineHeight: 'var(--lh-body-sm)',
                            borderLeft: `3px solid ${badge?.color ?? 'var(--color-accent)'}`,
                            paddingLeft: 'var(--space-3)',
                          }}>
                            {insight}
                          </p>
                        )}

                        {/* Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: 'var(--space-2)',
                          flexWrap: 'wrap',
                          paddingTop: 'var(--space-3)',
                          borderTop: '1px solid rgba(38,66,51,0.06)',
                        }}>
                          <a
                            href={`/admin/leads?detail=${session.map_hash}`}
                            style={{
                              padding: 'var(--space-2) var(--space-3)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid rgba(205,121,108,0.3)',
                              backgroundColor: 'rgba(205,121,108,0.06)',
                              color: 'var(--color-accent)',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-host-grotesk)',
                              fontSize: '12px',
                              fontWeight: 500,
                              textDecoration: 'none',
                              transition: 'all var(--transition-base)',
                            }}
                          >
                            Ver lead
                          </a>
                          {session.google_meet_url && (
                            <a
                              href={session.google_meet_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: 'var(--space-2) var(--space-3)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(74,141,183,0.3)',
                                backgroundColor: 'rgba(74,141,183,0.06)',
                                color: 'var(--color-info)',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-host-grotesk)',
                                fontSize: '12px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                transition: 'all var(--transition-base)',
                              }}
                            >
                              Google Meet →
                            </a>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-tertiary)',
                  padding: 'var(--space-4)',
                  background: 'rgba(38,66,51,0.02)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}>
                  Sin sesiones hoy.
                </p>
              )}
            </section>

            {/* ═══ Sección 2: Mini-calendario semanal ═══ */}
            <section style={{ marginBottom: 'var(--space-10)' }}>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-overline)',
                letterSpacing: 'var(--ls-overline)',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-3)',
              }}>
                Esta semana
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 'var(--space-2)',
              }}>
                {weekDays.map((day) => {
                  const daySessions = bookingsByDate[day.fullDate] ?? []
                  const isBlocked = blockedDateSet.has(day.fullDate)
                  const hasSession = daySessions.length > 0

                  return (
                    <div
                      key={day.fullDate}
                      onClick={() => {
                        if (hasSession) {
                          document.getElementById('upcoming-sessions')?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      style={{
                        padding: 'var(--space-2) var(--space-1)',
                        borderRadius: 'var(--radius-md)',
                        border: day.isToday
                          ? '2px solid var(--color-accent)'
                          : '1px solid rgba(38,66,51,0.06)',
                        background: day.isToday ? 'rgba(205,121,108,0.04)' : 'transparent',
                        textAlign: 'center',
                        cursor: hasSession ? 'pointer' : 'default',
                        transition: 'all var(--transition-base)',
                        minHeight: '64px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: day.isToday ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                        textTransform: 'uppercase',
                      }}>
                        {day.dayName}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: 'var(--text-body-sm)',
                        fontWeight: day.isToday ? 700 : 500,
                        color: day.isToday ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      }}>
                        {day.dateNum}
                      </span>
                      {hasSession && (
                        <span style={{
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: '9px',
                          fontWeight: 600,
                          color: 'var(--color-accent)',
                        }}>
                          {formatTimeMadrid(daySessions[0].slot_start)}
                        </span>
                      )}
                      {isBlocked && !hasSession && (
                        <span style={{
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: '9px',
                          fontWeight: 600,
                          color: 'var(--color-error)',
                          opacity: 0.7,
                        }}>
                          OFF
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* ═══ Sección 3: Horario semanal ═══ */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
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
                fontFamily: 'var(--font-host-grotesk)',
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
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'var(--color-text-tertiary)',
                        padding: 'var(--space-1)',
                        textAlign: 'center',
                        width: '52px',
                      }} />
                      {DAYS_OF_WEEK.map((day) => (
                        <th key={day.value} style={{
                          fontFamily: 'var(--font-host-grotesk)',
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
                                  borderTop: '1px dashed rgba(38,66,51,0.08)',
                                  fontSize: '10px',
                                  fontFamily: 'var(--font-host-grotesk)',
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
                              fontFamily: 'var(--font-host-grotesk)',
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
                                        : '1px solid rgba(38,66,51,0.06)',
                                      backgroundColor: active
                                        ? 'rgba(61,154,95,0.15)'
                                        : 'rgba(38,66,51,0.03)',
                                      color: active ? 'var(--color-success)' : 'rgba(38,66,51,0.15)',
                                      cursor: loading ? 'wait' : 'pointer',
                                      fontFamily: 'var(--font-host-grotesk)',
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
                    fontFamily: 'var(--font-host-grotesk)',
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

            {/* ═══ Sección 4: Bloquear fechas ═══ */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
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
                fontFamily: 'var(--font-host-grotesk)',
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
                    fontFamily: 'var(--font-host-grotesk)',
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

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
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
                        fontFamily: 'var(--font-host-grotesk)',
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
                        fontFamily: 'var(--font-host-grotesk)',
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
                        fontFamily: 'var(--font-host-grotesk)',
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
                        fontFamily: 'var(--font-host-grotesk)',
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
                          fontFamily: 'var(--font-host-grotesk)',
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
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-tertiary)',
                }}>
                  No hay fechas bloqueadas.
                </p>
              )}
            </section>

            {/* ═══ Sección 5: Próximas sesiones (con perfil) ═══ */}
            <section id="upcoming-sessions" style={{ marginBottom: 'var(--space-12)' }}>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
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
                  {bookings.map((booking) => {
                    const slotTime = new Date(booking.slot_start).getTime()
                    const isPast = slotTime < Date.now()
                    const badge = getProfileBadge(booking.profile_data?.ego_primary ?? null)
                    const insight = getProfileInsight(booking.profile_data?.ego_primary ?? null)

                    return (
                      <Card key={booking.id} style={{ padding: 'var(--space-4) var(--space-5)' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 'var(--space-2)',
                          flexWrap: 'wrap',
                          gap: 'var(--space-2)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span style={{
                              fontFamily: 'var(--font-host-grotesk)',
                              fontSize: 'var(--text-body)',
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                            }}>
                              {formatDateTimeSpanish(booking.slot_start)}
                            </span>
                            {badge && (
                              <span style={{
                                display: 'inline-block',
                                padding: '1px 8px',
                                borderRadius: 'var(--radius-pill)',
                                background: badge.color + '18',
                                color: badge.color,
                                fontFamily: 'var(--font-host-grotesk)',
                                fontSize: '10px',
                                fontWeight: 600,
                              }}>
                                {badge.label}
                              </span>
                            )}
                          </div>
                          <Badge status="disponible">Confirmada</Badge>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-host-grotesk)',
                            fontSize: 'var(--text-body-sm)',
                            color: 'var(--color-text-secondary)',
                          }}>
                            {booking.email}
                          </span>
                          <a
                            href={`/admin/leads?detail=${booking.map_hash}`}
                            style={{
                              fontFamily: 'var(--font-host-grotesk)',
                              fontSize: 'var(--text-caption)',
                              color: 'var(--color-accent)',
                              textDecoration: 'none',
                            }}
                          >
                            Ver lead →
                          </a>
                        </div>

                        {/* Profile insight */}
                        {insight && (
                          <p style={{
                            fontFamily: 'var(--font-host-grotesk)',
                            fontSize: 'var(--text-caption)',
                            color: 'var(--color-text-tertiary)',
                            fontStyle: 'italic',
                            margin: 0,
                            marginTop: 'var(--space-2)',
                            lineHeight: 'var(--lh-body-sm)',
                          }}>
                            {insight}
                          </p>
                        )}

                        {booking.google_meet_url && (
                          <a
                            href={booking.google_meet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-block',
                              marginTop: 'var(--space-2)',
                              fontFamily: 'var(--font-host-grotesk)',
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
                          borderTop: '1px solid rgba(38,66,51,0.06)',
                          flexWrap: 'wrap',
                        }}>
                          {!isPast && (
                            <button
                              className="admin-action-btn"
                              onClick={() => handleBookingAction(booking.id, 'cancel_booking')}
                              style={{
                                padding: 'var(--space-2) var(--space-3)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(248,113,113,0.3)',
                                backgroundColor: 'rgba(248,113,113,0.08)',
                                color: '#C44040',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-host-grotesk)',
                                fontSize: '12px',
                                fontWeight: 500,
                                transition: 'all var(--transition-base)',
                              }}
                            >
                              Cancelar
                            </button>
                          )}
                          {isPast && (
                            <>
                              <button
                                className="admin-action-btn"
                                onClick={() => handleBookingAction(booking.id, 'complete_booking')}
                                style={{
                                  padding: 'var(--space-2) var(--space-3)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid rgba(61,154,95,0.3)',
                                  backgroundColor: 'rgba(61,154,95,0.08)',
                                  color: '#3D9A5F',
                                  cursor: 'pointer',
                                  fontFamily: 'var(--font-host-grotesk)',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  transition: 'all var(--transition-base)',
                                }}
                              >
                                Completar
                              </button>
                              <button
                                className="admin-action-btn"
                                onClick={() => handleBookingAction(booking.id, 'noshow_booking')}
                                style={{
                                  padding: 'var(--space-2) var(--space-3)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid rgba(212,160,23,0.3)',
                                  backgroundColor: 'rgba(212,160,23,0.08)',
                                  color: '#D4A017',
                                  cursor: 'pointer',
                                  fontFamily: 'var(--font-host-grotesk)',
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
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-tertiary)',
                  padding: 'var(--space-4)',
                  background: 'rgba(38,66,51,0.02)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}>
                  No hay sesiones próximas. Cuando alguien agende, la verás aquí.
                </p>
              )}
            </section>

            {/* ═══ Sección 6: Historial de sesiones ═══ */}
            <section>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
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
                          flexWrap: 'wrap',
                          gap: 'var(--space-2)',
                        }}>
                          <div>
                            <span style={{
                              fontFamily: 'var(--font-host-grotesk)',
                              fontSize: 'var(--text-body-sm)',
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                            }}>
                              {formatDateTimeSpanish(booking.slot_start)}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-host-grotesk)',
                              fontSize: 'var(--text-caption)',
                              color: 'var(--color-text-secondary)',
                              marginLeft: 'var(--space-3)',
                            }}>
                              {booking.email}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <span style={{
                              fontFamily: 'var(--font-host-grotesk)',
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
                                fontFamily: 'var(--font-host-grotesk)',
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
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-tertiary)',
                }}>
                  No hay sesiones en el historial.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
