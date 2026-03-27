/**
 * /api/admin/hub — GET
 *
 * Endpoint único del Hub (Centro de Comando). Retorna todo lo que el Hub
 * necesita en UNA llamada: stats, alertas inteligentes, embudo 30d y feed
 * de actividad.
 *
 * Las alertas usan profile-intelligence.ts para generar narrativas clínicas.
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import {
  calculateHeatScore,
  getProfileIntelligence,
  getSuggestedAction,
  getDaysSince,
  type LeadData,
} from '@/lib/profile-intelligence'

// ── Types ───────────────────────────────────────────────────────────────────

interface HubAlert {
  icon: string
  title: string
  body: string
  action?: { label: string; href: string }
  priority: number
  profileColor?: string
}

interface ActivityItem {
  type: 'diagnostic' | 'email' | 'payment' | 'booking'
  at: string
  description: string
  icon: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function startOfDay(d: Date): Date {
  const r = new Date(d)
  r.setHours(0, 0, 0, 0)
  return r
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return startOfDay(d).toISOString()
}

function hoursAgo(n: number): string {
  const d = new Date()
  d.setHours(d.getHours() - n)
  return d.toISOString()
}

// Short email for display (first part + domain initial)
function shortEmail(email?: string | null): string {
  if (!email) return '—'
  const parts = email.split('@')
  if (parts.length !== 2) return email
  const local = parts[0].length > 12 ? parts[0].slice(0, 12) + '…' : parts[0]
  return `${local}@${parts[1]}`
}

// Map day keys to email descriptions
const EMAIL_DAY_LABELS: Record<string, string> = {
  d0: 'Bienvenida',
  d3: 'Día 3',
  d7: 'Día 7',
  d10: 'Día 10 (Sesión)',
  d14: 'Día 14',
  d21: 'Día 21',
  d30: 'Día 30',
}

// ── Main handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Auth
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const supabase = createAdminClient()
  const now = new Date()
  const todayStart = startOfDay(now).toISOString()
  const yesterdayStart = daysAgo(1)
  const sevenDaysAgo = daysAgo(7)
  const fourteenDaysAgo = daysAgo(14)
  const thirtyDaysAgo = daysAgo(30)

  // ── Parallel queries ────────────────────────────────────────────────────

  const [diagResult, bookingResult, recentBookingsResult] = await Promise.all([
    // All diagnosticos from last 30 days
    supabase
      .from('diagnosticos')
      .select('created_at, hash, email, scores, profile, funnel, map_evolution, personal_actions, meta')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false }),

    // Next confirmed session
    supabase
      .from('bookings')
      .select('slot_start, email, map_hash, status')
      .eq('status', 'confirmed')
      .gte('slot_start', now.toISOString())
      .order('slot_start', { ascending: true })
      .limit(1),

    // Recent bookings for activity feed
    supabase
      .from('bookings')
      .select('slot_start, email, status, map_hash')
      .gte('slot_start', thirtyDaysAgo)
      .order('slot_start', { ascending: false })
      .limit(10),
  ])

  if (diagResult.error) {
    console.error('[hub] Supabase diagnosticos error:', diagResult.error)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }

  const allDiags = diagResult.data ?? []
  const nextBooking = bookingResult.data?.[0] ?? null
  const recentBookings = recentBookingsResult.data ?? []

  // ── Stats ─────────────────────────────────────────────────────────────────

  const diagsToday = allDiags.filter((d) => d.created_at >= todayStart)
  const diagsYesterday = allDiags.filter(
    (d) => d.created_at >= yesterdayStart && d.created_at < todayStart
  )

  // Hot leads
  const leadsWithEmail = allDiags.filter((d) => d.funnel?.email_captured)
  let hotCount = 0
  for (const row of leadsWithEmail) {
    const lead: LeadData = {
      created_at: row.created_at,
      scores: row.scores,
      profile: row.profile,
      funnel: row.funnel,
      map_evolution: row.map_evolution,
      personal_actions: row.personal_actions ?? [],
    }
    const heat = calculateHeatScore(lead)
    if (heat.level === 'hot') hotCount++
  }

  // Conversion 7d: paid / email_captured in last 7 days
  const last7d = allDiags.filter((d) => d.created_at >= sevenDaysAgo)
  const emailCaptured7d = last7d.filter((d) => d.funnel?.email_captured).length
  const paid7d = last7d.filter((d) => d.funnel?.converted_week1).length
  const conversion7d = emailCaptured7d > 0 ? Math.round((paid7d / emailCaptured7d) * 100) : 0

  // Conversion previous 7 days (7d-14d ago)
  const prev7d = allDiags.filter(
    (d) => d.created_at >= fourteenDaysAgo && d.created_at < sevenDaysAgo
  )
  const emailCapturedPrev = prev7d.filter((d) => d.funnel?.email_captured).length
  const paidPrev = prev7d.filter((d) => d.funnel?.converted_week1).length
  const conversionPrev = emailCapturedPrev > 0 ? Math.round((paidPrev / emailCapturedPrev) * 100) : 0

  // Next session
  let nextSession: { time: string; email: string; profile: string; hash: string } | null = null
  if (nextBooking) {
    const slotDate = new Date(nextBooking.slot_start)
    const timeStr = slotDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    // Try to find profile from diagnosticos by matching map_hash
    const matchingDiag = allDiags.find((d) => d.hash === nextBooking.map_hash)
    nextSession = {
      time: timeStr,
      email: shortEmail(nextBooking.email),
      profile: matchingDiag?.profile?.ego_primary ?? '—',
      hash: nextBooking.map_hash ?? '',
    }
  }

  // ── Alerts (intelligent, narrative) ───────────────────────────────────────

  const alerts: HubAlert[] = []
  const now48h = hoursAgo(48)
  const now24h = hoursAgo(24)
  const now3d = daysAgo(3)

  // Check today's bookings for "session today" alerts
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)
  const todayBookings = recentBookings.filter(
    (b) =>
      b.status === 'confirmed' &&
      b.slot_start >= todayStart &&
      b.slot_start <= todayEnd.toISOString()
  )

  for (const booking of todayBookings) {
    const matchDiag = allDiags.find((d) => d.hash === booking.map_hash)
    const profile = getProfileIntelligence(matchDiag?.profile?.ego_primary)
    const slotTime = new Date(booking.slot_start).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
    alerts.push({
      icon: '📅',
      title: `Sesión con ${shortEmail(booking.email)} a las ${slotTime}`,
      body: profile
        ? `Perfil: ${profile.label}. ${profile.behaviors.booked_session}`
        : 'Sesión confirmada para hoy.',
      action: booking.map_hash
        ? { label: 'Ver lead', href: `/admin/leads?detail=${booking.map_hash}` }
        : undefined,
      priority: 1,
      profileColor: profile?.color,
    })
  }

  // Hot leads without recent personal action
  for (const row of leadsWithEmail) {
    const lead: LeadData = {
      created_at: row.created_at,
      scores: row.scores,
      profile: row.profile,
      funnel: row.funnel,
      map_evolution: row.map_evolution,
      personal_actions: row.personal_actions ?? [],
    }

    const heat = calculateHeatScore(lead)
    if (heat.level !== 'hot') continue

    // Check if there's a recent personal action (within 3 days)
    const actions = row.personal_actions ?? []
    const hasRecentAction = actions.some(
      (a: { created_at: string }) => a.created_at >= now3d
    )
    if (hasRecentAction) continue

    const profile = getProfileIntelligence(row.profile?.ego_primary)
    if (!profile) continue

    const mapVisits = row.funnel?.map_visits ?? 0
    const visitText = mapVisits > 1 ? ` visitó su mapa ${mapVisits} veces` : ''

    alerts.push({
      icon: '🔥',
      title: `${shortEmail(row.email)} (${profile.shortLabel}, Crítico)${visitText}`,
      body: `${profile.decision_blocker}. ${profile.behaviors.visited_but_not_paid}`,
      action: { label: 'Ver lead', href: `/admin/leads?detail=${row.hash}` },
      priority: 1,
      profileColor: profile.color,
    })
  }

  // Email d10 (session email) opened in last 48h
  for (const row of allDiags) {
    const emailOpens = row.map_evolution?.email_opens as Record<string, string> | undefined
    if (!emailOpens?.['d10']) continue

    const openedAt = emailOpens['d10']
    if (openedAt < now48h) continue
    if (row.funnel?.session_booked) continue // Already booked, no need

    const profile = getProfileIntelligence(row.profile?.ego_primary)

    alerts.push({
      icon: '📧',
      title: `${shortEmail(row.email)} abrió el email de Sesión`,
      body: profile
        ? `${profile.behaviors.opened_session_email}`
        : 'Puede que agende en las próximas horas.',
      action: { label: 'Ver lead', href: `/admin/leads?detail=${row.hash}` },
      priority: 2,
      profileColor: profile?.color,
    })
  }

  // Recent payments (last 24h)
  for (const row of allDiags) {
    if (!row.funnel?.converted_week1) continue
    // We approximate payment time — if the diagnostic is recent, count it
    // In a production system, we'd have a payment timestamp
    if (row.created_at < now24h && getDaysSince(row.created_at) > 1) continue

    // Only count if converted recently (check map_evolution for recent changes)
    const profile = getProfileIntelligence(row.profile?.ego_primary)

    alerts.push({
      icon: '💚',
      title: `${shortEmail(row.email)} ha pagado la Semana 1`,
      body: profile
        ? `Perfil: ${profile.label}. ${profile.behaviors.booked_session}`
        : 'Nuevo pago confirmado.',
      priority: 3,
      profileColor: profile?.color,
    })
  }

  // Unsubscribed in last 48h
  for (const row of allDiags) {
    const unsub = row.map_evolution?.email_unsubscribed
    if (!unsub) continue
    // Approximate: if the lead was created recently or map_evolution shows recent unsub
    if (getDaysSince(row.created_at) > 30) continue

    const profile = getProfileIntelligence(row.profile?.ego_primary)
    if (!profile) continue

    alerts.push({
      icon: '⚠️',
      title: `Se ha dado de baja: ${shortEmail(row.email)}`,
      body: `Perfil: ${profile.label}. ${profile.behaviors.unsubscribed}`,
      action: { label: 'Ver lead', href: `/admin/leads?detail=${row.hash}` },
      priority: 4,
      profileColor: profile.color,
    })
  }

  // Sort by priority, limit to 5
  alerts.sort((a, b) => a.priority - b.priority)
  const topAlerts = alerts.slice(0, 5)

  // ── Funnel 30d ────────────────────────────────────────────────────────────

  const funnel30d = {
    diagnostics: allDiags.length,
    email_captured: allDiags.filter((d) => d.funnel?.email_captured).length,
    map_visited: allDiags.filter((d) => (d.funnel?.map_visits ?? 0) > 0).length,
    paid: allDiags.filter((d) => d.funnel?.converted_week1).length,
  }

  // ── Activity feed ─────────────────────────────────────────────────────────

  const activity: ActivityItem[] = []

  // Recent diagnostics
  for (const row of allDiags.slice(0, 15)) {
    const profile = row.profile?.ego_primary
    const profileIntel = getProfileIntelligence(profile)
    const shortLabel = profileIntel?.shortLabel ?? '—'
    const score = row.scores?.global ?? 0

    activity.push({
      type: 'diagnostic',
      at: row.created_at,
      description: `Nuevo análisis (${shortLabel}, score ${score})`,
      icon: '📋',
    })
  }

  // Emails sent (derived from map_evolution flags)
  const emailDayKeys = ['d3', 'd7', 'd10', 'd14', 'd21', 'd30'] as const
  for (const row of allDiags.slice(0, 30)) {
    const me = row.map_evolution
    if (!me) continue

    for (const dayKey of emailDayKeys) {
      const sentFlag = me[`email_${dayKey}_sent`]
      if (!sentFlag) continue

      // Estimate when the email was sent based on diagnostic created_at + day offset
      const dayNum = parseInt(dayKey.replace('d', ''), 10)
      const createdDate = new Date(row.created_at)
      createdDate.setDate(createdDate.getDate() + dayNum)

      // Only include if within the last 7 days (for feed relevance)
      if (createdDate.toISOString() < sevenDaysAgo) continue

      activity.push({
        type: 'email',
        at: createdDate.toISOString(),
        description: `Email ${EMAIL_DAY_LABELS[dayKey] ?? dayKey} → ${shortEmail(row.email)}`,
        icon: '📧',
      })
    }
  }

  // Payments
  for (const row of allDiags) {
    if (!row.funnel?.converted_week1) continue

    activity.push({
      type: 'payment',
      at: row.created_at,
      description: `Pago confirmado: ${shortEmail(row.email)}`,
      icon: '💚',
    })
  }

  // Bookings
  for (const booking of recentBookings) {
    if (booking.status !== 'confirmed') continue

    activity.push({
      type: 'booking',
      at: booking.slot_start,
      description: `Sesión agendada: ${shortEmail(booking.email)}`,
      icon: '📅',
    })
  }

  // Sort by date DESC, take 15
  activity.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  const topActivity = activity.slice(0, 15)

  // ── Pending actions ─────────────────────────────────────────────────────
  // Leads with a suggested action that haven't had a personal action in 3 days

  interface PendingAction {
    hash: string
    email: string
    profile: string
    profileColor: string
    heat: string
    actionType: string
    actionReason: string
    urgency: string
    hasRecentAction?: boolean
  }

  const pendingActions: PendingAction[] = []
  let debugSkippedConverted = 0
  let debugNoAction = 0
  let debugRecentAction = 0

  for (const row of leadsWithEmail) {
    if (row.funnel?.converted_week1 || row.funnel?.unsubscribed) {
      debugSkippedConverted++
      continue
    }

    const lead: LeadData = {
      created_at: row.created_at,
      scores: row.scores,
      profile: row.profile,
      funnel: row.funnel,
      map_evolution: row.map_evolution,
      personal_actions: row.personal_actions ?? [],
    }

    const action = getSuggestedAction(lead)
    if (!action) {
      debugNoAction++
      continue
    }

    // Check if recent personal action exists (within 3 days)
    const actions = row.personal_actions ?? []
    const hasRecentAction = actions.some(
      (a: { created_at: string }) => a.created_at >= now3d
    )

    if (hasRecentAction) {
      debugRecentAction++
    }

    const heat = calculateHeatScore(lead)
    const profile = getProfileIntelligence(row.profile?.ego_primary)

    pendingActions.push({
      hash: row.hash,
      email: shortEmail(row.email),
      profile: profile?.shortLabel ?? '—',
      profileColor: profile?.color ?? '#8A7E75',
      heat: heat.level,
      actionType: action.type,
      actionReason: action.reason,
      urgency: action.urgency,
      hasRecentAction,
    })
  }

  console.log(`[hub] Pending actions debug: ${leadsWithEmail.length} leads with email, ${debugSkippedConverted} converted/unsub, ${debugNoAction} no action suggested, ${debugRecentAction} recent action, ${pendingActions.length} total pending`)

  // Sort: without recent action first, then high urgency, then hot leads
  const urgencyOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
  pendingActions.sort((a, b) => {
    // Leads without recent action come first
    if (a.hasRecentAction !== b.hasRecentAction) return a.hasRecentAction ? 1 : -1
    return (urgencyOrder[a.urgency] ?? 2) - (urgencyOrder[b.urgency] ?? 2)
  })
  const topPendingActions = pendingActions.slice(0, 8)

  // ── Response ──────────────────────────────────────────────────────────────

  return NextResponse.json({
    stats: {
      diagnostics_today: diagsToday.length,
      diagnostics_yesterday: diagsYesterday.length,
      hot_leads: hotCount,
      conversion_7d: conversion7d,
      conversion_7d_prev: conversionPrev,
      next_session: nextSession,
    },
    alerts: topAlerts,
    pending_actions: topPendingActions,
    funnel_30d: funnel30d,
    activity: topActivity,
  })
}
