## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión AMPLIFY-1: Backend + Base de datos — Sistema de comparación de mapas entre personas

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Visión del producto
- `docs/DESIGN.md` — Sistema de diseño
- `docs/features/FEATURE_AMPLIFY_DESIGN.md` — **SPEC COMPLETA de esta feature** (LEER ENTERO)
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Contexto del gateway y los 4 perfiles
- `docs/DATABASE.md` — Schema actual de la BD
- `docs/SECURITY.md` — Reglas de seguridad

## Lo que ya está construido
- Gateway completo (10 preguntas, scoring, 4 perfiles)
- Mapa vivo con evoluciones (día 0→90)
- Admin v2 con Hub, LAM, Automations, Analytics, Agenda
- Stripe (test mode), Booking con Google Calendar
- 8 emails automáticos con tracking

## Tu tarea

Lee `docs/features/FEATURE_AMPLIFY_DESIGN.md` completo. Es la spec de la feature.

Esta sesión construye SOLO el backend y la base de datos. El frontend se hace en la siguiente sesión.

### Tarea 1: Migración de base de datos

Crear la tabla `amplify_invites` en Supabase. La spec completa del schema está en FEATURE_AMPLIFY_DESIGN.md, sección "MODELO DE DATOS".

**IMPORTANTE:** Antes de ejecutar cualquier migración:
1. Explícame qué vas a crear y por qué
2. Muéstrame el SQL exacto
3. Espera mi aprobación
4. Después de ejecutar, actualiza `docs/DATABASE.md`

También hay que añadir campos al JSONB `meta` de `diagnosticos` para trackear invitaciones AMPLIFY. No se necesitan nuevas columnas — solo documentar los nuevos campos JSONB.

### Tarea 2: API Routes

Crear las 5 API routes definidas en la spec:

1. **POST `/api/amplify/invite`** — Crea invitación
   - Validar que el invitador existe (buscar por hash del mapa)
   - Generar invite_hash único (12 chars aleatorios)
   - Límite: máximo 5 invitaciones activas por persona
   - Devolver URL lista para compartir: `${BASE_URL}/?ref=${invite_hash}`

2. **GET `/api/amplify/invite/[invite_hash]`** — Estado de invitación
   - Devuelve status y las iniciales del invitador (NO su email ni nombre)
   - Usado por el gateway para detectar si el visitante viene por AMPLIFY

3. **POST `/api/amplify/accept`** — Aceptar comparación
   - Validar que ambos mapas existen
   - Generar compare_hash único
   - Actualizar status a "accepted"
   - Enviar email al invitador: "Tu comparación está lista"
   - La plantilla del email está en la spec

4. **POST `/api/amplify/decline`** — Rechazar comparación
   - Actualizar status a "declined"
   - No enviar nada al invitador (privacidad)

5. **GET `/api/amplify/compare/[compare_hash]`** — Datos de comparación
   - Verificar que el solicitante es una de las dos personas
   - Devolver scores de ambos, perfiles, insight generado, brecha mayor
   - Cada persona ve "Tú" vs "Otro" (perspectiva personal)

### Tarea 3: Lógica del insight comparativo

Implementar `generateComparisonInsight()` como utilidad.
La lógica completa con las 6 reglas de prioridad está en la spec, sección "LÓGICA DEL INSIGHT COMPARATIVO".

Los textos de cada variante de insight también están en la spec, sección "Vista comparativa — Variantes del insight según relación detectada".

### Tarea 4: Modificar el gateway para detectar ?ref=

Cuando el gateway recibe `?ref=[invite_hash]`:
- Guardar el invite_hash en el estado del gateway (localStorage)
- Al completar el gateway y enviar el diagnóstico, pasar el invite_hash a `/api/diagnostico`
- En `/api/diagnostico`: si hay invite_hash, actualizar la invitación con invitee_id y status "completed"
- Guardar `referred_by` en el campo `meta` del diagnóstico del invitado

**IMPORTANTE:** El gateway del invitado es IDÉNTICO al normal. No hay versión reducida. Solo se guarda la referencia.

## INTELIGENCIA DEL SISTEMA

### Conexiones con otros sistemas (OBLIGATORIO)
Esta sesión NO es una feature aislada. Cada pieza que construyas debe alimentar y recibir datos del ecosistema:

**AMPLIFY → RE-ENGAGEMENT:** Si una invitación se envía pero no se completa en 7 días, el sistema de re-engagement (sesión 7) debe recibir una señal. Añadir campo `notified_reengagement` (boolean) en `amplify_invites`. Crear evento `amplify_invite_stale` que el cron de re-engagement pueda detectar.

