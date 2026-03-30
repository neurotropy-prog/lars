/**
 * MicroEspejo — Componente de reflexión del gateway.
 *
 * ZONA 2 (reflexión): Cormorant Garamond italic, borde izquierdo acento,
 * fondo transparente (la zona proporciona la atmósfera).
 *
 * Sprint 2: Stagger animation sequence — cada elemento aparece en secuencia:
 *   T+0ms:   Label (controlado por padre con .mirror-stagger-label)
 *   T+150ms: Observación slide-in desde izquierda
 *   T+550ms: Dato colectivo fade-in
 *   T+750ms: Botón (controlado por padre con .mirror-stagger-button)
 *
 * A-06: El primer número del dato colectivo (el %) se anima con Counter.
 *
 * Props opcionales:
 *   intensified — Micro-espejo 2: fondo más oscuro, texto más grande.
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
    <div>
      {/* Observación — Cormorant Garamond italic con borde izquierdo acento */}
      <div
        className="mirror-stagger-observation"
        style={{
          borderLeft: '3px solid var(--color-accent)',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          padding: 'var(--space-6) var(--space-6)',
          marginBottom: 'var(--space-4)',
          backgroundColor: intensified
            ? 'rgba(30, 19, 16, 0.06)'
            : 'transparent',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-host-grotesk)',
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
      </div>

      {/* Dato colectivo — aparece después de la observación */}
      {collectiveData && (
        <p
          className="mirror-stagger-data"
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--lh-body-sm)',
            color: 'var(--color-text-secondary)',
            paddingLeft: 'var(--space-6)',
            marginBottom: 'var(--space-6)',
          }}
        >
          {parsed ? (
            <>
              {parsed.before}
              {/* Counter: empieza a contar 550ms después del mount (cuando el texto se hace visible) */}
              <Counter
                to={parsed.num}
                duration={900}
                startDelay={550}
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
