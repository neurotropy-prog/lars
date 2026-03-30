# Sprint 7 — Agenda + Polish Final

## Objetivo
Mejorar la página de disponibilidad (renombrada a "Agenda"), añadir polish visual y garantizar que todo el admin funciona en mobile.

## Dependencias
- Sprint 1 (AdminLayout + sidebar)
- Todas las páginas anteriores construidas

## Duración estimada
1 sesión de Claude Code

---

## Parte 1: Agenda mejorada

### Mejoras sobre la página de disponibilidad actual

#### 1. Vista de "Hoy" prominente

Si Javi tiene sesiones hoy, mostrar prominentemente:

```
┌─────────────────────────────────────────────────────┐
│  Hoy, miércoles 25 de marzo                         │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  10:30 — maria@ejemplo.com                   │    │
│  │  Productivo Colapsado · Score 28 · Día 8     │    │
│  │  💡 Este perfil viene preparado con preguntas │    │
│  │     de eficiencia. Habla en lenguaje de       │    │
│  │     rendimiento y datos.                      │    │
│  │  [Ver lead] [Google Meet →]                   │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  Sin más sesiones hoy.                               │
└─────────────────────────────────────────────────────┘
```

**Clave:** La sesión de hoy muestra **context del lead** usando profile-intelligence. Así Javi sabe cómo abordar la sesión ANTES de entrar.

#### 2. Vista semanal (mini-calendario)

Grid de 7 días (lun-dom) mostrando slots bloqueados, sesiones confirmadas y disponibilidad:

```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Lun │ Mar │ Mié │ Jue │ Vie │ Sáb │ Dom │
│ 24  │ 25  │ 26  │ 27  │ 28  │ 29  │ 30  │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │ 📅  │     │ 📅  │     │     │     │
│     │10:30│     │16:00│     │ OFF │ OFF │
│     │     │     │     │     │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

📅 = sesión confirmada (clic → detalle)
OFF = día bloqueado

#### 3. Sesiones con contexto de perfil

En la lista de próximas sesiones (que ya existe), añadir badge de perfil y mini-insight:

```
maría@ejemplo.com · Mié 26 10:30
PC · Score 28 · "Vendrá con preguntas de eficiencia"
[Completar] [Cancelar] [No-show] [Notas]
```

#### 4. Mantener todo lo existente

- Configuración de horarios semanales (M-V 09:00-13:00, 16:00-19:00)
- Bloqueo de fechas/horas específicas
- Buffer de 10 minutos
- Historial de sesiones (completada/cancelada/no-show + notas)

---

## Parte 2: Polish visual

### Transiciones entre páginas

Añadir transición suave al navegar entre secciones del admin:
- Fade-in del contenido al cargar (200ms)
- Los datos se cargan con skeleton screens

### Loading states

Verificar que TODAS las páginas tienen skeleton screens:
- Hub: cards con skeleton, alertas con skeleton
- LAM: tabla con skeleton rows
- Automations: nodos con skeleton
- Analytics: gráficos con skeleton
- Agenda: calendario con skeleton

### Estados vacíos

Verificar que TODOS los estados vacíos están diseñados:
- Hub sin alertas: "Todo en orden ✓"
- LAM sin leads: "No hay leads en este periodo. Cuando alguien complete el gateway, aparecerá aquí."
- Analytics sin datos: "Aún no hay datos suficientes. Los gráficos aparecerán cuando haya al menos 5 diagnósticos."
- Agenda sin sesiones: "No hay sesiones próximas. Cuando alguien agende, la verás aquí."

### Responsive final

Verificar TODAS las páginas en:
- Mobile 375px (iPhone SE)
- Mobile 390px (iPhone 14)
- Tablet 768px
- Desktop 1024px
- Desktop 1440px

Checklist responsive:
- [ ] Sidebar → Bottom bar en mobile
- [ ] Hub: grid 2 → 1 columna
- [ ] LAM: tabla scrollable horizontal o cards en mobile
- [ ] Panel lateral: full-screen en mobile
- [ ] Automations: flujo legible sin scroll horizontal
- [ ] Analytics: gráficos se adaptan
- [ ] Agenda: calendario se simplifica en mobile

### Microinteracciones

- Hover en filas de la tabla LAM: background sutil
- Hover en cards del Hub: elevación sutil
- Click feedback: scale 0.98 → 1.0 (50ms)
- Toggle del sidebar: animación suave
- Badges: pulse animation sutil al cargar si hay notificación

---

## Parte 3: Verificación final

### Checklist de calidad (product-philosophy)

Para CADA página del admin:

**A. Siguiente paso:**
- [ ] ¿Después de cada acción, Javi sabe qué hacer?
- [ ] ¿Hay algún punto donde puede quedarse perdido?
- [ ] ¿Acción principal obvia en < 3 segundos?

**B. Fricción:**
- [ ] ¿Se puede hacer en menos pasos?
- [ ] ¿Hay valores por defecto inteligentes?

**C. Interfaz:**
- [ ] ¿Se entiende sin explicación?
- [ ] ¿Todo tiene propósito?
- [ ] ¿Estados vacíos diseñados?

**D. Experiencia:**
- [ ] ¿Loading states con skeleton?
- [ ] ¿Errores con qué/por qué/qué hacer?
- [ ] ¿Microinteracciones definidas?

**E. Diseño visual:**
- [ ] ¿Valores del sistema de diseño (DESIGN.md)?
- [ ] ¿Jerarquía clara?
- [ ] ¿Componentes consistentes?

---

## Archivos a crear
- (Ninguno nuevo principal — es refinamiento)

## Archivos a modificar
- `src/app/admin/agenda/page.tsx` — Añadir vista de "Hoy" + mini-calendario + contexto de perfil
- Todas las páginas admin — Skeleton states, estados vacíos, responsive fixes
- `src/components/admin/AdminSidebar.tsx` — Polish de animaciones
- `src/components/admin/AdminBottomBar.tsx` — Polish de animaciones

## Criterios de aceptación
- [ ] Agenda muestra sesiones de hoy con contexto de perfil
- [ ] Mini-calendario semanal funciona
- [ ] Todas las páginas tienen skeleton loading
- [ ] Todos los estados vacíos están diseñados
- [ ] Responsive verificado en 375px, 768px, 1024px, 1440px
- [ ] Transiciones suaves entre páginas
- [ ] Microinteracciones en hover/click
- [ ] NO hay tooltips explicativos (si algo necesita tooltip, se rediseña)
- [ ] NO hay texto placeholder o "Lorem ipsum" en ningún lado
- [ ] `npx tsc --noEmit` pasa sin errores

---

## PROMPT PARA CLAUDE CODE

```
Lee estos documentos ANTES de empezar (en este orden):

