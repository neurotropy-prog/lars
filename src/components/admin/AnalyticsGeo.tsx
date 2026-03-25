'use client'

/**
 * AnalyticsGeo — Tabla geográfica con top países y ciudades.
 *
 * Fetches from /api/admin/geo?period=... con flag emojis.
 */

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'

interface CountryData {
  code: string
  name: string
  count: number
  percentage: number
}

interface CityData {
  city: string
  country: string
  count: number
}

interface GeoData {
  total: number
  with_geo: number
  countries: CountryData[]
  cities: CityData[]
}

interface AnalyticsGeoProps {
  period: string
}

function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return '🌍'
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1F1E6 + c.charCodeAt(0) - 65)
  )
}

const FAKE_GEO: GeoData = {
  total: 48,
  with_geo: 46,
  countries: [
    { code: 'ES', name: 'España', count: 28, percentage: 58 },
    { code: 'MX', name: 'México', count: 8, percentage: 17 },
    { code: 'AR', name: 'Argentina', count: 5, percentage: 10 },
    { code: 'CO', name: 'Colombia', count: 3, percentage: 6 },
    { code: 'CL', name: 'Chile', count: 2, percentage: 4 },
  ],
  cities: [
    { city: 'Madrid', country: 'ES', count: 15 },
    { city: 'Barcelona', country: 'ES', count: 8 },
    { city: 'Ciudad de México', country: 'MX', count: 5 },
    { city: 'Buenos Aires', country: 'AR', count: 3 },
    { city: 'Bogotá', country: 'CO', count: 2 },
  ],
}

export default function AnalyticsGeo({ period }: AnalyticsGeoProps) {
  const [data, setData] = useState<GeoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [useFake, setUseFake] = useState(false)

  const fetchGeo = useCallback(async () => {
    setLoading(true)
    try {
      const secret = typeof window !== 'undefined' ? sessionStorage.getItem('admin_secret') : null
      const res = await fetch(`/api/admin/geo?period=${period}`, {
        headers: secret ? { 'x-admin-secret': secret } : {},
      })
      if (res.ok) {
        setData(await res.json())
      }
    } catch (err) {
      console.error('[AnalyticsGeo] Error:', err)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchGeo()
  }, [fetchGeo])

  const source = useFake ? FAKE_GEO : data
  const countries = source?.countries?.slice(0, 5) ?? []
  const cities = source?.cities?.slice(0, 5) ?? []
  const maxCountryCount = countries.length > 0 ? countries[0].count : 1

  return (
    <Card style={{ marginBottom: 'var(--space-6)' }}>
      <p style={{
        fontFamily: 'var(--font-inter)',
        fontSize: 'var(--text-caption)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-5)',
      }}>
        Geografía
      </p>

      {loading && !data ? (
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center',
          padding: 'var(--space-6)',
        }}>
          Cargando datos geográficos...
        </p>
      ) : countries.length === 0 && cities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-4)',
          }}>
            Sin datos geográficos en este periodo
          </p>
          <button
            onClick={() => setUseFake(true)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-accent)',
              background: 'var(--color-accent-subtle)',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Simular datos de ejemplo
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {/* Countries */}
          {countries.length > 0 && (
            <div>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
              }}>
                Top países
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {countries.map((c) => (
                  <div key={c.code}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-1)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--color-text-primary)',
                      }}>
                        {flagEmoji(c.code)} {c.name}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--color-text-tertiary)',
                      }}>
                        {c.count} ({c.percentage}%)
                      </span>
                    </div>
                    <div style={{
                      height: 4,
                      borderRadius: 2,
                      background: 'rgba(30, 19, 16, 0.06)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.max(4, (c.count / maxCountryCount) * 100)}%`,
                        borderRadius: 2,
                        background: 'var(--color-accent)',
                        opacity: 0.6,
                        transition: 'width 400ms ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cities */}
          {cities.length > 0 && (
            <div>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
              }}>
                Top ciudades
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {cities.map((c, i) => (
                  <div key={`${c.city}-${c.country}-${i}`} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-2) 0',
                    borderBottom: i < cities.length - 1 ? '1px solid rgba(30, 19, 16, 0.06)' : 'none',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--color-text-primary)',
                    }}>
                      {flagEmoji(c.country)} {c.city}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-lora)',
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                    }}>
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Badge + toggle para datos fake */}
      {useFake && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-4)',
        }}>
          <span style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            color: 'var(--color-warning)',
            background: 'rgba(212, 160, 23, 0.1)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-pill)',
          }}>
            Datos simulados
          </span>
          <button
            onClick={() => setUseFake(false)}
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Quitar simulación
          </button>
        </div>
      )}
    </Card>
  )
}
