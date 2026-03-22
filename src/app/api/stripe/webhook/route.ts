/**
 * POST /api/stripe/webhook
 *
 * Recibe eventos de Stripe. Cuando checkout.session.completed:
 * — marca funnel.converted_week1 = true en diagnosticos (Supabase)
 * — guarda datos del pago (session ID, email, importe, fecha)
 *
 * Configuración en Stripe Dashboard → Webhooks:
 *   URL: https://lars.institutoepigeinetico.com/api/stripe/webhook
 *   Evento: checkout.session.completed
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase'
import { sendPostPagoEmail } from '@/lib/email'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.startsWith('sk_test_xxx')) return null
  return new Stripe(key)
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ received: true })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret || webhookSecret.startsWith('whsec_xxx')) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const hash = session.metadata?.hash
    const stripeSessionId = session.id
    const customerEmail = session.customer_details?.email ?? null
    const amountTotal = session.amount_total ?? 0

    if (hash) {
      try {
        const supabase = createAdminClient()

        // Leer funnel actual para hacer merge (no sobreescribir)
        const { data } = await supabase
          .from('diagnosticos')
          .select('funnel')
          .eq('hash', hash)
          .single<{ funnel: Record<string, unknown> }>()

        const currentFunnel = data?.funnel ?? {}

        await supabase
          .from('diagnosticos')
          .update({
            funnel: {
              ...currentFunnel,
              converted_week1: true,
              cta_clicked: true,
              paid: true,
              product: 'lars_semana1',
              stripe_session_id: stripeSessionId,
              amount_eur: amountTotal / 100,
              paid_at: new Date().toISOString(),
              customer_email: customerEmail,
            },
          })
          .eq('hash', hash)

        console.log(`[webhook] Conversión registrada — hash: ${hash}, sesión: ${stripeSessionId}, €${amountTotal / 100}`)

        // Enviar email post-pago (fire-and-forget)
        const emailTo = customerEmail ?? (await supabase
          .from('diagnosticos')
          .select('email')
          .eq('hash', hash)
          .single<{ email: string }>()
          .then(r => r.data?.email)) ?? null

        if (emailTo) {
          void sendPostPagoEmail(emailTo, hash).catch((err) => {
            console.error('[webhook] Error enviando email post-pago:', err)
          })
        }
      } catch (err) {
        console.error('[webhook] Supabase update failed:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
