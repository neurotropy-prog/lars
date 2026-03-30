'use client'

/**
 * CopyEditorSearch — Search input with debounce for filtering copy entries.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

interface CopyEditorSearchProps {
  onSearch: (query: string) => void
}

export function CopyEditorSearch({ onSearch }: CopyEditorSearchProps) {
  const [value, setValue] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearch(value), 300)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, onSearch])

  const handleClear = useCallback(() => {
    setValue('')
    onSearch('')
  }, [onSearch])

  return (
    <div style={{ position: 'relative' }}>
      {/* Search icon */}
      <span style={{
        position: 'absolute',
        left: 'var(--space-4)',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--color-text-tertiary)',
        fontSize: 'var(--text-body-sm)',
        pointerEvents: 'none',
      }}>
        &#x1F50D;
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar por texto o etiqueta..."
        style={{
          width: '100%',
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-primary)',
          background: 'var(--color-bg-secondary)',
          border: '1px solid rgba(30, 19, 16, 0.08)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-3) var(--space-4)',
          paddingLeft: 'var(--space-10)',
          paddingRight: value ? 'var(--space-8)' : 'var(--space-4)',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 150ms ease',
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: 'var(--space-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(30, 19, 16, 0.06)',
            border: 'none',
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            fontSize: '12px',
            fontFamily: 'var(--font-host-grotesk)',
            lineHeight: 1,
          }}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  )
}
