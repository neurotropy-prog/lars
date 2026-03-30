'use client'

/**
 * EvolutionTimeline.tsx — Timeline visual del mapa vivo
 *
 * Muestra los hitos del mapa (Día 0, 3, 7, 10, 14, 21, 30, 90)
 * con puntos activos (desbloqueados), nuevos (con badge), y futuros (gris).
 * Los puntos activos son clicables y hacen scroll a su sección.
 */

import Badge from '@/components/ui/Badge'
import type { EvolutionState } from '@/lib/map-evolution'

interface TimelineMilestone {
  day: number
  label: string
  sublabel: string
  sectionId: string
  status: 'active' | 'new' | 'future'
}

interface Props {
  evolution: EvolutionState
}

export default function EvolutionTimeline({ evolution }: Props) {
  const milestones: TimelineMilestone[] = [
    {
      day: 0,
      label: 'Tu análisis',
      sublabel: '5 dimensiones · Score global',
      sectionId: 'section-dimensions',
      status: 'active',
    },
    {
      day: 3,
      label: 'Arquetipo del SN',
      sublabel: '7 tipos · Tu patrón profundo',
      sectionId: 'section-archetype',
      status: evolution.archetype.unlocked
        ? evolution.archetype.isNew ? 'new' : 'active'
        : 'future',
    },
    {
      day: 7,
      label: 'Insight colectivo',
      sublabel: 'Dato nuevo en tu peor dimensión',
      sectionId: 'section-dimensions',
      status: evolution.insightD7.unlocked
        ? evolution.insightD7.isNew ? 'new' : 'active'
        : 'future',
    },
    {
      day: 10,
      label: 'Sesión con Javier',
      sublabel: '20 min gratuitos · Sin compromiso',
      sectionId: 'section-session',
      status: evolution.session.unlocked
        ? evolution.session.isNew ? 'new' : 'active'
        : 'future',
    },
    {
      day: 14,
      label: 'Subdimensiones',
      sublabel: '2 preguntas · Mayor resolución',
      sectionId: 'section-subdimensions',
      status: evolution.subdimensions.unlocked
        ? evolution.subdimensions.isNew ? 'new' : 'active'
        : 'future',
    },
    {
      day: 21,
      label: 'Extracto del libro',
      sublabel: 'Capítulo personalizado',
      sectionId: 'section-book',
      status: evolution.bookExcerpt.unlocked
        ? evolution.bookExcerpt.isNew ? 'new' : 'active'
        : 'future',
    },
    {
      day: 30,
      label: 'Reevaluación',
      sublabel: 'Compara con tu día 0',
      sectionId: 'section-reevaluation',
      status: evolution.reevaluation.unlocked
        ? evolution.reevaluation.isNew ? 'new' : 'active'
        : 'future',
    },
  ]

  // Solo mostrar trimestral si estamos en día 90+
  if (evolution.daysSinceCreation >= 90) {
    milestones.push({
      day: 90,
      label: 'Trimestral',
      sublabel: 'Evolución a largo plazo',
      sectionId: 'section-reevaluation',
      status: evolution.nextQuarterlyUnlocked ? 'new' : 'active',
    })
  }

  const newCount = milestones.filter((m) => m.status === 'new').length

  const handleClick = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className="mapa-fade-up"
      style={{
        marginBottom: 'var(--space-8)',
        padding: 'var(--space-5)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-secondary)',
        border: 'var(--border-subtle)',
      }}
    >
      {/* Header con contador de novedades */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-overline)',
            letterSpacing: 'var(--ls-overline)',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            margin: 0,
          }}
        >
          Tu mapa evoluciona
        </p>
        {newCount > 0 && (
          <Badge status="nuevo">
            {newCount} {newCount === 1 ? 'novedad' : 'novedades'}
          </Badge>
        )}
      </div>

      {/* Timeline vertical */}
      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        {/* Línea vertical */}
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            background: 'rgba(255,255,255,0.08)',
          }}
        />

        {milestones.map((m, i) => {
          const isNew = m.status === 'new'
          const isActive = m.status === 'active'
          const isFuture = m.status === 'future'

          return (
            <div
              key={`${m.day}-${i}`}
              onClick={() => !isFuture && handleClick(m.sectionId)}
              style={{
                position: 'relative',
                padding: 'var(--space-2) 0',
                cursor: isFuture ? 'default' : 'pointer',
                opacity: isFuture ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Punto */}
              <div
                style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '12px',
                  width: isNew ? '14px' : '10px',
                  height: isNew ? '14px' : '10px',
                  borderRadius: '50%',
                  background: isNew
                    ? 'var(--color-accent)'
                    : isActive
                      ? 'var(--color-success)'
                      : 'rgba(255,255,255,0.15)',
                  border: isNew
                    ? '2px solid var(--color-accent)'
                    : 'none',
                  marginTop: isNew ? '-2px' : '0',
                  marginLeft: isNew ? '-2px' : '0',
                  boxShadow: isNew
                    ? '0 0 8px rgba(198,200,238,0.4)'
                    : 'none',
                }}
              />

              {/* Contenido */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2)',
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: isNew ? 500 : 400,
                      color: isNew
                        ? 'var(--color-text-primary)'
                        : isActive
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-text-tertiary)',
                      margin: 0,
                      lineHeight: 'var(--lh-body-sm)',
                    }}
                  >
                    {m.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                      fontSize: 'var(--text-caption)',
                      color: 'var(--color-text-tertiary)',
                      margin: 0,
                      marginTop: '2px',
                    }}
                  >
                    {m.sublabel}
                  </p>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                    fontSize: 'var(--text-caption)',
                    color: isFuture
                      ? 'var(--color-text-tertiary)'
                      : 'var(--color-text-secondary)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  Día {m.day}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
