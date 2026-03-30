'use client'

/**
 * AutomationsFlow — Full vertical flow visualization of the email automation system.
 *
 * Two sections:
 *   1. Secuencia de nurturing (d0–d90 + suppression rule + goodbye)
 *   2. Emails especiales (post-pago, booking confirmation, reminder)
 */

import EmailFlowNode from './EmailFlowNode'
import SuppressionNode from './SuppressionNode'

interface EmailData {
  key: string
  name: string
  subject: string
  trigger: string
  day: number
  sent: number
  opened: number
  open_rate: number
}

interface TemplateInfo {
  email_key: string
  is_customized: boolean
}

interface AutomationsFlowProps {
  emails: EmailData[] | null
  loading: boolean
  templates?: TemplateInfo[]
  onEditTemplate?: (emailKey: string) => void
}

// ── Email content metadata (descriptions + CTAs from email.ts) ──────────────

const EMAIL_META: Record<string, { description: string; cta: string; conditions?: string }> = {
  d0: {
    description:
      'Envío inmediato al capturar email. Incluye score global, las 5 dimensiones con barras de color, la dimensión más comprometida y enlace al mapa interactivo.',
    cta: 'Ver mi mapa',
  },
  d3: {
    description:
      'Revela el arquetipo del sistema nervioso. Genera curiosidad sobre una pieza que "faltaba" en el diagnóstico inicial.',
    cta: 'Ver mi mapa',
  },
  d7: {
    description:
      'Nuevo insight sobre la dimensión más comprometida. Dato de inteligencia colectiva que no existía cuando hizo el diagnóstico.',
    cta: 'Ver mi mapa',
  },
  d10: {
    description:
      'Invitación a agendar sesión con Javier. 20 minutos, sin compromiso. Javier ya tiene los datos del mapa.',
    cta: 'Agendar sesión',
  },
  d14: {
    description:
      'Desbloquea 3 subdimensiones con 2 preguntas adicionales. Aumenta la resolución del diagnóstico.',
    cta: 'Ver mi mapa',
  },
  d21: {
    description:
      'Extracto personalizado del libro "Burnout: El Renacimiento del Líder Fénix", basado en la dimensión más comprometida.',
    cta: 'Ver mi mapa',
  },
  d30: {
    description:
      'Reevaluación a 30 días. Actualiza el mapa en 30 segundos. Los scores anteriores se guardan para comparar evolución.',
    cta: 'Actualizar mi mapa',
  },
  d90: {
    description:
      'Reevaluación trimestral. "¿Ha cambiado algo?" El mapa sigue vivo, actualizable en 30 segundos.',
    cta: 'Actualizar mi mapa',
    conditions: 'Se repite cada 90 días mientras el usuario esté activo',
  },
  goodbye: {
    description:
      'Email de despedida empática. Mensaje cálido: "Tu mapa sigue aquí. Sigue vivo." Con opción de reactivar en un clic. Sin footer de baja.',
    cta: 'Seguir recibiendo actualizaciones',
    conditions: 'Se envía cuando 3+ emails consecutivos no se abren',
  },
}

// ── Special emails (no API stats — static nodes) ────────────────────────────

const SPECIAL_EMAILS: EmailData[] = [
  {
    key: 'post_pago',
    name: 'Bienvenida Semana 1',
    subject: 'Tu Semana 1 empieza ahora — aquí tienes todo',
    trigger: 'Inmediato al confirmar pago (Stripe webhook)',
    day: 0,
    sent: 0, opened: 0, open_rate: 0,
  },
  {
    key: 'booking_confirm',
    name: 'Confirmación de sesión',
    subject: 'Tu sesión con Javier está confirmada',
    trigger: 'Inmediato al reservar sesión (Cal.com webhook)',
    day: 0,
    sent: 0, opened: 0, open_rate: 0,
  },
  {
    key: 'booking_reminder',
    name: 'Recordatorio 24h',
    subject: 'Mañana: tu sesión con Javier',
    trigger: '24h antes de la sesión (cron job)',
    day: 0,
    sent: 0, opened: 0, open_rate: 0,
  },
]

