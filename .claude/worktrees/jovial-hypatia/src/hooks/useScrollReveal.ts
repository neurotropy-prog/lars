import { useEffect, useRef } from 'react'

/**
 * useScrollReveal — Añade la clase 'scroll-visible' cuando el elemento
 * entra en el viewport. Solo ocurre UNA vez (disconnect tras disparar).
 *
 * El elemento debe tener la clase 'scroll-reveal' en globals.css para
 * que la transición CSS funcione.
 *
 * A-03, A-15
 *
 * @param threshold - Fracción del elemento que debe ser visible (default 0.15)
 */
export function useScrollReveal<T extends HTMLElement>(
  threshold = 0.15
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Si ya es visible (e.g. above the fold), activar inmediatamente
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('scroll-visible')
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
