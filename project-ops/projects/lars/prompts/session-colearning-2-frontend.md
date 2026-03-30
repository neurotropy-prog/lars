## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión COLEARNING-2: Frontend del co-learning — Panel de admin con acciones pendientes y aprovación con razonamiento

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño visual
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Los 4 perfiles y su lenguaje
- `docs/DATABASE.md` — Schema actual
- Sesión anterior: COLEARNING-1 Backend (debe estar completa — API de sugerencias, scoring, razonamiento)

## Lo que ya está construido
- Gateway con 10 preguntas
- Mapa vivo con evoluciones
- Admin con Hub, LAM, etc.
- Backend de co-learning con sugerencias automáticas basadas en perfil + datos
- Tabla `colearning_suggestions` con campos: `id`, `user_id`, `suggestion_text`, `reasoning`, `action_type`, `confidence_score`, `profile_type`, `status`, `created_at`

## Tu tarea

Lee la documentación de COLEARNING-1 (backend). Esta sesión construye la **interfaz del admin donde Javier revisa, aprueba, modifica y rechaza las sugerencias** que el sistema generó automáticamente.

El panel es exclusivo para Javier (admin-only) y permite:
1. Ver acciones pendientes de aprobación (grouped por type: hábito, micro-espejo, email, etc.)
2. Ver el razonamiento del sistema (por qué sugirió esto — datos, patrón, perfil)
3. Aprobar tal cual
4. Modificar el contenido antes de aprobar
5. Rechazar (con opcional nota de por qué)
6. Si modifica contra la inteligencia del perfil, el sistema sugiere alternativa con datos
7. Resumen diario de acciones auto-ejecutadas + pendientes

Implementa en dos fases:
**FASE VISUAL:** Construye todas las pantallas con datos ficticios. Avísame cuando esté listo para revisar.
**FASE FUNCIONAL:** Solo después de mi aprobación visual, conecta la funcionalidad real.

### Tarea 1: Sección COLEARNING en admin

Nuevas rutas:
- `/admin/colearning` — Panel principal con listado de acciones pendientes
- `/admin/colearning/[id]` — Detalle de una acción (ver razonamiento, aprobar/modificar/rechazar)
- `/admin/colearning/history` — Historial de acciones ejecutadas (últimos 30 días)

### Tarea 2: Vista de "Acciones pendientes" (`/admin/colearning`)

**Estructura visual:**

```
COLEARNING — APROBACIÓN PENDIENTE

Hoy: 12 acciones esperando tu decisión

[Filtros]
- Tipo de acción: Todos | Hábito | Micro-espejo | Email | Dimensión
- Perfil: Todos | Productivo Colapsado | Fuerte Invisible | ...
- Confianza: Todos | Alto (>75%) | Medio (50-75%) | Bajo (<50%)

[TABLA DE ACCIONES]

| Tipo | Usuario | Perfil | Acción | Confianza | Edad | [Detalles]
| -----| --------| -------| -------|-----------|------|----------
| 🔔 Email | María R. | FI | "Recordatorio análisis..." | 87% | 2h | [Ver →]
| 💡 Hábito | Juan M. | PC | "Micro-pausa Pomodoro" | 62% | 5h | [Ver →]
| 🪞 Micro | Sofia P. | CE | "Validación de cuidado" | 91% | 1h | [Ver →]
| 📊 Dimensión | Carlos L. | CP | "Foco en Sueño" | 54% | 8h | [Ver →]

**Acciones rápidas:**
- ✅ Aprobar
- 🏷️ Editar
- ❌ Rechazar
```

**Estilo:**
- Tabla responsiva (en móvil: cards expandibles)
- Código de color por tipo: 🔔=Email (azul), 💡=Hábito (verde), 🪞=Micro-espejo (púrpura), 📊=Dimensión (naranja)
- Confianza mostrada como barra visual (color: rojo <50%, amarillo 50-75%, verde >75%)
- Edad en texto humanizado ("2h", "hace 1 día")

