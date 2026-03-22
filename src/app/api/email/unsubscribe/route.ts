/**
 * GET /api/email/unsubscribe?h={hash}
 *
 * Marca email_unsubscribed = true en map_evolution.
 * Devuelve una página HTML minimalista de confirmación (dark, coherente).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import type { MapEvolutionData } from '@/lib/map-evolution'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const hash = req.nextUrl.searchParams.get('h')

  if (!hash) {
    return confirmationPage('Enlace inválido.', false)
  }

  try {
    const supabase = createAdminClient()

    const { data } = await supabase
      .from('diagnosticos')
      .select('map_evolution')
      .eq('hash', hash)
      .single()

    if (!data) {
      return confirmationPage('No se encontró tu registro.', false)
    }

    const mapEvolution = data.map_evolution as MapEvolutionData

    await supabase
      .from('diagnosticos')
      .update({
        map_evolution: {
          ...mapEvolution,
          email_unsubscribed: true,
        },
      })
      .eq('hash', hash)

    return confirmationPage('Te has dado de baja correctamente. No recibirás más emails.', true)
  } catch (err) {
    console.error('[email/unsubscribe] Error:', err)
    return confirmationPage('Error al procesar tu solicitud. Inténtalo de nuevo.', false)
  }
}

function confirmationPage(message: string, success: boolean): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Baja de emails</title>
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #0a252c;
  font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
  color: #F5F5F0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
">
  <div style="
    max-width: 480px;
    padding: 48px 24px;
    text-align: center;
  ">
    <p style="
      font-size: 32px;
      margin: 0 0 24px 0;
    ">${success ? '\u2713' : '\u2717'}</p>
    <p style="
      font-size: 16px;
      color: ${success ? '#F5F5F0' : '#F87171'};
      line-height: 1.6;
      margin: 0;
    ">${message}</p>
    ${success ? `<p style="font-size: 13px; color: #6B7572; margin-top: 24px;">Tu mapa sigue disponible en su URL original.</p>` : ''}
  </div>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
