# Sprint 1 — Sidebar + Admin Layout

## Objetivo
Reemplazar la navegación horizontal actual por un sidebar colapsable oscuro + nuevo layout wrapper que todas las páginas admin usan.

## Dependencias
- Sprint 0 completado (para que las rutas de leads existan)

## Duración estimada
1 sesión de Claude Code

---

## Diseño del Sidebar

### Estructura visual

```
┌────────────────────────────────────────────────────────┐
│ ┌──────┐                                               │
│ │      │                                               │
│ │ LOGO │  ← Logo Instituto Epigenético (icono)         │
│ │      │                                               │
│ ├──────┤                                               │
│ │  🏠  │  Hub           ← /admin                       │
│ │  👥  │  Leads         ← /admin/leads                 │
│ │  ⚡  │  Automations   ← /admin/automations           │
│ │  📊  │  Analytics     ← /admin/analytics             │
│ │  📅  │  Agenda        ← /admin/agenda                │
│ ├──────┤                                               │
│ │      │  (spacer)                                     │
│ ├──────┤                                               │
│ │  ⚙️  │  Tools         ← /admin/tools                 │
│ │  ◀▶  │  Toggle        ← Colapsar/expandir            │
│ └──────┘                                               │
└────────────────────────────────────────────────────────┘
```

### Tokens de diseño

```css
/* Sidebar */
--admin-sidebar-bg: #1E130F;          /* Espresso oscuro del DESIGN.md */
--admin-sidebar-width-collapsed: 64px;
--admin-sidebar-width-expanded: 220px;
--admin-sidebar-text: #F9F1DE;         /* Cream claro */
--admin-sidebar-text-muted: rgba(249, 241, 222, 0.5);
--admin-sidebar-active-bg: rgba(180, 90, 50, 0.15);  /* Terracotta subtle */
--admin-sidebar-active-text: #B45A32;  /* Terracotta accent */
--admin-sidebar-hover-bg: rgba(249, 241, 222, 0.06);
--admin-sidebar-badge-bg: #E74C3C;    /* Rojo para badges */
--admin-sidebar-badge-text: #FFFFFF;
--admin-sidebar-transition: 200ms cubic-bezier(0.16, 1, 0.3, 1);

/* Content area */
--admin-content-bg: var(--color-bg-primary);  /* #FFFBEF cream */
--admin-content-max-width: 1120px;
--admin-content-padding: var(--space-8);
```

### Estados del sidebar

**Colapsado (default en desktop):**
- Ancho: 64px
- Muestra: Icono centrado
- Hover sobre icono: Tooltip con nombre
- Hover sobre sidebar: Se expande temporalmente (200ms)

**Expandido:**
- Ancho: 220px
- Muestra: Icono + label
- Toggle con botón inferior o clic en borde
- Se guarda preferencia en localStorage

**Mobile (< 768px):**
- Sidebar NO se muestra
- Bottom bar fija con 5 iconos (Hub, Leads, Automations, Analytics, Agenda)
- Tools accesible desde menú del Hub
- Altura: 56px
- Background: #1E130F
- Safe area para iPhone (padding-bottom: env(safe-area-inset-bottom))

### Iconos

Usar SVG inline (no emojis en producción). Iconos simples, línea fina, estilo consistente:

```
Hub:          <Home /> o grid/dashboard icon
Leads:        <Users /> o people icon
Automations:  <Zap /> o lightning/workflow icon
Analytics:    <BarChart3 /> o chart icon
Agenda:       <Calendar /> o calendar icon
Tools:        <Settings /> o gear icon
Toggle:       <ChevronLeft /> / <ChevronRight />
```

**NO instalar librerías de iconos.** Crear componentes SVG inline simples o usar SVGs del proyecto.

### Badges de notificación

- **Leads:** Punto rojo si hay leads con `heat.level === 'hot'` que no tienen acción personal reciente
- **Agenda:** Punto verde si hay sesión confirmada HOY
- Badges: círculo de 8px, posición absoluta top-right del icono

---

## Layout Wrapper

### Crear `src/components/admin/AdminLayout.tsx`

Componente wrapper que incluye sidebar + content area. Todas las páginas admin lo usan.

