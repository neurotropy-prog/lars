## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión CONVERT-PATH: Gateway acelerado CONVERT para personas en alta confianza (Confidence/Readiness)

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño visual
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — **Sección "Adaptación por estado de entrada"** (LEER ENTERO)
- `docs/DATABASE.md` — Schema actual

## Lo que ya está construido
- Gateway estándar: 10 preguntas, 12+ minutos
- Detección de UTM parameters
- Mapa vivo con compra de acceso
- Emails en secuencia

## Tu tarea

Lee `docs/features/FEATURE_GATEWAY_DESIGN.md` completamente, especialmente la sección "Adaptación por estado de entrada".

Hay personas que llegan al gateway con ALTA CONFIANZA PREVIA (ej: referidos de otros clientes, tráfico directo desde Linkedin de Javier, campañas específicas de "Programa LARS 97€"). Estas personas **no necesitan 10 preguntas**. Necesitan confirmación rápida + acceso.

Esta sesión implementa **CONVERT PATH:** un gateway acelerado de 90 segundos que detecta entrada de alta confianza y ofrece:
1. Opción rápida (3 preguntas esenciales)
2. Opción completa (10 preguntas estándar)
3. Resultado → Email → Acceso a Semana 1

### Tarea 1: Detección de estado de entrada

El gateway debe detectar si el visitante está en estado de "Alta Confianza" usando:

**UTM parameter:** `utm_source=linkedin` O `utm_campaign=convert` O `utm_medium=referral`

**Ejemplo URLs:**
- `https://lars.institutoepigenetico.com/?utm_source=linkedin`
- `https://lars.institutoepigenetico.com/?utm_campaign=convert`
- `https://lars.institutoepigenetico.com/?ref=...` (referido desde AMPLIFY — también alta confianza)

Si se detecta alguno de estos UTM:
1. Mostrar landing de CONVERT (no el gateway estándar)
2. Ofrecer opción "Rápido" (90s) vs "Completo" (12m)

**Lógica:**

```typescript
const convert_path = {
  utm_source: 'linkedin',
  utm_campaign: ['convert', 'program-lars'],
  utm_medium: 'referral',
  ref_hash: true, // AMPLIFY referral
};
```

Si alguno de estos parámetros está presente, entra en CONVERT PATH.

### Tarea 2: Landing de CONVERT (Before/After)

**Pantalla inicial cuando se detecta CONVERT PATH:**

```
¿CUÁNTO TIEMPO TIENES?

90 segundos para confirmar tu situación

[RÁPIDO — 3 preguntas]
vs.
[COMPLETO — 10 preguntas + mapa detallado]

(Sin presión. Ambos dan acceso al programa.)
```