### Tarea 3: Detalle de acción (`/admin/colearning/[id]`)

Al clickear "Ver →", abre la pantalla de detalle:

```
COLEARNING — DETALLE

[← Volver]

USUARIO: María Rodríguez (FI)
Diagnóstico: 2026-01-15 | 89 días en programa
Última actualización: Hoy 10:23

═════════════════════════════════════════════════════════════

ACCIÓN SUGERIDA

Tipo: 📧 Email de seguimiento
Confianza: 87% (Alto)
Edad: 2h desde que fue generada

Asunto: "Tu análisis de Semana 8: datos de progreso"

Cuerpo:
"María,

Tu Semana 8 muestra tendencias claras:
- Regulación Nerviosa: 28 → 41 (+46% mejora)
- Sueño: 22 → 35 (+59% mejora)
- Energía: subió 17 puntos

Percentil de progreso: 78% (por encima de la media).

Tu sesión esta semana es donde calibramos lo próximo.
"

═════════════════════════════════════════════════════════════

POR QUÉ SUGIERE ESTO (RAZONAMIENTO)

[Expandible con detalles técnicos]

📊 Datos que dispararon la sugerencia:
  • Perfil: Fuerte Invisible (lenguaje = números, datos, objetividad)
  • Patrón detectado: Mejora >50% en 2 dimensiones (día 56-63)
  • Timing óptimo: Semana 8 es cuando FI típicamente pasa de "escepticismo" a "confianza"
  • Histórico similar: 34 otros FI en mismo punto vieron 71% conversion a pago upgrade cuando vieron este tipo de email

🎯 Objetivo de la acción:
  Validar el progreso en idioma del usuario (datos, no narrativa)
  para mantener confianza alta en Semana 8-9.

═════════════════════════════════════════════════════════════

TUS OPCIONES

[✅ APROBAR AHORA]
  Envía este email en 1h

[🏷️ EDITAR Y APROBAR]
  Modifica antes de enviar

[⚠️ MODIFICADO — VALIDAR]
  (Aparece solo si editaste)
  El sistema detectó cambios contra el perfil.
  Ver sugerencia alternativa.

[❌ RECHAZAR]
  Descarta esta acción.
  (Opcional: nota interna)
```

### Tarea 4: Flujo de edición y validación

Si Javier hace click en **"🏷️ EDITAR Y APROBAR"**, aparece:

```
EDITAR ACCIÓN

[El mismo contenido, pero en campos editables]

Asunto: [input text, prellenado]
Cuerpo:  [textarea, prellenado]

[Guardar cambios]
```

Cuando guarda cambios, el sistema compara contra el perfil:

**SI LOS CAMBIOS SON COHERENTES CON EL PERFIL:**
```
✅ Cambios validados

Los cambios están alineados con el perfil Fuerte Invisible.
Lenguaje, datos, objetividad — todo coherente.

[✅ Aprobar ahora]
```

**SI LOS CAMBIOS VAN CONTRA EL PERFIL (ej: Javier agrega narrativa emotiva a un FI):**
```
⚠️ Atención: Cambios desalineados del perfil

Tu edit incluye:
  "Te entiendo, es difícil..." (narrativa emotiva)

Para Fuerte Invisible, esto NO es óptimo.
FI prefiere datos, números, análisis objetivo.

SUGERENCIA ALTERNATIVA:
Reemplaza eso por:
  "Tu análisis objetivo muestra..." (datos, no emoción)

¿Quieres aceptar la alternativa?
[✅ Usar sugerencia]  [➜ Seguir con mis cambios]
```

### Tarea 5: Rechazo con razonamiento

Si clickea **"❌ RECHAZAR"**:

```
RECHAZAR ACCIÓN

¿Por qué la rechazas?

[Selector opcional]
- Ya fue enviada (manual)
- No aplica en este momento
- Espero a (indicar día)
- Otra razón

[Nota interna]
[textarea — esto queda registrado en BD]

[❌ Confirmar rechazo]
```

