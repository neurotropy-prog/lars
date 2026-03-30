'use client'

/**
 * MirrorSection — Sección ESPEJO (Normalización).
 * A-15: scroll reveal con IntersectionObserver.
 */

import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function MirrorSection() {
  const ref = useScrollReveal<HTMLElement>(0.15)

  return (
    <section
      ref={ref}
      className="scroll-reveal"
      aria-label="Normalización"
      style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-inter-tight)',
            fontSize: 'var(--text-h3)',
            lineHeight: 'var(--lh-h3)',
            letterSpacing: 'var(--ls-h3)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
          }}
        >
          Lo que sientes tiene nombre. Y tiene solución.
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--text-max-width)',
          }}
        >
          No es falta de voluntad. No es que &ldquo;no puedas con todo.&rdquo; Es un
          sistema nervioso que lleva meses&nbsp;— quizá años&nbsp;— en modo alarma. Y cuando
          eso pasa, tu sueño se rompe, tus decisiones se nublan, tu paciencia desaparece y tu
          energía no vuelve por mucho que descanses. No estás roto. Tu biología está
          respondiendo exactamente como debería ante una carga que ya no puede sostener.
        </p>
      </div>
    </section>
  )
}
