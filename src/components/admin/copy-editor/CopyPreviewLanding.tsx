'use client'

/**
 * CopyPreviewLanding — Simplified live preview of the landing page copy.
 * Uses real fonts and colors to give Javier an idea of how text looks in context.
 */

import { COPY_DEFAULTS_MAP } from '@/lib/copy-defaults'

interface CopyPreviewLandingProps {
  localValues: Record<string, string>
  activeSubsection?: string
}

function get(key: string, vals: Record<string, string>): string {
  return vals[key] ?? COPY_DEFAULTS_MAP[key]?.defaultValue ?? ''
}

export function CopyPreviewLanding({ localValues, activeSubsection }: CopyPreviewLandingProps) {
  const v = (key: string) => get(key, localValues)

  return (
    <div style={{
      background: '#0B0F0E',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      fontSize: '12px',
      lineHeight: 1.5,
    }}>
      {/* Hero section */}
      <Section
        id="hero"
        active={!activeSubsection || activeSubsection === 'hero'}
      >
        <p style={{ ...textStyle, fontStyle: 'italic', opacity: 0.8, marginBottom: 8 }}>
          {v('hero.shock')}
        </p>
        <h2 style={headlineStyle}>
          {v('hero.headline')}
        </h2>
        <p style={{ ...textStyle, opacity: 0.7, marginTop: 6 }}>
          {v('hero.subtitle')}
        </p>
        <p style={{ ...captionStyle, marginTop: 8 }}>
          {v('hero.micropromises')}
        </p>
      </Section>

      {/* Mirror section */}
      <Section
        id="mirror"
        active={!activeSubsection || activeSubsection === 'mirror'}
      >
        <p style={overlineStyle}>{v('mirror.overline')}</p>
        <h3 style={subheadStyle}>{v('mirror.headline')}</h3>
        <p style={{ ...textStyle, fontStyle: 'italic', marginTop: 6 }}>
          {v('mirror.impact')}
        </p>
        <p style={{ ...captionStyle, marginTop: 6 }}>
          {v('mirror.pullquote')}
        </p>
      </Section>

      {/* Tension section */}
      <Section
        id="tension"
        active={!activeSubsection || activeSubsection === 'tension'}
      >
        <p style={overlineStyle}>{v('tension.overline')}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {['1', '2', '3'].map((n) => (
            <div key={n} style={tensionCardStyle}>
              <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: 16 }}>
                {v(`tension.card${n}.number`)}
              </span>
              <span style={{ ...captionStyle, marginTop: 2, fontSize: 10 }}>
                {v(`tension.card${n}.title`)}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Social proof */}
      <Section
        id="socialproof"
        active={!activeSubsection || activeSubsection === 'socialproof'}
      >
        <p style={overlineStyle}>{v('socialproof.overline')}</p>
        <h3 style={subheadStyle}>{v('socialproof.headline')}</h3>
        <div style={{
          marginTop: 8,
          padding: '8px 10px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 8,
          borderLeft: '2px solid rgba(74, 222, 128, 0.4)',
        }}>
          <p style={{ ...captionStyle, fontStyle: 'italic' }}>
            &ldquo;{v('socialproof.t1.quote')}&rdquo;
          </p>
          <p style={{ ...captionStyle, opacity: 0.5, marginTop: 4 }}>
            {v('socialproof.t1.author')}
          </p>
        </div>
      </Section>

      {/* Relief / Alivio */}
      <Section
        id="relief"
        active={!activeSubsection || activeSubsection === 'relief'}
      >
        <p style={overlineStyle}>{v('relief.overline')}</p>
        <h3 style={subheadStyle}>{v('relief.headline')}</h3>
        <p style={{ ...captionStyle, marginTop: 6 }}>
          {(v('relief.description') || '').slice(0, 120)}...
        </p>
        <div style={{
          marginTop: 10,
          padding: '8px 16px',
          background: '#F5F564',
          color: '#1E1310',
          borderRadius: 9999,
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          fontWeight: 600,
          textAlign: 'center',
        }}>
          {v('relief.cta')}
        </div>
        <p style={{ ...captionStyle, textAlign: 'center', marginTop: 6, opacity: 0.5 }}>
          {v('relief.friction')}
        </p>
      </Section>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ id, active, children }: {
  id: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <div style={{
      padding: '12px 16px',
      opacity: active ? 1 : 0.35,
      transition: 'opacity 200ms ease',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {children}
    </div>
  )
}

const headlineStyle: React.CSSProperties = {
  fontFamily: 'var(--font-cormorant, Georgia, serif)',
  fontSize: 18,
  fontWeight: 700,
  color: '#FFFBEF',
  margin: 0,
  lineHeight: 1.2,
}

const subheadStyle: React.CSSProperties = {
  fontFamily: 'var(--font-cormorant, Georgia, serif)',
  fontSize: 14,
  fontWeight: 600,
  color: '#FFFBEF',
  margin: '4px 0 0 0',
  lineHeight: 1.3,
}

const textStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: 12,
  color: 'rgba(255, 251, 239, 0.85)',
  margin: 0,
  lineHeight: 1.5,
}

const captionStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: 10,
  color: 'rgba(255, 251, 239, 0.6)',
  margin: 0,
  lineHeight: 1.4,
}

const overlineStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: 9,
  fontWeight: 600,
  color: '#B45A32',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  margin: 0,
}

const tensionCardStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '8px 4px',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 8,
  textAlign: 'center',
}
