/**
 * /api/admin/fast-forward — POST
 *
 * Herramienta de testing: retrocede created_at N días para simular
 * paso del tiempo y verificar desbloqueos de evolución.
 *
 * Protegido con Supabase Auth (verifyAdmin).
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'
import { computeEvolutionState, type MapEvolutionData } from '@/lib/map-evolution'

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Auth
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  let body: { hash: string; daysToAdd: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const { hash, daysToAdd } = body
  if (!hash || typeof daysToAdd !== 'number' || daysToAdd < 0) {
    return NextResponse.json({ error: 'hash y daysToAdd (>=0) requeridos' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Obtener created_at actual
  const { data, error } = await supabase
    .from('diagnosticos')
    .select('created_at, map_evolution')
    .eq('hash', hash)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Diagnóstico no encontrado' }, { status: 404 })
  }

  // Retroceder created_at (hacer que el registro parezca más antiguo)
  const currentCreatedAt = new Date(data.created_at)
  const newCreatedAt = new Date(currentCreatedAt.getTime() - daysToAdd * 86400000)

  const { error: updateError } = await supabase
    .from('diagnosticos')
    .update({ created_at: newCreatedAt.toISOString() })
    .eq('hash', hash)

  if (updateError) {
    console.error('[fast-forward] Update error:', updateError)
    return NextResponse.json({ error: 'Error actualizando' }, { status: 500 })
  }

  // Calcular el nuevo estado de evolución
  const evolution = computeEvolutionState(
    newCreatedAt.toISOString(),
    data.map_evolution as MapEvolutionData,
  )

  return NextResponse.json({
    previousCreatedAt: currentCreatedAt.toISOString(),
    newCreatedAt: newCreatedAt.toISOString(),
    daysSinceCreation: evolution.daysSinceCreation,
    evolution: {
      archetype: evolution.archetype.unlocked,
      insightD7: evolution.insightD7.unlocked,
      session: evolution.session.unlocked,
      subdimensions: evolution.subdimensions.unlocked,
      bookExcerpt: evolution.bookExcerpt.unlocked,
      reevaluation: evolution.reevaluation.unlocked,
      nextQuarterly: evolution.nextQuarterlyUnlocked,
    },
  })
}