**Estilo visual:**
- Igual fondo oscuro cálido (#0B0F0E)
- Tipografía Cormorant para el headline
- Dos botones claros, mismo tamaño, mismo peso visual
- Versión reducida del logo/marca arriba
- Animación: fade-in de los dos botones (staggered, 200ms delay)

**Mobile:** Botones uno encima del otro, full width.

### Tarea 3: Camino RÁPIDO (3 preguntas)

3 preguntas esenciales que permiten calcular el perfil sin perder precisión:

| # | Pregunta | Opciones | Usado para |
|---|----------|----------|-----------|
| 1 | "¿Cuántas horas duermes en promedio?" | < 5h / 5-6h / 6-7h / > 7h | Sleep score + diagnosticar FI/PC |
| 2 | "¿Cuán focado estás durante el trabajo?" | No puedo concentrarme / Interrupciones constantes / Bueno pero cansado / Excelente | Attention + perfil PC/CP |
| 3 | "¿Cómo es tu estado emocional?" | Muy ansioso / Ansioso / Normal / Muy calmado | Emotional baseline + perfil |

**Scoring:**

Estas 3 preguntas se mapean a un subset del scoring de las 10 (no es diferente, es un "resumen" inteligente). El algoritmo:

1. Calcular el perfil con las 3 preguntas
2. Estimar los 5 scores usando regresión simple (si duerme < 5h, Sleep score ~= 25, etc.)
3. Generar mapa con scores "interpolados" pero claros ("Esto es un diagnóstico rápido")

### Tarea 4: Interfaz de RÁPIDO

**Página 1/3:**

```
¿CUÁNTAS HORAS DUERMES?

[< 5 horas]
[5-6 horas]
[6-7 horas]
[> 7 horas]

[Siguiente →]
```

Estilo: Same as standard gateway (full-screen question, radio buttons, siguiente button).

**Página 2/3:**

```
¿CUÁN FOCADO ESTÁS EN EL TRABAJO?

[No puedo concentrarme]
[Interrupciones constantes]
[Bueno pero muy cansado]
[Excelente concentración]

[Siguiente →]
```

**Página 3/3:**

```
¿CÓMO ES TU ESTADO EMOCIONAL?

[Muy ansioso/a]
[Ansioso/a]
[Neutral/normal]
[Muy calmado/a]

[Ver mi diagnóstico →]
```

**Confirmación RÁPIDO (en vez de mapa vivo):**

```
TU DIAGNÓSTICO RÁPIDO

Regulación Nerviosa:  28/100 (Comprometido)
Sueño:               22/100 (Crítico)
Digestión:           35/100 (Atención necesaria)
Atención:            41/100 (Atención necesaria)
Energía:             32/100 (Comprometido)

Perfil detectado: Productivo Colapsado

---

"Este es un diagnóstico rápido, calibrado con 3 preguntas.
Si necesitas un análisis más profundo, puedes completar
el diagnóstico completo después."

[Acceder al programa — 97€ →]
```

Si elige COMPLETO en la pantalla inicial, se redirige al gateway estándar (10 preguntas, camino normal).

### Tarea 5: Email post-CONVERT

**Email enviado después de completar CONVERT (rápido o completo):**

```
Bienvenido a LARS.

Tu diagnóstico está listo.
Aquí empieza tu Semana 1.

[Acceder al programa →]

---

Qué esperar en los próximos 7 días:
- Lunes: Email con tu primer protocolo
- Miércoles: Check-in privado de regulación
- Viernes: Invite a una sesión de grupo (opcional)

Tu acompañante en esto es [Javier / equipo].
```

**CTA principal:** Un botón verde que lleva DIRECTAMENTE a pago/confirmación (no mapa, sino directamente a checkout o a onboarding Semana 1).

### Tarea 6: Integración en el flujo

**Si elige RÁPIDO:**
```
P1 (Elección Rápido/Completo)
→ P1/3 (Sueño)
→ P2/3 (Atención)
→ P3/3 (Emocional)
→ Diagnóstico rápido + confirmación
→ Email
→ [Acceder al programa]
→ Checkout / Semana 1
```

**Si elige COMPLETO:**
```
P1 (Elección Rápido/Completo)
→ P1-P10 (Gateway estándar normal)
→ Mapa vivo
→ Email
→ [Acceder al programa]
→ Checkout / Semana 1
```

**Si NO es CONVERT PATH (UTM no detectado):**
```
Gateway estándar (como siempre)
```

### Tarea 7: Analytics

Trackear en cada paso:
- `convert_path_detected` (boolean)
- `convert_choice` ('rápido' | 'completo' | null)
- `convert_completion_time` (segundos)
- `post_convert_conversion` (reached checkout: yes/no)

Esto permite medir: ¿Qué % de CONVERT PATH completa la compra? ¿Es más rápido el flujo?

## INTELIGENCIA DEL SISTEMA

### Pre-detección de perfil por UTM (OBLIGATORIO)
No esperar a las 3 preguntas para estimar el perfil. El UTM ya da pistas:

- `utm_source=linkedin` + `utm_campaign=burnout-ejecutivo` → Probablemente PC. Mostrar copy de eficiencia en la landing de CONVERT.
- `utm_source=linkedin` + `utm_campaign=agotamiento-directivo` → Probablemente CP. Mostrar copy de estructura.
- `?ref=` (AMPLIFY referral) → El perfil del invitador da pistas sobre el invitado (parejas suelen compartir perfil). Usar perfil del invitador como hipótesis inicial.

Esta pre-detección NO reemplaza el scoring — solo calibra el tono de la pantalla inicial.

### Preguntas adaptativas por pre-perfil (OBLIGATORIO)
Las 3 preguntas del camino rápido NO son iguales para todos. Si hay pre-detección:

**Si pre-detecta PC:** P1=Sueño, P2="¿Cuántas horas productivas pierdes al día?", P3=Energía
**Si pre-detecta FI:** P1=Sueño, P2="¿Tienes síntomas físicos que no puedes explicar?", P3="¿Cuánto confías en datos vs intuición?"
**Si pre-detecta CE:** P1=Sueño, P2="¿Cuántas personas dependen de ti?", P3="¿Cuándo fue la última vez que hiciste algo solo para ti?"
**Si pre-detecta CP:** P1=Sueño, P2="¿Tienes un plan para manejar tu estrés?", P3="¿Qué necesitas para dar el primer paso?"

Si NO hay pre-detección, usar las 3 preguntas genéricas originales.

### Validación de calidad del diagnóstico rápido (OBLIGATORIO)
El sistema DEBE aprender si el diagnóstico rápido es preciso:

1. **Tracking obligatorio:** Guardar `diagnostico_tipo` = 'rapido' | 'completo' en tabla `diagnosticos`
2. **Validación posterior:** Si alguien hace el rápido y luego vuelve para hacer el completo, comparar ambos scores. Guardar `accuracy_score` (0-100).
3. **Dashboard en admin:** "Precisión del diagnóstico rápido: 78% (basado en 34 comparaciones)". Si baja de 70%, alerta: "El diagnóstico rápido está perdiendo precisión. Considerar ajustar las preguntas."
4. **Invitación a completar:** 7 días después del diagnóstico rápido, enviar email: "Tu diagnóstico rápido te dio una foto inicial. ¿Quieres el análisis completo? Son 10 minutos y tu mapa se actualiza con datos más precisos. [Completar diagnóstico →]"

### Conexión con el resto del sistema (OBLIGATORIO)

**CONVERT → EMAILS:** El email post-CONVERT incluye el `diagnostico_tipo`. Si fue rápido, el email de día 3 ofrece completar el diagnóstico completo.

**CONVERT → CO-LEARNING:** Si la tasa de conversión del camino rápido es >30% más alta que el completo, el sistema sugiere a Javier: "El camino rápido convierte mejor. Considerar ofrecerlo a más segmentos."

**CONVERT → IGNICIÓN:** Los UTM que activan CONVERT se rastrean en la tabla de distribución. Javier puede ver: "LinkedIn genera 45% de leads CONVERT. Invertir más ahí."

**CONVERT → RE-ENGAGEMENT:** Si alguien empieza el camino rápido pero abandona en P2/3, activar re-engagement en 48h: "Tu diagnóstico está al 66%. Solo falta 1 pregunta: [Completar →]"

### Medición de impacto (OBLIGATORIO)
En admin, sección CONVERT:
- "Leads CONVERT vs Standard: tasa de conversión, LTV a 30 días, retención Semana 4"
- "Diagnósticos rápidos: X completados, Y% convirtieron, Z% completaron el diagnóstico completo después"
- "Tiempo medio: Rápido = 87s, Completo = 11m 23s"

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin avisarme antes.
- El scoring rápido usa regresión simple — no es 100% preciso, pero es "bueno suficiente" para alta confianza.
- Los UTM parámetros se leen desde `window.location.search` (ya lo hace el gateway).
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- Los UTM parámetros se validan (whitelist de valores conocidos).
- No exponer lógica de scoring en frontend (OK aquí es estimado, pero no revelar el algoritmo exacto).

### 3. Calidad del código
- Cero console.log de debug.
- El scoring rápido es una función helper reutilizable.
- Archivos < 300 líneas.

### 4. Testing funcional
- Cargar el gateway con `?utm_source=linkedin`: ve landing de CONVERT
- Elegir RÁPIDO: 3 preguntas, resultado rápido
- Elegir COMPLETO: gateway estándar
- Sin UTM: gateway normal (no CONVERT)
- Mobile 375px: landing, preguntas, resultado — todo responsivo

### 5. Accesibilidad
- Landing y preguntas accesibles.
- Radio buttons con focus visible.

### 6. Performance
- La detección de UTM es instant (no requiere API).
- El scoring rápido es instant (cálculo en memoria).

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Landing de CONVERT usa tokens de DESIGN.md (colores, tipografía, spacing).
**7b. Claridad:** La opción de RÁPIDO vs COMPLETO es clara. No hay ambigüedad.
**7c. Velocidad:** El camino RÁPIDO se siente rápido (3 preguntas, transiciones suaves, resultado inmediato).
**7d. Confianza:** El diagnóstico rápido incluye disclaimer ("diagnóstico rápido, calibrado con 3 preguntas") pero sin sonar débil.
**7e. Feedback:** Cada pregunta tiene respuesta clara. Avance visual (P1/3, P2/3, P3/3).
**7f. Copy:** "Rápido" y "Completo" (no "Express" ni "Premium").

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **CONVERT-PATH — Sesión 1: Gateway acelerado** ({fecha}):
     - Detección de UTM (linkedin/convert/referral), landing Rápido/Completo, 3-pregunta path, scoring interpolado, analytics
   ```
2. Commit final limpio.
