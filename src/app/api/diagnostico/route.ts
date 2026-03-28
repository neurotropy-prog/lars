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
import { computeScores, computeConvertScores } from '@/lib/scoring'
import { generateHash } from '@/lib/hash'
import { sendDia0Email, sendAmplifyComparisonReadyEmail } from '@/lib/email'
import { getMostCompromised } from '@/lib/insights'
import type { Bloque1Answers } from '@/components/gateway/GatewayBloque1'
import type { Bloque2Answers } from '@/lib/gateway-bloque2-data'

interface DiagnosticoPayload {
  email: string
  p1: string
  p2?: string
  bloque1: Bloque1Answers
  bloque2: Bloque2Answers
  update?: boolean
  mode?: 'deepen' | 'convert'
  sliders?: Record<string, number>
  ref?: string // AMPLIFY invite_hash si viene por referencia
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

  const { email, p1, bloque1, bloque2, update, mode } = payload

  // ── Geo capture via IP (nice-to-have, no bloquea el flujo) ────────────────
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  let geo = { country: '', city: '', region: '' }
  try {
    if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: AbortSignal.timeout(2000),
      })
      if (geoRes.ok) {
        const geoData = await geoRes.json()
        geo = {
          country: geoData.country_code || '',
          city: geoData.city || '',
          region: geoData.region || '',
        }
      }
    }
  } catch { /* silencioso — geo es nice-to-have */ }

  // Validación básica — modo convert solo requiere p1, p2 y sliders
  if (mode === 'convert') {
    if (!email || !p1 || !payload.sliders) {
      return NextResponse.json({ error: 'Faltan campos requeridos (convert)' }, { status: 400 })
    }
  } else if (!email || !p1 || !bloque1 || !bloque2) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  // Calcular scores según modo
  const scores = mode === 'convert'
    ? computeConvertScores(p1, (payload as DiagnosticoPayload).p2 ?? 'C', payload.sliders!)
    : computeScores(p1, bloque1, bloque2)

  const supabase = createAdminClient()

  // ── Detectar email repetido ───────────────────────────────────────────────
  const { data: existing } = await supabase
    .from('diagnosticos')
    .select('hash')
    .eq('email', email.trim().toLowerCase())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing?.hash && !update) {
    // Email ya existe — devolver hash existente para mostrar opciones
    return NextResponse.json({ hash: existing.hash, existing: true })
  }

  // ── Modo update: actualizar registro existente con nuevas respuestas ──────
  if (existing?.hash && update && bloque1 && bloque2) {
    const updatedScores = computeScores(p1, bloque1, bloque2)
    const updatedResponses = {
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
    const updatedProfile = detectProfile(bloque2.p6, bloque1.p2, bloque1.p4)
    const updatedScoresToStore = {
      global:        updatedScores.global,
      d1_regulacion: updatedScores.d1,
      d2_sueno:      updatedScores.d2,
      d3_claridad:   updatedScores.d3,
      d4_emocional:  updatedScores.d4,
      d5_alegria:    updatedScores.d5,
      label:         updatedScores.label,
    }

    const { error: updateError } = await supabase
      .from('diagnosticos')
      .update({
        responses: updatedResponses,
        scores: updatedScoresToStore,
        profile: updatedProfile,
      })
      .eq('hash', existing.hash)

    if (updateError) {
      console.error('[diagnostico] Error actualizando:', updateError)
      return NextResponse.json({ error: 'Error actualizando diagnóstico' }, { status: 500 })
    }

    return NextResponse.json({ hash: existing.hash })
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
  const responses = mode === 'convert'
    ? {
        p1,
        p2: payload.p2 ?? 'C',
        p3: null, // no contestada en convert
        p4: null,
        p5: null,
        p6: null,
        p7: {
          regulacion: payload.sliders!['d1'] ?? 5,
          sueno:      payload.sliders!['d2'] ?? 5,
          claridad:   payload.sliders!['d3'] ?? 5,
          emocional:  payload.sliders!['d4'] ?? 5,
          alegria:    payload.sliders!['d5'] ?? 5,
        },
        p8: null,
        mode: 'convert',
      }
    : {
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

  const profile = mode === 'convert'
    ? {
        ego_primary: 'Desconocido', // no tenemos P6 en convert
        shame_level: 'low',
        denial_detected: (payload.p2 ?? 'C') === 'D',
      }
    : detectProfile(bloque2.p6, bloque1.p2, bloque1.p4)

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

  const confidenceChain = mode === 'convert'
    ? {
        d1_first_truth: false,  // saltada en convert
        d2_collective_data: false,
        d3_mirror_1: false,
        d4_mirror_2: false,
        d5_bisagra: true,
        d6_email: true,
        d7_result: false,
        abandoned_at_deposit: null,
        mode: 'convert',
      }
    : {
        d1_first_truth: true,
        d2_collective_data: true,
        d3_mirror_1: true,
        d4_mirror_2: true,
        d5_bisagra: true,
        d6_email: true,
        d7_result: false,
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
      ...(mode === 'convert' ? { mode: 'convert' } : {}),
      ...(payload.ref ? { referred_by: payload.ref } : {}),
      ...geo,
    },
  })

  if (insertError) {
    console.error('[diagnostico] Error insertando en Supabase:', insertError)
    return NextResponse.json({ error: 'Error guardando diagnóstico' }, { status: 500 })
  }

  // ── AMPLIFY: auto-aceptar comparación si viene por ?ref= ────────────────
  if (payload.ref && typeof payload.ref === 'string') {
    void (async () => {
      try {
        // Obtener el ID del diagnóstico recién creado
        const { data: newDiag } = await supabase
          .from('diagnosticos')
          .select('id')
          .eq('hash', hash)
          .single()

        if (!newDiag) return

        // Buscar invitación pending con este invite_hash
        const { data: invite } = await supabase
          .from('amplify_invites')
          .select('id, status, inviter_id')
          .eq('invite_hash', payload.ref)
          .eq('status', 'pending')
          .single()

        if (!invite) return

        // Generar compare_hash único
        let compareHash = generateHash(12)
        const { data: hashCollision } = await supabase
          .from('amplify_invites')
          .select('id')
          .eq('compare_hash', compareHash)
          .single()
        if (hashCollision) compareHash = generateHash(12)

        // Detectar perfil del invitado para guardar en la invitación
        const profileInvitee = mode !== 'convert'
          ? detectProfile(bloque2.p6, bloque1.p2, bloque1.p4).ego_primary as string
          : null

        // Auto-aceptar: vincular invitee, generar compare_hash, marcar accepted
        await supabase
          .from('amplify_invites')
          .update({
            invitee_id: newDiag.id,
            status: 'accepted',
            completed_at: new Date().toISOString(),
            accepted_at: new Date().toISOString(),
            compare_hash: compareHash,
            profile_invitee: profileInvitee,
          })
          .eq('id', invite.id)

        // Obtener datos del invitador para emails
        const { data: inviter } = await supabase
          .from('diagnosticos')
          .select('email, hash, meta')
          .eq('id', invite.inviter_id)
          .single()

        if (!inviter) return

        // Actualizar meta del invitador (comparaciones activas)
        const currentMeta = (inviter.meta as Record<string, unknown>) ?? {}
        const activeCount = ((currentMeta.amplify_comparisons_active as number) ?? 0) + 1
        void supabase
          .from('diagnosticos')
          .update({ meta: { ...currentMeta, amplify_comparisons_active: activeCount } })
          .eq('id', invite.inviter_id)
          .then(({ error: metaErr }) => {
            if (metaErr) console.error('[diagnostico] Error updating inviter meta:', metaErr)
          })

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://lars.institutoepigenetico.com'

        // Extraer iniciales del invitado (para el email al invitador)
        const inviteeLocalPart = email.trim().toLowerCase().split('@')[0] ?? ''
        const inviteeParts = inviteeLocalPart.split(/[.\-_]/).filter(Boolean)
        const inviteeInitials = inviteeParts.length >= 2
          ? (inviteeParts[0][0] + inviteeParts[1][0]).toUpperCase()
          : inviteeLocalPart.substring(0, 2).toUpperCase()

        // Extraer iniciales del invitador (para el email al invitado)
        const inviterEmail = inviter.email as string
        const inviterLocalPart = inviterEmail.split('@')[0] ?? ''
        const inviterParts = inviterLocalPart.split(/[.\-_]/).filter(Boolean)
        const inviterInitials = inviterParts.length >= 2
          ? (inviterParts[0][0] + inviterParts[1][0]).toUpperCase()
          : inviterLocalPart.substring(0, 2).toUpperCase()

        // Email al INVITADOR: "XX ha completado su diagnóstico"
        const inviterCompareUrl = `${baseUrl}/mapa/${inviter.hash as string}/comparar/${compareHash}`
        void sendAmplifyComparisonReadyEmail({
          to: inviterEmail,
          inviteeInitials,
          compareUrl: inviterCompareUrl,
          inviterMapHash: inviter.hash as string,
        }).catch((err) => {
          console.error('[diagnostico] Error sending comparison email to inviter:', err)
        })

        // Email al INVITADO: "XX te ha comparado — mira la comparación"
        const inviteeCompareUrl = `${baseUrl}/mapa/${hash}/comparar/${compareHash}`
        void sendAmplifyComparisonReadyEmail({
          to: email.trim().toLowerCase(),
          inviteeInitials: inviterInitials, // en este caso el "invitee" del email es el invitador
          compareUrl: inviteeCompareUrl,
          inviterMapHash: hash, // hash del invitado para unsubscribe
        }).catch((err) => {
          console.error('[diagnostico] Error sending comparison email to invitee:', err)
        })
      } catch (err) {
        console.error('[diagnostico] Error linking AMPLIFY invite:', err)
      }
    })()
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
