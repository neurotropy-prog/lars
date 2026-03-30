# Sprint 0 — Foundation

## Objetivo
Crear los cimientos que todos los sprints posteriores necesitan: motor de inteligencia de perfil, nuevas API routes, captura de geolocalización y migración de DB.

## Duración estimada
1 sesión de Claude Code

---

## Tarea 1: Motor de Inteligencia de Perfil

### Crear `src/lib/profile-intelligence.ts`

Este archivo contiene TODA la inteligencia de los 4 perfiles aplicada al contexto post-gateway. Es un motor de reglas estático (no IA generativa). Se usa en el Hub, LAM y acciones de Javi.

```typescript
// Estructura de cada perfil:

export interface ProfileIntelligence {
  key: string                    // 'productivo-colapsado' | 'fuerte-invisible' | 'cuidador-exhausto' | 'controlador-paralizado'
  label: string                  // 'Productivo Colapsado'
  shortLabel: string             // 'PC'
  color: string                  // Color del badge en el LAM
  icon: string                   // Emoji o icono

  // Interpretaciones de comportamiento
  behaviors: {
    multiple_map_visits: string   // Qué significa para ESTE perfil
    no_email_opens: string
    long_time_no_action: string
    visited_but_not_paid: string
    opened_session_email: string
    booked_session: string
    unsubscribed: string
  }

  // Acciones sugeridas ordenadas por prioridad
  suggested_actions: ActionType[]  // ['video', 'express_session', 'personal_note', ...]
  never_actions: string[]          // Qué NUNCA hacer con este perfil

  // Templates pre-rellenados
  note_templates: {
    reengagement: string          // Para reactivar lead frío
    encouragement: string         // Para lead tibio activo
    post_session: string          // Después de sesión con Javi
  }

  // Hints para video
  video_script_hint: string       // Guía de tono y contenido para Javi

  // Tono de email manual
  email_tone: string              // Descripción del tono correcto

  // Qué le preocupa a este perfil (para que Javi entienda)
  core_fear: string
  core_desire: string
  decision_blocker: string
}

export type ActionType = 'personal_note' | 'video' | 'early_unlock' | 'express_session' | 'manual_email'
```

### Contenido de los 4 perfiles:

#### Productivo Colapsado (PC)
```
core_fear: "Que el problema sea real y no pueda resolverlo con más esfuerzo"
core_desire: "Volver a rendir como antes, pero esta vez de forma sostenible"
decision_blocker: "Su ego de alto rendimiento le dice que puede solo"

behaviors:
  multiple_map_visits: "Está evaluando datos repetidamente. Busca confirmar que tiene un problema REAL antes de pedir ayuda. Su identidad de 'yo puedo solo' está en conflicto con lo que ve."
  no_email_opens: "Está evitando confrontar la realidad. Los emails le recuerdan algo que su ego quiere ignorar. El subject debe apelar a RENDIMIENTO, no a salud."
  long_time_no_action: "Está esperando 'el momento adecuado' que nunca llega. Su sistema nervioso en modo supervivencia le impide priorizar algo que no sea producir."
  visited_but_not_paid: "Ve el valor pero su identidad (soy fuerte, soy productivo) bloquea la compra. Necesita que una AUTORIDAD CLÍNICA le dé permiso para actuar."
  opened_session_email: "Está considerando seriamente. El hecho de que un profesional ya tenga sus datos reduce la barrera. Reforzar: 'Ya tiene tus datos, no empezáis de cero.'"
  booked_session: "Gran señal. Va a llegar preparado con preguntas de eficiencia. Javi debe hablar en lenguaje de rendimiento y datos."
  unsubscribed: "Ha decidido que 'no es para tanto'. Respetarlo — pero dejar la puerta abierta."

suggested_actions: ['video', 'express_session', 'personal_note']
never_actions: ['Tono emocional blando', 'Lenguaje de vulnerabilidad', '"Está bien no estar bien"']

note_templates:
  reengagement: "[Nombre], he revisado tu diagnóstico. Tu sistema nervioso está operando al [score]% de su capacidad. No es cansancio — es un patrón fisiológico documentado. He trabajado con ejecutivos en tu misma situación. Hay un protocolo específico para esto.\n\n— Dr. Javier A. Martín Ramos"
  encouragement: "[Nombre], los datos de tu mapa muestran algo que veo en menos del 15% de los casos. Tu dimensión de [worstDim] tiene un patrón muy específico que responde bien a intervención temprana. Merece la pena que lo mires con atención."
  post_session: "[Nombre], lo que vimos en nuestra sesión confirma lo que tu mapa ya mostraba. El protocolo que te di funciona en 72 horas. Si no notas cambio, me lo dices."

video_script_hint: "Habla de DATOS y RENDIMIENTO. 'He analizado tu diagnóstico y hay un patrón que veo en ejecutivos de tu perfil...' Nunca de emociones. Sé directo, eficiente, como hablarías a un CEO."

email_tone: "Directo, eficiente, basado en datos. Como un informe médico personalizado, no como una carta de apoyo emocional."
```

