/**
 * email.ts — Envío de emails con Resend
 *
 * Email día 0: se envía inmediatamente al capturar el email.
 * Template minimalista, warm cream, personal — per spec Four Seasons.
 * Sin logos agresivos, sin footer corporativo. El email es un mensajero.
 *
 * Requiere: RESEND_API_KEY en variables de entorno
 * Requiere: NEXT_PUBLIC_BASE_URL en variables de entorno
 */

import { Resend } from 'resend'
import { getMostCompromised, getScoreColor } from './insights'
import { createAdminClient } from './supabase'
import { EMAIL_DEFAULTS, escapeHtml, textToHtmlParagraphs } from './email-defaults'

// ─── Template override lookup ─────────────────────────────────────────────────

async function getTemplateOverride(emailKey: string): Promise<{
  subject: string | null
  body_content: string | null
  cta_text: string | null
} | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('email_templates')
      .select('subject, body_content, cta_text')
      .eq('email_key', emailKey)
      .single()
    return data
  } catch {
    return null
  }
}

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? '')
  return _resend
}

// El dominio desde el que se envía — configura este email en Resend
// Ver: resend.com/domains → añadir y verificar tu dominio
const FROM_EMAIL = 'Javier · Instituto Epigenético <regulacion@institutoepigenetico.com>'

// Fallback durante desarrollo/test — Resend permite enviar a cualquier email
// con tu propio dominio verificado. En test, usa 'onboarding@resend.dev' como from.
const FROM_EMAIL_DEV = 'onboarding@resend.dev'

function getFromEmail(): string {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev ? FROM_EMAIL_DEV : FROM_EMAIL
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'https://lars.institutoepigenetico.com'
}

function trackingPixelHtml(mapHash: string, emailKey: string): string {
  const url = `${getBaseUrl()}/api/email/open?h=${mapHash}&e=${emailKey}`
  return `<img src="${url}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />`
}

function unsubscribeUrl(mapHash: string): string {
  return `${getBaseUrl()}/api/email/unsubscribe?h=${mapHash}`
}

function unsubscribeFooterHtml(mapHash: string): string {
  const url = unsubscribeUrl(mapHash)
  return `<p style="font-size: 11px; color: #878E92; margin: 16px 0 0 0;"><a href="${url}" style="color: #878E92; text-decoration: underline;">Darme de baja</a></p>`
}

