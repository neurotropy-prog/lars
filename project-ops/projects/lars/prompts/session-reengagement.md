## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión REENGAGEMENT: Sistema de re-activación automática por comportamiento

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Los 4 perfiles
- `docs/DATABASE.md` — Schema actual

## Lo que ya está construido
- Gateway completo con scoring
- Mapa vivo con tracking de visitas
- Email secuencia de 8 (nurturing)
- Admin con LAM (Lead Acquisition Manager)
- Analytics básico

## Tu tarea

Lee `docs/VISION.md` y `docs/GATEWAY_DESIGN.md` completamente.

Actualmente, si alguien hace el gateway y no compra, simplemente se envía la secuencia de 8 emails y... fin. No hay re-activación inteligente.

Esta sesión implementa **CRONS de re-engagement automático** que monitorean comportamiento y actúan:

1. **3+ visitas sin pago** → Email especial "Te vimos volviendo"
2. **3+ emails sin abrir** → Reducir frecuencia (no spammear)
3. **Mapa abandonado 14+ días** → Email de reactivación + incentivo
4. **Lead caliente sin booking** → Notificar a Javier (dashboard)

### Tarea 1: Heat score mejorado

El LAM actual calcula heat score simple. Necesita ampliarse:

```typescript
interface LeadHeatScore {
  base_score: number;          // 0-100, actual

  // Componentes adicionales
  visit_frequency: number;      // Cuántas veces visitó en últimos 7 días
  email_engagement: number;     // Open rate + click rate
  map_engagement: number;       // Tiempo en mapa, cuántas dimensiones revisó
  days_since_last_visit: number;
  days_since_diagnosis: number;
  payment_likelihood: number;   // 0-100, basado en perfil + comportamiento

  recency_weight: number;       // Reciente = más interés actual
  final_score: number;          // 0-100 heat actualizado
}
```

**Cálculo:**

```typescript
heat_score = (
  (base_score * 0.4) +
  (visit_frequency * 10) +      // 3+ visitas = +30
  (email_engagement * 0.3) +
  (map_engagement * 0.2) +
  (recency_weight)              // -10 si hace >7 días
) / 100
```

API: GET `/api/admin/leads/heat-scores` para ver todos los leads con sus scores actualizados.

---

### Tarea 2: Cron 1 — "3+ visitas sin pago"

**Trigger:**
- Lead completó diagnóstico hace 2-60 días
- Ha visitado el mapa 3+ veces en los últimos 14 días
- NO ha pagado
- NO ha sido marcado como "descartado" o "no interesado"

**Acción:**

Enviar email personalizado:

```
Título: "Vimos que volviste"

Hola [Nombre],

Notamos que visitaste tu mapa varias veces.

Eso generalmente significa una de dos cosas:
1. Está resonando contigo (¡bien!) pero aún tienes dudas
2. Necesitas ver el impacto en acción antes de comprometer

Ambos son legítimos. ¿Cuál es?

[Reserva una llamada breve — 15 min — para resolver dudas]
[Dame 3 días más para pensarlo]
[No es para mí ahora, pero tal vez después]
```

**Buttons:**
- "Reservar llamada" → Link al booking de Javier (calendario)
- "Dame tiempo" → Dejar de enviar emails por 7 días más, volver a checkear
- "No ahora" → Marcar lead como "later" (sin descartar)

**Email personalizado por perfil (copy, no estructura):**

**PC:** "Vimos que volviste — y que tienes el tiempo justo"
```
Los ejecutivos que vuelven varias veces suelen necesitar una cosa:
ver que funciona. Una llamada de 15 minutos + tu primer resultado
de tu mapa en Semana 1 es lo que convence.
```

**FI:** "Vimos que analizaste tu mapa en detalle"
```
Volviste 5 veces. Eso dice que el análisis te interesa.
¿Qué dudas quedan? Aquí están las preguntas más frecuentes:
[Q1], [Q2], [Q3]. Si no resuelven, hablamos.
```

**CE:** "Vimos que necesitabas volver a confirmarte"
```
No está mal volver varias veces. De hecho, es normal que quien
cuida a otros necesite más confirmar que está permitido cuidarse.
Una llamada con Javier es exactamente eso: confirmación.
```

**CP:** "Vimos que estudiaste el programa en detalle"
```
5+ visitas = análisis serio de tu parte. Eso dice que confías.
¿Qué detalles necesitas confirmar? Aquí tu checklist personalizado.
Si prefieres hablar directamente:
[Agendar call con Javier →]
```

---

### Tarea 3: Cron 2 — "3+ emails sin abrir"

**Trigger:**
- Lead recibió 3+ emails de la secuencia nurturing
- Open rate < 20% (probabilidad: casi no abre emails)
- No pagó
- Aún está en la secuencia

**Acción:**

Cambiar frecuencia: en vez de emails cada 2-3 días, reducir a 1 email cada 7 días.

Esto es automático — no se envía email especial. Solo se reduce el spam.

**Lógica:**
```typescript
if (opened_emails < 1 && total_emails_sent >= 3) {
  schedule_next_email_in_days = 7; // en vez de 2-3
  mark_lead_as_low_engagement();
}
```