1. docs/sprints/admin-v2/00_MASTER_PLAN.md — contexto general
2. docs/sprints/admin-v2/SPRINT_7_AGENDA_POLISH.md — este sprint completo
3. docs/DESIGN.md — tokens de diseño
4. docs/ANIMATIONS.md — specs de animaciones (para inspirar micro-interacciones)
5. src/lib/profile-intelligence.ts — para contexto de perfil en sesiones
6. src/app/admin/agenda/page.tsx — Agenda actual
7. src/app/admin/disponibilidad/page.tsx — Disponibilidad original (si aún existe)
8. Revisa TODAS las páginas del admin para verificar estados

CONTEXTO IMPORTANTE:
- Proyecto Next.js 15 con App Router + TypeScript
- NUNCA ejecutes npm run build. Usa npx tsc --noEmit
- Este sprint es 50% mejora de Agenda + 50% polish del admin completo
- La clave de la Agenda mejorada: cuando Javi ve su sesión de hoy, también ve CONTEXTO del lead (perfil, score, cómo hablarle). Eso viene de profile-intelligence.ts
- Loading: skeleton screens SIEMPRE. Nunca spinner genérico ni pantalla en blanco
- Estados vacíos: SIEMPRE con diseño intencional y texto que guía
- Responsive: bottom bar en mobile, sidebar en desktop. Verificar TODAS las páginas
- Microinteracciones: sutiles, con propósito. Ease-out-expo para todo

TU TAREA: Ejecutar Sprint 7 — Agenda + Polish.

1. Mejorar /admin/agenda:
   - Sección "Hoy" con sesiones del día + contexto de perfil del lead
   - Mini-calendario semanal
   - Sesiones con badge de perfil + mini-insight de cómo abordar

2. Polish de TODAS las páginas admin:
   - Verificar skeleton loading en cada página
   - Verificar estados vacíos en cada página
   - Verificar responsive (375px, 768px, 1024px, 1440px)
   - Añadir micro-interacciones: hover en filas, hover en cards, click feedback
   - Transición fade-in al cargar contenido de cada página

3. Verificar flujo completo:
   - Navegar por TODAS las secciones
   - Abrir un lead en el LAM → ver panel → tomar acción → verificar
   - Ver automations → expandir preview
   - Ver analytics → cambiar periodo
   - Ver agenda → ver sesión de hoy

4. npx tsc --noEmit
```