function listUnsubscribeHeaders(mapHash: string): Record<string, string> {
  const url = unsubscribeUrl(mapHash)
  return {
    'List-Unsubscribe': `<${url}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

interface SendDia0EmailParams {
  to: string
  globalScore: number
  d1: number
  d2: number
  d3: number
  d4: number
  d5: number
  mapHash: string
}

export async function sendDia0Email({
  to,
  globalScore,
  d1,
  d2,
  d3,
  d4,
  d5,
  mapHash,
}: SendDia0EmailParams): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const override0 = await getTemplateOverride('d0')

  const { key: worstKey, score: worstScore } = getMostCompromised(d1, d2, d3, d4, d5)
  const worstColor = getScoreColor(worstScore)

  const dimensionNames: Record<string, string> = {
    d1: 'Regulación Nerviosa',
    d2: 'Calidad de Sueño',
    d3: 'Claridad Cognitiva',
    d4: 'Equilibrio Emocional',
    d5: 'Alegría de Vivir',
  }

  const worstName = dimensionNames[worstKey]

  const firstStepByKey: Record<string, string> = {
    d1: 'Regula tu sistema nervioso primero. Todo lo demás mejora como consecuencia.',
    d2: 'Empieza por el sueño. No como descanso — como restauración biológica real.',
    d3: 'Reduce la carga del prefrontal. La claridad que recuerdas tener sigue ahí.',
    d4: 'La reactividad que sientes no es tu carácter — es el límite del sistema nervioso.',
    d5: 'La chispa no desapareció. Está debajo del agotamiento. El proceso la recupera.',
  }

  const firstStep = firstStepByKey[worstKey]

  // Template HTML minimal, warm cream, personal
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tu Mapa de Regulación</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #FFFFFF;
  font-family: 'Host Grotesk', system-ui, sans-serif;
  color: #212426;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr>
      <td>

        <!-- Header: logo -->
        <img src="${getBaseUrl()}/Logo-definitivo-IE.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />

        <!-- Score global -->
        <p style="
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #CD796C;
          margin: 0 0 8px 0;
        ">TU MAPA DE REGULACIÓN</p>

        <p style="
          font-size: 48px;
          font-weight: 600;
          color: #212426;
          margin: 0 0 4px 0;
          line-height: 1;
        ">${globalScore}<span style="font-size: 24px; font-weight: 400; color: #2D2D2D;">/100</span></p>

        <p style="
          font-size: 14px;
          color: #878E92;
          margin: 0 0 40px 0;
        ">Score global de regulación</p>

        <!-- Separador -->
        <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 32px;"></div>

        <!-- Dimensión más comprometida -->
        <p style="
          font-size: 13px;
          color: #878E92;
          margin: 0 0 6px 0;
        ">Tu dimensión más comprometida</p>

        <p style="
          font-size: 20px;
          font-weight: 500;
          color: ${worstColor};
          margin: 0 0 6px 0;
        ">${worstName}</p>

        <p style="
          font-size: 32px;
          font-weight: 600;
          color: ${worstColor};
          margin: 0 0 32px 0;
          line-height: 1;
        ">${worstScore}<span style="font-size: 16px; font-weight: 400; color: #2D2D2D;">/100</span></p>

        <!-- Primer paso -->
        <p style="
          font-size: 14px;
          color: #212426;
          line-height: 1.6;
          margin: 0 0 40px 0;
          padding: 20px 24px;
          background: #EAF2EE;
          border-left: 3px solid #CD796C;
          border-radius: 8px;
        ">${firstStep}</p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
          <tr>
            <td style="
              background: #264233;
              border-radius: 100px;
              padding: 16px 32px;
            ">
              <a href="${mapUrl}" style="
                color: #FFFFFF;
                font-size: 15px;
                font-weight: 500;
                text-decoration: none;
                display: block;
                white-space: nowrap;
              ">${escapeHtml(override0?.cta_text ?? EMAIL_DEFAULTS.d0.ctaText)}</a>
            </td>
          </tr>
        </table>

        <!-- Separador -->
        <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 32px;"></div>

        <!-- Footer minimal -->
        <p style="
          font-size: 13px;
          color: #878E92;
          line-height: 1.6;
          margin: 0;
        ">
          Este mapa es tuyo. Evoluciona con el tiempo — cada semana hay algo nuevo.<br>
          Confidencial. Solo tú puedes verlo.
        </p>

        ${unsubscribeFooterHtml(mapHash)}
        ${trackingPixelHtml(mapHash, 'd0')}

      </td>
    </tr>
  </table>
</body>
</html>
`

  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: override0?.subject ?? EMAIL_DEFAULTS.d0.subject,
    html,
    headers: listUnsubscribeHeaders(mapHash),
  })
}

// ─── EMAILS DE EVOLUCIÓN (Día 3-90) ──────────────────────────────────────────

/**
 * Template base dark minimal para todos los emails de evolución.
 * Solo cambia: asunto, contenido, texto del botón.
 */
function buildEvolutionEmail(params: {
  content: string
  buttonText: string
  mapUrl: string
  mapHash: string
  emailKey: string
}): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #FFFFFF;
  font-family: 'Host Grotesk', system-ui, sans-serif;
  color: #212426;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr><td>
      <img src="${getBaseUrl()}/Logo-definitivo-IE.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />
      ${params.content}
      <table cellpadding="0" cellspacing="0" style="margin: 32px 0;">
        <tr><td style="background: #264233; border-radius: 100px; padding: 16px 32px;">
          <a href="${params.mapUrl}" style="color: #FFFFFF; font-size: 15px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            ${params.buttonText}
          </a>
        </td></tr>
      </table>
      <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 24px;"></div>
      <p style="font-size: 13px; color: #878E92; line-height: 1.6; margin: 0;">
        Este mapa es tuyo. Confidencial. Solo tú puedes verlo.
      </p>
      ${unsubscribeFooterHtml(params.mapHash)}
      ${trackingPixelHtml(params.mapHash, params.emailKey)}
    </td></tr>
  </table>
