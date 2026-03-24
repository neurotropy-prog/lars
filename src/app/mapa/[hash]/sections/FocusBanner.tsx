'use client'

/**
 * FocusBanner.tsx — Visit-aware focus component for Zona 2
 *
 * Determines WHAT to show on return visits based on priority logic:
 * 1. NEW content since lastVisitedAt (archetype > d7Insight > session > subdimensions > bookExcerpt > reevaluation)
 * 2. PENDING action (session not booked, subdimensions not completed, reevaluation available)
 * 3. User hasn't paid → "Tu camino" teaser
 * 4. Default → next unlock teaser
 */

import Button from '@/components/ui/Button'
import type { EvolutionState } from '@/lib/map-evolution'
import type { ArchetypeData } from '@/lib/content/archetypes'
import type { SubdimensionConfig } from '@/lib/content/subdimensions'
import type { BookExcerptData } from '@/lib/content/book-excerpts'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface FocusBannerProps {
  evolution: EvolutionState
  lastVisitedAt: string
  archetype: ArchetypeData | null
  d7Insight: string | null
  subdimensionConfig: SubdimensionConfig | null
  bookExcerpt: BookExcerptData | null
  worstDimensionName: string
  worstScore: number
  hasPaid: boolean
  hash: string
  daysSinceCreation: number
}

interface FocusItem {
  tag: string
  title: string
  description: string
  ctaText: string
  scrollTo: string
}

// ─── MILESTONES (días de desbloqueo) ─────────────────────────────────────────

const UNLOCK_DAYS: Record<string, number> = {
  archetype: 3,
  insightD7: 7,
  session: 10,
  subdimensions: 14,
  bookExcerpt: 21,
  reevaluation: 30,
}

// ─── FOCUS SELECTION ─────────────────────────────────────────────────────────

