'use client'

/**
 * MirrorSection — Sección ESPEJO (Normalización).
 * Rediseño editorial: overline + headline Lora + separador + frase impacto + párrafos fragmentados.
 * Animación stagger escalonada al entrar en viewport.
 */

import { useRef, useEffect, useState } from 'react'
import { useCopy } from '@/lib/copy'

export default function MirrorSection() {
  const { getCopy } = useCopy()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    const el = sectionRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stagger = (delayMs: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 600ms var(--ease-out-expo) ${delayMs}ms, transform 600ms var(--ease-out-expo) ${delayMs}ms`,
  })

  return (
    <section
      ref={sectionRef}
      aria-label="Normalización"
      style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Overline */}
        <p className="overline-accent" style={stagger(0)}>
          {getCopy('mirror.overline')}
        </p>

        {/* Headline — Lora Bold, --text-h2 */}
        <h2
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h2)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
            ...stagger(150),
          }}
        >
          {getCopy('mirror.headline')}
        </h2>

        {/* Separador sutil — 60px centrado */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'var(--color-surface-subtle)',
            margin: '0 auto',
            marginBottom: 'var(--space-6)',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform 600ms var(--ease-out-expo) 300ms`,
          }}
        />

        {/* Frase de impacto aislada — Lora italic, --text-h4 */}
        <p
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h4)',
            lineHeight: 1.35,
            fontStyle: 'italic',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
            ...stagger(450),
          }}
        >
          {getCopy('mirror.impact')}
        </p>

        {/* Párrafo 1 — explicación concreta */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-5)',
            maxWidth: 'var(--text-max-width)',
            ...stagger(600),
          }}
        >
          {getCopy('mirror.body1')}
        </p>

        {/* Párrafo 2 — reframe biológico */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--text-max-width)',
            ...stagger(750),
          }}
        >
          {getCopy('mirror.body2')}
        </p>

        {/* Pull-quote — cierre emocional */}
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'var(--text-h4)',
            lineHeight: 1.5,
            fontStyle: 'italic',
            color: 'var(--color-accent)',
            borderLeft: '3px solid var(--color-accent)',
            paddingLeft: 'var(--space-5)',
            marginTop: 'var(--space-8)',
            ...stagger(900),
          }}
        >
          {getCopy('mirror.pullquote')}
        </p>
      </div>
    </section>
  )
}
