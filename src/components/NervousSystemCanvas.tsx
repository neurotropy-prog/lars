'use client'

/**
 * NervousSystemCanvas — React wrapper for the Canvas 2D nervous system engine.
 *
 * Renders a fixed full-viewport canvas (z-index: 51, above bloque overlays)
 * that displays the living nervous system background.
 * Bridges React Context (state/score) to the engine via useEffect.
 */

import { useRef, useEffect } from 'react'
import { useNervousSystem } from '@/contexts/NervousSystemContext'
import { NervousSystemEngine } from '@/lib/nervous-system-engine'

export default function NervousSystemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<NervousSystemEngine | null>(null)
  const { state, score } = useNervousSystem()

  // Initialize engine on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new NervousSystemEngine(canvas)
    engineRef.current = engine

    // Resize handler
    const handleResize = () => {
      engine.resize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      engine.destroy()
      engineRef.current = null
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Forward state/score changes to engine
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    engine.transitionTo(state, score ?? undefined)
  }, [state, score])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 51,
        pointerEvents: 'none',
      }}
    />
  )
}
