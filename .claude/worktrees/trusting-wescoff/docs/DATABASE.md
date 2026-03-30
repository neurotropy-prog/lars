# DATABASE.md — Schema de Base de Datos

Base de datos: **Supabase (PostgreSQL)**

---

## Tablas

### `users`

Cada persona que completa el gateway y da su email.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid (PK) | Identificador único |
| `email` | text (unique) | Email de la persona |
| `map_hash` | text (unique) | 12 caracteres aleatorios para la URL del mapa |
| `created_at` | timestamptz | Cuándo se registró |
| `updated_at` | timestamptz | Última actualización |

### `gateway_responses`

Las respuestas y resultados del diagnóstico.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid (PK) | Identificador único |
| `user_id` | uuid (FK → users) | Quién respondió |
| `responses` | jsonb | Respuestas P1-P8 |
| `scores` | jsonb | Score global + 5 dimensiones |
| `profile` | jsonb | Ego, arquetipo, vergüenza, miedo, lock |
| `meta` | jsonb | Fuente, dispositivo, tiempo, punto de abandono |
| `completed_at` | timestamptz | Cuándo completó el gateway |

**Estructura de `responses`:**
```json
{
  "p1": "agotamiento",
  "p2": "menos_5h",
  "p3": ["irritabilidad", "rumiacion"],
  "p4": "peor",
  "p5": "anestesia",
  "p6": "perdida_proposito",
  "p7": {
    "regulacion": 3,
    "sueno": 2,
    "claridad": 4,
    "emocional": 3,
    "alegria": 2
  },
  "p8": "mas_2_anos"
}
```

**Estructura de `scores`:**
```json
{
  "global": 34,
  "d1_regulacion": 28,
  "d2_sueno": 22,
  "d3_claridad": 45,
  "d4_emocional": 30,
  "d5_alegria": 25
}
```

**Estructura de `profile`:**
```json
{
  "ego_primary": "productivo",
  "archetype": "perfeccionista",
  "shame_level": "alta",
  "fear_core": "irrelevancia",
  "lock_level": 2,
  "duration": "mas_2_anos",
  "denial_detected": false
}
```

### `map_evolution`

Estado de las evoluciones del mapa vivo (qué se ha desbloqueado y visto).

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid (PK) | Identificador único |
| `user_id` | uuid (FK → users) | Dueño del mapa |
| `archetype_unlocked` | boolean | Día 3: arquetipo desbloqueado |
| `archetype_viewed` | boolean | Día 3: arquetipo visto por la persona |
| `insight_d7_unlocked` | boolean | Día 7: insights desbloqueados |
| `insight_d7_viewed` | boolean | Día 7: insights vistos |
| `session_unlocked` | boolean | Día 10-14: sesión disponible |
| `session_booked` | boolean | Sesión agendada |
| `subdimensions_unlocked` | boolean | Día 14: subdimensiones disponibles |
| `subdimensions_completed` | boolean | Subdimensiones completadas |
| `subdimension_responses` | jsonb | Respuestas de subdimensiones |
| `book_excerpt_unlocked` | boolean | Día 21: extracto del libro |
| `book_excerpt_viewed` | boolean | Extracto visto |
| `reevaluation_unlocked` | boolean | Día 30: reevaluación disponible |
| `reevaluation_completed` | boolean | Reevaluación completada |
| `reevaluation_scores` | jsonb | Scores de la reevaluación |
| `reevaluations` | jsonb | Historial de reevaluaciones trimestrales |

### `confidence_chain`

Cadena de depósitos de confianza — mide cuánta confianza se construyó durante el diagnóstico.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `user_id` | uuid (PK, FK → users) | Usuario |
| `d1_first_truth` | boolean | ¿Continuó después de la primera verdad? |
| `d2_collective_data` | boolean | ¿Continuó después del dato colectivo? |
| `d3_mirror_1` | boolean | ¿Completó después del micro-espejo 1? |
| `d4_mirror_2` | boolean | ¿Completó después del micro-espejo 2? |
| `d5_bisagra` | boolean | ¿Llegó a la bisagra? |
| `d6_email` | boolean | ¿Dio el email? |
| `d7_result` | boolean | ¿Visitó el mapa? |
| `abandoned_at_deposit` | int | En qué depósito se rompió la cadena (null si completó) |

### `funnel`

Estado de conversión de la persona.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `user_id` | uuid (PK, FK → users) | Usuario |
| `gateway_completed` | boolean | ¿Completó el gateway? |
| `email_captured` | boolean | ¿Dio su email? |
| `map_visits` | int | Veces que ha visitado su mapa |
| `map_last_visit` | timestamptz | Última visita al mapa |
| `cta_clicked` | boolean | ¿Hizo clic en el CTA? |
| `converted_week1` | boolean | ¿Pagó la Semana 1 (97€)? |
| `converted_program` | boolean | ¿Se unió al programa completo? |
| `session_booked` | boolean | ¿Agendó sesión con Javier? |

---

## Seguridad (Row Level Security)

- Los mapas vivos son privados por diseño.
- RLS activo en todas las tablas.
- Acceso público solo por `map_hash` — nunca por `user_id` directo.
- Las API Routes del backend usan la `service_role_key` (nunca expuesta al frontend).

---

## Migraciones

Todas las migraciones son reversibles. Cada archivo en `supabase/migrations/` incluye los cambios hacia adelante y cómo revertirlos. Nunca se ejecuta una migración sin aprobación previa.

---

*L.A.R.S.© · Database Schema · Fase 0 · Marzo 2026*