**En el admin LAM:** Mostrar badge "Baja apertura" junto al lead.

---

### Tarea 4: Cron 3 — "Mapa abandonado 14+ días"

**Trigger:**
- Lead completó diagnóstico hace 14+ días
- Última visita al mapa fue hace 14+ días
- NO ha pagado
- Heat score < 40 (se fue enfriando)

**Acción:**

Enviar email de reactivación + pequeño incentivo:

```
Título: "Vuelve a tu diagnóstico — algo cambió en 2 semanas"

Hola [Nombre],

Hace 2 semanas que hiciste tu diagnóstico de regulación.

Aquí hay dos cosas:
1. Tu mapa evolucionó automáticamente (mira cómo progresa sin hacer nada)
2. Si empezaras HOY, el programa sería diferente — ahora ya tienes contexto

[Ver cómo evolucionó tu mapa →]

Si en los próximos 3 días te unes, el primer protocolo
(sueño + regulación) corre por mi cuenta. Es un regalo
para recordarte que puedes empezar.

[Empezar ahora — 97€]

Si no es el momento, te entiendo. La puerta está abierta.
```

**Incentivo (opcional):** 20-30% descuento en la primera semana, o "protocolo de sueño gratis" (si es un PDF que cuesta aparte).

**Personalización por perfil:**

**PC:** "Tu productividad está en la mesa"
```
2 semanas sin regularización = pérdida de ~10-15h de focus semanal.
El programa empieza HOY = recupera eso en Semana 1.

[Ver cómo mejorar tu focus →]
```

**FI:** "Los números dirán la verdad"
```
Tu mapa ha recibido 14 días de actualización automática.
Mira los cambios: ¿mejoraste sin hacer nada? ¿Empeoraste?
Los números hablan.

[Ver mi evolución →]
```

**CE:** "Aún hay permiso para ti"
```
Si hace 2 semanas te sentiste mal cuidándote,
ahora que pasó tiempo, ¿cambia? Mira tu mapa actualizado.
Y si necesitas permiso nuevamente: aquí está.

[Volver a tu mapa →]
```

**CP:** "Tu roadmap sigue esperando"
```
El plan de 12 semanas es más relevante hoy que hace 2 semanas.
Tu situación cambió. Revisa tu diagnóstico actualizado
y el programa se ajustará a dónde estás ahora.

[Ver mi plan actualizado →]
```

---

### Tarea 5: Cron 4 — "Lead caliente sin booking"

**Trigger:**
- Heat score > 70 (persona "caliente")
- Visitó el mapa en los últimos 7 días
- Aún no pagó
- Aún no agendó una sesión con Javier

**Acción:**

**En el admin LAM:** Mostrar notificación/badge rojo: "🔥 LEAD CALIENTE — Sin booking"

Opcional: Slack notification a Javier (si está integrado).

```
[LEO] Lead caliente sin conversión:
- Nombre: [Nombre]
- Perfil: [Perfil]
- Heat: 78/100
- Visitas últimos 7d: 5
- Última visita: hace 2 horas
- Email abierto: hace 1 día

→ [Agendar manualmente / Enviar mensaje WhatsApp]
```

---

### Tarea 6: Tabla de campañas de re-engagement

Crear tabla `reengagement_campaigns`:

```sql
CREATE TABLE reengagement_campaigns (
  id UUID PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES diagnosticos(id),
  campaign_type TEXT,  -- '3visits', 'map_abandoned', 'high_heat', etc
  triggered_at TIMESTAMP,
  email_sent_at TIMESTAMP,
  action_taken TEXT,   -- 'booked_call', 'marked_later', 'not_interested'
  response_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
```

Esto permite a Javier ver qué funciona y qué no en re-engagement.

---

### Tarea 7: API y crons

**API GET `/api/admin/reengagement/pending`:**

Retorna leads que necesitan re-engagement + la acción recomendada.

```json
[
  {
    "lead_id": "...",
    "name": "Juan",
    "profile": "productive_collapsed",
    "campaign": "3visits_no_payment",
    "heat_score": 62,
    "visits_last_14d": 4,
    "days_since_diagnosis": 20,
    "status": "pending_email"
  }
]
```

**Cron job schedule:**

- **Cron 1** (3 visits): Cada 24 horas, a las 9am (hora local de Javier)
- **Cron 2** (low engagement): Cada 48 horas, cuando se envía siguiente email
- **Cron 3** (map abandoned): Cada 24 horas, a las 10am
- **Cron 4** (high heat): Cada 6 horas, dashboard en vivo del admin

---

### Tarea 8: Unsubscribe + Do Not Contact

Cada email de re-engagement incluye link para "No quiero recibir más emails".

Si alguien hace click:
- Marcar como `do_not_contact = true` en tabla `diagnosticos.meta`
- Dejar de enviar emails
- **Mantener en admin LAM** (Javier puede verlo y contactar manualmente si quiere)

---

## INTELIGENCIA DEL SISTEMA

### Predicción de churn ANTES de que ocurra (OBLIGATORIO)
No esperar a que el lead se enfríe. Anticipar:

