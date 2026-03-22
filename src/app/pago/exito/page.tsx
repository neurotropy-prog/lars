/**
 * /pago/exito — Confirmación post-pago
 * Usa el sistema de diseño (globals.css + componentes ui/).
 */

import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Bienvenido a L.A.R.S. · Semana 1 confirmada',
  description: 'Tu acceso a la Semana 1 del Programa L.A.R.S. está confirmado.',
  robots: { index: false, follow: false },
}

export default async function PagoExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ hash?: string; session_id?: string }>
}) {
  const { hash } = await searchParams

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-12) var(--space-6)',
    }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>

        {/* Icono de confirmación */}
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '50%',
          background: 'rgba(74,222,128,0.08)',
          border: '1px solid rgba(74,222,128,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-6)',
          fontSize: '24px',
          color: 'var(--color-success)',
        }}>
          ✓
        </div>

        {/* Overline */}
        <p style={{
          fontFamily: 'var(--font-inter-tight)',
          fontSize: 'var(--text-overline)',
          letterSpacing: 'var(--ls-overline)',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          marginBottom: 'var(--space-4)',
        }}>
          Semana 1 confirmada
        </p>

        {/* Título */}
        <h1 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'var(--text-h1)',
          lineHeight: 'var(--lh-h1)',
          letterSpacing: 'var(--ls-h1)',
          fontStyle: 'italic',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-5)',
        }}>
          Tu sistema nervioso acaba de recibir la primera señal de seguridad.
        </h1>

        {/* Cuerpo */}
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-3)',
        }}>
          Javier revisará tu mapa antes de la sesión. En las próximas horas recibirás
          un email con el acceso al Protocolo de Sueño de Emergencia y el enlace
          para reservar tu sesión 1:1.
        </p>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--lh-body-sm)',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-10)',
        }}>
          Si no recibes el email en 15 minutos, revisa tu carpeta de spam
          o escríbenos a hola@institutoepigenetico.es
        </p>

        {/* Timeline — qué pasa ahora */}
        <Card style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
          <p style={{
            fontFamily: 'var(--font-inter-tight)',
            fontSize: 'var(--text-overline)',
            letterSpacing: 'var(--ls-overline)',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-4)',
          }}>
            Qué pasa ahora
          </p>
          {[
            ['Hoy', 'Recibirás el acceso al Protocolo de Sueño de Emergencia por email.'],
            ['Primeras 72 h', 'Sigue el protocolo. Tu cuerpo empezará a notar la diferencia.'],
            ['Sesión 1:1', 'Javier revisará tu mapa y trabajaréis juntos el plan de las 12 semanas.'],
            ['MNN©', 'Tu Mapa de Niveles de Neurotransmisores se activa con la sesión.'],
          ].map(([tiempo, desc]) => (
            <div key={tiempo} style={{
              display: 'flex', gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)',
            }}>
              <span style={{
                fontFamily: 'var(--font-inter-tight)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-accent)',
                fontWeight: 500,
                minWidth: '80px',
                paddingTop: '1px',
              }}>
                {tiempo}
              </span>
              <span style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--lh-body-sm)',
              }}>
                {desc}
              </span>
            </div>
          ))}
        </Card>

        {/* CTA volver al mapa */}
        {hash && (
          <Link href={`/mapa/${hash}`} style={{ display: 'inline-block', marginBottom: 'var(--space-8)' }}>
            <Button variant="secondary">
              Volver a mi mapa
            </Button>
          </Link>
        )}

        {/* Garantía */}
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-caption)',
          color: 'var(--color-text-tertiary)',
          opacity: 0.7,
        }}>
          Garantía de 7 días · Si tu sueño no mejora, te devolvemos los 97€ sin preguntas.
        </p>

      </div>
    </main>
  )
}
