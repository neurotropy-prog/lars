'use client'

/**
 * /admin/automations — Email Automations Dashboard
 *
 * Javi ve de un vistazo todo el sistema de emails automáticos:
 * qué se manda, cuándo, con qué lógica, stats de apertura,
 * y el flujo visual completo de la secuencia de nurturing.
 *
 * Auth centralizada en AdminLayout.
 */

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import AutomationsStats from '@/components/admin/AutomationsStats'
import AutomationsFlow from '@/components/admin/AutomationsFlow'
import EmailTemplateEditor from '@/components/admin/EmailTemplateEditor'

// ── Types ───────────────────────────────────────────────────────────────────

interface EmailData {
  key: string
  name: string
  subject: string
  trigger: string
  day: number
  sent: number
  opened: number
  open_rate: number
}

interface GlobalStats {
  total_sent: number
  avg_open_rate: number
  unsubscribes: number
  unsubscribe_rate: number
}

interface TemplateInfo {
  email_key: string
  is_customized: boolean
}

interface AutomationsData {
  emails: EmailData[]
  global_stats: GlobalStats
}

// ── Component ───────────────────────────────────────────────────────────────

export default function AutomationsPage() {
  const [data, setData] = useState<AutomationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [templates, setTemplates] = useState<TemplateInfo[]>([])
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const fetchAutomations = useCallback(async () => {
    try {
      setLoading(true)
      const [automRes, tplRes] = await Promise.all([
        fetch('/api/admin/automations'),
        fetch('/api/admin/templates'),
      ])

      if (!automRes.ok) {
        setError('Error cargando datos de automations')
        return
      }

      const json = await automRes.json()
      setData(json)
      setError(null)

      if (tplRes.ok) {
        const tplJson = await tplRes.json()
        setTemplates(tplJson.templates ?? [])
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchAutomations, 100)
    return () => clearTimeout(timer)
  }, [fetchAutomations])

  return (
    <AdminLayout>
      <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 200ms ease-out' }}>
      {/* Responsive grid */}
      <style>{`
        .automations-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 768px) {
          .automations-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
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
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          Automations
        </h1>
        <span
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          Sistema de emails automáticos
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
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-error)',
              margin: 0,
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchAutomations}
            style={{
              marginTop: 'var(--space-3)',
              fontFamily: 'var(--font-host-grotesk)',
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

      {/* Content */}
      {!loading && data && data.global_stats.total_sent === 0 && data.emails.length === 0 ? (
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
          }}
        >
          No hay datos de emails todavía. Cuando se envíe el primer email automático, las estadísticas aparecerán aquí.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Stats */}
          <AutomationsStats data={data?.global_stats ?? null} loading={loading} />

          {/* Flow */}
          <AutomationsFlow
            emails={data?.emails ?? null}
            loading={loading}
            templates={templates}
            onEditTemplate={(key) => setEditingKey(key)}
          />
        </div>
      )}

      {/* Template editor modal */}
      {editingKey && (
        <EmailTemplateEditor
          emailKey={editingKey}
          isOpen={!!editingKey}
          onClose={() => setEditingKey(null)}
          onSave={fetchAutomations}
        />
      )}
      </div>
    </AdminLayout>
  )
}
