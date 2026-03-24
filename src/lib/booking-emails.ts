/**
 * booking-emails.ts — Emails del sistema de reservas
 *
 * 3 templates:
 * - Confirmacion al usuario (con fecha, hora, link Meet)
 * - Recordatorio 24h antes
 * - Notificacion a Javier (con link al mapa del usuario)
 *
 * Misma estetica dark que el resto de emails del proyecto.
 */

import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? '')
  return _resend
}

const FROM_EMAIL = 'Javier · Instituto Epigenético <regulacion@institutoepigenetico.com>'
const FROM_EMAIL_DEV = 'onboarding@resend.dev'

function getFromEmail(): string {
  return process.env.NODE_ENV === 'development' ? FROM_EMAIL_DEV : FROM_EMAIL
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'https://lars.institutoepigenetico.com'
}

const JAVIER_EMAIL = 'javier@institutoepigenetico.com'

// ─── Template base ──────────────────────────────────────────────────────────

function buildBookingEmail(params: {
  content: string
  buttonText?: string
  buttonUrl?: string
}): string {
  const button = params.buttonText && params.buttonUrl ? `
    <table cellpadding="0" cellspacing="0" style="margin: 32px auto;">
      <tr><td style="background: #F5F564; border-radius: 100px; padding: 16px 40px;">
        <a href="${params.buttonUrl}" style="color: #1E1310; font-family: Lora, Inter, system-ui, sans-serif; font-size: 15px; font-weight: 600; text-decoration: none; display: block; white-space: nowrap; text-align: center;">
          ${params.buttonText}
        </a>
      </td></tr>
    </table>` : ''

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #FFFBEF;
  font-family: Lora, Inter, system-ui, sans-serif;
  color: #1E1310;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 48px 24px;">
    <tr><td>
      <!-- Header: overline + linea decorativa -->
      <p style="font-family: Lora, system-ui, sans-serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #B45A32; margin: 0 0 12px 0; font-weight: 600;">
        INSTITUTO EPIGENETICO
      </p>
      <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #B45A32, transparent); margin: 0 0 32px 0;"></div>

      ${params.content}
      ${button}

      <!-- Footer -->
      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #E8E2D0;">
        <p style="font-family: Inter, system-ui, sans-serif; font-size: 12px; color: #8A7E75; margin: 0; line-height: 1.6;">
          Instituto Epigenetico<br/>
          regulacion@institutoepigenetico.com
        </p>
      </div>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Formato de fecha/hora ──────────────────────────────────────────────────

function formatDateTimeSpanish(date: Date, timezone: string): { date: string; time: string } {
  const dateStr = date.toLocaleDateString('es-ES', {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const timeStr = date.toLocaleTimeString('es-ES', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return { date: dateStr.charAt(0).toUpperCase() + dateStr.slice(1), time: timeStr }
}

// ─── Email 1: Confirmacion al usuario ───────────────────────────────────────

interface BookingConfirmationParams {
  to: string
  slotStart: Date
  slotEnd: Date
  meetUrl: string | null
  mapHash: string
  userTimezone: string
}

export async function sendBookingConfirmationEmail({
  to,
  slotStart,
  meetUrl,
  mapHash,
  userTimezone,
}: BookingConfirmationParams): Promise<void> {
  const { date, time } = formatDateTimeSpanish(slotStart, userTimezone)
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`
  const cancelUrl = `${getBaseUrl()}/mapa/${mapHash}?cancelBooking=true`

  const meetBlock = meetUrl ? `
    <p style="font-family: Lora, system-ui, sans-serif; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #8A7E75; margin: 28px 0 10px 0; font-weight: 500;">
      ENLACE DE VIDEOLLAMADA
    </p>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 8px 0;">
      <tr><td style="background: #F9F1DE; border: 1px solid #E8E2D0; border-radius: 12px; padding: 14px 18px;">
        <a href="${meetUrl}" style="font-family: Inter, system-ui, sans-serif; color: #B45A32; font-size: 14px; text-decoration: none; word-break: break-all;">
          ${meetUrl}
        </a>
      </td></tr>
    </table>` : ''

  const html = buildBookingEmail({
    content: `
      <p style="font-family: Lora, system-ui, sans-serif; font-size: 28px; font-weight: 700; color: #1E1310; margin: 0 0 8px 0; line-height: 1.2;">
        Tu sesion con Javier
      </p>
      <p style="font-family: Lora, system-ui, sans-serif; font-size: 28px; font-weight: 700; color: #1E1310; margin: 0 0 28px 0; line-height: 1.2;">
        esta confirmada.
      </p>

      <div style="background: #F9F1DE; border: 1px solid #E8E2D0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="font-family: Inter, system-ui, sans-serif; font-size: 13px; color: #8A7E75; margin: 0 0 4px 0;">Fecha</p>
        <p style="font-family: Lora, system-ui, sans-serif; font-size: 18px; color: #1E1310; font-weight: 600; margin: 0 0 20px 0;">${date}</p>

        <p style="font-family: Inter, system-ui, sans-serif; font-size: 13px; color: #8A7E75; margin: 0 0 4px 0;">Hora</p>
        <p style="font-family: Lora, system-ui, sans-serif; font-size: 18px; color: #1E1310; font-weight: 600; margin: 0 0 20px 0;">${time}</p>

        <p style="font-family: Inter, system-ui, sans-serif; font-size: 13px; color: #8A7E75; margin: 0 0 4px 0;">Duracion</p>
        <p style="font-family: Lora, system-ui, sans-serif; font-size: 18px; color: #1E1310; font-weight: 600; margin: 0;">20 minutos</p>
      </div>

      ${meetBlock}

      <p style="font-family: Inter, system-ui, sans-serif; font-size: 14px; color: #8A7E75; line-height: 1.6; margin: 28px 0 0 0;">
        Javier ya tiene tu Mapa de Regulacion. No empezais de cero.
      </p>

      <p style="font-family: Inter, system-ui, sans-serif; font-size: 12px; color: #8A7E75; margin: 32px 0 0 0;">
        Si necesitas cancelar, puedes hacerlo desde
        <a href="${cancelUrl}" style="color: #8A7E75; text-decoration: underline;">tu mapa epigenetico</a>.
      </p>`,
    buttonText: 'Ver mi mapa',
    buttonUrl: mapUrl,
  })

  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: 'Tu sesion con Javier esta confirmada',
    html,
  })
}

// ─── Email 2: Recordatorio 24h antes ────────────────────────────────────────

interface BookingReminderParams {
  to: string
  slotStart: Date
  meetUrl: string | null
  mapHash: string
  userTimezone: string
}

export async function sendBookingReminderEmail({
  to,
  slotStart,
  meetUrl,
  mapHash,
  userTimezone,
}: BookingReminderParams): Promise<void> {
  const { date, time } = formatDateTimeSpanish(slotStart, userTimezone)
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`

  const meetLine = meetUrl
    ? `<p style="font-family: Inter, system-ui, sans-serif; font-size: 14px; color: #1E1310; margin: 16px 0;"><a href="${meetUrl}" style="color: #B45A32; text-decoration: none;">Enlace a la videollamada →</a></p>`
    : ''

  const html = buildBookingEmail({
    content: `
      <p style="font-family: Lora, system-ui, sans-serif; font-size: 28px; font-weight: 700; color: #1E1310; margin: 0 0 28px 0; line-height: 1.2;">
        Manana: tu sesion con Javier
      </p>

      <div style="background: #F9F1DE; border: 1px solid #E8E2D0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="font-family: Lora, system-ui, sans-serif; font-size: 18px; color: #1E1310; font-weight: 600; margin: 0;">
          ${date} a las ${time}
        </p>
      </div>

      ${meetLine}

      <p style="font-family: Inter, system-ui, sans-serif; font-size: 14px; color: #8A7E75; line-height: 1.6; margin: 0;">
        Prepara cualquier pregunta que tengas. Javier ya habra revisado tu mapa antes de la sesion.
      </p>`,
    buttonText: 'Ver mi mapa',
    buttonUrl: mapUrl,
  })

  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: `Manana: tu sesion con Javier — ${time}`,
    html,
  })
}

// ─── Email 3: Notificacion a Javier ─────────────────────────────────────────

interface JavierNotificationParams {
  userEmail: string
  slotStart: Date
  mapHash: string
}

export async function sendBookingNotificationToJavier({
  userEmail,
  slotStart,
  mapHash,
}: JavierNotificationParams): Promise<void> {
  const { date, time } = formatDateTimeSpanish(slotStart, 'Europe/Madrid')
  const mapUrl = `${getBaseUrl()}/mapa/${mapHash}`

  const html = buildBookingEmail({
    content: `
      <p style="font-family: Lora, system-ui, sans-serif; font-size: 28px; font-weight: 700; color: #1E1310; margin: 0 0 28px 0; line-height: 1.2;">
        Nueva sesion agendada
      </p>

      <div style="background: #F9F1DE; border: 1px solid #E8E2D0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="font-family: Inter, system-ui, sans-serif; font-size: 13px; color: #8A7E75; margin: 0 0 4px 0;">Persona</p>
        <p style="font-family: Lora, system-ui, sans-serif; font-size: 16px; color: #1E1310; font-weight: 600; margin: 0 0 20px 0;">${userEmail}</p>

        <p style="font-family: Inter, system-ui, sans-serif; font-size: 13px; color: #8A7E75; margin: 0 0 4px 0;">Fecha y hora</p>
        <p style="font-family: Lora, system-ui, sans-serif; font-size: 16px; color: #1E1310; font-weight: 600; margin: 0;">${date} a las ${time}</p>
      </div>

      <p style="font-family: Inter, system-ui, sans-serif; font-size: 14px; color: #8A7E75; line-height: 1.6; margin: 0;">
        Revisa su mapa antes de la sesion para personalizar la conversacion.
      </p>`,
    buttonText: 'Ver su mapa',
    buttonUrl: mapUrl,
  })

  await getResend().emails.send({
    from: getFromEmail(),
    to: JAVIER_EMAIL,
    subject: `Nueva sesion: ${userEmail} — ${date} ${time}`,
    html,
  })
}
