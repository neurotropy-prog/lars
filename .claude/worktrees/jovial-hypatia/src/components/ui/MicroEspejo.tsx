/**
 * MicroEspejo — Componente de reflexión del gateway.
 *
 * ZONA 2 (reflexión): Cormorant Garamond italic, borde izquierdo acento,
 * fondo bg-secondary. La tipografía es parte de la transición emocional.
 *
 * A-06: El primer número del dato colectivo (el %) se anima con Counter.
 * El texto del dato colectivo hace fade-in 300ms después de la slide-in (400ms).
 *
 * Entra con animación mirror-enter (slide desde izquierda, definida en globals.css).
 *
 * Props opcionales:
 *   intensified — Micro-espejo 2: fondo más oscuro, texto más grande, delay botón mayor.
 */

import Counter from './Counter'

interface MicroEspejoProps {
  /** La observación personalizada — Cormorant Garamond italic */
  observation: string
  /** Dato colectivo de refuerzo (opcional) — primer número se anima */
  collectiveData?: string
  /** Versión intensificada para Micro-espejo 2 */
  intensified?: boolean
}

/**
 * Extrae el primer número de 2+ dígitos del texto.
 * "El 78% de los..." → { before: "El ", num: 78, after: "% de los..." }
 * "De las 89 personas..." → { before: "De las ", num: 89, after: " personas..." }
 */
function parseFirstNumber(
  text: string
): { before: string; num: number; after: string } | null {
  const match = text.match(/^([\s\S]*?)(\d{2,})([\s\S]*)$/)
  if (!match) return null
  return {
    before: match[1],
    num: parseInt(match[2], 10),
    after: match[3],
  }
}

export default function MicroEspejo({
  observation,
  collectiveData,
  intensified = false,
}: MicroEspejoProps) {
  const parsed = collectiveData ? parseFirstNumber(collectiveData) : null

  return (
    <div
      className="mirror-enter"
      style={{
        backgroundColor: intensified
          ? 'rgba(15, 48, 55, 0.92)' /* bg-secondary + overlay oscuro */
          : 'var(--color-bg-secondary)',
        borderLeft: '3px solid var(--color-accent)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        padding: 'var(--space-6) var(--space-6)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {/* Observación — Cormorant Garamond italic */}
      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: intensified ? '1.72rem' : 'var(--text-h3)',
          lineHeight: 'var(--lh-h3)',
          letterSpacing: 'var(--ls-h3)',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          fontStyle: 'italic',
        }}
      >
        {observation}
      </p>

      {/* Dato colectivo — fade-in con delay para que aparezca DESPUÉS de la observación */}
      {collectiveData && (
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-4)',
            /* Aparece 400ms después del slide-in de la observación */
            animation: 'fade-in-quick 300ms ease 400ms both',
          }}
        >
          {parsed ? (
            <>
              {parsed.before}
              {/* Counter: empieza a contar 400ms después (cuando el texto se hace visible) */}
              <Counter
                to={parsed.num}
                duration={900}
                startDelay={400}
              />
              {parsed.after}
            </>
          ) : (
            collectiveData
          )}
        </p>
      )}
    </div>
  )
}
