'use client'

/**
 * GatewayController — Gestiona el estado global del gateway.
 *
 * Orquesta la transición entre bloques:
 *   - P1 (hero) → GatewayBloque1 → GatewayBloque2 → [Fase 4: Bisagra]
 *
 * Estado:
 *   - p1Answer: respuesta del hero (activa el gateway)
 *   - p4Answer: respuesta de P4 (pasa a Bloque2 para personalización de tono)
 *   - activeBlock: qué bloque está activo ('1' | '2' | null)
 *
 * La landing permanece montada debajo — al cerrar el gateway (demo),
 * vuelve visible sin recargar la página.
 */

import { useState } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import BelowTheFold from '@/components/landing/BelowTheFold'
import GatewayBloque1 from '@/components/gateway/GatewayBloque1'
import GatewayBloque2 from '@/components/gateway/GatewayBloque2'

export default function GatewayController() {
  const [p1Answer, setP1Answer]     = useState<string | null>(null)
  const [p4Answer, setP4Answer]     = useState<string | null>(null)
  const [activeBlock, setActiveBlock] = useState<1 | 2 | null>(null)

  function handleP1Select(id: string) {
    setP1Answer(id)
    setActiveBlock(1)
  }

  function handleBloque1Complete(p4: string) {
    setP4Answer(p4)
    setActiveBlock(2)
  }

  function handleGatewayClose() {
    setP1Answer(null)
    setP4Answer(null)
    setActiveBlock(null)
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

      {/* Bloque 1 — overlay cuando P1 está respondida */}
      {activeBlock === 1 && p1Answer && (
        <GatewayBloque1
          p1={p1Answer}
          onClose={handleGatewayClose}
          onComplete={handleBloque1Complete}
        />
      )}

      {/* Bloque 2 — overlay cuando Bloque 1 ha completado */}
      {activeBlock === 2 && p1Answer && p4Answer && (
        <GatewayBloque2
          p1={p1Answer}
          p4={p4Answer}
          onClose={handleGatewayClose}
          onComplete={handleGatewayClose}
        />
      )}
    </>
  )
}
