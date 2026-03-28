/**
 * GET /api/admin/amplify-stats — Métricas AMPLIFY para admin
 *
 * Retorna: invitaciones, completadas, comparaciones, K-factor,
 * conversiones atribuidas a AMPLIFY.
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'No autorizado' }, { status })
  }

  const supabase = createAdminClient()

  try {
    // Todas las invitaciones
    const { data: allInvites } = await supabase
      .from('amplify_invites')
      .select('id, inviter_id, invitee_id, status, invitee_converted')

    const invites = allInvites ?? []

    const invites_sent = invites.length
    const invites_completed = invites.filter((i) => i.invitee_id !== null).length
    const comparisons_accepted = invites.filter((i) => i.status === 'accepted').length
    const conversions_from_amplify = invites.filter((i) => i.invitee_converted === true).length
    const completion_rate = invites_sent > 0
      ? Math.round((invites_completed / invites_sent) * 100)
      : 0

    // Unique inviters
    const uniqueInviters = new Set(invites.map((i) => i.inviter_id)).size

    // K-factor = (invites per user) × (completion rate)
    const invitesPerUser = uniqueInviters > 0 ? invites_sent / uniqueInviters : 0
    const k_factor = invitesPerUser * (completion_rate / 100)

    return NextResponse.json({
      invites_sent,
      invites_completed,
      completion_rate,
      comparisons_accepted,
      conversions_from_amplify,
      k_factor: Math.round(k_factor * 100) / 100,
      unique_inviters: uniqueInviters,
    })
  } catch (err) {
    console.error('[admin/amplify-stats] Error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
