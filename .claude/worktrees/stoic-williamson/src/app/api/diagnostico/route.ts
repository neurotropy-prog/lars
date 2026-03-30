/**
 * /api/diagnostico — POST
 *
 * Recibe las respuestas del gateway, calcula scores, persiste en Supabase,
 * genera hash único para la URL del mapa, envía email día 0 con Resend
 * y devuelve el hash para el redirect inmediato.
 *
 * Nunca expone datos sensibles al cliente.
 * Usa SUPABASE_SERVICE_ROLE_KEY — solo en backend.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { computeScores } from '@/lib/scoring'
import { generateHash } from '@/lib/hash'
import { sendDia0Email } from '@/lib/email'
import { getMostCompromised } from '@/lib/insights'
import type { Bloque1Answers } from '@/components/gateway/GatewayBloque1'
import type { Bloque2Answers } from '@/lib/gateway-bloque2-data'

interface DiagnosticoPayload {
  email: string
  p1: string
  bloque1: Bloque1Answers
  bloque2: Bloque2Answers
}

function detectProfile(p6: string, p2: string, p4: string): Record<string, unknown> {
  const profileMap: Record<string, string> = {
    A: 'Productivo Colapsado',
    B: 'Fuerte Invisible',
    C: 'Cuidador Exhausto',
    D: 'Controlador Paralizado',
  }
  const shameLevel = p6 === 'B' ? 'high' : p4 === 'C' ? 'medium' : 'low'
  const denialDetected = p2 === 'D'
  return {
    ego_primary: profileMap[p6] ?? 'Desconocido',
    shame_level: shameLevel,
    denial_detected: denialDetected,
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let payload: DiagnosticoPayload

  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const { email, p1, bloque1, bloque2 } = payload

  // Validación básica
  if (!email || !p1 || !bloque1 || !bloque2) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  // Calcular scores
  const scores = computeScores(p1, bloque1, bloque2)

  const supabase = createAdminClient()

  // ── Detectar email repetido ───────────────────────────────────────────────
  const { data: existing } = await supabase
    .from('diagnosticos')
    .select('hash')
    .eq('email', email.trim().toLowerCase())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing?.hash) {
    // Email ya existe — devolver hash existente sin reenviar email
    // (el frontend mostrará el mapa actualizado con las respuestas previas)
    return NextResponse.json({ hash: existing.hash, existing: true })
  }

  // ── Generar hash único ────────────────────────────────────────────────────
  let hash = generateHash(12)
  // Garantizar unicidad (colisión extremadamente improbable pero se verifica)
  const { data: hashCheck } = await supabase
    .from('diagnosticos')
    .select('id')
    .eq('hash', hash)
    .single()

  if (hashCheck) {
    hash = generateHash(12) // regenerar en caso de colisión
  }

  // ── Preparar datos a persistir ────────────────────────────────────────────
  const responses = {
    p1,
    p2: bloque1.p2,
    p3: bloque1.p3Selections,
    p4: bloque1.p4,
    p5: bloque2.p5,
    p6: bloque2.p6,
    p7: {
      regulacion: bloque2.sliders['d1'] ?? 5,
      sueno:      bloque2.sliders['d2'] ?? 5,
      claridad:   bloque2.sliders['d3'] ?? 5,
      emocional:  bloque2.sliders['d4'] ?? 5,
      alegria:    bloque2.sliders['d5'] ?? 5,
    },
    p8: bloque2.p8,
  }

  const scoresToStore = {
    global:        scores.global,
    d1_regulacion: scores.d1,
    d2_sueno:      scores.d2,
    d3_claridad:   scores.d3,
    d4_emocional:  scores.d4,
    d5_alegria:    scores.d5,
    label:         scores.label,
  }

  const profile = detectProfile(bloque2.p6, bloque1.p2, bloque1.p4)

  const mapEvolution = {
    archetype_unlocked: false,
    archetype_viewed: false,
    insight_d7_unlocked: false,
    insight_d7_viewed: false,
    session_unlocked: false,
    session_booked: false,
    subdimensions_unlocked: false,
    subdimensions_completed: false,
    subdimension_responses: null,
    book_excerpt_unlocked: false,
    book_excerpt_viewed: false,
    reevaluation_unlocked: false,
    reevaluation_completed: false,
    reevaluation_scores: null,
    reevaluations: [],
  }

  const confidenceChain = {
    d1_first_truth: true,   // llegó a la bisagra → completó todos los pasos
    d2_collective_data: true,
    d3_mirror_1: true,
    d4_mirror_2: true,
    d5_bisagra: true,
    d6_email: true,         // dio el email → cadena completa
    d7_result: false,       // se marca al visitar el mapa
    abandoned_at_deposit: null,
  }

  const funnel = {
    gateway_completed: true,
    email_captured: true,
    map_visits: 0,
    map_last_visit: null,
    cta_clicked: false,
    converted_week1: false,
    converted_program: false,
    session_booked: false,
  }

  // ── Persistir en Supabase ─────────────────────────────────────────────────
  const { error: insertError } = await supabase.from('diagnosticos').insert({
    email: email.trim().toLowerCase(),
    hash,
    responses,
    scores: scoresToStore,
    profile,
    map_evolution: mapEvolution,
    confidence_chain: confidenceChain,
    funnel,
    meta: {
      source: req.headers.get('referer') ?? 'direct',
      device: req.headers.get('user-agent') ?? 'unknown',
    },
  })

  if (insertError) {
    console.error('[diagnostico] Error insertando en Supabase:', insertError)
    return NextResponse.json({ error: 'Error guardando diagnóstico' }, { status: 500 })
  }

  // ── Enviar email día 0 (fire-and-forget — no bloquea el redirect) ─────────
  const { key: worstKey } = getMostCompromised(
    scores.d1, scores.d2, scores.d3, scores.d4, scores.d5
  )
  void sendDia0Email({
    to: email.trim(),
    globalScore: scores.global,
    d1: scores.d1,
    d2: scores.d2,
    d3: scores.d3,
    d4: scores.d4,
    d5: scores.d5,
    mapHash: hash,
  }).catch((err) => {
    // No bloquear el flujo si el email falla
    console.error('[diagnostico] Error enviando email día 0:', err)
  })

  return NextResponse.json({ hash })
}
