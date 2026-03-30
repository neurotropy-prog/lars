'use client'

/**
 * ReliefSection — Sección ALIVIO + Footer mínimo.
 * CTA que hace scroll suave a P1 y emite evento para el pulse.
 * Dato colectivo fijo: "142 personas" (Fase 1 — se conecta a Supabase en Fase 8).
 */

export default function ReliefSection() {
  const handleCTA = () => {
    const p1 = document.getElementById('p1-section')
    if (p1) {
      p1.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Pequeño delay para que el scroll termine antes del pulse
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('scrollToP1'))
      }, 600)
    }
  }

  return (
    <>
      <section
        aria-label="Qué mide el diagnóstico"
        style={{
          paddingTop: 'var(--space-4)',
          paddingBottom: 'var(--space-20)',
          paddingLeft: 'var(--container-padding-mobile)',
          paddingRight: 'var(--container-padding-mobile)',
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
          {/* Headline — callback al SHOCK de apertura */}
          <h2
            style={{
              fontFamily: 'var(--font-inter-tight)',
              fontSize: 'var(--text-h3)',
              lineHeight: 'var(--lh-h3)',
              letterSpacing: 'var(--ls-h3)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-5)',
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
            }}
          >
            Este diagnóstico cruza tus respuestas con datos de más de 25.000 evaluaciones
            reales para mostrarte el estado de 5 dimensiones clave: regulación nerviosa,
            calidad de sueño, claridad cognitiva, equilibrio emocional y alegría de vivir.
            No es un test genérico&nbsp;— es un mapa calibrado para ti.
          </p>

          {/* Credenciales */}
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-caption)',
              lineHeight: 'var(--lh-caption)',
              letterSpacing: 'var(--ls-caption)',
              color: 'var(--color-text-tertiary)',
              marginBottom: 'var(--space-5)',
            }}
          >
            Diseñado por el Dr. Carlos Alvear López&nbsp;·&nbsp;Mind-Body Medicine,
            Harvard&nbsp;·&nbsp;+25.000 sistemas nerviosos analizados&nbsp;·&nbsp;+20 años
          </p>

          {/* Dato colectivo */}
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              lineHeight: 'var(--lh-body-sm)',
              color: 'var(--color-text-tertiary)',
              marginBottom: 'var(--space-10)',
            }}
          >
            142 personas completaron este diagnóstico esta semana.
          </p>

          {/* CTA */}
          <button
            onClick={handleCTA}
            aria-label="Volver al inicio para empezar el diagnóstico"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-body-sm)',
              lineHeight: 1,
              fontWeight: 500,
              color: 'var(--color-text-inverse)',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '16px 36px',
              cursor: 'pointer',
              transition: 'background var(--transition-base)',
              marginBottom: 'var(--space-3)',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-accent-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-accent)'
            }}
          >
            Empezar mi diagnóstico
          </button>

          {/* Disuelve fricción */}
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-caption)',
              lineHeight: 'var(--lh-caption)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Tu resultado es confidencial. No compartimos datos con terceros.
          </p>
        </div>
      </section>

      {/* Footer mínimo */}
      <footer
        style={{
          background: 'var(--color-bg-primary)',
          borderTop: 'var(--border-subtle)',
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-6)',
          paddingLeft: 'var(--container-padding-mobile)',
          paddingRight: 'var(--container-padding-mobile)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--lh-caption)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          Instituto Epigenético&nbsp;·&nbsp;
          <a
            href="/privacidad"
            style={{
              color: 'var(--color-text-tertiary)',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Política de privacidad
          </a>
          &nbsp;·&nbsp;
          <a
            href="/legal"
            style={{
              color: 'var(--color-text-tertiary)',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Aviso legal
          </a>
        </p>
      </footer>
    </>
  )
}
