# FEATURE: AMPLIFY — Comparación de Mapas entre Personas

**Patrón:** AMPLIFY (de los 4 patrones del gateway: DEEPEN, CONVERT, RECOVER, AMPLIFY)
**Prioridad:** Alta — motor de crecimiento orgánico sin coste de adquisición
**Dependencias:** Gateway completo, Mapa vivo, Evoluciones (todo ya construido)

---

## QUÉ ES AMPLIFY

AMPLIFY no es "invita a un amigo." Es valor egoísta: **quiero ver cómo comparo con alguien que conozco.**

Un CEO que ve su mapa y puede compararlo con su socio, su pareja, o su equipo directivo convierte el diagnóstico de herramienta individual a herramienta relacional. La viralidad es orgánica: no es marketing — es curiosidad genuina.

**Casos de uso reales:**
- Pareja: "Mi mujer dice que estoy bien. Quiero ver sus números al lado de los míos."
- Socios: "Los dos estamos fundidos. Quiero ver quién está peor y en qué."
- Equipo directivo: "Mis 4 directores están quemados. Quiero ver el mapa colectivo."
- Amigo/a: "Conozco a alguien que está igual que yo. Si lo hace, podemos comparar."

**Por qué funciona con los 4 perfiles:**
| Perfil | Por qué AMPLIFY le atrae |
|---|---|
| Productivo Colapsado | Competitividad natural. Quiere ver cómo compara. Benchmark personal. |
| Fuerte Invisible | No tiene que hablar de emociones. Solo ve datos al lado de otros datos. |
| Cuidador Exhausto | "Si mi pareja lo ve, quizá entienda por qué necesito esto." Herramienta de comunicación. |
| Controlador Paralizado | Más datos = más confianza. Ver dos mapas juntos es evidencia irrefutable. |

---

## PRINCIPIOS DE DISEÑO

### 1. Privacidad absoluta
Nadie ve el mapa de otro sin consentimiento explícito. El invitador NO ve el mapa del invitado automáticamente. Solo cuando AMBOS aceptan compartir se genera la vista comparativa.

### 2. El valor es bidireccional
No es "te invito para que tú te diagnostiques." Es "si los dos lo hacemos, ambos vemos algo que solos no podríamos ver." Las brechas compartidas son más reveladoras que las individuales.

### 3. Sin presión social
Nunca exponemos quién invitó a quién públicamente. No hay leaderboard, no hay ranking, no hay vergüenza. La comparación es privada entre las dos personas.

### 4. El gateway del invitado es idéntico
La persona invitada hace el gateway completo normal. No hay versión "light." Su mapa es real, independiente, y suyo. AMPLIFY es una capa que se activa ENCIMA de dos mapas que ya existen.

---

## ARQUITECTURA

### Flujo completo

```
PERSONA A (ya tiene mapa)
  │
  ├─ Ve en su mapa (día 7-14): "¿Conoces a alguien en tu misma situación?"
  │
  ├─ Click "Invitar a comparar"
  │    │
  │    ├─ Genera link único: dominio.com/?ref=[invite_hash]
  │    │   (El link lleva al gateway normal con parámetro de referencia)
  │    │
  │    ├─ Opciones de envío:
  │    │   • Copiar link (para enviar por WhatsApp, email, etc.)
  │    │   • Compartir por WhatsApp (deep link)
  │    │   • Compartir por email (abre mailto:)
  │    │
  │    └─ A ve: "Invitación enviada. Cuando [nombre/email] complete su diagnóstico,
  │         ambos podréis ver la comparación."
  │
PERSONA B (invitada)
  │
  ├─ Llega al gateway con ?ref=[invite_hash]
  │   (El gateway es IDÉNTICO al normal — misma experiencia completa)
  │
  ├─ Completa gateway → obtiene su propio mapa independiente
  │
  ├─ En su mapa, después de ver sus resultados:
  │   "Alguien te ha invitado a comparar vuestros mapas.
  │    ¿Quieres ver cómo se comparan vuestras dimensiones?"
  │   [Aceptar comparación] [No, gracias]
  │
  └─ Si acepta → Se genera la VISTA COMPARATIVA
       │
       ├─ Persona A recibe email: "Tu comparación está lista"
       ├─ Persona B ve la comparación inmediatamente
       └─ Ambos acceden desde: /mapa/[hash]/comparar/[compare_hash]
```

