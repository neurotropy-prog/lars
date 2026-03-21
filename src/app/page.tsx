/**
 * page.tsx — Página principal L.A.R.S.©
 * La landing ES el gateway. Una sola experiencia.
 * Fase 1: diseño visual completo. Funcionalidad (P2, localStorage, UTM) en Fase 2.
 */

import HeroSection from '@/components/landing/HeroSection'
import BelowTheFold from '@/components/landing/BelowTheFold'

export default function Home() {
  return (
    <>
      {/* Skip link para lectores de pantalla */}
      <a href="#p1-section" className="skip-link">
        Ir al diagnóstico
      </a>

      <main id="main-content">
        {/* Above the fold — Hero con P1 visible */}
        <HeroSection />

        {/* Transición gradiente entre hero y below the fold */}
        <div
          aria-hidden="true"
          style={{
            height: '80px',
            background: `linear-gradient(to bottom, var(--color-bg-primary), var(--color-bg-secondary))`,
            marginTop: '-1px',
          }}
        />

        {/* Below the fold — Para quien necesite más */}
        <BelowTheFold />
      </main>
    </>
  )
}
