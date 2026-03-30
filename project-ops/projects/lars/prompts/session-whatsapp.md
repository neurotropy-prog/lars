## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión WHATSAPP: Integración Meta Cloud API para notificaciones automáticas

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño visual
- `docs/DATABASE.md` — Schema actual
- `docs/SECURITY.md` — Protección de datos sensibles

## Lo que ya está construido
- Gateway → Mapa vivo → Compra
- Email secuencia de nurturing
- Admin con seguimiento de leads
- Sistema de evolución del mapa (día 0→90)

## Tu tarea

Lee `docs/DATABASE.md` completamente.

Esta sesión integra **WhatsApp Cloud API de Meta** para enviar notificaciones automáticas de evolución del mapa, recordatorios de visita, y resultados disponibles. Es un canal adicional (no reemplaza email, sino complementa).

**IMPORTANTE — Requisitos previos:**
- Cuenta Meta Business Suite (Javier debe crearla)
- Número de teléfono dedicado verificado en Meta
- App ID y API key de Meta
- Templates pre-aprobadas en Meta (Meta revisa el contenido)

Implementa en dos fases:
**FASE VISUAL:** Panel de admin con UI para ver leads con WhatsApp activo, historial de mensajes. Avísame cuando esté listo.
**FASE FUNCIONAL:** Solo después de mi aprobación visual, conecta Meta Cloud API.

### Tarea 1: Arquitectura de flujo WhatsApp

```
FLUJO GENERAL:

1. Usuario completa gateway (día 0)
   ↓
2. En el mapa (día 1-2): Aparece popup opt-in
   "¿Te gustaría recibir actualizaciones por WhatsApp?"
   [Activar WhatsApp]  [Ahora no]

3. Si opt-in:
   - Guardar consent + teléfono en BD
   - Enviar "Bienvenido a LARS por WhatsApp" (template aprobado Meta)

4. Cada día, según evento:
   - Evolución del mapa (día 7, 14, 30, etc.)
   - Recordatorio de sesión 1:1 (24h antes)
   - Resultado disponible (post-evaluación)
   - Micro-hábito diario (opcional, según perfil)

5. Fallback a email si:
   - Usuario no opt-in
   - Meta API falla
   - Número inválido
```

### Tarea 2: Opt-in y consentimiento

**Popup en el mapa (después de día 1, primera visita):**

```
NOTIFICACIONES POR WHATSAPP

¿Quieres recibir actualizaciones de tu mapa
y recordatorios de sesiones por WhatsApp?

Esto es opcional. También recibirás todo por email.

[Activar WhatsApp]  [Ahora no]

"Solo recibirás mensajes relacionados con tu programa."
```

Al hacer click en "Activar WhatsApp":

```
1. Se abre modal con campo de teléfono
   [+34 600 123 456]

   "Verifica tu número. Enviaremos un código."

2. Usuario recibe código en WhatsApp
3. Ingresa código en modal
4. Sistema verifica con Meta API
5. Si válido: `whatsapp_opt_in = true`, `whatsapp_phone = "+34600123456"`
```

**Almacenamiento en BD:**

Tabla `diagnosticos` (si no existe, crear columna):
- `whatsapp_phone` (string, opcional, +34...)
- `whatsapp_opt_in` (boolean, default false)
- `whatsapp_opted_in_at` (timestamp)
- `whatsapp_last_message_at` (timestamp, para tracking)

### Tarea 3: Templates de WhatsApp aprobados por Meta

Meta requiere que los templates sean pre-aprobados. Los templates son:

**TEMPLATE 1: Bienvenida**
```
Hola {{1}}!

Bienvenido a LARS.

Aquí recibirás actualizaciones de tu evolución,
recordatorios de sesiones, y acceso a tu mapa.

Tu diagnóstico está listo: {{2}}

¡Vamos!
```

Variables:
- `{{1}}` = nombre
- `{{2}}` = link al mapa

---

**TEMPLATE 2: Evolución del mapa (genérico)**
```
Hola {{1}},

Tu mapa de Semana {{2}} está listo.

Resultados clave:
{{3}}

Ver mapa completo: {{4}}
```

Variables:
- `{{1}}` = nombre
- `{{2}}` = número de semana
- `{{3}}` = resumen (ej: "Regulación Nerviosa: ↑ +8 pts")
- `{{4}}` = link al mapa

---

**TEMPLATE 3: Recordatorio de sesión**
```
Hola {{1}},

Tu sesión 1:1 es mañana a las {{2}}.

Confirmamos: {{3}}
{{4}}

¿Necesitas cambiarla?
Responde a este mensaje o accede a: {{5}}
```

