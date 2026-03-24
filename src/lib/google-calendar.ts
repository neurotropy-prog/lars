/**
 * google-calendar.ts — Integracion con Google Calendar via OAuth2 Refresh Token
 *
 * Crea y elimina eventos en el calendario de Javier.
 * Usa OAuth2 con un refresh token permanente (se obtiene una sola vez).
 *
 * Requiere en variables de entorno:
 *   GOOGLE_CLIENT_ID — Client ID de la app OAuth
 *   GOOGLE_CLIENT_SECRET — Client Secret de la app OAuth
 *   GOOGLE_REFRESH_TOKEN — Refresh token de Javier (se obtiene una vez)
 *   GOOGLE_CALENDAR_ID — email del calendario (javier@institutoepigenetico.com)
 */

import { google, calendar_v3 } from 'googleapis'

function getCalendarClient(): calendar_v3.Calendar {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Faltan variables de entorno: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN'
    )
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

function getCalendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID
  if (!id) throw new Error('GOOGLE_CALENDAR_ID no esta configurada')
  return id
}

interface CreateEventParams {
  summary: string
  description: string
  startTime: Date
  endTime: Date
  attendeeEmail: string
}

interface CalendarEventResult {
  eventId: string
  meetUrl: string | null
}

/**
 * Crea un evento en el calendario de Javier con Google Meet automatico.
 */
export async function createCalendarEvent({
  summary,
  description,
  startTime,
  endTime,
  attendeeEmail,
}: CreateEventParams): Promise<CalendarEventResult> {
  const calendar = getCalendarClient()
  const calendarId = getCalendarId()

  const JAVIER_EMAIL = 'javier@institutoepigenetico.com'
  const attendees = [
    { email: attendeeEmail },
    { email: JAVIER_EMAIL },
  ]

  console.log('[Google Calendar] Creando evento:', {
    calendarId,
    attendees: attendees.map((a) => a.email),
    summary,
    start: startTime.toISOString(),
    end: endTime.toISOString(),
  })

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
    requestBody: {
      summary,
      description,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `lars-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    },
  })

  console.log('[Google Calendar] Evento creado:', {
    eventId: event.data.id,
    status: event.data.status,
    htmlLink: event.data.htmlLink,
    meetUrl: event.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === 'video'
    )?.uri,
  })

  const meetUrl =
    event.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === 'video'
    )?.uri ?? null

  return {
    eventId: event.data.id ?? '',
    meetUrl,
  }
}

/**
 * Elimina un evento del calendario de Javier.
 */
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const calendar = getCalendarClient()
  const calendarId = getCalendarId()

  await calendar.events.delete({ calendarId, eventId })
}
