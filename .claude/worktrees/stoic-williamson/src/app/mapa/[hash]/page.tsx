/**
 * /mapa/[hash] — Server Component
 *
 * Carga el diagnóstico desde Supabase y pasa todos los datos a MapaClient.
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
import MapaClient from './MapaClient'

// ─── METADATA ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Tu Mapa de Regulación · L.A.R.S.',
  description: 'Tu diagnóstico personal de regulación nerviosa.',
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

interface DiagnosticoRow {
  scores: ScoreRow
  meta: MetaRow
  created_at: string
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
      .select('scores, meta, created_at')
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

  const { scores, meta, created_at } = data!

  const d1 = scores.d1_regulacion
  const d2 = scores.d2_sueno
  const d3 = scores.d3_claridad
  const d4 = scores.d4_emocional
  const d5 = scores.d5_alegria
  const global = scores.global

  const dimensionResults = (
    [['d1', d1], ['d2', d2], ['d3', d3], ['d4', d4], ['d5', d5]] as [DimensionKey, number][]
  ).map(([key, score]) => buildDimensionResult(key, score))

  const { key: mostCompromisedKey, firstStep } = getMostCompromised(d1, d2, d3, d4, d5)

  return (
    <MapaClient
      global={global}
      dimensionResults={dimensionResults}
      firstStep={firstStep}
      mostCompromisedKey={mostCompromisedKey}
      hash={hash}
      createdAt={created_at}
      lastVisitedAt={meta?.last_visited_at ?? null}
    />
  )
}
