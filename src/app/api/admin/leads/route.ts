/**
 * /api/admin/leads — GET
 *
 * Retorna todos los leads enriquecidos con heat score y acción sugerida.
 * Soporta filtrado por periodo, heat level, perfil y ordenación.
 *
 * Query params:
 *   period: 7d | 30d | 90d | all (default: 30d)
 *   filter: all | hot | warm | cold | converted | paused | lost
 *   profile: all | pc | fi | ce | cp
 *   sort: heat | date | score (default: heat)
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import {
  calculateHeatScore,
  getSuggestedAction,
  getDaysSince,
  type LeadData,
  type HeatLevel,
} from '@/lib/profile-intelligence'

const PROFILE_SHORT_TO_LABEL: Record<string, string> = {
  pc: 'Productivo Colapsado',
  fi: 'Fuerte Invisible',
  ce: 'Cuidador Exhausto',
  cp: 'Controlador Paralizado',
}

function getPeriodDate(period: string): string | null {
  const now = new Date()
  if (period === '7d') { now.setDate(now.getDate() - 7); return now.toISOString() }
  if (period === '30d') { now.setDate(now.getDate() - 30); return now.toISOString() }
  if (period === '90d') { now.setDate(now.getDate() - 90); return now.toISOString() }
  return null // 'all'
}

export async function GET(req: NextRequest) {
  // Auth
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const params = req.nextUrl.searchParams
  const period = params.get('period') ?? '30d'
  const filter = params.get('filter') ?? 'all'
  const profileFilter = params.get('profile') ?? 'all'
  const sort = params.get('sort') ?? 'heat'

  const since = getPeriodDate(period)
  const supabase = createAdminClient()

  let query = supabase
    .from('diagnosticos')
    .select('created_at, hash, email, scores, profile, funnel, meta, map_evolution, personal_actions')
    .order('created_at', { ascending: false })

  if (since) {
    query = query.gte('created_at', since)
  }

  const { data: rows, error } = await query

  if (error) {
    console.error('[admin/leads] Supabase error:', error)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }

  const all = rows ?? []

  // Enriquecer cada lead
  let leads = all.map((row) => {
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

    return {
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
      profile: row.profile,
      funnel: {
        email_captured: row.funnel?.email_captured ?? false,
        map_visits: row.funnel?.map_visits ?? 0,
        last_visit: row.funnel?.map_last_visit ?? null,
        emails_opened: row.funnel?.emails_opened ?? [],
        session_booked: row.funnel?.session_booked ?? false,
        converted_week1: row.funnel?.converted_week1 ?? false,
        unsubscribed: row.map_evolution?.email_unsubscribed ?? false,
      },
      meta: row.meta ? {
        country: row.meta.country ?? '',
        city: row.meta.city ?? '',
        source: row.meta.source ?? '',
      } : null,
      heat,
      suggested_action: suggestedAction,
      personal_actions: row.personal_actions ?? [],
      is_referred: !!(row.meta as Record<string, unknown>)?.referred_by,
    }
  })

  // Filtrar por heat level
  if (filter !== 'all') {
    leads = leads.filter((l) => l.heat.level === filter as HeatLevel)
  }

  // Filtrar por perfil
  if (profileFilter !== 'all') {
    const profileLabel = PROFILE_SHORT_TO_LABEL[profileFilter]
    if (profileLabel) {
      leads = leads.filter((l) => l.profile?.ego_primary === profileLabel)
    }
  }

  // Ordenar
  if (sort === 'heat') {
    leads.sort((a, b) => b.heat.score - a.heat.score)
  } else if (sort === 'score') {
    leads.sort((a, b) => (a.scores?.global ?? 100) - (b.scores?.global ?? 100))
  }
  // sort === 'date' ya viene por defecto del query

  return NextResponse.json({
    total: leads.length,
    leads,
  })
}
