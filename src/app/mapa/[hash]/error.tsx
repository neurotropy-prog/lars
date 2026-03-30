'use client'

/**
 * Error boundary para /mapa/[hash]
 *
 * Muestra skeleton pulsante + mensaje amigable + botón reintentar.
 * Nunca una página en blanco.
 */

export default function MapaError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--container-padding-mobile)',
      }}
    >
      {/* Skeleton pulsante */}
      <div style={{ width: '100%', maxWidth: '540px' }}>
        {/* Score skeleton */}
        <div
          style={{
            width: '120px',
            height: '60px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(30,19,16,0.06)',
            margin: '0 auto var(--space-6)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
          }}
        />

        {/* Dimension bar skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ marginBottom: 'var(--space-4)' }}>
            <div
              style={{
                width: `${60 + i * 8}%`,
                height: '12px',
                borderRadius: '6px',
                background: 'rgba(30,19,16,0.06)',
                animation: `skeleton-pulse 1.5s ease-in-out ${i * 200}ms infinite`,
              }}
            />
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(30,19,16,0.04)',
                marginTop: 'var(--space-2)',
              }}
            />
          </div>
        ))}

        {/* Mensaje + retry */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <p
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            No hemos podido cargar tu mapa. Prueba en unos segundos.
          </p>
          <button
            onClick={reset}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Reintentar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