#### Fuerte Invisible (FI)
```
core_fear: "Que alguien vea que está sufriendo"
core_desire: "Entender qué le pasa desde la biología, sin tener que hablar de emociones"
decision_blocker: "La vergüenza de necesitar ayuda"

behaviors:
  multiple_map_visits: "Está estudiando los datos con rigor. Para este perfil, más datos = más confianza. No necesita conexión emocional — necesita EVIDENCIA. Desbloquear subdimensiones anticipadamente puede ser decisivo."
  no_email_opens: "La vergüenza puede estar bloqueando. Los emails le recuerdan que 'tiene un problema'. Reducir la frecuencia o cambiar el frame a 'actualización de datos'."
  long_time_no_action: "Está procesando internamente. No confundir silencio con desinterés — puede estar muy activo mentalmente pero paralizado por la vergüenza de dar el siguiente paso."
  visited_but_not_paid: "Quiere más CERTEZA antes de actuar. No le faltan ganas — le falta la sensación de que tiene SUFICIENTES datos para justificar la decisión."
  opened_session_email: "Señal potente para este perfil. Ha superado la barrera de la vergüenza lo suficiente como para considerar hablar con alguien. No perder este momento."
  booked_session: "Momento crítico. Javi NUNCA debe hacer preguntas emocionales directas. Mantener todo en el terreno de la biología y los datos."
  unsubscribed: "La exposición le resulta insoportable. Respetar absolutamente. El mapa sigue disponible si vuelve."

suggested_actions: ['early_unlock', 'manual_email', 'express_session']
never_actions: ['Videos con tono cálido/emocional', 'Notas que hablen de sentimientos', '"¿Cómo te sientes?"', 'Cualquier cosa que parezca terapia']

note_templates:
  reengagement: "[Nombre], hay datos nuevos disponibles en tu mapa. La dimensión [worstDim] tiene subdimensiones que aportan más resolución al diagnóstico. Los he desbloqueado anticipadamente.\n\n— Dr. Javier A. Martín Ramos"
  encouragement: "[Nombre], tu perfil biológico tiene una particularidad: el patrón de regulación que muestras tus datos responde especialmente bien a intervención precisa. El detalle está en tu mapa."
  post_session: "[Nombre], los datos que revisamos confirman el patrón. El protocolo es específico para tu perfil biológico. Aplícalo 7 días y compara métricas."

video_script_hint: "MUY BREVE. Máximo 45 segundos. Solo datos y biología. 'Tu perfil biológico muestra un patrón de [X]...' Nunca preguntar cómo se siente. Nunca decir 'entiendo lo que estás pasando'. Tratar como un informe clínico verbal."

email_tone: "Clínico, técnico, breve. Cero adornos emocionales. Como un resultado de laboratorio con una nota del médico."
```

