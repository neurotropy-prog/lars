'use client'

/**
 * CopyEditorHistory — Audit log of copy changes.
 * Shows who changed what, when, with old/new values.
 */

import { useState, useEffect, useCallback } from 'react'
import { COPY_DEFAULTS_MAP } from '@/lib/copy-defaults'

interface AuditEntry {
  id: string
  copy_key: string
  old_value: string | null
  new_value: string | null
  action: 'update' | 'restore' | 'restore_section'
  changed_by: string
  created_at: string
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  update: { label: 'Editado', color: 'var(--color-accent)' },
  restore: { label: 'Restaurado', color: 'var(--color-success)' },
  restore_section: { label: 'Sección restaurada', color: 'var(--color-success)' },
}

const PAGE_SIZE = 30

export default function CopyEditorHistory() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchHistory = useCallback(async (newOffset: number) => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/copy/history?limit=${PAGE_SIZE}&offset=${newOffset}`,
      )
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries)
        setTotal(data.total)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory(offset)
  }, [offset, fetchHistory])

  function formatDate(iso: string): string {
    const d = new Date(iso)
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const hours = d.getHours().toString().padStart(2, '0')
    const mins = d.getMinutes().toString().padStart(2, '0')
    return `${day}/${month} ${hours}:${mins}`
  }

  function getLabel(key: string): string {
    return COPY_DEFAULTS_MAP[key]?.label ?? key
  }

  function truncate(text: string | null, max: number): string {
    if (!text) return '—'
    return text.length > max ? text.slice(0, max) + '…' : text
  }

  const hasMore = offset + PAGE_SIZE < total
  const hasPrev = offset > 0

  if (loading && entries.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: 56,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(38,66,51,0.04)',
              marginBottom: 'var(--space-3)',
            }}
          />
        ))}
      </div>
    )
  }

  if (!loading && entries.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--space-12) var(--space-6)',
          color: 'var(--color-text-tertiary)',
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-body-sm)',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 'var(--space-3)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        Sin cambios registrados todavía.
        <br />
        Los cambios que hagas en el editor aparecerán aquí.
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {total} cambio{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {entries.map((entry) => {
          const actionInfo = ACTION_LABELS[entry.action] ?? ACTION_LABELS.update
          const isExpanded = expandedId === entry.id

          return (
            <div
              key={entry.id}
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-tertiary)',
                cursor: 'pointer',
                transition: 'background-color 150ms',
              }}
            >
              {/* Main row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  flexWrap: 'wrap',
                }}
              >
                {/* Action badge */}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: `${actionInfo.color}15`,
                    color: actionInfo.color,
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}
                >
                  {actionInfo.label}
                </span>

                {/* Key label */}
                <span
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 500,
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getLabel(entry.copy_key)}
                </span>

                {/* Who + when */}
                <span
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-tertiary)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.changed_by.split('@')[0]} · {formatDate(entry.created_at)}
                </span>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div
                  style={{
                    marginTop: 'var(--space-3)',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid rgba(38,66,51,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--color-text-tertiary)',
                        display: 'block',
                        marginBottom: 2,
                      }}
                    >
                      Antes:
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 'var(--lh-body)',
                      }}
                    >
                      {truncate(entry.old_value, 200)}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--color-text-tertiary)',
                        display: 'block',
                        marginBottom: 2,
                      }}
                    >
                      {entry.action === 'update' ? 'Después:' : 'Restaurado a valor original'}
                    </span>
                    {entry.new_value && (
                      <span
                        style={{
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--color-text-primary)',
                          lineHeight: 'var(--lh-body)',
                        }}
                      >
                        {truncate(entry.new_value, 200)}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: '10px',
                      color: 'var(--color-text-tertiary)',
                      marginTop: 'var(--space-1)',
                    }}
                  >
                    {entry.changed_by} · {new Date(entry.created_at).toLocaleString('es-ES')}
                    <br />
                    Key: <code style={{ fontSize: '10px' }}>{entry.copy_key}</code>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {(hasPrev || hasMore) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-5)',
          }}
        >
          {hasPrev && (
            <button
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--space-2) var(--space-4)',
              }}
            >
              ← Anteriores
            </button>
          )}
          {hasMore && (
            <button
              onClick={() => setOffset(offset + PAGE_SIZE)}
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--space-2) var(--space-4)',
              }}
            >
              Siguientes →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