1. **Señales tempranas:** Si alguien visitó el mapa 3 veces en los primeros 5 días pero 0 veces en los días 6-8 → señal de desaceleración (no frío todavía, pero tendencia)
2. **Modelo simple:** `churn_risk = (días_sin_visita / días_activo_promedio) × (1 - email_open_rate)`
3. **Umbrales:**
   - churn_risk < 0.3 → Normal
   - 0.3-0.6 → Alerta temprana → email de refuerzo sutil
   - 0.6-0.8 → Riesgo alto → WhatsApp + email + sugerencia a Javier
   - > 0.8 → Probable abandono → último intento (email directo de Javier, no automatizado)
4. **Dashboard:** "Leads en riesgo de churn: 3 (María CE, Juan FI, Pedro CP)"

### Cascada multi-canal (OBLIGATORIO)
El re-engagement no es solo email. Es una cascada:
1. **Día 1 de inactividad:** Email sutil (contenido nuevo disponible)
2. **Día 3:** Si email no abierto + tiene WhatsApp → enviar por WhatsApp
3. **Día 5:** Si WhatsApp leído pero no actuó → sugerencia a Javier en CO-LEARNING
4. **Día 7:** Si nada funciona → email final con tono diferente ("Esto no es presión. Solo queríamos que supieras que tus datos siguen aquí.")
5. **Día 14:** Marcar como "pausado". No más comunicación automática. Solo acción manual de Javier si lo decide.

### Feedback de rechazo inteligente (OBLIGATORIO)
Si alguien marca "no interesado" o se da de baja:
- Preguntar motivo (1 click): "No era para mí" / "Demasiados mensajes" / "Ahora no es buen momento" / "Otro"
- Según respuesta:
  - "Demasiados mensajes" → Reducir frecuencia al 50% para personas con mismo perfil (señal sistémica)
  - "Ahora no es buen momento" → Guardar en estado "pausado_temporal". Re-contactar en 30 días: "Han pasado 30 días. ¿Es ahora mejor momento?"
  - "No era para mí" → Marcar como "perdido" + análizar su perfil y gateway en CO-LEARNING: "¿El gateway lo clasificó bien? ¿Era realmente su perfil?"

### Conexión con AMPLIFY
Si un lead frío fue invitado por alguien (tiene `referred_by`):
- El invitador es una palanca de re-engagement. Enviar al invitador: "Tu invitado/a no ha visitado su mapa en 14 días. A veces un mensaje personal hace la diferencia. [Enviarle un recordatorio →]"
- Esto convierte al invitador en agente de re-engagement orgánico

### Aprendizaje continuo (OBLIGATORIO)
Cada acción de re-engagement mide su resultado:
- "Email de re-engagement (tipo 1) enviado → ¿Visitó mapa en 48h? ¿Compró en 7 días?"
- Los resultados alimentan un ranking: "El email tipo 2 (datos actualizados) funciona 2.3x mejor que el tipo 1 (genérico) para FI"
- CO-LEARNING surfacea los insights: "Re-engagement funciona mejor para CE (45% reactivación) que para FI (12%). Para FI, considerar approach diferente."

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin avisarme antes — muestra el SQL.
- Los crons son automáticos, pero Javier debe poder ver en el admin qué está pasando.
- Respetar `do_not_contact` flag — NUNCA enviar si está activo.
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- Los crons no envían a leads marcados como `do_not_contact`.
- Los emails de re-engagement incluyen link de unsubscribe.
- No exponer datos sensibles en admin (solo métricas agregadas).

### 3. Calidad del código
- Cero console.log de debug.
- Los crons están bien separados (4 archivos/funciones diferentes).
- Archivos < 300 líneas.

### 4. Testing funcional
- Simular lead con 3 visitas: recibe email (no manual, automático)
- Simular lead con baja apertura: reduce frecuencia (verifica que siguientes emails son a 7d)
- Simular lead con mapa abandonado 14d: recibe email reactivación
- Simular lead con heat score 75 sin booking: aparece en admin LAM
- Click en "Do not contact": dejar de recibir emails
- Los crons se ejecutan a la hora programada

### 5. Accesibilidad
- N/A (crons backend)

### 6. Performance
- Los crons no bloquean la aplicación (corren en background)
- No N+1 queries al calcular heat scores
- Máximo latencia: 1 segundo por cron (si tarda más, algo está mal)

### 7. Diseño y UX (OBLIGATORIO)

**7a. Personalización:** Cada email está escrito en la voz del perfil.
**7b. Claridad:** Cada email tiene UN CTA claro + opción para "later" o "no thanks".
**7c. Respeto:** Reducir frecuencia (Cron 2) es mejor que desuscribir forzado.
**7d. Insights:** Admin LAM muestra leads pendientes con contexto (heat, visitas, días).

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/DATABASE.md` con tabla `reengagement_campaigns`.
2. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **REENGAGEMENT — Sesión 1: Re-activación automática** ({fecha}):
     - Heat score mejorado, 4 crons (3visits, low engagement, map abandoned, high heat), tabla de campañas, API pending, unsubscribe handling
   ```
3. Commit final limpio.
