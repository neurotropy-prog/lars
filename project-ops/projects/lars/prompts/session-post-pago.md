## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión POST-PAGO: Rediseño de onboarding Semana 1 (post-checkout)

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño visual
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Los 4 perfiles y su lenguaje
- `docs/DATABASE.md` — Schema actual

## Lo que ya está construido
- Gateway → Mapa vivo → Compra (Stripe test mode)
- Email de bienvenida genérico
- Booking con Google Calendar existe (integración)
- Admin con Hub, LAM, etc.

## Tu tarea

Lee `docs/features/FEATURE_GATEWAY_DESIGN.md` completamente.

Actualmente, después de pagar, el usuario ve una página genérica "Pago completado ✓". Fin.

Esta sesión transforma `/pago/exito` en **onboarding Semana 1 personalizado por perfil**, donde:
1. Descargan el protocolo de sueño (PDF, contenido de Javier)
2. Agendan su sesión 1:1 (usando el booking que ya existe)
3. Ven un vídeo de bienvenida (contenido de Javier)
4. Saben qué esperar en 72 horas

**IMPORTANTE:** Esta página requiere contenido nuevo de Javier:
- PDF: "Protocolo de sueño LARS — Semana 1"
- Vídeo: Introducción a LARS (5 minutos máximo, tonalidad cálida)

Javier debe proporcionar estos archivos. Aquí construimos la experiencia.

### Tarea 1: Estructura de la página `/pago/exito`

**Pantalla 1/4 — Bienvenida personalizada:**

```
¡BIENVENIDO A LARS!

Tu pago se ha confirmado.
Ahora empieza tu Semana 1.

[Siguiente →]
```

**Estilo:** Hero minimalista. Fondo oscuro cálido. Cormorant para el headline. Animación fade-in.

---

**Pantalla 2/4 — Descarga protocolo:**

```
PASO 1: TU PROTOCOLO

Empieza con esto: el protocolo de sueño de 7 días.
Dormir mejor es el fundamento de todo lo demás.

[📥 Descargar PDF — Protocolo Semana 1]

"Si no duermes, nada más funciona."
```

**Estilo:**
- Botón de descarga grande (no ghost button — acción importante)
- Hipervínculo con ícono de descarga
- El PDF está hosteado (ej: `/documents/protocolo-sleep-week-1.pdf`)
- Fallback si Javier no ha subido el PDF: mostrar botón disabled + texto "Disponible pronto"

**Analytics:** Registrar si descargó o no.

---

**Pantalla 3/4 — Agendar sesión:**

```
PASO 2: TU PRIMERA SESIÓN

Una sesión 1:1 privada contigo para calibrar
el programa a tu situación específica.

[Agendar sesión →]

"Dura 30 minutos. Sin costo extra. Es el momento
donde empiezas a verte diferente."
```

**Botón "Agendar sesión":** Abre el booking que ya existe (Calendly o integración con Google Calendar).

Si la persona ya tiene una sesión agendada (ej: la agendó desde el mapa), mostrar:
```
PASO 2: TU PRIMERA SESIÓN

Ya tienes sesión agendada para:
[Fecha y hora]

¿Necesitas cambiarla?
[Cambiar sesión →]
```

---

**Pantalla 4/4 — Bienvenida + vídeo + qué esperar:**

```
PASO 3: BIENVENIDA A LARS

[Vídeo de Javier — 5 min]

Qué esperar en los próximos 3 días:

→ HOY: Descargaste el protocolo de sueño
  "Empieza esta noche si es posible."

→ MAÑANA: Email con tu mapa evolucionado
  "Verás cómo los primeros cambios aparecen."

→ PASADO: Tu sesión 1:1
  "Aquí calibramos todo a tu perfil."

---

[Acceder al programa →]
```

**Vídeo:** Embebido (iframe, Vimeo o YouTube unlisted, controlado por Javier).

**CTA final:** Lleva al hub privado del usuario (la página principal con sus recursos, sus datos, etc.).

---

### Tarea 2: Personalización por perfil

