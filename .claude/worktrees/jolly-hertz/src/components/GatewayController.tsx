'use client'

/**
 * GatewayController — Gestiona el estado de P1 y la activación del gateway.
 *
 * Es el punto de unión entre la landing (HeroSection + BelowTheFold)
 * y el GatewayBloque1. Cuando el usuario selecciona P1, el gateway
 * aparece como overlay fullscreen sobre la landing.
 *
 * La landing permanece montada debajo — al cerrar el gateway (demo),
 * la landing vuelve a ser visible sin recargar la página.
 */

import { useState } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import BelowTheFold from '@/components/landing/BelowTheFold'
import GatewayBloque1 from '@/components/gateway/GatewayBloque1'

export default function GatewayController() {
  const [p1Answer, setP1Answer] = useState<string | null>(null)

  function handleP1Select(id: string) {
    setP1Answer(id)
  }

  function handleGatewayClose() {
    setP1Answer(null)
  }

  return (
    <>
      {/* Landing — siempre montada */}
      <HeroSection onP1Select={handleP1Select} />

      <div
        aria-hidden="true"
        style={{
          height: '80px',
          background: `linear-gradient(to bottom, var(--color-bg-primary), var(--color-bg-secondary))`,
          marginTop: '-1px',
        }}
      />

      <BelowTheFold />

      {/* Gateway — overlay cuando P1 está respondida */}
      {p1Answer && (
        <GatewayBloque1
          p1={p1Answer}
          onClose={handleGatewayClose}
        />
      )}
    </>
  )
}
