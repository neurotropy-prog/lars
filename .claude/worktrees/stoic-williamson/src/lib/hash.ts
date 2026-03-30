/**
 * hash.ts — Generador de hash único para URLs del mapa
 *
 * 12 caracteres alfanuméricos (a-z, 0-9).
 * No contiene email ni datos personales.
 * No predecible desde el exterior.
 * URL resultante: dominio.com/mapa/[hash-12-caracteres]
 */

import { randomBytes } from 'crypto'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

export function generateHash(length = 12): string {
  const bytes = randomBytes(length)
  return Array.from(bytes)
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join('')
}
