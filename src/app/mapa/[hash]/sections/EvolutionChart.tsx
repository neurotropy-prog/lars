'use client'

/**
 * EvolutionChart.tsx — Mini-gráfica de evolución de scores
 *
 * Gráfica de líneas minimalista mostrando el score global
 * en cada punto de reevaluación (Día 0, Día 30, Día 90...).
 * Solo aparece cuando hay al menos 1 reevaluación completada.
 * Renderizada con canvas para control total del estilo.
 */

import { useEffect, useRef } from 'react'
import type { ReevaluationEntry } from '@/lib/map-evolution'

interface DataPoint {
  day: number
  score: number
  label: string
}

interface Props {
  globalScore: number
  reevaluations: ReevaluationEntry[]
}

export default function EvolutionChart({
  globalScore,
  reevaluations,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Solo mostrar si hay al menos 1 reevaluación
  if (reevaluations.length === 0) return null

  const points: DataPoint[] = [
    { day: 0, score: globalScore, label: 'Día 0' },
    ...reevaluations.map((r) => ({
      day: r.day,
      score: r.scores.global,
      label: `Día ${r.day}`,
    })),
  ]

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth
    const H = 160
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    // Resolve CSS custom properties for canvas
    const styles = getComputedStyle(canvas)
    const accentColor = styles.getPropertyValue('--color-accent').trim() || '#CD796C'
    const successColor = styles.getPropertyValue('--color-success').trim() || '#3D9A5F'
    const textColor = styles.getPropertyValue('--color-text-primary').trim() || '#212426'

    // Clear
    ctx.clearRect(0, 0, W, H)

    const pad = { top: 30, right: 20, bottom: 32, left: 40 }
    const plotW = W - pad.left - pad.right
    const plotH = H - pad.top - pad.bottom

    // Scale
    const maxDay = Math.max(...points.map((p) => p.day), 30)
    const minScore = Math.max(0, Math.min(...points.map((p) => p.score)) - 10)
    const maxScore = Math.min(100, Math.max(...points.map((p) => p.score)) + 10)

    const xScale = (day: number) => pad.left + (day / maxDay) * plotW
    const yScale = (score: number) =>
      pad.top + plotH - ((score - minScore) / (maxScore - minScore)) * plotH

    // Grid lines (horizontal)
    ctx.strokeStyle = 'rgba(38,66,51,0.06)'
    ctx.lineWidth = 1
    for (let s = Math.ceil(minScore / 20) * 20; s <= maxScore; s += 20) {
      const y = yScale(s)
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(W - pad.right, y)
      ctx.stroke()

      // Label
      ctx.fillStyle = 'rgba(38,66,51,0.25)'
      ctx.font = '10px system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(String(s), pad.left - 6, y + 3)
    }

    // Line
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.beginPath()
    points.forEach((p, i) => {
      const x = xScale(p.day)
      const y = yScale(p.score)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Gradient fill under line
    const gradient = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom)
    gradient.addColorStop(0, 'rgba(205,121,108,0.15)')
    gradient.addColorStop(1, 'rgba(205,121,108,0.0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    points.forEach((p, i) => {
      const x = xScale(p.day)
      const y = yScale(p.score)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.lineTo(xScale(points[points.length - 1].day), H - pad.bottom)
    ctx.lineTo(xScale(points[0].day), H - pad.bottom)
    ctx.closePath()
    ctx.fill()

    // Points + labels
    points.forEach((p, i) => {
      const x = xScale(p.day)
      const y = yScale(p.score)

      // Point
      ctx.fillStyle = i === 0 ? accentColor : successColor
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Outer ring
      ctx.strokeStyle = i === 0 ? 'rgba(205,121,108,0.3)' : 'rgba(61,154,95,0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, Math.PI * 2)
      ctx.stroke()

      // Score label above point
      ctx.fillStyle = textColor
      ctx.font = '600 12px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(p.score), x, y - 14)

      // Day label below
      ctx.fillStyle = 'rgba(38,66,51,0.4)'
      ctx.font = '10px system-ui, sans-serif'
      ctx.fillText(p.label, x, H - pad.bottom + 16)
    })

    // Benchmark line at 72
    if (maxScore >= 72) {
      const y72 = yScale(72)
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = 'rgba(61,154,95,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pad.left, y72)
      ctx.lineTo(W - pad.right, y72)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = 'rgba(61,154,95,0.5)'
      ctx.font = '10px system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('Objetivo: 72', W - pad.right - 60, y72 - 5)
    }
  }, [points])

  return (
    <div
      className="mapa-fade-up"
      style={{
        marginBottom: 'var(--space-6)',
        padding: 'var(--space-5)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-secondary)',
        border: 'var(--border-subtle)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-host-grotesk)',
          fontSize: 'var(--text-overline)',
          letterSpacing: 'var(--ls-overline)',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          margin: '0 0 var(--space-3) 0',
        }}
      >
        Tu evolución
      </p>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '160px',
          display: 'block',
        }}
      />
    </div>
  )
}
