'use client'

/**
 * CopyManager — Admin page for editing all copy.
 *
 * Layout: tabs (Landing|Gateway|Mapa) + search + accordion editor + live preview.
 * Auto-save with debounce. Preview updates in real-time.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { CopySectionName } from '@/lib/copy-defaults'
import type { CopyData, CopyEntry } from './copy-editor/types'
import { TABS, groupBySubsection } from './copy-editor/types'
import { CopyEditorSearch } from './copy-editor/CopyEditorSearch'
import { CopyEditorSubsection } from './copy-editor/CopyEditorSubsection'
import { CopyEditorSectionRestore } from './copy-editor/CopyEditorSectionRestore'
import { CopyEditorSkeleton, CopyEditorError, CopyEditorEmpty } from './copy-editor/CopyEditorStates'
import { CopyPreviewLanding } from './copy-editor/CopyPreviewLanding'
import { CopyPreviewGateway } from './copy-editor/CopyPreviewGateway'
import { CopyPreviewMapa } from './copy-editor/CopyPreviewMapa'
import CopyEditorHistory from './copy-editor/CopyEditorHistory'

export default function CopyManager() {
  const [activeTab, setActiveTab] = useState<CopySectionName>('landing')
  const [data, setData] = useState<CopyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [localValues, setLocalValues] = useState<Record<string, string>>({})
  const [activeSubsection, setActiveSubsection] = useState<string | undefined>()
  const [isMobile, setIsMobile] = useState(false)
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // ── Fetch data ──
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/copy')
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const json: CopyData = await res.json()
      setData(json)

      // Initialize local values from current values
      const vals: Record<string, string> = {}
      for (const section of Object.values(json.sections)) {
        for (const entry of section) {
          vals[entry.id] = entry.currentValue
        }
      }
      setLocalValues(vals)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Mobile detection ──
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Filter entries by search ──
  const entries = data?.sections[activeTab] ?? []
  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter((e) =>
      e.label.toLowerCase().includes(q) ||
      e.currentValue.toLowerCase().includes(q) ||
      e.defaultValue.toLowerCase().includes(q)
    )
  }, [entries, searchQuery])

  const grouped = useMemo(() => groupBySubsection(filteredEntries), [filteredEntries])
  const totalCustomized = data?.stats[activeTab] ?? 0
  const totalFields = entries.length

  // ── Callbacks ──
  const handleValueChange = useCallback((key: string, value: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSaved = useCallback(() => {
    // Refetch to sync stats and isCustomized flags
    fetchData()
  }, [fetchData])

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q)
  }, [])

  const handleSectionRestore = useCallback(() => {
    fetchData()
  }, [fetchData])

  // Track which subsection the user is working in (for preview)
  const handleSubsectionFocus = useCallback((sub: string) => {
    setActiveSubsection(sub)
  }, [])

  // ── Preview component ──
  const PreviewComponent = activeTab === 'landing'
    ? CopyPreviewLanding
    : activeTab === 'gateway'
      ? CopyPreviewGateway
      : CopyPreviewMapa

  return (
    <div>
      {/* Title + History toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-h2)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}>
          Copy
        </h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            color: showHistory ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
            background: showHistory ? 'rgba(180,90,50,0.08)' : 'none',
            border: showHistory ? '1px solid rgba(180,90,50,0.2)' : '1px solid rgba(30,19,16,0.10)',
            borderRadius: 'var(--radius-pill)',
            padding: 'var(--space-2) var(--space-4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'all 150ms ease',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial
        </button>
      </div>

      {/* History view */}
      {showHistory && <CopyEditorHistory />}

      {/* Editor view */}
      {!showHistory && <>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-1)',
        borderBottom: '1px solid rgba(30, 19, 16, 0.08)',
        marginBottom: 'var(--space-4)',
      }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const count = data?.stats[tab.key] ?? 0
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(''); setActiveSubsection(undefined) }}
              style={{
                fontFamily: 'var(--font-host-grotesk)',
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
              {count > 0 && <TabBadge count={count} />}
            </button>
          )
        })}
      </div>

      {/* Search + Stats row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-4)',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <CopyEditorSearch onSearch={handleSearch} />
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-tertiary)',
          }}>
            {totalCustomized} de {totalFields} personalizado{totalFields !== 1 ? 's' : ''}
          </span>
          <CopyEditorSectionRestore
            section={activeTab}
            sectionLabel={TABS.find((t) => t.key === activeTab)?.label ?? activeTab}
            customizedCount={totalCustomized}
            onRestore={handleSectionRestore}
          />
        </div>
      </div>

      {/* Content */}
      {loading && <CopyEditorSkeleton />}
      {error && <CopyEditorError message={error} onRetry={fetchData} />}
      {!loading && !error && filteredEntries.length === 0 && searchQuery && (
        <NoResults query={searchQuery} />
      )}
      {!loading && !error && entries.length === 0 && !searchQuery && <CopyEditorEmpty />}

      {!loading && !error && filteredEntries.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}>
          {/* Left: editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {Object.entries(grouped).map(([subsection, items], idx) => (
              <div key={subsection} onFocus={() => handleSubsectionFocus(subsection)}>
                <CopyEditorSubsection
                  subsection={subsection}
                  entries={items}
                  defaultOpen={idx === 0}
                  searchQuery={searchQuery}
                  onValueChange={handleValueChange}
                  onSaved={handleSaved}
                />
              </div>
            ))}
          </div>

          {/* Right: preview (desktop) */}
          {!isMobile && (
            <div style={{ position: 'sticky', top: 24 }}>
              <p style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                fontWeight: 600,
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-3)',
              }}>
                Vista previa
              </p>
              <PreviewComponent
                localValues={localValues}
                activeSubsection={activeSubsection}
              />
            </div>
          )}
        </div>
      )}

      {/* Mobile preview button */}
      {isMobile && !loading && !error && filteredEntries.length > 0 && (
        <button
          onClick={() => setShowMobilePreview(true)}
          style={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 600,
            color: '#1E1310',
            background: '#F5F564',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: 'var(--space-3) var(--space-5)',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            zIndex: 100,
          }}
        >
          Vista previa
        </button>
      )}

      {/* Mobile preview modal */}
      {showMobilePreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-4)',
            background: '#0B0F0E',
          }}>
            <span style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              color: '#FFFBEF',
            }}>
              Vista previa
            </span>
            <button
              onClick={() => setShowMobilePreview(false)}
              style={{
                color: '#FFFBEF',
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
                padding: 4,
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', background: '#0B0F0E' }}>
            <PreviewComponent
              localValues={localValues}
              activeSubsection={activeSubsection}
            />
          </div>
        </div>
      )}
      </>}
    </div>
  )
}

// ─── Small sub-components ────────────────────────────────────────────────────

function TabBadge({ count }: { count: number }) {
  return (
    <span style={{
      fontFamily: 'var(--font-host-grotesk)',
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
  )
}

function NoResults({ query }: { query: string }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-10)',
    }}>
      <p style={{
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-body)',
        color: 'var(--color-text-tertiary)',
      }}>
        No se encontraron resultados para &ldquo;{query}&rdquo;
      </p>
    </div>
  )
}
