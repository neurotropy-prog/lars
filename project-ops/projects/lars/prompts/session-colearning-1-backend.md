## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión COLEARNING-1: Backend del sistema de decisiones colaborativas (Javier + algoritmo)

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente y la visión del programa
- `docs/DESIGN.md` — Sistema de diseño
- `docs/DATABASE.md` — Schema actual

## Lo que ya está construido
- Gateway, mapa, emails, admin completos
- Scoring automático del diagnóstico
- Heat score del lead
- Analytics básico

## Tu tarea

Lee `docs/VISION.md` completamente.

El programa LARS es 80% protocolos automáticos (emails, mapa, secuencia) y 20% decisiones humanas (Javier).

Esta sesión construye el **COLEARNING SYSTEM:** backend que permite a Javier ver **acciones sugeridas** generadas por el algoritmo y:
1. ✓ Aprobar (apply the suggestion)
2. ⏱ Modificar (adjust and apply)
3. ✗ Rechazar (don't apply)

Cada decisión se registra, y el sistema aprende: "¿cuáles de mis sugerencias, cuando Javier las aprueba, generan mejor resultado?"

Esto es el inicio de un sistema donde Javier es el "entrenador" del algoritmo.

### Tarea 1: Modelo de datos — Tabla `suggested_actions`

```sql
CREATE TABLE suggested_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES diagnosticos(id),

  action_type TEXT NOT NULL,  -- 'send_email', 'recommend_call', 'reduce_intensity', 'change_protocol'
  action_category TEXT,       -- 'engagement', 'health', 'conversion', 'retention'

  title TEXT NOT NULL,        -- "Enviar email re-activación"
  description TEXT,           -- Explicación de por qué se sugiere

  reasoning_data JSONB,       -- {"heat_score": 45, "days_without_visit": 14, "profile": "exhausted_caregiver"}
  suggested_parameters JSONB, -- {"email_template": "reactivation", "delay_hours": 2}

  confidence_score DECIMAL(3,2),  -- 0-1, cuán seguro está el algoritmo (0.75 = bastante seguro)

  status TEXT DEFAULT 'pending',  -- 'pending', 'approved', 'modified', 'rejected', 'completed'
  javier_decision_at TIMESTAMP,
  javier_decision TEXT,  -- 'approved' | 'modified' | 'rejected'
  javier_modifications JSONB,  -- Cambios que Javier hizo a los parámetros

  applied_at TIMESTAMP,  -- Cuándo se ejecutó la acción
  outcome_at TIMESTAMP,  -- Cuándo se puede medir si funcionó (1 semana después, ej)
  outcome_success BOOLEAN,  -- ¿Tuvo el resultado esperado?

  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

### Tarea 2: Tipos de acciones sugeridas

El algoritmo sugiere acciones en 4 categorías:

#### **1. ENGAGEMENT (Re-activar)**

**Cuando:** Lead tiene heat score bajo pero no está descartado.

```json
{
  "action_type": "send_email",
  "action_category": "engagement",
  "title": "Reactivar: 'Volvemos a tu mapa'",
  "description": "Juan visitó 6 veces hace 2 semanas, ahora no vuelve. Heat bajó de 65 a 38. Sugerencia: enviar email reactivación + incentivo.",
  "reasoning_data": {
    "heat_score": 38,
    "previous_heat": 65,
    "days_since_visit": 15,
    "profile": "productive_collapsed",
    "visits_trend": "declining"
  },
  "suggested_parameters": {
    "email_type": "reactivation",
    "offer": "free_sleep_protocol",
    "send_at_hours": 2
  },
  "confidence_score": 0.78
}
```

#### **2. CONVERSION (Cerrar venta)**

**Cuando:** Lead tiene heat > 70, hace 3+ visitas, pero no compra.

```json
{
  "action_type": "recommend_call",
  "action_category": "conversion",
  "title": "Lead caliente sin booking",
  "description": "María es 'Controladora Paralizada'. Heat 76. Visitó 7 veces en 2 semanas. Aún no agendó sesión. Sugerencia: llamada directa a ella (no email).",
  "reasoning_data": {
    "heat_score": 76,
    "profile": "paralyzed_controller",
    "visits_last_7d": 4,
    "email_open_rate": 0.8,
    "days_since_diagnosis": 18,
    "conversion_probability": 0.82
  },
  "suggested_parameters": {
    "contact_method": "direct_call",
    "best_time_utc": "09:00",
    "script_type": "cp_reassurance"
  },
  "confidence_score": 0.82
}
```

#### **3. HEALTH (Cuidar el programa)**

**Cuando:** Lead está en el programa (pagó) pero muestra señales de que abandona.

```json
{
  "action_type": "reduce_intensity",
  "action_category": "health",
  "title": "Reducir volumen de emails",
  "description": "Carlos está en Semana 3, abierto 1 de 5 emails recientes. Está cansado de tanto contenido. Sugerencia: pausa de 7 días en emails, continuar solo protocolos.",
  "reasoning_data": {
    "emails_sent": 5,
    "emails_opened": 1,
    "open_rate": 0.2,
    "week_in_program": 3,
    "profile": "invisible_strong",
    "engagement_trend": "declining"
  },
  "suggested_parameters": {
    "pause_days": 7,
    "keep_sending": ["sleep_protocol", "weekly_map_update"],
    "resume_at": "2026-04-03T08:00:00Z"
  },
  "confidence_score": 0.69
}
```

#### **4. PROTOCOL (Cambiar plan)**

**Cuando:** El mapa de la persona sugiere un cambio de enfoque.

```json
{
  "action_type": "change_protocol",
  "action_category": "health",
  "title": "Cambiar énfasis: Digestión antes que Atención",
  "description": "Rosa está en Semana 4. Su dimensión de Digestión empeoró (-8pts) mientras Atención mejoró. Sugerencia: mover énfasis a protocolo digestivo.",
  "reasoning_data": {
    "current_focus": "attention",
    "score_movement": {
      "nervous_regulation": +5,
      "sleep": +3,
      "digestion": -8,
      "attention": +4,
      "energy": +2
    },
    "most_deteriorated": "digestion",
    "profile": "exhausted_caregiver",
    "week_in_program": 4
  },
  "suggested_parameters": {
    "primary_protocol": "digestion_recovery",
    "secondary_protocol": "nervous_regulation",
    "implement_at_week": 5
  },
  "confidence_score": 0.71
}
```

---

### Tarea 3: Sistema de puntuación de sugerencias

El algoritmo calcula `confidence_score` basándose en:

```typescript
confidence = (
  (histórico_de_aciertos * 0.4) +        // "Cuando sugerí X antes, ¿acertaba?"
  (relevancia_del_caso * 0.35) +         // "¿Qué tan similar es este caso a otros?"
  (claridad_de_la_señal * 0.25)          // "¿Qué tan obvia es la señal?"
) / 100
```

**Historiales:**

Se guardan en tabla `action_outcomes`:

```sql
CREATE TABLE action_outcomes (
  suggested_action_id UUID REFERENCES suggested_actions(id),
  outcome_measured_at TIMESTAMP,
  outcome_success BOOLEAN,
  outcome_metric TEXT,  -- "heat_increase", "email_opened", "purchase_made", "program_completion"
  outcome_value DECIMAL,  -- 45 (heat fue de 38 a 45, +7)
  created_at TIMESTAMP DEFAULT now()
);
```

Cada decisión de Javier se evalúa 7 días después automáticamente.

---

### Tarea 4: API — Obtener sugerencias pendientes

**GET `/api/admin/suggestions/pending`**

**Query params (opcional):**
- `category`: 'engagement' | 'conversion' | 'health' | 'protocol'
- `min_confidence`: 0.6 (solo sugerencias con confianza >= 60%)
- `profile`: 'productive_collapsed' | ...

**Response:**

```json
{
  "total": 12,
  "pending_review": 12,
  "by_category": {
    "engagement": 5,
    "conversion": 4,
    "health": 2,
    "protocol": 1
  },
  "suggestions": [
    {
      "id": "uuid-123",
      "title": "Reactivar: 'Volvemos a tu mapa'",
      "lead": {
        "name": "Juan García",
        "profile": "productive_collapsed",
        "heat_score": 38
      },
      "confidence_score": 0.78,
      "action_type": "send_email",
      "reasoning": "Heat bajó de 65 a 38 en 2 semanas. Visitó 6 veces, ahora no vuelve.",
      "suggested_action": {
        "email_type": "reactivation",
        "offer": "free_sleep_protocol",
        "send_at": "2026-03-28T10:00:00Z"
      },
      "status": "pending"
    },
    ...
  ]
}
```

---

### Tarea 5: API — Acción de Javier (Approve/Modify/Reject)

**POST `/api/admin/suggestions/{id}/decide`**

**Payload:**

```json
{
  "decision": "approved",  // 'approved' | 'modified' | 'rejected'
  "reason": "Concuerdo, Juan necesita un empujón.",
  "modifications": {
    // Opcional, solo si decision = "modified"
    "email_type": "custom",  // en vez de "reactivation"
    "custom_email_id": "uuid-...",
    "send_at": "2026-03-29T14:00:00Z"  // diferente hora
  }
}
```

**Response:**

```json
{
  "status": "success",
  "decision": "approved",
  "action_executed": true,
  "execution_details": {
    "email_id": "email-uuid-...",
    "scheduled_for": "2026-03-28T10:00:00Z"
  }
}
```

**Si decision = "modified":**
- Se aplica la acción con modificaciones
- Se guardan los cambios en `javier_modifications`

**Si decision = "rejected":**
- Se marca como rejected
- NO se ejecuta la acción
- Se guarda el reason (para aprender: "¿por qué rechazó?")

---

### Tarea 6: Cálculo automático de sugerencias

**Cron diario (10am hora de Javier):**

Para cada lead NO descartado:

1. Evaluar heat score, visitas, emails abiertos, etc.
2. Si alguna métrica cumple criteria de sugerencia → crear entrada en `suggested_actions`
3. Calcular `confidence_score`

**Lógica simplificada:**

```typescript
if (lead.heat_score < 40 && lead.days_since_visit > 7 && !lead.discarded) {
  createSuggestedAction({
    action_type: 'send_email',
    category: 'engagement',
    confidence_score: calculateConfidence(...)
  });
}

if (lead.heat_score > 70 && lead.visits_7d > 3 && !lead.paid && !lead.has_booking) {
  createSuggestedAction({
    action_type: 'recommend_call',
    category: 'conversion',
    confidence_score: 0.75
  });
}

// ...más rules
```

**Límites:**
- Máximo 2-3 sugerencias por lead por semana (no bombardear a Javier)
- Solo crear si confidence_score >= 0.60
- Evitar sugerencias duplicadas (si ya sugirió "enviar email reactivación" hace 3 días, no volver a sugerir)

---

### Tarea 7: Dashboard de confianza

Una métrica que muestra cómo el algoritmo está mejorando:

```
ALGORITMO — Evolución de confianza

Sugerencias en últimos 30 días: 87
Aprobadas por Javier: 62 (71%)
Modificadas: 15 (17%)
Rechazadas: 10 (12%)

Tasa de éxito (outcome positivo 7 días después):
- Engagement: 68%
- Conversion: 73%
- Health: 52%
- Protocol: 61%

Confianza general: 66% (arriba 8% vs hace 30 días)

Recomendación: El algoritmo es bueno en Conversion.
Mejorar: Health y Protocol (faltan más datos).
```

Esto se actualiza automáticamente cada 7 días.

---

### Tarea 8: Tabla de auditoría

Cada decisión de Javier se registra:

```sql
CREATE TABLE suggestion_decisions_log (
  id UUID PRIMARY KEY,
  suggested_action_id UUID,
  decision TEXT,  -- 'approved', 'modified', 'rejected'
  reason TEXT,
  javier_decided_at TIMESTAMP,
  outcome_measured_at TIMESTAMP,
  outcome_success BOOLEAN,
  created_at TIMESTAMP
);
```

Esto permite tracear: "¿Qué decisiones tomó Javier? ¿Acertó?"

---

## INTELIGENCIA DEL SISTEMA

### Aprendizaje de preferencias de Javier (OBLIGATORIO)
El sistema no solo aprende qué funciona para los leads. Aprende cómo piensa Javier:

1. **Tracking de patrones:** "Javier aprueba 90% de sugerencias de engagement para CE, pero solo 40% para FI. Ajustar: reducir sugerencias FI de engagement, aumentar sugerencias FI de tipo 'datos'."
2. **Predicción de aprobación:** Antes de mostrar una sugerencia, calcular `probabilidad_aprobacion` basada en historial. Si <30%, no mostrar (o mostrar con label "Baja probabilidad — ¿quieres revisarla?").
3. **Meta-learning:** Si Javier modifica una sugerencia frecuentemente en la misma dirección (ej: siempre cambia "Enviar email" por "Enviar WhatsApp" para FI), el sistema aprende: "Para FI, preferir WhatsApp sobre email en sugerencias."

### Educación bidireccional REAL (OBLIGATORIO)
El sistema no solo aprende de Javier. También educa a Javier:

1. **Cuando Javier rechaza algo que funciona:** Si el sistema sugiere una acción, Javier la rechaza, pero el lead convierte de todas formas → mostrar: "Nota: rechazaste esta sugerencia pero el lead convirtió igualmente. Dato: acciones similares tienen 73% de éxito. ¿Quieres que sigamos sugiriendo este tipo?"
2. **Cuando Javier aprueba algo que no funciona:** Si 3 acciones aprobadas del mismo tipo fallan consecutivamente → mostrar: "Las últimas 3 acciones de tipo 'email genérico' no generaron respuesta. ¿Probamos una variante diferente?"
3. **Coaching suave:** No imponer. Mostrar datos y dejar que Javier decida. El tono es: "Los datos sugieren X. Tú decides."

### Sugerencias multi-sistema (OBLIGATORIO)
Las sugerencias no vienen solo de heat score. Vienen de TODO el sistema:
- **Desde AMPLIFY:** "María R. tiene una comparación activa que se actualizó. Sugerir enviar email de evolución comparativa."
- **Desde EMAILS:** "Juan M. no abrió los últimos 2 emails. Sugerir cambio de canal a WhatsApp."
- **Desde COMUNIDAD:** "La cohorte de esta semana tiene 3 personas con churn_risk >0.6. Sugerir acciones preventivas."
- **Desde GATEWAY-APRENDE:** "La variante B del micro-espejo 2 convierte 15% mejor. Sugerir activar como default."
- **Desde IGNICIÓN:** "Keyword emergente: 'burnout silencioso' genera 23 visitas/semana. Sugerir crear landing."

### Confianza progresiva hacia autonomía (OBLIGATORIO)
El roadmap de confianza:
1. **Mes 1-2:** Todo requiere aprobación de Javier
2. **Mes 3:** Acciones con confidence >0.85 Y probabilidad_aprobacion >0.90 se ejecutan automáticamente con notificación a Javier
3. **Mes 4+:** Solo las acciones nuevas o de baja confianza requieren aprobación. El resto es autónomo.
4. **Siempre:** Javier puede volver a modo manual en cualquier momento. Un toggle en admin: "Modo: [Manual] [Semi-auto] [Autónomo]"

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin avisarme antes — muestra el SQL.
- Las sugerencias son SUGERENCIAS, no órdenes. Javier SIEMPRE decide.
- El confidence_score es honesto — no inflar números para parecer inteligente.
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- El endpoint GET `/api/admin/suggestions/pending` requiere ADMIN_SECRET.
- El POST `/api/admin/suggestions/{id}/decide` registra quién decidió (audit).
- Los datos de sugerencias no exponen emails privados.

### 3. Calidad del código
- Cero console.log de debug.
- El cálculo de confidence_score es una función reutilizable.
- Las queries están optimizadas (índices en `lead_id`, `status`).
- Archivos < 300 líneas.

### 4. Testing funcional
- Crear 5 leads con diferentes perfiles y calores
- Ejecutar cron: genera sugerencias correctas
- Javier aprueba una: se aplica automáticamente
- Javier modifica una: se aplica con cambios
- Javier rechaza una: se registra, no se aplica
- 7 días después: outcome se mide automáticamente

### 5. Accesibilidad
- N/A (backend)

### 6. Performance
- El cron no tarda más de 10 segundos para 1000 leads
- Las queries están indexed
- No N+1 queries

### 7. Diseño y UX

**7a. Claridad:** Javier ve por qué el algoritmo sugiere algo (reasoning_data es legible).
**7b. Control:** Javier puede aprobar, modificar o rechazar — tiene poder total.
**7c. Feedback:** Al decidir, ve resultado inmediato (email enviado, etc.).
**7d. Aprendizaje:** El dashboard de confianza muestra si el algoritmo está mejorando.

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/DATABASE.md` con tablas `suggested_actions`, `action_outcomes`, `suggestion_decisions_log`.
2. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **COLEARNING-1 — Sesión 1: Backend de decisiones** ({fecha}):
     - Tabla suggested_actions (4 categorías), API de sugerencias, endpoints approve/modify/reject, cálculo automático diario, métricas de confianza, auditoría
   ```
3. Commit final limpio.

**NOTA:** Esta es la sesión 1 (backend). La sesión 2 sería el frontend en el admin (dashboard visual de sugerencias).