#### Cuidador Exhausto (CE)
```
core_fear: "Que cuidarse a sí mismo signifique abandonar a los demás"
core_desire: "Permiso para priorizar su propia recuperación sin culpa"
decision_blocker: "La culpa de invertir tiempo/dinero en sí mismo"

behaviors:
  multiple_map_visits: "Vuelve al mapa como quien abre un libro y lo cierra: quiere, pero siente que 'no debería'. Necesita que alguien le diga que cuidarse NO es egoísmo."
  no_email_opens: "La culpa actúa como filtro. Cada email es un recordatorio de que está dedicando energía a sí mismo en vez de a otros. Cambiar el frame: 'Si tú caes, ellos caen.'"
  long_time_no_action: "No es falta de interés — es que siempre hay 'algo más urgente' que él mismo. Una nota que normalice el autocuidado como RESPONSABILIDAD (no capricho) puede reactivar."
  visited_but_not_paid: "Sabe que lo necesita. Lo frena la culpa de gastar 97€ en sí mismo. El frame correcto: 'Es una inversión en tu capacidad de seguir cuidando a los demás.'"
  opened_session_email: "Está buscando permiso externo para actuar. Si un profesional le dice 'necesitas esto', la culpa se reduce. Es la validación que necesita."
  booked_session: "Ha superado la barrera de la culpa. Javi debe CELEBRAR esto sutilmente: 'Has dado un paso importante. No para ti — para todos los que dependen de ti.'"
  unsubscribed: "La culpa venció. Algo le hizo sentir que 'está siendo egoísta'. Dejarlo ir con gentileza."

suggested_actions: ['personal_note', 'video', 'early_unlock']
never_actions: ['Presión', 'Urgencia', '"No pierdas esta oportunidad"', 'Cualquier cosa que suene a venta', 'Culpa adicional']

note_templates:
  reengagement: "[Nombre], sé que tu tiempo nunca es tuyo del todo. Pero lo que muestra tu mapa es que si tú no te ocupas de esto, en algún momento no vas a poder ocuparte de nadie. No es egoísmo — es responsabilidad.\n\n— Dr. Javier A. Martín Ramos"
  encouragement: "[Nombre], tu mapa está evolucionando. Hay información nueva que puede ayudarte a entender por qué te cuesta tanto parar. No es debilidad — tu sistema nervioso está protegiendo a los demás a costa tuya."
  post_session: "[Nombre], lo que vimos en nuestra sesión me confirma lo que intuía: llevas demasiado tiempo poniendo a todos por delante. El protocolo que te di no te pide tiempo — te lo devuelve."

video_script_hint: "Tono cálido pero FIRME. No pedir disculpas. 'Lo que veo en tu diagnóstico es el patrón de alguien que lleva demasiado tiempo cuidando de todos menos de sí mismo.' Usar la frase clave: 'Si tú caes, todos los que dependen de ti caen.' Es la frase que rompe el bloqueo."

email_tone: "Cálido, comprensivo, pero con firmeza clínica. Como un médico que te quiere pero no te deja salir del hospital."
```

