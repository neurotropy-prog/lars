'use client'

/**
 * AnalyzingScreen — A-05: "Analizando tus respuestas..."
 *
 * Upgrade: TypeWriter carácter a carácter con cursor parpadeante.
 * Secuencia:
 *   T+0ms   Aparece con step-enter
 *   T+300ms Typing empieza (40ms/char, ~1160ms para el texto completo)
 *   T+1460ms Typing completo, cursor parpadea
 *   T+2260ms onComplete → GatewayBloque1 inicia cross-fade hacia Primera Verdad
 *
 * prefers-reduced-motion: texto aparece completo, onComplete tras 1200ms.
 */

import { useEffect } from 'react'
import TypeWriter from '@/components/ui/TypeWriter'

const ANALYZING_TEXT = 'Analizando tus respuestas\u2026'

interface AnalyzingScreenProps {
  onComplete: () => void
}

export default function AnalyzingScreen({ onComplete }: AnalyzingScreenProps) {
  /* Fallback para prefers-reduced-motion: texto instantáneo, onComplete tras 1200ms */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      const t = setTimeout(onComplete, 1200)
      return () => clearTimeout(t)
    }
  }, [onComplete])

  /* TypeWriter llama a onComplete cuando termina el typing + pausa cursor.
     En modo reduced-motion el useEffect de arriba ya lo maneja primero. */
  const handleTypingComplete = () => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!mq.matches) onComplete()
  }

  return (
    <div
      className="step-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 'var(--space-5)',
      }}
    >
      {/* Texto con typing effect */}
      <TypeWriter
        text={ANALYZING_TEXT}
        speed={40}
        delay={300}
        onComplete={handleTypingComplete}
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          textAlign: 'center',
          display: 'block',
          minHeight: '1.6em', /* evita salto de layout al aparecer el texto */
        }}
      />

      {/* Dots — fallback visual mientras espera */}
      <div className="analyzing-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
