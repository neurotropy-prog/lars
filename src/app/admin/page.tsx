/**
 * /admin — Home del panel de administración L.A.R.S.
 *
 * Hub central con acceso a todas las herramientas admin.
 */

import Link from 'next/link'

export const metadata = {
  title: 'Admin · L.A.R.S.',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  {
    href: '/admin/analytics',
    title: 'Analytics',
    description: 'Embudo completo, métricas clave y últimos diagnósticos.',
    icon: '◉',
  },
  {
    href: '/admin/disponibilidad',
    title: 'Disponibilidad',
    description: 'Horarios semanales, bloquear fechas y próximas sesiones.',
    icon: '◷',
  },
  {
    href: '/admin/fast-forward',
    title: 'Fast-Forward',
    description: 'Simular paso del tiempo para probar evolución del mapa.',
    icon: '⏩',
  },
]

export default function AdminHome() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)',
      padding: 'var(--space-8) var(--space-6)',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-plus-jakarta)',
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
                  fontFamily: 'var(--font-plus-jakarta)',
                  fontSize: 'var(--text-h4)',
                  fontWeight: 600,
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
    </div>
  )
}
