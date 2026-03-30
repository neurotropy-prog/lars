'use client'

/**
 * TensionSection — Sección TENSIÓN (El coste de no saber).
 * 3 cards con stagger animation al entrar en viewport.
 * Copy exacto de FEATURE_LANDING_DESIGN.md.
 */

import { useRef, useEffect, useState } from 'react'

const cards = [
  {
    headline: 'El 73% de ejecutivos con burnout no saben que lo tienen.',
    body: 'Confunden el agotamiento con "una mala racha" y pierden meses — a veces años — mientras su biología se deteriora.',
  },
  {
    headline: 'Un sistema nervioso desregulado pierde entre 12 y 15 horas semanales de rendimiento real.',
    body: 'No en tiempo — en calidad de decisiones, en paciencia, en energía para lo que importa.',
  },
  {
    headline: 'El burnout no se arregla con vacaciones.',
    body: 'Si tu cortisol no baja, tu sueño no se repara y tu sistema no se regula, dos semanas en la playa son un parche. Vuelves y en 72 horas estás igual.',
  },
]

export default function TensionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    const el = sectionRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="El coste de no saber"
      style={{
        paddingTop: 'var(--space-4)',
        paddingBottom: 'var(--space-16)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      <div
        className="tension-grid"
        style={{
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              background: 'var(--color-bg-tertiary)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: `opacity 400ms ease ${index * 150}ms, transform 400ms ease ${index * 150}ms`,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-inter-tight)',
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--lh-body)',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              {card.headline}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