### Vista comparativa — Lo que ambos ven

**URL:** `/mapa/[mi_hash]/comparar/[compare_hash]`
(Cada persona ve la comparación desde SU mapa, con SU perspectiva)

**Header:**
```
TU COMPARACIÓN DE REGULACIÓN

Tú                          [Nombre/Iniciales]
34/100                      48/100
Comprometido                Atención necesaria
```

**5 dimensiones comparadas (barras paralelas):**
```
D1 — Regulación Nerviosa
Tú:    ████████░░░░░░░░░░  28/100  (rojo)
Otro:  ██████████████░░░░  52/100  (naranja)
       ← La mayor brecha: 24 puntos

D2 — Calidad de Sueño
Tú:    ██████░░░░░░░░░░░░  22/100  (rojo)
Otro:  ████████░░░░░░░░░░  31/100  (rojo)
       ← Ambos comprometidos

D3 — Claridad Cognitiva
Tú:    ███████████░░░░░░░  38/100  (naranja)
Otro:  ██████████████████  65/100  (amarillo)
       ← 27 puntos de diferencia

D4 — Equilibrio Emocional
Tú:    ████████████░░░░░░  42/100  (naranja)
Otro:  █████████████░░░░░  48/100  (naranja)
       ← Zona similar

D5 — Alegría de Vivir
Tú:    ███████░░░░░░░░░░░  25/100  (rojo)
Otro:  ██████████████░░░░  53/100  (naranja)
```

**Insight comparativo (generado dinámicamente):**

Después de las barras, UN insight que conecta los dos mapas:

```
LO QUE REVELAN LOS DOS MAPAS JUNTOS

Vuestra mayor brecha compartida es Regulación Nerviosa — ambos
sistemas nerviosos están comprometidos, pero de formas distintas.
[Persona A] muestra un patrón de simpático crónico (no puede parar),
mientras que [Persona B] muestra señales de dorsal vagal (desconexión).

Lo que ninguno de los dos puede ver por separado: cuando dos personas
cercanas tienen el sistema nervioso desregulado, se retroalimentan.
El estrés de uno amplifica el del otro. Regularse juntos es
exponencialmente más efectivo que hacerlo por separado.
```

**Variantes del insight según relación detectada:**

| Señal | Insight |
|---|---|
| Ambos D1 < 40 | "Vuestros sistemas nerviosos se retroalimentan. Regularse juntos es exponencialmente más efectivo." |
| Brecha > 25 en una dimensión | "La dimensión donde más os diferenciáis es [D]. Esto suele significar que uno compensa lo que al otro le falta — un patrón frecuente en parejas y socios." |
| Ambos D5 < 35 | "Ninguno de los dos recuerda cuándo disfrutó algo de verdad. Eso no es coincidencia — la anhedonia en personas cercanas es contagiosa." |
| Scores similares (±5 global) | "Vuestros mapas son casi idénticos. Eso confirma que compartís el mismo entorno de estrés — y que la solución también es compartida." |
| Mismo perfil detectado | "Ambos sois [perfil]. Eso significa que os entendéis — pero también que os retroalimentáis sin darse cuenta." |

**CTA al final de la comparación:**
```
Lo que ningún diagnóstico individual puede revelar,
dos mapas juntos sí.

Si uno de los dos se regula, el otro lo nota.
Si los dos os reguláis, todo cambia.

[Empezar la Semana 1 juntos — 97€ cada uno]

Texto pequeño: "Cada programa es individual y personalizado.
'Juntos' significa empezar en la misma ventana temporal."
```

---

## CUÁNDO SE ACTIVA AMPLIFY

### En el mapa vivo (trigger principal)

