'use client'

/**
 * CopyEditorField — Individual editable copy field with auto-save.
 *
 * Shows label, hint tooltip, input (sized by fieldType), "Editado" badge,
 * restore button, original text, and save status indicator.
 */

import { useState, useCallback, useRef, memo } from 'react'
import type { CopyEntry, SaveStatus } from './types'
import { useCopyAutoSave } from './useCopyAutoSave'

interface CopyEditorFieldProps {
  entry: CopyEntry
  searchQuery: string
  onValueChange: (key: string, value: string) => void
  onSaved: () => void
}

function CopyEditorFieldInner({
  entry,
  searchQuery,
  onValueChange,
  onSaved,
}: CopyEditorFieldProps) {
  const [value, setValue] = useState(entry.currentValue)
  const [showOriginal, setShowOriginal] = useState(false)
  const [confirmRestore, setConfirmRestore] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isCustomized = value !== entry.defaultValue
  const status = useCopyAutoSave({
    key: entry.id,
    value,
    defaultValue: entry.defaultValue,
  })

  // Notify parent when save completes
  const prevStatusRef = useRef<SaveStatus>('idle')
  if (prevStatusRef.current === 'saving' && status === 'saved') {
    onSaved()
  }
  prevStatusRef.current = status

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue)
      onValueChange(entry.id, newValue)
    },
    [entry.id, onValueChange],
  )

  const handleRestore = useCallback(() => {
    if (!confirmRestore) {
      setConfirmRestore(true)
      return
    }
    setValue(entry.defaultValue)
    onValueChange(entry.id, entry.defaultValue)
    setConfirmRestore(false)
  }, [confirmRestore, entry.defaultValue, entry.id, onValueChange])

  const renderHighlighted = (text: string) => {
    if (!searchQuery) return text
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: 'rgba(180, 90, 50, 0.2)', borderRadius: '2px', padding: '0 1px' }}>
          {text.slice(idx, idx + searchQuery.length)}
        </mark>
        {text.slice(idx + searchQuery.length)}
      </>
    )
  }

  const rows = entry.fieldType === 'short' ? 0 : entry.fieldType === 'medium' ? 3 : 6

  return (
    <div style={{
      padding: 'var(--space-4)',
      background: isCustomized ? 'rgba(180, 90, 50, 0.04)' : 'var(--color-bg-tertiary)',
      border: isCustomized
        ? '1px solid rgba(180, 90, 50, 0.15)'
        : '1px solid rgba(30, 19, 16, 0.06)',
      borderRadius: 'var(--radius-md)',
      transition: 'background 150ms ease, border-color 150ms ease',
    }}>
      {/* Label row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-2)',
        flexWrap: 'wrap',
      }}>
        <label style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          flex: 1,
          minWidth: 0,
        }}>
          {renderHighlighted(entry.label)}
        </label>

        {/* Hint tooltip */}
        {entry.hint && (
          <span
            title={entry.hint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'rgba(30, 19, 16, 0.06)',
              color: 'var(--color-text-tertiary)',
              fontSize: '11px',
              fontFamily: 'var(--font-host-grotesk)',
              fontWeight: 600,
              cursor: 'help',
              flexShrink: 0,
            }}
          >
            ?
          </span>
        )}

        {/* Editado badge */}
        {isCustomized && (
          <span style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '10px',
            fontWeight: 600,
            color: '#B45A32',
            background: 'rgba(180, 90, 50, 0.1)',
            borderRadius: '9999px',
            padding: '2px 8px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            flexShrink: 0,
          }}>
            Editado
          </span>
        )}
      </div>

      {/* Input */}
      {rows === 0 ? (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          style={inputStyle}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          rows={rows}
          style={{ ...inputStyle, resize: 'vertical', minHeight: rows * 22 }}
        />
      )}

      {/* Status + Restore row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'var(--space-1)',
        minHeight: 20,
      }}>
        <SaveIndicator status={status} />

        {isCustomized && (
          <button
            onClick={handleRestore}
            onBlur={() => setConfirmRestore(false)}
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: confirmRestore ? 'var(--color-error)' : '#B45A32',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {confirmRestore ? '¿Confirmar restaurar?' : 'Restaurar'}
          </button>
        )}
      </div>

      {/* Original text (when customized) */}
      {isCustomized && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {showOriginal ? '▾ Ocultar original' : '▸ Ver original'}
          </button>
          {showOriginal && (
            <p style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              margin: '4px 0 0 0',
              lineHeight: 1.5,
              fontStyle: 'italic',
              padding: 'var(--space-2) var(--space-3)',
              background: 'rgba(30, 19, 16, 0.03)',
              borderRadius: 'var(--radius-sm)',
            }}>
              {entry.defaultValue}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export const CopyEditorField = memo(CopyEditorFieldInner)

// ─── Save indicator ──────────────────────────────────────────────────────────

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return <span />

  const config = {
    saving: { text: 'Guardando...', color: 'var(--color-text-tertiary)' },
    saved: { text: 'Guardado \u2713', color: 'var(--color-success)' },
    error: { text: 'Error al guardar', color: 'var(--color-error)' },
  }[status]

  return (
    <span style={{
      fontFamily: 'var(--font-host-grotesk)',
      fontSize: 'var(--text-caption)',
      color: config.color,
      transition: 'opacity 150ms ease',
    }}>
      {config.text}
    </span>
  )
}

// ─── Shared input style ──────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-host-grotesk)',
  fontSize: 'var(--text-body-sm)',
  color: 'var(--color-text-primary)',
  background: 'var(--color-bg-secondary)',
  border: '1px solid rgba(30, 19, 16, 0.08)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-3) var(--space-4)',
  lineHeight: 1.5,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 150ms ease',
}