#### Controlador Paralizado (CP)
```
core_fear: "Tomar una decisión equivocada sin tener toda la información"
core_desire: "Certeza absoluta de que el plan va a funcionar antes de comprometerse"
decision_blocker: "Parálisis de análisis — siempre necesita más datos antes de actuar"

behaviors:
  multiple_map_visits: "Está analizando cada dato exhaustivamente. Para este perfil, más visitas = más análisis, no necesariamente más convicción. Lo que necesita no es más datos sino ESTRUCTURA y GARANTÍAS."
  no_email_opens: "Puede ser que haya catalogado los emails como 'marketing' y los ignore. Cambiar approach: subject lines con estructura ('Paso 1 de 3', 'Tu plan de acción')."
  long_time_no_action: "Clásico de este perfil. Tiene toda la información pero no puede dar el paso. Lo que lo desbloquea es una SESIÓN con estructura: '10 minutos, resolvemos tus 2 dudas principales.'"
  visited_but_not_paid: "Está buscando la garantía que elimine todo riesgo. Reforzar: '7 días de garantía completa', 'protocolo probado en X casos', 'si no funciona, te devolvemos todo.'"
  opened_session_email: "MUY buena señal. Quiere preguntar antes de decidir. Facilitarle el camino: 'Sin compromiso, sin presión, solo información.'"
  booked_session: "Vendrá con una lista de preguntas. Javi debe ser MUY estructurado: 'Vamos a ver 3 cosas: tu diagnóstico, tu protocolo, y tu plan.' Nada abierto."
  unsubscribed: "Probablemente decidió que 'no tiene suficiente evidencia'. Respetarlo."

suggested_actions: ['express_session', 'manual_email', 'early_unlock']
never_actions: ['Ambigüedad', '"Confía en el proceso"', '"Déjate llevar"', 'Presión temporal', 'Mensajes abiertos sin estructura']

note_templates:
  reengagement: "[Nombre], tu diagnóstico muestra datos específicos. He preparado un resumen con 3 puntos concretos sobre tu situación y los pasos exactos del protocolo. Está en tu mapa.\n\n— Dr. Javier A. Martín Ramos"
  encouragement: "[Nombre], si tienes preguntas sobre tu diagnóstico, puedo resolverlas en 10 minutos. Sin compromiso. Solo datos y un plan claro."
  post_session: "[Nombre], resumo lo que vimos: 1) Tu diagnóstico confirma [X]. 2) El protocolo tiene 3 fases de [Y] días. 3) Resultados esperados en [Z] horas. Si algo no cuadra, me escribes."

video_script_hint: "MUY ESTRUCTURADO. 'Voy a explicarte 3 cosas sobre tu diagnóstico. Primero... Segundo... Tercero...' Nunca decir 'depende' o 'ya veremos'. Ser específico con números, plazos y garantías. Terminar con: 'Si tienes preguntas, las resolvemos en una sesión de 10 minutos.'"

email_tone: "Estructurado, con números y plazos. Como un plan de proyecto con milestones claros. Cada email debe tener un formato de lista o pasos numerados."
```

### Heat Score Calculator

```typescript
export function calculateHeatScore(lead: LeadData): { score: number; level: 'hot' | 'warm' | 'cold' | 'converted' | 'lost' } {
  // Converted = paid
  if (lead.funnel?.converted_week1) return { score: 0, level: 'converted' }

  // Lost = unsubscribed
  if (lead.funnel?.unsubscribed) return { score: 0, level: 'lost' }

  // Goodbye sent = paused (3+ emails without open, goodbye email sent)
  if (lead.map_evolution?.email_goodbye_sent) return { score: 0, level: 'paused' }

  let score = 0
  const daysSince = getDaysSince(lead.created_at)

  // Score bajo = más urgente (la persona necesita más ayuda)
  if ((lead.scores?.global ?? 100) <= 39) score += 2
  else if ((lead.scores?.global ?? 100) <= 59) score += 1

  // Visitas al mapa = interés activo
  const mapVisits = lead.funnel?.map_visits ?? 0
  if (mapVisits >= 3) score += 2
  else if (mapVisits >= 1) score += 1

  // Abrió último email = engagement
  // (check last email in emails_opened array)
  if (lastEmailOpened(lead)) score += 1

  // Ventana caliente (14 días) = momentum
  if (daysSince <= 14) score += 1
  if (daysSince <= 7) score += 1

  // Agendó sesión = ya tomó acción
  if (lead.funnel?.session_booked) score -= 1

  // Clasificar
  if (score >= 5) return { score, level: 'hot' }
  if (score >= 3) return { score, level: 'warm' }
  return { score, level: 'cold' }

  // Levels: hot | warm | cold | converted | paused | lost
}
```

### Suggested Action Generator

