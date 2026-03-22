/**
 * not-found.tsx — Mapa no encontrado (hash inválido o expirado)
 *
 * Four Seasons: nunca dejar al usuario en una página en blanco o con error técnico.
 * Mensaje elegante, opción de volver al diagnóstico.
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mapa no encontrado · L.A.R.S.',
  robots: { index: false, follow: false },
}

export default function MapaNotFound() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #0B0F0E;
          color: #E8EAE9;
          font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#4ADE80',
              marginBottom: '16px',
            }}
          >
            L.A.R.S.©
          </p>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 500,
              color: '#E8EAE9',
              marginBottom: '16px',
              lineHeight: 1.3,
            }}
          >
            No hemos podido cargar tu mapa
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#8A9E98',
              lineHeight: 1.65,
              marginBottom: '40px',
            }}
          >
            El enlace puede haber caducado o ser incorrecto. Si recibiste un email con tu mapa, prueba el botón de ese email directamente.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              borderRadius: '100px',
              background: '#4ADE80',
              color: '#0B0F0E',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Hacer el diagnóstico de nuevo
          </a>
        </div>
      </main>
    </>
  )
}
