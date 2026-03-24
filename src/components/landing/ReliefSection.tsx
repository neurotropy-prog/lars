'use client'

/**
 * ReliefSection — Sección ALIVIO.
 * Overline + headline Lora + card de credenciales + counter colectivo + CTA lima.
 * Footer extraído a componente separado.
 */

import { useRef, useEffect, useState } from 'react'
import Counter from '@/components/ui/Counter'

export default function ReliefSection() {
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
      { threshold: 0.1 }
    )
    const el = sectionRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleCTA = () => {
    const p1 = document.getElementById('p1-section')
    if (p1) {
      p1.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('scrollToP1'))
      }, 600)
    }
  }

  const stagger = (delayMs: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 600ms var(--ease-out-expo) ${delayMs}ms, transform 600ms var(--ease-out-expo) ${delayMs}ms`,
  })

  return (
    <section
      ref={sectionRef}
      aria-label="Qué mide el análisis"
      style={{
        paddingTop: 'var(--space-8)',
        paddingBottom: 'var(--space-20)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Overline */}
        <p className="overline-accent" style={stagger(0)}>
          EL ANÁLISIS
        </p>

        {/* Headline — Lora Regular, --text-h2 */}
        <h2
          style={{
            fontFamily: 'var(--font-lora)',
            fontSize: 'var(--text-h2)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-5)',
            ...stagger(100),
          }}
        >
          3 minutos para entender lo que tu cuerpo lleva meses intentando decirte.
        </h2>

        {/* Descripción */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--text-max-width)',
            marginBottom: 'var(--space-8)',
            ...stagger(200),
          }}
        >
          Este análisis cruza tus respuestas con datos de más de 25.000 evaluaciones
          reales para mostrarte el estado de 5 dimensiones clave: regulación nerviosa,
          calidad de sueño, claridad cognitiva, equilibrio emocional y alegría de vivir.
          No es un test genérico&nbsp;— es un mapa calibrado para ti.
        </p>

        {/* Card de credenciales */}
        <div
          style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: '20px',
            padding: 'var(--space-6) var(--space-8)',
            width: '100%',
            maxWidth: '720px',
            marginBottom: 'var(--space-6)',
            ...stagger(300),
          }}
        >
          <div className="credentials-grid">
            {/* Stat 1: Harvard + foto doctor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <img
                src="/carlos-460x655.jpg"
                alt="Dr. Carlos Alvear López"
                width={52}
                height={52}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  flexShrink: 0,
                  border: '2px solid rgba(30, 19, 16, 0.08)',
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  Harvard
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 'var(--text-body-sm)',
                    lineHeight: 'var(--lh-body-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Dr. Carlos Alvear López
                </p>
              </div>
            </div>

            {/* Stat 2: +25.000 */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-lora)',
                  fontSize: 'var(--text-h3)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  lineHeight: 1.2,
                  marginBottom: 'var(--space-1)',
                }}
              >
                {visible ? <Counter from={0} to={25000} duration={1200} prefix="+" /> : '+0'}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--lh-body-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                sistemas nerviosos analizados
              </p>
            </div>

            {/* Stat 3: +20 años */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-lora)',
                  fontSize: 'var(--text-h3)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  lineHeight: 1.2,
                  marginBottom: 'var(--space-1)',
                }}
              >
                {visible ? <Counter from={0} to={20} duration={800} prefix="+" /> : '+0'}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'var(--text-body-sm)',
                  lineHeight: 'var(--lh-body-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                años de práctica clínica
              </p>
            </div>
          </div>
        </div>

        {/* Dato colectivo — counter animado */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-12)',
            ...stagger(400),
          }}
        >
          {visible ? <Counter to={142} duration={800} /> : '0'}
          {' '}personas completaron este análisis esta semana.
        </p>

        {/* CTA LIMA */}
        <button
          onClick={handleCTA}
          aria-label="Volver al inicio para empezar el análisis"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body)',
            lineHeight: 1,
            fontWeight: 500,
            color: 'var(--color-cta-text)',
            background: 'var(--color-cta)',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '16px 36px',
            cursor: 'pointer',
            transition: `opacity 600ms var(--ease-out-expo) 500ms, transform 600ms var(--ease-out-expo) 500ms, box-shadow var(--transition-base), background var(--transition-base)`,
            marginBottom: 'var(--space-4)',
            minHeight: '52px',
            opacity: visible ? 1 : 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-cta-hover)'
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 245, 100, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-cta)'
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Empezar mi análisis &rarr;
        </button>

        {/* Disuelve fricción */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--lh-caption)',
            color: 'var(--color-text-tertiary)',
            ...stagger(600),
          }}
        >
          Tu resultado es confidencial. No compartimos datos con terceros.
        </p>
      </div>
    </section>
  )
}
