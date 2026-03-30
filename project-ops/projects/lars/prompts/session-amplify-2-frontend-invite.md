## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión AMPLIFY-2: Frontend — Invitación + Compartir + Aceptación

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Visión del producto
- `docs/DESIGN.md` — Sistema de diseño visual. NADA se inventa fuera de este doc.
- `docs/ANIMATIONS.md` — Spec de animaciones (usar patrones existentes para consistencia)
- `docs/features/FEATURE_AMPLIFY_DESIGN.md` — **SPEC COMPLETA de esta feature** (LEER ENTERO)
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Los 4 perfiles de cliente y su lenguaje

## Lo que ya está construido
- Todo lo anterior (gateway, mapa, admin, emails, booking, analytics)
- **Sesión anterior (AMPLIFY-1):** Tabla `amplify_invites`, 5 API routes, lógica de insight, detección de `?ref=` en gateway

## Tu tarea

Lee `docs/features/FEATURE_AMPLIFY_DESIGN.md` completo. Esta sesión construye la experiencia del usuario: la invitación desde el mapa, las opciones de compartir, y la pantalla de aceptación/rechazo para el invitado.

Implementa en dos fases:
**FASE VISUAL:** Construye todas las pantallas con datos ficticios. Avísame cuando esté listo para revisar.
**FASE FUNCIONAL:** Solo después de mi aprobación visual, conecta la funcionalidad real.

### Tarea 1: Sección AMPLIFY en el mapa vivo

En la página del mapa (`/mapa/[hash]`), añadir una sección nueva que aparece **después de las dimensiones y ANTES del CTA de Semana 1**.

**Condición de visibilidad:** Solo aparece si:
- El mapa tiene ≥ 1 visita previa (no se muestra en la primera visita)
- Han pasado ≥ 7 días desde la creación del diagnóstico
- La persona no tiene ya 5 invitaciones activas

**Diseño (está en la spec, sección "CUÁNDO SE ACTIVA AMPLIFY"):**
```
COMPARA TU MAPA

¿Conoces a alguien en tu misma situación —
tu pareja, un socio, un amigo?

Si ambos hacéis el diagnóstico, vuestros mapas
se pueden comparar. Las brechas compartidas son
las más reveladoras.

[Invitar a comparar]

"Su diagnóstico es confidencial. Solo se compara si ambos aceptáis."
```

**Estilo visual:**
- Misma estética que el resto del mapa (fondo oscuro, tipografía Cormorant/Inter)
- Separador sutil arriba y abajo
- El botón "Invitar a comparar" es estilo ghost (como los secundarios del mapa)
- Animación: fade-in-up al entrar en viewport (IntersectionObserver, como A-15)
- En 375px: todo el ancho, padding consistente con el mapa

### Tarea 2: Modal/Pantalla de invitación

Al hacer click en "Invitar a comparar", se abre un modal (o pantalla de transición) con:

**Paso 1 — Relación (opcional):**
```
¿Cuál es vuestra relación?
(Esto nos ayuda a personalizar la comparación)

[Mi pareja]  [Mi socio/a]  [Un amigo/a]  [Otro]

[Saltar →]
```
Esto se guarda como `relationship_hint` en la invitación.

**Paso 2 — Compartir:**
```
Comparte este link. Cuando complete su diagnóstico,
ambos podréis ver la comparación.

[Link copiable: lars.institutoepigenetico.com/?ref=xxxxx]
                                              [📋 Copiar]

[📱 Enviar por WhatsApp]
[✉️ Enviar por email]

"El link caduca en 30 días."
```

- **Copiar link:** Copia al portapapeles + feedback visual ("¡Copiado!")
- **WhatsApp:** Abre `https://wa.me/?text=...` con texto pre-escrito:
  "He hecho un diagnóstico de regulación nerviosa y me gustaría que lo hicieras tú también para poder comparar nuestros resultados. Son 3 minutos: [link]"
  (Sin emojis excesivos. Tono directo. Como lo enviaría un ejecutivo a otro.)
