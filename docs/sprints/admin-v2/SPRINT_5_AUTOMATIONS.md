# Sprint 5 — Automations (Flujo visual de emails)

## Objetivo
Dar a Javi visibilidad total sobre qué emails se mandan, cuándo, a quién, con qué lógica, y cómo están funcionando. Con vista previa de cada email.

## Dependencias
- Sprint 0 (API de automations)
- Sprint 1 (AdminLayout)

## Duración estimada
1 sesión de Claude Code

---

## Diseño de la página

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Automatizaciones                                        │
│  8 emails automáticos · 3 emails especiales              │
│                                                          │
│  ── Métricas globales ──                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ 234      │  │ 68%      │  │ 3 (1.3%) │               │
│  │ Enviados │  │ Open rate│  │ Bajas    │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                          │
│  ── Flujo de nurturing ──                                │
│                                                          │
│  ●─── Día 0: Tu Mapa de Regulación ─────────────────    │
│  │    Trigger: Al completar gateway + dar email          │
│  │    Enviados: 48 · Abiertos: 39 (81%)                 │
│  │    [▾ Vista previa]                                   │
│  │                                                       │
│  ●─── Día 3: Tu arquetipo está disponible ───────────    │
│  │    Trigger: Cron 9AM si days >= 3                     │
│  │    Enviados: 35 · Abiertos: 25 (71%)                 │
│  │    [▾ Vista previa]                                   │
│  │                                                       │
│  ●─── Día 7: Tu mapa se ha actualizado ──────────────    │
│  │    ...                                                │
│  │                                                       │
│  ◆─── REGLA: Si 3+ emails sin abrir ─────────────────    │
│  │    │                                                  │
│  │    ●─── Goodbye: despedida empática ──────────────    │
│  │         Trigger: 3 emails consecutivos sin abrir      │
│  │         Se envía UNA VEZ → luego STOP total           │
│  │         Incluye botón "Reactivar actualizaciones"     │
│  │                                                       │
│  ●─── Día 10: Sesión con Javier ─────────────────────    │
│  │    ⚠️ Skip si ya pagó · Skip si ya agendó            │
│  │    ...                                                │
│  │                                                       │
│  ●─── Día 14: Subdimensiones nuevas ─────────────────    │
│  │    ...                                                │
│  │                                                       │
│  ●─── Día 21: Un capítulo para tu situación ─────────    │
│  │    ...                                                │
│  │                                                       │
│  ●─── Día 30: ¿Ha cambiado algo? ────────────────────    │
│  │    ...                                                │
│  │                                                       │
│  ●─── Día 90: 3 meses ──────────────────────────────     │
│       ...                                                │
│                                                          │
│  ── Emails especiales ──                                 │
│                                                          │
│  ●─── Post-pago: Tu Semana 1 empieza ahora ─────────    │
│  │    Trigger: Webhook de Stripe (pago confirmado)       │
│  │    ...                                                │
│  │                                                       │
│  ●─── Booking: Confirmación de sesión ───────────────    │
│  │    Trigger: Al agendar sesión                         │
│  │    ...                                                │
│  │                                                       │
│  ●─── Reminder: 24h antes de sesión ─────────────────    │
│       Trigger: Cron diario                               │
│       ...                                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Componentes

### 1. Stats globales (3 cards)

```
Total enviados | Open rate medio | Unsubscribes (%)
```

Datos de `/api/admin/automations`.

### 2. Nodo de email (EmailFlowNode)

Cada email del flujo es un nodo con:

```
┌─────────────────────────────────────────────────┐
│  ● Día 0: Tu Mapa de Regulación                │  ← Círculo + línea vertical conectora
│                                                  │
│  Trigger: Al completar gateway + dar email       │  ← Gris, Inter 13px
│  Enviados: 48 · Abiertos: 39 (81%)              │  ← Stats con badge verde si > 60%
│                                                  │
│  [▾ Vista previa]                                │  ← Expand/collapse
│                                                  │
│  ┌──────────────────────────────────────────┐   │  ← Email preview (collapsed by default)
│  │                                          │   │
│  │  (Miniatura del email HTML renderizado)  │   │
│  │  Max-height: 300px, overflow hidden      │   │
│  │  con fade-out al final                   │   │
│  │                                          │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Vista previa del email:**
- Renderiza el HTML del email real (el mismo de email.ts) en un iframe o div con sandbox
- Se muestra collapsed por defecto
- Al expandir: max-height 400px con scroll si necesario
- Fade-out gradient al final si hay overflow
- Borde sutil, border-radius

**Para renderizar los emails:** Importar las funciones de email.ts y generar el HTML con datos de ejemplo (score 42, hash 'preview', etc.).

### 3. Nodo de regla (SuppressionNode)

Los diamantes del flujo que representan lógica condicional:

```
◆─── REGLA: Si 3+ emails sin abrir → SUPRESIÓN
     | Si ya pagó → Skip emails comerciales
     | Si se dio de baja → STOP total