**Día 7-14** — Cuando la persona ya ha vuelto al mapa al menos 1 vez y tiene el arquetipo desbloqueado.

Aparece como una sección nueva en el mapa, DESPUÉS de las dimensiones y ANTES del CTA:

```
──────────────────────────────────

COMPARA TU MAPA

¿Conoces a alguien en tu misma situación —
tu pareja, un socio, un amigo?

Si ambos hacéis el diagnóstico, vuestros mapas
se pueden comparar. Las brechas compartidas son
las más reveladoras.

[Invitar a comparar]

Texto pequeño: "Su diagnóstico es confidencial.
Solo se compara si ambos aceptáis."

──────────────────────────────────
```

### En el email de evolución (día 7 o día 14)

Un bloque adicional al final del email de evolución:

```
P.D. — ¿Conoces a alguien que podría necesitar ver su mapa?
Si ambos hacéis el diagnóstico, podréis comparar vuestras
dimensiones. Las brechas compartidas son las más reveladoras.

[Invitar a alguien a comparar →]
```

### Post-pago (en la página de éxito)

Después de pagar la Semana 1:
```
¿Tu pareja o socio también debería hacer el diagnóstico?
Mientras tú empiezas la Semana 1, él/ella puede hacer
el suyo en 3 minutos. Luego podréis comparar.

[Enviar diagnóstico a alguien →]
```

---

## MODELO DE DATOS

### Nueva tabla: `amplify_invites`

```sql
CREATE TABLE IF NOT EXISTS amplify_invites (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_hash   TEXT        NOT NULL UNIQUE,  -- 12 chars, para la URL
  inviter_id    UUID        NOT NULL REFERENCES diagnosticos(id),
  invitee_id    UUID        REFERENCES diagnosticos(id),  -- NULL hasta que el invitado complete
  status        TEXT        NOT NULL DEFAULT 'pending',
    -- pending: invitación creada, invitado no ha completado
    -- completed: invitado completó gateway, aún no aceptó comparar
    -- accepted: ambos aceptaron, vista comparativa disponible
    -- declined: invitado rechazó la comparación
    -- expired: > 30 días sin completar
  compare_hash  TEXT        UNIQUE,  -- Se genera al aceptar, para la URL de comparación
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,  -- Cuando el invitado completa el gateway
  accepted_at   TIMESTAMPTZ,  -- Cuando el invitado acepta comparar
  meta          JSONB       NOT NULL DEFAULT '{}'
    -- channel: "whatsapp" | "email" | "link"
    -- relationship_hint: "pareja" | "socio" | "amigo" | null
);

CREATE INDEX IF NOT EXISTS idx_amplify_inviter ON amplify_invites (inviter_id);
CREATE INDEX IF NOT EXISTS idx_amplify_invitee ON amplify_invites (invitee_id);
CREATE INDEX IF NOT EXISTS idx_amplify_invite_hash ON amplify_invites (invite_hash);
CREATE INDEX IF NOT EXISTS idx_amplify_compare_hash ON amplify_invites (compare_hash);

ALTER TABLE amplify_invites ENABLE ROW LEVEL SECURITY;
```

### Cambios en `diagnosticos`

Añadir al campo `meta` (JSONB):
```json
{
  "referred_by": "invite_hash_del_invitador",  // Si vino por AMPLIFY
  "amplify_invites_sent": 2,  // Contador de invitaciones enviadas
  "amplify_comparisons_active": 1  // Comparaciones activas
}
```

No se necesitan nuevas columnas — todo cabe en el JSONB existente.

---

## API ROUTES

### POST `/api/amplify/invite`
Crea una invitación.
```
Body: { inviter_hash: string, channel?: string, relationship_hint?: string }
Response: { invite_hash: string, invite_url: string }
```
- Valida que el invitador existe y tiene mapa
- Genera invite_hash único (12 chars)
- Limita a máximo 5 invitaciones activas por persona
- Devuelve URL lista para compartir

### GET `/api/amplify/invite/[invite_hash]`
Verifica estado de una invitación.
```
Response: { status: string, inviter_initials?: string }
```
- Usado por el gateway para detectar si el visitante viene por AMPLIFY
- No expone datos del invitador (solo iniciales)

