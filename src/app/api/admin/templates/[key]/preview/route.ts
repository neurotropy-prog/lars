/**
 * /api/admin/templates/[key]/preview — GET
 *
 * Devuelve el HTML renderizado de un email con datos de ejemplo.
 * Acepta query params opcionales para preview con ediciones sin guardar:
 *   ?subject=...&body=...&cta=...
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-auth'
import { EMAIL_DEFAULTS, escapeHtml, textToHtmlParagraphs } from '@/lib/email-defaults'
import { VALID_EMAIL_KEYS } from '@/lib/email-defaults'
import { createAdminClient } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://lars.institutoepigenetico.com'
const LOGO_URL = `${BASE_URL}/Logo-definitivo-IE.png`
const SAMPLE_MAP_URL = `${BASE_URL}/mapa/sample123abc`

const BODY_P_STYLE = 'font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 16px 0;'

function buildEvolutionPreview(bodyHtml: string, buttonText: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#FFFFFF;font-family:'Host Grotesk',system-ui,sans-serif;color:#212426;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <tr><td>
      <img src="${LOGO_URL}" alt="Instituto Epigenético" width="220" style="display:block;width:220px;height:auto;margin:0 0 32px 0;" />
      ${bodyHtml}
      <table cellpadding="0" cellspacing="0" style="margin:32px 0;">
        <tr><td style="background:#264233;border-radius:100px;padding:16px 32px;">
          <a href="${SAMPLE_MAP_URL}" style="color:#FFFFFF;font-size:15px;font-weight:500;text-decoration:none;display:block;white-space:nowrap;">
            ${escapeHtml(buttonText)}
          </a>
        </td></tr>
      </table>
      <div style="height:1px;background:rgba(38, 66, 51, 0.10);margin-bottom:24px;"></div>
      <p style="font-size:13px;color:#878E92;line-height:1.6;margin:0;">
        Este mapa es tuyo. Confidencial. Solo tú puedes verlo.
      </p>
      <p style="font-size:11px;color:#878E92;margin:16px 0 0 0;"><a href="#" style="color:#878E92;text-decoration:underline;">Darme de baja</a></p>
    </td></tr>
  </table>
</body>
</html>`
}

function buildD0Preview(subject: string, ctaText: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#FFFFFF;font-family:'Host Grotesk',system-ui,sans-serif;color:#212426;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <tr><td>
      <img src="${LOGO_URL}" alt="Instituto Epigenético" width="220" style="display:block;width:220px;height:auto;margin:0 0 32px 0;" />
      <p style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#CD796C;margin:0 0 8px 0;">TU MAPA DE REGULACIÓN</p>
      <p style="font-size:48px;font-weight:600;color:#212426;margin:0 0 4px 0;line-height:1;">42<span style="font-size:24px;font-weight:400;color:#2D2D2D;">/100</span></p>
      <p style="font-size:14px;color:#878E92;margin:0 0 40px 0;">Score global de regulación</p>
      <div style="height:1px;background:rgba(38, 66, 51, 0.10);margin-bottom:32px;"></div>
      <p style="font-size:13px;color:#878E92;margin:0 0 6px 0;">Tu dimensión más comprometida</p>
      <p style="font-size:20px;font-weight:500;color:#E87040;margin:0 0 6px 0;">Calidad de Sueño</p>
      <p style="font-size:32px;font-weight:600;color:#E87040;margin:0 0 32px 0;line-height:1;">28<span style="font-size:16px;font-weight:400;color:#2D2D2D;">/100</span></p>
      <p style="font-size:14px;color:#212426;line-height:1.6;margin:0 0 40px 0;padding:20px 24px;background:#EAF2EE;border-left:3px solid #CD796C;border-radius:8px;">
        Empieza por el sueño. No como descanso — como restauración biológica real.
      </p>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
        <tr><td style="background:#264233;border-radius:100px;padding:16px 32px;">
          <a href="${SAMPLE_MAP_URL}" style="color:#FFFFFF;font-size:15px;font-weight:500;text-decoration:none;display:block;white-space:nowrap;">${escapeHtml(ctaText)}</a>
        </td></tr>
      </table>
      <div style="height:1px;background:rgba(38, 66, 51, 0.10);margin-bottom:32px;"></div>
      <p style="font-size:13px;color:#878E92;line-height:1.6;margin:0;">
        Este mapa es tuyo. Evoluciona con el tiempo — cada semana hay algo nuevo.<br>
        Confidencial. Solo tú puedes verlo.
      </p>
      <p style="font-size:11px;color:#878E92;margin:16px 0 0 0;"><a href="#" style="color:#878E92;text-decoration:underline;">Darme de baja</a></p>
    </td></tr>
  </table>
</body>
</html>`
}

function buildGoodbyePreview(bodyText: string, ctaText: string): string {
  const bodyHtml = textToHtmlParagraphs(bodyText, 'font-size: 14px; color: #2D2D2D; line-height: 1.8; margin: 0 0 16px 0;')

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#FFFFFF;font-family:'Host Grotesk',system-ui,sans-serif;color:#212426;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <tr><td>
      <img src="${LOGO_URL}" alt="Instituto Epigenético" width="220" style="display:block;width:220px;height:auto;margin:0 0 32px 0;" />
      ${bodyHtml}
      <p style="font-size:16px;font-weight:500;color:#212426;line-height:1.6;margin:0 0 32px 0;padding:20px 24px;background:#EAF2EE;border-left:3px solid #CD796C;border-radius:8px;">
        Tu mapa es tuyo. Sigue aquí. Sigue vivo.
      </p>
      <p style="font-size:14px;color:#212426;line-height:1.8;margin:0 0 24px 0;">
        Si en algún momento quieres que volvamos a avisarte cuando haya algo nuevo:
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
        <tr><td style="background:#264233;border-radius:100px;padding:16px 32px;">
          <a href="#" style="color:#FFFFFF;font-size:15px;font-weight:500;text-decoration:none;display:block;white-space:nowrap;">${escapeHtml(ctaText)}</a>
        </td></tr>
      </table>
      <p style="font-size:13px;color:#878E92;line-height:1.6;margin:0 0 32px 0;">Sin compromiso. Un clic.</p>
      <div style="height:1px;background:rgba(38, 66, 51, 0.10);margin-bottom:32px;"></div>
      <p style="font-size:14px;color:#212426;line-height:1.6;margin:0 0 4px 0;">Javier A. Martín Ramos</p>
      <p style="font-size:13px;color:#878E92;margin:0 0 24px 0;">Director · Instituto Epigenético</p>
    </td></tr>
  </table>
</body>
</html>`
}

function buildPostPagoPreview(bodyText: string, subject: string, ctaText: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#FFFFFF;font-family:'Host Grotesk',system-ui,sans-serif;color:#212426;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <tr><td>
      <img src="${LOGO_URL}" alt="Instituto Epigenético" width="220" style="display:block;width:220px;height:auto;margin:0 0 32px 0;" />
      <p style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#CD796C;margin:0 0 8px 0;">SEMANA 1</p>
      <p style="font-size:28px;font-weight:600;color:#212426;margin:0 0 8px 0;line-height:1.2;">Tu Semana 1 ha comenzado.</p>
      <p style="font-size:14px;color:#2D2D2D;line-height:1.6;margin:0 0 40px 0;">${escapeHtml(bodyText)}</p>
      <div style="height:1px;background:rgba(38, 66, 51, 0.10);margin-bottom:32px;"></div>
      <p style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#878E92;margin:0 0 8px 0;">TU PROTOCOLO DE SUEÑO DE EMERGENCIA</p>
      <table cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
        <tr><td style="background:#264233;border-radius:100px;padding:14px 28px;">
          <a href="#" style="color:#FFFFFF;font-size:14px;font-weight:500;text-decoration:none;display:block;white-space:nowrap;">Descargar el Protocolo</a>
        </td></tr>
      </table>
      <p style="font-size:13px;color:#878E92;line-height:1.6;margin:0 0 40px 0;">Diseñado por el Dr. Carlos Alvear López.<br>Empieza esta noche. Resultados en 72 horas.</p>
      <div style="height:1px;background:rgba(38, 66, 51, 0.10);margin-bottom:32px;"></div>
      <p style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#878E92;margin:0 0 8px 0;">TU SESIÓN CON JAVIER</p>
      <table cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
        <tr><td style="background:#264233;border-radius:100px;padding:14px 28px;">
          <a href="#" style="color:#FFFFFF;font-size:14px;font-weight:500;text-decoration:none;display:block;white-space:nowrap;">${escapeHtml(ctaText)}</a>
        </td></tr>
      </table>
      <p style="font-size:13px;color:#878E92;line-height:1.6;margin:0 0 40px 0;">Ya tiene tu Mapa de Regulación. No empezáis de cero.<br>20-30 minutos. Esta semana.</p>
      <div style="height:1px;background:rgba(38, 66, 51, 0.10);margin-bottom:32px;"></div>
      <p style="font-size:14px;color:#2D2D2D;line-height:1.6;margin:0 0 8px 0;">Recuerda: si tu sueño no mejora en 7 días, te devolvemos los 97€. Sin preguntas.</p>
      <p style="font-size:14px;color:#212426;font-weight:500;margin:0 0 40px 0;">Pero no los vas a necesitar.</p>
      <div style="height:1px;background:rgba(38, 66, 51, 0.10);margin-bottom:32px;"></div>
      <p style="font-size:14px;color:#212426;margin:0 0 4px 0;">Javier A. Martín Ramos</p>
      <p style="font-size:13px;color:#878E92;margin:0;">Director · Instituto Epigenético</p>
      <p style="font-size:11px;color:#878E92;margin:16px 0 0 0;"><a href="#" style="color:#878E92;text-decoration:underline;">Darme de baja</a></p>
    </td></tr>
  </table>
</body>
</html>`
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  if (!VALID_EMAIL_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Email key no válido' }, { status: 400 })
  }

  const defaults = EMAIL_DEFAULTS[key]

  // Check query params for live preview edits (not yet saved)
  const url = new URL(req.url)
  const qSubject = url.searchParams.get('subject')
  const qBody = url.searchParams.get('body')
  const qCta = url.searchParams.get('cta')

  // If no query params, check DB for saved overrides
  let subject = qSubject ?? defaults.subject
  let bodyContent = qBody ?? defaults.bodyContent
  let ctaText = qCta ?? defaults.ctaText

  if (!qSubject && !qBody && !qCta) {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('email_templates')
      .select('subject, body_content, cta_text')
      .eq('email_key', key)
      .single()

    if (data) {
      subject = data.subject ?? defaults.subject
      bodyContent = data.body_content ?? defaults.bodyContent
      ctaText = data.cta_text ?? defaults.ctaText
    }
  }

  let html: string

  if (key === 'd0') {
    html = buildD0Preview(subject, ctaText)
  } else if (key === 'goodbye') {
    html = buildGoodbyePreview(bodyContent, ctaText)
  } else if (key === 'post_pago') {
    html = buildPostPagoPreview(bodyContent, subject, ctaText)
  } else {
    // Standard evolution emails
    const bodyHtml = textToHtmlParagraphs(bodyContent, BODY_P_STYLE)
    html = buildEvolutionPreview(bodyHtml || `<p style="${BODY_P_STYLE}">${escapeHtml(bodyContent)}</p>`, ctaText)
  }

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
