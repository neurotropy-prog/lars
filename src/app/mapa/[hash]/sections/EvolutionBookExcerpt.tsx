'use client'

/**
 * EvolutionBookExcerpt.tsx — Sección Día 21: Extracto del libro
 *
 * Muestra un extracto del capítulo correspondiente a la dimensión
 * más comprometida. Expandible. Link al libro completo.
 */

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import type { BookExcerptData } from '@/lib/content/book-excerpts'

interface Props {
  excerpt: BookExcerptData
  isNew: boolean
  worstDimensionName: string
  worstScore: number
}

export default function EvolutionBookExcerpt({
  excerpt,
  isNew,
  worstDimensionName,
  worstScore,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="mapa-fade-up"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
      }}
    >
      {/* Badge */}
      {isNew && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <Badge status="para_ti">PARA TI</Badge>
        </div>
      )}

      {/* Referencia */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-caption)',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-2)',
        }}
      >
        Extracto del capítulo {excerpt.chapterNumber} de &ldquo;
        {excerpt.bookTitle}&rdquo;
      </p>

      {/* Título del capítulo */}
      <h4
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-h4)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          lineHeight: 'var(--lh-h4)',
          marginBottom: 'var(--space-3)',
        }}
      >
        {excerpt.chapterTitle}
      </h4>

      {/* Contexto */}
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        Tu dimensión más comprometida ({worstDimensionName}: {worstScore}) se
        explica en profundidad aquí.
      </p>

      {/* Toggle expandir */}
      <button
        onClick={() => setExpanded((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          borderTop: 'var(--border-subtle)',
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-accent)',
          cursor: 'pointer',
          padding: 'var(--space-4) 0',
          transition: 'color var(--transition-base)',
        }}
      >
        <span>{expanded ? 'Cerrar extracto' : 'Leer extracto'}</span>
        <span
          style={{
            display: 'inline-block',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--transition-base)',
            fontSize: '16px',
          }}
        >
          ↓
        </span>
      </button>

      {/* Extracto */}
      {expanded && (
        <div
          style={{
            padding: 'var(--space-4) 0',
            borderTop: 'var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              lineHeight: '1.7',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'pre-line',
            }}
          >
            {excerpt.excerpt}
          </div>

          {excerpt.bookLink !== '#' && (
            <a
              href={excerpt.bookLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 'var(--space-4)',
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-accent)',
                textDecoration: 'underline',
              }}
            >
              El libro completo (15€) →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
