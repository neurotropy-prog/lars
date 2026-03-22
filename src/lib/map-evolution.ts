/**
 * map-evolution.ts — Lógica de desbloqueo temporal del mapa vivo
 *
 * Función pura que calcula qué secciones están desbloqueadas basándose
 * en la fecha de creación del diagnóstico y el estado actual de map_evolution.
 *
 * Sin side effects. El servidor la llama en cada carga de página.
 * El parámetro `now` permite fast-forward para testing.
 */

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface MapEvolutionData {
  archetype_unlocked: boolean
  archetype_viewed: boolean
  insight_d7_unlocked: boolean
  insight_d7_viewed: boolean
  session_unlocked: boolean
  session_booked: boolean
  subdimensions_unlocked: boolean
  subdimensions_completed: boolean
  subdimension_responses: Record<string, string> | null
  book_excerpt_unlocked: boolean
  book_excerpt_viewed: boolean
  reevaluation_unlocked: boolean
  reevaluation_completed: boolean
  reevaluation_scores: ReevaluationScores | null
  reevaluations: ReevaluationEntry[]
  // Email tracking flags (may not exist on older records)
  email_d3_sent?: boolean
  email_d7_sent?: boolean
  email_d10_sent?: boolean
  email_d14_sent?: boolean
  email_d21_sent?: boolean
  email_d30_sent?: boolean
  email_d90_sent?: string[] // ISO dates of sent d90 emails
  // Open tracking & suppression
  email_opens?: Record<string, string> // key = email key (d0, d3...), value = ISO date
  consecutive_unopened?: number // resets to 0 on any open
  email_unsubscribed?: boolean
}

export interface ReevaluationScores {
  global: number
  d1: number
  d2: number
  d3: number
  d4: number
  d5: number
}

export interface ReevaluationEntry {
  day: number
  date: string // ISO
  scores: ReevaluationScores
}

export interface EvolutionSection {
  unlocked: boolean
  viewed: boolean
  isNew: boolean // unlocked && !viewed → muestra badge
}

export interface EvolutionState {
  daysSinceCreation: number
  archetype: EvolutionSection
  insightD7: EvolutionSection
  session: EvolutionSection & { booked: boolean }
  subdimensions: EvolutionSection & { completed: boolean }
  bookExcerpt: EvolutionSection
  reevaluation: EvolutionSection & {
    completed: boolean
    reevaluations: ReevaluationEntry[]
    /** El milestone activo (30, 90, 180...) o null si no hay pendiente */
    activeMilestone: number | null
  }
  /** True si hay una reevaluación trimestral pendiente (día 90, 180, 270...) */
  nextQuarterlyUnlocked: boolean
}

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const DAY_MS = 86400000

const UNLOCK_DAYS = {
  archetype: 3,
  insightD7: 7,
  session: 10,
  subdimensions: 14,
  bookExcerpt: 21,
  reevaluation: 30,
  quarterly: 90,
} as const

// ─── FUNCIÓN PRINCIPAL ───────────────────────────────────────────────────────