Variables:
- `{{1}}` = nombre
- `{{2}}` = hora
- `{{3}}` = "Sesión con Javier"
- `{{4}}` = ubicación o zoom link
- `{{5}}` = link a booking

---

**TEMPLATE 4: Resultado disponible**
```
Hola {{1}},

Tu resultado de {{2}} está disponible.

Cambios más importantes:
{{3}}

Ver análisis completo: {{4}}
```

Variables:
- `{{1}}` = nombre
- `{{2}}` = "Semana 4" o "Evaluación mes 1"
- `{{3}}` = puntos clave
- `{{4}}` = link

---

**Nota crítica:** Estos templates deben ser enviados a Meta para aprobación. Javier debe hacer esto en Meta Business Suite. No cambies el contenido sin re-aprobación.

### Tarea 4: Envío automático de mensajes

En la lógica de cron (que ya existe para emails), agregar:

```typescript
// Pseudo-código
if (triggerEvent === 'mapa_evolution') {
  const users = await db.diagnosticos.findMany({
    where: { whatsapp_opt_in: true, día: 7 | 14 | 30 | 90 }
  });

  for (const user of users) {
    await sendWhatsAppMessage({
      template: 'map_evolution',
      phone: user.whatsapp_phone,
      variables: {
        nombre: user.nombre,
        semana: currentWeek,
        resumen: generateMapSummary(user),
        mapLink: generateMapLink(user)
      }
    });
  }
}
```

**Triggers:**
1. **Evolución del mapa** — día 7, 14, 30, 60, 90 (si `whatsapp_opt_in = true`)
2. **Recordatorio sesión** — 24h antes de la sesión agendada
3. **Resultado disponible** — cuando se completa una evaluación (POST a `/api/evaluacion/complete`)

### Tarea 5: API de Meta Cloud

Crear endpoint interno (no exponerlo públicamente):

```
POST /api/whatsapp/send

Body:
{
  "template_name": "map_evolution" | "reminder_session" | "result_available" | "welcome",
  "phone_number": "+34600123456",
  "variables": {
    "nombre": "María",
    "semana": 2,
    "resumen": "Regulación: ↑ +8 pts",
    "mapLink": "https://lars.institutoepigenetico.com/mapa/hash123"
  }
}

Response:
{
  "success": boolean,
  "message_id": "string (Meta ID)",
  "status": "queued" | "sent" | "failed",
  "error": "string (si failed)"
}
```

**Internamente:**
- Convierte `template_name` a template ID en Meta
- Valida teléfono (formato +34... válido)
- Llama a Meta Cloud API con auth token
- Registra en tabla `whatsapp_messages` para tracking

### Tarea 6: Tabla de tracking

```
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY,
  diagnostic_id UUID (FK a diagnosticos),
  template_name VARCHAR,
  phone_number VARCHAR,
  message_id VARCHAR (Meta ID),
  status VARCHAR ('queued', 'sent', 'delivered', 'read', 'failed'),
  variables JSONB,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  failed_reason VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

Meta webhook notificará cambios de estado: `queued` → `sent` → `delivered` → `read`.

### Tarea 7: Webhook para actualizaciones de Meta

Meta enviará eventos a:

```
POST /api/webhooks/whatsapp

{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "id": "Meta message ID",
          "status": "delivered | read"
        }]
      }
    }]
  }]
}
```

Tu endpoint debe:
1. Buscar el `message_id` en tabla `whatsapp_messages`
2. Actualizar `status` y `delivered_at` o `read_at`

### Tarea 8: Panel admin de WhatsApp

Nueva sección en admin: `/admin/whatsapp`

```
WHATSAPP — GESTIÓN DE LEADS

Leads activos: 47
  ✅ Mensajes entregados: 156
  📖 Mensajes leídos: 142
  ❌ Fallo de envío: 2

[TABLA DE LEADS]

| Nombre | Perfil | Teléfono | Opt-in | Último msg | Estado | [Ver]
| -------|--------|----------|--------|-----------|--------|------
| María R. | FI | +34 600 ... | ✅ Día 3 | Ayer 14:30 | 📖 Leído | [Ver]
| Juan M. | PC | +34 601 ... | ✅ Día 1 | Hoy 10:45 | ✅ Entregado | [Ver]
| Sofia P. | CE | +34 602 ... | ❌ No | — | — | [Invitar]
| Carlos L. | CP | +34 603 ... | ✅ Día 2 | Hace 2h | ❌ Fallo | [Reintentar]