- **Email:** Abre `mailto:?subject=...&body=...` con:
  Subject: "Diagnóstico de regulación — ¿comparamos?"
  Body: mismo texto que WhatsApp

**Feedback post-compartir:**
```
Invitación lista ✓

Cuando [nombre/pronombre] complete su diagnóstico,
ambos recibiréis un email para ver la comparación.

[Volver a mi mapa]
```

### Tarea 3: Pantalla de aceptación para el invitado

Cuando una persona completa el gateway y viene por AMPLIFY (`?ref=` detectado), DESPUÉS de ver su propio mapa por primera vez (no interrumpir la revelación del mapa), aparece un banner o sección:

```
Alguien te ha invitado a comparar vuestros mapas.

Si aceptas, ambos podréis ver cómo se comparan
vuestras 5 dimensiones. Tu mapa sigue siendo privado —
solo se comparan los scores.

[Aceptar comparación]    [No, gracias]
```

**Si acepta:**
- Llamar a POST `/api/amplify/accept`
- Mostrar confirmación: "Comparación activada. La puedes ver ahora."
- Botón: [Ver comparación →] (lleva a `/mapa/[hash]/comparar/[compare_hash]`)
- El invitador recibe email automático (ya implementado en AMPLIFY-1)

**Si rechaza:**
- Llamar a POST `/api/amplify/decline`
- El banner desaparece con fade-out
- No se muestra nunca más para esta invitación
- Su mapa sigue funcionando igual (sin limitaciones)

### Tarea 4: Email AMPLIFY en la secuencia de evolución

Añadir un bloque al email de **día 7** (o día 14 si día 7 ya es muy denso):

```html
<tr>
  <td style="padding: 24px 0; border-top: 1px solid rgba(255,255,255,0.08);">
    <p style="...secondary...">
      ¿Conoces a alguien que podría necesitar ver su mapa?
      Si ambos hacéis el diagnóstico, podréis comparar
      vuestras dimensiones.
    </p>
    <a href="{invite_url}" style="...ghost button...">
      Invitar a alguien a comparar →
    </a>
  </td>
</tr>
```

El `{invite_url}` debe llevar al mapa de la persona (donde está la sección AMPLIFY), NO generar la invitación directamente desde el email.

## INTELIGENCIA DEL SISTEMA

### Copy de compartir calibrado por perfil (OBLIGATORIO)
El texto pre-escrito para WhatsApp y email NO es genérico. Cambia según el perfil del INVITADOR:

**PC (Productivo Colapsado):**
WhatsApp: "He hecho un análisis de regulación nerviosa. Son 3 minutos y te da datos reales sobre sueño, energía y productividad. ¿Lo hacemos los dos y comparamos? [link]"
Email Subject: "Diagnóstico de productividad — ¿comparamos datos?"

**FI (Fuerte Invisible):**
WhatsApp: "He encontrado un análisis de regulación nerviosa basado en datos. Sin narrativa, solo números. Si lo haces tú también podemos comparar métricas. 3 minutos: [link]"
Email Subject: "Análisis de regulación — datos comparativos"

**CE (Cuidador Exhausto):**
WhatsApp: "He descubierto algo sobre regulación nerviosa que me ha ayudado. Si tú también lo haces, podemos ver cómo estamos los dos. Es confidencial y son 3 minutos: [link]"
Email Subject: "Algo que nos puede ayudar a los dos"

**CP (Controlador Paralizado):**
WhatsApp: "He hecho un diagnóstico estructurado de 5 dimensiones de regulación nerviosa. Si lo haces tú, comparamos resultados con un plan de seguimiento. 3 minutos: [link]"
Email Subject: "Plan de regulación comparativa — ¿te apuntas?"

