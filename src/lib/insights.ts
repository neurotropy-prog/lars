/**
 * insights.ts — Insights personalizados por dimensión
 *
 * Cada dimensión tiene 4 rangos de texto (Crítico / Comprometido /
 * Atención / Regulado). Se selecciona por score 0-100.
 *
 * Fuente: docs/features/FEATURE_GATEWAY_DESIGN.md — sección M6 (Mapa).
 */

export type DimensionKey = 'd1' | 'd2' | 'd3' | 'd4' | 'd5'

export interface DimensionMeta {
  name: string
  shortName: string
  insight: string
  firstStep?: string // solo para la dimensión más comprometida
}

// ─── TABLAS DE INSIGHTS ───────────────────────────────────────────────────────

const INSIGHTS: Record<DimensionKey, (score: number) => string> = {
  d1: (s) => {
    if (s <= 39) return 'Tu sistema nervioso lleva demasiado tiempo en modo alarma. No es falta de voluntad — es biología. El cuerpo no puede rendir desde el miedo sostenido.'
    if (s <= 59) return 'Tu sistema nervioso está trabajando más de lo que debería para sostener tu nivel de rendimiento. Hay un coste que no se ve en los resultados pero sí se siente.'
    if (s <= 79) return 'Tu regulación nerviosa tiene margen. Con ajustes precisos, lo que hoy cuesta esfuerzo puede volver a fluir.'
    return 'Tu sistema nervioso está en un estado de regulación saludable. La base está estable.'
  },
  d2: (s) => {
    if (s <= 39) return 'Tu sueño no está restaurando lo que el día consume. Sin restauración nocturna real, el rendimiento sostenido es imposible — el cuerpo compensa con cortisol y eso tiene un precio.'
    if (s <= 59) return 'Tu sueño está comprometido. Puedes funcionar, pero no estás restaurando a la profundidad que tu nivel de exigencia requiere.'
    if (s <= 79) return 'Tu sueño tiene calidad suficiente aunque hay margen de mejora. Pequeños ajustes aquí tienen impacto directo en claridad y energía.'
    return 'Tu sueño está restaurando bien. Esta es la base sobre la que se sostiene todo lo demás.'
  },
  d3: (s) => {
    if (s <= 39) return 'Tu prefrontal está funcionando con recursos mínimos. Las decisiones cuestan más de lo que deberían. La niebla mental no es falta de inteligencia — es un cerebro al límite de su capacidad de procesamiento.'
    if (s <= 59) return 'Tu claridad cognitiva está por debajo de tu potencial. Notas que pensar con precisión requiere más esfuerzo del que recuerdas.'
    if (s <= 79) return 'Tu claridad funciona, aunque hay momentos de niebla que delatan que el sistema nervioso está absorbiendo recursos cognitivos.'
    return 'Tu claridad cognitiva está en buen estado. El prefrontal tiene recursos disponibles.'
  },
  d4: (s) => {
    if (s <= 39) return 'Tu reactividad emocional no es un defecto — es un cerebro que ha agotado su capacidad de regulación. Lo que antes dejabas pasar ahora activa una respuesta que no eliges.'
    if (s <= 59) return 'Tu equilibrio emocional está bajo presión. Las emociones tienen más peso del que querrías y la recuperación tarda más de lo normal.'
    if (s <= 79) return 'Tu equilibrio emocional es funcional aunque con sensibilidad elevada en momentos de estrés sostenido.'
    return 'Tu equilibrio emocional es estable. Procesas y recuperas con relativa facilidad.'
  },
  d5: (s) => {
    if (s <= 39) return 'La chispa que te llevó a construir lo que tienes se ha apagado. No la has perdido — está debajo del agotamiento. Cuando el sistema nervioso no puede soltar, la alegría de vivir es lo primero que desaparece.'
    if (s <= 59) return 'Disfrutar plenamente cuesta más de lo que debería. La cabeza interfiere incluso en los momentos de pausa. El rendimiento ha ocupado el espacio que antes tenía la vida.'
    if (s <= 79) return 'Hay alegría en tu vida aunque no siempre puedes soltarte a disfrutarla sin que la cabeza interfiera.'
    return 'Tu alegría de vivir está presente. Puedes disfrutar sin que el sistema nervioso interfiera.'
  },
}

// ─── PRIMER PASO PERSONALIZADO ────────────────────────────────────────────────

const FIRST_STEP_BY_PROFILE: Record<string, string> = {
  // Combinaciones de dimensión más comprometida
  d1: 'Empieza por tu sistema nervioso. Antes de cualquier otra mejora, el cuerpo necesita una señal de seguridad sostenida. Las personas con tu perfil que regularon el SN primero reportaron mejoras medibles en las primeras 72 horas.',
  d2: 'Tu sueño es el punto de entrada. No como descanso — como restauración biológica. Cuando el sueño profundo se recupera, la claridad, el equilibrio emocional y la energía mejoran como consecuencia directa.',
  d3: 'Tu claridad cognitiva es el cuello de botella. Reducir la carga del prefrontal libera la capacidad de decisión que el estrés sostenido ha secuestrado.',
  d4: 'Tu equilibrio emocional es donde la presión se acumula. La reactividad que sientes no es tu carácter — es el SN al límite. Regularla cambia la calidad de todas tus interacciones.',
  d5: 'Recuperar la alegría de vivir no es un lujo — es la señal más fiable de que el sistema se está regulando. Es lo primero que desaparece y lo primero que vuelve cuando el proceso funciona.',
}

// ─── FUNCIÓN PRINCIPAL ────────────────────────────────────────────────────────

export interface DimensionResult extends DimensionMeta {
  key: DimensionKey
  score: number
  color: string
  label: string
}

export function getScoreColor(score: number): string {
  if (score <= 39) return '#EF4444' // rojo
  if (score <= 59) return '#CC796C' // naranja
  if (score <= 79) return '#EAB308' // amarillo
  return '#3D9A5F'                  // verde
}

export function getScoreLabel(score: number): string {
  if (score <= 39) return 'Crítico'
  if (score <= 59) return 'Comprometido'
  if (score <= 79) return 'Atención necesaria'
  return 'Regulado'
}

const DIMENSION_NAMES: Record<DimensionKey, { name: string; shortName: string }> = {
  d1: { name: 'Regulación Nerviosa', shortName: 'Regulación Nerviosa' },
  d2: { name: 'Calidad de Sueño',    shortName: 'Sueño' },
  d3: { name: 'Claridad Cognitiva',  shortName: 'Claridad' },
  d4: { name: 'Equilibrio Emocional', shortName: 'Equilibrio Emocional' },
  d5: { name: 'Alegría de Vivir',    shortName: 'Alegría de Vivir' },
}

export function buildDimensionResult(
  key: DimensionKey,
  score: number,
): DimensionResult {
  const { name, shortName } = DIMENSION_NAMES[key]
  return {
    key,
    name,
    shortName,
    score,
    color: getScoreColor(score),
    label: getScoreLabel(score),
    insight: INSIGHTS[key](score),
  }
}

/** Devuelve la dimensión con score más bajo (la más comprometida) */
export function getMostCompromised(
  d1: number,
  d2: number,
  d3: number,
  d4: number,
  d5: number,
): { key: DimensionKey; score: number; firstStep: string } {
  const dims: [DimensionKey, number][] = [
    ['d1', d1],
    ['d2', d2],
    ['d3', d3],
    ['d4', d4],
    ['d5', d5],
  ]
  const [key, score] = dims.reduce((min, cur) => (cur[1] < min[1] ? cur : min))
  return { key, score, firstStep: FIRST_STEP_BY_PROFILE[key] }
}
