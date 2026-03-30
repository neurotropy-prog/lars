'use client'

/**
 * SingleSelectStep — Pregunta de selección única reutilizable.
 * Usada en P2 (sueño) y P4 (equilibrio emocional).
 *
 * Comportamiento al seleccionar:
 * 1. Card marcada: borde accent + fondo accent-subtle + checkmark (150ms)
 * 2. Delay 600ms — la persona ve su selección confirmada
 * 3. Llama onSelect(id) — el orquestador avanza al siguiente paso
 */

import { useState } from 'react'
import type { SelectOption } from '@/lib/gateway-bloque1-data'

interface SingleSelectStepProps {
  question: string
  context?: string
  collectiveData?: string
  options: SelectOption[]
  onSelect: (id: string) => void
  /** Diseño reforzado para P6 — fuente mayor, padding mayor en cards */
  reinforced?: boolean
}

export default function SingleSelectStep({
  question,
  context,
  collectiveData,
  options,
  onSelect,
  reinforced = false,
}: SingleSelectStepProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [isAdvancing, setIsAdvancing] = useState(false)

  function handleSelect(id: string) {
    if (isAdvancing) return
    setSelected(id)
    setIsAdvancing(true)
    setTimeout(() => onSelect(id), 600)
  }

  return (
    <div className="step-enter" style={{ width: '100%' }}>
      {/* Pregunta */}
      <p
        style={{
          fontFamily: 'var(--font-inter-tight)',
          fontSize: 'var(--text-h3)',
          lineHeight: 'var(--lh-h3)',
          letterSpacing: 'var(--ls-h3)',
          fontWeight: 500,
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
            fontFamily: 'var(--font-inter)',
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
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-5)',
          }}
        >
          {collectiveData}
        </p>
      )}

      {/* Cards */}
      <div
        role="radiogroup"
        aria-label={question}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {options.map((option) => {
          const isSelected = selected === option.id
          const isDimmed = isAdvancing && !isSelected

          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(option.id)}
              disabled={isDimmed}
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
                padding: reinforced
                  ? 'var(--space-5) var(--space-6)'
                  : 'var(--space-4) var(--space-5)',
                cursor: isDimmed ? 'default' : 'pointer',
                transition:
                  'background var(--transition-fast), border-color var(--transition-fast), opacity var(--transition-fast)',
                opacity: isDimmed ? 0.35 : 1,
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
                    fontSize: reinforced ? 'var(--text-h4)' : 'var(--text-body)',
                    lineHeight: reinforced ? 'var(--lh-h4)' : 'var(--lh-body)',
                    fontWeight: 500,
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
                      fontFamily: 'var(--font-inter)',
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

              {/* Checkmark — aparece al seleccionar */}
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
