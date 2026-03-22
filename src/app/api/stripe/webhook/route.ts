/**
 * POST /api/stripe/webhook
 *
 * Recibe eventos de Stripe. Cuando checkout.session.completed:
 * — registra la conversión en diagnosticos.funnel (Supabase)
 *
 * Para que funcione:
 * 1. Crear webhook en Stripe Dashboard → https://dashboard.stripe.com/webhooks
 *    URL: https://tu-dominio.com/api/stripe/webhook
 *    Evento: checkout.session.completed
 * 2. Copiar el Signing Secret en STRIPE_WEBHOOK_SECRET (.env.local)
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.startsWith('sk_test_xxx')) return null
  return new Stripe(key, { apiVersion: '2026-02-25.clover' })
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
        await supabase
          .from('diagnosticos')
          .update({
            funnel: {
              paid: true,
              product: 'lars_semana1',
              stripe_session_id: stripeSessionId,
              amount_eur: amountTotal / 100,
              paid_at: new Date().toISOString(),
              customer_email: customerEmail,
            },
          })
          .eq('hash', hash)

        console.log(`[webhook] Conversión registrada — hash: ${hash}, sesión: ${stripeSessionId}`)
      } catch (err) {
        console.error('[webhook] Supabase update failed:', err)
        // No devolver error — Stripe reintentará si hay 500
      }
    }
  }

  return NextResponse.json({ received: true })
}
