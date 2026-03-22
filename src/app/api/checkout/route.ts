/**
 * POST /api/checkout
 *
 * Crea una Stripe Checkout Session para la Semana 1 (97€).
 * Devuelve { url } para redirigir al cliente.
 *
 * Body: { hash: string }  — el hash del diagnóstico (se guarda en metadata)
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.startsWith('sk_test_xxx') || key === 'your_stripe_secret_key') return null
  return new Stripe(key)
}

export async function POST(req: NextRequest) {
  let body: { hash?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const { hash } = body
  if (!hash || typeof hash !== 'string') {
    return NextResponse.json({ error: 'Missing hash' }, { status: 400 })
  }

  const stripe = getStripe()
  if (!stripe) {
    // Stripe no configurado — devolver URL de demostración en desarrollo
    return NextResponse.json({
      error: 'Stripe no configurado',
      demo: true,
    }, { status: 503 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lars.epigenomics.es'
  const mapaUrl = `${baseUrl}/mapa/${hash}`

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        hash,
        product: 'lars_semana1',
      },
      success_url: `${baseUrl}/pago/exito?session_id={CHECKOUT_SESSION_ID}&hash=${hash}`,
      cancel_url: mapaUrl,
      locale: 'es',
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] Stripe error:', err)
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 })
  }
}
