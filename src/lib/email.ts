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
  return `<p style="font-size: 11px; color: #8A7E75; margin: 16px 0 0 0;"><a href="${url}" style="color: #8A7E75; text-decoration: underline;">Darme de baja</a></p>`
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
  background-color: #FFFBEF;
  font-family: Lora, Inter, system-ui, sans-serif;
  color: #1E1310;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr>
      <td>

        <!-- Header: logo -->
        <img src="${getBaseUrl()}/img/logo-instituto-epigenetico.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />

        <!-- Score global -->
        <p style="
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #B45A32;
          margin: 0 0 8px 0;
        ">TU MAPA DE REGULACIÓN</p>

        <p style="
          font-size: 48px;
          font-weight: 600;
          color: #1E1310;
          margin: 0 0 4px 0;
          line-height: 1;
        ">${globalScore}<span style="font-size: 24px; font-weight: 400; color: #4B413C;">/100</span></p>

        <p style="
          font-size: 14px;
          color: #8A7E75;
          margin: 0 0 40px 0;
        ">Score global de regulación</p>

        <!-- Separador -->
        <div style="height: 1px; background: #E8E2D0; margin-bottom: 32px;"></div>

        <!-- Dimensión más comprometida -->
        <p style="
          font-size: 13px;
          color: #8A7E75;
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
        ">${worstScore}<span style="font-size: 16px; font-weight: 400; color: #4B413C;">/100</span></p>

        <!-- Primer paso -->
        <p style="
          font-size: 14px;
          color: #1E1310;
          line-height: 1.6;
          margin: 0 0 40px 0;
          padding: 20px 24px;
          background: #F9F1DE;
          border-left: 3px solid #B45A32;
          border-radius: 8px;
        ">${firstStep}</p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
          <tr>
            <td style="
              background: #F5F564;
              border-radius: 100px;
              padding: 16px 32px;
            ">
              <a href="${mapUrl}" style="
                color: #1E1310;
                font-size: 15px;
                font-weight: 500;
                text-decoration: none;
                display: block;
                white-space: nowrap;
              ">Ver mi mapa completo</a>
            </td>
          </tr>
        </table>

        <!-- Separador -->
        <div style="height: 1px; background: #E8E2D0; margin-bottom: 32px;"></div>

        <!-- Footer minimal -->
        <p style="
          font-size: 13px;
          color: #8A7E75;
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
    subject: 'Tu Mapa de Regulación',
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
  background-color: #FFFBEF;
  font-family: Lora, Inter, system-ui, sans-serif;
  color: #1E1310;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr><td>
      <img src="${getBaseUrl()}/img/logo-instituto-epigenetico.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />
      ${params.content}
      <table cellpadding="0" cellspacing="0" style="margin: 32px 0;">
        <tr><td style="background: #F5F564; border-radius: 100px; padding: 16px 32px;">
          <a href="${params.mapUrl}" style="color: #1E1310; font-size: 15px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            ${params.buttonText}
          </a>
        </td></tr>
      </table>
      <div style="height: 1px; background: #E8E2D0; margin-bottom: 24px;"></div>
      <p style="font-size: 13px; color: #8A7E75; line-height: 1.6; margin: 0;">
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

  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #1E1310; line-height: 1.6; margin: 0 0 16px 0;">
        Tu arquetipo del sistema nervioso está disponible. Es la pieza que faltaba para entender por qué tu cuerpo responde como responde.
      </p>`,
    buttonText: 'Ver mi mapa',
    mapUrl, mapHash, emailKey: 'd3',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: 'Hay algo nuevo en tu mapa de regulación',
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 7: Insight de inteligencia colectiva */
export async function sendDia7Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`

  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #1E1310; line-height: 1.6; margin: 0 0 16px 0;">
        Nuevo insight sobre tu dimensión más comprometida. Un dato que no existía cuando hiciste tu diagnóstico.
      </p>`,
    buttonText: 'Ver mi mapa',
    mapUrl, mapHash, emailKey: 'd7',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: 'Tu mapa se ha actualizado',
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 10: Sesión con Javier */
export async function sendDia10Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`

  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #1E1310; line-height: 1.6; margin: 0 0 16px 0;">
        20 minutos. Sin compromiso. Ya tiene tus datos.
      </p>`,
    buttonText: 'Agendar sesión',
    mapUrl, mapHash, emailKey: 'd10',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: 'Javier puede revisar tu mapa contigo',
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 14: Subdimensiones */
export async function sendDia14Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`

  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #1E1310; line-height: 1.6; margin: 0 0 16px 0;">
        2 preguntas más para aumentar la resolución de tu diagnóstico.
      </p>`,
    buttonText: 'Ver mi mapa',
    mapUrl, mapHash, emailKey: 'd14',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: 'Hay 3 subdimensiones nuevas disponibles',
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 21: Extracto del libro */
export async function sendDia21Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`

  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #1E1310; line-height: 1.6; margin: 0 0 16px 0;">
        Basado en tu dimensión más comprometida. Del libro "Burnout: El Renacimiento del Líder Fénix."
      </p>`,
    buttonText: 'Ver mi mapa',
    mapUrl, mapHash, emailKey: 'd21',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: 'Un capítulo escrito para tu situación',
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 30: Reevaluación */
export async function sendDia30Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`

  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #1E1310; line-height: 1.6; margin: 0 0 16px 0;">
        Actualiza tu mapa en 30 segundos. Tus scores anteriores se guardan para que veas la evolución.
      </p>`,
    buttonText: 'Actualizar mi mapa',
    mapUrl, mapHash, emailKey: 'd30',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: 'Un mes desde tu diagnóstico — ¿ha cambiado algo?',
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Post-pago: Protocolo + Sesión + MNN© */
export async function sendPostPagoEmail(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const bookingUrl = `${mapUrl}#section-session`

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #FFFBEF;
  font-family: Lora, Inter, system-ui, sans-serif;
  color: #1E1310;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr><td>

      <img src="${getBaseUrl()}/img/logo-instituto-epigenetico.png" alt="Instituto Epigenético" width="220" style="display: block; width: 220px; height: auto; margin: 0 0 32px 0;" />

      <p style="font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #B45A32; margin: 0 0 8px 0;">
        SEMANA 1
      </p>

      <p style="font-size: 28px; font-weight: 600; color: #1E1310; margin: 0 0 8px 0; line-height: 1.2;">
        Tu Semana 1 ha comenzado.
      </p>

      <p style="font-size: 14px; color: #4B413C; line-height: 1.6; margin: 0 0 40px 0;">
        Has dado el paso que el 97% no da. Lo que sigue es que tu cuerpo note la diferencia.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: #E8E2D0; margin-bottom: 32px;"></div>

      <!-- Protocolo -->
      <p style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #8A7E75; margin: 0 0 8px 0;">
        TU PROTOCOLO DE SUEÑO DE EMERGENCIA
      </p>

      <table cellpadding="0" cellspacing="0" style="margin: 0 0 8px 0;">
        <tr><td style="background: #F5F564; border-radius: 100px; padding: 14px 28px;">
          <a href="${mapUrl}" style="color: #1E1310; font-size: 14px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            Descargar el Protocolo
          </a>
        </td></tr>
      </table>

      <p style="font-size: 13px; color: #8A7E75; line-height: 1.6; margin: 0 0 40px 0;">
        Diseñado por el Dr. Carlos Alvear López.<br>
        Empieza esta noche. Resultados en 72 horas.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: #E8E2D0; margin-bottom: 32px;"></div>

      <!-- Sesión -->
      <p style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #8A7E75; margin: 0 0 8px 0;">
        TU SESIÓN CON JAVIER
      </p>

      <table cellpadding="0" cellspacing="0" style="margin: 0 0 8px 0;">
        <tr><td style="background: #F5F564; border-radius: 100px; padding: 14px 28px;">
          <a href="${bookingUrl}" style="color: #1E1310; font-size: 14px; font-weight: 500; text-decoration: none; display: block; white-space: nowrap;">
            Agendar mi sesión
          </a>
        </td></tr>
      </table>

      <p style="font-size: 13px; color: #8A7E75; line-height: 1.6; margin: 0 0 40px 0;">
        Ya tiene tu Mapa de Regulación. No empezáis de cero.<br>
        20-30 minutos. Esta semana.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: #E8E2D0; margin-bottom: 32px;"></div>

      <!-- MNN -->
      <p style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #8A7E75; margin: 0 0 8px 0;">
        TU MNN© (MAPA DE NIVELES DE NEUROTRANSMISORES)
      </p>

      <p style="font-size: 14px; color: #4B413C; line-height: 1.6; margin: 0 0 40px 0;">
        Recibirás las instrucciones para tu primer análisis bioquímico real en las próximas 24 horas.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: #E8E2D0; margin-bottom: 32px;"></div>

      <!-- Garantía -->
      <p style="font-size: 14px; color: #4B413C; line-height: 1.6; margin: 0 0 8px 0;">
        Recuerda: si tu sueño no mejora en 7 días, te devolvemos los 97€. Sin preguntas.
      </p>
      <p style="font-size: 14px; color: #1E1310; font-weight: 500; margin: 0 0 40px 0;">
        Pero no los vas a necesitar.
      </p>

      <!-- Separador -->
      <div style="height: 1px; background: #E8E2D0; margin-bottom: 32px;"></div>

      <!-- Firma -->
      <p style="font-size: 14px; color: #1E1310; margin: 0 0 4px 0;">
        Javier A. Martín Ramos
      </p>
      <p style="font-size: 13px; color: #8A7E75; margin: 0;">
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
    subject: 'Tu Semana 1 empieza ahora — aquí tienes todo',
    html,
    headers: listUnsubscribeHeaders(mapHash),
  })
}

/** Día 90+: Reevaluación trimestral */
export async function sendDia90Email(to: string, mapHash: string): Promise<void> {
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`

  const html = buildEvolutionEmail({
    content: `
      <p style="font-size: 14px; color: #1E1310; line-height: 1.6; margin: 0 0 16px 0;">
        ¿Ha cambiado algo?
      </p>
      <p style="font-size: 14px; color: #4B413C; line-height: 1.6; margin: 0 0 16px 0;">
        Tu mapa sigue aquí. Actualízalo en 30 segundos y compara.
      </p>`,
    buttonText: 'Actualizar mi mapa',
    mapUrl, mapHash, emailKey: 'd90',
  })

  await getResend().emails.send({
    from: getFromEmail(), to,
    subject: '3 meses desde tu mapa — una pregunta',
    html, headers: listUnsubscribeHeaders(mapHash),
  })
}
