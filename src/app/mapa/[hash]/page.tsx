/**
 * /mapa/[hash] — Server Component
 *
 * Carga el diagnóstico desde Supabase, computa el estado de evolución,
 * genera contenido personalizado y pasa todo a MapaClient.
 * No indexable. Sin autenticación. La URL con hash es la llave.
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import {
  buildDimensionResult,
  getMostCompromised,
  type DimensionKey,
} from '@/lib/insights'
import {
  computeEvolutionState,
  type MapEvolutionData,
} from '@/lib/map-evolution'
import { getArchetype } from '@/lib/content/archetypes'
import { getD7Insight } from '@/lib/content/collective-insights-d7'
import { getSubdimensionConfig } from '@/lib/content/subdimensions'
import { getBookExcerpt } from '@/lib/content/book-excerpts'
import MapaClient from './MapaClient'
import SiteHeader from '@/components/SiteHeader'

// ─── METADATA ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Tu Mapa de Regulación · L.A.R.S.',
  description: 'Tu evaluación personal de regulación nerviosa.',
  robots: { index: false, follow: false },
}

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface ScoreRow {
  global: number
  d1_regulacion: number
  d2_sueno: number
  d3_claridad: number
  d4_emocional: number
  d5_alegria: number
  label: string
}

interface MetaRow {
  last_visited_at?: string | null
}

interface ResponsesRow {
  p1: string
  p2: string
  p3: string[]
  p4: string
  p5: string
  p6: string
  p7: Record<string, number>
  p8: string
}

interface FunnelRow {
  converted_week1?: boolean
  paid?: boolean
  [key: string]: unknown
}

interface DiagnosticoRow {
  scores: ScoreRow
  meta: MetaRow
  created_at: string
  responses: ResponsesRow
  map_evolution: MapEvolutionData
  profile: Record<string, unknown>
  funnel: FunnelRow
}

// ─── PÁGINA ───────────────────────────────────────────────────────────────────

export default async function MapaPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await params

  let data: DiagnosticoRow | null = null
  try {
    const supabase = createAdminClient()
    const result = await supabase
      .from('diagnosticos')
      .select('scores, meta, created_at, responses, map_evolution, profile, funnel')
      .eq('hash', hash)
      .single<DiagnosticoRow>()
    if (result.error) {
      console.error('[mapa] Supabase error:', result.error.message, '— hash:', hash)
      notFound()
    }
    if (!result.data) {
      console.error('[mapa] Hash no encontrado en BD:', hash)
      notFound()
    }
    data = result.data
  } catch (err) {
    console.error('[mapa] Error inesperado:', err instanceof Error ? err.message : err, '— hash:', hash)
    notFound()
  }

  const { scores, meta, created_at, responses, map_evolution, profile, funnel } = data!

  const d1 = scores.d1_regulacion
  const d2 = scores.d2_sueno
  const d3 = scores.d3_claridad
  const d4 = scores.d4_emocional
  const d5 = scores.d5_alegria
  const global = scores.global

  const dimensionResults = (
    [['d1', d1], ['d2', d2], ['d3', d3], ['d4', d4], ['d5', d5]] as [DimensionKey, number][]
  ).map(([key, score]) => buildDimensionResult(key, score))

  const { key: mostCompromisedKey, firstStep, score: worstScore } = getMostCompromised(d1, d2, d3, d4, d5)

  // ── Evolución del mapa ─────────────────────────────────────────────────────

  const evolution = computeEvolutionState(created_at, map_evolution)

  // Arquetipo (Día 3)
  const archetype = evolution.archetype.unlocked
    ? getArchetype(responses.p6, responses.p4, responses.p2)
    : null

  // Insight D7 (Día 7)
  const d7InsightData = evolution.insightD7.unlocked
    ? getD7Insight(mostCompromisedKey, worstScore)
    : null

  // Subdimensiones (Día 14)
  const subdimensionConfig = evolution.subdimensions.unlocked
    ? getSubdimensionConfig(mostCompromisedKey)
    : null

  // Subdimension scores (si completadas)
  let subdimensionScores: Record<string, number> | null = null
  if (map_evolution.subdimensions_completed && map_evolution.subdimension_responses) {
    const { computeSubdimensionScores } = await import('@/lib/content/subdimensions')
    subdimensionScores = computeSubdimensionScores(
      getSubdimensionConfig(mostCompromisedKey),
      map_evolution.subdimension_responses,
    )
  }

  // Book excerpt (Día 21)
  const bookExcerpt = evolution.bookExcerpt.unlocked
    ? getBookExcerpt(mostCompromisedKey)
    : null

  // Reevaluación (Día 30/90)
  const originalSliders = responses.p7 ?? {
    regulacion: 5, sueno: 5, claridad: 5, emocional: 5, alegria: 5,
  }
  // Normalizar keys de sliders a d1-d5
  const sliderMap: Record<string, number> = {
    d1: originalSliders.regulacion ?? originalSliders.d1 ?? 5,
    d2: originalSliders.sueno ?? originalSliders.d2 ?? 5,
    d3: originalSliders.claridad ?? originalSliders.d3 ?? 5,
    d4: originalSliders.emocional ?? originalSliders.d4 ?? 5,
    d5: originalSliders.alegria ?? originalSliders.d5 ?? 5,
  }

  const originalScores = {
    global,
    d1, d2, d3, d4, d5,
  }

  // Worst dimension name for book excerpt
  const worstDimResult = dimensionResults.find((d) => d.key === mostCompromisedKey)

  return (
    <>
    <SiteHeader variant="default" />
    <MapaClient
      global={global}
      dimensionResults={dimensionResults}
      firstStep={firstStep}
      mostCompromisedKey={mostCompromisedKey}
      hash={hash}
      createdAt={created_at}
      lastVisitedAt={meta?.last_visited_at ?? null}
      // Evolution
      evolution={evolution}
      archetype={archetype}
      d7Insight={d7InsightData?.insight ?? null}
      subdimensionConfig={subdimensionConfig}
      subdimensionScores={subdimensionScores}
      bookExcerpt={bookExcerpt}
      originalSliders={sliderMap}
      originalScores={originalScores}
      reevaluations={map_evolution.reevaluations ?? []}
      reevaluationScores={map_evolution.reevaluation_scores ?? null}
      worstDimensionName={worstDimResult?.name ?? ''}
      worstScore={worstScore}
      hasPaid={funnel?.converted_week1 === true || funnel?.paid === true}
    />
    </>
  )
}
