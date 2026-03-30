# SECURITY.md — Seguridad del Proyecto

---

## Principios

1. **Datos sensibles nunca en el frontend.** API keys, tokens, y claves de servicio solo viven en el backend (API Routes de Next.js) y en variables de entorno.
2. **Mapas vivos privados pero sin autenticación.** Acceso por hash único de 12 caracteres (no adivinable). No indexables (`noindex, nofollow`).
3. **APIs externas siempre por backend.** Stripe, Resend, Supabase service role — todo pasa por API Routes, nunca directamente desde el navegador.
4. **Credenciales en variables de entorno.** Nunca en código. `.env.local` en `.gitignore`.

---

## Variables de Entorno

| Variable | Dónde se usa | Exposición |
|----------|-------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + Backend | Pública (solo URL, sin poder) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | Pública (limitada por RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo Backend | SECRETA — acceso total a DB |
| `STRIPE_SECRET_KEY` | Solo Backend | SECRETA |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend | Pública (solo para Checkout) |
| `STRIPE_WEBHOOK_SECRET` | Solo Backend | SECRETA |
| `RESEND_API_KEY` | Solo Backend | SECRETA |
| `NEXT_PUBLIC_POSTHOG_KEY` | Frontend | Pública (solo analytics) |

**Regla:** Todo lo que empieza con `NEXT_PUBLIC_` es visible en el navegador. Solo poner ahí lo que sea seguro exponer.

---

## Headers de Seguridad

Configurados en `next.config.ts`:

| Header | Valor | Qué protege |
|--------|-------|-------------|
| `X-Frame-Options` | `DENY` | Previene que la página se cargue en un iframe (clickjacking) |
| `X-Content-Type-Options` | `nosniff` | Previene que el navegador "adivine" tipos de archivo |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limita qué información se envía a otros sitios |
| `X-Robots-Tag` (solo /mapa/*) | `noindex, nofollow` | Los mapas vivos no aparecen en Google |

---

## Base de Datos (Supabase)

### Row Level Security (RLS)

RLS activo en todas las tablas. Políticas:

- **`users`:** Solo lectura por `map_hash` desde el frontend. Escritura solo desde backend (service role).
- **`gateway_responses`:** Solo escritura desde backend. Lectura por `user_id` vinculado a `map_hash`.
- **`map_evolution`:** Solo lectura desde frontend (por hash). Escritura desde backend.
- **`confidence_chain` y `funnel`:** Solo backend.

### Backups

Supabase incluye backups automáticos diarios en el plan Pro. En free tier, los datos se pueden exportar manualmente.

---

## Pagos (Stripe)

- **Checkout Session:** Se crea en el backend. El frontend recibe una URL de Stripe y redirige. Nunca manejamos tarjetas.
- **Webhook:** Verificamos la firma del webhook con `STRIPE_WEBHOOK_SECRET` antes de procesar. Previene eventos falsos.
- **Refunds:** Se gestionan desde el dashboard de Stripe o por API desde el backend. Garantía de 7 días.

---

## Email (Resend)

- La API key solo vive en el backend.
- Los emails se envían desde un dominio verificado.
- No incluimos datos sensibles en el cuerpo del email (solo link al mapa).

---

## Analytics (PostHog)

- Modo sin cookies activado — cumple RGPD sin banner de cookies.
- Los eventos no incluyen datos personales (email, nombre). Solo acciones anónimas (paso completado, tiempo, dispositivo).
- La key pública de PostHog solo permite enviar eventos, no leerlos.

---

## Validación de Datos

- **Email:** Validación en frontend (formato) y backend (formato + unicidad).
- **Respuestas del gateway:** Validadas en backend contra el schema esperado antes de guardar.
- **Hash del mapa:** Generado con `crypto.randomUUID()` truncado. 12 caracteres alfanuméricos.

---

## Lo que NUNCA hacemos

- Guardar contraseñas (no hay autenticación de usuario)
- Exponer `SUPABASE_SERVICE_ROLE_KEY` en el frontend
- Guardar tarjetas de crédito (Stripe las maneja)
- Enviar datos personales a PostHog
- Indexar mapas vivos en buscadores
- Permitir acceso a datos de un usuario desde otro `map_hash`

---

*L.A.R.S.© · Seguridad · Fase 0 · Marzo 2026*
