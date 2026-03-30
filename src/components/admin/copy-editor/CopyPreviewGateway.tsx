'use client'

/**
 * CopyPreviewGateway — Simplified live preview of gateway copy.
 * Shows questions, options, and reflection texts (Primera Verdad, Micro-espejos).
 */

import { COPY_DEFAULTS_MAP } from '@/lib/copy-defaults'

interface CopyPreviewGatewayProps {
  localValues: Record<string, string>
  activeSubsection?: string
}

function get(key: string, vals: Record<string, string>): string {
  return vals[key] ?? COPY_DEFAULTS_MAP[key]?.defaultValue ?? ''
}

export function CopyPreviewGateway({ localValues, activeSubsection }: CopyPreviewGatewayProps) {
  const v = (key: string) => get(key, localValues)

  // Show the active subsection's preview, or P1 by default
  const sub = activeSubsection || 'p1'

  return (
    <div style={{
      background: '#0B0F0E',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      padding: '16px',
      fontSize: '12px',
    }}>
      {(sub === 'p1' || sub === 'p2' || sub === 'p3' || sub === 'p4' ||
        sub === 'p5' || sub === 'p6' || sub === 'p7' || sub === 'p8') && (
        <QuestionPreview subsection={sub} v={v} />
      )}

      {sub === 'primeraverdad' && (
        <ReflectionPreview
          title="Primera Verdad"
          text={v('gateway.primeraverdad.A.A.text')}
          collective={v('gateway.primeraverdad.A.A.collective')}
        />
      )}

      {sub === 'microespejo1' && (
        <ReflectionPreview
          title="Micro-espejo 1"
          text={v('gateway.microespejo1.niebla.text')}
          collective=""
        />
      )}

      {sub === 'microespejo2' && (
        <ReflectionPreview
          title="Micro-espejo 2"
          text={v('gateway.microespejo2.A.text')}
          collective={v('gateway.microespejo2.A.collective')}
        />
      )}

      {sub === 'bisagra' && (
        <div>
          <p style={labelStyle}>Bisagra — Pantalla de carga</p>
          <p style={{ ...reflectionText, fontStyle: 'italic', textAlign: 'center' }}>
            {v('gateway.bisagra.calculating')}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function QuestionPreview({ subsection, v }: {
  subsection: string
  v: (key: string) => string
}) {
  const prefix = `gateway.${subsection}`

  // Try to get the question text
  const question = v(`${prefix}.question`)
  const hasQuestion = question && question !== `${prefix}.question`

  // Get up to 4 options
  const optionKeys = ['A', 'B', 'C', 'D']
  const options = optionKeys
    .map((k) => {
      const title = v(`${prefix}.option${k}`)
      const subtitle = v(`${prefix}.option${k}.subtitle`)
      const hasTitle = title && title !== `${prefix}.option${k}`
      return hasTitle ? { title, subtitle } : null
    })
    .filter(Boolean) as { title: string; subtitle: string }[]

  return (
    <div>
      <p style={labelStyle}>
        {SUBSECTION_SHORT[subsection] || subsection}
      </p>
      {hasQuestion && (
        <h3 style={questionStyle}>{question}</h3>
      )}
      {options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
          {options.map((opt, i) => (
            <div key={i} style={optionCardStyle}>
              <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 500 }}>
                {opt.title}
              </span>
              {opt.subtitle && opt.subtitle !== `${prefix}.option${optionKeys[i]}.subtitle` && (
                <span style={{ color: 'rgba(255,251,239,0.5)', fontSize: 10, marginTop: 2 }}>
                  {opt.subtitle}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReflectionPreview({ title, text, collective }: {
  title: string
  text: string
  collective: string
}) {
  return (
    <div>
      <p style={labelStyle}>{title}</p>
      <div style={{
        marginTop: 8,
        padding: '12px 14px',
        background: 'rgba(205, 121, 108, 0.08)',
        borderRadius: 12,
        borderLeft: '3px solid rgba(205, 121, 108, 0.4)',
      }}>
        <p style={reflectionText}>{text}</p>
        {collective && (
          <p style={{ ...reflectionText, marginTop: 8, opacity: 0.6, fontSize: 10 }}>
            {collective}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const SUBSECTION_SHORT: Record<string, string> = {
  p1: 'Pregunta 1 — ¿Qué te trajo aquí?',
  p2: 'Pregunta 2 — Sueño',
  p3: 'Pregunta 3 — Síntomas cognitivos',
  p4: 'Pregunta 4 — Síntomas emocionales',
  p5: 'Pregunta 5 — Alegría de vivir',
  p6: 'Pregunta 6 — Frase identitaria',
  p7: 'Pregunta 7 — Sliders',
  p8: 'Pregunta 8 — Duración',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-host-grotesk)',
  fontSize: 9,
  fontWeight: 600,
  color: '#CD796C',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  margin: 0,
}

const questionStyle: React.CSSProperties = {
  fontFamily: 'var(--font-cormorant, Georgia, serif)',
  fontSize: 16,
  fontWeight: 600,
  color: '#FFFFFF',
  margin: '8px 0 0',
  lineHeight: 1.3,
}

const optionCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.06)',
  fontFamily: 'var(--font-host-grotesk)',
}

const reflectionText: React.CSSProperties = {
  fontFamily: 'var(--font-host-grotesk)',
  fontSize: 11,
  color: 'rgba(255, 251, 239, 0.85)',
  margin: 0,
  lineHeight: 1.6,
}
