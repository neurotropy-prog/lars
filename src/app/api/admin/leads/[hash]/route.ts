/**
 * /api/admin/leads/[hash] — GET
 *
 * Retorna detalle completo de un lead con timeline de eventos
 * y profile intelligence.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import {
  calculateHeatScore,
  getSuggestedAction,
  getProfileIntelligence,
  getDaysSince,
  type LeadData,
} from '@/lib/profile-intelligence'

interface TimelineEvent {
  type: string
  at: string
  details?: Record<string, unknown>
}

// Emails conocidos con metadata
const EMAIL_KEYS = [
  { key: 'd0', name: 'Tu Mapa de Regulación', subject: 'Tu Mapa de Regulación', day: 0 },
  { key: 'd3', name: 'Arquetipo SN', subject: 'Hay algo nuevo en tu mapa de regulación', day: 3 },
  { key: 'd7', name: 'Insight colectivo', subject: 'Tu mapa se ha actualizado', day: 7 },
  { key: 'd10', name: 'Sesión con Javier', subject: 'Javier puede revisar tu mapa contigo', day: 10 },
  { key: 'd14', name: 'Subdimensiones', subject: 'Hay 3 subdimensiones nuevas disponibles', day: 14 },
  { key: 'd21', name: 'Extracto libro', subject: 'Un capítulo escrito para tu situación', day: 21 },
  { key: 'd30', name: 'Reevaluación', subject: 'Un mes desde tu diagnóstico — ¿ha cambiado algo?', day: 30 },
  { key: 'd90', name: 'Reevaluación trimestral', subject: '3 meses desde tu mapa — una pregunta', day: 90 },
  { key: 'goodbye', name: 'Despedida', subject: 'Tu mapa sigue aquí', day: -1 },
]

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ hash: string }> },
) {
  // Auth
  const isDev = process.env.NODE_ENV === 'development'
  const adminSecret = req.headers.get('x-admin-secret')
  const validSecret = process.env.ADMIN_SECRET
  if (!isDev && (!validSecret || adminSecret !== validSecret)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { hash } = await params

  const supabase = createAdminClient()

  const { data: row, error } = await supabase
    .from('diagnosticos')
    .select('*')
    .eq('hash', hash)
    .single()

  if (error || !row) {
    return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
  }

  const lead: LeadData = {
    created_at: row.created_at,
    scores: row.scores,
    profile: row.profile,
    funnel: row.funnel,
    map_evolution: row.map_evolution,
    meta: row.meta,
    personal_actions: row.personal_actions ?? [],
  }

  const heat = calculateHeatScore(lead)
  const suggestedAction = getSuggestedAction(lead)
  const profileIntelligence = getProfileIntelligence(row.profile?.ego_primary)

  // ── Construir timeline ──────────────────────────────────────────────────
  const timeline: TimelineEvent[] = []

  // Gateway completado
  timeline.push({
    type: 'gateway_completed',
    at: row.created_at,
    details: { score: row.scores?.global },
  })

  // Emails enviados y abiertos
  const me = row.map_evolution ?? {}
  const emailOpens = me.email_opens ?? {}

  // d0 siempre se envía al crear
  timeline.push({
    type: 'email_sent',
    at: row.created_at,
    details: { key: 'd0', subject: 'Tu Mapa de Regulación' },
  })

  // Otros emails enviados (por flags)
  const sentFlags: [string, string, string][] = [
    ['email_d3_sent', 'd3', 'Hay algo nuevo en tu mapa de regulación'],
    ['email_d7_sent', 'd7', 'Tu mapa se ha actualizado'],
    ['email_d10_sent', 'd10', 'Javier puede revisar tu mapa contigo'],
    ['email_d14_sent', 'd14', 'Hay 3 subdimensiones nuevas disponibles'],
    ['email_d21_sent', 'd21', 'Un capítulo escrito para tu situación'],
    ['email_d30_sent', 'd30', 'Un mes desde tu diagnóstico — ¿ha cambiado algo?'],
  ]

  for (const [flag, key, subject] of sentFlags) {
    if (me[flag]) {
      // Estimar fecha de envío basada en el día
      const emailMeta = EMAIL_KEYS.find((e) => e.key === key)
      const sentDate = new Date(row.created_at)
      sentDate.setDate(sentDate.getDate() + (emailMeta?.day ?? 0))
      timeline.push({
        type: 'email_sent',
        at: sentDate.toISOString(),
        details: { key, subject },
      })
    }
  }

  // d90 emails (array de fechas)
  if (Array.isArray(me.email_d90_sent)) {
    for (const sentAt of me.email_d90_sent) {
      timeline.push({
        type: 'email_sent',
        at: sentAt,
        details: { key: 'd90', subject: '3 meses desde tu mapa — una pregunta' },
      })
    }
  }

  // Goodbye email
  if (me.email_goodbye_sent) {
    timeline.push({
      type: 'email_sent',
      at: new Date().toISOString(), // No tenemos fecha exacta
      details: { key: 'goodbye', subject: 'Tu mapa sigue aquí' },
    })
  }

  // Email opens
  for (const [key, openedAt] of Object.entries(emailOpens)) {
    timeline.push({
      type: 'email_opened',
      at: openedAt as string,
      details: { key },
    })
  }

  // Evolution unlocks
  if (me.archetype_unlocked) {
    const d3 = new Date(row.created_at)
    d3.setDate(d3.getDate() + 3)
    timeline.push({
      type: 'evolution_unlock',
      at: d3.toISOString(),
      details: { content: 'archetype' },
    })
  }
  if (me.insight_d7_unlocked) {
    const d7 = new Date(row.created_at)
    d7.setDate(d7.getDate() + 7)
    timeline.push({
      type: 'evolution_unlock',
      at: d7.toISOString(),
      details: { content: 'insight_d7' },
    })
  }
  if (me.subdimensions_unlocked) {
    const d14 = new Date(row.created_at)
    d14.setDate(d14.getDate() + 14)
    timeline.push({
      type: 'evolution_unlock',
      at: d14.toISOString(),
      details: { content: 'subdimensions' },
    })
  }
  if (me.book_excerpt_unlocked) {
    const d21 = new Date(row.created_at)
    d21.setDate(d21.getDate() + 21)
    timeline.push({
      type: 'evolution_unlock',
      at: d21.toISOString(),
      details: { content: 'book_excerpt' },
    })
  }

  // Personal actions
  const personalActions = row.personal_actions ?? []
  for (const action of personalActions) {
    timeline.push({
      type: 'personal_action',
      at: action.created_at,
      details: { action_type: action.type, content: action.content },
    })
  }

  // Bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('created_at, slot_start, status, completed_at')
    .eq('map_hash', hash)
    .order('created_at', { ascending: true })

  if (bookings) {
    for (const booking of bookings) {
      timeline.push({
        type: 'session_booked',
        at: booking.created_at,
        details: { slot_start: booking.slot_start, status: booking.status },
      })
      if (booking.completed_at) {
        timeline.push({
          type: 'session_completed',
          at: booking.completed_at,
        })
      }
    }
  }

  // Ordenar timeline cronológicamente
  timeline.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())

  // ── Email status ────────────────────────────────────────────────────────
  const isUnsubscribed = me.email_unsubscribed === true
  const isGoodbyeSent = me.email_goodbye_sent === true

  const emailStatus = EMAIL_KEYS.map((em) => {
    const isSent = em.key === 'd0'
      || (em.key === 'goodbye' && isGoodbyeSent)
      || !!me[`email_${em.key}_sent`]
      || (em.key === 'd90' && Array.isArray(me.email_d90_sent) && me.email_d90_sent.length > 0)

    const isOpened = !!emailOpens[em.key]
    const suppressed = isUnsubscribed || isGoodbyeSent

    return {
      key: em.key,
      name: em.name,
      subject: em.subject,
      day: em.day,
      status: isSent
        ? (isOpened ? 'opened' : 'sent')
        : (suppressed ? 'suppressed' : 'not_sent'),
      opened_at: emailOpens[em.key] ?? null,
    }
  })

  return NextResponse.json({
    hash: row.hash,
    email: row.email,
    created_at: row.created_at,
    days_since: getDaysSince(row.created_at),
    scores: row.scores ? {
      global: row.scores.global,
      label: row.scores.label,
      d1: row.scores.d1_regulacion,
      d2: row.scores.d2_sueno,
      d3: row.scores.d3_claridad,
      d4: row.scores.d4_emocional,
      d5: row.scores.d5_alegria,
    } : null,
    responses: row.responses,
    profile: row.profile,
    funnel: {
      email_captured: row.funnel?.email_captured ?? false,
      map_visits: row.funnel?.map_visits ?? 0,
      last_visit: row.funnel?.map_last_visit ?? null,
      emails_opened: row.funnel?.emails_opened ?? [],
      session_booked: row.funnel?.session_booked ?? false,
      converted_week1: row.funnel?.converted_week1 ?? false,
      unsubscribed: isUnsubscribed,
    },
    meta: row.meta,
    heat,
    suggested_action: suggestedAction,
    profile_intelligence: profileIntelligence,
    timeline,
    email_status: emailStatus,
    personal_actions: personalActions,
  })
}