```typescript
export function getSuggestedAction(lead: LeadData): SuggestedAction | null {
  const profile = getProfileIntelligence(lead.profile?.ego_primary)
  if (!profile) return null

  const heat = calculateHeatScore(lead)
  const mapVisits = lead.funnel?.map_visits ?? 0
  const daysSince = getDaysSince(lead.created_at)

  // Reglas de sugerencia por señal + perfil
  if (mapVisits >= 3 && !lead.funnel?.converted_week1) {
    return {
      type: profile.suggested_actions[0], // Primera prioridad del perfil
      reason: profile.behaviors.visited_but_not_paid,
      template: profile.note_templates.reengagement,
      urgency: 'high',
    }
  }

  if (daysSince >= 10 && !lastEmailOpened(lead) && heat.level !== 'lost') {
    return {
      type: 'personal_note',
      reason: profile.behaviors.no_email_opens,
      template: profile.note_templates.reengagement,
      urgency: 'medium',
    }
  }

  // ... más reglas
  return null
}
```

---

## Tarea 2: API Routes nuevas

### 2a. `src/app/api/admin/leads/route.ts` (GET)

Retorna todos los leads enriquecidos con heat score y acción sugerida.

**Query params:**
- `period`: 7d | 30d | 90d | all (default: 30d)
- `filter`: all | hot | warm | cold | converted | lost
- `profile`: all | pc | fi | ce | cp
- `sort`: heat | date | score (default: heat)

**Response:**
```json
{
  "total": 48,
  "leads": [
    {
      "hash": "a1b2c3d4e5f6",
      "email": "maria@ejemplo.com",
      "created_at": "2026-03-23T10:15:00Z",
      "days_since": 8,
      "scores": { "global": 28, "label": "Crítico", "d1": 22, "d2": 35, "d3": 41, "d4": 28, "d5": 19 },
      "profile": { "ego_primary": "Productivo Colapsado", "shame_level": "moderate", "denial": false },
      "funnel": {
        "email_captured": true,
        "map_visits": 3,
        "last_visit": "2026-03-31T11:20:00Z",
        "emails_opened": ["d0", "d3"],
        "session_booked": false,
        "converted_week1": false,
        "unsubscribed": false
      },
      "meta": { "country": "ES", "city": "Madrid", "source": "organic" },
      "heat": { "score": 6, "level": "hot" },
      "suggested_action": {
        "type": "video",
        "reason": "Este perfil se identifica con el rendimiento...",
        "urgency": "high"
      },
      "personal_actions": []
    }
  ]
}
```

### 2b. `src/app/api/admin/leads/[hash]/route.ts` (GET)

Retorna detalle completo de un lead con timeline de eventos.

**Response incluye:**
- Todo lo de la ruta de lista
- `timeline`: Array cronológico de TODOS los eventos:
  - `{ type: 'gateway_completed', at: ISO, details: {} }`
  - `{ type: 'email_sent', at: ISO, details: { key: 'd0', subject: '...' } }`
  - `{ type: 'email_opened', at: ISO, details: { key: 'd0' } }`
  - `{ type: 'map_visit', at: ISO, details: { visit_number: 1 } }`
  - `{ type: 'evolution_unlock', at: ISO, details: { day: 3, content: 'archetype' } }`
  - `{ type: 'session_booked', at: ISO }`
  - `{ type: 'payment', at: ISO }`
  - `{ type: 'personal_action', at: ISO, details: { action_type: 'note', content: '...' } }`
- `profile_intelligence`: Objeto completo del perfil con interpretaciones de comportamiento
- `email_status`: Estado de cada email (enviado, abierto, no abierto, suprimido)

### 2c. `src/app/api/admin/leads/[hash]/action/route.ts` (POST)

Ejecuta una acción de Javi sobre un lead.

**Body:**
```json
{
  "type": "personal_note" | "video" | "early_unlock" | "express_session" | "manual_email",
  "content": "Texto de la nota / URL del video / contenido del email",
  "notify_lead": true  // Enviar email notificando al lead
}
```

**Efecto:**
1. Guarda la acción en `diagnosticos.personal_actions` (append al array jsonb)
2. Si `notify_lead`: Envía email con template específico
3. Si `type === 'early_unlock'`: Modifica `map_evolution` para desbloquear contenido
4. Si `type === 'express_session'`: Crea slot especial de 10 min en bookings
5. Retorna lead actualizado