El rechazo se registra en tabla `colearning_suggestions`:
- `status: 'rejected'`
- `rejection_reason: 'text'`
- `rejected_by: 'admin_user_id'`
- `rejected_at: timestamp`

### Tarea 6: Resumen diario (`/admin/colearning` — sección arriba)

Mostrar card destacada al tope:

```
RESUMEN DE HOY

Acciones procesadas: 47
  ✅ Aprobadas y ejecutadas: 38 (81%)
  🏷️ Modificadas y ejecutadas: 6 (13%)
  ⏳ Pendientes de decisión: 3 (6%)
  ❌ Rechazadas: 0

Tasa de aprobación: 94%
Confianza promedio de aprobadas: 78%

Distribución por tipo:
  🔔 Email: 28 | 💡 Hábito: 12 | 🪞 Micro: 6 | 📊 Dimensión: 1
```

Esto se actualiza en tiempo real (o cada 5 minutos).

### Tarea 7: Historial (`/admin/colearning/history`)

```
HISTORIAL — Acciones ejecutadas (últimos 30 días)

[Filtros iguales a /admin/colearning]

[TABLA]
| Fecha | Usuario | Tipo | Acción | Estado | Confianza | [Detalles]
| -----| --------| -----| -------|--------|-----------|----------
| Hoy 10:45 | María R. | Email | "Análisis Semana 8..." | ✅ Ejecutada | 87% | [Ver]
| Ayer 14:30 | Juan M. | Hábito | "Pomodoro + caminar" | ✅ Ejecutada | 71% | [Ver]
| 2 días | Sofia P. | Micro | "Validación" | ✅ Ejecutada | 91% | [Ver]
| 5 días | Carlos L. | Email | "Plan Semana 3" | 🏷️ Modificada | 54% | [Ver]
| 6 días | Ana G. | Hábito | "Meditación mañana" | ❌ Rechazada | 42% | [Ver]

Exportar CSV
```

### Tarea 8: Backend — Endpoints necesarios

Asume que COLEARNING-1 ya tiene:
- GET `/api/colearning/suggestions?status=pending`
- GET `/api/colearning/suggestions/[id]`
- GET `/api/colearning/reasoning?suggestion_id=X`

Nuevos endpoints para COLEARNING-2:
- POST `/api/colearning/suggestions/[id]/approve` — Aprueba y ejecuta
- POST `/api/colearning/suggestions/[id]/modify` — Edita y aprueba
- POST `/api/colearning/suggestions/[id]/validate-edit` — Compara cambios vs perfil
- GET `/api/colearning/suggestions/[id]/alternative-for-profile` — Obtiene alternativa alineada con perfil
- POST `/api/colearning/suggestions/[id]/reject` — Rechaza con nota
- GET `/api/admin/colearning/daily-summary` — Resumen del día
- GET `/api/admin/colearning/history` — Historial paginated

Cada endpoint devuelve:
```json
{
  "success": boolean,
  "message": string,
  "data": {...},
  "validation_warnings": [...] // si aplica
}
```

## INTELIGENCIA DEL SISTEMA

### Panel de educación bidireccional (OBLIGATORIO)
Además del panel de aprobación de sugerencias, crear una sección "Aprendizaje mutuo":

**Vista "Lo que aprendí de ti":**
- "Prefieres WhatsApp sobre email para FI (basado en 12 modificaciones)"
- "Apruebas acciones de engagement para CE un 90% del tiempo"
- "Nunca apruebas descuentos (0 de 4 sugeridos)"
- Javier puede confirmar o corregir: [Sí, correcto] [No, esto ha cambiado]

**Vista "Lo que puedo enseñarte":**
- "Dato: las acciones que rechazaste tuvieron 34% de éxito cuando se aplicaron en otros leads similares"
- "Los emails enviados a las 22:00 para CE tienen 3x más apertura que los de las 9:00"
- "El 67% de FI que reciben WhatsApp de datos convierten, vs 23% por email narrativo"
- Tono: informativo, nunca condescendiente