### Timing inteligente de la sección AMPLIFY
La sección AMPLIFY no solo aparece por días/visitas. También considera:
- **Momento emocional:** Si la persona acaba de ver una mejora en su mapa (scores subieron), es el mejor momento → mostrar AMPLIFY con más prominencia (borde verde sutil)
- **Hora del día:** Si es entre 19:00-22:00 (hora de estar con pareja/familia), priorizar "Mi pareja" como primera opción de relación
- **Post-comparación:** Si ya tiene una comparación activa y fue positiva, mostrar: "¿Conoces a alguien más?" con urgencia reducida

### Seguimiento si no se completa (OBLIGATORIO)
Si el invitador comparte un link pero el invitado no completa en 5 días:
- Mostrar en el mapa del invitador: "Tu invitación a [Iniciales] sigue pendiente. [Reenviar →]"
- El botón "Reenviar" genera un nuevo texto calibrado: "Solo quería recordarte — el análisis son 3 minutos y podemos comparar resultados: [link]"
- Después de 14 días sin completar: la notificación se reduce a texto sutil (no molestar)
- Este evento alimenta RE-ENGAGEMENT: si el invitado tiene un diagnóstico previo (ya pasó por el gateway pero no compró), el sistema lo marca como "lead tibio reactivable por AMPLIFY"

### Conexión con admin (CO-LEARNING)
Cuando un invitador comparte exitosamente, el sistema genera una sugerencia en CO-LEARNING:
- "María R. (PC) acaba de invitar a comparar. Si el invitado completa, considerar email de refuerzo a María celebrando la comparación."
- Javier puede aprobar/modificar/rechazar esta sugerencia

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit` para verificar tipos.
- NO modifiques la base de datos sin avisarme antes.
- TODO el diseño viene de docs/DESIGN.md. No inventes colores, tipografías ni spacing.
- Las animaciones siguen los patrones de docs/ANIMATIONS.md (mismos easings, duraciones).
- Mobile-first: todo se diseña primero para 375px.
- Recuerda: no soy desarrollador. Explícame todo en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- Cero secrets hardcodeados.
- No exponer datos del invitador al invitado (solo iniciales como máximo).
- La invitación no revela quién es el invitador hasta que ambos aceptan.

### 3. Calidad del código
- Cero console.log de debug.
- Componentes reutilizables donde aplique.
- Archivos < 300 líneas.

### 4. Testing funcional
- Flujo de invitación completo: click → modal → compartir → copiar/whatsapp/email.
- Banner de aceptación: aparece solo si viene por ?ref=, solo después de ver el mapa.
- Rechazar: el banner desaparece y no vuelve a aparecer.
- Sección en mapa: visible solo si ≥7 días y ≥1 visita previa.
- Mobile 375px: todo funciona sin overflow ni scroll horizontal.

### 5. Accesibilidad
- Botones accesibles con teclado.
- Modal se cierra con Escape.
- Focus trap dentro del modal.

### 6. Performance
- No cargas innecesarias al abrir el mapa (la sección AMPLIFY es lazy).

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Todo usa tokens de DESIGN.md. Cero valores hardcodeados.
**7b. 5 estados:** Modal tiene loading al generar link, error si falla, vacío si no hay invitaciones.
**7c. Feedback:** Copiar link → feedback visual inmediato. Cada botón tiene hover/active/disabled.
**7d. Una acción:** La sección AMPLIFY tiene UN CTA claro. El banner de aceptación tiene DOS opciones de igual peso (es la excepción: requiere decisión informada).
**7e. Respira:** Spacing generoso. La sección AMPLIFY no compite con las dimensiones del mapa.
**7f. Copy:** "Invitar a comparar" (no "Compartir"). "Aceptar comparación" (no "Sí"). Todo intencional.
**7g. WOW:** El texto pre-escrito para WhatsApp/email se siente como si lo hubiera escrito la persona, no un robot.

## Actualización de progreso
Después de completar:
1. Actualiza `docs/PROGRESS.md`:
   ```
   - ✅ **AMPLIFY — Sesión 2: Frontend Invitación** ({fecha}):
     - Sección AMPLIFY en mapa, modal de invitación con compartir, banner de aceptación para invitados, bloque en email día 7
   ```
2. Commit final limpio.
