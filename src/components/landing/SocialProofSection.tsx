'use client'

/**
 * SocialProofSection — Sección PRUEBA SOCIAL.
 * Cards pastel diferenciadas (lavanda, crema, lima) con comillas decorativas y badges.
 * Headline con overline. Stagger 200ms.
 * IMPORTANTE: Textos son PLANTILLA — pendiente de testimonios reales de Javier.
 */

import { useRef, useEffect, useState } from 'react'

const testimonials: { quote: string; author: string; bg: string; border?: string }[] = [
  {
    quote: 'Creía que necesitaba más disciplina. En 3 minutos descubrí que necesitaba regulación.',
    author: 'Director de operaciones, 47',
    bg: 'var(--color-surface-lavender)',
  },
  {
    quote: 'No le conté a nadie que lo hice. Los datos me explicaron lo que yo no quería ver.',
    author: 'CEO, 52',
    bg: 'var(--color-surface-cream)',
    border: '1px solid rgba(30, 19, 16, 0.08)',
  },
  {
    quote: 'Lo hice por curiosidad científica. Los resultados me desarmaron.',
    author: 'Socia fundadora, 39',
    bg: 'var(--color-surface-lime)',
  },
]

export default function SocialProofSection() {
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

  return (
    <section
      ref={sectionRef}
      aria-label="Testimonios"
      style={{
        paddingTop: 'var(--space-8)',
        paddingBottom: 'var(--space-16)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Overline */}
        <p
          className="overline-accent"
          style={{
            textAlign: 'center',
            opacity: visible ? 1 : 0,
            transition: 'opacity 500ms var(--ease-out-expo)',
          }}
        >
          PRUEBA SOCIAL
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h2)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginBottom: 'var(--space-10)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 500ms var(--ease-out-expo) 100ms, transform 500ms var(--ease-out-expo) 100ms',
          }}
        >
          Lo que dicen quienes ya pasaron por aquí.
        </h2>

        {/* Testimonial cards */}
        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div
              key={index}
              style={{
                background: t.bg,
                border: t.border || '1px solid rgba(30, 19, 16, 0.08)',
                borderRadius: '20px',
                padding: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(20px)',
                transition: `opacity 500ms var(--ease-out-expo) ${200 + index * 200}ms,
                             transform 500ms var(--ease-out-expo) ${200 + index * 200}ms`,
              }}
            >
              {/* Icono comillas — círculo 40px */}
              <div
                aria-hidden="true"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(30, 19, 16, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  flexShrink: 0,
                }}
              >
                &ldquo;&rdquo;
              </div>

              {/* Cita */}
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 'var(--lh-body)',
                  color: 'var(--color-text-primary)',
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Badge pill oscuro */}
              <span
                style={{
                  display: 'inline-block',
                  alignSelf: 'flex-start',
                  backgroundColor: 'var(--color-text-secondary)',
                  color: 'var(--color-text-inverse)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 16px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 500,
                }}
              >
                {t.author}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
