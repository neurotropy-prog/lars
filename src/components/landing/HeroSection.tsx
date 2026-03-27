'use client'

/**
 * HeroSection — Above the fold.
 * Contiene: SVG de fondo, SHOCK, headline, subtítulo, P1 visible, micro-promesas.
 * Mobile-first 375px. Sin botón intermedio antes de P1.
 *
 * Sprint 3: Staggered reveal sequence.
 * T+400ms SHOCK → T+200ms headline → T+200ms subtitle → T+300ms P1 → stagger cards → micro-promises
 */

import { useState, useEffect } from 'react'
import { useCopy } from '@/lib/copy'
import P1Cards from './P1Cards'

interface HeroSectionProps {
  onP1Select?: (id: string) => void
}

export default function HeroSection({ onP1Select }: HeroSectionProps) {
  const { getCopy } = useCopy()
  // Stagger steps: 0=hidden, 1=shock, 2=headline, 3=subtitle, 4=p1, 5=micropromises
  const [revealStep, setRevealStep] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // T+0ms: SHOCK (inmediato)
    timers.push(setTimeout(() => setRevealStep(1), 0))
    // T+400ms: headline
    timers.push(setTimeout(() => setRevealStep(2), 400))
    // T+600ms: subtitle
    timers.push(setTimeout(() => setRevealStep(3), 600))
    // T+900ms: P1 label + cards
    timers.push(setTimeout(() => setRevealStep(4), 900))
    // T+1850ms: micro-promises
    timers.push(setTimeout(() => setRevealStep(5), 1850))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section
      aria-label="Análisis del sistema nervioso"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        background: 'var(--color-bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 'calc(var(--header-height, 56px) + var(--space-10))',
        paddingBottom: 'var(--space-12)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      {/* Contenido — Canvas nervous system now rendered globally via NervousSystemCanvas */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* SHOCK — primera revelación */}
        <p
          className={`hero-reveal${revealStep >= 1 ? ' hero-animate-fade-in' : ''}`}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.125rem',
            fontStyle: 'italic',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginBottom: 'var(--space-6)',
          }}
        >
          {getCopy('hero.shock')}
        </p>

        {/* Headline */}
        <h1
          className={`hero-reveal${revealStep >= 2 ? ' hero-animate-fade-in-up-fast' : ''}`}
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-display)',
            lineHeight: 'var(--lh-display)',
            letterSpacing: 'var(--ls-display)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginBottom: 'var(--space-5)',
          }}
        >
          {getCopy('hero.headline')}
        </h1>

        {/* Subtítulo */}
        <p
          className={`hero-reveal${revealStep >= 3 ? ' hero-animate-fade-in' : ''}`}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            maxWidth: '36rem',
            marginBottom: 'var(--space-6)',
          }}
        >
          {getCopy('hero.subtitle')}
        </p>

        {/* P1 — visible sin botón previo */}
        <div style={{ width: '100%', marginBottom: 'var(--space-6)' }}>
          <P1Cards onSelect={onP1Select} animateEntrance={revealStep >= 4} />
        </div>

        {/* Micro-promesas */}
        <p
          className={`hero-reveal${revealStep >= 5 ? ' hero-animate-fade-in' : ''}`}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--lh-caption)',
            letterSpacing: 'var(--ls-caption)',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
          }}
        >
          {getCopy('hero.micropromises')}
        </p>
      </div>
    </section>
  )
}
