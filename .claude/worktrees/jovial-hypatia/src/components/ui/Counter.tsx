'use client'

/**
 * Counter — Número animado de 0 → target con ease-out-expo.
 * Se dispara cuando entra en viewport (IntersectionObserver).
 * Reutilizable en: MicroEspejo (%), Bisagra (score), ReliefSection (142).
 *
 * A-05, A-06, A-10, A-15
 */

import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  /** Valor de inicio (default 0) */
  from?: number
  /** Valor final a mostrar */
  to: number
  /** Duración total de la animación en ms (default 1200) */
  duration?: number
  /** Texto añadido ANTES del número (ej: "El ") */
  prefix?: string
  /** Texto añadido DESPUÉS del número (ej: "%", "/100") */
  suffix?: string
  /** Delay en ms antes de empezar a contar tras entrar en viewport */
  startDelay?: number
  /** Clase CSS extra */
  className?: string
}

/** Curva ease-out-expo: rápida al inicio, frena al llegar */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export default function Counter({
  from = 0,
  to,
  duration = 1200,
  prefix = '',
  suffix = '',
  startDelay = 0,
  className,
}: CounterProps) {
  const [value, setValue] = useState(from)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number>(0)

  /* ─── IntersectionObserver: dispara cuando el elemento entra en viewport ─── */
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          observer.disconnect()
          // Delay antes de empezar (para sincronizar con animaciones de fade-in)
          const t = setTimeout(() => setStarted(true), startDelay)
          return () => clearTimeout(t)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started, startDelay])

  /* ─── requestAnimationFrame: anima el número ─── */
  useEffect(() => {
    if (!started) return

    const startTime = performance.now()
    const range = to - from

    function update(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      setValue(Math.round(from + range * easeOutExpo(t)))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(update)
      }
    }

    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started, from, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{value}{suffix}
    </span>
  )
}
