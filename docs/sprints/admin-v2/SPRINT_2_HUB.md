# Sprint 2 — Hub (Centro de Comando)

## Objetivo
Construir la página principal del admin: un dashboard que responde a "¿Qué pasó y qué necesito saber ahora?" en 30 segundos.

## Dependencias
- Sprint 0 (APIs de leads)
- Sprint 1 (AdminLayout + sidebar)

## Duración estimada
1 sesión de Claude Code

---

## Diseño del Hub

### Layout: Grid de 2 columnas

```
Desktop (> 1024px): 2 columnas
Tablet (768-1024): 2 columnas más estrechas
Mobile (< 768px): 1 columna apilada

┌─────────────────────────────────────────────────┐
│                                                   │
│  Buenos días, Javier              Mié 25 mar 2026│
│                                                   │
│  ┌───────────────────┐  ┌────────────────────┐   │
│  │  DIAGNÓSTICOS HOY │  │  PRÓXIMA SESIÓN    │   │
│  │       3           │  │  Hoy 10:30         │   │
│  │  ↑ 50% vs ayer    │  │  maria@ej.com      │   │
│  └───────────────────┘  └────────────────────┘   │
│                                                   │
│  ┌───────────────────┐  ┌────────────────────┐   │
│  │  LEADS CALIENTES  │  │  CONVERSIÓN 7D     │   │
│  │       2           │  │     12%            │   │
│  │  Necesitan acción │  │  ↑ +3% vs semana   │   │
│  └───────────────────┘  └────────────────────┘   │
│                                                   │
│  ── Lo que necesitas saber ──────────────────    │
│                                                   │
│  🔥 María (PC, Crítico) visitó su mapa          │
│     3 veces esta semana. No ha pagado.           │
│     → Su ego de rendimiento bloquea la decisión. │
│       Un video de autoridad rompería el loop.    │
│     [Ver lead →]                                  │
│                                                   │
│  📧 2 leads abrieron email Día 10 (Sesión).     │
│     Pueden agendar en las próximas horas.        │
│                                                   │
│  ── Embudo 30 días ──────────────────────────    │
│                                                   │
│  ████████████████████ 48 evaluaciones            │
│  ████████████████     38 email capturado (79%)   │
│  ██████████           22 visitaron mapa (58%)    │
│  ██                    4 pagaron (8.3%)          │
│                                                   │
│  ── Actividad reciente ──────────────────────    │
│  10:23  📋 Nuevo diagnóstico (PC, score 34)      │
│  09:45  📧 Email día 7 → carlos@...             │
│  09:00  ⚡ Cron: 3 evoluciones procesadas        │
│  Ayer   💚 Pago confirmado: lucia@...            │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## Componentes del Hub

### 1. Greeting + Date
```
"Buenos días/tardes/noches, Javier"
Fecha: "Mié 25 mar 2026"
```
- Saludo basado en hora local
- Tipografía: Lora, h2, weight 700

### 2. Stat Cards (4 tarjetas)

Cada card:
- Fondo: var(--color-bg-tertiary) (#FFFFFF)
- Border: var(--border-subtle)
- Border-radius: var(--radius-lg) (20px)
- Padding: var(--space-5)
- Número grande: Lora, 36px, weight 700
- Label: Inter, 12px, uppercase, tracking 0.1em, terracotta
- Comparativa: Inter, 13px, verde si positivo, rojo si negativo

**Card 1: Diagnósticos hoy**
- Número: count de diagnósticos con `created_at` de hoy
- Comparativa: vs ayer (↑/↓ %)

**Card 2: Próxima sesión**
- Si hay sesión hoy/mañana: hora + email del lead
- Si no: "Sin sesiones próximas" con link a Agenda

**Card 3: Leads calientes**
- Número: leads con `heat.level === 'hot'`
- Subtexto: "Necesitan atención" (link a LAM filtrado por hot)

**Card 4: Conversión 7 días**
- Porcentaje: pagados / email capturado (últimos 7 días)
- Comparativa: vs 7 días anteriores

### 3. Alertas inteligentes ("Lo que necesitas saber")

**ESTA ES LA SECCIÓN MÁS IMPORTANTE DEL HUB.**

No son métricas — son **narrativas con inteligencia de perfil**.

El sistema genera alertas automáticamente basándose en reglas:

```typescript
interface Alert {
  icon: string           // 🔥 📧 💚 ⚠️ 📅
  title: string          // "María (PC, Crítico) visitó su mapa 3 veces"
  body: string           // Interpretación + sugerencia (del profile-intelligence)
  action?: {
    label: string        // "Ver lead"
    href: string         // "/admin/leads?detail=HASH"
  }
  priority: number       // Para ordenar
}
```

**Reglas de generación de alertas:**

1. **Lead caliente sin acción** (prioridad 1):
   - Condición: heat >= 5, sin personal_action en últimos 3 días
   - Mensaje: Usa `profile.behaviors.visited_but_not_paid`
   - CTA: "Ver lead →"

2. **Email de sesión abierto** (prioridad 2):
   - Condición: Lead abrió email d10 (sesión con Javier) en últimas 48h
   - Mensaje: "Puede que agende en las próximas horas"

3. **Pago reciente** (prioridad 3):
   - Condición: `funnel.converted_week1` cambiado en últimas 24h
   - Mensaje: "¡[email] ha pagado la Semana 1!" 💚

4. **Sesión hoy** (prioridad 1):
   - Condición: Booking confirmado para hoy
   - Mensaje: "Sesión con [email] a las [hora]. Perfil: [perfil]."

5. **Lead perdido** (prioridad 4):
   - Condición: Unsubscribed en últimas 48h
   - Mensaje: "Se ha dado de baja: [email]. Perfil: [perfil]. [profile.behaviors.unsubscribed]"

**Máximo 5 alertas.** Si hay más, las de menor prioridad se ocultan.

**Estado vacío:** "Todo en orden. No hay alertas que requieran tu atención." (Con icono de check verde)

### 4. Mini-embudo (30 días)

Barras horizontales con porcentajes:
- 4 niveles: Evaluaciones → Email capturado → Mapa visitado → Pagado
- Barra: height 32px, border-radius 8px, bg terracotta con opacidad decreciente
- Número + porcentaje a la derecha
- Datos de `/api/admin/analytics?period=30d`

### 5. Feed de actividad

Timeline cronológico de las últimas 15 acciones del sistema:
- Timestamp (hora o "Ayer", "Hace 2 días")
- Icono por tipo (📋 diagnóstico, 📧 email, ⚡ cron, 💚 pago, 📅 booking)
- Descripción corta

**Fuente de datos:** Se construye combinando:
- Últimos diagnósticos (created_at)
- Últimos emails enviados (calculados por created_at + day offsets)
- Últimos pagos (funnel.converted_week1 + timestamp si disponible)
- Últimos bookings (de tabla bookings)

---

## API necesaria

### Modificar `/api/admin/analytics/route.ts` o crear `/api/admin/hub/route.ts`

Endpoint dedicado que retorna todo lo que el Hub necesita en UNA llamada:

```json
{
  "stats": {
    "diagnostics_today": 3,
    "diagnostics_yesterday": 2,
    "hot_leads": 2,
    "conversion_7d": 12,
    "conversion_7d_prev": 9,
    "next_session": { "time": "10:30", "email": "maria@...", "profile": "PC" } | null
  },
  "alerts": [ ... ],
  "funnel_30d": {
    "diagnostics": 48,
    "email_captured": 38,
    "map_visited": 22,
    "paid": 4
  },
  "activity": [
    { "type": "diagnostic", "at": "2026-03-25T10:23:00Z", "details": { "profile": "PC", "score": 34 } },
    ...
  ]
}
```

---

## Archivos a crear
- `src/app/admin/page.tsx` — Refactorizar como Hub (reemplazar contenido actual)
- `src/components/admin/HubStatCards.tsx`
- `src/components/admin/HubAlerts.tsx`
- `src/components/admin/HubFunnel.tsx`
- `src/components/admin/HubActivity.tsx`
- `src/app/api/admin/hub/route.ts`

## Archivos a modificar
- Ninguno adicional (Sprint 1 ya preparó el layout)

## Criterios de aceptación
- [ ] Hub muestra 4 stat cards con datos reales
- [ ] Alertas inteligentes usan profile-intelligence para generar narrativa
- [ ] Mini-embudo muestra datos de 30 días
- [ ] Feed de actividad muestra últimas 15 acciones
- [ ] Estado vacío de alertas diseñado ("Todo en orden")
- [ ] Responsive: 2 columnas desktop, 1 columna mobile
- [ ] Datos se cargan con skeleton/loading states (no spinner genérico)
- [ ] `npx tsc --noEmit` pasa sin errores

---

## PROMPT PARA CLAUDE CODE

```
Lee estos documentos ANTES de empezar (en este orden):

