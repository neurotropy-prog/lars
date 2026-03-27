'use client'

/**
 * /admin/leads — LAM (Lead Acquisition Manager)
 *
 * Orchestrator page: fetches data, manages state, renders table + detail panel.
 * Follows the same pattern as the Hub page (src/app/admin/page.tsx).
 */

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import LeadsTable, { type LeadRow } from '@/components/admin/LeadsTable'
import LeadDetailPanel, { type LeadDetail } from '@/components/admin/LeadDetailPanel'

// ── Inner component (needs Suspense boundary for useSearchParams) ──

function LeadsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read URL params for initial state
  const initialDetail = searchParams.get('detail')
  const initialFilter = searchParams.get('filter') ?? 'all'

  // ── Fade-in ──
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // ── State ──
  const [leads, setLeads] = useState<LeadRow[] | null>(null)
  const [totalFromApi, setTotalFromApi] = useState(0)
  const [hotCount, setHotCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [activePeriod, setActivePeriod] = useState('30d')
  const [activeSort, setActiveSort] = useState('heat')

  // Detail panel
  const [selectedHash, setSelectedHash] = useState<string | null>(initialDetail)
  const [detailData, setDetailData] = useState<LeadDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // ── Fetch leads list ──
  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        period: activePeriod,
        filter: activeFilter,
        sort: activeSort,
      })

      const res = await fetch(`/api/admin/leads?${params}`)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setLeads(data.leads ?? [])
      setTotalFromApi(data.total ?? 0)

      // Count hot leads for the badge (from unfiltered data if filter isn't 'hot')
      if (activeFilter === 'hot') {
        setHotCount(data.total ?? 0)
      }
    } catch (err) {
      console.error('[LAM] fetch error:', err)
      setError('Error al cargar los leads')
    } finally {
      setLoading(false)
    }
  }, [activePeriod, activeFilter, activeSort])

  // Also fetch hot count separately if we're not on the hot filter
  const fetchHotCount = useCallback(async () => {
    if (activeFilter === 'hot') return // already have it

    try {
      const res = await fetch(`/api/admin/leads?period=${activePeriod}&filter=hot`)
      if (res.ok) {
        const data = await res.json()
        setHotCount(data.total ?? 0)
      }
    } catch {
      // Non-blocking
    }
  }, [activePeriod, activeFilter])

  // ── Fetch lead detail ──
  const fetchDetail = useCallback(async (hash: string) => {
    setDetailLoading(true)
    setDetailData(null)

    try {
      const res = await fetch(`/api/admin/leads/${hash}`)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setDetailData(data)
    } catch (err) {
      console.error('[LAM] detail fetch error:', err)
    } finally {
      setDetailLoading(false)
    }
  }, [])

  // ── Effects ──

  // Initial fetch with 100ms delay (auth settle)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads()
      fetchHotCount()
    }, 100)
    return () => clearTimeout(timer)
  }, [fetchLeads, fetchHotCount])

  // Auto-open detail panel from URL
  useEffect(() => {
    if (initialDetail) {
      setSelectedHash(initialDetail)
      setTimeout(() => fetchDetail(initialDetail), 150)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Handlers ──

  const handleSelectLead = useCallback(
    (hash: string) => {
      setSelectedHash(hash)
      router.replace(`/admin/leads?detail=${hash}`, { scroll: false })
      fetchDetail(hash)
    },
    [router, fetchDetail]
  )

  const handleClosePanel = useCallback(() => {
    setSelectedHash(null)
    setDetailData(null)
    router.replace('/admin/leads', { scroll: false })
  }, [router])

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter)
  }, [])

  const handlePeriodChange = useCallback((period: string) => {
    setActivePeriod(period)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setActiveSort(sort)
  }, [])

  return (
    <AdminLayout>
      <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 200ms ease-out' }}>
      {error && (
        <div
          style={{
            background: 'rgba(196, 64, 64, 0.06)',
            border: '1px solid rgba(196, 64, 64, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4) var(--space-5)',
            marginBottom: 'var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-error)',
            }}
          >
            {error}
          </span>
          <button
            onClick={fetchLeads}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-error)',
              background: 'transparent',
              color: 'var(--color-error)',
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      <LeadsTable
        leads={leads}
        loading={loading}
        totalFromApi={totalFromApi}
        hotCount={hotCount}
        selectedHash={selectedHash}
        onSelectLead={handleSelectLead}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        activePeriod={activePeriod}
        onPeriodChange={handlePeriodChange}
        activeSort={activeSort}
        onSortChange={handleSortChange}
      />

      <LeadDetailPanel
        hash={selectedHash}
        data={detailData}
        loading={detailLoading}
        onClose={handleClosePanel}
        onRefresh={() => { if (selectedHash) fetchDetail(selectedHash) }}
      />
      </div>
    </AdminLayout>
  )
}

// ── Page export with Suspense boundary ──

export default function LeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsPageInner />
    </Suspense>
  )
}
