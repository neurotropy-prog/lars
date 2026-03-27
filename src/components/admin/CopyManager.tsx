'use client'

/**
 * CopyManager — Admin page for viewing/managing all editable copy.
 *
 * Structure only (no inline editing in this phase):
 * - Horizontal tabs: Landing | Gateway | Mapa
 * - Entries grouped by subsection
 * - Badge showing customized count per section
 * - Loading skeleton, error state, empty state
 */

import { useState, useEffect, useCallback } from 'react'
import type { CopySectionName } from '@/lib/copy-defaults'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CopyEntry {
  id: string
  subsection: string
  label: string
  defaultValue: string
  currentValue: string
  isCustomized: boolean
  fieldType: 'short' | 'medium' | 'long'
  hint: string | null
}

interface CopyData {
  sections: Record<string, CopyEntry[]>
  stats: Record<string, number>
}

// ─── Subsection labels (human-readable) ──────────────────────────────────────

const SUBSECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  mirror: 'Espejo',
  tension: 'Tensión',
  socialproof: 'Prueba Social',
  relief: 'Alivio',
  footer: 'Footer',
  p1: 'P1 — ¿Qué te trajo aquí?',
  p2: 'P2 — Sueño',
  p3: 'P3 — Síntomas cognitivos',
  p4: 'P4 — Síntomas emocionales',
  primeraverdad: 'Primera Verdad',
  microespejo1: 'Micro-espejo 1',
  p5: 'P5 — Alegría de vivir',
  p6: 'P6 — Frase identitaria',
  microespejo2: 'Micro-espejo 2',
  p7: 'P7 — Sliders',
  p8: 'P8 — Duración',
  focus: 'Focus Banner',
  evolution: 'Timeline de evolución',
  session: 'Sesión con Javier',
  dimensions: 'Dimensiones',
  aspiracional: 'Tu Camino (Aspiracional)',
}

// ─── Component ───────────────────────────────────────────────────────────────

const TABS: { key: CopySectionName; label: string }[] = [
  { key: 'landing', label: 'Landing' },
  { key: 'gateway', label: 'Gateway' },
  { key: 'mapa', label: 'Mapa' },
]

export default function CopyManager() {
  const [activeTab, setActiveTab] = useState<CopySectionName>('landing')
  const [data, setData] = useState<CopyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/copy')
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const entries = data?.sections[activeTab] ?? []
  const grouped = groupBySubsection(entries)

  return (
    <div>
      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-lora)',
        fontSize: 'var(--text-h2)',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-6)',
      }}>
        Copy
      </h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-1)',
        borderBottom: '1px solid rgba(30, 19, 16, 0.08)',
        marginBottom: 'var(--space-6)',
      }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const count = data?.stats[tab.key] ?? 0
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#B45A32' : 'var(--color-text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #B45A32' : '2px solid transparent',
                padding: 'var(--space-3) var(--space-4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                transition: 'color 150ms ease, border-color 150ms ease',
              }}
            >
              {tab.label}
              {count > 0 && (
                <span style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 600,
                  color: 'var(--color-text-inverse)',
                  background: '#B45A32',
                  borderRadius: '9999px',
                  padding: '1px 8px',
                  lineHeight: 1.6,
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading && <Skeleton />}
      {error && <ErrorState message={error} onRetry={fetchData} />}
      {!loading && !error && entries.length === 0 && <EmptyState />}
      {!loading && !error && entries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {Object.entries(grouped).map(([subsection, items]) => (
            <SubsectionGroup
              key={subsection}
              subsection={subsection}
              entries={items}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Subsection Group ────────────────────────────────────────────────────────

function SubsectionGroup({ subsection, entries }: {
  subsection: string
  entries: CopyEntry[]
}) {
  const customizedCount = entries.filter((e) => e.isCustomized).length
  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-3)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          {SUBSECTION_LABELS[subsection] ?? subsection}
        </h3>
        {customizedCount > 0 && (
          <span style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            color: '#B45A32',
            fontWeight: 500,
          }}>
            {customizedCount} personalizado{customizedCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}>
        {entries.map((entry) => (
          <CopyEntryRow key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}

// ─── Copy Entry Row ──────────────────────────────────────────────────────────

function CopyEntryRow({ entry }: { entry: CopyEntry }) {
  const preview = entry.currentValue.length > 100
    ? entry.currentValue.slice(0, 100) + '…'
    : entry.currentValue

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      background: entry.isCustomized
        ? 'rgba(180, 90, 50, 0.04)'
        : 'var(--color-bg-tertiary)',
      border: entry.isCustomized
        ? '1px solid rgba(180, 90, 50, 0.15)'
        : '1px solid rgba(30, 19, 16, 0.04)',
      borderRadius: 'var(--radius-md)',
    }}>
      {/* Indicator dot */}
      {entry.isCustomized && (
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#B45A32',
          flexShrink: 0,
          marginTop: '7px',
        }} />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Label */}
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          margin: 0,
          marginBottom: '2px',
        }}>
          {entry.label}
        </p>

        {/* Preview */}
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-caption)',
          color: 'var(--color-text-tertiary)',
          margin: 0,
          lineHeight: 'var(--lh-body-sm)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: entry.fieldType === 'short' ? 'nowrap' : 'normal',
        }}>
          {preview}
        </p>
      </div>

      {/* Field type pill */}
      <span style={{
        fontFamily: 'var(--font-inter)',
        fontSize: '10px',
        color: 'var(--color-text-tertiary)',
        background: 'rgba(30, 19, 16, 0.04)',
        borderRadius: '4px',
        padding: '2px 6px',
        flexShrink: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {entry.fieldType === 'short' ? 'corto' : entry.fieldType === 'medium' ? 'medio' : 'largo'}
      </span>
    </div>
  )
}

// ─── States ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-pulse"
          style={{
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(30, 19, 16, 0.04)',
          }}
        />
      ))}
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-10)',
    }}>
      <p style={{
        fontFamily: 'var(--font-inter)',
        fontSize: 'var(--text-body)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-4)',
      }}>
        Error al cargar el copy: {message}
      </p>
      <button
        onClick={onRetry}
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          color: '#B45A32',
          background: 'none',
          border: '1px solid rgba(180, 90, 50, 0.3)',
          borderRadius: 'var(--radius-pill)',
          padding: 'var(--space-2) var(--space-4)',
          cursor: 'pointer',
        }}
      >
        Reintentar
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-10)',
    }}>
      <p style={{
        fontFamily: 'var(--font-inter)',
        fontSize: 'var(--text-body)',
        color: 'var(--color-text-tertiary)',
      }}>
        Todo el copy está usando los textos originales.
      </p>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupBySubsection(entries: CopyEntry[]): Record<string, CopyEntry[]> {
  const groups: Record<string, CopyEntry[]> = {}
  for (const entry of entries) {
    if (!groups[entry.subsection]) groups[entry.subsection] = []
    groups[entry.subsection].push(entry)
  }
  return groups
}
