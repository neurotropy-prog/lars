'use client'

/**
 * /admin — Hub (Centro de Comando)
 *
 * Primera pantalla del admin. Javi abre esto cada mañana y en 30 segundos
 * sabe qué está pasando: diagnósticos, leads calientes, alertas inteligentes,
 * embudo y actividad reciente.
 *
 * Auth centralizada en AdminLayout.
 */

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import HubStatCards from '@/components/admin/HubStatCards'
import HubAlerts from '@/components/admin/HubAlerts'
import HubFunnel from '@/components/admin/HubFunnel'
import HubActivity from '@/components/admin/HubActivity'

// ── Types ───────────────────────────────────────────────────────────────────

interface HubData {
  stats: {
    diagnostics_today: number
    diagnostics_yesterday: number
    hot_leads: number
    conversion_7d: number
    conversion_7d_prev: number
    next_session: { time: string; email: string; profile: string; hash: string } | null
  }
  alerts: {
    icon: string
    title: string
    body: string
    action?: { label: string; href: string }
    priority: number
    profileColor?: string
  }[]
  funnel_30d: {
    diagnostics: number
    email_captured: number
    map_visited: number
    paid: number
  }
  activity: {
    type: 'diagnostic' | 'email' | 'payment' | 'booking'
    at: string
    description: string
    icon: string
  }[]
}

// ── Greeting helper ─────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

function getFormattedDate(): string {
  const now = new Date()
  return now.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ── Component ───────────────────────────────────────────────────────────────

export default function AdminHub() {
  const [data, setData] = useState<HubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHub = useCallback(async () => {
    const secret = sessionStorage.getItem('admin_secret')
    if (!secret) return

    try {
      setLoading(true)
      const res = await fetch('/api/admin/hub', {
        headers: { 'x-admin-secret': secret },
      })

      if (!res.ok) {
        setError('Error cargando datos del Hub')
        return
      }

      const json = await res.json()
      setData(json)
      setError(null)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Small delay to allow AdminLayout auth to settle
    const timer = setTimeout(fetchHub, 100)
    return () => clearTimeout(timer)
  }, [fetchHub])

  return (
    <AdminLayout>
      {/* Skeleton pulse animation */}
      <style>{`
        @keyframes hubPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Greeting + Date */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          {getGreeting()}, Javier
        </h1>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            textTransform: 'capitalize',
          }}
        >
          {getFormattedDate()}
        </span>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: 'rgba(196, 64, 64, 0.06)',
            border: '1px solid rgba(196, 64, 64, 0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-error)',
              margin: 0,
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchHub}
            style={{
              marginTop: 'var(--space-3)',
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Reintentar →
          </button>
        </div>
      )}

      {/* Hub content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
        {/* Stat Cards */}
        <HubStatCards data={data?.stats ?? null} loading={loading} />

        {/* Alerts */}
        <HubAlerts alerts={data?.alerts ?? null} loading={loading} />

        {/* Funnel */}
        <HubFunnel data={data?.funnel_30d ?? null} loading={loading} />

        {/* Activity */}
        <HubActivity items={data?.activity ?? null} loading={loading} />
      </div>
    </AdminLayout>
  )
}
