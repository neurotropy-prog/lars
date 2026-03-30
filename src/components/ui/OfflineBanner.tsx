'use client'

/**
 * OfflineBanner — Banner sutil y no bloqueante cuando no hay conexión.
 *
 * Aparece con slide-down desde arriba. No bloquea la interfaz.
 * Se oculta automáticamente cuando vuelve la conexión.
 */

import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function OfflineBanner() {
  const { isOnline } = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        padding: 'var(--space-3) var(--space-4)',
        background: 'rgba(30,19,16,0.95)',
        borderBottom: '1px solid rgba(196,64,64,0.3)',
        textAlign: 'center',
        fontFamily: 'var(--font-host-grotesk)',
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-inverse)',
        animation: 'slideDown 300ms ease',
      }}
    >
      Sin conexión. Tus respuestas están guardadas — cuando vuelvas, continuamos.
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
