# Sprint 3 — LAM (Lead Acquisition Manager)

## Objetivo
Construir la vista de leads: tabla inteligente ordenada por "temperatura" + panel lateral con detalle completo, timeline de acciones, interpretación de perfil y acción sugerida.

## Dependencias
- Sprint 0 (APIs de leads + profile intelligence)
- Sprint 1 (AdminLayout)

## Duración estimada
1 sesión de Claude Code

---

## Vista principal: Tabla inteligente

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Leads                                     🔍 Buscar email  │
│  42 leads activos · últimos 30 días                         │
│                                                              │
│  [Todos] [🔥 Calientes 4] [Con email] [Pagados] [Baja]     │
│                                                              │
│  ┌────┬─────────────────┬───────┬──────┬─────┬──────┬──────┐│
│  │    │ Lead            │ Score │ Perfil│ Día │ Mapa │Estado││
│  ├────┼─────────────────┼───────┼──────┼─────┼──────┼──────┤│
│  │🔥🔥🔥│ maria@ejem...  │  28   │ PC   │  8  │  3x  │ d7  ││
│  │🔥🔥 │ carlos@ej...   │  45   │ FI   │  11 │  1x  │ d10 ││
│  │🔥🔥 │ ana@ejemplo... │  33   │ CE   │  14 │  2x  │ d14 ││
│  │🔥  │ pedro@ejem...   │  52   │ CP   │  22 │  0x  │ d21 ││
│  │ 💚 │ lucia@ejem...   │  31   │ PC   │   5 │  2x  │PAGÓ ││
│  │ ── │ jose@ejemplo..  │  48   │ FI   │  35 │  0x  │BAJA ││
│  └────┴─────────────────┴───────┴──────┴─────┴──────┴──────┘│
│                                                              │
│  ← 1 2 3 →   20 por página                                 │
└─────────────────────────────────────────────────────────────┘
```

### Columnas

| Columna | Contenido | Ancho |
|---------|-----------|-------|
| Heat | Indicadores de temperatura (🔥 puntos o barra) | 48px |
| Lead | Email (truncado si largo) | flex |
| Score | Número + color (rojo < 40, naranja 40-60, verde > 60) | 64px |
| Perfil | Badge corto: PC, FI, CE, CP con color | 64px |
| Día | Días desde diagnóstico | 48px |
| Mapa | Nº de visitas al mapa | 48px |
| Estado | Último hito del funnel | 80px |

### Filtros

Tabs/chips en la parte superior:
- **Todos** — Sin filtro
- **🔥 Calientes** — heat.level === 'hot' (con badge del count)
- **Con email** — email_captured === true
- **Pagados** — converted_week1 === true
- **Baja** — unsubscribed === true

### Búsqueda

Input de búsqueda por email. Filtro en tiempo real (client-side sobre datos cargados).

### Paginación

20 leads por página. Botones prev/next + número de página.

### Sorting

Por defecto: heat desc → fecha desc.
Click en header de columna para cambiar sort.

---

## Panel lateral: Detalle del lead

Al hacer clic en una fila → se abre un panel lateral a la derecha (slide-in, 400px de ancho, con overlay sutil en el contenido de atrás).

### Estructura del panel

```
┌──────────────────────────────┐
│  ← Cerrar          maria@..  │
│                              │
│  ┌──────────────────────────┐│
│  │ Productivo Colapsado      ││
│  │ Score: 28 · Crítico       ││
│  │ Día 8 desde diagnóstico   ││
│  │ 🔥🔥🔥 Lead caliente       ││
│  └──────────────────────────┘│
│                              │
│  ── Dimensiones ──           │
│  D1 Regulación     22 ▓░░░░ │
│  D2 Sueño          35 ▓▓░░░ │
│  D3 Claridad       41 ▓▓░░░ │
│  D4 Emocional      28 ▓░░░░ │
│  D5 Alegría        19 ▓░░░░ │
│                              │
│  ── Lo que está pasando ──   │
│  (interpretación del perfil) │
│  "Este perfil se identifica  │
│  con el rendimiento. Está    │
│  viendo los datos y pensando │
│  'yo puedo solo'..."         │
│                              │
│  ── Acción sugerida ──       │
│  🎬 Graba un video de 60s    │
│  hablándole a su situación   │
│  específica.                 │
│  [Tomar acción →]            │
│                              │
│  ── Timeline ──              │
│  📋 23 mar  Completó gateway │
│  📧 23 mar  Email d0 ✅Abier│
│  👁️ 23 mar  Visitó mapa (1x)│
│  📧 26 mar  Email d3 ✅Abier│
│  🧬 26 mar  Arquetipo unlock │
│  👁️ 27 mar  Visitó mapa (2x)│
│  📧 30 mar  Email d7 ❌No ab│
│  👁️ 31 mar  Visitó mapa (3x)│
│                              │
│  ── Emails ──                │
│  ✅ d0  ✅ d3  ❌ d7         │
│  ⏳ d10 (mañana)             │
│                              │
│  ── Acciones de Javi ──      │
│  (vacío - ninguna acción aún)│
│                              │
│  [Ver mapa →]                │
└──────────────────────────────┘
```

### Secciones del panel

**1. Header:** Email, perfil (label completo + badge color), score + label, días, nivel de calor

**2. Dimensiones:** 5 barras horizontales mini con score numérico. Colores: rojo (< 40), naranja (40-60), verde (> 60)

**3. "Lo que está pasando":** Texto generado por profile-intelligence basado en el comportamiento actual del lead. Usa los `behaviors` del perfil correspondiente al patrón observado.

**4. Acción sugerida:** Card destacada con borde terracotta. Muestra la acción recomendada + razón. Botón "Tomar acción" que abre modal de acción (Sprint 4).

**5. Timeline:** Lista cronológica de todos los eventos del lead. Iconos por tipo. Estados de email (✅ abierto, ❌ no abierto, ⏳ pendiente).

**6. Emails:** Vista rápida del estado de cada email automático.

**7. Acciones de Javi:** Historial de acciones manuales previas (si las hay).

**8. Links:** "Ver mapa" abre nueva pestaña con el mapa vivo del lead.

---

## Detalles de interacción

### Abrir panel
- Clic en fila → panel slide-in desde la derecha
- Animación: 200ms ease-out-expo
- La tabla se comprime ligeramente o un overlay sutil oscurece

### Cerrar panel
- Botón X en el panel
- Clic fuera del panel
- Tecla Escape

### Deep link
- URL param: `/admin/leads?detail=HASH`
- Si la URL tiene `detail`, el panel se abre automáticamente

### Responsive
- Desktop: panel lateral (400px)
- Mobile: panel full-screen con botón "← Volver a leads"

---

## Colores de perfil (badges)

```css
/* Para badges de perfil en la tabla */
--profile-pc: #B45A32;  /* Terracotta — Productivo Colapsado */
--profile-fi: #4A6FA5;  /* Azul acero — Fuerte Invisible */
--profile-ce: #7B8F6A;  /* Verde oliva — Cuidador Exhausto */
--profile-cp: #8B7355;  /* Marrón arena — Controlador Paralizado */
```

---

## Archivos a crear
- `src/app/admin/leads/page.tsx` — Página LAM (reemplazar placeholder)
- `src/components/admin/LeadsTable.tsx` — Tabla con filtros, búsqueda, paginación
- `src/components/admin/LeadDetailPanel.tsx` — Panel lateral completo
- `src/components/admin/LeadTimeline.tsx` — Timeline de eventos del lead
- `src/components/admin/LeadDimensions.tsx` — Mini barras de dimensiones
- `src/components/admin/LeadEmailStatus.tsx` — Estado visual de emails
- `src/components/admin/HeatIndicator.tsx` — Indicador visual de temperatura

## Archivos a modificar
- Ninguno

## Criterios de aceptación
- [ ] Tabla muestra todos los leads ordenados por heat score
- [ ] Filtros funcionan (Todos, Calientes, Con email, Pagados, Baja)
- [ ] Búsqueda por email filtra en tiempo real
- [ ] Click en fila abre panel lateral con slide-in animation
- [ ] Panel muestra: perfil, dimensiones, interpretación, acción sugerida, timeline, emails
- [ ] La interpretación de comportamiento usa profile-intelligence.ts
- [ ] Deep link con ?detail=HASH funciona
- [ ] Responsive: panel lateral en desktop, full-screen en mobile
- [ ] Loading states con skeleton screens
- [ ] Estado vacío: "No hay leads en este periodo" con diseño intencional
- [ ] `npx tsc --noEmit` pasa sin errores

---

## PROMPT PARA CLAUDE CODE

```
Lee estos documentos ANTES de empezar (en este orden):

