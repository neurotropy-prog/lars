/**
 * /api/admin/leads/[hash]/action — POST
 *
 * Ejecuta una acción de Javi sobre un lead:
 * - personal_note: guarda nota personal
 * - video: registra envío de video personalizado
 * - early_unlock: desbloquea contenido anticipadamente en map_evolution
 * - express_session: crea slot especial de 10 min
 * - manual_email: envía email manual con Resend
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { Resend } from 'resend'
import type { ActionType, PersonalAction } from '@/lib/profile-intelligence'

const VALID_ACTIONS: ActionType[] = ['personal_note', 'video', 'early_unlock', 'express_session', 'manual_email']

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY ?? '')
}

function getFromEmail(): string {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev
    ? 'onboarding@resend.dev'
    : 'Javier · Instituto Epigenético <regulacion@institutoepigenetico.com>'
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'https://lars.institutoepigenetico.com'
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ hash: string }> },
) {
  // Auth
  const isDev = process.env.NODE_ENV === 'development'
  const adminSecret = req.headers.get('x-admin-secret')
  const validSecret = process.env.ADMIN_SECRET
  if (!isDev && (!validSecret || adminSecret !== validSecret)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { hash } = await params

  let body: { type: ActionType; content?: string; notify_lead?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  if (!body.type || !VALID_ACTIONS.includes(body.type)) {
    return NextResponse.json({ error: `Tipo de acción inválido. Válidos: ${VALID_ACTIONS.join(', ')}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Fetch lead actual
  const { data: row, error: fetchError } = await supabase
    .from('diagnosticos')
    .select('*')
    .eq('hash', hash)
    .single()

  if (fetchError || !row) {
    return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
  }

  // Crear la acción
  const action: PersonalAction = {
    type: body.type,
    content: body.content ?? '',
    created_at: new Date().toISOString(),
    notify_lead: body.notify_lead,
  }

  // Append al array de personal_actions
  const existingActions: PersonalAction[] = row.personal_actions ?? []
  const updatedActions = [...existingActions, action]

  // Preparar updates
  const updates: Record<string, unknown> = {
    personal_actions: updatedActions,
  }

  // ── Efectos secundarios por tipo de acción ──────────────────────────────

  if (body.type === 'early_unlock') {
    // Desbloquear contenido anticipadamente en map_evolution
    const me = row.map_evolution ?? {}
    updates.map_evolution = {
      ...me,
      archetype_unlocked: true,
      insight_d7_unlocked: true,
      subdimensions_unlocked: true,
    }
  }

  if (body.type === 'express_session') {
    // Crear slot especial de 10 min en bookings
    const now = new Date()
    const slotStart = new Date(now.getTime() + 24 * 60 * 60 * 1000) // mañana
    slotStart.setHours(10, 0, 0, 0)
    const slotEnd = new Date(slotStart.getTime() + 10 * 60 * 1000) // +10 min

    await supabase.from('bookings').insert({
      diagnostico_id: row.id,
      email: row.email,
      map_hash: hash,
      slot_start: slotStart.toISOString(),
      slot_end: slotEnd.toISOString(),
      status: 'pending_confirmation',
    })
  }

  // ── Guardar updates en diagnosticos ─────────────────────────────────────

  const { error: updateError } = await supabase
    .from('diagnosticos')
    .update(updates)
    .eq('hash', hash)

  if (updateError) {
    console.error('[admin/leads/action] Error updating:', updateError)
    return NextResponse.json({ error: 'Error guardando acción' }, { status: 500 })
  }

  // ── Enviar notificación al lead si se solicita ──────────────────────────

  if (body.notify_lead && row.email && body.content) {
    try {
      const mapUrl = `${getBaseUrl()}/mapa/${hash}`
      const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background-color: #FFFBEF; font-family: Lora, Inter, system-ui, sans-serif; color: #1E1310;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr><td>
      <img src="${getBaseUrl()}/img/logo-instituto-epigenetico.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />
      <p style="font-size: 14px; color: #1E1310; line-height: 1.8; margin: 0 0 32px 0; white-space: pre-line;">${body.content}</p>
      <table cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
        <tr><td style="background: #F5F564; border-radius: 100px; padding: 16px 32px;">
          <a href="${mapUrl}" style="color: #1E1310; font-size: 15px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            Ver mi mapa
          </a>
        </td></tr>
      </table>
      <div style="height: 1px; background: #E8E2D0; margin-bottom: 24px;"></div>
      <p style="font-size: 13px; color: #8A7E75; line-height: 1.6; margin: 0;">Confidencial. Solo tú puedes verlo.</p>
    </td></tr>
  </table>
</body>
</html>`

      const subjectByType: Record<string, string> = {
        personal_note: 'Un mensaje de Javier sobre tu diagnóstico',
        video: 'Javier ha grabado algo para ti',
        early_unlock: 'Contenido nuevo desbloqueado en tu mapa',
        express_session: 'Javier quiere hablar contigo — 10 minutos',
        manual_email: 'Un mensaje del Instituto Epigenético',
      }

      await getResend().emails.send({
        from: getFromEmail(),
        to: row.email,
        subject: subjectByType[body.type] ?? 'Un mensaje del Instituto Epigenético',
        html,
      })
    } catch (emailErr) {
      console.error('[admin/leads/action] Error sending email:', emailErr)
      // No fallar la acción si el email falla
    }
  }

  return NextResponse.json({
    success: true,
    action,
    total_actions: updatedActions.length,
  })
}
