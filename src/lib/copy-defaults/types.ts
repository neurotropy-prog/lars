/**
 * Types for the copy-defaults system.
 * Pattern: same as email-defaults — defaults in TS + overrides in Supabase.
 */

export type CopyFieldType = 'short' | 'medium' | 'long'
export type CopySectionName = 'landing' | 'gateway' | 'mapa'

export interface CopySection {
  id: string              // e.g. "hero.shock", "gateway.p2.optionA"
  section: CopySectionName
  subsection: string      // e.g. "hero", "p2", "evolution"
  label: string           // Human-readable name for Javier (Spanish)
  defaultValue: string    // Exact text from source component
  fieldType: CopyFieldType // 'short' = input, 'medium'/'long' = textarea
  hint?: string           // Contextual help in Spanish
}
