'use client'

/**
 * AnalyticsProfiles — Distribución de los 4 perfiles con barras horizontales.
 *
 * PC=#CD796C, FI=#4A6FA5, CE=#7B8F6A, CP=#8B7355
 *
 * Al pulsar en un perfil se abre ProfileInfoPanel con toda la información.
 */

import { useState } from 'react'
import Card from '@/components/ui/Card'
import ProfileInfoPanel from './ProfileInfoPanel'

interface AnalyticsProfilesProps {
  profiles: Record<string, number>
  total: number
}

const PROFILE_CONFIG: Record<string, { label: string; short: string; color: string }> = {
  'Productivo Colapsado': { label: 'Productivo Colapsado', short: 'PC', color: '#CD796C' },
  'Fuerte Invisible': { label: 'Fuerte Invisible', short: 'FI', color: '#4A6FA5' },
  'Cuidador Exhausto': { label: 'Cuidador Exhausto', short: 'CE', color: '#7B8F6A' },
  'Controlador Paralizado': { label: 'Controlador Paralizado', short: 'CP', color: '#8B7355' },
}

export default function AnalyticsProfiles({ profiles, total }: AnalyticsProfilesProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const safeTotal = total || 1

  // Build sorted entries — known profiles first, then unknowns
  const entries = Object.entries(profiles)
    .filter(([name]) => PROFILE_CONFIG[name])
    .sort((a, b) => b[1] - a[1])

  const unknownEntries = Object.entries(profiles)
    .filter(([name]) => !PROFILE_CONFIG[name] && name !== 'Desconocido')

  const maxCount = Math.max(...entries.map(([, c]) => c), 1)

  return (
    <>
      <Card>
        <p style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-caption)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-5)',
        }}>
          Distribución de perfiles
        </p>

        {entries.length === 0 ? (
          <p style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
            padding: 'var(--space-6)',
          }}>
            Sin datos
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {entries.map(([name, count]) => {
              const config = PROFILE_CONFIG[name]
              const pct = Math.round((count / safeTotal) * 100)
              const barWidth = Math.max(4, (count / maxCount) * 100)

              return (
                <div
                  key={name}
                  onClick={() => setSelectedProfile(name)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-2)',
                    margin: 'calc(-1 * var(--space-2))',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 19, 16, 0.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {/* Label row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 'var(--space-2)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: 'var(--radius-pill)',
                        background: config.color,
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                      }}>
                        {config.short}
                      </span>
                      {config.label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: 'var(--text-caption)',
                      color: 'var(--color-text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      {count} ({pct}%)
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>

                  {/* Bar */}
                  <div style={{
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(30, 19, 16, 0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${barWidth}%`,
                      borderRadius: 4,
                      background: config.color,
                      transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }} />
                  </div>
                </div>
              )
            })}

            {/* Unknown profiles */}
            {unknownEntries.map(([name, count]) => (
              <div key={name} style={{
                fontFamily: 'var(--font-host-grotesk)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-tertiary)',
              }}>
                {name}: {count}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Profile info panel */}
      <ProfileInfoPanel
        profileName={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </>
  )
}