[HISTORIAL DE MENSAJES]

Filtrar por: Plantilla | Estado | Fecha

| Fecha | Usuario | Plantilla | Teléfono | Estado | Meta ID |
| -----|---------|-----------|----------|--------|---------|
| Hoy 14:30 | María R. | map_evolution | +34 600 ... | 📖 Leído | wamid_A1B... |
| Ayer 10:45 | Juan M. | reminder_session | +34 601 ... | ✅ Entregado | wamid_A2C... |
```

**Opciones de admin:**
- Ver detalles de un lead: historial completo de mensajes, estado opt-in, teléfono
- Reintentar envío si falló
- Cambiar status de opt-in manualmente (ej: si usuario se queja por WhatsApp)
- Ver logs de webhook (para debugging)

### Tarea 9: Fallback a email

Si:
- User no opt-in WhatsApp
- Meta API falla (error 429, timeout, etc.)
- Número inválido

Sistema automáticamente envía el mismo contenido por email (plantilla predefinida).

```typescript
try {
  await sendWhatsAppMessage(...)
} catch (error) {
  console.error('WhatsApp failed:', error);
  // Fallback a email
  await sendEmailMessage({
    template: `fallback_${template_name}`,
    to: user.email,
    variables: {...}
  });

  // Log el fallback
  await logWhatsAppFallback(user.id, error.message);
}
```

### Tarea 10: Consideraciones de seguridad

- **Números:** Almacenar encriptados en BD (no plaintext en logs)
- **API key Meta:** En variable de entorno, NUNCA en código
- **Webhook:** Verificar firma de Meta (X-Hub-Signature-256)
- **Opt-in:** Registrar consentimiento + timestamp (compliance GDPR)
- **Datos personales:** No loguear nombres completos en console, solo initials
- **Rate limiting:** Meta tiene límite de 1000 conv/mes (free tier). Implementar contador.

### Tarea 11: Monitoring y alerts

En admin, mostrar:
```
META CLOUD API — STATUS

Tasa de éxito (últimas 24h): 98%
Mensajes enviados hoy: 24
Mensajes entregados: 23
Mensajes leídos: 19

Rate limit: 950 / 1000 (límite mensual)
Próximo reset: 2026-04-27

