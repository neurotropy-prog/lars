# ARCHITECTURE.md — Arquitectura del Proyecto

---

## Estructura de Carpetas

```
lars-project/
├── docs/                          # Documentación del proyecto
├── src/
│   ├── app/                       # Páginas y rutas (Next.js App Router)
│   │   ├── layout.tsx             # Layout raíz (fuentes, meta tags)
│   │   ├── page.tsx               # Landing-Gateway (la experiencia única)
│   │   ├── globals.css            # Tokens de diseño (colores, tipografía, espaciado)
│   │   ├── showcase/page.tsx      # Showcase de componentes (desarrollo)
│   │   ├── mapa/[hash]/page.tsx   # Mapa vivo personal (URL única)
│   │   └── api/                   # Backend (API Routes)
│   │       ├── gateway/route.ts   # Guardar respuestas del gateway
│   │       ├── email/route.ts     # Captura email + envío resultado
│   │       ├── stripe/            # Checkout + webhook de pago
│   │       └── analytics/route.ts # Proxy de eventos analytics
│   ├── components/
│   │   ├── ui/                    # 8 componentes base del sistema de diseño
│   │   ├── landing/               # Secciones de la landing (hero, espejo, etc.)
│   │   └── gateway/               # Pasos del gateway (P1-P8, bisagra, etc.)
│   ├── lib/                       # Lógica compartida
│   │   ├── supabase.ts            # Conexión a base de datos
│   │   ├── stripe.ts              # Configuración de pagos
│   │   ├── scoring.ts             # Algoritmo de scoring (5 dimensiones)
│   │   └── analytics.ts           # Wrapper de PostHog
│   └── types/
│       └── gateway.ts             # Definiciones de datos (TypeScript)
├── supabase/migrations/           # Cambios de base de datos (reversibles)
├── public/svg/                    # Ilustraciones SVG
├── .env.local                     # Variables de entorno (secretos, NO en Git)
└── .env.example                   # Ejemplo de variables (SIN secretos)
```

---

## Flujos Principales

### 1. Landing → Gateway (la experiencia única)

```
Usuario llega a URL
  → Página carga (SSR, < 1.5s)
  → Ve hero + P1 visible
  → Responde P1
  → Gateway inline (P2-P8, micro-espejos, bisagra)
  → Da email
  → Recibe URL del mapa vivo
```

Todo ocurre en una sola página (`page.tsx`). No hay redirecciones.

### 2. Captura de Email + Resultado

```
Usuario da email
  → Frontend envía a /api/email
  → Backend:
    1. Guarda en Supabase (tabla users + gateway_responses)
    2. Genera hash único para URL del mapa
    3. Envía email con Resend (link al mapa)
  → Frontend muestra confirmación
```

### 3. Mapa Vivo

```
Usuario accede a /mapa/[hash-12-chars]
  → Backend busca usuario por hash en Supabase
  → Renderiza resultado personalizado
  → Muestra evoluciones desbloqueadas según día
  → CTA "Empieza la Semana 1" con gravedad creciente
```

### 4. Pago (Semana 1, 97€)

```
Usuario hace clic en CTA
  → Frontend llama a /api/stripe/checkout
  → Backend crea Stripe Checkout Session
  → Usuario paga en página de Stripe
  → Stripe envía webhook a /api/stripe/webhook
  → Backend actualiza funnel.converted_week1 en Supabase
```

### 5. Analytics

```
Cada interacción del gateway
  → Frontend envía evento a PostHog
  → Evento incluye: paso, respuesta, tiempo, dispositivo
  → PostHog genera funnels automáticamente
```

---

## Principios de Arquitectura

1. **Una sola página para landing + gateway.** No hay separación. La persona llega y ya está dentro.
2. **Backend dentro de Next.js.** API Routes para todo. Sin servidor separado.
3. **Datos sensibles solo en backend.** Las API keys de Stripe, Resend y Supabase service role nunca llegan al navegador.
4. **Estado del gateway en localStorage.** Si la persona cierra y vuelve, continúa donde lo dejó.
5. **Mapas vivos con hash único.** Sin autenticación, pero no indexables (noindex, nofollow).
6. **Mobile-first.** Todo se diseña para 375px primero, luego se adapta.

---

## Entornos

| Entorno | URL | Rama Git | Base de datos |
|---------|-----|----------|---------------|
| Local | localhost:3000 | cualquiera | Supabase (proyecto staging) |
| Staging | preview en Vercel | staging | Supabase staging |
| Producción | dominio final | main | Supabase producción |

---

*L.A.R.S.© · Arquitectura · Fase 0 · Marzo 2026*