export function computeEvolutionState(
  createdAt: string,
  mapEvolution: MapEvolutionData,
  now?: Date,
): EvolutionState {
  const created = new Date(createdAt).getTime()
  const current = (now ?? new Date()).getTime()
  const daysSinceCreation = Math.floor((current - created) / DAY_MS)

  const daysReached = (days: number) => daysSinceCreation >= days

  // ── Archetype (Día 3) ──────────────────────────────────────────────────────
  const archetypeUnlocked = daysReached(UNLOCK_DAYS.archetype)
  const archetype: EvolutionSection = {
    unlocked: archetypeUnlocked,
    viewed: mapEvolution.archetype_viewed,
    isNew: archetypeUnlocked && !mapEvolution.archetype_viewed,
  }

  // ── Insight D7 (Día 7) ─────────────────────────────────────────────────────
  const insightD7Unlocked = daysReached(UNLOCK_DAYS.insightD7)
  const insightD7: EvolutionSection = {
    unlocked: insightD7Unlocked,
    viewed: mapEvolution.insight_d7_viewed,
    isNew: insightD7Unlocked && !mapEvolution.insight_d7_viewed,
  }

  // ── Session (Día 10) ───────────────────────────────────────────────────────
  const sessionUnlocked = daysReached(UNLOCK_DAYS.session)
  const session: EvolutionSection & { booked: boolean } = {
    unlocked: sessionUnlocked,
    viewed: false, // La sesión no tiene "viewed" — solo booked
    isNew: sessionUnlocked && !mapEvolution.session_booked,
    booked: mapEvolution.session_booked,
  }

  // ── Subdimensions (Día 14) ─────────────────────────────────────────────────
  const subdimsUnlocked = daysReached(UNLOCK_DAYS.subdimensions)
  const subdimensions: EvolutionSection & { completed: boolean } = {
    unlocked: subdimsUnlocked,
    viewed: mapEvolution.subdimensions_completed, // completed implica viewed
    isNew: subdimsUnlocked && !mapEvolution.subdimensions_completed,
    completed: mapEvolution.subdimensions_completed,
  }

  // ── Book Excerpt (Día 21) ──────────────────────────────────────────────────
  const bookUnlocked = daysReached(UNLOCK_DAYS.bookExcerpt)
  const bookExcerpt: EvolutionSection = {
    unlocked: bookUnlocked,
    viewed: mapEvolution.book_excerpt_viewed,
    isNew: bookUnlocked && !mapEvolution.book_excerpt_viewed,
  }

  // ── Reevaluation (Día 30+) ─────────────────────────────────────────────────
  // Cada período de reevaluación es independiente:
  // Día 30 = primera reevaluación
  // Día 90, 180, 270... = trimestrales
  const reevalUnlocked = daysReached(UNLOCK_DAYS.reevaluation)
  const allReevaluations = mapEvolution.reevaluations ?? []

  // Determinar qué reevaluación es la "activa" (la más reciente pendiente)
  const reevalMilestones: number[] = [UNLOCK_DAYS.reevaluation] // día 30
  for (
    let q = UNLOCK_DAYS.quarterly;
    q <= daysSinceCreation;
    q += UNLOCK_DAYS.quarterly
  ) {
    reevalMilestones.push(q)
  }

  // Reevaluaciones completadas (por milestone cercano)
  const completedMilestones = new Set(
    allReevaluations.map((r) => {
      // Encontrar el milestone más cercano al día en que se hizo
      return reevalMilestones.reduce((closest, m) =>
        Math.abs(r.day - m) < Math.abs(r.day - closest) ? m : closest,
      )
    }),
  )

  // La reevaluación activa es el milestone más reciente NO completado
  let activeReevalMilestone: number | null = null
  for (const m of reevalMilestones) {
    if (daysSinceCreation >= m && !completedMilestones.has(m)) {
      activeReevalMilestone = m
    }
  }

  const hasActiveReeval = activeReevalMilestone !== null
  const lastCompletedReeval = allReevaluations.length > 0
    ? allReevaluations[allReevaluations.length - 1]
    : null

  const reevaluation: EvolutionSection & {
    completed: boolean
    reevaluations: ReevaluationEntry[]
    activeMilestone: number | null
  } = {
    unlocked: reevalUnlocked,
    viewed: reevalUnlocked && !hasActiveReeval,
    isNew: hasActiveReeval,
    completed: reevalUnlocked && !hasActiveReeval,
    reevaluations: allReevaluations,
    activeMilestone: activeReevalMilestone,
  }

  // nextQuarterlyUnlocked ahora es simplemente si hay un milestone activo >= 90
  const nextQuarterlyUnlocked = activeReevalMilestone !== null && activeReevalMilestone >= UNLOCK_DAYS.quarterly

  return {
    daysSinceCreation,
    archetype,
    insightD7,
    session,
    subdimensions,
    bookExcerpt,
    reevaluation,
    nextQuarterlyUnlocked,
  }
}

// ─── HELPERS PARA EMAILS ─────────────────────────────────────────────────────

/** Devuelve qué emails deben enviarse (unlocked pero no sent) */
export function getPendingEmails(
  daysSinceCreation: number,
  mapEvolution: MapEvolutionData,
): string[] {
  const pending: string[] = []

  if (daysSinceCreation >= 3 && !mapEvolution.email_d3_sent) pending.push('d3')
  if (daysSinceCreation >= 7 && !mapEvolution.email_d7_sent) pending.push('d7')
  if (daysSinceCreation >= 10 && !mapEvolution.email_d10_sent) pending.push('d10')
  if (daysSinceCreation >= 14 && !mapEvolution.email_d14_sent) pending.push('d14')
  if (daysSinceCreation >= 21 && !mapEvolution.email_d21_sent) pending.push('d21')
  if (daysSinceCreation >= 30 && !mapEvolution.email_d30_sent) pending.push('d30')

  // D90: cada 90 días
  if (daysSinceCreation >= 90) {
    const sentDates = new Set(mapEvolution.email_d90_sent ?? [])
    for (let q = 90; q <= daysSinceCreation; q += 90) {
      const key = `d90_${q}`
      if (!sentDates.has(key)) {
        pending.push(key)
        break // Solo enviar el más reciente pendiente
      }
    }
  }

  return pending
}