⚠️ Alertas:
- 2 números bloqueados por Meta (usuario reportó spam?)
```

## INTELIGENCIA DEL SISTEMA

### Templates por perfil (OBLIGATORIO)
Los 4 templates de Meta NO son genéricos. Crear variantes por perfil (Meta permite variantes dentro de un template):

**TEMPLATE 2 — Evolución del mapa:**
- **PC:** "Tu regulación subió {{3}} pts. Esto equivale a ~2h más de productividad focada. Ver datos: {{4}}"
- **FI:** "Datos Semana {{2}}: {{3}}. Percentil actualizado. Dashboard: {{4}}"
- **CE:** "Semana {{2}} — estás mejorando. {{3}}. Miles como tú avanzan al mismo ritmo. Tu mapa: {{4}}"
- **CP:** "Hito Semana {{2}} alcanzado. {{3}}. Siguiente checkpoint: Semana {{siguiente}}. Plan: {{4}}"

### Optimización de hora de envío (OBLIGATORIO)
No enviar todos los mensajes a la misma hora. El sistema aprende cuándo cada perfil abre más:

1. **Inicio:** Enviar a hora por defecto según perfil:
   - PC: 7:30 (antes de empezar a trabajar)
   - FI: 8:00 (inicio de jornada, modo datos)
   - CE: 13:00 (pausa de mediodía, momento para sí)
   - CP: 9:00 (inicio estructurado del día)

2. **Aprendizaje:** Después de 5 mensajes, analizar `read_at` vs `sent_at` para cada usuario. Si María (CE) abre siempre a las 22:00, cambiar su hora de envío a 21:30.

3. **Dashboard admin:** "Hora óptima de envío por perfil: PC 7:30 (85% lectura), FI 8:15 (79%), CE 21:45 (91%), CP 9:00 (83%)"

### Preferencia de canal inteligente (OBLIGATORIO)
El sistema aprende si WhatsApp o email funciona mejor para cada persona:

1. **Tracking:** Para cada usuario, comparar tasa de apertura WhatsApp vs email en los últimos 30 días.
2. **Decisión automática:** Si WhatsApp tiene >70% lectura y email <30% → priorizar WhatsApp. Y viceversa.
3. **Canal único:** Si un mensaje se envía por WhatsApp Y se lee, NO enviar el mismo contenido por email (evitar duplicados).
4. **Dashboard:** "Preferencia de canal: 67% prefieren WhatsApp, 28% email, 5% ambos"

### Conexión con RE-ENGAGEMENT (OBLIGATORIO)
WhatsApp es un canal de re-engagement:
- Si un lead tibio tiene WhatsApp opt-in, el cron de re-engagement puede enviar un WhatsApp en vez de email: "Hace 14 días que no visitas tu mapa. Tus datos de regulación se han actualizado: [link]"
- El re-engagement por WhatsApp tiene prioridad sobre email (mayor tasa de apertura)
- Si el WhatsApp de re-engagement se lee pero no se actúa en 48h → generar sugerencia en CO-LEARNING para Javier

### Conexión con CO-LEARNING
Cada mensaje de WhatsApp alimenta el sistema de inteligencia:
- "WhatsApp de evolución enviado a María R. → Leído en 3 min → Visitó mapa en 12 min → EFECTIVO"
- "WhatsApp de recordatorio a Juan M. → No leído en 24h → INEFECTIVO → Cambiar a email"
- Estas señales alimentan las sugerencias de Javier: "Juan M. no responde a WhatsApp. Considerar llamada directa."

### Micro-hábitos por WhatsApp (OPCIONAL pero potente)
Si el usuario opta in, enviar micro-hábito diario calibrado por perfil:
- **PC:** "Hoy: 5 minutos de respiración antes de la primera reunión. Tu regulación sube ~3 pts por sesión."
- **FI:** "Dato: 5 min de respiración diafragmática reduce cortisol 23%. Prueba antes de las 10:00."
- **CE:** "Hoy es un buen día para ti. 5 minutos de respiración. Sin culpa. Tu familia lo nota."
- **CP:** "Día 3/7 del protocolo. Siguiente paso: respiración 5 min. Checklist: [link]"

Frecuencia: 1 mensaje/día durante Semana 1, luego 3/semana, luego 1/semana.
Opt-out fácil: "Responde STOP para pausar los micro-hábitos."

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin mostrarme el SQL antes.
- La integración con Meta requiere credenciales reales. En desarrollo, usa sandbox Meta (números de prueba).
- Todo lo que envías por WhatsApp debe ser aprobado por Meta primero (templates).
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- API key Meta en `.env`, nunca en código
- Números de teléfono encriptados en BD
- Webhook de Meta verifica firma
- Opt-in + timestamp registrados
- Rate limiting implementado

### 3. Calidad del código
- Cero console.log con datos sensibles
- Funciones reutilizables (sendWhatsAppMessage, formatPhoneNumber)
- Archivos < 400 líneas

### 4. Testing funcional
- Opt-in popup: aparece en el mapa (día 1+)
- Validación de teléfono: rechaza números inválidos
- Envío de mensaje: integración con Meta sandbox
- Webhook: actualiza status en BD
- Fallback: si Meta falla, usa email
- Panel admin: lista leads, historial, estado opt-in
- Rate limit: contador correcto, alerta si acerca límite

### 5. Accesibilidad
- Inputs de teléfono con label y validación clara
- Botones opt-in accesibles
- Mensajes de error claros

### 6. Performance
- No bloquea opt-in (async)
- Webhook procesa rápido (< 500ms)
- Panel admin lazy-loads historial

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Popup opt-in usa DESIGN.md tokens.
**7b. Claridad:** El popup explica qué es WhatsApp opt-in (no es obligatorio).
**7c. Feedback:** Después de ingresar teléfono, confirmación clara.
**7d. Error handling:** Si número inválido, mensaje claro (no código de error técnico).
**7e. Control:** Usuario puede cambiar opt-in en settings después.
**7f. Confianza:** "Solo mensajes de LARS" — tranquilidad sobre spam.

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/PROGRESS.md`:
   ```
   - ✅ **WHATSAPP — Sesión 1: Integración Meta Cloud API** ({fecha}):
     - Opt-in WhatsApp en mapa, templates Meta aprobados, envío automático evolución/recordatorios/resultados, tabla tracking, webhook actualizaciones, panel admin, fallback email, rate limiting
   ```
2. Actualiza `docs/DATABASE.md` con nuevas tablas
3. Commit final limpio.

**NOTA CRÍTICA:** Javier debe hacer manualmente:
1. Crear cuenta Meta Business Suite (si no tiene)
2. Verificar número de teléfono dedicado en Meta
3. Solicitar aprobación de los 4 templates en Meta
4. Proporcionar App ID + API token
5. Configurar webhook callback URL en Meta console

Sin estos, la integración funciona en sandbox pero no en producción.
