/**
 * POST /api/admin/amplify-migrate — Migra invitaciones "completed" a "accepted"
 *
 * Script de una sola ejecución para invitaciones que quedaron en status "completed"
 * bajo el flujo antiguo (que requería aceptación manual).
 *
 * Genera compare_hash, envía emails a ambas partes, y marca como accepted.
 *
 * Protegido por verifyAdmin (misma auth que el resto de admin).
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'
import { generateHash } from '@/lib/hash'
import { sendAmplifyComparisonReadyEmail } from '@/lib/email'
import { verifyAdmin } from '@/lib/admin-auth'

export async function POST(): Promise<NextResponse> {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const { authorized, status } = await verifyAdmin(await cookies())
  if (!authorized) {
    return NextResponse.json({ error: 'No autorizado' }, { status })
  }

  const supabase = createAdminClient()

  // ── Buscar invitaciones en status "completed" ───────────────────────────
  const { data: pendingInvites, error: fetchError } = await supabase
    .from('amplify_invites')
    .select('id, invite_hash, inviter_id, invitee_id')
    .eq('status', 'completed')

  if (fetchError) {
    console.error('[amplify-migrate] Error fetching:', fetchError)
    return NextResponse.json({ error: 'Error consultando invitaciones' }, { status: 500 })
  }

  if (!pendingInvites || pendingInvites.length === 0) {
    return NextResponse.json({ migrated: 0, message: 'No hay invitaciones pendientes de migrar' })
  }

  const results: { invite_hash: string; status: string; error?: string }[] = []

  for (const invite of pendingInvites) {
    try {
      if (!invite.invitee_id) {
        results.push({ invite_hash: invite.invite_hash, status: 'skipped', error: 'No tiene invitee_id' })
        continue
      }

      // Generar compare_hash único
      let compareHash = generateHash(12)
      const { data: collision } = await supabase
        .from('amplify_invites')
        .select('id')
        .eq('compare_hash', compareHash)
        .single()
      if (collision) compareHash = generateHash(12)

      // Obtener datos del invitee
      const { data: invitee } = await supabase
        .from('diagnosticos')
        .select('email, hash, profile')
        .eq('id', invite.invitee_id)
        .single()

      // Obtener datos del inviter
      const { data: inviter } = await supabase
        .from('diagnosticos')
        .select('email, hash, meta')
        .eq('id', invite.inviter_id)
        .single()

      if (!invitee || !inviter) {
        results.push({ invite_hash: invite.invite_hash, status: 'skipped', error: 'Diagnóstico no encontrado' })
        continue
      }

      const profileInvitee = (invitee.profile as Record<string, unknown>)?.ego_primary as string | undefined

      // Actualizar invitación a accepted
      const { error: updateError } = await supabase
        .from('amplify_invites')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          compare_hash: compareHash,
          profile_invitee: profileInvitee ?? null,
        })
        .eq('id', invite.id)

      if (updateError) {
        results.push({ invite_hash: invite.invite_hash, status: 'error', error: updateError.message })
        continue
      }

      // Actualizar meta del invitador
      const currentMeta = (inviter.meta as Record<string, unknown>) ?? {}
      const activeCount = ((currentMeta.amplify_comparisons_active as number) ?? 0) + 1
      await supabase
        .from('diagnosticos')
        .update({ meta: { ...currentMeta, amplify_comparisons_active: activeCount } })
        .eq('id', invite.inviter_id)

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://lars.institutoepigenetico.com'

      // Iniciales del invitado
      const inviteeEmail = invitee.email as string
      const inviteeLocal = inviteeEmail.split('@')[0] ?? ''
      const inviteeParts = inviteeLocal.split(/[.\-_]/).filter(Boolean)
      const inviteeInitials = inviteeParts.length >= 2
        ? (inviteeParts[0][0] + inviteeParts[1][0]).toUpperCase()
        : inviteeLocal.substring(0, 2).toUpperCase()

      // Iniciales del invitador
      const inviterEmail = inviter.email as string
      const inviterLocal = inviterEmail.split('@')[0] ?? ''
      const inviterParts = inviterLocal.split(/[.\-_]/).filter(Boolean)
      const inviterInitials = inviterParts.length >= 2
        ? (inviterParts[0][0] + inviterParts[1][0]).toUpperCase()
        : inviterLocal.substring(0, 2).toUpperCase()

      // Email al INVITADOR
      const inviterCompareUrl = `${baseUrl}/mapa/${inviter.hash as string}/comparar/${compareHash}`
      await sendAmplifyComparisonReadyEmail({
        to: inviterEmail,
        inviteeInitials,
        compareUrl: inviterCompareUrl,
        inviterMapHash: inviter.hash as string,
      })

      // Email al INVITADO
      const inviteeCompareUrl = `${baseUrl}/mapa/${invitee.hash as string}/comparar/${compareHash}`
      await sendAmplifyComparisonReadyEmail({
        to: inviteeEmail,
        inviteeInitials: inviterInitials,
        compareUrl: inviteeCompareUrl,
        inviterMapHash: invitee.hash as string,
      })

      results.push({ invite_hash: invite.invite_hash, status: 'migrated' })
    } catch (err) {
      results.push({
        invite_hash: invite.invite_hash,
        status: 'error',
        error: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }

  const migrated = results.filter((r) => r.status === 'migrated').length
  return NextResponse.json({ migrated, total: pendingInvites.length, results })
}
