# DECISIONS.md — Historial de Decisiones

## Decisiones de producto (Alex + Javier)

| Fecha | Decisión | Contexto |
|-------|----------|----------|
| Mar 2026 | La landing ES el gateway | No hay landing separada. P1 visible en el hero. Una sola experiencia. |
| Mar 2026 | 4 secciones below the fold | Espejo + Tensión + Prueba Social + Alivio. Para quien necesite más antes de P1. |
| Mar 2026 | Testimonios adaptados de consultas reales | Javier selecciona 2-3 clientes, pide permiso. Cargo + edad, sin nombre. |
| Mar 2026 | Mapa vivo como activo central | URL única personal que evoluciona 90+ días. Testimonios del programa viven ahí, no en la landing. |
| Mar 2026 | Semana 1 como web separada (recomendado) | Pendiente confirmación de Javier. El río no se rompe. |

## Decisiones técnicas (Claude Code)

| Fecha | Decisión | Justificación |
|-------|----------|---------------|
| Mar 2026 | Next.js 15, Supabase, Resend, Stripe, PostHog, Vercel | Ver docs/phases/PHASE_0_SETUP.md |
| Mar 2026 | Hash de 12 chars con crypto.randomBytes() | Sin dependencias extra. 36^12 combinaciones ≈ 4.7 trillones. Colisión improbable, verificada de todas formas. |
| Mar 2026 | API /api/diagnostico usa SUPABASE_SERVICE_ROLE_KEY | Datos de diagnóstico son privados. Nunca expuestos al cliente. Solo el service role puede leer/escribir la tabla diagnosticos. |
| Mar 2026 | Resend fire-and-forget en API route | El email no bloquea el redirect. Si falla el email, el mapa igual se carga. El redirect es inmediato. |
| Mar 2026 | Email repetido → devolver hash existente | No se sobreescriben datos. La persona puede volver a su mapa anterior. Futuro: ofrecer actualizar vs. ver existente. |
| Mar 2026 | Página /mapa/[hash] como Server Component | SSR: los scores se procesan en servidor, nunca en cliente. noindex per spec. |

---

*Actualizar cuando se tome una decisión nueva.*