</body>
</html>`
}

/** Día 3: Arquetipo del Sistema Nervioso */
export async function sendDia3Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const override = await getTemplateOverride('d3')
  const defaults = EMAIL_DEFAULTS.d3

  const bodyText = override?.body_content ?? defaults.bodyContent
  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 16px 0;">
        ${escapeHtml(bodyText)}
      </p>`,
    buttonText: override?.cta_text ?? defaults.ctaText,
    mapUrl, mapHash, emailKey: 'd3',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: override?.subject ?? defaults.subject,
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 7: Insight de inteligencia colectiva */
export async function sendDia7Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const override = await getTemplateOverride('d7')
  const defaults = EMAIL_DEFAULTS.d7

  const bodyText = override?.body_content ?? defaults.bodyContent
  const amplifyBlock = `
      <tr>
        <td style="padding: 24px 0 0 0; border-top: 1px solid rgba(38,66,51,0.08);">
          <p style="font-size: 13px; color: #878E92; line-height: 1.5; margin: 0 0 12px 0;">
            ¿Conoces a alguien que podría necesitar ver su mapa?
            Si ambos hacéis el diagnóstico, podréis comparar vuestras dimensiones.
          </p>
          <a href="${mapUrl}" style="font-size: 13px; color: #CD796C; text-decoration: underline;">
            Invitar a alguien a comparar →
          </a>
        </td>
      </tr>`
  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 16px 0;">
        ${escapeHtml(bodyText)}
      </p>
      ${amplifyBlock}`,
    buttonText: override?.cta_text ?? defaults.ctaText,
    mapUrl, mapHash, emailKey: 'd7',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: override?.subject ?? defaults.subject,
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 10: Sesión con Javier */
export async function sendDia10Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const override = await getTemplateOverride('d10')
  const defaults = EMAIL_DEFAULTS.d10

  const bodyText = override?.body_content ?? defaults.bodyContent
  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 16px 0;">
        ${escapeHtml(bodyText)}
      </p>`,
    buttonText: override?.cta_text ?? defaults.ctaText,
    mapUrl, mapHash, emailKey: 'd10',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: override?.subject ?? defaults.subject,
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 14: Subdimensiones */
export async function sendDia14Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const override = await getTemplateOverride('d14')
  const defaults = EMAIL_DEFAULTS.d14

  const bodyText = override?.body_content ?? defaults.bodyContent
  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 16px 0;">
        ${escapeHtml(bodyText)}
      </p>`,
    buttonText: override?.cta_text ?? defaults.ctaText,
    mapUrl, mapHash, emailKey: 'd14',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: override?.subject ?? defaults.subject,
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 21: Extracto del libro */
export async function sendDia21Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const override = await getTemplateOverride('d21')
  const defaults = EMAIL_DEFAULTS.d21

  const bodyText = override?.body_content ?? defaults.bodyContent
  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 16px 0;">
        ${escapeHtml(bodyText)}
      </p>`,
    buttonText: override?.cta_text ?? defaults.ctaText,
    mapUrl, mapHash, emailKey: 'd21',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: override?.subject ?? defaults.subject,
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 30: Reevaluación */
export async function sendDia30Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const override = await getTemplateOverride('d30')
  const defaults = EMAIL_DEFAULTS.d30

  const bodyText = override?.body_content ?? defaults.bodyContent
  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 16px 0;">
        ${escapeHtml(bodyText)}
      </p>`,
    buttonText: override?.cta_text ?? defaults.ctaText,
    mapUrl, mapHash, emailKey: 'd30',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: override?.subject ?? defaults.subject,
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Post-pago: Protocolo + Sesión + MNN© */
export async function sendPostPagoEmail(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const bookingUrl = `${mapUrl}#section-session`
  const overridePP = await getTemplateOverride('post_pago')
  const defaultsPP = EMAIL_DEFAULTS.post_pago

  const ppBodyText = overridePP?.body_content ?? defaultsPP.bodyContent
  const ppCtaText = overridePP?.cta_text ?? defaultsPP.ctaText

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #FFFFFF;
  font-family: 'Host Grotesk', system-ui, sans-serif;
  color: #212426;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr><td>

      <img src="${getBaseUrl()}/Logo-definitivo-IE.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />

      <p style="font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #CD796C; margin: 0 0 8px 0;">
        SEMANA 1
      </p>

      <p style="font-size: 28px; font-weight: 600; color: #212426; margin: 0 0 8px 0; line-height: 1.2;">
        Tu Semana 1 ha comenzado.
      </p>

      <p style="font-size: 14px; color: #2D2D2D; line-height: 1.6; margin: 0 0 40px 0;">
        ${escapeHtml(ppBodyText)}
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 32px;"></div>

      <!-- Protocolo -->
      <p style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #878E92; margin: 0 0 8px 0;">
        TU PROTOCOLO DE SUEÑO DE EMERGENCIA
      </p>

      <table cellpadding="0" cellspacing="0" style="margin: 0 0 8px 0;">
        <tr><td style="background: #264233; border-radius: 100px; padding: 14px 28px;">
          <a href="${mapUrl}" style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            Descargar el Protocolo
          </a>
        </td></tr>
      </table>

      <p style="font-size: 13px; color: #878E92; line-height: 1.6; margin: 0 0 40px 0;">
        Diseñado por el Dr. Carlos Alvear López.<br>
        Empieza esta noche. Resultados en 72 horas.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 32px;"></div>

      <!-- Sesión -->
      <p style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #878E92; margin: 0 0 8px 0;">
        TU SESIÓN CON JAVIER
      </p>

      <table cellpadding="0" cellspacing="0" style="margin: 0 0 8px 0;">
        <tr><td style="background: #264233; border-radius: 100px; padding: 14px 28px;">
          <a href="${bookingUrl}" style="color: #FFFFFF; font-size: 14px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            ${escapeHtml(ppCtaText)}
          </a>
        </td></tr>
      </table>

      <p style="font-size: 13px; color: #878E92; line-height: 1.6; margin: 0 0 40px 0;">
        Ya tiene tu Mapa de Regulación. No empezáis de cero.<br>
        20-30 minutos. Esta semana.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 32px;"></div>

      <!-- MNN -->
      <p style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #878E92; margin: 0 0 8px 0;">
        TU MNN© (MAPA DE NIVELES DE NEUROTRANSMISORES)
      </p>

      <p style="font-size: 14px; color: #2D2D2D; line-height: 1.6; margin: 0 0 40px 0;">
        Recibirás las instrucciones para tu primer análisis bioquímico real en las próximas 24 horas.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 32px;"></div>

      <!-- Garantía -->
      <p style="font-size: 14px; color: #2D2D2D; line-height: 1.6; margin: 0 0 8px 0;">
        Recuerda: si tu sueño no mejora en 7 días, te devolvemos los 97€. Sin preguntas.
      </p>
      <p style="font-size: 14px; color: #212426; font-weight: 500; margin: 0 0 40px 0;">
        Pero no los vas a necesitar.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 32px;"></div>

      <!-- Firma -->
      <p style="font-size: 14px; color: #212426; margin: 0 0 4px 0;">
        Javier A. Martín Ramos
      </p>
      <p style="font-size: 13px; color: #878E92; margin: 0;">
        Director · Instituto Epigenético
      </p>

      ${unsubscribeFooterHtml(mapHash)}

    </td></tr>
  </table>
