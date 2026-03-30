/**
 * SocialProofSection — Sección PRUEBA SOCIAL.
 * Testimonios en formato minimalista. Sin fotos. Cargo + edad.
 * IMPORTANTE: Estos son PLANTILLA. Javier debe sustituirlos por testimonios
 * reales adaptados de sus consultas (pendiente de decisión en PROGRESS.md).
 */

const testimonials = [
  {
    quote: 'En 3 minutos entendí lo que llevaba 2 años sin ver.',
    author: 'Director de operaciones, 47 años',
  },
  {
    quote:
      'Pensaba que era estrés normal. El mapa me mostró que mi sistema nervioso llevaba meses en modo alarma.',
    author: 'CEO, 52 años',
  },
  {
    quote: 'Lo hice por curiosidad. Los resultados me cambiaron la conversación conmigo mismo.',
    author: 'Socia fundadora, 39 años',
  },
]

export default function SocialProofSection() {
  return (
    <section
      aria-label="Testimonios"
      style={{
        paddingTop: 'var(--space-4)',
        paddingBottom: 'var(--space-16)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      {/* Aviso PLANTILLA — solo visible en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            background: 'rgba(250, 204, 21, 0.1)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-6)',
            maxWidth: '680px',
            margin: '0 auto var(--space-6)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-warning)',
              textAlign: 'center',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            ⚠ PLANTILLA — Pendiente de testimonios reales de Javier
          </p>
        </div>
      )}

      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
      >
        {testimonials.map((t, index) => (
          <blockquote
            key={index}
            style={{
              background: 'var(--color-bg-tertiary)',
              borderLeft: '3px solid rgba(198, 200, 238, 0.4)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              padding: 'var(--space-5) var(--space-6)',
              margin: 0,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--lh-body)',
                fontStyle: 'italic',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <cite
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--lh-body-sm)',
                fontStyle: 'normal',
                color: 'var(--color-text-secondary)',
              }}
            >
              — {t.author}
            </cite>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
