# Sprint 6 — Analytics Enhanced

## Objetivo
Mejorar el dashboard de analytics con mapa geográfico, tendencias temporales, distribución de perfiles y dimensiones colectivas.

## Dependencias
- Sprint 0 (API de geo, geo capture en diagnostico)
- Sprint 1 (AdminLayout)

## Duración estimada
1 sesión de Claude Code

---

## Diseño de la página

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Analytics                      [7d] [30d] [90d] [Todo] │
│                                                          │
│  ── Embudo ──                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ████████████████████████████████  48 evaluaciones │   │
│  │ ████████████████████████████     38 email (79%)   │   │
│  │ ██████████████████              22 mapa (58%)     │   │
│  │ ████                             4 pagaron (8.3%) │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ── Tendencias ──                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  📈 Diagnósticos por día (últimos 30 días)       │   │
│  │  [gráfico de línea/área con puntos]               │   │
│  │  Overlay: conversiones por día (línea más fina)   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ── Perfiles ──              ── Dimensiones ──           │
│  ┌──────────────────┐       ┌──────────────────────┐    │
│  │ PC ████████ 45%  │       │ D1 Regulación    32  │    │
│  │ FI ████    22%   │       │ D2 Sueño         38  │    │
│  │ CE ██████  28%   │       │ D3 Claridad      45  │    │
│  │ CP ██       5%   │       │ D4 Emocional     35  │    │
│  └──────────────────┘       │ D5 Alegría       28  │    │
│                              │                      │    │
│                              │ 💡 73% tienen Sueño │    │
│                              │ como peor dimensión  │    │
│                              └──────────────────────┘    │
│                                                          │
│  ── Geografía ──                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │  [Mapa SVG del mundo con puntos por país]         │   │
│  │                                                    │   │
│  │  Top países:                    Top ciudades:     │   │
│  │  🇪🇸 España     28 (58%)       Madrid       15  │   │
│  │  🇲🇽 México      8 (17%)       Barcelona     8  │   │
│  │  🇦🇷 Argentina   5 (10%)       CDMX          5  │   │
│  │  🇨🇴 Colombia    3 (6%)        Buenos Aires  3  │   │
│  │  🇨🇱 Chile       2 (4%)        Bogotá        2  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Componentes

### 1. Embudo mejorado (FunnelChart)

El embudo actual se mantiene pero se mejora:
- Barras horizontales con ancho proporcional
- Color: terracotta con opacidad decreciente (100%, 75%, 50%, 25%)
- Porcentaje respecto al nivel anterior (no al total)
- Animación: barras se llenan de izquierda a derecha al cargar (300ms stagger)
- Tooltip al hover: "38 de 48 dieron su email (79%)"

### 2. Tendencias (TrendsChart)

Gráfico de línea/área mostrando diagnósticos por día.

**Implementación:** SVG dibujado con JavaScript (no librería de charts). Es un gráfico simple:
- Eje X: días (últimos N según periodo)
- Eje Y: count de diagnósticos
- Área rellena bajo la línea (terracotta con 10% opacidad)
- Línea de diagnósticos (terracotta, 2px)
- Línea de conversiones (verde --color-cta, 1px, más fina)
- Puntos en cada dato (hover muestra tooltip con fecha + count)

**Datos:** Agrupar diagnósticos por día de `created_at`. Agrupar pagos por día.

Si SVG custom es demasiado complejo, usar barras verticales simples (bar chart) — igualmente efectivo y más fácil de implementar.

### 3. Distribución de perfiles (ProfileDistribution)

Barras horizontales, una por perfil:
- PC — color #B45A32 (terracotta)
- FI — color #4A6FA5 (azul acero)
- CE — color #7B8F6A (verde oliva)
- CP — color #8B7355 (marrón arena)

Porcentaje + barra proporcional + label.

### 4. Dimensiones colectivas (DimensionAverages)

5 barras horizontales con el promedio de cada dimensión:
- Color por rango: rojo (< 40), naranja (40-60), verde (> 60)
- Score numérico a la derecha
- Insight automático al final: "El X% de tus leads tienen [dimensión] como peor dimensión"

El insight se calcula: contar cuántos leads tienen cada dimensión como la más baja, mostrar la más frecuente.

### 5. Mapa geográfico (GeoMap)

**SVG del mundo simplificado** con puntos por país.

**Approach recomendado:** Usar un SVG del mundo pre-hecho (simplificado, solo paths de países) y posicionar puntos según coordenadas de centroide de cada país.

**Centroides de países principales (lat, lng → SVG coords):**
```typescript
const COUNTRY_CENTROIDS: Record<string, { x: number; y: number }> = {
  ES: { x: 480, y: 165 },  // España
  MX: { x: 175, y: 210 },  // México
  AR: { x: 265, y: 350 },  // Argentina
  CO: { x: 225, y: 245 },  // Colombia
  CL: { x: 245, y: 340 },  // Chile
  US: { x: 165, y: 170 },  // USA
  // ... añadir más según necesidad
}
```