### POST `/api/amplify/accept`
Acepta la comparación.
```
Body: { invite_hash: string, invitee_hash: string }
Response: { compare_hash: string, compare_url: string }
```
- Valida que ambos mapas existen
- Genera compare_hash
- Envía email al invitador: "Tu comparación está lista"
- Actualiza status a "accepted"

### POST `/api/amplify/decline`
Rechaza la comparación.
```
Body: { invite_hash: string, invitee_hash: string }
Response: { ok: true }
```

### GET `/api/amplify/compare/[compare_hash]`
Obtiene datos para la vista comparativa.
```
Response: {
  my_scores: { global, d1-d5 },
  their_scores: { global, d1-d5 },
  my_profile: string,
  their_profile: string,
  insight: string,
  brecha_mayor: { dimension: string, diferencia: number }
}
```
- Requiere que el solicitante sea una de las dos personas (verificar por hash del mapa en cookie/header)
- Cada persona ve la comparación desde SU perspectiva ("Tú" vs "Otro")
- El insight se genera dinámicamente basado en las reglas de variantes

---

## LÓGICA DEL INSIGHT COMPARATIVO

```typescript
function generateComparisonInsight(
  scoresA: Scores,
  scoresB: Scores,
  profileA: string,
  profileB: string
): string {
  const brechas = calcularBrechas(scoresA, scoresB);
  const mayorBrecha = brechas.sort((a, b) => b.diff - a.diff)[0];

  // Prioridad de insights (se elige el primero que aplique):

  // 1. Mismo perfil detectado
  if (profileA === profileB) {
    return INSIGHTS.mismo_perfil(profileA);
  }

  // 2. Ambos D1 < 40 (retroalimentación de sistema nervioso)
  if (scoresA.d1 < 40 && scoresB.d1 < 40) {
    return INSIGHTS.ambos_d1_comprometido();
  }

  // 3. Ambos D5 < 35 (anhedonia compartida)
  if (scoresA.d5 < 35 && scoresB.d5 < 35) {
    return INSIGHTS.ambos_d5_bajo();
  }

  // 4. Scores globales similares (±5)
  if (Math.abs(scoresA.global - scoresB.global) <= 5) {
    return INSIGHTS.scores_similares();
  }

  // 5. Brecha > 25 en una dimensión
  if (mayorBrecha.diff > 25) {
    return INSIGHTS.gran_brecha(mayorBrecha.dimension);
  }

  // 6. Default: brecha mayor
  return INSIGHTS.default(mayorBrecha);
}
```

---

## EMAILS DE AMPLIFY

### Email al invitador cuando el invitado completa

**Asunto:** Tu comparación de mapas está lista

```
[Nombre/Iniciales del invitado] ha completado su diagnóstico.

Ahora podéis ver cómo se comparan vuestras dimensiones.
Las brechas compartidas revelan lo que ningún mapa
individual puede mostrar.

[Ver comparación →]

Confidencial. Solo vosotros dos podéis ver esto.
```

### Email al invitado post-gateway (si viene por AMPLIFY)

El email de día 0 normal + bloque adicional:

```
Alguien te ha invitado a comparar vuestros mapas.
Si aceptas, ambos podréis ver cómo se comparan
vuestras 5 dimensiones.

[Aceptar comparación →]  [No, gracias]

Tu mapa sigue siendo privado. Solo se comparan
las dimensiones — no las respuestas individuales.
```

---

## MÉTRICAS

```
- Invitaciones creadas (total y por canal: link/whatsapp/email)
- Invitaciones completadas (invitado hizo gateway): objetivo >30%
- Comparaciones aceptadas (invitado aceptó comparar): objetivo >80% de completadas
- Conversión a Semana 1 desde comparación: objetivo >25%
  (La hipótesis: ver la comparación genera más urgencia que el mapa solo)
- Viralidad K-factor: invitaciones enviadas por usuario × tasa de completación
  Objetivo: K > 0.3 (cada 10 personas generan 3 nuevos diagnósticos)
```

