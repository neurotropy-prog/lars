## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión EMAILS-PERFIL: Personalización de la secuencia de nurturing (8 emails) + evoluciones del mapa según perfil detectado

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente (Productivo Colapsado, Fuerte Invisible, Cuidador Exhausto, Controlador Paralizado)
- `docs/DESIGN.md` — Sistema de diseño visual
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Perfiles completos, lenguaje calibrado para cada uno, cálculo de perfil en gateway
- `docs/DATABASE.md` — Schema actual, campos `diagnosticos.profile` y `meta`

## Lo que ya está construido
- Gateway con 10 preguntas y scoring automático
- Cálculo de perfil basado en respuestas (Productive Collapsed, Invisible Strong, Exhausted Caregiver, Paralyzed Controller)
- Mapa vivo con evoluciones de día 0→90 (estáticas, no personalizadas)
- 8 emails en secuencia de nurturing sin personalización
- Tabla `diagnosticos` con campo `profile` (ya contiene el perfil detectado)

## Tu tarea

Lee `docs/features/FEATURE_GATEWAY_DESIGN.md` completo (especialmente la sección de perfiles) y `docs/VISION.md`.

Esta sesión personaliza TODO el email journey según el perfil detectado. No se trata de A/B testing — cada perfil ve una secuencia diferente de 8 emails (mismo timing, copy adaptado). Además, el mapa vivo evolucionará mostrando insights específicos del perfil.

### Tarea 1: Estructura de emails personalizados por perfil

Los 8 emails en timeline día 0→90 son:

| Día | Nombre | Actual | Nueva estructura |
|-----|--------|--------|---|
| 0 | Welcome + Mapa | Genérico | Personalizado: tono + CTA según perfil |
| 2 | Reafirmación | Genérico | Perfil-específico: qué validar |
| 7 | Progreso | Genérico | Visualización según perfil (datos/normalización/garantías/eficiencia) |
| 14 | Micro-hábito | Genérico | Hábito recomendado según dimensión más comprometida + perfil |
| 30 | Check-in profundo | Genérico | Preguntas de reflexión según perfil |
| 45 | Impulso final | Genérico | Urgencia calibrada (PC=eficiencia, CP=estructura, CE=culpa/normalización, FI=datos) |
| 60 | Recuperación | Genérico | Oferta de recuperación/aseguranza según perfil |
| 90 | Cierre + opciones | Genérico | Opciones de continuidad según progreso + perfil |

**Estructura técnica:**

Cada email existe en 4 variantes:
- `emails/templates/nurture-{step}-{profile}.html`

Ejemplo:
- `nurture-day-0-productive-collapsed.html`
- `nurture-day-0-invisible-strong.html`
- `nurture-day-0-exhausted-caregiver.html`
- `nurture-day-0-paralyzed-controller.html`

Las variantes comparten estructura (headers, footers, tracking), solo cambia el copy del cuerpo.

### Tarea 2: Contenido de cada email por perfil

**DÍA 0 — WELCOME + MAPA**

Genérico actual (referencia):
```
Tu diagnóstico está listo.

Tu mapa de regulación en 5 dimensiones.
[Ver mapa →]

Empieza el programa en 24h. Te mandaremos más info.
```

**Productivo Colapsado (PC):**
```
Tu mapa está listo.

Has rendido bien durante años. Ahora tu sistema nervioso te pide pausa.
[Ver cómo te vemos →]

En 24h: la ruta de recuperación de 12 semanas.
```

**Fuerte Invisible (FI):**
```
Tus datos están listos.

Un análisis objetivamente calibrado de 5 dimensiones de tu regulación.
[Ver los números →]

En 24h: el protocolo específico para tu situación.
```

**Cuidador Exhausto (CE):**
```
Tu mapa está listo.

Es normal estar donde estás. Miles de personas que cuidan están aquí.
[Mira tu mapa →]

En 24h: la ruta diseñada para alguien como tú.
```

**Controlador Paralizado (CP):**
```
Tus métricas están listas.

Un análisis detallado de 5 dimensiones con recomendaciones estructuradas.
[Revisar análisis →]

En 24h: el plan paso a paso para recuperarte.
```

---

**DÍA 2 — REAFIRMACIÓN**

La función de este email es validar al usuario en su situación. Cambia completamente según perfil:

**PC:**
```
Esto que estás viendo es real.

No es depresión ni burnout clínico (esos son otros cuadros).
Lo tuyo es: un sistema nervioso al máximo de su capacidad.
La buena noticia: es reversible. La Semana 1 te lo mostrará.

[Sigue tu mapa →]
```

**FI:**
```
Los datos son claros.

Tu regulación está en zona de atención necesaria.
La mayoría de personas que hicieron este test hace 3 meses
estaban exactamente donde estás tú ahora.

[Mira tu evolución hasta hoy →]
```