Cada perfil ve el mismo flujo (4 pasos), pero el **tono y los detalles cambian** según `diagnosticos.profile`:

#### **Productivo Colapsado:**

Pantalla 2 (Protocolo):
```
PASO 1: TU PROTOCOLO

El sueño es el 40% del recupero.
El protocolo de 7 días está diseñado para ejecutivos
que dieron todo durante años y necesitan reiniciar.

[📥 Descargar PDF — Protocolo Semana 1]

"Empieza mañana si quieres. O hoy si puedes."
```

Pantalla 4 (Qué esperar):
```
Qué esperar en los próximos 3 días:

→ HOY: Descargaste el protocolo
  "Tiempo para ti. Sin productividad pendiente."

→ MAÑANA: Email con tu evolución
  "Primeras métricas de cambio."

→ PASADO: Tu sesión calibración
  "Tu plan personalizado para 12 semanas."
```

#### **Fuerte Invisible:**

Pantalla 2 (Protocolo):
```
PASO 1: TUS DATOS

El protocolo de sueño está basado en biología
de la regulación nerviosa. Evidencia, no supersticiones.

[📥 Descargar PDF — Protocolo Semana 1 (Datos científicos)]

"Incluye referencias a estudios en apéndice."
```

Pantalla 4 (Qué esperar):
```
Qué esperar en los próximos 3 días:

→ HOY: Descargaste el protocolo científico
  "Basado en investigación de sueño y vagus."

→ MAÑANA: Datos personalizados en tu dashboard
  "Métricas de regulación actualizadas."

→ PASADO: Tu sesión análisis
  "Análisis profundo de tu caso específico."
```

#### **Cuidador Exhausto:**

Pantalla 2 (Protocolo):
```
PASO 1: TU PERMISO

El protocolo de sueño es tu permiso de cuidarte.
Miles de personas en tu situación andan por aquí,
y todas mejoran cuando duermen mejor.

[📥 Descargar PDF — Protocolo Semana 1]

"Tu bienestar es el bienestar de todos."
```

Pantalla 4 (Qué esperar):
```
Qué esperar en los próximos 3 días:

→ HOY: Descargaste tu protocolo
  "Tiempo para ti. Sin culpa."

→ MAÑANA: Email con historias de otros
  "Historias de personas en tu situación."

→ PASADO: Tu sesión de conexión
  "Hablar con alguien que entiende."
```

#### **Controlador Paralizado:**

Pantalla 2 (Protocolo):
```
PASO 1: TU ESTRUCTURA

El protocolo de sueño es lo primero en tu plan de 12 semanas.
7 días, pasos claros, métricas que verificar cada día.

[📥 Descargar PDF — Protocolo Semana 1 (Con checklist diario)]

"Incluye tracking sheet para cada día."
```

Pantalla 4 (Qué esperar):
```
Qué esperar en los próximos 3 días:

→ HOY: Descargaste el protocolo estructurado
  "Checklist para cada día."

→ MAÑANA: Tu plan completo de 12 semanas
  "Hitos, métricas, deliverables."

→ PASADO: Tu sesión de planificación
  "Tu roadmap personalizado confirmado."
```

---

### Tarea 3: Gestión de documentos

**Estructura de archivos:**
```
/public/documents/
  ├── protocolo-sleep-week-1.pdf (versión estándar)
  ├── protocolo-sleep-week-1-scientific.pdf (para FI, con referencias)
  └── protocolo-sleep-week-1-checklist.pdf (para CP, con tracking sheet)
```

Las versiones pueden ser la misma con diferentes portadas/apéndices, o 3 versiones diferentes. Depende de Javier.

**API para verificar disponibilidad:**

```typescript
GET /api/documents/available
Response:
{
  "protocolo_sleep": true,
  "video_welcome": true,
  "other_resources": [...]
}
```

Si algún documento no está disponible (Javier aún no los subió), los botones en la página de onboarding estarán disabled con tooltip "Disponible pronto".

---

### Tarea 4: Vídeo de Javier

**Pantalla 4:** Embeber vídeo.

```html
<iframe
  width="100%"
  height="600px"
  src="https://vimeo.com/[ID]"
  frameborder="0"
  allowfullscreen
></iframe>
```