const SPECIAL_META: Record<string, { description: string; cta: string }> = {
  post_pago: {
    description:
      'Email de bienvenida al programa LARS. Incluye acceso a Semana 1, recordatorio de garantía de 7 días, y datos de contacto directo con Javier.',
    cta: 'Acceder a Semana 1',
  },
  booking_confirm: {
    description:
      'Confirmación de sesión con datos: fecha, hora, enlace de videollamada. Enviado tanto al usuario como a Javier.',
    cta: 'Ver detalles de sesión',
  },
  booking_reminder: {
    description:
      'Recordatorio 24h antes de la sesión. Incluye hora y enlace de videollamada.',
    cta: 'Preparar sesión',
  },
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function FlowSkeleton() {
  return (
    <div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 0 }}>
          <div
            style={{
              width: '40px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '2px', height: '24px', background: 'rgba(205,121,108,0.15)' }} />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'rgba(205,121,108,0.15)',
              }}
            />
            {i < 4 && (
              <div style={{ width: '2px', height: '80px', background: 'rgba(205,121,108,0.15)' }} />
            )}
          </div>
          <div
            style={{
              flex: 1,
              background: 'var(--color-bg-tertiary)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-4)',
              marginLeft: 'var(--space-3)',
              minHeight: '100px',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-secondary)',
                marginBottom: 'var(--space-3)',
                animation: 'hubPulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '200px',
                height: '12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-secondary)',
                animation: 'hubPulse 1.5s ease-in-out infinite',
                animationDelay: '0.2s',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        margin: 'var(--space-8) 0 var(--space-5) 0',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--color-text-tertiary)',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'rgba(180, 90, 50, 0.15)',
        }}
      />
    </div>
  )
}

// ── Component ───────────────────────────────────────────────────────────────

export default function AutomationsFlow({ emails, loading, templates, onEditTemplate }: AutomationsFlowProps) {
  if (loading || !emails) {
    return (
      <div>
        <SectionHeader title="Secuencia de nurturing" />
        <FlowSkeleton />
      </div>
    )
  }

  // Split: nurturing emails (d0–d90) vs goodbye
  const nurturingEmails = emails.filter((e) => e.key !== 'goodbye')
  const goodbyeEmail = emails.find((e) => e.key === 'goodbye')

  const isCustomized = (key: string) =>
    templates?.some((t) => t.email_key === key && t.is_customized) ?? false

  return (
    <div>
      {/* ── Section 1: Nurturing sequence ─────────────────────────────── */}
      <SectionHeader title="Secuencia de nurturing" />

      {nurturingEmails.map((email) => {
        const meta = EMAIL_META[email.key]
        if (!meta) return null
        return (
          <EmailFlowNode
            key={email.key}
            email={email}
            description={meta.description}
            cta={meta.cta}
            conditions={meta.conditions}
            onEdit={onEditTemplate}
            isCustomized={isCustomized(email.key)}
          />
        )
      })}

      {/* Suppression rule */}
      <SuppressionNode />

      {/* Goodbye email (after suppression rule) */}
      {goodbyeEmail && EMAIL_META.goodbye && (
        <EmailFlowNode
          email={goodbyeEmail}
          description={EMAIL_META.goodbye.description}
          cta={EMAIL_META.goodbye.cta}
          conditions={EMAIL_META.goodbye.conditions}
          isLast
          onEdit={onEditTemplate}
          isCustomized={isCustomized('goodbye')}
        />
      )}

      {/* ── Section 2: Special emails ─────────────────────────────────── */}
      <SectionHeader title="Emails especiales" />

      {SPECIAL_EMAILS.map((email, i) => {
        const meta = SPECIAL_META[email.key]
        if (!meta) return null
        return (
          <EmailFlowNode
            key={email.key}
            email={email}
            description={meta.description}
            cta={meta.cta}
            isSpecial
            isLast={i === SPECIAL_EMAILS.length - 1}
            onEdit={email.key === 'post_pago' ? onEditTemplate : undefined}
            isCustomized={isCustomized(email.key)}
          />
        )
      })}
    </div>
  )
}
