/**
 * email.ts — Envío de emails con Resend
 *
 * Email día 0: se envía inmediatamente al capturar el email.
 * Template minimalista, dark, personal — per spec Four Seasons.
 * Sin logos agresivos, sin footer corporativo. El email es un mensajero.
 *
 * Requiere: RESEND_API_KEY en variables de entorno
 * Requiere: NEXT_PUBLIC_BASE_URL en variables de entorno
 */

import { Resend } from 'resend'
import { getMostCompromised, getScoreColor } from './insights'

const resend = new Resend(process.env.RESEND_API_KEY)

// El dominio desde el que se envía — configura este email en Resend
// Ver: resend.com/domains → añadir y verificar tu dominio
const FROM_EMAIL = 'Javier · Instituto Epigenético <javier@institutoepigeinetico.com>'

// Fallback durante desarrollo/test — Resend permite enviar a cualquier email
// con tu propio dominio verificado. En test, usa 'onboarding@resend.dev' como from.
const FROM_EMAIL_DEV = 'onboarding@resend.dev'

function getFromEmail(): string {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev ? FROM_EMAIL_DEV : FROM_EMAIL
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://lars.institutoepigeinetico.com'
  const mapUrl = `${baseUrl}/mapa/${mapHash}`

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

  // Template HTML minimal, dark, personal
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
  background-color: #0B0F0E;
  font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
  color: #E8EAE9;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr>
      <td>

        <!-- Score global -->
        <p style="
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4ADE80;
          margin: 0 0 8px 0;
        ">TU MAPA DE REGULACIÓN</p>

        <p style="
          font-size: 48px;
          font-weight: 600;
          color: #E8EAE9;
          margin: 0 0 4px 0;
          line-height: 1;
        ">${globalScore}<span style="font-size: 24px; font-weight: 400; color: #8A9E98;">/100</span></p>

        <p style="
          font-size: 14px;
          color: #8A9E98;
          margin: 0 0 40px 0;
        ">Score global de regulación</p>

        <!-- Separador -->
        <div style="height: 1px; background: rgba(255,255,255,0.08); margin-bottom: 32px;"></div>

        <!-- Dimensión más comprometida -->
        <p style="
          font-size: 13px;
          color: #8A9E98;
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
        ">${worstScore}<span style="font-size: 16px; font-weight: 400; color: #8A9E98;">/100</span></p>

        <!-- Primer paso -->
        <p style="
          font-size: 14px;
          color: #E8EAE9;
          line-height: 1.6;
          margin: 0 0 40px 0;
          padding: 20px 24px;
          background: rgba(74, 222, 128, 0.06);
          border-left: 2px solid #4ADE80;
          border-radius: 8px;
        ">${firstStep}</p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
          <tr>
            <td style="
              background: #4ADE80;
              border-radius: 100px;
              padding: 16px 32px;
            ">
              <a href="${mapUrl}" style="
                color: #0B0F0E;
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
        <div style="height: 1px; background: rgba(255,255,255,0.08); margin-bottom: 32px;"></div>

        <!-- Footer minimal -->
        <p style="
          font-size: 13px;
          color: #506258;
          line-height: 1.6;
          margin: 0;
        ">
          Este mapa es tuyo. Evoluciona con el tiempo — cada semana hay algo nuevo.<br>
          Confidencial. Solo tú puedes verlo.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
`

  await resend.emails.send({
    from: getFromEmail(),
    to,
    subject: 'Tu Mapa de Regulación',
    html,
  })
}