O YouTube unlisted (URL privada que solo Javier comparte).

**Fallback:** Si el vídeo no existe o no carga, mostrar:
```
VIDEO — Disponible pronto

"Javier está grabando tu bienvenida.
Volverá aquí pronto."
```

---

### Tarea 5: Email de seguimiento 24h

Después de pasar por el onboarding, enviar email automático 24 horas después:

**Asunto:** "Tu Protocolo Semana 1 + tu plan"

**Contenido (personalizado por perfil):**

```
Hola [Nombre],

Pasó un día desde que empezó tu LARS.

Aquí está tu mapa actualizado con los primeros cambios,
y tu plan personalizado para las próximas 11 semanas.

[Ver mi evolución →]
[Mi plan →]

Tu sesión 1:1 es el [fecha/hora].
Es el momento donde todo se acelera.

Nos vemos pronto.
```

**Si no descargó el protocolo:** Incluir link de descarga de nuevo.

**Si no agendó sesión:** Incluir CTA "Agendar ahora".

---

### Tarea 6: Tracking y Analytics

En `/api/analytics` (admin), registrar:

```
- event_type: "onboarding_step_viewed"
- step: "welcome" | "protocol_download" | "session_booking" | "video_watch"
- profile: "productive_collapsed" | ...
- completed: boolean (reached end of onboarding)
- time_spent_seconds: number
```

Esto permite a Javier saber:
- ¿Cuántas personas descargaron el protocolo?
- ¿Cuántas agendaron sesión?
- ¿Cuánta gente completó todo?
- ¿Dónde se caen?

---

## INTELIGENCIA DEL SISTEMA

### Onboarding adaptativo por perfil (OBLIGATORIO)
El onboarding NO es un flujo lineal idéntico. La ESTRUCTURA cambia según el perfil:

**PC (Productivo Colapsado):** Priorizar eficiencia. Mostrar pantalla 2 (protocolo) PRIMERO, luego booking, luego vídeo. El PC quiere acción inmediata, no bienvenidas.

**FI (Fuerte Invisible):** Priorizar datos. Mostrar pantalla 2 con versión científica del protocolo. Añadir link a "Ver la evidencia detrás del protocolo" (PDF con referencias). El vídeo es opcional para FI — ofrecer "Prefiero leer" como alternativa.

**CE (Cuidador Exhausto):** Priorizar conexión. Mostrar el vídeo de Javier PRIMERO (conexión emocional antes de tareas). Después el protocolo con lenguaje de permiso. Añadir: "Miles de personas como tú empiezan hoy."

**CP (Controlador Paralizado):** Priorizar estructura. Mostrar un timeline visual de las 12 semanas ANTES del protocolo. El CP necesita ver el plan completo antes de dar el primer paso. Añadir checklist descargable: "Tu roadmap de 12 semanas."

### Conexión con datos colectivos (OBLIGATORIO)
En la pantalla de bienvenida, mostrar dato colectivo personalizado:
- PC: "97 ejecutivos como tú empezaron esta semana. El 89% completó la Semana 1."
- FI: "Tu grupo de regulación: 24 personas. Dato: el 78% ve cambio medible en día 7."
- CE: "31 personas en tu misma situación están aquí. No estás sola/o."
- CP: "Tu cohorte: 14 personas. Tasa de éxito Semana 1: 92%."

Estos datos vienen del endpoint de COLECTIVA DINÁMICA (ya construido).

### Outcome tracking con feedback loop (OBLIGATORIO)
Cada paso del onboarding mide y aprende:

1. **Tracking granular:** No solo "step_viewed" sino "step_completed", "step_skipped", "time_on_step"
2. **Correlación con retención:** El sistema mide si las personas que descargaron el protocolo en día 0 tienen mejor adherencia en Semana 2. Si sí → el sistema prioriza ese paso. Si no → el sistema experimenta con otro orden.
3. **Señal a CO-LEARNING:** Si alguien completa el pago pero NO descarga el protocolo en 24h, generar sugerencia automática: "María R. (CE) pagó pero no descargó el protocolo. Sugerir: email de recordatorio con tono de permiso."
4. **Señal a RE-ENGAGEMENT:** Si alguien completa el pago pero NO agenda sesión en 48h, activar cron de re-engagement específico para post-pago.