```tsx
// Pseudo-estructura:
<div className="admin-layout">
  <AdminSidebar
    collapsed={collapsed}
    onToggle={toggle}
    activePath={pathname}
    badges={{ leads: hotLeadsCount, agenda: hasSessionToday }}
  />
  <main className="admin-content">
    {children}
  </main>
</div>
```

**El sidebar consulta:**
- `/api/admin/leads?filter=hot&period=7d` → para badge de leads calientes
- `/api/admin/disponibilidad` → para badge de sesión hoy

Estas consultas se hacen con SWR o simple fetch con cache de 60 segundos. No bloquean el render.

### Auth wrapper

Mover la lógica de autenticación actual (`sessionStorage.getItem('admin_secret')`) al layout.

```tsx
// AdminLayout verifica auth:
// 1. Si no está autenticado → muestra login screen (la actual)
// 2. Si está autenticado → muestra sidebar + content
```

### CSS Module o CSS-in-JS

El proyecto usa inline styles. Mantener consistencia. Pero para el sidebar, donde hay muchos estados, considerar un CSS Module (`AdminLayout.module.css`) para legibilidad. Decisión del implementador.

---

## Páginas a crear/mover

### Nuevas rutas:

| Ruta actual | Ruta nueva | Acción |
|-------------|-----------|--------|
| `/admin` | `/admin` | Refactorizar como Hub (Sprint 2) |
| `/admin/analytics` | `/admin/analytics` | Mantener ruta, cambiar layout |
| `/admin/disponibilidad` | `/admin/agenda` | Renombrar + redirect |
| `/admin/fast-forward` | `/admin/tools` | Mover |
| — | `/admin/leads` | Crear (Sprint 3) |
| — | `/admin/automations` | Crear (Sprint 5) |

### En este sprint:
1. Crear `AdminSidebar.tsx` (componente sidebar completo)
2. Crear `AdminLayout.tsx` (wrapper con auth + sidebar + content)
3. Crear `AdminBottomBar.tsx` (mobile nav)
4. Refactorizar TODAS las páginas admin existentes para usar `AdminLayout` en vez de `SiteHeader + AdminNav`
5. Crear redirect de `/admin/disponibilidad` → `/admin/agenda`
6. Crear placeholders para rutas nuevas (leads, automations, tools)

---

## Archivos a crear
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/components/admin/AdminBottomBar.tsx`
- `src/components/admin/AdminIcons.tsx` — SVG icons como componentes
- `src/app/admin/agenda/page.tsx` — Copiar contenido de disponibilidad
- `src/app/admin/tools/page.tsx` — Copiar contenido de fast-forward
- `src/app/admin/leads/page.tsx` — Placeholder
- `src/app/admin/automations/page.tsx` — Placeholder

## Archivos a modificar
- `src/app/admin/page.tsx` — Usar AdminLayout, quitar SiteHeader/AdminNav
- `src/app/admin/analytics/page.tsx` — Usar AdminLayout
- `src/app/admin/disponibilidad/page.tsx` — Redirect a /admin/agenda
- `src/app/admin/fast-forward/page.tsx` — Redirect a /admin/tools

## Archivos a eliminar (después de crear redirects)
- `src/components/admin/AdminNav.tsx` — Reemplazado por AdminSidebar

## Criterios de aceptación
- [ ] Sidebar se renderiza en todas las páginas admin
- [ ] Sidebar se colapsa/expande con animación suave (200ms)
- [ ] Icono activo resaltado con color terracotta
- [ ] Mobile muestra bottom bar en vez de sidebar
- [ ] Auth funciona desde AdminLayout (login centra pantalla sin sidebar)
- [ ] Todas las páginas admin existentes usan AdminLayout
- [ ] Placeholders para leads, automations, tools están creados
- [ ] Redirect de /admin/disponibilidad → /admin/agenda funciona
- [ ] `npx tsc --noEmit` pasa sin errores

---

## PROMPT PARA CLAUDE CODE

```
Lee estos documentos ANTES de empezar (en este orden):

