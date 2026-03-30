/**
 * HeroSection — Above the fold.
 * Contiene: SVG de fondo, SHOCK, headline, subtítulo, P1 visible, micro-promesas.
 * Mobile-first 375px. Sin botón intermedio antes de P1.
 */

import NervousSystemSVG from './NervousSystemSVG'
import P1Cards from './P1Cards'

export default function HeroSection() {
  return (
    <section
      aria-label="Diagnóstico del sistema nervioso"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        background: 'var(--color-bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-12)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      {/* SVG — detrás del contenido */}
      <NervousSystemSVG />

      {/* Contenido — sobre el SVG */}
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
        {/* SHOCK */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-h4)',
            lineHeight: 'var(--lh-h4)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            maxWidth: '38rem',
            marginBottom: 'var(--space-6)',
          }}
        >
          &ldquo;Tu cuerpo lleva meses hablándote. Esta es la primera vez que alguien te
          traduce lo que dice.&rdquo;
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-plus-jakarta)',
            fontSize: 'var(--text-display)',
            lineHeight: 'var(--lh-display)',
            letterSpacing: 'var(--ls-display)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginBottom: 'var(--space-5)',
          }}
        >
          Descubre en qué estado está tu sistema nervioso
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            maxWidth: '36rem',
            marginBottom: 'var(--space-10)',
          }}
        >
          Un diagnóstico de 3 minutos calibrado con más de 25.000 evaluaciones reales.
          Tu resultado es personal, confidencial y tuyo&nbsp;— con o sin programa.
        </p>

        {/* P1 — visible sin botón previo */}
        <div style={{ width: '100%', marginBottom: 'var(--space-6)' }}>
          <P1Cards />
        </div>

        {/* Micro-promesas */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--lh-caption)',
            letterSpacing: 'var(--ls-caption)',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
          }}
        >
          10 preguntas&nbsp;·&nbsp;3 minutos&nbsp;·&nbsp;Sin registro previo
        </p>
      </div>
    </section>
  )
}