1. docs/sprints/admin-v2/00_MASTER_PLAN.md — contexto general
2. docs/sprints/admin-v2/SPRINT_3_LAM.md — este sprint completo
3. docs/DESIGN.md — tokens de diseño
4. src/lib/profile-intelligence.ts — motor de inteligencia (LÉELO ENTERO)
5. src/app/api/admin/leads/route.ts — API de leads (creada Sprint 0)
6. src/app/api/admin/leads/[hash]/route.ts — API detalle lead
7. src/components/admin/AdminLayout.tsx — layout wrapper

CONTEXTO IMPORTANTE:
- Proyecto Next.js 15 con App Router + TypeScript
- NUNCA ejecutes npm run build. Usa npx tsc --noEmit
- El LAM es donde Javi pasa más tiempo después del Hub
- La tabla ordena por "temperatura" — leads calientes arriba, fríos abajo
- El panel lateral es el corazón del LAM — ahí Javi entiende al lead
- La sección "Lo que está pasando" usa profile-intelligence.ts para generar NARRATIVA CLÍNICA basada en el perfil + comportamiento. NO mostrar datos crudos.
- La acción sugerida viene de getSuggestedAction() del profile-intelligence.ts
- Inline styles, CSS variables de DESIGN.md
- Colores de perfil: PC=#B45A32, FI=#4A6FA5, CE=#7B8F6A, CP=#8B7355
- Colores de score: rojo (<40)=var(--color-error), naranja (40-60)=#D97706, verde (>60)=#059669

TU TAREA: Ejecutar Sprint 3 — LAM (Lead Acquisition Manager).

1. Reemplazar placeholder de /admin/leads con página LAM completa
2. Crear LeadsTable con filtros, búsqueda, paginación, sorting por heat
3. Crear LeadDetailPanel que se abre como slide-in lateral al clicar una fila
4. El panel incluye: header con perfil, dimensiones mini, interpretación de perfil, acción sugerida, timeline, estado de emails, acciones previas de Javi
5. Deep link con ?detail=HASH
6. Mobile: panel full-screen
7. Skeleton loading states
8. Estado vacío diseñado
9. npx tsc --noEmit

REGLA: El panel lateral NO es una ficha técnica. Es una NARRATIVA que ayuda a Javi a entender qué pasa con esta persona y qué puede hacer. "María está en un loop de decisión porque su ego de rendimiento le dice que puede solo" es infinitamente más útil que "map_visits: 3, converted: false".
```
