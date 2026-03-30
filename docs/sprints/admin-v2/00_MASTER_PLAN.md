# Admin L.A.R.S. v2 — Master Plan

## Visión

Transformar el admin de un panel básico con 3 herramientas en un **Centro de Comando Clínico** donde Javi abre cada mañana y en 30 segundos sabe qué está pasando, quién necesita atención, y qué puede hacer.

## Filosofía

- **El sistema piensa, Javi actúa.** Cada pantalla traduce datos en decisiones claras.
- **Inteligencia de perfil activa.** Los 4 perfiles (PC, FI, CE, CP) no mueren después del scoring — el sistema los usa para interpretar comportamiento y sugerir acciones.
- **Cuidado, no ventas.** Toda acción de Javi se siente como atención clínica personalizada.
- **Siguiendo product-philosophy:** Una acción por pantalla, cero callejones sin salida, estados vacíos diseñados.

## Estructura del nuevo admin

```
/admin                    → Hub (Centro de Comando)
/admin/leads              → LAM (Lead Acquisition Manager)
/admin/leads?detail=HASH  → Detalle de lead (panel lateral)
/admin/automations        → Flujo visual de emails
/admin/analytics          → Analytics mejorado + Geo
/admin/agenda             → Disponibilidad mejorada (renombrado)
/admin/tools              → Fast-Forward + Config
```

## Navegación: Sidebar colapsable

- Barra lateral oscura (#1E130F), 64px colapsada → 240px expandida
- Mobile: bottom bar con 5 iconos
- Badges de notificación en Leads (calientes) y Agenda (sesión hoy)
- Reemplaza: SiteHeader variant="admin" + AdminNav horizontal

## Sprints de construcción

| Sprint | Nombre | Dependencias | Descripción |
|--------|--------|-------------|-------------|
| 0 | Foundation | — | Profile intelligence engine, nuevas API routes, geo capture |
| 1 | Sidebar + Layout | Sprint 0 | Nuevo layout admin con sidebar, auth wrapper |
| 2 | Hub | Sprint 1 | Centro de comando con alertas inteligentes |
| 3 | LAM | Sprint 0, 1 | Tabla de leads + panel lateral + heat score |
| 4 | LAM Actions | Sprint 3 | Acciones de Javi: nota, video, desbloqueo, sesión express |
| 5 | Automations | Sprint 1 | Visualización de flujo de emails |
| 6 | Analytics | Sprint 1 | Geo + tendencias + distribución mejorada |
| 7 | Agenda + Polish | Sprint 1 | Mejoras de disponibilidad + mobile + animaciones |

## Cambios en DB

**No se crean nuevas tablas.** Campos nuevos en jsonb existente:

### En `diagnosticos.meta` (jsonb):
- `country`: string (ISO code)
- `city`: string
- `region`: string

### En `diagnosticos` (nueva columna):
- `personal_actions`: jsonb[] — Array de acciones manuales de Javi

### En `diagnosticos.funnel` (jsonb):
- `emails_opened`: string[] — IDs de emails abiertos (d0, d3, d7...)
- `unsubscribed`: boolean
- `unsubscribed_at`: ISO timestamp

### Migración requerida:
- `004_personal_actions.sql` — Añadir columna `personal_actions jsonb DEFAULT '[]'::jsonb`

## Archivos clave de referencia

- `docs/DESIGN.md` — Tokens de diseño (colores, tipografía, spacing)
- `docs/VISION.md` — 4 perfiles de cliente, métricas objetivo
- `src/lib/email.ts` — Templates de emails actuales (para Automations)
- `src/lib/insights.ts` — Textos por dimensión y score
- `src/lib/scoring.ts` — Algoritmo de scoring P1-P8 → D1-D5
- `src/app/api/admin/analytics/route.ts` — API de analytics actual
- `src/components/admin/AdminNav.tsx` — Nav actual (a reemplazar)
