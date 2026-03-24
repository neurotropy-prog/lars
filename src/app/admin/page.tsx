'use client'

/**
 * /admin — Home del panel de administración L.A.R.S.
 *
 * Contraseña centralizada aquí. Una vez autenticado,
 * las subpáginas leen de sessionStorage y entran directo.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

const SECTIONS = [
  {
    href: '/admin/analytics',
    title: 'Analytics',
    description: 'Embudo completo, métricas clave y últimas evaluaciones.',
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
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  // Comprobar si ya está autenticado
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_secret')
    if (saved) {
      setSecret(saved)
      setAuthenticated(true)
    }
    setChecking(false)
  }, [])

  const handleLogin = async () => {
    if (!secret.trim()) return
    setError(null)

    // Verificar contraseña contra la API de disponibilidad
    try {
      const res = await fetch('/api/admin/disponibilidad', {
        headers: { 'x-admin-secret': secret.trim() },
      })
      if (res.status === 401) {
        setError('Contraseña incorrecta')
        return
      }
      sessionStorage.setItem('admin_secret', secret.trim())
      setAuthenticated(true)
    } catch {
      setError('Error de conexión')
    }
  }

  if (checking) return null

  // ── Pantalla de contraseña ──
  if (!authenticated) {
    return (
      <>
      <SiteHeader variant="admin" />
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}>
        <div style={{ maxWidth: '360px', width: '100%', textAlign: 'center' }}>
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
            Introduce la contraseña para acceder
          </p>

          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Contraseña"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: error ? '1px solid var(--color-error)' : '1px solid rgba(30,19,16,0.10)',
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

          {error && (
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-error)',
              marginTop: 'var(--space-4)',
            }}>
              {error}
            </p>
          )}
        </div>
      </div>
      </>
    )
  }

  // ── Hub autenticado ──
  return (
    <>
    <SiteHeader variant="admin" />
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)',
      padding: 'calc(var(--header-height, 56px) + var(--space-8)) var(--space-6) var(--space-8)',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
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
    </div>
    </>
  )
}
