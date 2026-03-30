/**
 * scoring.ts — Motor de scoring del Gateway L.A.R.S.©
 *
 * Calcula 5 dimensiones + score global ponderado a partir de todas las
 * respuestas del usuario. Fórmula exacta de:
 * docs/features/FEATURE_GATEWAY_DESIGN.md → sección BISAGRA / scoring.
 *
 * Escala: 0-100
 *   80-100 = Regulado
 *   60-79  = Atención necesaria
 *   40-59  = Comprometido
 *   0-39   = Crítico
 */

import type { Bloque1Answers } from '@/components/gateway/GatewayBloque1'
import type { Bloque2Answers } from '@/lib/gateway-bloque2-data'

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export type ScoreLabel = 'Regulado' | 'Atención necesaria' | 'Comprometido' | 'Crítico'

export interface DimensionScores {
  d1: number   // Regulación Nerviosa  (0-100)
  d2: number   // Calidad de Sueño     (0-100)
  d3: number   // Claridad Cognitiva   (0-100)
  d4: number   // Equilibrio Emocional (0-100)
  d5: number   // Alegría de Vivir     (0-100)
  global: number
  label: ScoreLabel
}

// ─── TABLAS DE CONVERSIÓN ─────────────────────────────────────────────────────

/** P2 → proxy del sueño para D2 */
const P2_SLEEP: Record<string, number> = {
  A: 20, // me cuesta dormirme — mente activa
  B: 15, // me despierto a las 3-4am — muy mal
  C: 30, // duermo horas pero me despierto cansado
  D: 45, // duermo poco pero funciono (negation flag)
  E: 80, // mi sueño es razonablemente bueno
}

/** P2 → proxy del SN para D1 */
const P2_D1: Record<string, number> = {
  A: 25,
  B: 15,
  C: 30,
  D: 50,
  E: 80,
}

/** P1 → contexto de entrada, contribuye levemente a D1 */
const P1_D1: Record<string, number> = {
  A: 20, // agotamiento que no se va
  B: 20, // rendimiento en caída
  C: 30, // el cuerpo habla
  D: 55, // alguien me lo sugirió
  E: 70, // curiosidad
}

/** P6 (frase identitaria) → D1 regulación nerviosa */
const P6_D1: Record<string, number> = {
  A: 20, // no puedo parar — simpático crónico
  B: 10, // puedo con todo — negación máxima
  C: 30, // si yo caigo todos caen — cuidador exhausto
  D: 40, // necesito entender primero — parálisis
  E: 20, // he probado de todo — lock bioquímico
}

/** P4 (equilibrio emocional) → D4 */
const P4_D4: Record<string, number> = {
  A: 30, // irritabilidad
  B: 20, // vacío
  C: 25, // explosiones de culpa
  D: 15, // anestesia emocional (forzado < 25 después)
  E: 25, // rumiación constante
  F: 75, // razonablemente bien
}

/** P5 (alegría de vivir) → D5 */
const P5_D5: Record<string, number> = {
  A: 5,  // no lo recuerdo
  B: 20, // hace semanas o meses
  C: 45, // puedo pero no suelto la cabeza
  D: 35, // disfruto con culpa
  E: 85, // disfruto con frecuencia
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Convierte slider 1-10 a score 0-100 */
function sliderToScore(value: number | undefined): number {
  const v = value ?? 5
  return Math.round(((v - 1) / 9) * 100)
}

/** Convierte conteo de síntomas cognitivos P3 a score D3 */
function p3ToD3Base(selections: string[]): number {
  const real = selections.filter((s) => s !== 'ninguna').length
  const table: Record<number, number> = {
    0: 85,
    1: 65,
    2: 45,
    3: 30,
    4: 20,
    5: 10,
  }
  return table[Math.min(real, 5)] ?? 30
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function getLabel(global: number): ScoreLabel {
  if (global >= 80) return 'Regulado'
  if (global >= 60) return 'Atención necesaria'
  if (global >= 40) return 'Comprometido'
  return 'Crítico'
}

// ─── FUNCIÓN PRINCIPAL ────────────────────────────────────────────────────────

export function computeScores(
  p1: string,
  bloque1: Bloque1Answers,
  bloque2: Bloque2Answers,
): DimensionScores {
  const { p2, p3Selections, p4 } = bloque1
  const { p5, p6, sliders, p8 } = bloque2

  const sd1 = sliderToScore(sliders['d1'])
  const sd2 = sliderToScore(sliders['d2'])
  const sd3 = sliderToScore(sliders['d3'])
  const sd4 = sliderToScore(sliders['d4'])
  const sd5 = sliderToScore(sliders['d5'])

  // ── D1 Regulación Nerviosa (30%) ──────────────────────────────────────────
  const p1d1  = P1_D1[p1]  ?? 40
  const p2d1  = P2_D1[p2]  ?? 40
  const p6d1  = P6_D1[p6]  ?? 30
  const d1 = clamp(p1d1 * 0.15 + p2d1 * 0.35 + p6d1 * 0.35 + sd1 * 0.15)

  // ── D2 Calidad de Sueño (20%) ─────────────────────────────────────────────
  const p2d2 = P2_SLEEP[p2] ?? 40
  let d2 = clamp(p2d2 * 0.50 + sd2 * 0.50)
  // Negación: "duermo poco pero funciono" + slider sueño alto → ajuste a la baja
  if (p2 === 'D' && (sliders['d2'] ?? 5) > 6) {
    d2 = clamp(d2 * 0.80)
  }

  // ── D3 Claridad Cognitiva (20%) ───────────────────────────────────────────
  const p3base = p3ToD3Base(p3Selections)
  const d3 = clamp(p3base * 0.50 + sd3 * 0.50)

  // ── D4 Equilibrio Emocional (15%) ─────────────────────────────────────────
  const p4base = P4_D4[p4] ?? 35
  let d4 = clamp(p4base * 0.50 + sd4 * 0.50)
  // Anestesia emocional: D4 automáticamente < 25
  if (p4 === 'D') d4 = Math.min(d4, 24)

  // ── D5 Alegría de Vivir (15%) ─────────────────────────────────────────────
  let p5base = P5_D5[p5] ?? 40
  // Si P4=B (vacío): D5 también comprometida
  if (p4 === 'B') p5base = Math.min(p5base, 30)
  const d5 = clamp(p5base * 0.50 + sd5 * 0.50)

  // ── Score global ponderado ────────────────────────────────────────────────
  let global = d1 * 0.30 + d2 * 0.20 + d3 * 0.20 + d4 * 0.15 + d5 * 0.15

  // Ajustes por negación/cronificación
  if (p6 === 'B')                 global *= 0.90 // "puedo con todo" — negación
  if (p8 === 'C' || p8 === 'D')  global *= 0.85 // >1 año — cronificación

  return {
    d1,
    d2,
    d3,
    d4,
    d5,
    global: clamp(global),
    label: getLabel(clamp(global)),
  }
}
