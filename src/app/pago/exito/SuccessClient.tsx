'use client'

/**
 * SuccessClient.tsx — Página de éxito post-pago (Client Component)
 *
 * Arco emocional en 5 bloques:
 * 1. Confirmación (check animado + "Tu Semana 1 ha comenzado")
 * 2. Elevación (la vergüenza se invierte)
 * 3. Presencia (Javier aparece)
 * 4. Anticipación (timeline 3 nodos)
 * 5. Primera acción (ir a email)
 * 6. Cierre (frase + link al mapa)
 */

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  hash: string | null
  email: string | null
  sessionId: string | null
}

/** Detecta el proveedor de email y devuelve la URL del webmail */
function getEmailUrl(email: string | null): string {
  if (!email) return 'https://mail.google.com'
  const domain = email.split('@')[1]?.toLowerCase()
  if (domain?.includes('gmail')) return 'https://mail.google.com'
  if (domain?.includes('outlook') || domain?.includes('hotmail') || domain?.includes('live'))
    return 'https://outlook.live.com'
  if (domain?.includes('yahoo')) return 'https://mail.yahoo.com'
  return 'https://mail.google.com'
}

export default function SuccessClient({ hash, email, sessionId }: Props) {
  // Registrar vista de la página de éxito + analytics
  useEffect(() => {
    if (hash) {
      fetch(`/api/mapa/${hash}/visita`, { method: 'PATCH' }).catch(() => {})
    }
  }, [hash])

  const emailUrl = getEmailUrl(email)
  const maskedEmail = email
    ? `${email.slice(0, 3)}***@${email.split('@')[1]}`
    : null

  return (
    <>
      <style>{`
        @keyframes checkCircle {
          from { stroke-dashoffset: 157; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes checkMark {
          from { stroke-dashoffset: 36; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes successFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nodePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61,154,95,0.3); }
          50%      { box-shadow: 0 0 0 8px rgba(61,154,95,0); }
        }
        .success-fade {
          animation: successFadeUp 500ms cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>

      <main style={{
        minHeight: '100vh',
        padding: 'calc(var(--header-height, 56px) + var(--space-16)) var(--space-6) var(--space-24)',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>

          {/* ══════════════════════════════════════════════════════════════
               BLOQUE 1 — CONFIRMACIÓN
             ══════════════════════════════════════════════════════════════ */}
          <div className="success-fade" style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            {/* Check animado */}
            <div style={{ margin: '0 auto var(--space-6)', width: '72px', height: '72px' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle
                  cx="36" cy="36" r="25"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                  strokeDasharray="157"
                  strokeDashoffset="157"
                  strokeLinecap="round"
                  style={{ animation: 'checkCircle 600ms ease-out 200ms forwards' }}
                />
                <path
                  d="M26 36l7 7 13-14"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="36"
                  strokeDashoffset="36"
                  style={{ animation: 'checkMark 400ms ease-out 700ms forwards', opacity: 0 }}
                />
              </svg>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-h2)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 'var(--lh-h2)',
              marginBottom: 'var(--space-3)',
            }}>
              Tu Semana 1 ha comenzado
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--lh-body)',
            }}>
              Todo lo que necesitas para las próximas 72 horas está en camino a tu bandeja de entrada.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
               BLOQUE 2 — ELEVACIÓN
             ══════════════════════════════════════════════════════════════ */}
          <div
            className="success-fade"
            style={{
              animationDelay: '400ms',
              marginBottom: 'var(--space-16)',
              textAlign: 'center',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-h3)',
              fontStyle: 'italic',
              lineHeight: '1.5',
              color: 'var(--color-text-secondary)',
            }}>
              La mayoría de personas con tu perfil de regulación esperan una media de 14 meses antes de actuar.
              Tú has necesitado 3 minutos para entender y 1 decisión para empezar.
              Eso dice más de ti que cualquier evaluación.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
               BLOQUE 3 — PRESENCIA (Javier)
             ══════════════════════════════════════════════════════════════ */}
          <div
            className="success-fade"
            style={{
              animationDelay: '700ms',
              marginBottom: 'var(--space-12)',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid rgba(61,154,95,0.12)',
              borderRadius: '16px',
              padding: 'var(--space-6)',
            }}
          >
            {/* Foto placeholder + info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}>
              {/* Avatar placeholder */}
              <img
                src="/javier.jpeg"
                alt="Javier A. Martín Ramos"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(61,154,95,0.2)',
                }}
              />

              <div>
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-h4)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)',
                }}>
                  Javier A. Martín Ramos
                </p>
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-tertiary)',
                  marginBottom: 'var(--space-4)',
                }}>
                  Director del Instituto Epigenético
                </p>
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--color-text-primary)',
                }}>
                  Ya tengo tu Mapa de Regulación. Sé cuál es tu dimensión más comprometida, tu arquetipo y tu patrón.
                  En nuestra sesión 1:1 no empezamos de cero — empezamos desde lo que tu cuerpo ya me ha contado.
                  Mi trabajo esta semana es que duermas mejor. Así de simple.
                </p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
               BLOQUE 4 — ANTICIPACIÓN (timeline 3 nodos)
             ══════════════════════════════════════════════════════════════ */}
          <div
            className="success-fade"
            style={{ animationDelay: '1000ms', marginBottom: 'var(--space-12)' }}
          >
            <h2 style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-h3)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-6)',
            }}>
              Qué pasa ahora
            </h2>

            {/* Timeline vertical */}
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              {/* Línea vertical */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '8px',
                bottom: '8px',
                width: '2px',
                background: 'rgba(61,154,95,0.15)',
              }} />

              {/* Nodo 1 — AHORA */}
              <div style={{ position: 'relative', marginBottom: 'var(--space-8)' }}>
                <div style={{
                  position: 'absolute',
                  left: '-28px',
                  top: '4px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  animation: 'nodePulse 2s ease infinite',
                }} />
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                }}>
                  Revisa tu email
                </p>
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--color-text-secondary)',
                }}>
                  En los próximos minutos recibes el Protocolo de Sueño de Emergencia — el manual diseñado por el Dr. Carlos Alvear con las intervenciones exactas para que tu cuerpo empiece a regularse esta noche. Léelo hoy.
                </p>
              </div>

              {/* Nodo 2 — 48H */}
              <div style={{ position: 'relative', marginBottom: 'var(--space-8)' }}>
                <div style={{
                  position: 'absolute',
                  left: '-26px',
                  top: '6px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '2px solid var(--color-accent)',
                }} />
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                }}>
                  Tu sesión con Javier
                </p>
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--color-text-secondary)',
                }}>
                  Recibirás un enlace para agendar tu sesión 1:1. Javier ya tiene tu mapa — la sesión no es una entrevista, es un plan de acción personalizado para tu sistema nervioso.
                </p>
              </div>

              {/* Nodo 3 — 72H */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '-26px',
                  top: '6px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '2px solid var(--color-accent)',
                }} />
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                }}>
                  Los primeros cambios
                </p>
                <p style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--color-text-secondary)',
                }}>
                  El 89% de los participantes notan una diferencia real en la calidad de su sueño durante los primeros 3 días. No es una promesa — es lo que confirman los datos. Si no la notas en 7 días, te devolvemos los 97€.
                </p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
               BLOQUE 5 — PRIMERA ACCIÓN (ir al email)
             ══════════════════════════════════════════════════════════════ */}
          <div
            className="success-fade"
            style={{
              animationDelay: '1300ms',
              marginBottom: 'var(--space-12)',
              backgroundColor: 'rgba(61,154,95,0.04)',
              border: '1px solid rgba(61,154,95,0.12)',
              borderRadius: '16px',
              padding: 'var(--space-6)',
              textAlign: 'center',
            }}
          >
            {/* Icono email */}
            <div style={{
              fontSize: '28px',
              marginBottom: 'var(--space-3)',
              color: 'var(--color-accent)',
            }}>
              ✉
            </div>

            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body)',
              lineHeight: 'var(--lh-body)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-5)',
            }}>
              Tu Protocolo de Sueño de Emergencia está llegando a{' '}
              <strong style={{ color: 'var(--color-accent)' }}>
                {maskedEmail ?? 'tu email'}
              </strong>.
              {' '}Si no lo ves en los próximos minutos, revisa la carpeta de spam.
            </p>

            <a
              href={emailUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              <Button variant="primary" size="large" style={{ width: '100%', maxWidth: '300px' }}>
                Ir a mi email
              </Button>
            </a>

            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              marginTop: 'var(--space-3)',
            }}>
              ¿No llega? Revisa spam o escribe a soporte@institutoepigenetico.com
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
               BLOQUE 6 — CIERRE
             ══════════════════════════════════════════════════════════════ */}
          <div
            className="success-fade"
            style={{ animationDelay: '1600ms', textAlign: 'center' }}
          >
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-h3)',
              fontStyle: 'italic',
              lineHeight: '1.5',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
            }}>
              Tu sistema nervioso lleva años funcionando en modo alarma.<br />
              Esta es la primera noche que tiene un plan para volver a la calma.
            </p>

            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              marginBottom: 'var(--space-3)',
            }}>
              Tu Mapa de Regulación sigue vivo en tu página personal. Vuelve cuando quieras.
            </p>

            {hash && (
              <a
                href={`/mapa/${hash}`}
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-accent)',
                  textDecoration: 'underline',
                }}
              >
                Ver mi mapa
              </a>
            )}
          </div>

        </div>
      </main>
    </>
  )
}
