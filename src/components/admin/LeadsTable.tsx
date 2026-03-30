'use client'

/**
 * LeadsTable — Main table view for the LAM (Lead Acquisition Manager).
 *
 * Features: filter chips, search, sortable columns, pagination, mobile card view.
 * All filtering (except search) is server-side. Search is client-side on email.
 */

import { useState, useEffect } from 'react'
import { IconSearch, IconChevronDown, IconChevronUp, IconUsers } from './AdminIcons'
import HeatIndicator from './HeatIndicator'
import AmplifyBadge from './AmplifyBadge'
import type { HeatLevel } from '@/lib/profile-intelligence'

// ── Types ──────────────────────────────────────────────────────────────────

export interface LeadRow {
  hash: string
  email: string | null
  created_at: string
  days_since: number
  scores: { global?: number; label?: string; d1?: number; d2?: number; d3?: number; d4?: number; d5?: number } | null
  profile: { ego_primary?: string } | null
  funnel: {
    email_captured: boolean
    map_visits: number
    last_visit: string | null
    emails_opened: string[]
    session_booked: boolean
    converted_week1: boolean
    unsubscribed: boolean
  }
  heat: { score: number; level: HeatLevel }
  suggested_action: { type: string; reason: string; urgency: string } | null
  personal_actions: unknown[]
  is_referred?: boolean
}

interface LeadsTableProps {
  leads: LeadRow[] | null
  loading: boolean
  totalFromApi: number
  hotCount: number
  selectedHash: string | null
  onSelectLead: (hash: string) => void
  activeFilter: string
  onFilterChange: (filter: string) => void
  activePeriod: string
  onPeriodChange: (period: string) => void
  activeSort: string
  onSortChange: (sort: string) => void
}

// ── Constants ──────────────────────────────────────────────────────────────

const PROFILE_COLORS: Record<string, string> = {
  'Productivo Colapsado': '#B45A32',
  'Fuerte Invisible': '#4A6FA5',
  'Cuidador Exhausto': '#7B8F6A',
  'Controlador Paralizado': '#8B7355',
}

const PROFILE_SHORT: Record<string, string> = {
  'Productivo Colapsado': 'PC',
  'Fuerte Invisible': 'FI',
  'Cuidador Exhausto': 'CE',
  'Controlador Paralizado': 'CP',
}

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'hot', label: '🔥 Calientes' },
  { key: 'warm', label: 'Tibios' },
  { key: 'cold', label: 'Fríos' },
  { key: 'converted', label: 'Pagados' },
  { key: 'lost', label: 'Baja' },
]

const PERIODS = [
  { key: '7d', label: '7 días' },
  { key: '30d', label: '30 días' },
  { key: '90d', label: '90 días' },
  { key: 'all', label: 'Todos' },
]

const ACTION_LABELS: Record<string, { label: string; icon: string }> = {
  personal_note: { label: 'Nota', icon: '✉️' },
  video: { label: 'Video', icon: '🎬' },
  early_unlock: { label: 'Desbloqueo', icon: '🔓' },
  express_session: { label: 'Sesión', icon: '📞' },
  manual_email: { label: 'Email', icon: '📧' },
}

const URGENCY_COLORS: Record<string, string> = {
  high: 'var(--color-error)',
  medium: '#D97706',
  low: 'var(--color-text-tertiary)',
}

const PAGE_SIZE = 20

function scoreColor(score: number): string {
  if (score < 40) return 'var(--color-error)'
  if (score <= 60) return '#D97706'
  return '#059669'
}

