/**
 * BelowTheFold — Las 4 secciones para quien necesite más antes de responder P1.
 * Fondo: --color-bg-secondary. Transición gradiente desde el hero.
 * Orden: ESPEJO → TENSIÓN → PRUEBA → ALIVIO → Footer
 */

import MirrorSection from './MirrorSection'
import TensionSection from './TensionSection'
import SocialProofSection from './SocialProofSection'
import ReliefSection from './ReliefSection'

export default function BelowTheFold() {
  return (
    <div
      style={{
        background: 'var(--color-bg-secondary)',
        // Fondo ligeramente diferenciado que contrasta con el hero
      }}
    >
      <MirrorSection />
      <TensionSection />
      <SocialProofSection />
      <ReliefSection />
    </div>
  )
}