1. docs/sprints/admin-v2/00_MASTER_PLAN.md — contexto general
2. docs/sprints/admin-v2/SPRINT_1_SIDEBAR_LAYOUT.md — este sprint completo
3. docs/DESIGN.md — tokens de diseño (TODA la paleta, tipografía, spacing)
4. src/components/admin/AdminNav.tsx — nav actual a reemplazar
5. src/app/admin/page.tsx — página admin actual (tiene auth logic)
6. src/app/admin/analytics/page.tsx — ejemplo de página admin actual
7. src/app/admin/disponibilidad/page.tsx — disponibilidad actual
8. src/app/admin/fast-forward/page.tsx — fast-forward actual

CONTEXTO IMPORTANTE:
- Proyecto Next.js 15 con App Router + TypeScript
- NUNCA ejecutes npm run build (OOM). Usa npx tsc --noEmit para verificar tipos
- El proyecto usa inline styles (no Tailwind). Mantener ese patrón, aunque para el sidebar puedes crear un CSS Module si mejora legibilidad
- Todos los colores/spacing/fonts vienen de CSS custom properties definidas en globals.css. NUNCA hardcodear valores que no estén en DESIGN.md
- El sidebar oscuro usa #1E130F (--color-bg-dark del DESIGN.md) con texto cream claro
- El accent es terracotta #B45A32 (--color-accent). NUNCA usar #4ADE80 que es el CTA color
- Mobile breakpoint: < 768px

TU TAREA: Ejecutar Sprint 1 — Sidebar + Admin Layout.

1. Crear AdminIcons.tsx con SVG icons inline (Home, Users, Zap, BarChart3, Calendar, Settings, ChevronLeft/Right). Simples, línea fina (strokeWidth 1.5-2), 20x20px viewbox. NO instalar lucide-react ni ninguna librería de iconos.

2. Crear AdminSidebar.tsx:
   - Sidebar oscuro vertical con los 6 items del plan
   - Estado colapsado (64px, solo iconos) y expandido (220px, icono + label)
   - Toggle con botón inferior
   - Estado guardado en localStorage ('admin_sidebar_collapsed')
   - Badges de notificación (rojo para leads calientes, verde para sesión hoy)
   - Las badges se alimentan de fetch a /api/admin/leads?filter=hot y /api/admin/disponibilidad
   - Transición 200ms ease-out-expo
   - Hover sobre sidebar colapsado: expande temporalmente

3. Crear AdminBottomBar.tsx:
   - Bottom navigation para mobile (< 768px)
   - 5 iconos: Hub, Leads, Automations, Analytics, Agenda
   - Fondo #1E130F, icono activo en terracotta
   - Safe area padding para iPhone

4. Crear AdminLayout.tsx:
   - Wrapper que incluye auth check + sidebar + content
   - Si no autenticado: muestra login screen (reusar la lógica actual de admin/page.tsx)
   - Si autenticado: sidebar + content area
   - Content area: max-width 1120px, padding var(--space-8), bg var(--color-bg-primary)
   - En mobile: muestra AdminBottomBar en vez de sidebar

5. Refactorizar TODAS las páginas admin para usar AdminLayout:
   - /admin/page.tsx → quitar SiteHeader, AdminNav, auth logic. Solo contenido del hub
   - /admin/analytics/page.tsx → quitar SiteHeader, AdminNav. Solo AnalyticsDashboard
   - /admin/disponibilidad/page.tsx → redirect a /admin/agenda
   - /admin/fast-forward/page.tsx → redirect a /admin/tools

6. Crear nuevas páginas:
   - /admin/agenda/page.tsx → copiar contenido de disponibilidad, usar AdminLayout
   - /admin/tools/page.tsx → copiar contenido de fast-forward, usar AdminLayout
   - /admin/leads/page.tsx → placeholder "Leads — próximamente"
   - /admin/automations/page.tsx → placeholder "Automations — próximamente"

7. Verificar con npx tsc --noEmit que todo compila

REGLA VISUAL: El sidebar es el ÚNICO elemento oscuro del admin. El content area mantiene el fondo cream (#FFFBEF) de siempre. El contraste sidebar oscuro / content claro es intencional — separa navegación de contenido.
```
