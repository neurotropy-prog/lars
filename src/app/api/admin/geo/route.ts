/**
 * /api/admin/geo — GET
 *
 * Datos geográficos agregados de todos los diagnósticos.
 * Agrupa por país y ciudad con conteos y porcentajes.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// Mapeo de ISO codes a nombres en español (principales)
const COUNTRY_NAMES: Record<string, string> = {
  ES: 'España',
  MX: 'México',
  AR: 'Argentina',
  CO: 'Colombia',
  CL: 'Chile',
  PE: 'Perú',
  EC: 'Ecuador',
  VE: 'Venezuela',
  UY: 'Uruguay',
  BO: 'Bolivia',
  PY: 'Paraguay',
  CR: 'Costa Rica',
  PA: 'Panamá',
  DO: 'República Dominicana',
  GT: 'Guatemala',
  HN: 'Honduras',
  SV: 'El Salvador',
  NI: 'Nicaragua',
  CU: 'Cuba',
  PR: 'Puerto Rico',
  US: 'Estados Unidos',
  BR: 'Brasil',
  PT: 'Portugal',
  FR: 'Francia',
  DE: 'Alemania',
  IT: 'Italia',
  GB: 'Reino Unido',
  CA: 'Canadá',
  AU: 'Australia',
  CH: 'Suiza',
  AT: 'Austria',
  BE: 'Bélgica',
  NL: 'Países Bajos',
  IE: 'Irlanda',
  SE: 'Suecia',
  NO: 'Noruega',
  DK: 'Dinamarca',
  FI: 'Finlandia',
  PL: 'Polonia',
  CZ: 'República Checa',
  RO: 'Rumanía',
  IL: 'Israel',
  AE: 'Emiratos Árabes',
  JP: 'Japón',
  CN: 'China',
  IN: 'India',
  KR: 'Corea del Sur',
}

export async function GET(req: NextRequest) {
  // Auth
  const isDev = process.env.NODE_ENV === 'development'
  const adminSecret = req.headers.get('x-admin-secret')
  const validSecret = process.env.ADMIN_SECRET
  if (!isDev && (!validSecret || adminSecret !== validSecret)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: rows, error } = await supabase
    .from('diagnosticos')
    .select('meta')

  if (error) {
    console.error('[admin/geo] Supabase error:', error)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }

  const all = rows ?? []

  // Agregar por país
  const countryCounts: Record<string, number> = {}
  const cityCounts: Record<string, { city: string; country: string; count: number }> = {}
  let withGeo = 0

  for (const row of all) {
    const country = row.meta?.country
    const city = row.meta?.city

    if (country) {
      withGeo++
      countryCounts[country] = (countryCounts[country] ?? 0) + 1

      if (city) {
        const cityKey = `${city}|${country}`
        if (!cityCounts[cityKey]) {
          cityCounts[cityKey] = { city, country, count: 0 }
        }
        cityCounts[cityKey].count++
      }
    }
  }

  // Ordenar países por count desc
  const countries = Object.entries(countryCounts)
    .map(([code, count]) => ({
      code,
      name: COUNTRY_NAMES[code] ?? code,
      count,
      percentage: all.length > 0 ? Math.round((count / all.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Ordenar ciudades por count desc
  const cities = Object.values(cityCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20) // Top 20 ciudades

  return NextResponse.json({
    total: all.length,
    with_geo: withGeo,
    countries,
    cities,
  })
}