### 2d. `src/app/api/admin/automations/route.ts` (GET)

Stats de los emails automáticos.

**Response:**
```json
{
  "emails": [
    {
      "key": "d0",
      "name": "Tu Mapa de Regulación",
      "subject": "Tu Mapa de Regulación",
      "trigger": "Inmediato al completar gateway",
      "day": 0,
      "sent": 48,
      "opened": 39,
      "open_rate": 81,
      "suppression_rules": ["Si unsubscribed: skip"]
    },
    // ... d3, d7, d10, d14, d21, d30, d90, post_pago
  ],
  "global_stats": {
    "total_sent": 234,
    "avg_open_rate": 68,
    "unsubscribes": 3,
    "unsubscribe_rate": 1.3
  }
}
```

### 2e. `src/app/api/admin/geo/route.ts` (GET)

Datos geográficos agregados.

**Response:**
```json
{
  "total": 48,
  "countries": [
    { "code": "ES", "name": "España", "count": 28, "percentage": 58 },
    { "code": "MX", "name": "México", "count": 8, "percentage": 17 }
  ],
  "cities": [
    { "city": "Madrid", "country": "ES", "count": 15 },
    { "city": "Barcelona", "country": "ES", "count": 8 }
  ]
}
```

---

## Tarea 3: Geo Capture

### Modificar `src/app/api/diagnostico/route.ts`

Al crear un diagnóstico, hacer un lookup de IP para obtener país/ciudad.

```typescript
// Al inicio del POST handler:
const forwarded = req.headers.get('x-forwarded-for')
const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

// Lookup gratuito (no requiere API key, 45 req/min)
let geo = { country: '', city: '', region: '' }
try {
  if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(2000), // 2s timeout, no bloquear
    })
    if (geoRes.ok) {
      const geoData = await geoRes.json()
      geo = {
        country: geoData.country_code || '',
        city: geoData.city || '',
        region: geoData.region || '',
      }
    }
  }
} catch { /* silencioso — geo es nice-to-have */ }

// Añadir a meta al guardar:
meta: { ...existingMeta, ...geo }
```

---

## Tarea 4: Migración de DB

### Crear `supabase/migrations/004_personal_actions.sql`

```sql
-- Añadir columna para acciones personales de Javi
ALTER TABLE diagnosticos
  ADD COLUMN IF NOT EXISTS personal_actions jsonb DEFAULT '[]'::jsonb;

-- Índice para queries de leads con acciones pendientes
CREATE INDEX IF NOT EXISTS idx_diagnosticos_personal_actions
  ON diagnosticos USING gin (personal_actions);

-- Reversal:
-- ALTER TABLE diagnosticos DROP COLUMN IF EXISTS personal_actions;
-- DROP INDEX IF EXISTS idx_diagnosticos_personal_actions;
```

**IMPORTANTE:** Esta migración debe ser aprobada por Javi/Alex antes de ejecutarse. Es aditiva y no afecta datos existentes.

---

## Tarea 5: Email Open Tracking Enhancement

### Modificar tracking para alimentar el LAM

Actualmente `src/app/api/email/open/route.ts` (si existe) o crear uno que:
1. Reciba `?h=HASH&e=EMAIL_KEY` del pixel de tracking
2. Actualice `diagnosticos.funnel.emails_opened` añadiendo el key al array
3. Registre timestamp de apertura

Verificar que los pixels de tracking en `email.ts` ya usan esta ruta. Si no existe el endpoint, crearlo.

---

## Archivos a crear
- `src/lib/profile-intelligence.ts` — Motor de inteligencia de perfil
- `src/app/api/admin/leads/route.ts` — Lista de leads enriquecidos
- `src/app/api/admin/leads/[hash]/route.ts` — Detalle de lead
- `src/app/api/admin/leads/[hash]/action/route.ts` — Ejecutar acción
- `src/app/api/admin/automations/route.ts` — Stats de emails
- `src/app/api/admin/geo/route.ts` — Datos geográficos
- `supabase/migrations/004_personal_actions.sql` — Migración

