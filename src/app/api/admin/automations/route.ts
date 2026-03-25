/**
 * /api/admin/automations — GET
 *
 * Stats de los emails automáticos del sistema de evolución.
 * Cuenta enviados, abiertos y tasas por cada email del funnel.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

interface EmailDef {
  key: string
  name: string
  subject: string
  trigger: string
  day: number
  sentFlag: string | null // null = d0 (siempre se envía)
}

const EMAIL_DEFINITIONS: EmailDef[] = [
  { key: 'd0', name: 'Tu Mapa de Regulación', subject: 'Tu Mapa de Regulación', trigger: 'Inmediato al completar gateway', day: 0, sentFlag: null },
  { key: 'd3', name: 'Arquetipo SN', subject: 'Hay algo nuevo en tu mapa de regulación', trigger: 'Día 3 automático', day: 3, sentFlag: 'email_d3_sent' },
  { key: 'd7', name: 'Insight colectivo', subject: 'Tu mapa se ha actualizado', trigger: 'Día 7 automático', day: 7, sentFlag: 'email_d7_sent' },
  { key: 'd10', name: 'Sesión con Javier', subject: 'Javier puede revisar tu mapa contigo', trigger: 'Día 10 automático', day: 10, sentFlag: 'email_d10_sent' },
  { key: 'd14', name: 'Subdimensiones', subject: 'Hay 3 subdimensiones nuevas disponibles', trigger: 'Día 14 automático', day: 14, sentFlag: 'email_d14_sent' },
  { key: 'd21', name: 'Extracto libro', subject: 'Un capítulo escrito para tu situación', trigger: 'Día 21 automático', day: 21, sentFlag: 'email_d21_sent' },
  { key: 'd30', name: 'Reevaluación', subject: 'Un mes desde tu diagnóstico — ¿ha cambiado algo?', trigger: 'Día 30 automático', day: 30, sentFlag: 'email_d30_sent' },
  { key: 'd90', name: 'Reevaluación trimestral', subject: '3 meses desde tu mapa — una pregunta', trigger: 'Día 90+ automático', day: 90, sentFlag: 'email_d90_sent' },
  { key: 'goodbye', name: 'Despedida empática', subject: 'Tu mapa sigue aquí', trigger: '3+ emails sin abrir', day: -1, sentFlag: 'email_goodbye_sent' },
]

export async function GET(req: NextRequest) {
  // Auth
  const isDev = process.env.NODE_ENV === 'development'
  const adminSecret = req.headers.get('x-admin-secret')
  const validSecret = process.env.ADMIN_SECRET
  if (!isDev && (!validSecret || adminSecret !== validSecret)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: rows, error } = await supabase
    .from('diagnosticos')
    .select('map_evolution')

  if (error) {
    console.error('[admin/automations] Supabase error:', error)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }

  const all = rows ?? []
  const total = all.length

  let totalSent = 0
  let totalOpened = 0
  let unsubscribes = 0

  const emails = EMAIL_DEFINITIONS.map((def) => {
    let sent = 0
    let opened = 0

    for (const row of all) {
      const me = row.map_evolution ?? {}
      const opens = me.email_opens ?? {}

      // Contar enviados
      if (def.key === 'd0') {
        // d0 siempre se envía a todos
        sent++
      } else if (def.key === 'd90') {
        // d90 es un array de fechas
        if (Array.isArray(me.email_d90_sent) && me.email_d90_sent.length > 0) sent++
      } else if (def.key === 'goodbye') {
        if (me.email_goodbye_sent) sent++
      } else if (def.sentFlag && me[def.sentFlag]) {
        sent++
      }

      // Contar abiertos
      if (opens[def.key]) opened++
    }

    totalSent += sent
    totalOpened += opened

    const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0

    return {
      key: def.key,
      name: def.name,
      subject: def.subject,
      trigger: def.trigger,
      day: def.day,
      sent,
      opened,
      open_rate: openRate,
    }
  })

  // Contar unsubscribes
  for (const row of all) {
    if (row.map_evolution?.email_unsubscribed) unsubscribes++
  }

  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0

  return NextResponse.json({
    emails,
    global_stats: {
      total_sent: totalSent,
      avg_open_rate: avgOpenRate,
      unsubscribes,
      unsubscribe_rate: total > 0 ? Math.round((unsubscribes / total) * 1000) / 10 : 0,
    },
  })
}
