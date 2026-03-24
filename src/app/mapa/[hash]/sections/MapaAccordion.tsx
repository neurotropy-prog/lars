'use client'

/**
 * MapaAccordion.tsx — Accordion for Zona 3 (Tu Mapa Completo)
 *
 * Only ONE section open at a time. Smooth height + opacity animation.
 * Disabled rows for upcoming (not yet unlocked) sections.
 */

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface AccordionSection {
  id: string
  title: string
  summary: string
  badge?: 'nuevo' | 'pendiente' | 'completado' | null
  disabled?: boolean
  disabledText?: string
  children: React.ReactNode
}

interface MapaAccordionProps {
  sections: AccordionSection[]
  defaultOpenId?: string
}

// ─── BADGE COLORS ─────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, { background: string; color: string }> = {
  nuevo: {
    background: 'var(--color-accent)',
    color: 'var(--color-text-inverse)',
  },
  pendiente: {
    background: 'var(--color-warning)',
    color: 'var(--color-text-primary)',
  },
  completado: {
    background: 'var(--color-success)',
    color: 'var(--color-text-inverse)',
  },
}

// ─── CHEVRON SVG ──────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 200ms ease',
        flexShrink: 0,
      }}
    >
      <path
        d="M4.5 2.5L8 6L4.5 9.5"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── ACCORDION ROW ────────────────────────────────────────────────────────────

function AccordionRow({
  section,
  isOpen,
  onToggle,
}: {
  section: AccordionSection
  isOpen: boolean
  onToggle: () => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [measuredHeight, setMeasuredHeight] = useState(0)

  // Measure content height whenever open state or children change
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMeasuredHeight(contentRef.current.scrollHeight)
    }
  }, [isOpen])

  // Re-measure on resize
  useEffect(() => {
    if (!isOpen || !contentRef.current) return
    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setMeasuredHeight(contentRef.current.scrollHeight)
      }
    })
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [isOpen])

  const { disabled, badge, disabledText } = section

  return (
    <div
      id={`section-accordion-${section.id}`}
      style={{
        borderBottom: '1px solid var(--color-surface-subtle)',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {/* Header row */}
      <button
        onClick={disabled ? undefined : onToggle}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          padding: 'var(--space-4) var(--space-5)',
          background: 'transparent',
          border: 'none',
          cursor: disabled ? 'default' : 'pointer',
          textAlign: 'left',
          minHeight: 56,
        }}
      >
        {/* Left: title */}
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            flexShrink: 0,
          }}
        >
          {section.title}
        </span>

        {/* Right: summary + badge + chevron */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          {/* Summary or disabled text */}
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {disabled && disabledText ? disabledText : section.summary}
          </span>

          {/* Badge */}
          {badge && BADGE_STYLES[badge] && (
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                background: BADGE_STYLES[badge].background,
                color: BADGE_STYLES[badge].color,
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-caption)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {badge === 'nuevo' ? 'NUEVO' : badge === 'pendiente' ? 'PENDIENTE' : 'COMPLETADO'}
            </span>
          )}

          {/* Chevron (only if not disabled) */}
          {!disabled && <Chevron open={isOpen} />}
        </span>
      </button>

      {/* Content (animated) */}
      {!disabled && (
        <div
          style={{
            maxHeight: isOpen ? measuredHeight : 0,
            overflow: 'hidden',
            transition: isOpen
              ? 'max-height 400ms cubic-bezier(0.16, 1, 0.3, 1)'
              : 'max-height 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            ref={contentRef}
            style={{
              background: 'var(--color-bg-secondary)',
              padding: 'var(--space-5)',
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 200ms ease',
              transitionDelay: isOpen ? '100ms' : '0ms',
            }}
          >
            {section.children}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function MapaAccordion({ sections, defaultOpenId }: MapaAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId ?? sections[0]?.id ?? null,
  )

  const handleToggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }, [])

  if (sections.length === 0) return null

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--color-surface-subtle)',
      }}
    >
      {sections.map((section) => (
        <AccordionRow
          key={section.id}
          section={section}
          isOpen={openId === section.id}
          onToggle={() => handleToggle(section.id)}
        />
      ))}
    </div>
  )
}
