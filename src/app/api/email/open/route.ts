/**
 * GET /api/email/open?h={hash}&e={emailKey}
 *
 * Tracking pixel endpoint. Registra apertura de email y devuelve
 * un GIF 1x1 transparente. Resetea consecutive_unopened a 0.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import type { MapEvolutionData } from '@/lib/map-evolution'

// GIF 1x1 transparente (43 bytes)
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
)

export async function GET(req: NextRequest): Promise<NextResponse> {
  const hash = req.nextUrl.searchParams.get('h')
  const emailKey = req.nextUrl.searchParams.get('e')

  // Siempre devolver el pixel, incluso si faltan params (no romper el email)
  if (!hash || !emailKey) {
    return gifResponse()
  }

  try {
    const supabase = createAdminClient()

    const { data } = await supabase
      .from('diagnosticos')
      .select('map_evolution, funnel')
      .eq('hash', hash)
      .single()

    if (data) {
      const mapEvolution = data.map_evolution as MapEvolutionData
      const opens = mapEvolution.email_opens ?? {}
      opens[emailKey] = new Date().toISOString()

      // También actualizar funnel.emails_opened para alimentar el LAM
      const funnel = (data.funnel ?? {}) as Record<string, unknown>
      const emailsOpened = Array.isArray(funnel.emails_opened) ? funnel.emails_opened as string[] : []
      if (!emailsOpened.includes(emailKey)) {
        emailsOpened.push(emailKey)
      }

      await supabase
        .from('diagnosticos')
        .update({
          map_evolution: {
            ...mapEvolution,
            email_opens: opens,
            consecutive_unopened: 0,
          },
          funnel: {
            ...funnel,
            emails_opened: emailsOpened,
          },
        })
        .eq('hash', hash)
    }
  } catch (err) {
    // Log pero no fallar — el pixel siempre debe llegar
    console.error('[email/open] Error:', err)
  }

  return gifResponse()
}

function gifResponse(): NextResponse {
  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': String(TRANSPARENT_GIF.length),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
}
