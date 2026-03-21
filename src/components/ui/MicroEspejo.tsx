/**
 * MicroEspejo — Componente de reflexión del gateway.
 *
 * ZONA 2 (reflexión): Cormorant Garamond italic, borde izquierdo verde,
 * fondo bg-secondary. La tipografía es parte de la transición emocional.
 *
 * Entra con animación slide-from-left (mirror-enter en globals.css).
 */

interface MicroEspejoProps {
  /** La observación personalizada — Cormorant Garamond italic */
  observation: string
  /** Dato colectivo de refuerzo (opcional) — Inter body-sm secondary */
  collectiveData?: string
}

export default function MicroEspejo({
  observation,
  collectiveData,
}: MicroEspejoProps) {
  return (
    <div
      className="mirror-enter"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderLeft: '3px solid var(--color-accent)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        padding: 'var(--space-6) var(--space-6)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {/* Observación — Cormorant Garamond italic, tamaño h3 */}
      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'var(--text-h3)',
          lineHeight: 'var(--lh-h3)',
          letterSpacing: 'var(--ls-h3)',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          fontStyle: 'italic',
        }}
      >
        {observation}
      </p>

      {/* Dato colectivo — Inter body-sm secondary */}
      {collectiveData && (
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-4)',
          }}
        >
          {collectiveData}
        </p>
      )}
    </div>
  )
}
