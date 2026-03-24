'use client'

/**
 * MapaClient.tsx — El mapa vivo personal (Client Component)
 *
 * Usa exclusivamente los tokens CSS del sistema de diseño (globals.css).
 * Componentes de /components/ui donde corresponde.
 *
 * Revelación progresiva:
 *   0s   → Score global (counter 0→score, 1200ms)
 *   2s   → D1 · 3s → D2 · 4s → D3 · 5s → D4 · 6s → D5
 *   7s   → Prioridad destacada
 *   8s   → Primer paso
 *   9.5s → CTA + Urgencia + Compartir
 *
 * + Secciones de evolución (Día 3-90) que se ACUMULAN.
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { DimensionResult, DimensionKey } from '@/lib/insights'
import { getScoreColor, getScoreLabel } from '@/lib/insights'
import type { EvolutionState, ReevaluationScores, ReevaluationEntry } from '@/lib/map-evolution'
import type { ArchetypeData } from '@/lib/content/archetypes'
import type { SubdimensionConfig } from '@/lib/content/subdimensions'
import type { BookExcerptData } from '@/lib/content/book-excerpts'

// Secciones de evolución
import DimensionCard from './sections/DimensionCard'
import EvolutionTimeline from './sections/EvolutionTimeline'
import EvolutionChart from './sections/EvolutionChart'
import EvolutionArchetype from './sections/EvolutionArchetype'
import EvolutionSession from './sections/EvolutionSession'
import EvolutionSubdimensions from './sections/EvolutionSubdimensions'
import EvolutionBookExcerpt from './sections/EvolutionBookExcerpt'
import EvolutionReevaluation from './sections/EvolutionReevaluation'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface Props {
  global: number
  dimensionResults: DimensionResult[]
  firstStep: string
  mostCompromisedKey: DimensionKey
  hash: string
  createdAt: string
  lastVisitedAt?: string | null
  // Evolution
  evolution: EvolutionState
  archetype: ArchetypeData | null
  d7Insight: string | null
  subdimensionConfig: SubdimensionConfig | null
  subdimensionScores: Record<string, number> | null
  bookExcerpt: BookExcerptData | null
  originalSliders: Record<string, number>
  originalScores: ReevaluationScores
  reevaluations: ReevaluationEntry[]
  reevaluationScores: ReevaluationScores | null
  worstDimensionName: string
  worstScore: number
  hasPaid: boolean
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoy'
  if (days === 1) return 'hace 1 día'
  if (days < 30) return `hace ${days} días`
  const months = Math.floor(days / 30)
  return months === 1 ? 'hace 1 mes' : `hace ${months} meses`
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ─── PUENTES LÍQUIDOS ─────────────────────────────────────────────────────────

const PUENTES = {
  p1: 'Este mapa es una foto fija. El programa lo convierte en un sistema que se adapta cada semana según cómo respondes.',
  p2: 'Esta dimensión tiene 3 subdimensiones que solo emergen con observación continua.',
  p3: 'Tu puntuación vs. 72 es la foto de hoy. El programa mide tu evolución semana a semana.',
  p4: 'Este patrón usa datos de miles de personas. El programa aprende TUS patrones — en 2 semanas sabe más de ti que tú.',
  p5: 'Tu mapa es individual. El programa incluye 12 personas en tu misma situación — las brechas compartidas revelan lo que ningún diagnóstico individual puede ver.',
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function MapaClient({
  global,
  dimensionResults,
  firstStep,
  mostCompromisedKey,
  hash,
  createdAt,
  lastVisitedAt,
  // Evolution
  evolution,
  archetype,
  d7Insight,
  subdimensionConfig,
  subdimensionScores,
  bookExcerpt,
  originalSliders,
  originalScores,
  reevaluations,
  reevaluationScores,
  worstDimensionName,
  worstScore,
  hasPaid,
}: Props) {
  const [displayScore, setDisplayScore] = useState(0)
  const [visibleDims, setVisibleDims] = useState(-1)
  const [showPriority, setShowPriority] = useState(false)
  const [showFirstStep, setShowFirstStep] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showPrice, setShowPrice] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const rafRef = useRef<number>(0)

  const globalColor = getScoreColor(global)
  const globalLabel = getScoreLabel(global)

  // ── Counter animation ────────────────────────────────────────────────────

  useEffect(() => {
    const start = performance.now()
    const duration = 1200
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(global * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [global])

  // ── Revelación progresiva (timing exacto) ────────────────────────────────

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleDims(0), 2000),
      setTimeout(() => setVisibleDims(1), 3000),
      setTimeout(() => setVisibleDims(2), 4000),
      setTimeout(() => setVisibleDims(3), 5000),
      setTimeout(() => setVisibleDims(4), 6000),
      setTimeout(() => setShowPriority(true), 7000),
      setTimeout(() => setShowFirstStep(true), 8000),
      setTimeout(() => setShowTimeline(true), 9500),
      setTimeout(() => setShowPrice(true), 10200),
      setTimeout(() => setShowCTA(true), 11000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Registrar visita + analytics ─────────────────────────────────────────

  useEffect(() => {
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / 86400000
    )
    fetch(`/api/mapa/${hash}/visita`, { method: 'PATCH' }).catch(() => {})
  }, [hash, createdAt])

  // ── Stripe Checkout ──────────────────────────────────────────────────────

  const checkoutDebounceRef = useRef(false)

  const handleStripeCheckout = useCallback(async () => {
    if (checkoutDebounceRef.current) return
    checkoutDebounceRef.current = true
    setTimeout(() => { checkoutDebounceRef.current = false }, 2000)

    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setCheckoutError('No se pudo iniciar el pago. Inténtalo de nuevo.')
        setCheckoutLoading(false)
      }
    } catch {
      setCheckoutError('Error de conexión. Inténtalo de nuevo.')
      setCheckoutLoading(false)
    }
  }, [hash])

  // ── Compartir (gateway, nunca el mapa personal) ──────────────────────────

  const handleShare = useCallback(() => {
    const gatewayUrl = `${window.location.origin}/`
    navigator.clipboard.writeText(gatewayUrl).then(() => {
      setShareToast('Link copiado — lleva al diagnóstico, no a tu mapa')
      setTimeout(() => setShareToast(null), 3500)
    }).catch(() => {
      setShareToast(gatewayUrl)
      setTimeout(() => setShareToast(null), 5000)
    })
  }, [])

  // ── Descarga PNG (canvas 2D) ─────────────────────────────────────────────

  const handleDownloadPNG = useCallback(() => {
    const dpr = window.devicePixelRatio || 1
    const W = 580, H = 740
    const canvas = document.createElement('canvas')
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#FFFBEF'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = 'rgba(30,19,16,0.06)'
    ctx.lineWidth = 1
    roundRect(ctx, 1, 1, W - 2, H - 2, 20)
    ctx.stroke()

    ctx.fillStyle = '#B45A32'
    ctx.font = '600 11px system-ui, sans-serif'
    ctx.fillText('TU DIAGNÓSTICO · L.A.R.S.©', 40, 52)

    ctx.fillStyle = '#F5F5F0'
    ctx.font = '600 26px system-ui, sans-serif'
    ctx.fillText('Tu Mapa de Regulación', 40, 88)

    ctx.fillStyle = '#6B7572'
    ctx.font = '400 12px system-ui, sans-serif'
    ctx.fillText('Instituto Epigenético · Calibrado con +25.000 evaluaciones', 40, 112)

    ctx.strokeStyle = 'rgba(30,19,16,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, 130)
    ctx.lineTo(W - 40, 130)
    ctx.stroke()

    ctx.fillStyle = globalColor
    ctx.font = 'bold 56px system-ui, sans-serif'
    const scoreText = String(global)
    ctx.fillText(scoreText, 40, 196)
    const scoreW = ctx.measureText(scoreText).width
    ctx.fillStyle = '#6B7572'
    ctx.font = '400 22px system-ui, sans-serif'
    ctx.fillText('/100', 40 + scoreW + 4, 196)

    ctx.font = '600 12px system-ui, sans-serif'
    const badgeW = ctx.measureText(globalLabel).width + 24
    roundRect(ctx, 40, 208, badgeW, 26, 13)
    ctx.fillStyle = globalColor
    ctx.fill()
    ctx.fillStyle = '#FFFBEF'
    ctx.fillText(globalLabel, 40 + 12, 226)

    dimensionResults.forEach((dim, i) => {
      const y = 266 + i * 86
      const BAR_W = W - 80

      ctx.fillStyle = '#F5F5F0'
      ctx.font = '500 13px system-ui, sans-serif'
      ctx.fillText(dim.name, 40, y)

      ctx.fillStyle = dim.color
      ctx.font = '600 13px system-ui, sans-serif'
      const label = `${dim.score}/100`
      ctx.fillText(label, W - 40 - ctx.measureText(label).width, y)

      ctx.fillStyle = 'rgba(30,19,16,0.08)'
      roundRect(ctx, 40, y + 10, BAR_W, 6, 3)
      ctx.fill()

      ctx.fillStyle = dim.color
      roundRect(ctx, 40, y + 10, Math.max(BAR_W * dim.score / 100, 6), 6, 3)
      ctx.fill()

      ctx.fillStyle = '#6B7572'
      ctx.font = '400 11px system-ui, sans-serif'
      const short = dim.insight.length > 82 ? dim.insight.slice(0, 79) + '…' : dim.insight
      ctx.fillText(short, 40, y + 36)

      if (i < dimensionResults.length - 1) {
        ctx.strokeStyle = 'rgba(30,19,16,0.05)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(40, y + 50)
        ctx.lineTo(W - 40, y + 50)
        ctx.stroke()
      }
    })

    ctx.strokeStyle = 'rgba(30,19,16,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, H - 46)
    ctx.lineTo(W - 40, H - 46)
    ctx.stroke()

    ctx.fillStyle = '#6B7572'
    ctx.font = '400 11px system-ui, sans-serif'
    const date = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    ctx.fillText(`Mapa de Regulación · ${date}`, 40, H - 24)

    const link = document.createElement('a')
    link.download = `mapa-lars-${hash}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }, [global, globalColor, globalLabel, dimensionResults, hash])

  // ── Preparar subdimensiones para DimensionCard ──────────────────────────

  const subdimScoresForCard = subdimensionScores && subdimensionConfig
    ? subdimensionConfig.subdimensions.map((sub) => ({
        key: sub.key,
        name: sub.name,
        score: subdimensionScores[sub.key] ?? 50,
      }))
    : null

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Solo animaciones específicas del mapa — globals.css maneja el resto */}
      <style>{`
        @keyframes mapaFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mapaBarFill {
          from { width: 0%; }
        }
        @keyframes mapaPriorityPulse {
          0%,100% { box-shadow: none; }
          50%      { box-shadow: 0 0 0 6px rgba(239,68,68,0.10); }
        }
        .mapa-fade-up {
          animation: mapaFadeUp 400ms var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)) both;
        }
        .mapa-bar-fill {
          height: 100%;
          border-radius: 3px;
          animation: mapaBarFill 800ms var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)) both;
          animation-delay: 50ms;
        }
        .mapa-priority { animation: mapaPriorityPulse 2s ease 0.1s 2; }
        .mapa-puente {
          font-family: var(--font-inter, system-ui);
          font-size: var(--text-caption, 0.75rem);
          line-height: var(--lh-caption, 1.4);
          color: var(--color-text-tertiary);
          margin-top: var(--space-3);
          padding-top: var(--space-3);
          border-top: var(--border-subtle);
          font-style: italic;
        }
        .mapa-detail-toggle {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between;
          background: transparent; border: none;
          font-family: var(--font-inter, system-ui);
          font-size: var(--text-body-sm, 0.875rem);
          color: var(--color-text-secondary);
          cursor: pointer; padding: var(--space-4) var(--space-5);
          transition: color var(--transition-base);
        }
        .mapa-detail-toggle:hover { color: var(--color-text-primary); }
        .mapa-toast {
          position: fixed; bottom: 24px; left: 50%;
          transform: translateX(-50%);
          background: var(--color-bg-secondary);
          border: var(--border-accent-strong);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-5);
          font-family: var(--font-inter, system-ui);
          font-size: var(--text-body-sm, 0.875rem);
          color: var(--color-accent);
          z-index: 100;
          animation: mapaFadeUp 300ms ease both;
          white-space: nowrap; max-width: 90vw;
        }
        .mapa-timeline-phase {
          opacity: 0;
          animation: mapaFadeUp 400ms var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)) both;
        }
        .mapa-timeline-phase:nth-child(1) { animation-delay: 0ms; }
        .mapa-timeline-phase:nth-child(2) { animation-delay: 150ms; }
        .mapa-timeline-phase:nth-child(3) { animation-delay: 300ms; }
      `}</style>

      <main style={{ minHeight: '100vh', padding: 'calc(var(--header-height, 56px) + var(--space-16)) var(--space-6) var(--space-24)' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>

          {/* ── HEADER ── */}
          <div className="mapa-fade-up" style={{ marginBottom: 'var(--space-10)' }}>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-overline)',
              letterSpacing: 'var(--ls-overline)',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: 'var(--space-3)',
            }}>
              Tu diagnóstico
            </p>
            <h1 style={{
              fontFamily: 'var(--font-lora)',
              fontSize: 'var(--text-h1)',
              lineHeight: 'var(--lh-h1)',
              letterSpacing: 'var(--ls-h1)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}>
              Tu Mapa de Regulación
            </h1>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
              lineHeight: 'var(--lh-body-sm)',
            }}>
              Calibrado con +25.000 evaluaciones reales · Basado en tus 10 respuestas
            </p>
          </div>

          {/* ── SCORE GLOBAL ── */}
          <div className="mapa-fade-up" style={{ animationDelay: '100ms', marginBottom: 'var(--space-10)' }}>
            <Card style={{ border: `1px solid ${globalColor}33` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                    <span style={{
                      fontFamily: 'var(--font-lora)',
                      fontSize: 'var(--text-display)',
                      fontWeight: 700,
                      color: globalColor,
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {displayScore}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 'var(--text-h3)',
                      color: 'var(--color-text-tertiary)',
                    }}>
                      /100
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    Score global de regulación
                  </p>
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: 'var(--space-1) var(--space-4)',
                  borderRadius: 'var(--radius-pill)',
                  background: globalColor,
                  color: '#FFFBEF',
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  marginTop: 'var(--space-1)',
                }}>
                  {globalLabel}
                </span>
              </div>
              <p className="mapa-puente">{PUENTES.p3}</p>
            </Card>
          </div>

          {/* ── TIMELINE (solo si hay al menos 1 evolución desbloqueada) ── */}
          {evolution.archetype.unlocked && (
            <EvolutionTimeline evolution={evolution} />
          )}

          {/* ── GRÁFICA DE EVOLUCIÓN (solo si hay reevaluaciones) ── */}
          <EvolutionChart
            globalScore={global}
            reevaluations={reevaluations}
          />

          {/* ── 5 DIMENSIONES (usando DimensionCard extraído) ── */}
          <div id="section-dimensions" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            {dimensionResults.map((dim, i) => {
              if (visibleDims < i) return null

              const isMostCompromised = dim.key === mostCompromisedKey
              const isD3orD4 = dim.key === 'd3' || dim.key === 'd4'
              const showPriorityTag = isMostCompromised && showPriority

              // D7 insight only on worst dimension
              const dimD7Insight = isMostCompromised && evolution.insightD7.unlocked ? d7Insight : null
              const dimD7IsNew = isMostCompromised && evolution.insightD7.isNew

              // Subdimension scores only on worst dimension
              const dimSubScores = isMostCompromised ? subdimScoresForCard : null

              // Puente
              let puente: string | null = null
              if (isMostCompromised) puente = PUENTES.p2
              else if (isD3orD4) puente = PUENTES.p4

              return (
                <DimensionCard
                  key={dim.key}
                  dim={dim}
                  isMostCompromised={isMostCompromised}
                  showPriorityTag={showPriorityTag}
                  d7Insight={dimD7Insight}
                  d7IsNew={dimD7IsNew}
                  subdimensionScores={dimSubScores}
                  puente={puente}
                />
              )
            })}
          </div>

          {/* Puente 5 — sistema compartido (tras última dimensión) */}
          {visibleDims >= 4 && (
            <div
              className="mapa-fade-up"
              style={{
                padding: 'var(--space-4) var(--space-5)',
                marginBottom: 'var(--space-8)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent-subtle)',
                border: 'var(--border-accent)',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-caption)',
                lineHeight: 'var(--lh-body)',
                color: 'var(--color-text-tertiary)',
                fontStyle: 'italic',
              }}>
                {PUENTES.p5}
              </p>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               SECCIONES DE EVOLUCIÓN — SE ACUMULAN (no reemplazan)
             ══════════════════════════════════════════════════════════════════ */}

          {/* Día 3 — Arquetipo del Sistema Nervioso */}
          {evolution.archetype.unlocked && archetype && (
            <div id="section-archetype" style={{ marginBottom: 'var(--space-6)' }}>
              <EvolutionArchetype
                archetype={archetype}
                isNew={evolution.archetype.isNew}
              />
            </div>
          )}

          {/* Día 10-14 — Sesión con Javier */}
          {evolution.session.unlocked && (
            <div id="section-session" style={{ marginBottom: 'var(--space-6)' }}>
              <EvolutionSession
                isNew={evolution.session.isNew}
                booked={evolution.session.booked}
                mapHash={hash}
              />
            </div>
          )}

          {/* Día 14 — Subdimensiones */}
          {evolution.subdimensions.unlocked && subdimensionConfig && (
            <div id="section-subdimensions" style={{ marginBottom: 'var(--space-6)' }}>
              <EvolutionSubdimensions
                config={subdimensionConfig}
                completed={evolution.subdimensions.completed}
                isNew={evolution.subdimensions.isNew}
                hash={hash}
              />
            </div>
          )}

          {/* Día 21 — Extracto del libro */}
          {evolution.bookExcerpt.unlocked && bookExcerpt && (
            <div id="section-book" style={{ marginBottom: 'var(--space-6)' }}>
              <EvolutionBookExcerpt
                excerpt={bookExcerpt}
                isNew={evolution.bookExcerpt.isNew}
                worstDimensionName={worstDimensionName}
                worstScore={worstScore}
              />
            </div>
          )}

          {/* Día 30/90 — Reevaluación */}
          {(evolution.reevaluation.unlocked || evolution.nextQuarterlyUnlocked) && (
            <div id="section-reevaluation" style={{ marginBottom: 'var(--space-6)' }}>
              <EvolutionReevaluation
                originalSliders={originalSliders}
                originalScores={originalScores}
                completed={evolution.reevaluation.completed}
                isNew={evolution.reevaluation.isNew || evolution.nextQuarterlyUnlocked}
                completedScores={reevaluationScores}
                reevaluations={reevaluations}
                hash={hash}
                daysSinceCreation={evolution.daysSinceCreation}
              />
            </div>
          )}

          {/* ── PRIMER PASO ── */}
          {showFirstStep && (
            <div className="mapa-fade-up" style={{ marginBottom: 'var(--space-12)' }}>
              <Card style={{
                border: '1px solid rgba(61,154,95,0.18)',
                background: 'rgba(61,154,95,0.04)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-overline)',
                  letterSpacing: 'var(--ls-overline)',
                  textTransform: 'uppercase',
                  color: 'var(--color-success)',
                  marginBottom: 'var(--space-3)',
                }}>
                  Tu primer paso
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--color-text-primary)',
                }}>
                  {firstStep}
                </p>
                <p className="mapa-puente">{PUENTES.p1}</p>
              </Card>
            </div>
          )}

          {/* ── BLOQUE A — Timeline de 3 fases ── */}
          {showTimeline && (
            <div className="mapa-fade-up" style={{ marginBottom: 'var(--space-12)' }}>
              <h3 style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'var(--text-h3)',
                lineHeight: 'var(--lh-h3)',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-8)',
              }}>
                Tu regulación es un proceso de 12 semanas. Tu primer paso son los próximos 7 días.
              </h3>

              {/* Cards horizontales — cada fase ocupa todo el ancho */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Fase 1 — El Despertar (activa) */}
                <div className="mapa-timeline-phase">
                  <Card style={{
                    border: '1px solid rgba(61,154,95,0.18)',
                    background: 'rgba(61,154,95,0.04)',
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)',
                  }}>
                    {/* Nodo + indicador */}
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        backgroundColor: 'var(--color-success)',
                      }} />
                      <div style={{ width: 2, height: 32, backgroundColor: 'rgba(61,154,95,0.18)', marginTop: 4 }} />
                    </div>
                    {/* Contenido */}
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 'var(--space-2)' }}>
                        <Badge status="disponible">AQUÍ EMPIEZAS</Badge>
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-lg, 1.125rem)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-1)',
                      }}>El Despertar</p>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-3)',
                      }}>Semanas 1–4 · Reconocer y estabilizar</p>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-sm)',
                        lineHeight: 'var(--lh-body-sm)',
                        color: 'var(--color-text-tertiary)',
                      }}>
                        Entenderás qué le pasa a tu biología: neurotransmisores, función hormonal, inflamación. Restaurarás tu sueño con un protocolo diseñado por un médico. En la semana 4, tu primer balance formal confirmará lo que tu cuerpo ya empieza a notar.
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Fase 2 — La Metamorfosis (atenuada) */}
                <div className="mapa-timeline-phase" style={{ opacity: 0.5 }}>
                  <Card style={{
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)',
                  }}>
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        border: '2px solid var(--color-text-tertiary)',
                      }} />
                      <div style={{ width: 2, height: 32, backgroundColor: 'rgba(30,19,16,0.06)', marginTop: 4 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-lg, 1.125rem)',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-1)',
                      }}>La Metamorfosis</p>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--color-text-tertiary)',
                        marginBottom: 'var(--space-3)',
                      }}>Semanas 5–8 · Activar y procesar</p>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-sm)',
                        lineHeight: 'var(--lh-body-sm)',
                        color: 'var(--color-text-tertiary)',
                      }}>
                        Desmontarás las creencias y patrones que sostienen el ciclo. Conocerás las partes internas que dirigen tus decisiones sin que lo sepas — el perfeccionista, el controlador, el crítico — y aprenderás a liderarlas. Lo que el burnout congeló empieza a procesarse.
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Fase 3 — Volar Alto (atenuada) */}
                <div className="mapa-timeline-phase" style={{ opacity: 0.5 }}>
                  <Card style={{
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)',
                  }}>
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        border: '2px solid var(--color-text-tertiary)',
                      }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-lg, 1.125rem)',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-1)',
                      }}>Volar Alto</p>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--color-text-tertiary)',
                        marginBottom: 'var(--space-3)',
                      }}>Semanas 9–12 · Conectar y reconstruir</p>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-sm)',
                        lineHeight: 'var(--lh-body-sm)',
                        color: 'var(--color-text-tertiary)',
                      }}>
                        Repararás los vínculos que el burnout dañó, pondrás límites desde tus valores y diseñarás tu nueva arquitectura vital. Un sistema de alertas tempranas para que el burnout no vuelva.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* ── BLOQUE B — Reencuadre de precio ── */}
          {showPrice && (
            <div className="mapa-fade-up" style={{ marginBottom: 'var(--space-12)' }}>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--lh-body)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)',
              }}>
                El programa completo tiene tres niveles de acompañamiento desde 2.500€, según la profundidad que necesites. La elección del plan viene después — cuando hayas comprobado con tu propio cuerpo que esto funciona.
              </p>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Por eso existe la Semana 1.
              </p>
            </div>
          )}

          {/* ── CTA + URGENCIA + COMPARTIR ── */}
          {showCTA && (
            <div className="mapa-fade-up">

              <div style={{ height: '1px', background: 'var(--color-surface-subtle)', marginBottom: 'var(--space-12)' }} />

              {/* Benchmark */}
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--lh-body)',
                  marginBottom: 'var(--space-2)',
                }}>
                  El promedio de personas que completaron 4+ semanas del programa
                </p>
                <p style={{
                  fontFamily: 'var(--font-lora)',
                  fontSize: 'var(--text-display)',
                  fontWeight: 700,
                  color: 'var(--color-success)',
                  lineHeight: 'var(--lh-display)',
                  marginBottom: 'var(--space-2)',
                }}>
                  72
                  <span style={{
                    fontSize: 'var(--text-h3)',
                    fontWeight: 400,
                    color: 'var(--color-text-tertiary)',
                    fontFamily: 'var(--font-inter)',
                  }}>/100</span>
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)',
                }}>
                  La distancia entre tu {global} y el 72 es donde está tu oportunidad.
                </p>
              </div>

              {hasPaid ? (
                /* ── SEMANA 1 EN MARCHA (ya pagó) ── */
                <div style={{
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(61,154,95,0.04)',
                  border: '1px solid rgba(61,154,95,0.18)',
                  marginBottom: 'var(--space-6)',
                  textAlign: 'center',
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: 'var(--space-1) var(--space-4)',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(61,154,95,0.1)',
                    color: 'var(--color-success)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-caption)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--space-3)',
                  }}>
                    Semana 1
                  </span>
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-h4)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    Tu Semana 1 está en marcha
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--lh-body)',
                  }}>
                    Siguiente: agendar tu sesión con Javier. Revisa tu email para el Protocolo de Sueño de Emergencia.
                  </p>
                </div>
              ) : (
                /* ── CTA STRIPE (no ha pagado) ── */
                <>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'var(--text-h2)',
                    lineHeight: 'var(--lh-h2)',
                    letterSpacing: 'var(--ls-h2)',
                    fontStyle: 'italic',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-5)',
                  }}>
                    Tu sistema nervioso lleva años sosteniendo lo que tú no podías soltar. Ahora tienes el mapa.
                  </p>

                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body)',
                    lineHeight: 'var(--lh-body)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-8)',
                  }}>
                    Los primeros cambios llegan en 72 horas. No en meses — en 3 días.
                    El Protocolo de Sueño de Emergencia está diseñado para que tu cuerpo
                    note la diferencia antes de que tu mente decida si confía.
                  </p>

                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleStripeCheckout}
                    disabled={checkoutLoading}
                    style={{ width: '100%', marginBottom: 'var(--space-3)' }}
                  >
                    {checkoutLoading ? 'Redirigiendo…' : 'Empieza la Semana 1'}
                  </Button>

                  {checkoutError && (
                    <div style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      background: 'rgba(239,68,68,0.08)',
                      marginBottom: 'var(--space-3)',
                      textAlign: 'center',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-2)',
                      }}>
                        No se pudo conectar con el sistema de pago. Tus datos están a salvo.
                      </p>
                      <button
                        onClick={() => { setCheckoutError(null); handleStripeCheckout() }}
                        style={{
                          padding: 'var(--space-2) var(--space-4)',
                          borderRadius: 'var(--radius-pill)',
                          border: 'var(--border-subtle)',
                          background: 'transparent',
                          color: 'var(--color-accent)',
                          fontFamily: 'var(--font-inter)',
                          fontSize: 'var(--text-caption)',
                          cursor: 'pointer',
                        }}
                      >
                        Intentar de nuevo
                      </button>
                    </div>
                  )}

                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--color-text-tertiary)',
                    textAlign: 'center',
                    lineHeight: 'var(--lh-body-sm)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    97€ · Protocolo de Sueño de Emergencia + Sesión 1:1 con Javier + Mapa de Niveles de Neurotransmisores (MNN©) · Garantía de 7 días
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-tertiary)',
                    textAlign: 'center',
                    marginBottom: 'var(--space-6)',
                    opacity: 0.7,
                  }}>
                    Si tu sueño no mejora en 7 días, te devolvemos los 97€. Sin preguntas.
                  </p>
                </>
              )}

              {/* Card colapsable — Qué incluye (solo si no ha pagado) */}
              {!hasPaid && <div style={{
                border: 'var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: 'var(--space-12)',
              }}>
                <button
                  className="mapa-detail-toggle"
                  onClick={() => setDetailOpen(o => !o)}
                >
                  <span>¿Qué incluye la Semana 1?</span>
                  <span style={{
                    display: 'inline-block',
                    transform: detailOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--transition-base)',
                    fontSize: '16px',
                  }}>↓</span>
                </button>
                {detailOpen && (
                  <div style={{
                    padding: 'var(--space-1) var(--space-5) var(--space-5)',
                    borderTop: 'var(--border-subtle)',
                    background: 'var(--color-bg-secondary)',
                  }}>
                    {[
                      ['Protocolo de Sueño de Emergencia', 'Diseñado por el Dr. Carlos Alvear. Un plan concreto para ganar hasta una hora más de sueño al día. Resultados en 72 horas.'],
                      ['Sesión 1:1 con Javier A. Martín Ramos', 'Director del Instituto Epigenético. Ya tiene tu mapa — la sesión arranca desde tus datos, no desde cero.'],
                      ['Mapa de Niveles de Neurotransmisores (MNN©)', 'Tu primer análisis bioquímico real: qué sustancias produce tu cerebro, cuáles le faltan y qué significa eso para tu sueño, tu energía y tu claridad mental.'],
                      ['Garantía total', '7 días. Si no notas mejora en tu sueño, devolución íntegra. Sin preguntas. Sin formularios.'],
                    ].map(([title, desc]) => (
                      <div key={title} style={{ marginTop: 'var(--space-4)' }}>
                        <p style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 'var(--text-body-sm)',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          marginBottom: 'var(--space-1)',
                        }}>
                          → {title}
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 'var(--lh-body-sm)',
                        }}>
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>}

              {/* M8 — Urgencia natural */}
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-3)',
                }}>
                  Tu mapa está guardado en tu página personal. Evoluciona con el tiempo — cada semana hay algo nuevo.
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--color-text-tertiary)',
                  marginBottom: 'var(--space-3)',
                }}>
                  Cada semana sin regulación, tu cuerpo profundiza el patrón actual. No es opinión — es lo que confirman los datos de +5.000 personas. Cuanto antes, más rápida la recuperación.
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)',
                  opacity: 0.7,
                }}>
                  142 personas completaron este diagnóstico esta semana · 5.247 en total
                </p>
              </div>

              {/* Compartir + Descarga */}
              <div style={{ marginBottom: 'var(--space-16)' }}>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-4)',
                }}>
                  ¿Conoces a alguien que podría necesitar ver su mapa?
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <Button variant="secondary" size="small" onClick={handleShare}>
                    ↗ Enviar el diagnóstico
                  </Button>
                  <Button variant="secondary" size="small" onClick={handleDownloadPNG}>
                    ↓ Descargar mi mapa
                  </Button>
                </div>
              </div>

            </div>
          )}

          {/* ── FOOTER ── */}
          <div style={{
            paddingTop: 'var(--space-8)',
            borderTop: 'var(--border-subtle)',
            textAlign: 'center',
          }}>
            {lastVisitedAt && (
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--space-2)',
                opacity: 0.7,
              }}>
                Última visita: {relativeTime(lastVisitedAt)}
              </p>
            )}
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-tertiary)',
              lineHeight: 'var(--lh-body)',
              opacity: 0.7,
            }}>
              Este mapa es tuyo. Evoluciona con el tiempo.<br />
              Confidencial — solo esta URL tiene acceso a tu diagnóstico.
            </p>
          </div>

        </div>
      </main>

      {shareToast && <div className="mapa-toast">{shareToast}</div>}
    </>
  )
}