## Archivos a modificar
- `src/app/api/diagnostico/route.ts` — Añadir geo capture
- `src/app/api/email/open/route.ts` — Mejorar tracking (o crear si no existe)

## Criterios de aceptación
- [ ] `profile-intelligence.ts` exporta los 4 perfiles con todos los campos
- [ ] `calculateHeatScore()` retorna score y nivel correcto
- [ ] `getSuggestedAction()` retorna acción sugerida basada en perfil + comportamiento
- [ ] `/api/admin/leads` retorna leads con heat score y suggested action
- [ ] `/api/admin/leads/[hash]` retorna timeline y profile intelligence
- [ ] `/api/admin/leads/[hash]/action` guarda acción y envía notificación
- [ ] `/api/admin/geo` retorna datos geográficos
- [ ] Geo capture funciona en `/api/diagnostico` sin bloquear el flujo
- [ ] Migración SQL preparada (no ejecutada sin aprobación)
- [ ] `npx tsc --noEmit` pasa sin errores

---

## PROMPT PARA CLAUDE CODE

```
Lee estos documentos ANTES de empezar (en este orden):

1. docs/sprints/admin-v2/00_MASTER_PLAN.md — contexto general
2. docs/sprints/admin-v2/SPRINT_0_FOUNDATION.md — este sprint completo
3. docs/DESIGN.md — tokens de diseño (para los colores de los perfiles)
4. docs/VISION.md — los 4 perfiles de cliente (sección completa)
5. src/lib/insights.ts — textos de insight actuales por dimensión
6. src/lib/scoring.ts — algoritmo de scoring
7. src/app/api/admin/analytics/route.ts — API de analytics actual (patrón a seguir)
8. src/app/api/diagnostico/route.ts — donde añadir geo capture
9. src/lib/email.ts — para entender tracking pixels y templates

CONTEXTO IMPORTANTE:
- Este es un proyecto Next.js 15 con App Router + Supabase + TypeScript
- NUNCA ejecutes npm run build (OOM). Usa npx tsc --noEmit para verificar tipos
- Todas las API routes usan el patrón de analytics/route.ts: verificar admin secret via header x-admin-secret
- La DB es Supabase PostgreSQL con RLS. Usa createAdminClient() de src/lib/supabase.ts
- Los diagnósticos tienen: email, hash, responses (P1-P8), scores (global + D1-D5 + label), profile (ego_primary, shame_level, denial), funnel (email_captured, map_visits, etc.), meta (source, device)

TU TAREA: Ejecutar Sprint 0 completo — Foundation.

1. Crear src/lib/profile-intelligence.ts con TODA la inteligencia de los 4 perfiles (PC, FI, CE, CP). Incluye: behaviors, suggested_actions, never_actions, note_templates, video_script_hint, email_tone, core_fear, core_desire, decision_blocker. También: calculateHeatScore() y getSuggestedAction(). COPIA EL CONTENIDO EXACTO de los perfiles del sprint doc.

2. Crear las API routes nuevas:
   - /api/admin/leads (GET) — leads enriquecidos con heat score + suggested action
   - /api/admin/leads/[hash] (GET) — detalle con timeline + profile intelligence
   - /api/admin/leads/[hash]/action (POST) — ejecutar acción de Javi
   - /api/admin/automations (GET) — stats de emails
   - /api/admin/geo (GET) — datos geográficos

3. Modificar /api/diagnostico/route.ts para capturar geo via IP (ipapi.co, 2s timeout, silencioso en error)

4. Crear o mejorar el endpoint de email open tracking para alimentar funnel.emails_opened

5. Crear supabase/migrations/004_personal_actions.sql (preparar, NO ejecutar)

6. Verificar con npx tsc --noEmit que todo compila

Sigue el patrón de código existente. No inventes valores de diseño. Si algo no está claro, mira cómo se hace en los archivos existentes.
```
