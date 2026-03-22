/**
 * /pago/exito — Página de confirmación post-pago
 *
 * Stripe redirige aquí tras un pago exitoso.
 * Params: session_id (Stripe), hash (del diagnóstico)
 */

import { Metadata } from 'next'
import Link from 'next/link'

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Inter:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body {
          margin: 0; padding: 0;
          background: #0B0F0E; color: #E8EAE9;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main style={{
        minHeight: '100vh', background: '#0B0F0E',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div
          style={{
            maxWidth: '480px', width: '100%', textAlign: 'center',
            animation: 'fadeUp 500ms cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          {/* Icono */}
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px', fontSize: '28px',
          }}>
            ✓
          </div>

          {/* Overline */}
          <p style={{
            fontFamily: 'Inter, system-ui', fontSize: '11px',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#4ADE80', margin: '0 0 16px',
          }}>
            Semana 1 confirmada
          </p>

          {/* Título */}
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(28px, 6vw, 38px)', fontWeight: 500,
            lineHeight: 1.2, color: '#F5F5F0',
            margin: '0 0 20px', letterSpacing: '-0.01em',
          }}>
            Tu sistema nervioso acaba de recibir la primera señal de seguridad.
          </h1>

          {/* Cuerpo */}
          <p style={{
            fontFamily: 'Inter, system-ui', fontSize: '15px',
            lineHeight: 1.7, color: '#A8B0AC', margin: '0 0 10px',
          }}>
            Javier revisará tu mapa antes de la sesión. En las próximas horas recibirás
            un email con el acceso al Protocolo de Sueño de Emergencia y el enlace
            para reservar tu sesión 1:1.
          </p>
          <p style={{
            fontFamily: 'Inter, system-ui', fontSize: '14px',
            lineHeight: 1.7, color: '#6B7572', margin: '0 0 40px',
          }}>
            Si no recibes el email en 15 minutos, revisa tu carpeta de spam
            o escríbenos a hola@institutoepigenetico.es
          </p>

          {/* Card — qué pasa ahora */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px', padding: '24px 28px',
            textAlign: 'left', marginBottom: '36px',
          }}>
            <p style={{
              fontFamily: 'Inter, system-ui', fontSize: '12px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#6B7572', margin: '0 0 16px',
            }}>
              Qué pasa ahora
            </p>
            {[
              ['Hoy', 'Recibirás el acceso al Protocolo de Sueño de Emergencia por email.'],
              ['Primeras 72 h', 'Sigue el protocolo. Tu cuerpo empezará a notar la diferencia.'],
              ['Sesión 1:1', 'Javier revisará tu mapa y trabajaréis juntos el plan de las 12 semanas.'],
              ['MNN©', 'Tu Mapa de Niveles de Neurotransmisores se activa con la sesión.'],
            ].map(([tiempo, desc]) => (
              <div key={tiempo} style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                <span style={{
                  fontFamily: 'Inter, system-ui', fontSize: '12px',
                  color: '#4ADE80', fontWeight: 500, minWidth: '76px',
                  paddingTop: '1px',
                }}>
                  {tiempo}
                </span>
                <span style={{
                  fontFamily: 'Inter, system-ui', fontSize: '14px',
                  color: '#A8B0AC', lineHeight: 1.6,
                }}>
                  {desc}
                </span>
              </div>
            ))}
          </div>

          {/* CTA volver al mapa */}
          {hash && (
            <Link
              href={`/mapa/${hash}`}
              style={{
                display: 'inline-block',
                padding: '14px 28px', borderRadius: '100px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#A8B0AC',
                fontFamily: 'Inter, system-ui', fontSize: '14px',
                textDecoration: 'none',
                transition: 'border-color 200ms, color 200ms',
              }}
            >
              Volver a mi mapa
            </Link>
          )}

          {/* Garantía */}
          <p style={{
            fontFamily: 'Inter, system-ui', fontSize: '12px',
            color: '#3d5048', margin: '32px 0 0',
          }}>
            Garantía de 7 días · Si tu sueño no mejora, te devolvemos los 97€ sin preguntas.
          </p>
        </div>
      </main>
    </>
  )
}
