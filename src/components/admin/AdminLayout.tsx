'use client'

/**
 * AdminLayout — Shared wrapper for all admin pages.
 *
 * Responsibilities:
 * 1. Auth gate (sessionStorage + verify against API)
 * 2. Sidebar (desktop ≥ 768px) or BottomBar (mobile < 768px)
 * 3. Badge data fetching (non-blocking, cached 60s)
 * 4. Content area with max-width + padding
 */

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
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

  // Auth state
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginInput, setLoginInput] = useState('')

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
    const saved = sessionStorage.getItem('admin_secret')
    if (saved) {
      setSecret(saved)
      setAuthenticated(true)
    }
    setChecking(false)
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
  const fetchBadges = useCallback(async (adminSecret: string) => {
    // Use cache if fresh
    if (badgeCache && Date.now() - badgeCache.ts < BADGE_CACHE_MS) {
      setBadges({ leads: badgeCache.leads, agenda: badgeCache.agenda })
      return
    }

    try {
      const headers = { 'x-admin-secret': adminSecret }

      const [leadsRes, disponibilidadRes] = await Promise.all([
        fetch('/api/admin/leads?filter=hot&period=7d', { headers }).catch(() => null),
        fetch('/api/admin/disponibilidad', { headers }).catch(() => null),
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
    if (authenticated && secret) {
      fetchBadges(secret)
    }
  }, [authenticated, secret, fetchBadges])

  // ── Toggle sidebar ──
  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('admin_sidebar_collapsed', String(next))
      return next
    })
  }, [])

  // ── Login handler ──
  const handleLogin = async () => {
    if (!loginInput.trim()) return
    setLoginError(null)

    try {
      const res = await fetch('/api/admin/disponibilidad', {
        headers: { 'x-admin-secret': loginInput.trim() },
      })
      if (res.status === 401) {
        setLoginError('Contraseña incorrecta')
        return
      }
      sessionStorage.setItem('admin_secret', loginInput.trim())
      setSecret(loginInput.trim())
      setAuthenticated(true)
    } catch {
      setLoginError('Error de conexión')
    }
  }

  // ── Loading ──
  if (checking) return null

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ maxWidth: '360px', width: '100%', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'var(--text-h2)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Admin L.A.R.S.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
              marginBottom: 'var(--space-8)',
            }}
          >
            Introduce la contraseña para acceder
          </p>

          <input
            type="password"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Contraseña"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: loginError
                ? '1px solid var(--color-error)'
                : '1px solid rgba(30,19,16,0.10)',
              background: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-inter)',
              fontSize: '16px',
              outline: 'none',
              marginBottom: 'var(--space-4)',
              boxSizing: 'border-box',
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '14px var(--space-6)',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Entrar
          </button>

          {loginError && (
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-error)',
                marginTop: 'var(--space-4)',
              }}
            >
              {loginError}
            </p>
          )}
        </div>
      </div>
    )
  }

  // ── Authenticated layout ──
  const sidebarWidth = isMobile ? 0 : collapsed ? WIDTH_COLLAPSED : WIDTH_EXPANDED

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
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
