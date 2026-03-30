'use client'

/**
 * P1Cards — Primera pregunta del gateway, visible en el hero sin botón intermedio.
 * Fase 1: feedback visual al seleccionar. Transición a P2 se conecta en Fase 2.
 * Emite evento 'scrollToP1' para el CTA del below-the-fold.
 */

import { useState, useEffect, useCallback } from 'react'

const options = [
  {
    id: 'A',
    title: '"Agotamiento que no se va"',
    subtitle: 'Llevas tiempo sintiéndote agotado y nada de lo que haces lo resuelve',
  },
  {
    id: 'B',
    title: '"Rendimiento en caída"',
    subtitle: 'Tu capacidad ha bajado y no entiendes por qué',
  },
  {
    id: 'C',
    title: '"El cuerpo habla"',
    subtitle: 'Duermes mal, estás irritable, y tu cuerpo da señales que no puedes ignorar',
  },
  {
    id: 'D',
    title: '"Alguien me lo sugirió"',
    subtitle: 'Un médico, terapeuta o alguien de confianza te recomendó explorar esto',
  },
  {
    id: 'E',
    title: '"Curiosidad"',
    subtitle: 'Quieres saber cómo está tu sistema nervioso',
  },
]

export default function P1Cards() {
  const [selected, setSelected] = useState<string | null>(null)
  const [isPulsing, setIsPulsing] = useState(false)

  // Escucha el evento del CTA de below-the-fold para hacer pulse
  useEffect(() => {
    const handler = () => {
      setIsPulsing(true)
      const timer = setTimeout(() => setIsPulsing(false), 500)
      return () => clearTimeout(timer)
    }
    window.addEventListener('scrollToP1', handler)
    return () => window.removeEventListener('scrollToP1', handler)
  }, [])

  const handleSelect = useCallback((id: string) => {
    if (selected === id) return
    setSelected(id)
    // Fase 2: aquí se disparará la transición a P2
  }, [selected])

  return (
    <div
      id="p1-section"
      className={isPulsing ? 'p1-pulse' : ''}
      style={{ width: '100%' }}
    >
      {/* Pregunta */}
      <p
        style={{
          fontFamily: 'var(--font-inter-tight)',
          fontSize: 'var(--text-h3)',
          lineHeight: 'var(--lh-h3)',
          letterSpacing: 'var(--ls-h3)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        ¿Qué te trajo hasta aquí?
      </p>

      {/* Cards */}
      <div
        role="radiogroup"
        aria-label="¿Qué te trajo hasta aquí?"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {options.map((option) => {
          const isSelected = selected === option.id
          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(option.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: isSelected
                  ? 'var(--color-accent-subtle)'
                  : 'var(--color-bg-secondary)',
                border: isSelected
                  ? '1px solid var(--color-accent)'
                  : 'var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4) var(--space-5)',
                cursor: 'pointer',
                transition:
                  'background var(--transition-fast), border-color var(--transition-fast)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--space-4)',
                minHeight: '44px',
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-inter-tight)',
                    fontSize: 'var(--text-body)',
                    lineHeight: 'var(--lh-body)',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  {option.title}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    lineHeight: 'var(--lh-body-sm)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {option.subtitle}
                </p>
              </div>

              {/* Checkmark — solo visible al seleccionar */}
              <div
                style={{
                  flexShrink: 0,
                  width: '20px',
                  height: '20px',
                  marginTop: '2px',
                  opacity: isSelected ? 1 : 0,
                  transition: 'opacity var(--transition-fast)',
                }}
                aria-hidden="true"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="10" r="9" />
                  <path d="M6.5 10.5l2.5 2.5 4.5-5" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