**Si el SVG del mundo es demasiado complejo:** Usar una versión simple con solo puntos posicionados en un mapa esquemático (estilo Vercel — puntos sobre silueta de continentes en gris). O incluso solo la tabla de países sin mapa visual.

**Tablas laterales:**
- Top 5 países con flag emoji + nombre + count + %
- Top 5 ciudades con nombre + país + count

### 6. Selector de periodo

Tabs/chips en la parte superior: 7d, 30d, 90d, Todo.
Al cambiar, se recargan TODOS los datos de la página.

---

## API

Usa las APIs existentes:
- `/api/admin/analytics?period=X` — embudo + métricas + perfiles + dimensiones
- `/api/admin/geo?period=X` — datos geográficos

Puede ser necesario extender `/api/admin/analytics` para incluir:
- `daily_counts`: Array de { date: string, diagnostics: number, conversions: number } para tendencias
- `worst_dimension_distribution`: { d1: 12, d2: 23, d3: 8, d4: 3, d5: 2 } para insight

---

## Archivos a crear
- `src/app/admin/analytics/page.tsx` — Refactorizar con AdminLayout
- `src/components/admin/AnalyticsFunnel.tsx` — Embudo mejorado
- `src/components/admin/AnalyticsTrends.tsx` — Gráfico de tendencias
- `src/components/admin/AnalyticsProfiles.tsx` — Distribución de perfiles
- `src/components/admin/AnalyticsDimensions.tsx` — Dimensiones colectivas
- `src/components/admin/AnalyticsGeo.tsx` — Mapa geográfico + tablas

## Archivos a modificar
- `src/app/api/admin/analytics/route.ts` — Añadir daily_counts y worst_dimension_distribution
- `src/app/admin/analytics/AnalyticsDashboard.tsx` — Puede reescribirse o reemplazarse

## Criterios de aceptación
- [ ] Embudo con barras proporcionales y porcentajes entre niveles
- [ ] Tendencias muestra diagnósticos por día con overlay de conversiones
- [ ] Distribución de perfiles con colores correctos por perfil
- [ ] Dimensiones colectivas con insight automático ("73% tienen Sueño como peor")
- [ ] Mapa geográfico muestra puntos por país (o al menos tabla de países + ciudades)
- [ ] Selector de periodo funciona para todos los componentes
- [ ] Responsive
- [ ] `npx tsc --noEmit` pasa sin errores

---

## PROMPT PARA CLAUDE CODE

```
Lee estos documentos ANTES de empezar (en este orden):

1. docs/sprints/admin-v2/00_MASTER_PLAN.md — contexto general
2. docs/sprints/admin-v2/SPRINT_6_ANALYTICS.md — este sprint completo
3. docs/DESIGN.md — tokens de diseño
4. src/app/admin/analytics/AnalyticsDashboard.tsx — dashboard actual (ver qué hay)
5. src/app/api/admin/analytics/route.ts — API actual (extender con daily_counts)
6. src/app/api/admin/geo/route.ts — API de geo (creada Sprint 0)
7. src/components/admin/AdminLayout.tsx — layout wrapper

CONTEXTO IMPORTANTE:
- Proyecto Next.js 15 con App Router + TypeScript
- NUNCA ejecutes npm run build. Usa npx tsc --noEmit
- NO instalar librerías de charts (recharts, chart.js, d3). Los gráficos son simples y se pueden hacer con SVG/CSS puro
- El embudo y las tendencias son los componentes más importantes
- El mapa geográfico es un nice-to-have visual. Si dibujar el SVG del mundo es muy complejo, usa solo las tablas de países/ciudades con flag emojis. Eso ya es útil para Javi
- Colores de perfil: PC=#B45A32, FI=#4A6FA5, CE=#7B8F6A, CP=#8B7355
- Colores de score: rojo (<40), naranja (40-60), verde (>60)
- Inline styles, CSS variables de DESIGN.md

TU TAREA: Ejecutar Sprint 6 — Analytics Enhanced.

1. Extender /api/admin/analytics para incluir daily_counts y worst_dimension_distribution
2. Refactorizar /admin/analytics para usar AdminLayout
3. Crear componentes: AnalyticsFunnel (mejorado), AnalyticsTrends, AnalyticsProfiles, AnalyticsDimensions, AnalyticsGeo
4. Selector de periodo (7d, 30d, 90d, Todo) que afecta a todos los componentes
5. El gráfico de tendencias puede ser SVG custom o barras CSS simples — lo que sea más claro
6. El mapa geo puede ser tabla + puntos SVG o solo tabla — prioriza utilidad sobre espectáculo
7. Responsive
8. npx tsc --noEmit
```
