'use client'

/**
 * MapaClient.tsx — El mapa vivo personal (Client Component)
 *
 * Revelación progresiva de 8 segundos:
 *   0s   → Score global (counter 0→score, 1200ms)
 *   1.5s → Pausa. Solo el score.
 *   2s   → D1 Regulación Nerviosa
 *   3s   → D2 Calidad de Sueño
 *   4s   → D3 Claridad Cognitiva
 *   5s   → D4 Equilibrio Emocional
 *   6s   → D5 Alegría de Vivir
 *   7s   → "Tu prioridad" destaca en la dimensión más baja
 *   8s   → Primer paso recomendado
 *   9.5s → CTA + Urgencia + Compartir
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import type { DimensionResult, DimensionKey } from '@/lib/insights'
import { getScoreColor, getScoreLabel } from '@/lib/insights'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface Props {
  global: number
  dimensionResults: DimensionResult[]
  firstStep: string
  mostCompromisedKey: DimensionKey
  hash: string
  createdAt: string
  lastVisitedAt?: string | null
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoy'
  if (days === 1) return 'hace 1 día'
  if (days < 30) return `hace ${days} días`
  const months = Math.floor(days / 30)
  if (months === 1) return 'hace 1 mes'
  return `hace ${months} meses`
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
}: Props) {
  const [displayScore, setDisplayScore] = useState(0)
  const [visibleDims, setVisibleDims] = useState(-1) // -1 = ninguna visible
  const [showPriority, setShowPriority] = useState(false)
  const [showFirstStep, setShowFirstStep] = useState(false)
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

  // ── Revelación progresiva ─────────────────────────────────────────────────

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleDims(0), 2000),   // D1
      setTimeout(() => setVisibleDims(1), 3000),   // D2
      setTimeout(() => setVisibleDims(2), 4000),   // D3
      setTimeout(() => setVisibleDims(3), 5000),   // D4
      setTimeout(() => setVisibleDims(4), 6000),   // D5
      setTimeout(() => setShowPriority(true), 7000),
      setTimeout(() => setShowFirstStep(true), 8000),
      setTimeout(() => setShowCTA(true), 9500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Registrar visita ─────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`/api/mapa/${hash}/visita`, { method: 'PATCH' }).catch(() => {})
  }, [hash])

  // ── Stripe Checkout ──────────────────────────────────────────────────────

  const handleStripeCheckout = useCallback(async () => {
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

  // ── Compartir ────────────────────────────────────────────────────────────

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

  // ── Descarga PNG ─────────────────────────────────────────────────────────

  const handleDownloadPNG = useCallback(() => {
    const dpr = window.devicePixelRatio || 1
    const W = 580, H = 740
    const canvas = document.createElement('canvas')
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    // Fondo
    ctx.fillStyle = '#0B0F0E'
    ctx.fillRect(0, 0, W, H)

    // Borde sutil
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    roundRect(ctx, 1, 1, W - 2, H - 2, 24)
    ctx.stroke()

    // Overline
    ctx.fillStyle = '#4ADE80'
    ctx.font = '600 11px -apple-system, system-ui, sans-serif'
    ctx.letterSpacing = '0.12em'
    ctx.fillText('TU DIAGNÓSTICO · L.A.R.S.©', 40, 52)

    // Título
    ctx.fillStyle = '#F5F5F0'
    ctx.font = '500 26px Georgia, "Times New Roman", serif'
    ctx.letterSpacing = '-0.01em'
    ctx.fillText('Tu Mapa de Regulación', 40, 92)

    // Sub
    ctx.fillStyle = '#6B7572'
    ctx.font = '400 12px -apple-system, system-ui, sans-serif'
    ctx.letterSpacing = '0em'
    ctx.fillText('Instituto Epigenético · Calibrado con +25.000 evaluaciones', 40, 116)

    // Línea separadora
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, 134)
    ctx.lineTo(W - 40, 134)
    ctx.stroke()

    // Score global — número
    ctx.fillStyle = globalColor
    ctx.font = 'bold 56px -apple-system, system-ui, sans-serif'
    const scoreText = String(global)
    ctx.fillText(scoreText, 40, 196)
    const scoreW = ctx.measureText(scoreText).width
    ctx.fillStyle = '#6B7572'
    ctx.font = '400 22px -apple-system, system-ui, sans-serif'
    ctx.fillText('/100', 40 + scoreW + 4, 196)

    // Badge estado
    const badgeText = globalLabel
    ctx.font = '600 12px -apple-system, system-ui, sans-serif'
    const badgeW = ctx.measureText(badgeText).width + 24
    roundRect(ctx, 40, 210, badgeW, 26, 13)
    ctx.fillStyle = globalColor
    ctx.fill()
    ctx.fillStyle = '#0B0F0E'
    ctx.fillText(badgeText, 40 + 12, 228)

    // Dimensiones
    dimensionResults.forEach((dim, i) => {
      const y = 270 + i * 88
      const BAR_W = W - 80

      // Nombre + score
      ctx.fillStyle = '#E8EAE9'
      ctx.font = '500 13px -apple-system, system-ui, sans-serif'
      ctx.fillText(dim.name, 40, y)
      ctx.fillStyle = dim.color
      ctx.font = '600 13px -apple-system, system-ui, sans-serif'
      const scoreLabel = `${dim.score}/100`
      ctx.fillText(scoreLabel, W - 40 - ctx.measureText(scoreLabel).width, y)

      // Barra fondo
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      roundRect(ctx, 40, y + 12, BAR_W, 7, 3.5)
      ctx.fill()

      // Barra fill
      ctx.fillStyle = dim.color
      const fillW = Math.max(BAR_W * dim.score / 100, 7)
      roundRect(ctx, 40, y + 12, fillW, 7, 3.5)
      ctx.fill()

      // Insight (truncado)
      ctx.fillStyle = '#6B7572'
      ctx.font = '400 11px -apple-system, system-ui, sans-serif'
      const insightShort = dim.insight.length > 80 ? dim.insight.slice(0, 77) + '…' : dim.insight
      ctx.fillText(insightShort, 40, y + 38)

      // Separador sutil entre dims
      if (i < dimensionResults.length - 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(40, y + 52)
        ctx.lineTo(W - 40, y + 52)
        ctx.stroke()
      }
    })

    // Footer
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, H - 50)
    ctx.lineTo(W - 40, H - 50)
    ctx.stroke()

    ctx.fillStyle = '#506258'
    ctx.font = '400 11px -apple-system, system-ui, sans-serif'
    const date = new Date().toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric',
    })
    ctx.fillText(`Mapa de Regulación · ${date}`, 40, H - 26)
    ctx.fillText('Confidencial · solo esta URL tiene acceso a tu diagnóstico', W / 2, H - 26)

    // Descargar
    const link = document.createElement('a')
    link.download = `mapa-lars-${hash}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }, [global, globalColor, globalLabel, dimensionResults, hash])

  // ── Render ───────────────────────────────────────────────────────────────

  const mostCompromised = dimensionResults.reduce((min, d) =>
    d.score < min.score ? d : min,
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,400;1,500;1,600&family=Inter:wght@400;500&display=swap');

        * { box-sizing: border-box; }
        body {
          margin: 0; padding: 0;
          background: #0B0F0E;
          color: #E8EAE9;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes barFill {
          from { width: 0%; }
        }
        @keyframes priorityPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          50%      { box-shadow: 0 0 0 6px rgba(239,68,68,0.12); }
        }

        .dim-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 22px 24px 20px;
          animation: fadeUp 400ms cubic-bezier(0.16,1,0.3,1) both;
        }
        .dim-card.priority-highlight {
          border-color: rgba(239,68,68,0.25);
          animation: priorityPulse 2s ease 0.1s 2;
        }
        .bar-fill {
          height: 100%;
          border-radius: 3px;
          animation: barFill 800ms cubic-bezier(0.16,1,0.3,1) both;
        }
        .puente {
          font-family: Inter, system-ui;
          font-size: 12px;
          line-height: 1.6;
          color: #506258;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-style: italic;
        }
        .badge-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 100px;
          font-family: Inter, system-ui;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .cta-btn {
          display: block; width: 100%;
          padding: 18px 32px; border-radius: 100px;
          background: #4ADE80; color: #0B0F0E;
          font-family: Inter, system-ui; font-size: 17px; font-weight: 600;
          text-align: center; border: none; cursor: pointer;
          transition: background 200ms ease, opacity 200ms ease;
          letter-spacing: -0.01em;
        }
        .cta-btn:hover { background: #6EE79A; }
        .cta-btn:disabled { opacity: 0.7; cursor: wait; }
        .ghost-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px; padding: 9px 18px;
          font-family: Inter, system-ui; font-size: 13px; color: #A8B0AC;
          cursor: pointer; transition: border-color 200ms, color 200ms;
        }
        .ghost-btn:hover { border-color: rgba(255,255,255,0.24); color: #E8EAE9; }
        .detail-toggle {
          background: transparent; border: none;
          font-family: Inter, system-ui; font-size: 13px;
          color: #8A9E98; cursor: pointer; padding: 0;
          display: flex; align-items: center; gap: 6px;
          transition: color 200ms;
        }
        .detail-toggle:hover { color: #E8EAE9; }
        .toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          background: #1a2e27; border: 1px solid rgba(74,222,128,0.2);
          border-radius: 12px; padding: 12px 20px;
          font-family: Inter, system-ui; font-size: 13px; color: #4ADE80;
          z-index: 100; animation: fadeUp 300ms ease both;
          white-space: nowrap; max-width: 90vw;
        }
      `}</style>

      <main style={{ minHeight: '100vh', background: '#0B0F0E', padding: '48px 24px 96px' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>

          {/* ── HEADER ── */}
          <div style={{ marginBottom: '36px', animation: 'fadeUp 400ms ease both' }}>
            <p style={{
              fontFamily: 'Inter, system-ui', fontSize: '11px',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#4ADE80', margin: '0 0 14px',
            }}>
              Tu diagnóstico
            </p>
            <h1 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(30px, 6vw, 42px)', fontWeight: 500,
              lineHeight: 1.15, color: '#F5F5F0', margin: '0 0 10px',
              letterSpacing: '-0.01em',
            }}>
              Tu Mapa de Regulación
            </h1>
            <p style={{
              fontFamily: 'Inter, system-ui', fontSize: '13px',
              color: '#6B7572', margin: 0, lineHeight: 1.6,
            }}>
              Calibrado con +25.000 evaluaciones reales · Basado en tus 10 respuestas
            </p>
          </div>

          {/* ── SCORE GLOBAL ── */}
          <div
            style={{
              padding: '28px 28px 24px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${globalColor}33`,
              borderRadius: '20px',
              marginBottom: '40px',
              animation: 'fadeUp 400ms ease 100ms both',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{
                    fontFamily: 'Inter, system-ui', fontSize: '56px',
                    fontWeight: 700, color: globalColor, lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {displayScore}
                  </span>
                  <span style={{ fontFamily: 'Inter, system-ui', fontSize: '22px', color: '#6B7572' }}>
                    /100
                  </span>
                </div>
                <p style={{ fontFamily: 'Inter, system-ui', fontSize: '13px', color: '#8A9E98', margin: 0 }}>
                  Score global de regulación
                </p>
              </div>
              <span style={{
                display: 'inline-block', padding: '5px 14px', borderRadius: '100px',
                background: globalColor, color: '#0B0F0E',
                fontFamily: 'Inter, system-ui', fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.01em', whiteSpace: 'nowrap', marginTop: '4px',
              }}>
                {globalLabel}
              </span>
            </div>

            {/* Puente 3 — Benchmark dinámico */}
            <p className="puente">{PUENTES.p3}</p>
          </div>

          {/* ── 5 DIMENSIONES ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            {dimensionResults.map((dim, i) => {
              if (visibleDims < i) return null

              const isMostCompromised = dim.key === mostCompromisedKey
              const isD2 = dim.key === 'd2'
              const isD3orD4 = dim.key === 'd3' || dim.key === 'd4'
              const showPriorityTag = isMostCompromised && showPriority

              return (
                <div
                  key={dim.key}
                  className={`dim-card${showPriorityTag ? ' priority-highlight' : ''}`}
                >
                  {/* Tags */}
                  {showPriorityTag && (
                    <div className="badge-tag" style={{ background: `${dim.color}20`, color: dim.color }}>
                      Tu prioridad nº1
                    </div>
                  )}
                  {isD2 && !isMostCompromised && (
                    <div className="badge-tag" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>
                      Mejorable en 72 horas
                    </div>
                  )}
                  {isD2 && isMostCompromised && showPriorityTag && (
                    <div className="badge-tag" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80', marginLeft: '6px' }}>
                      Mejorable en 72 horas
                    </div>
                  )}

                  {/* Header nombre + score */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '12px',
                  }}>
                    <span style={{
                      fontFamily: 'Inter, system-ui', fontSize: '14px',
                      fontWeight: 500, color: '#E8EAE9',
                    }}>
                      {dim.name}
                    </span>
                    <span style={{
                      fontFamily: 'Inter, system-ui', fontSize: '19px',
                      fontWeight: 700, color: dim.color, lineHeight: 1,
                    }}>
                      {dim.score}
                      <span style={{ fontSize: '12px', fontWeight: 400, color: '#6B7572' }}>/100</span>
                    </span>
                  </div>

                  {/* Barra semáforo */}
                  <div style={{
                    height: '6px', borderRadius: '3px',
                    background: 'rgba(255,255,255,0.08)',
                    marginBottom: '16px', overflow: 'hidden',
                  }}>
                    <div
                      className="bar-fill"
                      style={{
                        width: `${dim.score}%`,
                        background: dim.color,
                        animationDelay: '50ms',
                      }}
                    />
                  </div>

                  {/* Insight */}
                  <p style={{
                    fontFamily: 'Inter, system-ui', fontSize: '14px',
                    lineHeight: '1.65', color: '#A8B0AC', margin: 0,
                  }}>
                    {dim.insight}
                  </p>

                  {/* Puente líquido 2 — dimensión más comprometida */}
                  {isMostCompromised && (
                    <p className="puente">{PUENTES.p2}</p>
                  )}

                  {/* Puente líquido 4 — D3/D4 */}
                  {isD3orD4 && !isMostCompromised && (
                    <p className="puente">{PUENTES.p4}</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Puente 5 — Sistema compartido (después de última dim) */}
          {visibleDims >= 4 && (
            <div
              style={{
                padding: '14px 20px', marginBottom: '32px',
                borderRadius: '12px',
                background: 'rgba(198,200,238,0.05)',
                border: '1px solid rgba(198,200,238,0.08)',
                animation: 'fadeUp 400ms ease both',
              }}
            >
              <p style={{
                fontFamily: 'Inter, system-ui', fontSize: '12px',
                lineHeight: 1.65, color: '#6B7572', fontStyle: 'italic', margin: 0,
              }}>
                {PUENTES.p5}
              </p>
            </div>
          )}

          {/* ── PRIMER PASO ── */}
          {showFirstStep && (
            <div
              style={{
                padding: '24px 28px',
                background: 'rgba(74,222,128,0.05)',
                border: '1px solid rgba(74,222,128,0.18)',
                borderRadius: '16px',
                marginBottom: '48px',
                animation: 'fadeUp 400ms cubic-bezier(0.16,1,0.3,1) both',
              }}
            >
              <p style={{
                fontFamily: 'Inter, system-ui', fontSize: '11px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#4ADE80', margin: '0 0 12px',
              }}>
                Tu primer paso
              </p>
              <p style={{
                fontFamily: 'Inter, system-ui', fontSize: '15px',
                lineHeight: '1.7', color: '#E8EAE9', margin: 0,
              }}>
                {firstStep}
              </p>

              {/* Puente 1 — Plan vivo */}
              <p className="puente">{PUENTES.p1}</p>
            </div>
          )}

          {/* ── CTA + URGENCIA + COMPARTIR ── */}
          {showCTA && (
            <div style={{ animation: 'fadeUp 500ms cubic-bezier(0.16,1,0.3,1) both' }}>

              {/* Separador */}
              <div style={{
                height: '1px', background: 'rgba(255,255,255,0.06)',
                marginBottom: '48px',
              }} />

              {/* Benchmark visual */}
              <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                <p style={{
                  fontFamily: 'Inter, system-ui', fontSize: '14px',
                  color: '#8A9E98', margin: '0 0 8px', lineHeight: 1.6,
                }}>
                  El promedio de personas que completaron 4+ semanas del programa
                </p>
                <p style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '44px', fontWeight: 500,
                  color: '#4ADE80', margin: '0 0 6px', lineHeight: 1,
                }}>
                  72
                  <span style={{ fontSize: '18px', color: '#8A9E98', fontFamily: 'Inter, system-ui', fontWeight: 400 }}>/100</span>
                </p>
                <p style={{
                  fontFamily: 'Inter, system-ui', fontSize: '13px',
                  color: '#506258', margin: 0,
                }}>
                  La distancia entre tu {global} y el 72 es donde está tu oportunidad.
                </p>
              </div>

              {/* Pre-CTA — Cormorant italic */}
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 500,
                fontStyle: 'italic', lineHeight: 1.35,
                color: '#F5F5F0', margin: '0 0 20px',
                letterSpacing: '-0.01em',
              }}>
                Tu sistema nervioso lleva años sosteniendo lo que tú no podías soltar. Ahora tienes el mapa.
              </p>

              {/* Delta de alivio */}
              <p style={{
                fontFamily: 'Inter, system-ui', fontSize: '16px',
                lineHeight: 1.65, color: '#E8EAE9',
                margin: '0 0 32px',
              }}>
                Los primeros cambios llegan en 72 horas. No en meses — en 3 días.
                El Protocolo de Sueño de Emergencia está diseñado para que tu cuerpo
                note la diferencia antes de que tu mente decida si confía.
              </p>

              {/* Botón Stripe */}
              <button
                className="cta-btn"
                onClick={handleStripeCheckout}
                disabled={checkoutLoading}
                style={{ marginBottom: '12px' }}
              >
                {checkoutLoading ? 'Redirigiendo…' : 'Empieza la Semana 1'}
              </button>

              {checkoutError && (
                <p style={{
                  fontFamily: 'Inter, system-ui', fontSize: '13px',
                  color: '#F87171', textAlign: 'center', margin: '8px 0 0',
                }}>
                  {checkoutError}
                </p>
              )}

              {/* Post-CTA */}
              <p style={{
                fontFamily: 'Inter, system-ui', fontSize: '13px',
                color: '#506258', textAlign: 'center',
                margin: '8px 0 6px', lineHeight: 1.6,
              }}>
                97€ · Protocolo de Sueño de Emergencia + Sesión 1:1 con Javier + MNN© · Garantía de 7 días
              </p>
              <p style={{
                fontFamily: 'Inter, system-ui', fontSize: '12px',
                color: '#3d5048', textAlign: 'center', margin: '0 0 28px',
              }}>
                Si tu sueño no mejora en 7 días, te devolvemos los 97€. Sin preguntas.
              </p>

              {/* Card colapsable — Qué incluye */}
              <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px', overflow: 'hidden',
                marginBottom: '48px',
              }}>
                <button
                  className="detail-toggle"
                  style={{ width: '100%', padding: '16px 20px', textAlign: 'left' }}
                  onClick={() => setDetailOpen(o => !o)}
                >
                  <span style={{ flex: 1 }}>¿Qué incluye la Semana 1?</span>
                  <span style={{ fontSize: '18px', transform: detailOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                    ↓
                  </span>
                </button>
                {detailOpen && (
                  <div style={{ padding: '4px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {[
                      ['Protocolo de Sueño de Emergencia', 'Diseñado por el Dr. Carlos Alvear. Resultados en 72 horas.'],
                      ['Sesión 1:1 con Javier A. Martín Ramos', 'Director del Instituto Epigenético. Ya tiene tu mapa.'],
                      ['MNN© — Mapa de Niveles de Neurotransmisores', 'Tu primer análisis bioquímico real.'],
                      ['Garantía total', '7 días. Si no mejora tu sueño, devolución íntegra.'],
                    ].map(([title, desc]) => (
                      <div key={title} style={{ marginTop: '16px' }}>
                        <p style={{
                          fontFamily: 'Inter, system-ui', fontSize: '14px',
                          fontWeight: 500, color: '#E8EAE9', margin: '0 0 4px',
                        }}>
                          → {title}
                        </p>
                        <p style={{
                          fontFamily: 'Inter, system-ui', fontSize: '13px',
                          color: '#8A9E98', margin: 0, lineHeight: 1.6,
                        }}>
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* M8 — Urgencia natural */}
              <div style={{ marginBottom: '48px' }}>
                <p style={{
                  fontFamily: 'Inter, system-ui', fontSize: '14px',
                  lineHeight: 1.65, color: '#8A9E98', margin: '0 0 8px',
                }}>
                  Tu mapa está guardado en tu página personal. Evoluciona con el tiempo — cada semana hay algo nuevo.
                </p>
                <p style={{
                  fontFamily: 'Inter, system-ui', fontSize: '14px',
                  lineHeight: 1.65, color: '#6B7572', margin: '0 0 12px',
                }}>
                  Cada semana sin regulación, tu cuerpo profundiza el patrón actual. No es opinión — es lo que confirman los datos de +5.000 personas. Cuanto antes, más rápida la recuperación.
                </p>
                <p style={{
                  fontFamily: 'Inter, system-ui', fontSize: '12px',
                  color: '#3d5048', margin: 0,
                }}>
                  142 personas completaron este diagnóstico esta semana · 5.247 en total
                </p>
              </div>

              {/* Compartir + Descarga */}
              <div style={{ marginBottom: '64px' }}>
                <p style={{
                  fontFamily: 'Inter, system-ui', fontSize: '14px',
                  color: '#8A9E98', margin: '0 0 16px',
                }}>
                  ¿Conoces a alguien que podría necesitar ver su mapa?
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button className="ghost-btn" onClick={handleShare}>
                    <span>↗</span> Enviar el diagnóstico
                  </button>
                  <button className="ghost-btn" onClick={handleDownloadPNG}>
                    <span>↓</span> Descargar mi mapa
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ── FOOTER ── */}
          <div style={{
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center',
          }}>
            {lastVisitedAt && (
              <p style={{
                fontFamily: 'Inter, system-ui', fontSize: '12px',
                color: '#3d5048', margin: '0 0 8px',
              }}>
                Última visita: {relativeTime(lastVisitedAt)}
              </p>
            )}
            <p style={{
              fontFamily: 'Inter, system-ui', fontSize: '12px',
              color: '#3d5048', lineHeight: 1.6, margin: 0,
            }}>
              Este mapa es tuyo. Evoluciona con el tiempo.<br />
              Confidencial — solo esta URL tiene acceso a tu diagnóstico.
            </p>
          </div>

        </div>
      </main>

      {/* Toast compartir */}
      {shareToast && (
        <div className="toast">{shareToast}</div>
      )}
    </>
  )
}
