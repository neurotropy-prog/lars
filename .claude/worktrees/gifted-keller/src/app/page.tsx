/**
 * page.tsx — Página principal L.A.R.S.©
 * La landing ES el gateway. Una sola experiencia.
 *
 * GatewayController gestiona el estado de P1 y activa GatewayBloque1
 * como overlay fullscreen cuando el usuario selecciona su respuesta.
 */

import GatewayController from '@/components/GatewayController'

export default function Home() {
  return (
    <>
      {/* Skip link para lectores de pantalla */}
      <a href="#p1-section" className="skip-link">
        Ir al diagnóstico
      </a>

      <main id="main-content">
        <GatewayController />
      </main>
    </>
  )
}
