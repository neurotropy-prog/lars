'use client'

/**
 * MultiSelectStep — Pregunta de selección múltiple para P3 (claridad cognitiva).
 *
 * Comportamiento:
 * - Cada ítem toggle individualmente (150ms por ítem)
 * - "Ninguna de estas" desactiva todos los demás y viceversa
 * - Botón "Continuar" aparece al marcar ≥1 ítem (fade-in 300ms)
 * - Si marca 4+ ítems: el botón hace pulse CSS (attractor, 2s ciclo)
 */

import { useState } from 'react'
import type { MultiOption } from '@/lib/gateway-bloque1-data'

interface MultiSelectStepProps {
  question: string
  context?: string
  collectiveData?: string
  options: MultiOption[]
  onContinue: (selections: string[]) => void
}

export default function MultiSelectStep({
  question,
  context,
  collectiveData,
  options,
  onContinue,
}: MultiSelectStepProps) {
  const [selections, setSelections] = useState<string[]>([])

  function toggle(id: string) {
    if (id === 'ninguna') {
      setSelections(selections.includes('ninguna') ? [] : ['ninguna'])
      return
    }
    setSelections((prev) => {
      const withoutNinguna = prev.filter((s) => s !== 'ninguna')
      if (withoutNinguna.includes(id)) {
        return withoutNinguna.filter((s) => s !== id)
      }
      return [...withoutNinguna, id]
    })
  }

  const showButton = selections.length > 0
  const realCount = selections.filter((s) => s !== 'ninguna').length
  const isPulsing = realCount >= 4

  return (
    <div className="step-enter" style={{ width: '100%' }}>
      {/* Pregunta */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-h3)',
          lineHeight: 'var(--lh-h3)',
          letterSpacing: 'var(--ls-h3)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: context ? 'var(--space-3)' : 'var(--space-5)',
        }}
      >
        {question}
      </p>

      {/* Contexto */}
      {context && (
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            fontStyle: 'italic',
            color: 'var(--color-text-secondary)',
            marginBottom: collectiveData ? 'var(--space-2)' : 'var(--space-5)',
          }}
        >
          {context}
        </p>
      )}

      {/* Dato colectivo */}
      {collectiveData && (
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-5)',
          }}
        >
          {collectiveData}
        </p>
      )}

      {/* Ítems */}
      <div
        role="group"
        aria-label={question}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {options.map((option) => {
          const isSelected = selections.includes(option.id)
          const isNinguna = option.id === 'ninguna'

          return (
            <button
              key={option.id}
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(option.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: isSelected
                  ? 'var(--color-accent-subtle)'
                  : 'var(--color-bg-elevated)',
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
                // Ninguna siempre con ligero separador visual
                marginTop: isNinguna ? 'var(--space-2)' : 0,
                opacity: isNinguna && realCount > 0 ? 0.5 : 1,
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-body)',
                    lineHeight: 'var(--lh-body)',
                    fontWeight: 600,
                    color: isSelected
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-secondary)',
                    marginBottom: option.subtitle ? 'var(--space-1)' : 0,
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {option.title}
                </p>
                {option.subtitle && (
                  <p
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: 'var(--text-body-sm)',
                      lineHeight: 'var(--lh-body-sm)',
                      fontStyle: 'italic',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    {option.subtitle}
                  </p>
                )}
              </div>

              {/* Checkmark cuadrado — multiselect */}
              <div
                style={{
                  flexShrink: 0,
                  width: '20px',
                  height: '20px',
                  marginTop: '2px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected
                    ? '1.5px solid var(--color-accent)'
                    : '1.5px solid rgba(38,66,51,0.15)',
                  background: isSelected
                    ? 'var(--color-accent-subtle)'
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition:
                    'border-color var(--transition-fast), background var(--transition-fast)',
                }}
                aria-hidden="true"
              >
                {isSelected && (
                  <svg
                    width="11"
                    height="9"
                    viewBox="0 0 11 9"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 4.5l3 3 6-7" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Botón Continuar — aparece en ≥1, pulsa en ≥4 */}
      <div
        style={{
          marginTop: 'var(--space-6)',
          opacity: showButton ? 1 : 0,
          transform: showButton ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          pointerEvents: showButton ? 'auto' : 'none',
        }}
      >
        <button
          onClick={() => onContinue(selections)}
          className={isPulsing ? 'button-attract' : ''}
          style={{
            width: '100%',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-accent)',
            background: 'var(--color-accent-subtle)',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background var(--transition-fast)',
            minHeight: '44px',
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
