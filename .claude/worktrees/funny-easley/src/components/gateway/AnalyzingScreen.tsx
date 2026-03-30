'use client'

/**
 * AnalyzingScreen — "Analizando tus respuestas..."
 *
 * Aparece durante 1.8s mientras el fondo ya está transitando a ZONA 2.
 * Genera anticipación intencional antes de la Primera Verdad.
 * Solo CSS — sin librerías externas.
 */

import { useEffect } from 'react'

interface AnalyzingScreenProps {
  onComplete: () => void
}

export default function AnalyzingScreen({ onComplete }: AnalyzingScreenProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1800)
    return () => clearTimeout(t)
  }, [onComplete])

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
      {/* Texto */}
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Analizando tus respuestas…
      </p>

      {/* Dots animados — definidos en globals.css */}
      <div className="analyzing-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