```

Estilo: fondo ligeramente diferente, borde discontinuo, icono ◆ en vez de ●.

### 4. Línea conectora

Línea vertical que conecta todos los nodos. CSS simple:

```css
border-left: 2px solid var(--color-accent); /* terracotta */
margin-left: 11px; /* alinear con centro del círculo */
padding-left: 24px;
```

### 5. Información de cada email

Para cada email del flujo, mostrar:

| Email | Subject | Trigger | Condiciones |
|-------|---------|---------|-------------|
| d0 | "Tu Mapa de Regulación" | Inmediato al dar email | Ninguna |
| d3 | "Hay algo nuevo en tu mapa de regulación" | Cron si days >= 3 | Skip si unsubscribed |
| d7 | "Tu mapa se ha actualizado" | Cron si days >= 7 | Skip si unsubscribed |
| d10 | "Javier puede revisar tu mapa contigo" | Cron si days >= 10 | Skip si pagó, si agendó, si unsubscribed |
| d14 | "Hay 3 subdimensiones nuevas disponibles" | Cron si days >= 14 | Skip si unsubscribed |
| d21 | "Un capítulo escrito para tu situación" | Cron si days >= 21 | Skip si unsubscribed |
| d30 | "Un mes desde tu diagnóstico — ¿ha cambiado algo?" | Cron si days >= 30 | Skip si unsubscribed |
| d90 | "3 meses desde tu mapa — una pregunta" | Cron si days >= 90 | Skip si unsubscribed |
| goodbye | "Tu mapa sigue aquí" | 3 emails sin abrir consecutivos | Una sola vez, luego STOP |
| post_pago | "Tu Semana 1 empieza ahora — aquí tienes todo" | Webhook Stripe | Solo si pagó |
| booking_confirm | "Confirmación de sesión" | Al crear booking | Solo si agendó |
| booking_reminder | "Recordatorio: sesión mañana" | Cron diario | 24h antes de sesión confirmada |

---

## Datos de preview de emails

Para generar las vistas previas, necesitas importar las funciones de generación de HTML de `src/lib/email.ts` y llamarlas con datos ficticios de preview:

```typescript
const PREVIEW_DATA = {
  to: 'ejemplo@preview.com',
  globalScore: 42,
  d1: 35, d2: 28, d3: 45, d4: 38, d5: 22,
  mapHash: 'preview123456',
}
```

Si las funciones de email.ts son async (llaman a Resend), crear versiones que solo generen el HTML sin enviar. O extraer la generación de HTML a funciones separadas.

**ALTERNATIVA MÁS SIMPLE:** Hardcodear los subjects y una descripción del contenido de cada email, sin renderizar el HTML real. Esto es más rápido de implementar y Javi puede ver el email real en su bandeja de entrada de todas formas.

---

## Archivos a crear
- `src/app/admin/automations/page.tsx` — Página completa (reemplazar placeholder)
- `src/components/admin/AutomationsFlow.tsx` — Flujo visual completo
- `src/components/admin/EmailFlowNode.tsx` — Nodo individual de email
- `src/components/admin/SuppressionNode.tsx` — Nodo de regla/supresión
- `src/components/admin/AutomationsStats.tsx` — Stats globales
- `src/components/admin/EmailPreview.tsx` — Vista previa del email

## Archivos a modificar
- Posiblemente `src/lib/email.ts` — Extraer generación de HTML a funciones puras si se quiere vista previa real

## Criterios de aceptación
- [ ] Flujo vertical muestra los 8 emails + 3 especiales con línea conectora
- [ ] Cada nodo muestra: nombre, subject, trigger, condiciones, stats
- [ ] Vista previa expandible funciona para al menos los emails principales
- [ ] Nodos de regla/supresión se distinguen visualmente
- [ ] Stats globales muestran total enviados, open rate, unsubscribes
- [ ] Responsive: flujo legible en mobile
- [ ] `npx tsc --noEmit` pasa sin errores

---

## PROMPT PARA CLAUDE CODE

```
Lee estos documentos ANTES de empezar (en este orden):

1. docs/sprints/admin-v2/00_MASTER_PLAN.md — contexto general
2. docs/sprints/admin-v2/SPRINT_5_AUTOMATIONS.md — este sprint completo
3. docs/DESIGN.md — tokens de diseño
4. src/lib/email.ts — LÉELO ENTERO. Este archivo tiene TODOS los templates de email (d0, d3, d7, d10, d14, d21, d30, d90, post-pago). Necesitas los subjects, el HTML y la lógica.
5. src/lib/booking-emails.ts — Emails de booking (confirmación, reminder)
6. src/app/api/admin/automations/route.ts — API de stats de automations (Sprint 0)
7. src/app/api/cron/ — Mira cómo se disparan los emails de evolución (trigger logic)
8. src/components/admin/AdminLayout.tsx — layout wrapper

CONTEXTO IMPORTANTE:
- Proyecto Next.js 15 con App Router + TypeScript
- NUNCA ejecutes npm run build. Usa npx tsc --noEmit
- Esta página es para que Javi ENTIENDA el sistema de emails. No es para que lo edite.
- Lo más importante: que Javi vea QUÉ se manda, CUÁNDO, CON QUÉ LÓGICA, y CÓMO VA (stats)
- Las vistas previas son un plus. Si renderizar el HTML real es complejo, muestra el subject + descripción del contenido + stats. Prioriza que la información sea clara.
- El flujo vertical con línea conectora terracotta es el elemento visual principal
- Los nodos de regla (supresión) se distinguen con icono ◆ y estilo diferente
- Inline styles, CSS variables de DESIGN.md

TU TAREA: Ejecutar Sprint 5 — Automations.

1. Reemplazar placeholder de /admin/automations con página completa
2. Crear AutomationsStats (3 cards: enviados, open rate, bajas)
3. Crear flujo vertical con EmailFlowNode para cada email
4. Crear SuppressionNode para las reglas de supresión
5. Implementar vista previa de emails (expandible). Si no puedes renderizar el HTML real, muestra descripción + subject + datos clave
6. Responsive
7. npx tsc --noEmit

Los subjects exactos y la lógica de cada email están en src/lib/email.ts. LÉELO PRIMERO.
```
