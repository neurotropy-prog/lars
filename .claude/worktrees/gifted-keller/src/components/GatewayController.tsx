'use client'

/**
 * GatewayController — Orquesta toda la experiencia del Gateway L.A.R.S.©
 *
 * Fases:
 *   landing  → Hero + BelowTheFold (visible siempre debajo)
 *   bloque1  → P2 → Analizando → Primera Verdad → P3 → P4 → Micro-espejo 1
 *   bloque2  → P5 → P6 → Micro-espejo 2 → P7 (sliders) → P8
 *   bloque3  → Calculando → Bisagra → Email
 *
 * P1 se responde en el hero (GatewayController la recibe via onP1Select).
 * Al completar email, redirige a /mapa/[hash] con el diagnóstico completo.
 */

import { useState, useCallback } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import BelowTheFold from '@/components/landing/BelowTheFold'
import GatewayBloque1 from '@/components/gateway/GatewayBloque1'
import GatewayBloque2 from '@/components/gateway/GatewayBloque2'
import GatewayBloque3 from '@/components/gateway/GatewayBloque3'
import type { Bloque1Answers } from '@/components/gateway/GatewayBloque1'
import type { Bloque2Answers } from '@/lib/gateway-bloque2-data'

type Phase = 'landing' | 'bloque1' | 'bloque2' | 'bloque3'

export default function GatewayController() {
  const [phase, setPhase] = useState<Phase>('landing')
  const [p1, setP1] = useState<string | null>(null)
  const [bloque1Answers, setBloque1Answers] = useState<Bloque1Answers | null>(null)
  const [bloque2Answers, setBloque2Answers] = useState<Bloque2Answers | null>(null)

  /* P1 seleccionada en el hero → activa bloque1 */
  const handleP1Select = useCallback((id: string) => {
    setP1(id)
    setPhase('bloque1')
  }, [])

  /* Bloque1 completo → pasa a bloque2 */
  const handleBloque1Complete = useCallback((answers: Bloque1Answers) => {
    setBloque1Answers(answers)
    setPhase('bloque2')
  }, [])

  /* Bloque2 completo → pasa a bloque3 */
  const handleBloque2Complete = useCallback((answers: Bloque2Answers) => {
    setBloque2Answers(answers)
    setPhase('bloque3')
  }, [])

  /* Email enviado → redirigir al mapa */
  const handleBloque3Complete = useCallback(async (email: string) => {
    try {
      /* Enviar datos a la API → crea el mapa y devuelve el hash */
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          p1,
          bloque1: bloque1Answers,
          bloque2: bloque2Answers,
        }),
      })

      if (res.ok) {
        const { hash } = await res.json()
        window.location.href = `/mapa/${hash}`
      } else {
        /* Si la API falla, aún así mostrar una confirmación básica */
        window.location.href = '/mapa/preview'
      }
    } catch {
      window.location.href = '/mapa/preview'
    }
  }, [p1, bloque1Answers, bloque2Answers])

  /* Cerrar cualquier bloque → volver a landing */
  const handleClose = useCallback(() => {
    setPhase('landing')
  }, [])

  return (
    <>
      {/* Landing — siempre montada debajo de los overlays */}
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

      {/* Gateway overlays — se montan encima de la landing */}
      {phase === 'bloque1' && p1 && (
        <GatewayBloque1
          p1={p1}
          onComplete={handleBloque1Complete}
          onClose={handleClose}
        />
      )}

      {phase === 'bloque2' && p1 && bloque1Answers && (
        <GatewayBloque2
          p1={p1}
          p4={bloque1Answers.p4}
          onComplete={handleBloque2Complete}
          onClose={handleClose}
        />
      )}

      {phase === 'bloque3' && p1 && bloque1Answers && bloque2Answers && (
        <GatewayBloque3
          p1={p1}
          bloque1={bloque1Answers}
          bloque2={bloque2Answers}
          onComplete={handleBloque3Complete}
          onClose={handleClose}
        />
      )}
    </>
  )
}
