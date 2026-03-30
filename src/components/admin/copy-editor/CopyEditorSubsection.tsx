'use client'

/**
 * CopyEditorSubsection — Accordion group for a subsection of copy entries.
 *
 * Clickable header with chevron, subsection name, and stats ("2 de 8 editados").
 * Expands to show CopyEditorField for each entry.
 */

import { useState, useEffect, useCallback, memo } from 'react'
import type { CopyEntry } from './types'
import { SUBSECTION_LABELS } from './types'
import { CopyEditorField } from './CopyEditorField'

interface CopyEditorSubsectionProps {
  subsection: string
  entries: CopyEntry[]
  defaultOpen: boolean
  searchQuery: string
  onValueChange: (key: string, value: string) => void
  onSaved: () => void
}

function CopyEditorSubsectionInner({
  subsection,
  entries,
  defaultOpen,
  searchQuery,
  onValueChange,
  onSaved,
}: CopyEditorSubsectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const customizedCount = entries.filter((e) => e.isCustomized).length
  const label = SUBSECTION_LABELS[subsection] ?? subsection

  // Auto-open when search query matches entries in this subsection
  useEffect(() => {
    if (searchQuery && entries.length > 0) {
      setOpen(true)
    }
  }, [searchQuery, entries.length])

  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  return (
    <div style={{
      border: '1px solid rgba(30, 19, 16, 0.06)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--color-bg-primary)',
    }}>
      {/* Header */}
      <button
        onClick={toggle}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-4) var(--space-5)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Chevron */}
        <span style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-tertiary)',
          transition: 'transform 200ms ease',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          flexShrink: 0,
        }}>
          ▸
        </span>

        {/* Subsection name */}
        <span style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          flex: 1,
        }}>
          {label}
        </span>

        {/* Stats */}
        <span style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-caption)',
          color: customizedCount > 0 ? '#B45A32' : 'var(--color-text-tertiary)',
          fontWeight: customizedCount > 0 ? 500 : 400,
          flexShrink: 0,
        }}>
          {customizedCount > 0
            ? `${customizedCount} de ${entries.length} editado${entries.length !== 1 ? 's' : ''}`
            : `${entries.length} campo${entries.length !== 1 ? 's' : ''}`}
        </span>
      </button>

      {/* Content */}
      <div style={{
        maxHeight: open ? `${entries.length * 300}px` : '0',
        overflow: 'hidden',
        transition: 'max-height 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          padding: open ? '0 var(--space-5) var(--space-5)' : '0 var(--space-5)',
        }}>
          {entries.map((entry) => (
            <CopyEditorField
              key={entry.id}
              entry={entry}
              searchQuery={searchQuery}
              onValueChange={onValueChange}
              onSaved={onSaved}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export const CopyEditorSubsection = memo(CopyEditorSubsectionInner)
