/**
 * /mapa/[hash]/comparar/[compare_hash] — Vista comparativa AMPLIFY
 *
 * Server component que carga los datos de comparación directamente
 * desde Supabase (sin pasar por la API route) para máxima eficiencia.
 *
 * Seguridad: verifica que el hash del viewer es una de las dos personas.
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { generateComparisonInsight } from '@/lib/amplify-insights'
import type { DimensionScores } from '@/lib/amplify-insights'
import CompararClient from './CompararClient'

// ── Metadata (no indexable) ───────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Tu Comparación — L.A.R.S.©',
  robots: { index: false, follow: false },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface DiagnosticoScores {
  global: number
  d1_regulacion: number
  d2_sueno: number
  d3_claridad: number
  d4_emocional: number
  d5_alegria: number
  label: string
}

function toDimensionScores(s: DiagnosticoScores): DimensionScores {
  return {
    global: s.global,
    d1: s.d1_regulacion,
    d2: s.d2_sueno,
    d3: s.d3_claridad,
    d4: s.d4_emocional,
    d5: s.d5_alegria,
  }
}

function getInitials(email: string | null): string {
  if (!email) return '??'
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ hash: string; compare_hash: string }>
}

export default async function CompararPage({ params }: PageProps) {
  const { hash, compare_hash } = await params

  if (!hash || !compare_hash) {
    notFound()
  }

  const supabase = createAdminClient()

  // 1. Buscar invitación por compare_hash
  const { data: invite } = await supabase
    .from('amplify_invites')
    .select('id, inviter_id, invitee_id, status, comparison_viewed_count')
    .eq('compare_hash', compare_hash.trim())
    .single()

  if (!invite || invite.status !== 'accepted') {
    notFound()
  }

  // 2. Cargar ambos diagnósticos
  const { data: inviterDiag } = await supabase
    .from('diagnosticos')
    .select('id, hash, email, scores, profile')
    .eq('id', invite.inviter_id)
    .single()

  const { data: inviteeDiag } = await supabase
    .from('diagnosticos')
    .select('id, hash, email, scores, profile')
    .eq('id', invite.invitee_id)
    .single()

  if (!inviterDiag || !inviteeDiag) {
    notFound()
  }

  // 3. Verificar que el viewer (hash) es una de las dos personas
  const isInviter = (inviterDiag.hash as string) === hash.trim()
  const isInvitee = (inviteeDiag.hash as string) === hash.trim()

  if (!isInviter && !isInvitee) {
    notFound()
  }

  // 4. Incrementar vista (fire-and-forget)
  const currentViews = (invite.comparison_viewed_count as number) ?? 0
  void supabase
    .from('amplify_invites')
    .update({ comparison_viewed_count: currentViews + 1 })
    .eq('id', invite.id)
    .then(() => {})

  // 5. Resolver perspectiva
  const myDiag = isInviter ? inviterDiag : inviteeDiag
  const theirDiag = isInviter ? inviteeDiag : inviterDiag

  const myScores = toDimensionScores(myDiag.scores as DiagnosticoScores)
  const theirScores = toDimensionScores(theirDiag.scores as DiagnosticoScores)

  const myProfile = ((myDiag.profile as Record<string, unknown>)?.ego_primary as string) ?? 'Desconocido'
  const theirProfile = ((theirDiag.profile as Record<string, unknown>)?.ego_primary as string) ?? 'Desconocido'

  const theirInitials = getInitials(theirDiag.email as string | null)

  // 6. Generar insight (siempre desde perspectiva invitador para personalización consistente)
  const inviterScores = toDimensionScores(inviterDiag.scores as DiagnosticoScores)
  const inviteeScores = toDimensionScores(inviteeDiag.scores as DiagnosticoScores)
  const inviterProfile = ((inviterDiag.profile as Record<string, unknown>)?.ego_primary as string) ?? 'Desconocido'
  const inviteeProfile = ((inviteeDiag.profile as Record<string, unknown>)?.ego_primary as string) ?? 'Desconocido'

  const { text: insight, brecha_mayor } = generateComparisonInsight(
    inviterScores,
    inviteeScores,
    inviterProfile,
    inviteeProfile,
  )

  return (
    <CompararClient
      myScores={myScores}
      theirScores={theirScores}
      myProfile={myProfile}
      theirProfile={theirProfile}
      theirInitials={theirInitials}
      insight={insight}
      brechaMayor={brecha_mayor}
      mapaHash={hash}
    />
  )
}