---

## ADMIN — Sección AMPLIFY en Hub

En el Centro de Comando (Hub), una card nueva:

```
AMPLIFY
  12 invitaciones enviadas
  4 completadas (33%)
  3 comparaciones activas

  K-factor: 0.33
```

En el LAM (Lead Acquisition Manager), cuando un lead viene por AMPLIFY:
- Badge "Referido" junto al heat score
- En el detalle: "Invitado por [email del invitador]"
- Insight: "Los leads referidos convierten un X% más que los orgánicos"

---

## SESIONES DE CLAUDE CODE

Esta feature se divide en 3 sesiones:

### Sesión AMPLIFY-1: Backend + Base de datos
- Migración SQL (tabla amplify_invites)
- 5 API routes (invite, status, accept, decline, compare)
- Lógica de insight comparativo
- Tests: flujo completo invite→complete→accept→compare

### Sesión AMPLIFY-2: Frontend — Invitación + Compartir
- Sección AMPLIFY en el mapa vivo (día 7+)
- Modal/pantalla de invitación con opciones de compartir
- Detección de ?ref= en el gateway
- Pantalla post-gateway para invitados (aceptar/rechazar comparación)
- Emails de AMPLIFY (invitador notificado, invitado post-gateway)

### Sesión AMPLIFY-3: Vista Comparativa + Admin
- Página /mapa/[hash]/comparar/[compare_hash]
- Barras paralelas con animación
- Insight dinámico
- CTA "Empezar juntos"
- Card AMPLIFY en el Hub del admin
- Badge "Referido" en el LAM
- Métricas en Analytics

---

## CHECKLIST DE EXPERIENCIA

### Privacidad
- [ ] El invitador NUNCA ve el mapa del invitado sin consentimiento mutuo
- [ ] La URL de comparación solo funciona para las dos personas involucradas
- [ ] Las respuestas individuales NUNCA se comparten — solo scores por dimensión
- [ ] "Rechazar" es una opción real, no un dark pattern

### Diseño
- [ ] La invitación se siente como regalo, no como marketing
- [ ] El copy nunca dice "invita" ni "comparte" — dice "comparar"
- [ ] La vista comparativa tiene la misma calidad visual que el mapa individual
- [ ] Barras paralelas con animación staggered (como A-12 pero x2)
- [ ] El insight comparativo se siente personal, no genérico
- [ ] Mobile-first: la comparación funciona en 375px

### Flujo
- [ ] El invitado hace el gateway completo (no versión reducida)
- [ ] El invitado obtiene su propio mapa independiente primero
- [ ] Solo DESPUÉS de ver su mapa se le propone la comparación
- [ ] Si rechaza, su mapa sigue siendo suyo sin limitaciones
- [ ] Si acepta, la comparación está disponible para ambos

### Perfiles
- [ ] El Productivo ve la comparación como benchmark competitivo
- [ ] El Fuerte ve datos, no emociones — la comparación es objetiva
- [ ] El Cuidador encuentra una herramienta para comunicar su situación
- [ ] El Controlador tiene más datos = más confianza para decidir

---

## TEST ÉTICO (obligatorio antes de cerrar)

¿AMPLIFY pasa el test ético del gateway?

- **¿El valor es real?** Sí — dos mapas juntos revelan patrones de retroalimentación que un mapa solo no puede mostrar. Esto es verdad estructural, no marketing.
- **¿La persona invitada obtiene valor propio?** Sí — hace el gateway completo y obtiene su propio mapa independiente, aunque rechace la comparación.
- **¿Hay presión social indebida?** No — nadie sabe públicamente quién invitó a quién. No hay leaderboard ni ranking.
- **¿La privacidad se respeta?** Sí — ambos deben aceptar. Solo se comparten scores, no respuestas. La URL es privada.
- **¿El rechazo tiene consecuencias?** No — rechazar no afecta al mapa propio ni a la relación con el sistema.

AMPLIFY pasa todos los filtros.