</body>
</html>`

  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: overridePP?.subject ?? defaultsPP.subject,
    html,
    headers: listUnsubscribeHeaders(mapHash),
  })
}

// ─── EMAIL AMPLIFY: COMPARACIÓN LISTA ────────────────────────────────────────

interface AmplifyComparisonReadyParams {
  to: string
  inviteeInitials: string
  compareUrl: string
  inviterMapHash: string
}

/** Email al invitador cuando el invitado acepta la comparación */
export async function sendAmplifyComparisonReadyEmail({
  to,
  inviteeInitials,
  compareUrl,
  inviterMapHash,
}: AmplifyComparisonReadyParams): Promise<void> {
  const override = await getTemplateOverride('amplify_comparison_ready')
  const defaults = EMAIL_DEFAULTS.amplify_comparison_ready

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #FFFFFF;
  font-family: 'Host Grotesk', system-ui, sans-serif;
  color: #212426;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr><td>

      <img src="${getBaseUrl()}/Logo-definitivo-IE.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />

      <p style="
        font-size: 13px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #CD796C;
        margin: 0 0 8px 0;
      ">COMPARACIÓN DE MAPAS</p>

      <p style="
        font-size: 20px;
        font-weight: 600;
        color: #212426;
        margin: 0 0 24px 0;
        line-height: 1.3;
      ">${escapeHtml(inviteeInitials)} ha completado su diagnóstico.</p>

      <p style="
        font-size: 14px;
        color: #2D2D2D;
        line-height: 1.6;
        margin: 0 0 32px 0;
      ">Ahora podéis ver cómo se comparan vuestras dimensiones. Las brechas compartidas revelan lo que ningún mapa individual puede mostrar.</p>

      <table cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
        <tr><td style="background: #264233; border-radius: 100px; padding: 16px 32px;">
          <a href="${compareUrl}" style="color: #FFFFFF; font-size: 15px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            ${escapeHtml(override?.cta_text ?? defaults.ctaText)}
          </a>
        </td></tr>
      </table>

      <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 24px;"></div>

      <p style="font-size: 13px; color: #878E92; line-height: 1.6; margin: 0;">
        Confidencial. Solo vosotros dos podéis ver esto.
      </p>

      ${unsubscribeFooterHtml(inviterMapHash)}
      ${trackingPixelHtml(inviterMapHash, 'amplify_comparison_ready')}

    </td></tr>
  </table>
</body>
</html>`

  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: override?.subject ?? defaults.subject,
    html,
    headers: listUnsubscribeHeaders(inviterMapHash),
  })
}