**AMPLIFY → CO-LEARNING:** Cada invitación completada/rechazada alimenta el sistema de sugerencias. Si el sistema detecta que un perfil FI tiene 80% de rechazo en invitaciones, debe sugerir a Javier: "Los Fuerte Invisible no responden bien a invitaciones directas. Considerar cambiar el copy." Añadir campo `profile_inviter` y `profile_invitee` en `amplify_invites`.

**AMPLIFY → COLECTIVA DINÁMICA:** El K-factor (invitaciones enviadas × tasa completación) es una métrica colectiva. Exponerla en el endpoint de datos colectivos para que aparezca en el mapa: "X personas han comparado sus mapas esta semana."

**AMPLIFY → EMAILS:** Si alguien acepta una comparación, el email de día 7/14 debe incluir un bloque: "Tu comparación con [Iniciales] ha evolucionado. [Ver cambios →]"

### Insight comparativo inteligente por perfil (OBLIGATORIO)
La función `generateComparisonInsight()` DEBE generar insights diferentes según el perfil del INVITADOR:

- **PC (Productivo Colapsado):** Lenguaje de eficiencia. "La brecha en sueño entre ambos es de 24 puntos. Si uno de los dos recupera el sueño, el otro gana 3-4 horas de productividad indirecta."
- **FI (Fuerte Invisible):** Solo datos. "Brecha mayor: D1 Regulación (24 pts). Estadísticamente, parejas con brecha >20 en D1 muestran convergencia en 8 semanas si ambos participan."
- **CE (Cuidador Exhausto):** Normalización. "Los dos tenéis patrones similares en sueño. El 91% de parejas como vosotros mejoran cuando trabajan juntos. No estáis solos."
- **CP (Controlador Paralizado):** Estructura. "Plan de comparación: Semana 2 — revisar brecha D1. Semana 4 — checkpoint de progreso. Semana 8 — evaluar convergencia."

### Outcome tracking (OBLIGATORIO)
Cada invitación debe cerrar su loop de medición. Añadir a `amplify_invites`:
- `invitee_converted` (boolean) — ¿El invitado compró el programa?
- `inviter_retained` (boolean) — ¿El invitador sigue activo 30 días después de la comparación?
- `comparison_viewed_count` (integer) — Cuántas veces se ha visto la comparación
- `outcome_measured_at` (timestamp) — Cuándo se midió el resultado

Esto permite medir: "Las comparaciones AMPLIFY generan un 40% más de retención."

### Detección de spam/abuso
- Si alguien envía 5 invitaciones en menos de 1 hora → bloquear temporalmente + notificar admin
- Si 3+ invitaciones del mismo invitador son rechazadas → marcar en co-learning como "patrón de rechazo" para que Javier lo vea

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit` para verificar tipos.
- NO modifiques la base de datos sin avisarme antes y mostrarme el SQL.
- TODO el diseño viene de docs/DESIGN.md.
- Recuerda: no soy desarrollador. Explícame todo en lenguaje simple.
- Las API routes usan `createAdminClient()` con service_role_key (como las existentes).
- El email de "comparación lista" usa el mismo sistema de Resend que los emails existentes.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- Cero secrets hardcodeados — todo en .env.local.
- Todo input validado y sanitizado.
- Las API routes verifican que el solicitante tiene derecho a ver los datos.
- La URL de comparación solo funciona para las dos personas involucradas.
- RLS activo en la nueva tabla.

### 3. Calidad del código
- Cero console.log de debug.
- Cero lógica duplicada.
- Nombres descriptivos en inglés.
- Archivos < 300 líneas.

### 4. Testing funcional
- Verificar flujo completo: crear invitación → gateway con ?ref= → completar → aceptar → ver comparación.
- Edge cases: invitación expirada, email duplicado (la persona ya tiene mapa), límite de 5 invitaciones.
- Error de red / API caída manejado.

### 5. Accesibilidad
- N/A para esta sesión (solo backend).

### 6. Performance
- No N+1 queries.
- Los índices de la tabla cubren las búsquedas principales.

### 7. Diseño y UX
- N/A para esta sesión (solo backend). El frontend se hace en la siguiente sesión.

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/DATABASE.md` con el nuevo schema.
2. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **AMPLIFY — Sesión 1: Backend + BD** ({fecha}):
     - Tabla amplify_invites, 5 API routes, lógica de insight comparativo, detección ?ref= en gateway
   ```
3. Commit final limpio con mensaje descriptivo.
