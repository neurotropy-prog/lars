/**
 * NervousSystemSVG
 * Ilustración abstracta del sistema nervioso — líneas fluidas conectando nodos.
 * No anatómica. Orgánica, editorial.
 * Animación CSS: pulso suave 3s. Respeta prefers-reduced-motion.
 */
export default function NervousSystemSVG() {
  return (
    <svg
      viewBox="0 0 375 600"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        maxHeight: 'none',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .nerve-group {
            animation: nervePulse 3s ease-in-out infinite;
          }
        }
        .nerve-group {
          opacity: 0.28;
        }
      `}</style>

      <g
        className="nerve-group"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1"
        strokeLinecap="round"
      >
        {/* ---- Connections (cubic bezier paths) ---- */}

        {/* N1 → N2 */}
        <path d="M 187,65 C 158,90 132,122 108,155" />
        {/* N1 → N3 */}
        <path d="M 187,65 C 212,88 240,116 266,145" />

        {/* N2 → N4 */}
        <path d="M 108,155 C 97,185 82,218 64,252" />
        {/* N2 → N5 */}
        <path d="M 108,155 C 132,178 158,206 187,232" />

        {/* N3 → N5 */}
        <path d="M 266,145 C 247,172 220,202 187,232" />
        {/* N3 → N6 */}
        <path d="M 266,145 C 280,170 298,196 316,224" />

        {/* N4 → N7 */}
        <path d="M 64,252 C 78,284 102,318 130,352" />
        {/* N5 → N7 */}
        <path d="M 187,232 C 168,268 150,308 130,352" />
        {/* N5 → N8 */}
        <path d="M 187,232 C 202,272 224,324 250,366" />

        {/* N6 → N8 */}
        <path d="M 316,224 C 300,268 278,318 250,366" />

        {/* N7 → N9 */}
        <path d="M 130,352 C 114,388 95,426 76,462" />
        {/* N7 → N11 */}
        <path d="M 130,352 C 148,412 164,472 187,536" />

        {/* N8 → N10 */}
        <path d="M 250,366 C 262,396 274,422 290,452" />
        {/* N8 → N11 */}
        <path d="M 250,366 C 232,436 212,494 187,536" />

        {/* N9 → N11 */}
        <path d="M 76,462 C 108,490 144,516 187,536" />
        {/* N10 → N11 */}
        <path d="M 290,452 C 264,476 230,510 187,536" />

        {/* ---- Nodes ---- */}
        {/* N1 — central superior */}
        <circle cx="187" cy="65" r="5" fill="var(--color-accent)" stroke="none" />
        {/* N2 */}
        <circle cx="108" cy="155" r="3.5" fill="var(--color-accent)" stroke="none" />
        {/* N3 */}
        <circle cx="266" cy="145" r="3.5" fill="var(--color-accent)" stroke="none" />
        {/* N4 */}
        <circle cx="64" cy="252" r="3" fill="var(--color-accent)" stroke="none" />
        {/* N5 — nodo central */}
        <circle cx="187" cy="232" r="4" fill="var(--color-accent)" stroke="none" />
        {/* N6 */}
        <circle cx="316" cy="224" r="3" fill="var(--color-accent)" stroke="none" />
        {/* N7 */}
        <circle cx="130" cy="352" r="3.5" fill="var(--color-accent)" stroke="none" />
        {/* N8 */}
        <circle cx="250" cy="366" r="3.5" fill="var(--color-accent)" stroke="none" />
        {/* N9 */}
        <circle cx="76" cy="462" r="3" fill="var(--color-accent)" stroke="none" />
        {/* N10 */}
        <circle cx="290" cy="452" r="3" fill="var(--color-accent)" stroke="none" />
        {/* N11 — nodo inferior convergente */}
        <circle cx="187" cy="536" r="4.5" fill="var(--color-accent)" stroke="none" />
      </g>
    </svg>
  )
}
