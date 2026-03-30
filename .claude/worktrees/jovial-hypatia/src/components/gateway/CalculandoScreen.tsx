'use client'

/**
 * CalculandoScreen — A-09
 *
 * "Calculando tu perfil de regulación…" con TypeWriter (35ms/char).
 * Zona 3 — Revelación: fondo más oscuro y envolvente que ZONA 2.
 *
 * Timing:
 *   T+0ms    Aparece con step-enter sobre fondo oscuro máximo
 *   T+300ms  TypeWriter empieza (35ms/char × 32 chars ≈ 1120ms)
 *   T+1420ms Typing completo, cursor parpadea
 *   T+2220ms onComplete — GatewayBloque3 avanza a Bisagra
 *
 * prefers-reduced-motion: texto completo instantáneo, onComplete a 1200ms.
 */

import { useEffect } from 'react'
import TypeWriter from '@/components/ui/TypeWriter'

const CALCULANDO_TEXT = 'Calculando tu perfil de regulación\u2026'

interface CalculandoScreenProps {
  onComplete: () => void
}

export default function CalculandoScreen({ onComplete }: CalculandoScreenProps) {
  /* Fallback para prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      const t = setTimeout(onComplete, 1200)
      return () => clearTimeout(t)
    }
  }, [onComplete])

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
        minHeight: '60vh',
        gap: 'var(--space-5)',
        /* ZONA 3 — máxima oscuridad envolvente */
        background: 'radial-gradient(ellipse at center, #070f12 0%, #030a0c 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-16) var(--space-8)',
      }}
    >
      {/* Punto de luz central — sutil, orgánico */}
      <div
        aria-hidden="true"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(198,200,238,0.18) 0%, transparent 70%)',
          marginBottom: 'var(--space-4)',
          animation: 'pulse-glow 2.5s ease-in-out infinite',
        }}
      />

      <TypeWriter
        text={CALCULANDO_TEXT}
        speed={35}
        delay={300}
        onComplete={handleTypingComplete}
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          textAlign: 'center',
          display: 'block',
          minHeight: '1.6em',
        }}
      />
    </div>
  )
}
