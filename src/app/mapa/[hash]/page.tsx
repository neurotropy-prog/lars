/**
 * /mapa/[hash] — El mapa vivo personal
 *
 * Server component: carga el diagnóstico desde Supabase por hash.
 * No indexable (noindex), no requiere autenticación.
 * La URL con hash es el único método de acceso — per spec.
 *
 * Muestra:
 *   - Header con score global + badge semáforo
 *   - 5 cards de dimensión (barra de color + score + insight)
 *   - Primer paso recomendado (D1+D2 más comprometida)
 *   - CTA: "Empieza la Semana 1 — 97€"
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import {
  buildDimensionResult,
  getMostCompromised,
  getScoreColor,
  getScoreLabel,
  type DimensionKey,
} from '@/lib/insights'

// ─── METADATA ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Tu Mapa de Regulación · L.A.R.S.',
  description: 'Tu diagnóstico personal de regulación nerviosa.',
  robots: { index: false, follow: false },
}

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface ScoreRow {
  global: number
  d1_regulacion: number
  d2_sueno: number
  d3_claridad: number
  d4_emocional: number
  d5_alegria: number
  label: string
}

interface DiagnosticoRow {
  scores: ScoreRow
  created_at: string
}

// ─── HELPERS INLINE ───────────────────────────────────────────────────────────

function BadgeColor({ score }: { score: number }) {
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 14px',
        borderRadius: '100px',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'var(--font-inter, system-ui)',
        color: '#0B0F0E',
        background: color,
        letterSpacing: '0.01em',
      }}
    >
      {label}
    </span>
  )
}

function DimensionCard({
  name,
  score,
  color,
  insight,
  delay,
}: {
  name: string
  score: number
  color: string
  insight: string
  delay: number
}) {
  const pct = Math.round(score)
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '24px',
        animation: `fadeSlideIn 400ms ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter, system-ui)',
            fontSize: '14px',
            fontWeight: 500,
            color: '#E8EAE9',
            letterSpacing: '0.01em',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-inter, system-ui)',
            fontSize: '20px',
            fontWeight: 600,
            color,
            lineHeight: 1,
          }}
        >
          {score}
          <span style={{ fontSize: '13px', fontWeight: 400, color: '#8A9E98' }}>/100</span>
        </span>
      </div>

      {/* Barra de progreso */}
      <div
        style={{
          height: '6px',
          borderRadius: '3px',
          background: 'rgba(255,255,255,0.08)',
          marginBottom: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: '3px',
            transition: 'width 800ms ease',
          }}
        />
      </div>

      {/* Insight */}
      <p
        style={{
          fontFamily: 'var(--font-inter, system-ui)',
          fontSize: '14px',
          lineHeight: '1.65',
          color: '#8A9E98',
          margin: 0,
        }}
      >
        {insight}
      </p>
    </div>
  )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────

