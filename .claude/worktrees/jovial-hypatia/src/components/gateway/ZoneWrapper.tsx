'use client'

/**
 * ZoneWrapper — Contenedor que gestiona la transición visual entre zonas.
 *
 * ZONA 1 (exploración): fondo bg-primary, Inter Tight, sensación aireada.
 * ZONA 2 (reflexión):   fondo bg-secondary, Cormorant Garamond italic, intimidad.
 *
 * El cambio NO es solo de fondo: hay una respiración sutil (scale 1.0→1.008→1.0)
 * que hace que el espacio se sienta diferente al cambiar de zona.
 */

import { useEffect, useRef, useState } from 'react'

interface ZoneWrapperProps {
  zone: 'exploracion' | 'reflexion'
  children: React.ReactNode
}

export default function ZoneWrapper({ zone, children }: ZoneWrapperProps) {
  const [isBreathing, setIsBreathing] = useState(false)
  const prevZone = useRef(zone)

  useEffect(() => {
    if (prevZone.current !== zone) {
      prevZone.current = zone
      setIsBreathing(true)
      const t = setTimeout(() => setIsBreathing(false), 600)
      return () => clearTimeout(t)
    }
  }, [zone])

  return (
    <div
      className={isBreathing ? 'zone-breathe' : ''}
      style={{
        flex: 1,
        backgroundColor:
          zone === 'reflexion'
            ? 'var(--color-bg-secondary)'
            : 'var(--color-bg-primary)',
        transition: 'background-color 600ms ease',
        minHeight: '100%',
        // Padding interno — el contenido respira dentro del wrapper
        paddingTop: 'var(--space-10)',
        paddingBottom: 'var(--space-10)',
        paddingLeft: 'var(--container-padding-mobile)',
        paddingRight: 'var(--container-padding-mobile)',
      }}
    >
      <div
        style={{
          maxWidth: '540px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}
