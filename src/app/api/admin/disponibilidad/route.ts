/**
 * /api/admin/disponibilidad — GET / POST / DELETE
 *
 * CRUD para la configuracion de disponibilidad de Javier.
 * Protegido con Supabase Auth (verifyAdmin).
 *
 * GET: devuelve todas las reglas de disponibilidad + proximos bookings
 * POST: crea/actualiza una regla (recurring o bloqueo de fecha)
 * DELETE: elimina una regla por ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { deleteCalendarEvent } from '@/lib/google-calendar'


// ─── GET: leer configuracion + proximas sesiones ────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const supabase = createAdminClient()

  const [configResult, bookingsResult, historyResult] = await Promise.all([
    supabase
      .from('availability_config')
      .select('*')
      .order('day_of_week', { ascending: true }),
    supabase
      .from('bookings')
      .select('id, email, map_hash, slot_start, slot_end, status, google_meet_url, google_event_id, diagnostico_id')
      .eq('status', 'confirmed')
      .gte('slot_start', new Date().toISOString())
      .order('slot_start', { ascending: true })
      .limit(20),
    supabase
      .from('bookings')
      .select('id, email, map_hash, slot_start, slot_end, status, completed_at, cancelled_at, diagnostico_id')
      .in('status', ['completed', 'cancelled', 'no_show'])
      .order('slot_start', { ascending: false })
      .limit(30),
  ])

  if (configResult.error) {
    return NextResponse.json({ error: configResult.error.message }, { status: 500 })
  }

  // Enrich bookings with profile data from diagnosticos
  const allBookings = [...(bookingsResult.data ?? []), ...(historyResult.data ?? [])]
  const diagIds = allBookings
    .map((b: { diagnostico_id?: string | null }) => b.diagnostico_id)
    .filter((id): id is string => !!id)
  const uniqueDiagIds = [...new Set(diagIds)]

  let profileLookup: Record<string, { ego_primary: string | null; global_score: number | null; days_since_creation: number }> = {}

  if (uniqueDiagIds.length > 0) {
    const { data: diagnosticos } = await supabase
      .from('diagnosticos')
      .select('id, profile, scores, created_at')
      .in('id', uniqueDiagIds)

    if (diagnosticos) {
      const now = Date.now()
      for (const d of diagnosticos) {
        const profile = d.profile as { ego_primary?: string } | null
        const scores = d.scores as { global?: number } | null
        const daysSince = Math.floor((now - new Date(d.created_at).getTime()) / (1000 * 60 * 60 * 24))
        profileLookup[d.id] = {
          ego_primary: profile?.ego_primary ?? null,
          global_score: typeof scores?.global === 'number' ? scores.global : null,
          days_since_creation: daysSince,
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function enrichBooking(b: any) {
    const diagId = b.diagnostico_id as string | null
    return {
      ...b,
      profile_data: diagId && profileLookup[diagId] ? profileLookup[diagId] : null,
    }
  }

  const enrichedUpcoming = (bookingsResult.data ?? []).map(enrichBooking)
  const enrichedPast = (historyResult.data ?? []).map(enrichBooking)

  // Today's sessions (Europe/Madrid timezone)
  const todayMadrid = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' }) // YYYY-MM-DD
  const todaySessions = enrichedUpcoming.filter((b: { slot_start?: string }) => {
    if (!b.slot_start) return false
    const slotDate = new Date(b.slot_start).toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })
    return slotDate === todayMadrid
  })

  return NextResponse.json({
    config: configResult.data ?? [],
    upcomingBookings: enrichedUpcoming,
    pastBookings: enrichedPast,
    todaySessions,
  })
}

// ─── POST: crear/actualizar regla ───────────────────────────────────────────

interface CreateRuleBody {
  // Para regla recurrente:
  dayOfWeek?: number    // 0-6 (domingo-sabado)
  startTime?: string    // "10:00"
  endTime?: string      // "13:00"
  // Para bloqueo de fecha:
  specificDate?: string  // "2026-03-25"
  isBlocked?: boolean
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  let body: CreateRuleBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload invalido' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Caso 1: Bloquear una fecha especifica (completa o franja horaria)
  if (body.specificDate) {
    const insertData: Record<string, unknown> = {
      specific_date: body.specificDate,
      is_blocked: true,
    }

    // Si se proporcionan horas, es bloqueo parcial (franja horaria)
    if (body.startTime && body.endTime) {
      insertData.start_time = body.startTime
      insertData.end_time = body.endTime
    }

    const { data, error } = await supabase
      .from('availability_config')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rule: data })
  }

  // Caso 2: Regla recurrente (dia + horario)
  if (body.dayOfWeek !== undefined && body.startTime && body.endTime) {
    // Verificar si ya existe una regla para ese dia y horario
    const { data: existing } = await supabase
      .from('availability_config')
      .select('id')
      .eq('day_of_week', body.dayOfWeek)
      .eq('start_time', body.startTime)
      .eq('end_time', body.endTime)
      .is('specific_date', null)
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Esta regla ya existe', rule: existing })
    }

    const { data, error } = await supabase
      .from('availability_config')
      .insert({
        day_of_week: body.dayOfWeek,
        start_time: body.startTime,
        end_time: body.endTime,
        is_blocked: false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rule: data })
  }

  return NextResponse.json(
    { error: 'Datos insuficientes. Enviar dayOfWeek+startTime+endTime o specificDate.' },
    { status: 400 }
  )
}

// ─── DELETE: eliminar regla ─────────────────────────────────────────────────

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const ruleId = req.nextUrl.searchParams.get('id')
  if (!ruleId) {
    return NextResponse.json({ error: 'Falta el parametro id' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('availability_config')
    .delete()
    .eq('id', ruleId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// ─── PATCH: acciones sobre bookings (cancelar, completar, no-show) ──────────

interface PatchBody {
  action: 'cancel_booking' | 'complete_booking' | 'noshow_booking'
  bookingId: string
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  let body: PatchBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload invalido' }, { status: 400 })
  }

  const { action, bookingId } = body
  if (!action || !bookingId) {
    return NextResponse.json({ error: 'Falta action o bookingId' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    // Buscar el booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, google_event_id, diagnostico_id, status')
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking no encontrado' }, { status: 404 })
    }

    if (action === 'cancel_booking') {
      // 1. Borrar evento de Google Calendar
      if (booking.google_event_id) {
        try {
          await deleteCalendarEvent(booking.google_event_id)
        } catch (calError) {
          console.error('Error eliminando evento de GCal:', calError)
        }
      }

      // 2. Marcar como cancelled
      await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', booking.id)

      // 3. Actualizar funnel
      if (booking.diagnostico_id) {
        const { data: diagnostico } = await supabase
          .from('diagnosticos')
          .select('funnel')
          .eq('id', booking.diagnostico_id)
          .single()

        if (diagnostico) {
          const currentFunnel = (diagnostico.funnel as Record<string, unknown>) ?? {}
          await supabase
            .from('diagnosticos')
            .update({
              funnel: { ...currentFunnel, session_booked: false },
            })
            .eq('id', booking.diagnostico_id)
        }
      }

      return NextResponse.json({ success: true, status: 'cancelled' })
    }

    if (action === 'complete_booking') {
      await supabase
        .from('bookings')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', booking.id)

      return NextResponse.json({ success: true, status: 'completed' })
    }

    if (action === 'noshow_booking') {
      await supabase
        .from('bookings')
        .update({
          status: 'no_show',
          completed_at: new Date().toISOString(),
        })
        .eq('id', booking.id)

      return NextResponse.json({ success: true, status: 'no_show' })
    }

    return NextResponse.json({ error: 'Accion no reconocida' }, { status: 400 })
  } catch (error) {
    console.error('Error en PATCH booking:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