### Email 24h inteligente (OBLIGATORIO)
El email de seguimiento NO es estático. Se adapta a lo que la persona HIZO:

- **Descargó protocolo + agendó sesión:** "Todo listo. Tu sesión es el [fecha]. Mientras tanto, tu mapa evoluciona."
- **Descargó protocolo + NO agendó:** "Tu protocolo está en marcha. El siguiente paso es tu sesión 1:1 — [Agendar ahora →]. Es donde todo se personaliza."
- **NO descargó + NO agendó:** "Entendemos. A veces el primer paso cuesta. Aquí tienes tu protocolo: [Descargar →]. Y cuando estés listo/a, tu sesión te espera: [Agendar →]."
- **NO descargó + agendó:** "Tu sesión está confirmada para [fecha]. Antes de llegar, descarga el protocolo de sueño — es lo que trabajaréis juntos: [Descargar →]."

Cada variante tiene su propio subject line calibrado por perfil.

### Conexión con AMPLIFY
Si la persona viene de una invitación AMPLIFY (tiene `referred_by` en su diagnóstico):
- En la pantalla de bienvenida, añadir: "Tu comparación con [Iniciales] se activará cuando completes la Semana 1."
- Esto crea un incentivo adicional para completar el onboarding

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin avisarme antes.
- Los documentos (PDF, video) los proporciona Javier. Tu rol es construir la experiencia.
- Las rutas `/pago/exito` y `/documents/*` deben estar protegidas (solo accesibles si el usuario pagó).
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- La página `/pago/exito` solo es accesible si hay un pago confirmado (verificar en Stripe).
- Los PDFs están en `/public/documents` con acceso público, pero solo se enlazan en contexto de compra.
- El vídeo es unlisted o privado (no indexable).

### 3. Calidad del código
- Cero console.log de debug.
- Componentes reutilizables (OnboardingStep, ProtocolDownloadButton).
- Archivos < 300 líneas.

### 4. Testing funcional
- Cargar `/pago/exito` sin pago: redirect a login o error
- Con pago confirmado: ver las 4 pantallas en orden
- Cambiar de perfil en BD: ver copy distinto
- Click en "Descargar PDF": inicia descarga del archivo
- Click en "Agendar sesión": abre booking
- Mobile 375px: todo responsive, vídeo responsive

### 5. Accesibilidad
- Buttons y links con focus visible
- Vídeo tiene controles accesibles (play, pause, etc.)
- Subtítulos si el vídeo tiene audio importante

### 6. Performance
- PDFs hosteados rápidamente (< 2s descarga)
- Vídeo lazy load (no bloquea carga de página)
- Las 4 pantallas cargan rápido

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Usa tokens de DESIGN.md. Mismo fondo oscuro, tipografía, espacios.
**7b. Progreso:** Las 4 pantallas usan indicador de progreso (Step 1/4, 2/4, 3/4, 4/4).
**7c. Feedback:** Click en botones: loading state, error si falla, success si funciona.
**7d. Claridad:** Un CTA por pantalla. La acción siguiente es clara.
**7e. Voz:** Cada perfil siente que esto fue escrito para ellos (tono diferente, lenguaje diferente).
**7f. WOW:** La transición entre pantallas es suave. El vídeo de Javier es el momento de conexión.

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **POST-PAGO — Sesión 1: Onboarding Semana 1** ({fecha}):
     - 4 pantallas onboarding personalizado, descarga protocolo, booking sesión, vídeo bienvenida, email 24h, analytics
   ```
2. Commit final limpio.

**NOTA CRÍTICA:** Esta sesión requiere que Javier proporcione:
1. PDF protocolo de sueño (¿3 versiones o 1?)
2. Vídeo de bienvenida (5 min máximo, URL o archivo)

Sin estos, construye placeholders con "Disponible pronto".
