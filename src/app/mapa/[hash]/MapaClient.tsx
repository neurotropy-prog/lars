'use client'

/**
 * MapaClient.tsx — El mapa vivo personal (Client Component)
 *
 * 4-Zone Architecture (v3 Redesign):
 *   ZONA 1 — TU ESTADO: Score + badge + relativeTime (always top)
 *   ZONA 2 — TU FOCO: FocusBanner (return visits only)
 *   ZONA 3 — TU MAPA COMPLETO: dimensions + evolution sections
 *   ZONA 4 — TU CAMINO: first step + timeline + CTA + Stripe
 *
 * First visit (!lastVisitedAt):
 *   Progressive reveal: 0s score → 2-6s dims → 7s priority → 8s step → 9.5s Zona 4
 *
 * Return visit (lastVisitedAt exists):
 *   Score visible immediately. FocusBanner shows focus. Everything visible.
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { DimensionResult, DimensionKey } from '@/lib/insights'
import { getScoreColor, getScoreLabel } from '@/lib/insights'
import type { EvolutionState, ReevaluationScores, ReevaluationEntry } from '@/lib/map-evolution'
import type { ArchetypeData } from '@/lib/content/archetypes'
import type { SubdimensionConfig } from '@/lib/content/subdimensions'
import type { BookExcerptData } from '@/lib/content/book-excerpts'

// Secciones de evolución
import DimensionCard from './sections/DimensionCard'
import EvolutionChart from './sections/EvolutionChart'
import EvolutionArchetype from './sections/EvolutionArchetype'
import EvolutionSession from './sections/EvolutionSession'
import EvolutionSubdimensions from './sections/EvolutionSubdimensions'
import EvolutionBookExcerpt from './sections/EvolutionBookExcerpt'
import EvolutionReevaluation from './sections/EvolutionReevaluation'
import FocusBanner, { selectFocus } from './sections/FocusBanner'
import MapaAccordion, { type AccordionSection } from './sections/MapaAccordion'
import AspiracionalTimeline from './sections/AspiracionalTimeline'

// Personal action components
import PersonalNote from '@/components/mapa/PersonalNote'
import PersonalVideo from '@/components/mapa/PersonalVideo'
import ExpressSessionOffer from '@/components/mapa/ExpressSessionOffer'

// AMPLIFY
import AmplifyInviteModal from '@/components/amplify/AmplifyInviteModal'
// AmplifyAcceptBanner removed — comparisons are now auto-accepted at gateway completion

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface PersonalActionData {
  type: string
  content: string
  created_at: string
  notify_lead?: boolean
}

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
  personalActions?: PersonalActionData[]
  // AMPLIFY
  amplifyInviteCount: number
  profileCode: string | null
  pendingAmplifyInvite: { invite_hash: string; inviter_initials: string } | null
  activeComparisons?: { compare_hash: string; initials: string }[]
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
  personalActions,
  // AMPLIFY
  amplifyInviteCount,
  profileCode,
  pendingAmplifyInvite,
  activeComparisons = [],
}: Props) {
  const isFirstVisit = !lastVisitedAt
  const searchParams = useSearchParams()
  const isVideoMode = searchParams.get('video') === '1'

  // ── State ──────────────────────────────────────────────────────────────────

  const [displayScore, setDisplayScore] = useState(isFirstVisit ? 0 : global)
  const [visibleDims, setVisibleDims] = useState(isFirstVisit ? -1 : 4)
  const [showPriority, setShowPriority] = useState(!isFirstVisit)
  const [showZona4, setShowZona4] = useState(!isFirstVisit)
  const [shareToast, setShareToast] = useState<string | null>(null)
  // amplifyBannerDismissed state removed — no longer needed (auto-accept)
  const [showAmplifyModal, setShowAmplifyModal] = useState(false)

  // AMPLIFY visibility conditions
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / 86400000
  )
  const meetsTimeRequirement = daysSinceCreation >= 7
  const hasInviteCapacity = amplifyInviteCount < 5
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const rafRef = useRef<number>(0)

  const globalColor = getScoreColor(global)
  const globalLabel = getScoreLabel(global)

  // ── Counter animation (first visit only) ──────────────────────────────────

  useEffect(() => {
    if (!isFirstVisit) {
      setDisplayScore(global)
      return
    }
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
  }, [global, isFirstVisit])

  // ── Progressive reveal (first visit only) ─────────────────────────────────

  useEffect(() => {
    if (!isFirstVisit) {
      setVisibleDims(4)
      setShowPriority(true)
      setShowZona4(true)
      return
    }
    const timers = [
      setTimeout(() => setVisibleDims(0), 2000),
      setTimeout(() => setVisibleDims(1), 3000),
      setTimeout(() => setVisibleDims(2), 4000),
      setTimeout(() => setVisibleDims(3), 5000),
      setTimeout(() => setVisibleDims(4), 6000),
      setTimeout(() => setShowPriority(true), 7000),
      setTimeout(() => setShowZona4(true), 9500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [isFirstVisit])

  // ── Registrar visita + analytics ──────────────────────────────────────────

  useEffect(() => {
    fetch(`/api/mapa/${hash}/visita`, { method: 'PATCH' }).catch(() => {})
  }, [hash])

  // ── Auto-scroll to video when coming from email (?video=1) ──────────────

  useEffect(() => {
    if (!isVideoMode) return
    const timer = setTimeout(() => {
      const el = document.getElementById('personal-video')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 600)
    return () => clearTimeout(timer)
  }, [isVideoMode])

  // ── Stripe Checkout ───────────────────────────────────────────────────────

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

  // ── Compartir (gateway, nunca el mapa personal) ───────────────────────────

  const handleShare = useCallback(() => {
    const gatewayUrl = `${window.location.origin}/`
    navigator.clipboard.writeText(gatewayUrl).then(() => {
      setShareToast('Link copiado — lleva al análisis, no a tu mapa')
      setTimeout(() => setShareToast(null), 3500)
    }).catch(() => {
      setShareToast(gatewayUrl)
      setTimeout(() => setShareToast(null), 5000)
    })
  }, [])

  // ── Descarga PNG (canvas 2D) ──────────────────────────────────────────────

  const handleDownloadPNG = useCallback(() => {
    const dpr = window.devicePixelRatio || 1
    const W = 580, H = 740
    const canvas = document.createElement('canvas')
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#0a252c'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    roundRect(ctx, 1, 1, W - 2, H - 2, 20)
    ctx.stroke()

    ctx.fillStyle = '#c6c8ee'
    ctx.font = '600 11px system-ui, sans-serif'
    ctx.fillText('TU DIAGNÓSTICO · L.A.R.S.©', 40, 52)

    ctx.fillStyle = '#F5F5F0'
    ctx.font = '600 26px system-ui, sans-serif'
    ctx.fillText('Tu Mapa de Regulación', 40, 88)

    ctx.fillStyle = '#6B7572'
    ctx.font = '400 12px system-ui, sans-serif'
    ctx.fillText('Instituto Epigenético · Calibrado con +25.000 evaluaciones', 40, 112)

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
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
    ctx.fillStyle = '#0a252c'
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

      ctx.fillStyle = 'rgba(255,255,255,0.08)'
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
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(40, y + 50)
        ctx.lineTo(W - 40, y + 50)
        ctx.stroke()
      }
    })

    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
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

  // ── Preparar subdimensiones para DimensionCard ────────────────────────────

  const subdimScoresForCard = subdimensionScores && subdimensionConfig
    ? subdimensionConfig.subdimensions.map((sub) => ({
        key: sub.key,
        name: sub.name,
        score: subdimensionScores[sub.key] ?? 50,
      }))
    : null

  // ── Accordion sections (return visits only) ─────────────────────────────

  const accordionSections: AccordionSection[] = []

  if (!isFirstVisit) {
    // "Tu Evaluación" — always present
    accordionSections.push({
      id: 'evaluacion',
      title: 'Tu Evaluación',
      summary: `5 dimensiones · ${global}/100`,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {dimensionResults.map((dim) => {
            const isMostCompromised = dim.key === mostCompromisedKey
            const dimD7Insight = isMostCompromised && evolution.insightD7.unlocked ? d7Insight : null
            const dimD7IsNew = isMostCompromised && evolution.insightD7.isNew
            const dimSubScores = isMostCompromised ? subdimScoresForCard : null
            return (
              <DimensionCard
                key={dim.key}
                dim={dim}
                isMostCompromised={isMostCompromised}
                showPriorityTag={isMostCompromised}
                d7Insight={dimD7Insight}
                d7IsNew={dimD7IsNew}
                subdimensionScores={dimSubScores}
              />
            )
          })}
        </div>
      ),
    })

    // Day 3+ — "Tu Identidad"
    if (evolution.archetype.unlocked && archetype) {
      accordionSections.push({
        id: 'identidad',
        title: 'Tu Identidad',
        summary: archetype.name,
        badge: evolution.archetype.isNew ? 'nuevo' : null,
        children: (
          <EvolutionArchetype
            archetype={archetype}
            isNew={evolution.archetype.isNew}
          />
        ),
      })
    }

    // Day 10+ — "Sesión con Javier"
    if (evolution.session.unlocked) {
      accordionSections.push({
        id: 'sesion',
        title: 'Sesión con Javier',
        summary: evolution.session.booked ? '✓ Agendada' : '20 min gratuitos',
        badge: !evolution.session.booked ? 'pendiente' : 'completado',
        children: (
          <EvolutionSession
            isNew={evolution.session.isNew}
            booked={evolution.session.booked}
            mapHash={hash}
          />
        ),
      })
    }

    // Day 14+ — "Tu Profundidad"
    if (evolution.subdimensions.unlocked && subdimensionConfig) {
      accordionSections.push({
        id: 'profundidad',
        title: 'Tu Profundidad',
        summary: evolution.subdimensions.completed
          ? `${subdimensionConfig.subdimensions.length} subdimensiones`
          : '2 preguntas pendientes',
        badge: !evolution.subdimensions.completed ? 'pendiente' : null,
        children: (
          <EvolutionSubdimensions
            config={subdimensionConfig}
            completed={evolution.subdimensions.completed}
            isNew={evolution.subdimensions.isNew}
            hash={hash}
          />
        ),
      })
    }

    // Day 21+ — "Extracto del libro"
    if (evolution.bookExcerpt.unlocked && bookExcerpt) {
      accordionSections.push({
        id: 'libro',
        title: 'Extracto del libro',
        summary: 'Capítulo personalizado',
        badge: evolution.bookExcerpt.isNew ? 'nuevo' : null,
        children: (
          <EvolutionBookExcerpt
            excerpt={bookExcerpt}
            isNew={evolution.bookExcerpt.isNew}
            worstDimensionName={worstDimensionName}
            worstScore={worstScore}
          />
        ),
      })
    }

    // Day 30+ — "Tu Evolución"
    if (evolution.reevaluation.unlocked || evolution.nextQuarterlyUnlocked) {
      const delta = reevaluationScores
        ? reevaluationScores.global - originalScores.global
        : 0
      accordionSections.push({
        id: 'evolucion',
        title: 'Tu Evolución',
        summary: reevaluations.length > 0
          ? `${reevaluations.length} reevaluación · +${delta} pts`
          : 'Reevaluación disponible',
        badge: (evolution.reevaluation.isNew || evolution.nextQuarterlyUnlocked)
          ? 'nuevo'
          : (!evolution.reevaluation.completed ? 'pendiente' : null),
        children: (
          <>
            <EvolutionChart
              globalScore={global}
              reevaluations={reevaluations}
            />
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
          </>
        ),
      })
    }

    // AMPLIFY — Active comparisons links
    if (activeComparisons.length > 0) {
      accordionSections.push({
        id: 'comparaciones',
        title: activeComparisons.length === 1
          ? 'Tu Comparación'
          : 'Tus Comparaciones',
        summary: activeComparisons.length === 1
          ? `Con ${activeComparisons[0].initials}`
          : `${activeComparisons.length} activas`,
        children: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {activeComparisons.map((comp) => (
              <a
                key={comp.compare_hash}
                href={`/mapa/${hash}/comparar/${comp.compare_hash}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-base)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-inter, system-ui)',
                  fontSize: 'var(--text-body, 1rem)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 500,
                }}>
                  Comparación con {comp.initials}
                </span>
                <span style={{
                  fontFamily: 'var(--font-inter, system-ui)',
                  fontSize: 'var(--text-body-sm, 0.875rem)',
                  color: 'var(--color-accent)',
                  fontWeight: 500,
                }}>
                  Ver →
                </span>
              </a>
            ))}
          </div>
        ),
      })
    }

    // AMPLIFY — "Comparar tu mapa" (≥7 days, ≥1 return visit, <5 invites)
    if (meetsTimeRequirement && hasInviteCapacity) {
      accordionSections.push({
        id: 'amplify',
        title: 'Comparar tu mapa',
        summary: amplifyInviteCount > 0
          ? amplifyInviteCount === 1 ? '1 invitación' : `${amplifyInviteCount} invitaciones`
          : 'Invita a alguien',
        children: (
          <div>
            <p style={{
              fontFamily: 'var(--font-inter, system-ui)',
              fontSize: 'var(--text-body, 1rem)',
              lineHeight: 'var(--lh-body, 1.6)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              maxWidth: '42rem',
            }}>
              ¿Conoces a alguien en tu misma situación — tu pareja, un socio, un amigo?
              Si ambos hacéis el diagnóstico, vuestros mapas se pueden comparar.
              Las brechas compartidas son las más reveladoras.
            </p>
            <Button
              variant="ghost"
              onClick={() => setShowAmplifyModal(true)}
              style={{ marginBottom: 'var(--space-4)' }}
            >
              Invitar a comparar
            </Button>
            <p style={{
              fontFamily: 'var(--font-inter, system-ui)',
              fontSize: 'var(--text-caption, 0.75rem)',
              lineHeight: 'var(--lh-body-sm, 1.5)',
              color: 'var(--color-text-tertiary)',
              fontStyle: 'italic',
            }}>
              &ldquo;Su diagnóstico es confidencial. Solo se compara si ambos aceptáis.&rdquo;
            </p>
          </div>
        ),
      })
    }

    // Disabled teaser rows for upcoming unlocks
    const UNLOCK_SCHEDULE = [
      { key: 'archetype', id: 'identidad', title: 'Tu Identidad', day: 3 },
      { key: 'session', id: 'sesion', title: 'Sesión con Javier', day: 10 },
      { key: 'subdimensions', id: 'profundidad', title: 'Tu Profundidad', day: 14 },
      { key: 'bookExcerpt', id: 'libro', title: 'Extracto del libro', day: 21 },
      { key: 'reevaluation', id: 'evolucion', title: 'Tu Evolución', day: 30 },
    ]
    const daysSince = evolution.daysSinceCreation
    const upcoming = UNLOCK_SCHEDULE
      .filter((u) => u.day > daysSince)
      .slice(0, 2)

    for (const u of upcoming) {
      const daysLeft = u.day - daysSince
      accordionSections.push({
        id: `teaser-${u.id}`,
        title: u.title,
        summary: '',
        disabled: true,
        disabledText: `Disponible en ${daysLeft} día${daysLeft === 1 ? '' : 's'}`,
        children: null,
      })
    }
  }

  // ── Accordion defaultOpenId (from focus logic) ─────────────────────────

  const SCROLL_TO_ACCORDION: Record<string, string> = {
    'section-archetype': 'identidad',
    'section-session': 'sesion',
    'section-subdimensions': 'profundidad',
    'section-book': 'libro',
    'section-reevaluation': 'evolucion',
    'section-dimensions': 'evaluacion',
    'mapa-completo': 'evaluacion',
  }

  let accordionDefaultOpenId = 'evaluacion'
  if (!isFirstVisit && lastVisitedAt) {
    const focus = selectFocus({
      evolution,
      lastVisitedAt,
      archetype,
      d7Insight,
      subdimensionConfig,
      bookExcerpt,
      worstDimensionName,
      worstScore,
      hasPaid,
      hash,
      daysSinceCreation: evolution.daysSinceCreation,
    })
    accordionDefaultOpenId = SCROLL_TO_ACCORDION[focus.scrollTo] ?? 'evaluacion'
  }

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
        @keyframes badgeScaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        .badge-scale-in {
          animation: badgeScaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
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

      <main style={{ minHeight: '100vh', padding: 'calc(var(--header-height, 56px) + var(--space-6)) var(--space-6) var(--space-24)' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>

          {/* ══════════════════════════════════════════════════════════════════
               ZONA 1 — TU ESTADO (always visible, top)
             ══════════════════════════════════════════════════════════════════ */}
          <section id="zona-estado" style={{ marginBottom: 'var(--space-12)' }}>

            {/* Header */}
            <div className="mapa-fade-up" style={{ marginBottom: 'var(--space-10)' }}>
              <p style={{
                fontFamily: 'var(--font-inter-tight)',
                fontSize: 'var(--text-overline)',
                letterSpacing: 'var(--ls-overline)',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: 'var(--space-3)',
              }}>
                Tu análisis
              </p>
              <h1 style={{
                fontFamily: 'var(--font-plus-jakarta)',
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

            {/* Score global */}
            <div className="mapa-fade-up" style={{ animationDelay: '100ms' }}>
              <Card style={{ border: `1px solid ${globalColor}33` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                      <span style={{
                        fontFamily: 'var(--font-plus-jakarta)',
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
                    color: '#0a252c',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-caption)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    marginTop: 'var(--space-1)',
                  }}>
                    {globalLabel}
                  </span>
                </div>

                {/* Reevaluation delta (if exists) */}
                {reevaluationScores && (
                  <div style={{
                    marginTop: 'var(--space-4)',
                    paddingTop: 'var(--space-3)',
                    borderTop: 'var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 'var(--space-2)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-plus-jakarta)',
                      fontSize: 'var(--text-h4)',
                      fontWeight: 600,
                      color: 'var(--color-success)',
                    }}>
                      {originalScores.global} → {reevaluationScores.global}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--color-success)',
                    }}>
                      +{reevaluationScores.global - originalScores.global} puntos
                    </span>
                  </div>
                )}

                {/* relativeTime */}
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-tertiary)',
                  marginTop: 'var(--space-3)',
                }}>
                  Análisis realizado {relativeTime(createdAt)}
                </p>

              </Card>
            </div>

            {/* Personal actions from Javi */}
            {personalActions && personalActions.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                marginTop: 'var(--space-6)',
              }}>
                {personalActions.map((action, i) => {
                  if (action.type === 'personal_note')
                    return <PersonalNote key={`pa-${i}`} content={action.content} createdAt={action.created_at} />
                  if (action.type === 'video')
                    return <PersonalVideo key={`pa-${i}`} id="personal-video" videoUrl={action.content} createdAt={action.created_at} autoPlay={isVideoMode} />
                  if (action.type === 'express_session')
                    return <ExpressSessionOffer key={`pa-${i}`} content={action.content} createdAt={action.created_at} />
                  return null
                })}
              </div>
            )}

          </section>

          {/* AMPLIFY accept banner removed — comparisons are now auto-accepted
             at gateway completion. Active comparisons show in the accordion. */}

          {/* ══════════════════════════════════════════════════════════════════
               ZONA 2 — TU FOCO (return visits only)
             ══════════════════════════════════════════════════════════════════ */}
          {!isFirstVisit && (
            <section id="zona-foco" style={{ marginBottom: 'var(--space-12)' }}>
              <FocusBanner
                evolution={evolution}
                lastVisitedAt={lastVisitedAt!}
                archetype={archetype}
                d7Insight={d7Insight}
                subdimensionConfig={subdimensionConfig}
                bookExcerpt={bookExcerpt}
                worstDimensionName={worstDimensionName}
                worstScore={worstScore}
                hasPaid={hasPaid}
                hash={hash}
                daysSinceCreation={evolution.daysSinceCreation}
              />
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════════
               ZONA 3 — TU MAPA COMPLETO
             ══════════════════════════════════════════════════════════════════ */}
          <section id="mapa-completo" style={{ marginBottom: 'var(--space-12)' }}>

            {/* First visit: dimensions with progressive reveal (outside accordion) */}
            {isFirstVisit && (
              <>
                <div id="section-dimensions" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                  {dimensionResults.map((dim, i) => {
                    if (visibleDims < i) return null

                    const isMostCompromised = dim.key === mostCompromisedKey
                    const showPriorityTag = isMostCompromised && showPriority

                    const dimD7Insight = isMostCompromised && evolution.insightD7.unlocked ? d7Insight : null
                    const dimD7IsNew = isMostCompromised && evolution.insightD7.isNew
                    const dimSubScores = isMostCompromised ? subdimScoresForCard : null

                    return (
                      <DimensionCard
                        key={dim.key}
                        dim={dim}
                        isMostCompromised={isMostCompromised}
                        showPriorityTag={showPriorityTag}
                        d7Insight={dimD7Insight}
                        d7IsNew={dimD7IsNew}
                        subdimensionScores={dimSubScores}
                      />
                    )
                  })}
                </div>

              </>
            )}

            {/* Return visits: accordion with all sections */}
            {!isFirstVisit && (
              <MapaAccordion
                sections={accordionSections}
                defaultOpenId={accordionDefaultOpenId}
              />
            )}

          </section>

          {/* ══════════════════════════════════════════════════════════════════
               ZONA 4 — TU CAMINO (bottom)
             ══════════════════════════════════════════════════════════════════ */}
          <section id="zona-camino" style={{ marginBottom: 'var(--space-12)' }}>

            {/* Timeline aspiracional + CTA contextual */}
            {showZona4 && (
              <AspiracionalTimeline
                score={global}
                hasPaid={hasPaid}
                daysSinceCreation={evolution.daysSinceCreation}
                reevaluationScore={reevaluationScores?.global ?? null}
                onStartWeek1={handleStripeCheckout}
                checkoutLoading={checkoutLoading}
                checkoutError={checkoutError}
                onRetryCheckout={() => { setCheckoutError(null); handleStripeCheckout() }}
              />
            )}

            {/* Compartir + Descarga */}
            {showZona4 && (
              <div className="mapa-fade-up" style={{ marginTop: 'var(--space-8)' }}>
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
                    ↗ Enviar el análisis
                  </Button>
                  <Button variant="secondary" size="small" onClick={handleDownloadPNG}>
                    ↓ Descargar mi mapa
                  </Button>
                </div>
              </div>
            )}

          </section>

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
              Confidencial — solo esta URL tiene acceso a tu análisis.
            </p>
          </div>

        </div>
      </main>

      {shareToast && <div className="mapa-toast">{shareToast}</div>}

      {/* AMPLIFY Modal */}
      <AmplifyInviteModal
        isOpen={showAmplifyModal}
        onClose={() => setShowAmplifyModal(false)}
        hash={hash}
        profileCode={profileCode}
      />
    </>
  )
}