function funnelStatus(lead: LeadRow): string {
  if (lead.funnel.converted_week1) return 'Pagado'
  if (lead.funnel.unsubscribed) return 'Baja'
  if (lead.funnel.session_booked) return 'Sesión'
  if (lead.funnel.email_captured) return 'Con email'
  return 'Gateway'
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function SkeletonRow({ delay }: { delay: number }) {
  const base = {
    background: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    animation: 'hubPulse 1.5s ease-in-out infinite',
    animationDelay: `${delay}s`,
  }
  return (
    <tr>
      <td style={{ padding: '12px 8px' }}><div style={{ ...base, width: 48, height: 20 }} /></td>
      <td style={{ padding: '12px 8px' }}><div style={{ ...base, width: '70%', height: 14 }} /></td>
      <td style={{ padding: '12px 8px' }}><div style={{ ...base, width: 32, height: 14 }} /></td>
      <td style={{ padding: '12px 8px' }}><div style={{ ...base, width: 32, height: 20 }} /></td>
      <td style={{ padding: '12px 8px' }}><div style={{ ...base, width: 24, height: 14 }} /></td>
      <td style={{ padding: '12px 8px' }}><div style={{ ...base, width: 24, height: 14 }} /></td>
      <td style={{ padding: '12px 8px' }}><div style={{ ...base, width: 48, height: 14 }} /></td>
      <td style={{ padding: '12px 8px' }}><div style={{ ...base, width: 56, height: 14 }} /></td>
    </tr>
  )
}

function SkeletonCard({ delay }: { delay: number }) {
  const base = {
    background: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    animation: 'hubPulse 1.5s ease-in-out infinite',
    animationDelay: `${delay}s`,
  }
  return (
    <div
      style={{
        background: 'var(--color-bg-tertiary)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ ...base, width: 60, height: 20 }} />
        <div style={{ ...base, width: 40, height: 20 }} />
      </div>
      <div style={{ ...base, width: '80%', height: 14 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ ...base, width: 50, height: 14 }} />
        <div style={{ ...base, width: 50, height: 14 }} />
      </div>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────

export default function LeadsTable({
  leads,
  loading,
  totalFromApi,
  hotCount,
  selectedHash,
  onSelectLead,
  activeFilter,
  onFilterChange,
  activePeriod,
  onPeriodChange,
  activeSort,
  onSortChange,
}: LeadsTableProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [showHeatLegend, setShowHeatLegend] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [activeFilter, activePeriod, activeSort])

  // Client-side search filter
  const filtered = leads
    ? leads.filter((l) => {
        if (!search) return true
        return (l.email ?? '').toLowerCase().includes(search.toLowerCase())
      })
    : []

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Sort icon helper
  const SortIcon = ({ column }: { column: string }) => {
    if (activeSort !== column) return null
    return <IconChevronUp size={12} style={{ marginLeft: 2, opacity: 0.6 }} />
  }

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <h1
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-h2)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            Leads
          </h1>
          {!loading && (
            <span
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {totalFromApi} leads · últimos {activePeriod === 'all' ? 'todos' : activePeriod}
            </span>
          )}
        </div>
      </div>

      {/* ── Filters + Search ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-5)',
        }}
      >
        {/* Filter chips */}
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key
          const badge = f.key === 'hot' && hotCount > 0
            ? ` ${hotCount}`
            : ''
          return (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: isActive ? '1px solid var(--color-accent)' : 'var(--border-medium)',
                background: isActive ? 'rgba(180, 90, 50, 0.08)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease',
              }}
            >
              {f.label}{badge}
            </button>
          )
        })}

        {/* Period dropdown */}
        <select
          value={activePeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-medium)',
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '13px',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          {PERIODS.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>

        {/* Heat legend toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowHeatLegend(!showHeatLegend)}
            title="¿Qué significa cada temperatura?"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: showHeatLegend ? '1px solid var(--color-accent)' : 'var(--border-medium)',
              background: showHeatLegend ? 'rgba(180, 90, 50, 0.08)' : 'transparent',
              color: showHeatLegend ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms ease',
              flexShrink: 0,
            }}
          >
            ?
          </button>

          {/* Popover */}
          {showHeatLegend && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setShowHeatLegend(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 90 }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  zIndex: 91,
                  width: isMobile ? 'calc(100vw - 32px)' : 380,
                  padding: '16px 20px',
                  background: 'var(--color-bg-primary)',
                  border: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '12px',
                  lineHeight: 1.65,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {/* Niveles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {[
                    { color: 'var(--color-error)', label: 'Caliente', pts: '5+ pts', desc: 'Alta urgencia y engagement activo' },
                    { color: '#D97706', label: 'Tibio', pts: '3-4 pts', desc: 'Muestra interés, necesita un empujón' },
                    { color: 'var(--color-text-tertiary)', label: 'Frío', pts: '<3 pts', desc: 'Poca actividad o mucho tiempo sin interacción' },
                    { color: 'var(--color-success)', label: 'Convertido', pts: null, desc: 'Ha pagado la Semana 1' },
                    { color: '#8A7E75', label: 'Pausado', pts: null, desc: 'Email de despedida enviado (3+ sin abrir)' },
                    { color: '#8A7E75', label: 'Perdido', pts: null, desc: 'Se dio de baja' },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: item.color,
                          flexShrink: 0,
                          position: 'relative',
                          top: -1,
                        }}
                      />
                      <span>
                        <b style={{ color: item.color }}>{item.label}</b>
                        {item.pts && <span style={{ color: 'var(--color-text-tertiary)', marginLeft: 4 }}>({item.pts})</span>}
                        <span style={{ margin: '0 4px', color: 'var(--color-text-tertiary)' }}>—</span>
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Separador */}
                <div style={{ height: 1, background: 'var(--color-bg-secondary)', margin: '0 0 12px' }} />

                {/* Cómo se calcula */}
                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4 }}>
                  Prioridad de seguimiento
                </div>
                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '11px', marginBottom: 8, lineHeight: 1.4 }}>
                  Mide quién necesita más atención ahora, no cuánto interés tiene.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { signal: 'Score global ≤ 39 (más urgente)', pts: '+2' },
                    { signal: 'Score global 40-59', pts: '+1' },
                    { signal: '3+ visitas al mapa', pts: '+2' },
                    { signal: '1+ visita al mapa', pts: '+1' },
                    { signal: 'Abrió último email', pts: '+1' },
                    { signal: 'Activo hace menos de 7 días', pts: '+2' },
                    { signal: 'Activo hace menos de 14 días', pts: '+1' },
                    { signal: 'Ya agendó sesión (no necesita empujón)', pts: '-1', negative: true },
                  ].map((item) => (
                    <div key={item.signal} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{item.signal}</span>
                      <span style={{
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                        color: 'negative' in item ? 'var(--color-text-tertiary)' : 'var(--color-accent)',
                      }}>
                        {item.pts}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div
        style={{
          position: 'relative',
          marginBottom: 'var(--space-5)',
        }}
      >
        <IconSearch
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-tertiary)',
          }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por email..."
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border-interactive)',
            background: 'var(--color-bg-tertiary)',
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── Table / Cards ── */}
      {loading || !leads ? (
        isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} delay={i * 0.1} />
            ))}
          </div>
        ) : (
          <div
            style={{
              background: 'var(--color-bg-tertiary)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonRow key={i} delay={i * 0.08} />
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div
          style={{
            background: 'var(--color-bg-tertiary)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-12) var(--space-6)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: 'rgba(180, 90, 50, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <IconUsers size={24} />
          </div>
          {leads.length === 0 && activeFilter === 'all' && !search ? (
            /* True empty — no leads at all in this period */
            <p
              style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-tertiary)',
                padding: 'var(--space-8)',
                background: 'rgba(30,19,16,0.02)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                lineHeight: 'var(--lh-body)',
                margin: 0,
              }}
            >
              No hay leads en este periodo. Cuando alguien complete el gateway, aparecerá aquí.
            </p>
          ) : (
            /* Filtered empty — leads exist but none match */
            <>
              <p
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 var(--space-2)',
                }}
              >
                No hay leads que coincidan
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-tertiary)',
                  margin: 0,
                }}
              >
                Prueba a cambiar los filtros o el periodo
              </p>
              {(activeFilter !== 'all' || search) && (
                <button
                  onClick={() => { onFilterChange('all'); setSearch('') }}
                  style={{
                    marginTop: 'var(--space-4)',
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-pill)',
                    border: 'var(--border-medium)',
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Limpiar filtros
                </button>
              )}
            </>
          )}
        </div>
      ) : isMobile ? (
        /* Mobile card layout */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {paginated.map((lead) => {
            const profileName = lead.profile?.ego_primary ?? ''
            const profileColor = PROFILE_COLORS[profileName] ?? 'var(--color-text-tertiary)'
            const profileShort = PROFILE_SHORT[profileName] ?? '—'
            const isSelected = lead.hash === selectedHash

            return (
              <button
                key={lead.hash}
                onClick={() => onSelectLead(lead.hash)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(180,90,50,0.03)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-bg-tertiary)' }}
                style={{
                  background: 'var(--color-bg-tertiary)',
                  border: isSelected ? `2px solid var(--color-accent)` : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'border-color 150ms ease, background var(--transition-base)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <HeatIndicator level={lead.heat.level as HeatLevel} score={lead.heat.score} size="sm" />
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      background: `${profileColor}12`,
                      color: profileColor,
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {profileShort}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 6px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {lead.email ?? 'Sin email'}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-host-grotesk)', fontSize: '12px', color: scoreColor(lead.scores?.global ?? 0) }}>
                    Score: {lead.scores?.global ?? '—'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-host-grotesk)', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                    Día {lead.days_since}
                  </span>
                  <span style={{ fontFamily: 'var(--font-host-grotesk)', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                    Mapa: {lead.funnel.map_visits}x
                  </span>
                  <span style={{ fontFamily: 'var(--font-host-grotesk)', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                    {funnelStatus(lead)}
                  </span>
                  {lead.is_referred && <AmplifyBadge />}
                  {lead.suggested_action && !lead.funnel.converted_week1 && !lead.funnel.unsubscribed && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-pill)',
                        background: `${URGENCY_COLORS[lead.suggested_action.urgency] ?? 'var(--color-text-tertiary)'}12`,
                        color: URGENCY_COLORS[lead.suggested_action.urgency] ?? 'var(--color-text-tertiary)',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {ACTION_LABELS[lead.suggested_action.type]?.icon ?? '📋'}{' '}
                      {ACTION_LABELS[lead.suggested_action.type]?.label ?? ''}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        /* Desktop table */
        <div
          style={{
            background: 'var(--color-bg-tertiary)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(30, 19, 16, 0.06)' }}>
                {[
                  { key: 'heat', label: 'Heat', width: '80px', sortable: true },
                  { key: 'email', label: 'Lead', width: undefined, sortable: false },
                  { key: 'score', label: 'Score', width: '64px', sortable: true },
                  { key: 'profile', label: 'Perfil', width: '64px', sortable: false },
                  { key: 'days', label: 'Día', width: '48px', sortable: true },
                  { key: 'map', label: 'Mapa', width: '48px', sortable: false },
                  { key: 'action', label: 'Acción', width: '90px', sortable: false },
                  { key: 'status', label: 'Estado', width: '80px', sortable: false },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={col.sortable ? () => onSortChange(col.key === 'days' ? 'date' : col.key) : undefined}
                    style={{
                      padding: '12px 8px',
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-text-tertiary)',
                      textAlign: 'left',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: col.width,
                      cursor: col.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col.label}
                    {col.sortable && <SortIcon column={col.key === 'days' ? 'date' : col.key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead) => {
                const profileName = lead.profile?.ego_primary ?? ''
                const profileColor = PROFILE_COLORS[profileName] ?? 'var(--color-text-tertiary)'
                const profileShort = PROFILE_SHORT[profileName] ?? '—'
                const isSelected = lead.hash === selectedHash
                const globalScore = lead.scores?.global ?? 0

                return (
                  <tr
                    key={lead.hash}
                    onClick={() => onSelectLead(lead.hash)}
                    style={{
                      borderBottom: '1px solid rgba(30, 19, 16, 0.04)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-base)',
                      background: isSelected ? 'rgba(180, 90, 50, 0.04)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--color-accent)' : '3px solid transparent',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(180,90,50,0.03)' }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <HeatIndicator level={lead.heat.level as HeatLevel} score={lead.heat.score} size="sm" />
                        {lead.is_referred && <AmplifyBadge />}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '10px 8px',
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {lead.email ?? 'Sin email'}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: scoreColor(globalScore),
                        }}
                      >
                        {globalScore}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          background: `${profileColor}12`,
                          color: profileColor,
                          fontFamily: 'var(--font-host-grotesk)',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {profileShort}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '10px 8px',
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: '13px',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {lead.days_since}
                    </td>
                    <td
                      style={{
                        padding: '10px 8px',
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: '13px',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {lead.funnel.map_visits}x
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      {lead.suggested_action && !lead.funnel.converted_week1 && !lead.funnel.unsubscribed ? (
                        <span
                          title={lead.suggested_action.reason}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-pill)',
                            background: `${URGENCY_COLORS[lead.suggested_action.urgency] ?? 'var(--color-text-tertiary)'}12`,
                            color: URGENCY_COLORS[lead.suggested_action.urgency] ?? 'var(--color-text-tertiary)',
                            fontFamily: 'var(--font-host-grotesk)',
                            fontSize: '11px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ACTION_LABELS[lead.suggested_action.type]?.icon ?? '📋'}{' '}
                          {ACTION_LABELS[lead.suggested_action.type]?.label ?? lead.suggested_action.type}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: '10px 8px',
                        fontFamily: 'var(--font-host-grotesk)',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: lead.funnel.converted_week1 ? 'var(--color-success)' : lead.funnel.unsubscribed ? 'var(--color-error)' : 'var(--color-text-tertiary)',
                      }}
                    >
                      {funnelStatus(lead)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && leads && filtered.length > PAGE_SIZE && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-5)',
            padding: '0 var(--space-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: '13px',
              color: 'var(--color-text-tertiary)',
            }}
          >
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: 'var(--border-medium)',
                background: 'transparent',
                color: page <= 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '13px',
                cursor: page <= 1 ? 'default' : 'pointer',
                opacity: page <= 1 ? 0.5 : 1,
              }}
            >
              ← Anterior
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: 'var(--border-medium)',
                background: 'transparent',
                color: page >= totalPages ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: '13px',
                cursor: page >= totalPages ? 'default' : 'pointer',
                opacity: page >= totalPages ? 0.5 : 1,
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
