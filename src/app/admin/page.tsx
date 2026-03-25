'use client'

/**
 * /admin — Hub del panel de administración L.A.R.S.
 *
 * Auth centralizada en AdminLayout.
 */

import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'

const SECTIONS = [
  {
    href: '/admin/leads',
    title: 'Leads',
    description: 'Gestión de leads, heat score y acciones personalizadas.',
    icon: '👥',
  },
  {
    href: '/admin/automations',
    title: 'Automations',
    description: 'Flujo visual de emails automáticos.',
    icon: '⚡',
  },
  {
    href: '/admin/analytics',
    title: 'Analytics',
    description: 'Embudo completo, métricas clave y últimas evaluaciones.',
    icon: '◉',
  },
  {
    href: '/admin/agenda',
    title: 'Agenda',
    description: 'Horarios semanales, bloquear fechas y próximas sesiones.',
    icon: '◷',
  },
  {
    href: '/admin/tools',
    title: 'Tools',
    description: 'Fast-Forward testing y configuración del sistema.',
    icon: '⚙',
  },
]

export default function AdminHome() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: '640px' }}>
        <h1 style={{
          fontFamily: 'var(--font-lora)',
          fontSize: 'var(--text-h2)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Admin L.A.R.S.
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-8)',
        }}>
          Panel de control del Instituto Epigenético
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}>
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-5)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-secondary)',
                border: 'var(--border-subtle)',
                textDecoration: 'none',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <span style={{
                fontSize: '28px',
                lineHeight: 1,
                width: '40px',
                textAlign: 'center',
              }}>
                {s.icon}
              </span>
              <div>
                <p style={{
                  fontFamily: 'var(--font-lora)',
                  fontSize: 'var(--text-h4)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)',
                }}>
                  {s.title}
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--lh-body-sm)',
                }}>
                  {s.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
