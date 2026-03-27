/**
 * Copy defaults — centralized registry of all editable copy.
 * Pattern: same as email-defaults.ts + email_templates table.
 *
 * Usage:
 *   import { COPY_DEFAULTS, COPY_DEFAULTS_MAP, VALID_COPY_KEYS } from '@/lib/copy-defaults'
 */

import type { CopySection, CopySectionName } from './types'
import { getLandingDefaults } from './landing'
import { getGatewayDefaults } from './gateway'
import { getMapaDefaults } from './mapa'

export type { CopySection, CopySectionName, CopyFieldType } from './types'

/** All copy entries as a flat array. */
export const COPY_DEFAULTS: CopySection[] = [
  ...getLandingDefaults(),
  ...getGatewayDefaults(),
  ...getMapaDefaults(),
]

/** O(1) lookup by copy key (e.g. "hero.shock"). */
export const COPY_DEFAULTS_MAP: Record<string, CopySection> = Object.fromEntries(
  COPY_DEFAULTS.map((d) => [d.id, d]),
)

/** All valid copy keys — used for input validation. */
export const VALID_COPY_KEYS: string[] = COPY_DEFAULTS.map((d) => d.id)

/** Section names for navigation tabs. */
export const COPY_SECTIONS: CopySectionName[] = ['landing', 'gateway', 'mapa']
