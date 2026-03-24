/**
 * not-found.tsx — Mapa no encontrado
 * Usa el sistema de diseño (globals.css + componentes ui/).
 */

import { Metadata } from 'next'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Mapa no encontrado · L.A.R.S.',
  robots: { index: false, follow: false },
}

export default function MapaNotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-12) var(--space-6)',
    }}>
      <div style={{ maxWidth: '400px', textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/logo-instituto-epigenetico.png"
          alt="Instituto Epigenético"
          width={156}
          height={28}
          style={{ display: 'block', margin: '0 auto var(--space-10)' }}
        />
        <h1 style={{
          fontFamily: 'var(--font-lora)',
          fontSize: 'var(--text-h2)',
          lineHeight: 'var(--lh-h2)',
          letterSpacing: 'var(--ls-h2)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-4)',
        }}>
          No hemos podido cargar tu mapa
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-10)',
        }}>
          El enlace puede haber caducado o ser incorrecto. Si recibiste un email con tu mapa, prueba el botón de ese email directamente.
        </p>
        <a href="/">
          <Button variant="primary" size="large">
            Hacer la evaluación de nuevo
          </Button>
        </a>
      </div>
    </main>
  )
}
