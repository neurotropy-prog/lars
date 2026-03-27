'use client'

/**
 * AdminLayout — Shared wrapper for all admin pages.
 *
 * Responsibilities:
 * 1. Display sidebar and main content
 * 2. Fetch badge data (hot leads, today's agenda)
 * 3. Auth is handled by middleware.ts + verifyAdmin() in API routes
 * 4. Logout functionality via Supabase
 */

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdminSidebar from './AdminSidebar'
import AdminBottomBar from './AdminBottomBar'

// ── Design tokens ──

const WIDTH_COLLAPSED = 64
const WIDTH_EXPANDED = 220
const TRANSITION = '200ms cubic-bezier(0.16, 1, 0.3, 1)'

// ── Badge cache ──

let badgeCache: { leads: number; agenda: boolean; ts: number } | null = null
const BADGE_CACHE_MS = 60_000

// ── Component ──

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  // Auth state
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  // Sidebar state
  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Badge state
  const [badges, setBadges] = useState<{ leads: number; agenda: boolean }>({
    leads: 0,
    agenda: false,
  })

  // ── Check auth on mount ──
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        )
        const { data: { session } } = await supabase.auth.getSession()
        setAuthenticated(!!session)
      } catch {
        setAuthenticated(false)
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [])

  // ── Read sidebar preference ──
  useEffect(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    }
  }, [])

  // ── Mobile detection ──
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Fetch badge data ──
  const fetchBadges = useCallback(async () => {
    // Use cache if fresh
    if (badgeCache && Date.now() - badgeCache.ts < BADGE_CACHE_MS) {
      setBadges({ leads: badgeCache.leads, agenda: badgeCache.agenda })
      return
    }

    try {
      const [leadsRes, disponibilidadRes] = await Promise.all([
        fetch('/api/admin/leads?filter=hot&period=7d').catch(() => null),
        fetch('/api/admin/disponibilidad').catch(() => null),
      ])

      let hotLeads = 0
      if (leadsRes?.ok) {
        const data = await leadsRes.json()
        hotLeads = data.total ?? 0
      }

      let hasSessionToday = false
      if (disponibilidadRes?.ok) {
        const data = await disponibilidadRes.json()
        const today = new Date().toISOString().slice(0, 10)
        hasSessionToday = (data.upcomingBookings ?? []).some(
          (b: { slot_start: string }) => b.slot_start?.slice(0, 10) === today
        )
      }

      const newBadges = { leads: hotLeads, agenda: hasSessionToday }
      badgeCache = { ...newBadges, ts: Date.now() }
      setBadges(newBadges)
    } catch {
      // Non-blocking — badges are cosmetic
    }
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchBadges()
    }
  }, [authenticated, fetchBadges])

  // ── Toggle sidebar ──
  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('admin_sidebar_collapsed', String(next))
      return next
    })
  }, [])

  // ── Loading ──
  if (checking) return null

  // ── Login page: render children only, no sidebar/chrome ──
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // ── Authenticated layout ──
  const sidebarWidth = isMobile ? 0 : collapsed ? WIDTH_COLLAPSED : WIDTH_EXPANDED

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F0E' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <AdminSidebar
          collapsed={collapsed}
          onToggle={toggleSidebar}
          activePath={pathname}
          badges={badges}
        />
      )}

      {/* Content area */}
      <main
        style={{
          marginLeft: sidebarWidth,
          transition: `margin-left ${TRANSITION}`,
          minHeight: '100vh',
          paddingBottom: isMobile ? 'calc(56px + env(safe-area-inset-bottom, 0px) + 16px)' : 0,
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: 'var(--space-8)',
          }}
        >
          {children}
        </div>
      </main>

      {/* Mobile bottom bar */}
      {isMobile && (
        <AdminBottomBar activePath={pathname} badges={badges} />
      )}
    </div>
  )
}