1. docs/sprints/admin-v2/00_MASTER_PLAN.md — contexto general
2. docs/sprints/admin-v2/SPRINT_2_HUB.md — este sprint completo
3. docs/DESIGN.md — tokens de diseño (colores, tipografía, spacing, border-radius)
4. src/lib/profile-intelligence.ts — motor de inteligencia (creado en Sprint 0)
5. src/app/api/admin/analytics/route.ts — API actual (patrón de código)
6. src/app/api/admin/leads/route.ts — API de leads (creada en Sprint 0)
7. src/app/admin/page.tsx — página actual a reemplazar
8. src/components/admin/AdminLayout.tsx — layout wrapper (creado en Sprint 1)

CONTEXTO IMPORTANTE:
- Proyecto Next.js 15 con App Router + TypeScript
- NUNCA ejecutes npm run build (OOM). Usa npx tsc --noEmit para verificar tipos
- El Hub es la PRIMERA pantalla que Javi ve al entrar al admin
- Debe ser INMEDIATAMENTE útil: en 30 segundos Javi sabe qué pasa
- Las alertas inteligentes son la pieza clave — usan profile-intelligence.ts para traducir datos en narrativa clínica
- Inline styles (patrón del proyecto). Variables CSS de DESIGN.md
- Loading states: skeleton screens, nunca spinners genéricos ni pantallas en blanco
- Tipografía: Lora para números grandes y headers, Inter para body y labels
- Color accent: terracotta #B45A32 para overlines y highlights. CTA color (lime) NO se usa aquí
- Background: cream #FFFBEF para el content area