export function selectFocus(props: FocusBannerProps): FocusItem {
  const { evolution, archetype, d7Insight, subdimensionConfig, bookExcerpt, worstDimensionName, worstScore, hasPaid, daysSinceCreation } = props

  // 1. NEW content (isNew = unlocked && !viewed)
  if (evolution.archetype.isNew && archetype) {
    return {
      tag: 'NUEVO DESDE TU ÚLTIMA VISITA',
      title: `Tu Arquetipo: ${archetype.name}`,
      description: archetype.teaser,
      ctaText: 'Descubrir tu perfil completo',
      scrollTo: 'section-archetype',
    }
  }

  if (evolution.insightD7.isNew && d7Insight) {
    return {
      tag: 'TU MAPA SE HA ACTUALIZADO',
      title: `${worstDimensionName} — ${worstScore}/100`,
      description: d7Insight,
      ctaText: 'Ver tu evaluación completa',
      scrollTo: 'section-dimensions',
    }
  }

  if (evolution.session.isNew) {
    return {
      tag: 'DISPONIBLE',
      title: 'Tu sesión con Javier',
      description: 'Ya tiene tu mapa. La sesión arranca desde tus datos, no desde cero. 20 min gratuitos. Sin compromiso.',
      ctaText: 'Elegir horario',
      scrollTo: 'section-session',
    }
  }

  if (evolution.subdimensions.isNew && subdimensionConfig) {
    return {
      tag: 'PROFUNDIZA TU EVALUACIÓN',
      title: `${worstDimensionName} tiene ${subdimensionConfig.subdimensions.length} capas más`,
      description: `2 preguntas más para calcular las subdimensiones que no pudimos medir con tu diagnóstico original.`,
      ctaText: 'Responder ahora',
      scrollTo: 'section-subdimensions',
    }
  }

  if (evolution.bookExcerpt.isNew && bookExcerpt) {
    return {
      tag: 'PARA TI',
      title: 'Un capítulo escrito para tu patrón',
      description: `Contenido personalizado para personas con tu perfil de ${worstDimensionName.toLowerCase()}.`,
      ctaText: 'Leer extracto',
      scrollTo: 'section-book',
    }
  }

  if (evolution.reevaluation.isNew || evolution.nextQuarterlyUnlocked) {
    return {
      tag: `HAN PASADO ${daysSinceCreation} DÍAS`,
      title: '¿Ha cambiado algo en tu regulación?',
      description: 'Responde las mismas 10 preguntas y compara con tu día 0.',
      ctaText: 'Reevaluar mi estado',
      scrollTo: 'section-reevaluation',
    }
  }

  // 2. PENDING actions
  if (evolution.session.unlocked && !evolution.session.booked) {
    return {
      tag: 'PENDIENTE',
      title: 'Tu sesión con Javier',
      description: 'Aún no has reservado tu sesión gratuita de 20 minutos. Javier ya tiene tu mapa.',
      ctaText: 'Elegir horario',
      scrollTo: 'section-session',
    }
  }

  if (evolution.subdimensions.unlocked && !evolution.subdimensions.completed) {
    return {
      tag: 'PENDIENTE',
      title: 'Profundiza tu evaluación',
      description: `Tu ${worstDimensionName.toLowerCase()} tiene capas que no pudimos medir. 2 preguntas más.`,
      ctaText: 'Responder ahora',
      scrollTo: 'section-subdimensions',
    }
  }

  if (evolution.reevaluation.unlocked && !evolution.reevaluation.completed) {
    return {
      tag: 'DISPONIBLE',
      title: 'Tu reevaluación está lista',
      description: 'Compara tu estado actual con tu día 0. Verás cuánto ha cambiado.',
      ctaText: 'Reevaluar mi estado',
      scrollTo: 'section-reevaluation',
    }
  }

  // 3. Hasn't paid
  if (!hasPaid) {
    return {
      tag: 'TU SIGUIENTE PASO',
      title: 'Tu regulación es un proceso de 12 semanas',
      description: 'Los primeros cambios llegan en 72 horas. Tu primer paso son los próximos 7 días.',
      ctaText: 'Ver tu camino',
      scrollTo: 'zona-camino',
    }
  }

  // 4. Default — next unlock teaser
  const nextUnlock = Object.entries(UNLOCK_DAYS).find(
    ([, day]) => day > daysSinceCreation
  )
  const daysRemaining = nextUnlock ? nextUnlock[1] - daysSinceCreation : null

  return {
    tag: 'TU MAPA EVOLUCIONA',
    title: daysRemaining
      ? `Próximo desbloqueo en ${daysRemaining} día${daysRemaining === 1 ? '' : 's'}`
      : 'Tu mapa sigue activo',
    description: daysRemaining
      ? 'Cada semana aparece algo nuevo. Vuelve cuando quieras.'
      : 'Todas las secciones están desbloqueadas. Explora tu mapa completo.',
    ctaText: 'Ver mapa completo',
    scrollTo: 'mapa-completo',
  }
}

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

export default function FocusBanner(props: FocusBannerProps) {
  const focus = selectFocus(props)

  const handleCTA = () => {
    const el = document.getElementById(focus.scrollTo)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className="mapa-fade-up"
      style={{
        background: 'var(--color-bg-secondary)',
        borderLeft: '3px solid var(--color-accent)',
        borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
        padding: 'var(--space-6)',
      }}
    >
      {/* Tag */}
      <p style={{
        fontFamily: 'var(--font-inter-tight)',
        fontSize: 'var(--text-overline)',
        letterSpacing: 'var(--ls-overline)',
        textTransform: 'uppercase',
        color: 'var(--color-accent)',
        marginBottom: 'var(--space-3)',
      }}>
        {focus.tag}
      </p>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-plus-jakarta)',
        fontSize: 'var(--text-h3)',
        lineHeight: 'var(--lh-h3)',
        letterSpacing: 'var(--ls-h3)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-2)',
      }}>
        {focus.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-inter)',
        fontSize: 'var(--text-body-sm)',
        lineHeight: 'var(--lh-body-sm)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-5)',
      }}>
        {focus.description}
      </p>

      {/* CTA */}
      <Button variant="ghost" size="small" onClick={handleCTA}>
        {focus.ctaText} →
      </Button>
    </div>
  )
}
