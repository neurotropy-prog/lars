/**
 * /api/admin/analytics — GET
 *
 * Agrega datos de la tabla diagnosticos para el panel de analytics.
 * Devuelve embudo completo, métricas clave y últimos diagnósticos.
 *
 * Query param: ?period=7d|30d|all (default: 30d)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const DIMENSION_LABELS: Record<string, string> = {
  d1_regulacion: 'Regulación Nerviosa',
  d2_sueno: 'Calidad de Sueño',
  d3_claridad: 'Claridad Cognitiva',
  d4_emocional: 'Equilibrio Emocional',
  d5_alegria: 'Alegría de Vivir',
}

function getPeriodDate(period: string): string | null {
  const now = new Date()
  if (period === '1d') {
    now.setDate(now.getDate() - 1)
    return now.toISOString()
  }
  if (period === '7d') {
    now.setDate(now.getDate() - 7)
    return now.toISOString()
  }
  if (period === '30d') {
    now.setDate(now.getDate() - 30)
    return now.toISOString()
  }
  if (period === '90d') {
    now.setDate(now.getDate() - 90)
    return now.toISOString()
  }
  return null // 'all'
}

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period') ?? '30d'
  const since = getPeriodDate(period)

  const supabase = createAdminClient()

  // Query todos los diagnósticos del periodo
  let query = supabase
    .from('diagnosticos')
    .select('created_at, hash, email, responses, scores, profile, funnel, meta')
    .order('created_at', { ascending: false })

  if (since) {
    query = query.gte('created_at', since)
  }

  const { data: rows, error } = await query

  if (error) {
    console.error('[analytics] Supabase error:', error)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }

  const all = rows ?? []
  const total = all.length

  // ── Embudo ──────────────────────────────────────────────────────────────
  const p1Started = all.filter((r) => r.responses?.p1).length
  const emailCaptured = all.filter((r) => r.funnel?.email_captured).length
  const mapVisited = all.filter((r) => (r.funnel?.map_visits ?? 0) > 0).length
  const paid = all.filter((r) => r.funnel?.converted_week1).length

  // ── Métricas clave ──────────────────────────────────────────────────────
  const scores = all.map((r) => r.scores?.global).filter((s): s is number => typeof s === 'number' && s > 0)
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  // Tasa de retorno: visitaron el mapa más de una vez
  const returnedToMap = all.filter((r) => {
    const visits = r.funnel?.map_visits ?? 0
    return visits > 1
  }).length
  const returnRate = emailCaptured > 0 ? Math.round((returnedToMap / emailCaptured) * 100) : 0

  // Dimensión más comprometida
  const dimKeys = ['d1_regulacion', 'd2_sueno', 'd3_claridad', 'd4_emocional', 'd5_alegria'] as const
  const dimAvgs: Record<string, number> = {}
  for (const key of dimKeys) {
    const vals = all.map((r) => r.scores?.[key]).filter((v): v is number => typeof v === 'number' && v > 0)
    dimAvgs[key] = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  }
  const worstDim = Object.entries(dimAvgs).sort((a, b) => a[1] - b[1])[0]
  const worstDimension = worstDim
    ? { key: worstDim[0], label: DIMENSION_LABELS[worstDim[0]] ?? worstDim[0], avg: worstDim[1] }
    : null

  // Sesiones agendadas
  const { count: sessionsBooked } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'confirmed')

  // ── Últimos 20 diagnósticos ─────────────────────────────────────────────
  const recent = all.slice(0, 20).map((r) => ({
    created_at: r.created_at,
    hash: r.hash,
    score: r.scores?.global ?? 0,
    label: r.scores?.label ?? '—',
    profile: r.profile?.ego_primary ?? '—',
    email_captured: !!r.funnel?.email_captured,
    map_visited: (r.funnel?.map_visits ?? 0) > 0,
    paid: !!r.funnel?.converted_week1,
    session_booked: !!r.funnel?.session_booked,
  }))

  // ── Distribución de perfiles ────────────────────────────────────────────
  const profileCounts: Record<string, number> = {}
  for (const r of all) {
    const p = r.profile?.ego_primary ?? 'Desconocido'
    profileCounts[p] = (profileCounts[p] ?? 0) + 1
  }

  // ── Conteos diarios (para gráfico de tendencias) ────────────────────────
  const dayCounts: Record<string, { diagnostics: number; conversions: number }> = {}
  for (const r of all) {
    const day = r.created_at?.slice(0, 10) ?? 'unknown'
    if (!dayCounts[day]) dayCounts[day] = { diagnostics: 0, conversions: 0 }
    dayCounts[day].diagnostics++
    if (r.funnel?.converted_week1) dayCounts[day].conversions++
  }
  const daily_counts = Object.entries(dayCounts)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // ── Distribución de peor dimensión ─────────────────────────────────────
  const worstDimDist: Record<string, number> = {}
  for (const key of dimKeys) worstDimDist[key] = 0
  for (const r of all) {
    let worstKey: string = dimKeys[0]
    let worstVal = Infinity
    for (const key of dimKeys) {
      const v = r.scores?.[key]
      if (typeof v === 'number' && v < worstVal) {
        worstVal = v
        worstKey = key
      }
    }
    if (worstVal < Infinity) worstDimDist[worstKey]++
  }

  return NextResponse.json({
    period,
    total,
    funnel: {
      diagnostics: total,
      p1_started: p1Started,
      email_captured: emailCaptured,
      map_visited: mapVisited,
      paid,
    },
    metrics: {
      avg_score: avgScore,
      sessions_booked: sessionsBooked ?? 0,
      return_rate: returnRate,
      worst_dimension: worstDimension,
    },
    profiles: profileCounts,
    dimensions: dimAvgs,
    daily_counts,
    worst_dimension_distribution: worstDimDist,
    recent,
  })
}