export default async function MapaPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await params

  // Cargar diagnóstico desde Supabase
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('diagnosticos')
    .select('scores, created_at')
    .eq('hash', hash)
    .single<DiagnosticoRow>()

  if (error || !data) {
    notFound()
  }

  const { scores } = data
  const d1 = scores.d1_regulacion
  const d2 = scores.d2_sueno
  const d3 = scores.d3_claridad
  const d4 = scores.d4_emocional
  const d5 = scores.d5_alegria
  const global = scores.global

  const globalColor = getScoreColor(global)

  const dimensions: [DimensionKey, number][] = [
    ['d1', d1],
    ['d2', d2],
    ['d3', d3],
    ['d4', d4],
    ['d5', d5],
  ]

  const dimensionResults = dimensions.map(([key, score]) =>
    buildDimensionResult(key, score)
  )

  const { firstStep } = getMostCompromised(d1, d2, d3, d4, d5)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        body {
          margin: 0;
          padding: 0;
          background-color: #0B0F0E;
          color: #E8EAE9;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes barFill {
          from { width: 0%; }
        }
      `}</style>

      <main
        style={{
          minHeight: '100vh',
          background: '#0B0F0E',
          padding: '48px 24px 80px',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <div
            style={{
              marginBottom: '40px',
              animation: 'fadeSlideIn 400ms ease both',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '12px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#4ADE80',
                margin: '0 0 12px',
              }}
            >
              Tu diagnóstico
            </p>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 'clamp(32px, 6vw, 44px)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: '#E8EAE9',
                margin: '0 0 10px',
              }}
            >
              Tu Mapa de Regulación
            </h1>
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '14px',
                color: '#8A9E98',
                margin: 0,
              }}
            >
              Calibrado con +25.000 evaluaciones reales · Basado en tus 10 respuestas
            </p>
          </div>

          {/* ── Score global ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '48px',
              padding: '28px 28px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${globalColor}33`,
              borderRadius: '20px',
              animation: 'fadeSlideIn 400ms ease 100ms both',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'Inter, system-ui',
                  fontSize: '56px',
                  fontWeight: 600,
                  color: globalColor,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {global}
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#8A9E98',
                  }}
                >
                  /100
                </span>
              </p>
              <p
                style={{
                  fontFamily: 'Inter, system-ui',
                  fontSize: '13px',
                  color: '#8A9E98',
                  margin: '6px 0 0',
                }}
              >
                Score global de regulación
              </p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <BadgeColor score={global} />
            </div>
          </div>

          {/* ── 5 Dimensiones ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
            {dimensionResults.map((dim, i) => (
              <DimensionCard
                key={dim.name}
                name={dim.name}
                score={dim.score}
                color={dim.color}
                insight={dim.insight}
                delay={200 + i * 150}
              />
            ))}
          </div>

          {/* ── Primer paso ── */}
          <div
            style={{
              padding: '24px 28px',
              background: 'rgba(74, 222, 128, 0.06)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              borderRadius: '16px',
              marginBottom: '48px',
              animation: 'fadeSlideIn 400ms ease 1000ms both',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#4ADE80',
                margin: '0 0 12px',
              }}
            >
              Tu primer paso
            </p>
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '15px',
                lineHeight: '1.65',
                color: '#E8EAE9',
                margin: 0,
              }}
            >
              {firstStep}
            </p>
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '13px',
                color: '#8A9E98',
                marginTop: '12px',
                marginBottom: 0,
              }}
            >
              Las personas con tu perfil que empezaron por regular su D1 y D2 reportaron mejoras medibles en las primeras 72 horas.
            </p>
          </div>

          {/* ── Separador ── */}
          <div
            style={{
              height: '1px',
              background: 'rgba(255,255,255,0.07)',
              marginBottom: '40px',
              animation: 'fadeSlideIn 400ms ease 1100ms both',
            }}
          />

          {/* ── Benchmark ── */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '48px',
              animation: 'fadeSlideIn 400ms ease 1150ms both',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '14px',
                color: '#8A9E98',
                margin: '0 0 8px',
                lineHeight: 1.6,
              }}
            >
              El promedio de personas que completaron 4+ semanas del programa
            </p>
            <p
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '40px',
                fontWeight: 500,
                color: '#4ADE80',
                margin: '0 0 4px',
                lineHeight: 1,
              }}
            >
              72<span style={{ fontSize: '18px', color: '#8A9E98', fontFamily: 'Inter, system-ui' }}>/100</span>
            </p>
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '13px',
                color: '#506258',
                margin: 0,
              }}
            >
              La distancia entre tu {global} y el 72 es donde está tu oportunidad.
            </p>
          </div>

          {/* ── CTA Principal ── */}
          <div
            style={{
              textAlign: 'center',
              animation: 'fadeSlideIn 400ms ease 1200ms both',
            }}
          >
            <a
              href="https://pay.stripe.com/lars-semana1"
              style={{
                display: 'block',
                width: '100%',
                padding: '18px 32px',
                borderRadius: '100px',
                background: '#4ADE80',
                color: '#0B0F0E',
                fontFamily: 'Inter, system-ui',
                fontSize: '16px',
                fontWeight: 500,
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'background 200ms ease',
                marginBottom: '12px',
              }}
            >
              Empieza la Semana 1 — 97€
            </a>
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '13px',
                color: '#506258',
                margin: 0,
              }}
            >
              12 semanas · Protocol personalizado · Javier lo revisa contigo
            </p>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              marginTop: '64px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
              animation: 'fadeSlideIn 400ms ease 1300ms both',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, system-ui',
                fontSize: '13px',
                color: '#506258',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Este mapa es tuyo. Evoluciona con el tiempo.<br />
              Confidencial — solo esta URL tiene acceso a tu diagnóstico.
            </p>
          </div>

        </div>
      </main>
    </>
  )
}