**CE:**
```
Lo que te pasa tiene un patrón.

Cuando llevas años priorizando a otros, tu sistema se desregula.
Esto que ves no es debilidad. Es biología.
Recuperarte no es egoísta. Es necesario.

[Tu mapa →]
```

**CP:**
```
El análisis es robusto.

Basado en 10 preguntas calibradas que detectan desregulación en 5 dimensiones.
3 de cada 4 personas como tú se recuperan en 12 semanas
cuando tienen estructura.

[Lee el protocolo →]
```

---

**DÍA 7 — PROGRESO**

Visualización de la evolución de día 0→7. Cambia según cómo se vea el mapa evolucionando (si hubo mejora, si se mantuvo, si empeoró — usa los datos dinámicos del mapa).

**PC:**
```
Una semana adentro.

Tu mapa está evolucionando:
- Regulación Nerviosa: ↑ mejorando
- Sueño: → manteniéndose
- [...]

Semana 1 sigue: hoy toca [micro-hábito específico].
[Ver tu evolución →]
```

**FI:**
```
Datos de la Semana 1.

Métrica comparada: "Tú hace 7 días" vs "Tú hoy"
- Regulación: 28 → 31 (+3 pts)
- Energía: 22 → 25 (+3 pts)
- [...]

El protocolo está activando cambios medibles.
[Mira tu dashboard →]
```

**CE:**
```
Una semana adentro.

¿Sentiste algo diferente? (No pasa nada si no. Es solo día 7.)
Tu mapa lo refleja. Estás aquí para quedarte, no para hacer todo perfecto.

Lo que empieza hoy en Semana 2: la parte más transformadora.
[Continúa →]
```

**CP:**
```
Checkpoint de Semana 1.

Métricas registradas:
- Sesiones completadas: 7/7
- Regulación nerviosa: evoluciona ↑
- Próximo hito: mapa personalizado en Semana 2

Mantén la estructura. Es lo que genera cambio.
[Seguir protocolo →]
```

---

**DÍA 14, 30, 45, 60, 90** — Seguir el mismo patrón:

Cada perfil tiene UN lenguaje y UNA lógica de motivación:

- **PC:** Métrica de "tiempo ganado", "productividad recuperada", eficiencia, datos de progreso acelerado
- **FI:** Números exactos, comparativas, tendencias, porcentaje de mejora
- **CE:** Normalización, permiso para cuidarse, historias de otros en su situación, "no estás sola/o"
- **CP:** Estructura reforzada, mapa de ruta clara, hitos confirmados, garantías de metodología

### Tarea 3: Actualizar API de envío de emails

En `/api/emails/send-nurture`, detectar el perfil del diagnóstico y enviar la plantilla correspondiente:

```typescript
const template = `nurture-day-${day}-${profile}.html`;
```

No cambiar la lógica de scheduling — sigue siendo cron cada 24h. Solo cambia QUÉ template se carga.

### Tarea 4: Evoluciones del mapa personalizadas

El mapa actual muestra "Día 0 → Día 7 → Día 30 → Día 90" con evoluciones genéricas.

Cada perfil verá insights diferentes en las evoluciones:

**Zona de "Insight de progreso" (bajo el mapa):**

**PC:**
```
Semana 2: Regulación Nerviosa sube 8 pts.
Implicación: recuperas 3-4 horas de productividad focada por día.
```

**FI:**
```
Semana 2: Regulación Nerviosa: 28 → 36 (+28% mejora).
Percentil: pasas del 22% al 39% de la población regulada.
```

**CE:**
```
Semana 2: Tu Sueño y Digestión mejoran.
Lo que eso significa: tu cuerpo empieza a darte permiso.
```

**CP:**
```
Semana 2: 3 de 5 dimensiones en progreso.
Plan de Semana 3: fortalecer Atención y Energía.
[Ver plan detallado →]
```

Estos insights se generan dinámicamente basándose en:
1. El perfil detectado en `diagnosticos.profile`
2. La evolución real del mapa de día 0 a día 7 (cambios en los 5 scores)
3. Un template de insight por perfil + cambio

### Tarea 5: Backend — Tabla de templates de email

Crear o extender tabla `email_templates` (o `nurture_templates`):

```
id | step | profile | html_content | created_at | updated_at
```

Donde:
- `step` = 'day-0', 'day-2', 'day-7', ... (8 pasos)
- `profile` = 'productive-collapsed' | 'invisible-strong' | 'exhausted-caregiver' | 'paralyzed-controller'
- `html_content` = plantilla HTML completa

API GET `/api/admin/email-templates` y PUT `/api/admin/email-templates/{id}` para que Javier pueda editar estos emails en el admin si necesita.

## INTELIGENCIA DEL SISTEMA

