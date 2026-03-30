# STACK.md — Stack Técnico L.A.R.S.©

Decidido en Fase 0 · Marzo 2026

---

## Resumen

| Pieza | Tecnología | Coste mensual |
|-------|-----------|---------------|
| Frontend + Backend | Next.js 15 (App Router) + TypeScript | — |
| Base de datos | Supabase (PostgreSQL) | Free → $25/mes |
| Email | Resend + React Email | Free (100/día) |
| Pagos | Stripe | 1.4% + 0.25€/transacción |
| Analytics | PostHog | Free (1M eventos/mes) |
| Hosting | Vercel | Free → $20/mes |
| Fuentes | Google Fonts (next/font) | — |

---

## Justificación por tecnología

### Next.js 15 (App Router)

- **Qué es:** Un framework de React que permite crear páginas web rápidas con servidor integrado.
- **Por qué:** La landing necesita cargar en menos de 1.5 segundos. Next.js pre-genera el HTML para que el usuario vea contenido inmediatamente, sin esperar a que JavaScript se ejecute. Además incluye "API Routes" — un mini-servidor dentro del mismo proyecto donde manejamos emails, pagos y analytics sin necesitar un servidor separado.
- **Alternativas descartadas:** Astro (menos ecosistema para interactividad del gateway), Remix (menos soporte en Vercel), HTML estático (no escala para el gateway interactivo).

### TypeScript

- **Qué es:** Una capa sobre JavaScript que detecta errores antes de que el código se ejecute.
- **Por qué:** El gateway maneja datos sensibles (respuestas, scores, perfiles). TypeScript garantiza que los datos tengan la estructura correcta en todo momento. Menos bugs, más seguridad.

### CSS Custom Properties (sin Tailwind)

- **Qué es:** Variables nativas del navegador para colores, tamaños y espaciados.
- **Por qué:** DESIGN.md define un sistema de tokens completo. Las CSS custom properties permiten implementarlo exactamente como está documentado, sin capa de traducción. Cero dependencias extra. Control absoluto.

### Supabase (PostgreSQL)

- **Qué es:** Una base de datos PostgreSQL en la nube con herramientas para gestionar datos, seguridad y archivos.
- **Por qué:** El schema del gateway es relacional — un usuario tiene respuestas, scores, evoluciones del mapa, cadena de confianza. PostgreSQL es la base de datos relacional más robusta. Supabase añade Row Level Security (RLS) — los mapas vivos son privados automáticamente sin código adicional. Migraciones reversibles con Supabase CLI.
- **Alternativas descartadas:** Firebase (NoSQL, peor para datos relacionales), PlanetScale (MySQL, menos features), MongoDB (NoSQL, no ideal para este schema).

### Resend + React Email

- **Qué es:** Un servicio de envío de emails con una librería para diseñar emails como componentes React.
- **Por qué:** Los emails del sistema (resultado del mapa, evoluciones día 3-30) son transaccionales y personalizados. Resend es simple (un POST por email), fiable, y React Email permite diseñar los templates con los mismos tokens de DESIGN.md. No necesitamos Mailchimp ni plataformas pesadas.
- **Alternativas descartadas:** SendGrid (más complejo), Mailchimp (excesivo para transaccional), AWS SES (requiere configuración manual).

### Stripe

- **Qué es:** La plataforma de pagos online más utilizada en Europa.
- **Por qué:** Para los 97€ de la Semana 1. Stripe Checkout genera una página de pago segura — no construimos formulario propio. Webhooks para confirmar el pago automáticamente. Refunds para la garantía de 7 días.

### PostHog

- **Qué es:** Una plataforma de analytics que mide eventos específicos (no solo visitas).
- **Por qué:** Necesitamos medir cada paso del gateway: quién responde P1, dónde abandonan, cuántos llegan a la bisagra, cuántos dan el email, cuántos hacen clic en el CTA. PostHog hace funnels visuales, session replay (ver la experiencia real del usuario en móvil), y funciona sin cookies — cumplimos RGPD sin banner de cookies invasivo.
- **Alternativas descartadas:** Google Analytics (basado en pageviews, no eventos), Mixpanel (más caro), Amplitude (más complejo).

### Vercel

- **Qué es:** Una plataforma de hosting optimizada para Next.js.
- **Por qué:** Deploy automático con cada push a GitHub. Cada rama tiene su propia URL de preview. SSL automático. Red global para velocidad en España y Latam. Free tier para staging.

### Google Fonts (via next/font)

- **Fuentes:** Plus Jakarta Sans (headlines), Inter (cuerpo), Inter Tight (UI).
- **Por qué next/font:** Optimiza la carga automáticamente — las fuentes se descargan en build time, no en runtime. Cero layout shift. `font-display: swap` para que el texto sea visible inmediatamente.

---

*L.A.R.S.© · Stack Técnico · Fase 0 · Marzo 2026*