### Dashboard de confianza (OBLIGATORIO)
Mostrar la evolución de la confianza del sistema:
- Gráfico temporal: "Confianza global: 45% → 62% → 71% (3 meses)"
- Por categoría: "Engagement: 73%, Conversion: 68%, Health: 81%, Protocol: 55%"
- Hitos: "Alcanzaste semi-auto en engagement (>85% confianza). ¿Activar ejecución automática para esta categoría?"
- Toggle por categoría: [Manual] [Semi-auto] [Autónomo]

### Alertas de desacuerdo (OBLIGATORIO)
Si el sistema y Javier discrepan frecuentemente en una categoría:
- Mostrar alerta: "En las últimas 2 semanas, rechazaste 8 de 10 sugerencias de 'protocol_change'. ¿Debemos pausar este tipo de sugerencias? ¿O hay algo que debo aprender?"
- Opciones: [Pausar este tipo] [Seguir sugiriendo pero con menos frecuencia] [Explícame qué cambiar]

### Resumen semanal inteligente
Email automático a Javier cada lunes:
- "Esta semana: 47 sugerencias, 81% aprobadas, 12 conversiones atribuidas"
- "Top insight: Los CE responden mejor los jueves a las 13:00"
- "Acción recomendada: Activar semi-auto para engagement (confianza 87%)"
- "Leads que necesitan tu atención personal: [María R. — churn risk 0.7] [Juan M. — hot lead sin booking]"

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin avisarme antes.
- TODO el diseño viene de docs/DESIGN.md. No inventes colores ni spacing.
- Las animaciones siguen los patrones de docs/ANIMATIONS.md.
- Mobile-first: el panel funciona en tablet (no necesita ser perfecto en 375px, pero sí en 768px+).
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- `/admin/colearning/*` requiere `isAdmin` (check en middleware).
- No exponer datos sensibles de usuarios (solo iniciales, perfil, no emails en tabla).
- Las acciones se ejecutan solo si status='pending' y user es admin.

### 3. Calidad del código
- Cero console.log de debug.
- Componentes reutilizables (ActionCard, ReasoningBox, ProfileWarning).
- Archivos < 400 líneas (este panel es más grande).

### 4. Testing funcional
- Listar acciones pendientes (con y sin filtros).
- Abrir detalle de acción: ver razonamiento, opciones.
- Aprobar: acción desaparece de "pendientes", aparece en "historial".
- Editar: cambios validados, alternativa sugerida si desalineado.
- Rechazar: acción marcada como rechazada, queda en historial.
- Resumen diario: números correctos, se actualiza.
- Historial: filtra correctamente, paginación funciona.

### 5. Accesibilidad
- Botones accesibles con teclado.
- Tablas: headers con scope, filas navegables.
- Modales/expands se cierran con Escape.
- Focus visible en todos los inputs.

### 6. Performance
- Tabla con 100+ acciones: lazy loading o paginación.
- No cargar razonamiento hasta que abras detalle (lazy).
- Filtros no recargan página (filter en frontend si <1000 items).

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Usa tokens de DESIGN.md. Colores por tipo de acción (código de colores claro).
**7b. Claridad:** Un CTA primario por pantalla (Aprobar/Rechazar en detalle). Acciones rápidas en tabla.
**7c. Feedback:** Hover en filas, estado visual después de click, loading state.
**7d. Información:** El razonamiento es expandible (no bombardea al abrir). Barra de confianza clara.
**7e. Errors:** Si validación falla, mostrar error claro (no genérico).
**7f. Decisiones:** El flujo de editar→validar→aprobar es intuitivo. El botón de "alternativa" es obvio.

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/PROGRESS.md`:
   ```
   - ✅ **COLEARNING — Sesión 2: Frontend Panel Admin** ({fecha}):
     - Panel de acciones pendientes con razonamiento, flujo editar/validar/aprobar, rechazo con notas, resumen diario, historial
   ```
2. Commit final limpio.
