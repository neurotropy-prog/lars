/**
 * Shared types and constants for the copy editor system.
 */

import type { CopySectionName } from '@/lib/copy-defaults'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CopyEntry {
  id: string
  subsection: string
  label: string
  defaultValue: string
  currentValue: string
  isCustomized: boolean
  fieldType: 'short' | 'medium' | 'long'
  hint: string | null
}

export interface CopyData {
  sections: Record<string, CopyEntry[]>
  stats: Record<string, number>
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

// ─── Constants ───────────────────────────────────────────────────────────────

export const TABS: { key: CopySectionName; label: string }[] = [
  { key: 'landing', label: 'Landing' },
  { key: 'gateway', label: 'Gateway' },
  { key: 'mapa', label: 'Mapa' },
]

export const SUBSECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  mirror: 'Espejo',
  tension: 'Tensión',
  socialproof: 'Prueba Social',
  relief: 'Alivio',
  footer: 'Footer',
  p1: 'P1 — ¿Qué te trajo aquí?',
  p2: 'P2 — Sueño',
  p3: 'P3 — Síntomas cognitivos',
  p4: 'P4 — Síntomas emocionales',
  primeraverdad: 'Primera Verdad',
  microespejo1: 'Micro-espejo 1',
  p5: 'P5 — Alegría de vivir',
  p6: 'P6 — Frase identitaria',
  microespejo2: 'Micro-espejo 2',
  p7: 'P7 — Sliders',
  p8: 'P8 — Duración',
  bisagra: 'Bisagra',
  focus: 'Focus Banner',
  evolution: 'Timeline de evolución',
  session: 'Sesión con Javier',
  dimensions: 'Dimensiones',
  aspiracional: 'Tu Camino (Aspiracional)',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function groupBySubsection(entries: CopyEntry[]): Record<string, CopyEntry[]> {
  const groups: Record<string, CopyEntry[]> = {}
  for (const entry of entries) {
    if (!groups[entry.subsection]) groups[entry.subsection] = []
    groups[entry.subsection].push(entry)
  }
  return groups
}