/** Día 90+: Reevaluación trimestral */
export async function sendDia90Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const override = await getTemplateOverride('d90')
  const defaults = EMAIL_DEFAULTS.d90

  const bodyText = override?.body_content ?? defaults.bodyContent
  const bodyStyle = 'font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 16px 0;'
  const html = buildEvolutionEmail({
    content: textToHtmlParagraphs(bodyText, bodyStyle),
    buttonText: override?.cta_text ?? defaults.ctaText,
    mapUrl, mapHash, emailKey: 'd90',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: override?.subject ?? defaults.subject,
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

// ─── EMAIL DE DESPEDIDA (3 emails sin abrir) ─────────────────────────────────

/** Goodbye: despedida empática cuando 3+ emails no se abren */
export async function sendGoodbyeEmail(to: string, mapHash: string): Promise<void> {
  const reactivateUrl = `${getBaseUrl()}/api/email/reactivate?h=${mapHash}`
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const overrideGb = await getTemplateOverride('goodbye')
  const defaultsGb = EMAIL_DEFAULTS.goodbye

  const gbBodyText = overrideGb?.body_content ?? defaultsGb.bodyContent
  const gbCtaText = overrideGb?.cta_text ?? defaultsGb.ctaText
  const gbBodyStyle = 'font-size: 14px; color: #2D2D2D; line-height: 1.8; margin: 0 0 16px 0;'
  const gbBodyHtml = textToHtmlParagraphs(gbBodyText, gbBodyStyle)

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #FFFFFF;
  font-family: 'Host Grotesk', system-ui, sans-serif;
  color: #212426;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr><td>

      <img src="${getBaseUrl()}/Logo-definitivo-IE.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />

      ${gbBodyHtml}

      <p style="
        font-size: 16px;
        font-weight: 500;
        color: #212426;
        line-height: 1.6;
        margin: 0 0 32px 0;
        padding: 20px 24px;
        background: #EAF2EE;
        border-left: 3px solid #CD796C;
        border-radius: 8px;
      ">Tu mapa es tuyo. Sigue aquí. Sigue vivo.</p>

      <p style="font-size: 14px; color: #212426; line-height: 1.8; margin: 0 0 24px 0;">
        Si en algún momento quieres que volvamos a avisarte cuando haya algo nuevo:
      </p>

      <table cellpadding="0" cellspacing="0" style="margin: 0 0 16px 0;">
        <tr><td style="background: #264233; border-radius: 100px; padding: 16px 32px;">
          <a href="${reactivateUrl}" style="color: #FFFFFF; font-size: 15px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            ${escapeHtml(gbCtaText)}
          </a>
        </td></tr>
      </table>

      <p style="font-size: 13px; color: #878E92; line-height: 1.6; margin: 0 0 32px 0;">
        Sin compromiso. Un clic.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: rgba(38, 66, 51, 0.10); margin-bottom: 32px;"></div>

      <p style="font-size: 14px; color: #212426; line-height: 1.6; margin: 0 0 4px 0;">
        Javier A. Martín Ramos
      </p>
      <p style="font-size: 13px; color: #878E92; margin: 0 0 24px 0;">
        Director · Instituto Epigenético
      </p>

      <p style="font-size: 12px; color: #878E92; margin: 0;">
        <a href="${mapUrl}" style="color: #878E92; text-decoration: underline;">Tu mapa siempre está aquí</a>
      </p>

      ${trackingPixelHtml(mapHash, 'goodbye')}

    </td></tr>
  </table>
</body>
</html>`

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: overrideGb?.subject ?? defaultsGb.subject,
    html,
  })
}
