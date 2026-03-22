/**
 * /api/stats/collective — GET
 *
 * Devuelve estadísticas colectivas agregadas de todos los diagnósticos.
 * Si hay < 100 diagnósticos propios, devuelve baseline hardcodeado.
 * Si hay >= 100, calcula en tiempo real desde Supabase.
 *
 * Cache: 1 hora (revalidate). No expone datos individuales.
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { COLLECTIVE_BASELINE } from '@/lib/content/collective-stats'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()

  // Contar diagnósticos propios
  const { count, error: countError } = await supabase
    .from('diagnosticos')
    .select('id', { count: 'exact', head: true })

  if (countError || !count || count < 100) {
    // No hay suficiente volumen → devolver baseline
    return NextResponse.json({
      ...COLLECTIVE_BASELINE,
      source: 'hardcoded',
      ownCount: count ?? 0,
    })
  }

  // Hay volumen → calcular en tiempo real
  const { data: rows, error: queryError } = await supabase
    .from('diagnosticos')
    .select('scores')

  if (queryError || !rows?.length) {
    return NextResponse.json({
      ...COLLECTIVE_BASELINE,
      source: 'hardcoded',
      ownCount: count,
    })
  }

  // Agregar scores
  const dims = ['d1_regulacion', 'd2_sueno', 'd3_claridad', 'd4_emocional', 'd5_alegria'] as const
  const dimKeys = ['d1', 'd2', 'd3', 'd4', 'd5'] as const

  const globalScores = rows.map((r) => r.scores?.global ?? 0).filter(Boolean)
  const benchmark = Math.round(globalScores.reduce((a, b) => a + b, 0) / globalScores.length)

  const byDimension: Record<string, { mean: number; p25: number; p75: number }> = {}

  for (let i = 0; i < dims.length; i++) {
    const values = rows
      .map((r) => r.scores?.[dims[i]] ?? 0)
      .filter(Boolean)
      .sort((a, b) => a - b)

    if (values.length > 0) {
      const mean = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      const p25 = values[Math.floor(values.length * 0.25)] ?? mean
      const p75 = values[Math.floor(values.length * 0.75)] ?? mean
      byDimension[dimKeys[i]] = { mean, p25, p75 }
    }
  }

  return NextResponse.json({
    totalEvaluations: count,
    benchmark,
    byDimension,
    patterns: COLLECTIVE_BASELINE.patterns, // patrones se mantienen hardcoded por ahora
    source: 'realtime',
    ownCount: count,
  })
}
