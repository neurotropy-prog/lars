'use client'

/**
 * CopyPreviewMapa — Simplified live preview of mapa copy.
 * Shows focus banner, evolution timeline, session, and dimension texts.
 */

import { COPY_DEFAULTS_MAP } from '@/lib/copy-defaults'

interface CopyPreviewMapaProps {
  localValues: Record<string, string>
  activeSubsection?: string
}

function get(key: string, vals: Record<string, string>): string {
  return vals[key] ?? COPY_DEFAULTS_MAP[key]?.defaultValue ?? ''
}

export function CopyPreviewMapa({ localValues, activeSubsection }: CopyPreviewMapaProps) {
  const v = (key: string) => get(key, localValues)
  const sub = activeSubsection || 'focus'

  return (
    <div style={{
      background: '#0B0F0E',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      fontSize: '12px',
    }}>
      {/* Focus Banner */}
      {sub === 'focus' && (
        <div style={{ padding: '16px' }}>
          <p style={labelStyle}>Focus Banner</p>
          <div style={{
            marginTop: 8,
            padding: '12px 14px',
            background: 'rgba(180, 90, 50, 0.06)',
            borderRadius: 12,
            border: '1px solid rgba(180, 90, 50, 0.12)',
          }}>
            <span style={{
              ...labelStyle,
              background: 'rgba(180, 90, 50, 0.15)',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 8,
            }}>
              {v('mapa.focus.new.archetype.tag')}
            </span>
            <h3 style={titleStyle}>{v('mapa.focus.new.archetype.title')}</h3>
            <p style={bodyStyle}>{v('mapa.focus.new.archetype.description')}</p>
            <span style={ctaStyle}>{v('mapa.focus.new.archetype.cta')}</span>
          </div>
        </div>
      )}

      {/* Evolution Timeline */}
      {sub === 'evolution' && (
        <div style={{ padding: '16px' }}>
          <p style={labelStyle}>Timeline de evolución</p>
          <h3 style={{ ...titleStyle, marginTop: 8 }}>
            {v('mapa.evolution.header')}
          </h3>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['d0', 'd3', 'd7', 'd14', 'd21', 'd30'].map((d) => {
              const label = v(`mapa.evolution.${d}.label`)
              const sublabel = v(`mapa.evolution.${d}.sublabel`)
              const hasLabel = label && label !== `mapa.evolution.${d}.label`
              if (!hasLabel) return null
              return (
                <div key={d} style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  padding: '4px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ color: '#4ADE80', fontSize: 10, fontWeight: 600, minWidth: 24 }}>
                    {d.toUpperCase()}
                  </span>
                  <span style={{ color: '#FFFBEF', fontSize: 11, fontWeight: 500 }}>
                    {label}
                  </span>
                  {sublabel && sublabel !== `mapa.evolution.${d}.sublabel` && (
                    <span style={{ color: 'rgba(255,251,239,0.4)', fontSize: 10 }}>
                      — {sublabel}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Session */}
      {sub === 'session' && (
        <div style={{ padding: '16px' }}>
          <p style={labelStyle}>Sesión con Javier</p>
          <div style={{
            marginTop: 8,
            padding: '12px 14px',
            background: 'rgba(74, 222, 128, 0.04)',
            borderRadius: 12,
            border: '1px solid rgba(74, 222, 128, 0.1)',
          }}>
            <span style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 9,
              fontWeight: 600,
              color: '#4ADE80',
              textTransform: 'uppercase',
            }}>
              {v('mapa.session.badge')}
            </span>
            <h3 style={{ ...titleStyle, marginTop: 4 }}>
              {v('mapa.session.title')}
            </h3>
            <p style={{ ...bodyStyle, marginTop: 4 }}>
              {v('mapa.session.description')}
            </p>
          </div>
        </div>
      )}

      {/* Dimensions */}
      {sub === 'dimensions' && (
        <div style={{ padding: '16px' }}>
          <p style={labelStyle}>Dimensiones</p>
          <p style={{ ...bodyStyle, marginTop: 6, opacity: 0.6 }}>
            Vista previa de las etiquetas de dimensiones del mapa.
          </p>
        </div>
      )}

      {/* Aspiracional */}
      {sub === 'aspiracional' && (
        <div style={{ padding: '16px' }}>
          <p style={labelStyle}>Tu Camino (Aspiracional)</p>
          <p style={{ ...bodyStyle, marginTop: 6, opacity: 0.6 }}>
            Vista previa de las fases y milestones del camino aspiracional.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-host-grotesk)',
  fontSize: 9,
  fontWeight: 600,
  color: '#B45A32',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  margin: 0,
}

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-cormorant, Georgia, serif)',
  fontSize: 15,
  fontWeight: 600,
  color: '#FFFBEF',
  margin: '6px 0 0',
  lineHeight: 1.3,
}

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-host-grotesk)',
  fontSize: 11,
  color: 'rgba(255, 251, 239, 0.75)',
  margin: '4px 0 0',
  lineHeight: 1.5,
}

const ctaStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: 8,
  fontFamily: 'var(--font-host-grotesk)',
  fontSize: 10,
  fontWeight: 600,
  color: '#1E1310',
  background: '#F5F564',
  borderRadius: 9999,
  padding: '4px 12px',
}