TU TAREA: Ejecutar Sprint 2 — Hub (Centro de Comando).

1. Crear /api/admin/hub/route.ts con TODA la data que el Hub necesita en una llamada. Incluye: stats del día, alertas generadas con profile-intelligence, embudo 30 días, feed de actividad (combinando diagnósticos, emails, pagos, bookings).

2. Reescribir /admin/page.tsx como Hub completo:
   - Greeting contextual (Buenos días/tardes/noches, Javier) + fecha
   - 4 Stat Cards (diagnósticos hoy, próxima sesión, leads calientes, conversión 7d)
   - Sección "Lo que necesitas saber" con alertas inteligentes (máximo 5)
   - Mini-embudo horizontal de 30 días
   - Feed de actividad reciente (últimas 15 acciones)

3. Crear componentes separados: HubStatCards, HubAlerts, HubFunnel, HubActivity

4. Implementar loading states con skeleton screens para cada sección

5. Estado vacío de alertas: "Todo en orden. No hay alertas que requieran tu atención." con icono check

6. Responsive: grid 2 cols desktop → 1 col mobile. Stat cards: 2x2 grid → 2x2 o 1x4 en mobile

7. Verificar con npx tsc --noEmit

REGLA DE ORO: Las alertas NO son métricas. Son NARRATIVAS. "María visitó su mapa 3 veces → Su ego de rendimiento está bloqueando la decisión → Un video de autoridad rompería el loop → [Ver lead]". Eso es lo que Javi necesita ver.
```
