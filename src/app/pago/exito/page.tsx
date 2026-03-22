/**
 * /pago/exito — Página de éxito post-pago
 *
 * Per spec: FEATURE_SUCCESS_PAGE.md
 * El check-in en Four Seasons. No "gracias por tu compra" — "tu Semana 1 ha comenzado."
 *
 * Arco emocional: Confirmación → Elevación → Presencia → Anticipación → Primera acción → Cierre
 */

import { Metadata } from 'next'
import SuccessClient from './SuccessClient'

export const metadata: Metadata = {
  title: 'Tu Semana 1 ha comenzado · L.A.R.S.',
  description: 'Todo lo que necesitas para las próximas 72 horas está en camino.',
  robots: { index: false, follow: false },
}

export default async function PagoExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ hash?: string; session_id?: string }>
}) {
  const { hash, session_id } = await searchParams

  // Obtener email de la persona para el botón inteligente de email
  let email: string | null = null
  if (hash) {
    try {
      const { createAdminClient } = await import('@/lib/supabase')
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('diagnosticos')
        .select('email')
        .eq('hash', hash)
        .single<{ email: string }>()
      email = data?.email ?? null
    } catch {
      // silencioso
    }
  }

  return (
    <SuccessClient
      hash={hash ?? null}
      email={email}
      sessionId={session_id ?? null}
    />
  )
}
