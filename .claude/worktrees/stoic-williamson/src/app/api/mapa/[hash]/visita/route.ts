/**
 * PATCH /api/mapa/[hash]/visita
 *
 * Registra la fecha de última visita en diagnosticos.meta.last_visited_at
 * Se llama desde MapaClient en cada visita (fire-and-forget).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ hash: string }> },
) {
  const { hash } = await params
  if (!hash) return NextResponse.json({ ok: false }, { status: 400 })

  try {
    const supabase = createAdminClient()

    // Leer meta actual para hacer merge (no sobreescribir otros campos)
    const { data } = await supabase
      .from('diagnosticos')
      .select('meta')
      .eq('hash', hash)
      .single<{ meta: Record<string, unknown> }>()

    const currentMeta = data?.meta ?? {}

    await supabase
      .from('diagnosticos')
      .update({
        meta: {
          ...currentMeta,
          last_visited_at: new Date().toISOString(),
        },
      })
      .eq('hash', hash)

    return NextResponse.json({ ok: true })
  } catch {
    // Silencioso — no afecta la experiencia del usuario
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
