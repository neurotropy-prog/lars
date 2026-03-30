'use client'

/**
 * ZoneWrapper — Contenedor que gestiona la transición visual entre 3 zonas emocionales.
 *
 * ZONA 1 (exploración): fondo bg-primary (#FFFFFF blanco), Host Grotesk, sensación aireada.
 * ZONA 2 (reflexión):   fondo bg-secondary (#EAF2EE verde suave), Host Grotesk, intimidad.
 * ZONA 3 (revelación):  gradiente #EAF2EE → #FFFFFF, máxima intensidad.
 *
 * El cambio NO es solo de fondo: hay una respiración sutil (scale 1.0→1.008→1.0)
 * que hace que el espacio se sienta diferente al cambiar de zona.
 *
 * Transiciones: 600ms para EXPLORE↔REFLECT, 800ms para entrada a REVEAL.
 * Easing: cubic-bezier(0.65, 0, 0.35, 1) — smooth in-out per EXPERIENCE_STANDARDS.md
 */

import { useEffect, useRef, useState } from 'react'

export type Zone = 'exploracion' | 'reflexion' | 'revelacion'

interface ZoneWrapperProps {
  zone: Zone
  children: React.ReactNode
}

function getZoneBackground(zone: Zone): string {
  switch (zone) {
    case 'reflexion':
      return 'var(--color-bg-secondary)'
    case 'revelacion':
      return 'var(--bg-reveal-solid)'
    default:
      return 'var(--color-bg-primary)'
  }
}

function getZoneTransitionDuration(prevZone: Zone, newZone: Zone): number {
  // Entry into REVEAL is slower (800ms) — more dramatic
  if (newZone === 'revelacion') return 800
  // All other transitions: 600ms
  return 600
}

export default function ZoneWrapper({ zone, children }: ZoneWrapperProps) {
  const [isBreathing, setIsBreathing] = useState(false)
  const [transitionDuration, setTransitionDuration] = useState(600)
  const prevZone = useRef(zone)

  useEffect(() => {
    if (prevZone.current !== zone) {
      const duration = getZoneTransitionDuration(prevZone.current, zone)
      setTransitionDuration(duration)
      prevZone.current = zone
      setIsBreathing(true)
      const t = setTimeout(() => setIsBreathing(false), duration)
      return () => clearTimeout(t)
    }
  }, [zone])

  const isReveal = zone === 'revelacion'

  return (
    <div
      className={isBreathing ? 'zone-breathe' : ''}
      style={{
        flex: 1,
        // REVEAL uses gradient, others use solid color
        ...(isReveal
          ? { background: 'var(--bg-reveal-gradient)' }
          : { backgroundColor: getZoneBackground(zone) }),
        transition: `background-color ${transitionDuration}ms var(--ease-zone), background ${transitionDuration}ms var(--ease-zone)`,
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

/** Helper to get the background color/value for a zone (used by parent containers) */
export function getZoneBg(zone: Zone): string {
  return getZoneBackground(zone)
}