### A/B testing de variantes por perfil (OBLIGATORIO)
No asumir que el copy actual es óptimo. Implementar testing:
- Cada email tiene 2 variantes de subject line por perfil (8 emails × 4 perfiles × 2 variantes = 64 combinaciones)
- Asignación random 50/50 por perfil
- Medir: open rate, click rate, conversión (visitó mapa / compró)
- Dashboard en admin: "Email día 3 (PC): Subject A 45% open, Subject B 52% open"
- Cuando hay ganador claro (>100 envíos, p<0.05), el sistema sugiere en CO-LEARNING: "Subject B gana para PC en email día 3. ¿Activar?"

### Optimización de hora de envío (OBLIGATORIO)
Cada perfil tiene un momento óptimo para recibir emails:
- **Inicio:** PC=7:00, FI=8:00, CE=12:00, CP=9:00
- **Aprendizaje:** Después de 3 emails, analizar hora de apertura promedio por usuario
- Si María (CE) abre siempre a las 22:00, adaptar su envío a 21:30
- Dashboard: "Hora óptima de envío por perfil: PC 7:15 (67% open), FI 8:30 (61%), CE 21:45 (72%), CP 9:00 (64%)"

### Contenido dinámico por evolución del mapa (OBLIGATORIO)
Los emails NO solo cambian por perfil. Cambian por lo que PASÓ en el mapa:
- Si D1 (Regulación) subió >5 pts: celebrar específicamente D1
- Si D2 (Sueño) no mejoró: reforzar protocolo de sueño
- Si el score global bajó: tono de normalización ("Las fluctuaciones son normales. El 73% experimenta esto en Semana 2.")
- Si no ha visitado el mapa en >7 días: CTA más fuerte ("Tu mapa se ha actualizado. Los datos te esperan.")

### Conexión con RE-ENGAGEMENT
Si un email se envía y NO se abre en 48h:
- Marcar en heat score como señal negativa (-1 pt engagement)
- Si 3 emails seguidos sin abrir → activar cron de RE-ENGAGEMENT
- Si el usuario tiene WhatsApp opt-in → enviar por WhatsApp en vez de email el siguiente mensaje

### Conexión con CO-LEARNING
El sistema genera insights para Javier:
- "Los emails de día 3 tienen 65% open rate para CE pero solo 34% para FI. Los FI no responden a emails tempranos."
- "Sugerencia: para FI, reemplazar email de día 3 con link a datos crudos (menos narrativa, más números)."
- Javier puede aprobar cambios de contenido desde el panel de CO-LEARNING

### Atribución de conversión (OBLIGATORIO)
Cada email rastreado con UTM único:
- `utm_source=email&utm_campaign=nurture-day-{N}&utm_content=profile-{perfil}`
- Si alguien compra después de abrir email día 7 → "Conversión atribuida a email día 7 (PC)"
- Dashboard: "Emails que más convierten: día 7 (PC) 12%, día 14 (CE) 9%, día 3 (CP) 8%"

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit` para verificar tipos.
- NO modifiques la base de datos sin avisarme antes y mostrarme el SQL.
- El perfil viene de `diagnosticos.profile` — ese campo ya existe y ya está poblado.
- No inventar perfiles nuevos. Solo estos 4.
- TODO el copy viene de FEATURE_GATEWAY_DESIGN.md o es nuevo pero calibrado con ese tono.
- Los emails siguen siendo 8, en los mismos días. Solo cambia el contenido.
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- Cero hardcodeados en HTML de emails.
- Los profiles están en enum (solo 4 valores válidos).
- Fallback a genérico si el perfil no existe (safety netting).

### 3. Calidad del código
- Cero console.log de debug.
- Las plantillas reutilizan headers/footers (no duplicación).
- Archivos < 300 líneas.

### 4. Testing funcional
- Simular envío para cada perfil con datos ficticios.
- Verificar que el email correcto se envía al día correcto para cada perfil.
- Probar fallback si perfil es nulo o inválido.
- Los insights del mapa aparecen dinámicamente según perfil.

### 5. Accesibilidad
- Emails respetan contrast ratio en todos los perfiles visuales.
- CTA buttons accesibles.

### 6. Performance
- No queries N+1 al buscar templates.
- Cache de templates si es necesario.

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Todos los emails comparten estructura visual (header, footer, paleta).
**7b. Tono:** Cada perfil tiene su voz única en FEATURE_GATEWAY_DESIGN.md — los emails la mantienen.
**7c. Claridad:** Un CTA primario por email. Call-to-action diferenciado según perfil.
**7d. Feedback:** El evolución del mapa en email es clara: qué cambió, por qué importa.
**7e. Respira:** Emails no son densos. Espacios generosos. Una idea por sección.
**7f. Mobile:** Emails responsivos (ya están, solo verifica).

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/DATABASE.md` si se crea tabla nueva de templates.
2. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **EMAILS-PERFIL — Sesión 1: Personalización por perfil** ({fecha}):
     - 8 emails personalizados para 4 perfiles, insights de evolución del mapa dinámicos, API de templates para admin
   ```
3. Commit final limpio con mensaje descriptivo.
