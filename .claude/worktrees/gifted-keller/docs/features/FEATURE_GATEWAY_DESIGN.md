# GATEWAY L.A.R.S.© — DISEÑO COMPLETO

**8 mecánicas en cascada · Scoring con 5 dimensiones · Construible inmediatamente**

---

## ANTES DE LEER: EL RITMO

El gateway es una conversación, no un formulario. Tiene ritmo musical:

```
PREGUNTA rápida    ← inhalar
PREGUNTA rápida    ← inhalar
PRIMERA VERDAD     ← exhalar profundo (el sistema habla por primera vez)
PREGUNTA           ← inhalar
PREGUNTA           ← inhalar
MICRO-ESPEJO 1     ← exhalar (el sistema conecta puntos)
PREGUNTA           ← inhalar
PREGUNTA           ← inhalar
MICRO-ESPEJO 2     ← exhalar (el sistema revela el patrón)
BISAGRA            ← contener la respiración (máxima tensión)
EMAIL              ← la llave (Zeigarnik al máximo — necesita ver su mapa)
RESULTADO          ← expandir (revelación completa en URL única)
CTA                ← soltar (alivio)
```

Tiempo total: 3-5 minutos. 10 preguntas. 2 micro-espejos. 1 bisagra. 1 resultado. 1 CTA.

**Cambio de arquitectura:** El resultado NO se muestra en la misma sesión. La bisagra genera la tensión máxima, el email es la llave para acceder al mapa, y el resultado vive en una URL única y personal que evoluciona en el tiempo. Esa URL es el activo central del sistema de nurturing.

---

## PRINCIPIOS DE EXPERIENCIA

### Estado guardado (si abandona a mitad)

El gateway guarda estado en localStorage automáticamente tras cada respuesta. Si la persona cierra y vuelve:

**Lo que ve:**
Fondo oscuro. Centrado. Cálido.

**Texto (Cormorant Garamond, h3):**
> Continúas donde lo dejaste

**Subtexto (Inter, body-sm, secondary):**
> Llevas un 45% completado. Tu tiempo importa — nada se pierde.

**Botón primario:** "Continuar mi diagnóstico"
**Link sutil debajo (caption, tertiary):** "Empezar de nuevo"

Un ejecutivo al que le interrumpen en una reunión y vuelve 2 horas después NO empieza de cero. Eso es Four Seasons: su tiempo se respeta absolutamente.

### Adaptación por estado de entrada

No todos llegan igual. La Pregunta 1 + la señal de origen detectan el estado y adaptan el recorrido:

```
UNAWARENESS (P1=E "curiosidad" o sin señal de origen):
  Recorrido completo. Todas las mecánicas. 3-5 minutos.

AWARENESS (P1=A,B,C — la mayoría):
  Recorrido estándar. Todas las mecánicas. 3-5 minutos.

CLARITY (P1=D "alguien me sugirió" o UTM de contenido avanzado):
  Salta micro-espejo 1. Va directo de P2 a P3-P6 + bisagra.
  2-3 minutos.

CONFIDENCE (UTM de sesión valoración o contenido de Javier):
  CONVERT: P1 + P2 + P7 (sliders) → bisagra rápida → email → 
  resultado. 90 segundos.

READINESS (UTM de "empezar semana 1" o link directo):
  Mínimo: P7 (sliders) → resultado rápido → CTA directo. 
  45 segundos. El gateway es formalidad — la persona ya decidió.
```

Antes de P1, el sistema evalúa UTM / referrer. Si detecta señal fuerte de Confidence o Readiness, ofrece:

**Texto (body-sm, secondary):**
> ¿Quieres el diagnóstico rápido (1 min) o el completo (3 min)?

**Dos botones:** "Rápido" → CONVERT | "Completo" → DEEPEN

Si no hay señal de origen, va directo a P1 sin esta pantalla.

### Los 4 patrones formalizados

**DEEPEN** — El recorrido completo. 10 preguntas, 2 micro-espejos, bisagra, resultado profundo. Es el diseño principal de este documento.

**CONVERT** — 90 segundos. P1 + P2 + P7 → bisagra comprimida (solo comparación, sin coste oculto) → email → resultado con 5 dimensiones. Para quien ya está en Confidence/Readiness. Menos señal pero más velocidad.

**RECOVER** — Es el mapa vivo. Cada evolución (día 3, 7, 14, 21, 30) es una mecánica de RECOVER reactivada con valor nuevo. Ya está diseñado en la sección POST-PUERTA.

**AMPLIFY** — Se activa en el mapa vivo (día 7-14): "¿Conoces a alguien en tu misma situación? Si ambos hacéis el diagnóstico, vuestros mapas se pueden comparar — las brechas compartidas son las más reveladoras." No es "invita a un amigo." Es valor egoísta: quiero ver cómo comparo con alguien que conozco. Abre la puerta a parejas, socios, equipos directivos.

### Feedback inmediato al seleccionar

Toda acción recibe respuesta del sistema en menos de 300ms:

**Selección única (P1, P2, P4, P5, P6, P8):**
1. Card seleccionada: borde `--color-accent`, fondo `--color-accent-subtle`, checkmark sutil en esquina. Transición 150ms.
2. Delay 600ms (la persona ve su selección confirmada).
3. Transición a siguiente pantalla (400ms slide horizontal).

**Selección múltiple (P3):**
1. Cada ítem marcado cambia color individualmente (150ms).
2. Botón "Continuar" aparece al marcar ≥1 ítem.
3. Si marca 4+, el botón pulsa sutilmente (attractor CSS, 2s cycle).

**Sliders (P7):**
1. Valor numérico al lado del slider, actualizado en tiempo real.
2. Si valor ≤3: número en `--color-error`. Si ≥7: `--color-success`. Si 4-6: `--color-warning`.
3. Micro-vibración háptica al mover (si el dispositivo lo soporta).

### Transiciones entre zonas emocionales

```
ZONA 1 — EXPLORACIÓN (preguntas)
  Fondo: --color-bg-primary
  Tipografía pregunta: Inter Tight, h3
  Opciones: cards con borde sutil
  Sensación: conversación ligera, espacio aireado

    ↓ transición 600ms ease + sutil scale 1.0→1.01→1.0

ZONA 2 — REFLEXIÓN (primera verdad, micro-espejos)
  Fondo: --color-bg-secondary
  Tipografía espejo: Cormorant Garamond, h3, italic
  Borde izquierdo verde
  Sensación: el sistema habla directamente, intimidad

    ↓ transición 600ms ease

ZONA 1 — EXPLORACIÓN (vuelve a preguntas)
  La persona siente que "vuelve" a la conversación con 
  nueva información

    ↓ transición 600ms ease + scale

ZONA 2 — REFLEXIÓN (micro-espejo 2)

    ↓ transición 800ms ease (más lenta — tensión creciente)

ZONA 3 — REVELACIÓN (bisagra, email, resultado)
  Fondo: profundiza a tono aún más envolvente
  Tipografía: números en display (Cormorant Garamond)
  Animaciones de counter y barras dominan
  Sensación: descubrimiento, expansión
```

La transición entre zonas NO es solo cambio de fondo. Es cambio de tipografía, velocidad, densidad visual y peso emocional.

### Barra de progreso — Comportamiento no lineal

```
P1 (10%) → P2 (20%)     : saltos de 10% — momentum rápido
PRIMERA VERDAD           : barra NO se mueve — espacio de recepción
P3 (35%) → P4 (45%)     : saltos de ~10%
MICRO-ESPEJO 1           : barra NO se mueve
P5 (60%) → P6 (70%)     : saltos de 10%
MICRO-ESPEJO 2           : barra NO se mueve
P7 (82%) → P8 (90%)     : saltos más pequeños — tensión
BISAGRA                  : barra PAUSA en 90% — máxima tensión
EMAIL                    : barra en 95%
RESULTADO                : barra completa 100% — resolución
```

Las pausas en los espejos marcan visualmente que son un espacio diferente. La pausa en 90% antes de la bisagra amplifica la anticipación.

### Ilustraciones y animaciones

4 momentos con ilustración animada. Estilo: outline/stroke, monocromáticas (verde acento o blanco), minimalistas, CSS animations. Coherente con DESIGN.md.

**Pantalla 0 (entrada):** Ilustración abstracta de un sistema nervioso — líneas fluidas que conectan nodos, en `--color-accent` al 30% sobre fondo oscuro. Las líneas pulsan suavemente como un latido (CSS animation, 3s cycle). Transmite: orgánico, vivo, humano. No es diagrama médico — es arte que evoca biología. Posición: detrás del headline, como fondo sutil. No compite con el texto.

**Primera verdad (M1):** Durante "Analizando tus respuestas..." (1.5s), micro-animación de partículas (6-8 puntos verdes) que convergen hacia el centro. Cuando la verdad aparece, las partículas se disuelven en el borde verde del micro-espejo. CSS keyframes, no canvas.

**Bisagra (M4):** Los dos números (34 y 72) conectados por una línea horizontal con gradiente de `--color-error` (izquierda) a `--color-success` (derecha). La línea se dibuja de izquierda a derecha (stroke-dashoffset animation, 1200ms) mientras los counters suben. La persona VE la distancia.

**Resultado / Mapa — Iconos por dimensión:**
- D1 Regulación: onda SVG que pulsa (agitada si score bajo, calmada si alto)
- D2 Sueño: luna SVG que se llena según score (vacía = bajo, llena = alto)
- D3 Claridad: engranaje SVG que gira (atascado si bajo, fluido si alto)
- D4 Emocional: balanza SVG que se inclina según score
- D5 Alegría: llama SVG que brilla (parpadea débil si bajo, brilla firme si alto)

Tamaño: 24-32px. Posición: a la izquierda del nombre de dimensión en cada card. Dos estados (bueno/malo) seleccionados por score. Comunican estado ANTES de leer el número.

### Estados de error y edge cases

**Pérdida de conexión:**
Mensaje sutil en parte superior: "Sin conexión. Tus respuestas están guardadas — cuando vuelvas, continuamos." Fondo `--color-warning` al 8%. Desaparece al reconectar. Nunca bloquea la interfaz.

**Email inválido:**
Validación en tiempo real. Campo: borde `--color-error`, mensaje debajo: "Revisa tu email — lo necesitamos correcto para guardarte el mapa." El botón no se deshabilita — el campo comunica.

**Email repetido:**
"Ya tienes un mapa con este email." Dos opciones: "Actualizar con estas respuestas" / "Ver mi mapa existente." Reconocemos que ya vino. Four Seasons: no le hacemos repetir.

**URL del mapa no carga:**
Skeleton screens (5 cards grises pulsando). Si falla: "No hemos podido cargar tu mapa. Prueba en unos segundos." Botón: "Reintentar." Nunca página en blanco.

**Sliders sin mover (P7):**
Si intenta avanzar sin mover todos: "Mueve todos los indicadores para un diagnóstico preciso." Highlight sutil en los que faltan (`--color-warning` border pulse). Si insiste una segunda vez, puede avanzar — quizá tiene razón.

### Momento WOW documentado

**Dónde está:** La primera vez que la persona accede a su URL del mapa.

**Qué espera:** Un número. Un score. Quizá una barra.

**Qué recibe:** Un dashboard personal que se despliega ante sus ojos. Las dimensiones aparecen UNA A UNA con animación secuencial. Cada barra se llena con color semáforo. Cada icono SVG se anima según su score. Los insights aparecen debajo de cada dimensión con fade-in. Es como que en Four Seasons te lleven a tu suite y abran las cortinas una a una para revelar la vista.

**Timing de la revelación:**
```
Segundo 0: Score global aparece (counter 0→34, 1200ms)
Segundo 1.5: Pausa. Solo el score global. La persona procesa.
Segundo 2: D1 aparece (fade-in 400ms + barra se llena 800ms)
Segundo 3: D2 aparece
Segundo 4: D3 aparece
Segundo 5: D4 aparece
Segundo 6: D5 aparece
Segundo 7: "Tu prioridad" se destaca en la dimensión más baja
Segundo 8: Primer paso recomendado aparece
```

8 segundos de revelación progresiva. La persona DESCUBRE su mapa — no lo VE de golpe. El delta entre expectativa ("un número") y realidad ("un dashboard de mí mismo que se despliega") es el WOW.

---

## PANTALLA 0 — HERO (la landing ES el gateway)

**Arquitectura:** No hay landing separada. La persona llega a la URL y la primera interacción ya está visible. El hero es el headline + P1 integrada. Como Keytrends, como ChatGPT — llegas y el input está ahí.

**Lo que ve:**

Fondo oscuro (`--color-bg-primary`). Detrás del headline, la ilustración del sistema nervioso pulsa suavemente — líneas fluidas que conectan nodos en `--color-accent` al 30%. Orgánico. Vivo.

**Headline (Cormorant Garamond, display):**
> Descubre en qué estado está tu sistema nervioso

**Subtítulo (Inter, body, secondary):**
> Un diagnóstico de 3 minutos calibrado con +25.000 evaluaciones reales.

**P1 visible en el hero (sin clic previo, sin botón intermedio):**

**Texto de pregunta (Inter Tight, h3):**
> ¿Qué te trajo hasta aquí?

**Opciones (cards seleccionables):**
A. **"Agotamiento que no se va"** — *Llevas tiempo sintiéndote agotado y nada de lo que haces lo resuelve*
B. **"Rendimiento en caída"** — *Tu capacidad ha bajado y no entiendes por qué*
C. **"El cuerpo habla"** — *Duermes mal, estás irritable, y tu cuerpo da señales que no puedes ignorar*
D. **"Alguien me lo sugirió"** — *Un médico, terapeuta o alguien de confianza te recomendó explorar esto*
E. **"Curiosidad"** — *Quieres saber cómo está tu sistema nervioso*

**Debajo de las opciones (caption, tertiary):**
> 10 preguntas · 3 minutos · Sin registro previo · Tu resultado es confidencial

La persona selecciona una opción → transición suave → P2. Ya está dentro. No hubo "Empezar mi diagnóstico." No hubo clic extra. La landing fue un paso. El paso fue una pregunta.

**Debajo del hero (scroll):** Contexto mínimo para quien necesite más:
- "Lo que sientes no es debilidad. Es el desgaste de una biología que ha llegado a su límite."
- "+25.000 sistemas nerviosos analizados · +20 años de práctica clínica"
- "142 personas completaron este diagnóstico esta semana"

El 70%+ no necesitará hacer scroll.

**Notas de diseño:**
- Mobile-first: 375px. Todo centrado.
- El headline nombra "sistema nervioso" — no "burnout." Un ejecutivo no busca "test de burnout." Busca entender qué le pasa. El sistema nervioso es neutral y científico.
- "Calibrado con +25.000 evaluaciones" — credibilidad inmediata para el Controlador. Normalización para el Fuerte (no eres el único).
- "Sin registro previo" — disuelve fricción para todos. Especialmente el Fuerte que no quiere dar datos.
- Cero mención de producto, programa, precio ni Instituto Epigenético. Huele a herramienta, no a venta.

---

## M1 — PRIMERA VERDAD (Preguntas 1-2 + revelación)

### Pregunta 1 — Ya en el hero (ver PANTALLA 0)

P1 vive en el hero. La persona no "entra al gateway" — responde la primera pregunta como parte natural de la experiencia de llegada. Al seleccionar una opción, la barra de progreso aparece (10%) y comienza P2.

### Pregunta 2 — Señal de sueño + sistema nervioso

**Barra de progreso:** 20%

**Texto de pregunta:**
> ¿Cómo son tus noches últimamente?

**Contexto bajo la pregunta (body-sm, secondary, italic):**
> Tu sueño es el indicador más fiable de cómo está tu sistema nervioso.

**Opciones:**

A. "Me cuesta dormirme — mi mente no se apaga"
B. "Me despierto a las 3-4 de la mañana y no puedo volver a dormirme"
C. "Duermo horas pero me despierto igual de cansado"
D. "Duermo poco pero funciono" 
E. "Mi sueño es razonablemente bueno"

**Señal que captura:**
- A → Insomnio de conciliación. Simpático activo. D1 comprometida. Controlador/Obsesivo.
- B → Despertar por cortisol nocturno. Lock bioquímico señal fuerte. D1+D2 comprometidas.
- C → Sueño no reparador. Falta de sueño profundo. D2 comprometida.
- D → Negación del Fuerte. Señal de vergüenza alta. D2 comprometida (aunque diga que no).
- E → D2 probablemente ok. Redirige peso a otras dimensiones.

**Nota sobre opción D:** "Duermo poco pero funciono" es la frase del Fuerte Invisible. El sistema la registra como señal de vergüenza alta + negación. El micro-espejo posterior aborda esto sin confrontar.

---

### PRIMERA VERDAD — Revelación post-preguntas 1-2

**Transición visual:**
- Las opciones hacen fade out (300ms)
- El fondo oscurece sutilmente (de `bg-primary` a `bg-secondary`, 600ms ease)
- Texto "Analizando tus respuestas..." aparece con typing effect (1.5 segundos de anticipación intencional)
- La primera verdad aparece con fade-in progresivo

**Lo que ve (ejemplo para quien respondió A+B — el caso más frecuente):**

**Componente micro-espejo:**
Borde izquierdo verde. Fondo `bg-secondary`.

**Texto principal (body, italic):**
> Tu mente no para y tu cuerpo se despierta en plena noche sin razón aparente. Pero hay una razón: tu sistema nervioso lleva tiempo atascado en modo alarma — y no sabe cómo volver.

**Dato colectivo (body-sm, secondary):**
> El 78% de los +25.000 sistemas nerviosos analizados con tu patrón de respuestas presentan niveles de la hormona del estrés crónicamente elevados. No es falta de voluntad — es bioquímica.

**Botón para continuar (ghost, sutil):**
> Seguir con mi diagnóstico

**Checkpoint 1 — AWARENESS:** La persona piensa "esto es más concreto de lo que esperaba. Me está leyendo. No es un test genérico." La primera verdad NOMBRA lo que siente (mente que no para + despertar nocturno) y le da la CAUSA (sistema nervioso en modo alarma). El dato de 25.000 valida que esto es conocido y medido. La vergüenza baja un grado: "no soy el único."

**Variantes de primera verdad según combinación de respuestas:**

| P1 | P2 | Primera verdad (resumen) |
|---|---|---|
| A (agotado) | B (3AM) | "Tu agotamiento no es cansancio normal. Tu cortisol se dispara de noche porque tu sistema no distingue descanso de amenaza." |
| B (rendimiento) | A (no duerme) | "Tu rendimiento bajó porque tu cerebro no descansa. Sin sueño profundo, el prefrontal no puede tomar decisiones." |
| C (cuerpo) | B (3AM) | "Tu cuerpo te está dando señales que tu mente ha intentado ignorar. El despertar nocturno es la más clara." |
| D (derivado) | cualquiera | "Alguien que te conoce vio algo que tú llevas tiempo normalizando. Tu sistema nervioso confirma que tenía razón." |
| E (curiosidad) | D (poco/funciono) | "Dices que funcionas con poco sueño. Tu sistema nervioso puede tener una versión diferente de esa historia." |

**Regla:** La primera verdad SIEMPRE contiene: (1) lo que la persona siente nombrado con sus palabras, (2) la causa biológica en lenguaje accesible, (3) dato colectivo que normaliza. Nunca genérica. Siempre calibrada con las 2 respuestas.

---

## M2 — GRADIENTE CRECIENTE (Preguntas 3-4)

Cada pregunta devuelve más de lo que pide. El contexto explica POR QUÉ se pregunta.

### Pregunta 3 — Claridad y rendimiento cognitivo (D3)

**Barra de progreso:** 35%

**Texto:**
> ¿Reconoces alguna de estas señales en tu día a día?

**Contexto (body-sm, secondary, italic):**
> Tu cerebro consume el 20% de tu energía total. Cuando el sistema nervioso está en alerta, desvía esos recursos a la supervivencia.

**Dato colectivo (body-sm, tertiary):**
> El 68% de ejecutivos con tu perfil reportan 3 o más de estos síntomas.

**Opciones (selección múltiple — puede marcar varias):**

☐ **"Niebla mental"** — *Leo algo y al terminar no sé qué he leído*
☐ **"Peores decisiones"** — *Tomo peores decisiones que antes — y lo noto*
☐ **"Mente dispersa"** — *Mi cabeza salta de un tema a otro sin control*
☐ **"Palabras perdidas"** — *Me cuesta encontrar palabras que antes tenía*
☐ **"Agotamiento decisional"** — *Al final del día no puedo elegir ni qué cenar*
☐ **"Ninguna de estas"**

**Señal:** Cada ítem marca un subfactor de D3. Más ítems = score más bajo. La selección múltiple da granularidad y hace que la persona se reconozca en más de un síntoma (efecto espejo acumulativo).

### Pregunta 4 — Equilibrio emocional (D4)

**Barra de progreso:** 45%

**Texto:**
> ¿Cuál de estas frases podrías haber dicho tú esta semana?

**Contexto (body-sm, secondary, italic):**
> La reactividad emocional no es un defecto de carácter. Es la respuesta de un cerebro que ha agotado los recursos para regular.

**Dato colectivo (body-sm, tertiary):**
> Esta es la pregunta que más tarda en responderse. Tómate tu tiempo.

**Opciones (selección única — la que más resuene):**

A. **"Irritabilidad"** — *Te encienden cosas que antes no te afectaban*
B. **"Vacío"** — *Sientes un hueco que no sabes describir aunque desde fuera todo va bien*
C. **"Explosiones de culpa"** — *Explotas con quien más quieres y después te sientes fatal*
D. **"Anestesia emocional"** — *No sientes nada — ni alegría ni tristeza. Como si estuvieras apagado*
E. **"Rumiación constante"** — *Tu mente no para: conversaciones, errores, escenarios futuros*
F. **"Razonablemente bien"** — *Tu equilibrio emocional es aceptable*

**Señal:**
- A → Amígdala desregulada. Simpático. Perfil Productivo/Controlador. D4 media-baja.
- B → Anhedonia. Dorsal vagal emergente. Perfil Productivo colapsado. D4 baja. D5 baja.
- C → Represión + explosión. Perfil Cuidador. D4 baja. Vergüenza alta (la culpa lo confirma).
- D → Dorsal vagal. Desconexión emocional. Perfil Fuerte/Desapegado. D4 muy baja. SEÑAL FUERTE.
- E → Rumiación. Simpático + prefrontal agotado. Perfil Controlador/Obsesivo. D3+D4.
- F → D4 probablemente ok.

**Nota:** La opción D ("no siento nada") es la señal más potente del gateway. Si la persona elige esto, el micro-espejo posterior se adapta: no confronta, no dramatiza. Nombra lo que está pasando con compasión científica.

---

## M3 — MICRO-ESPEJO 1

**Transición visual:**
- Fondo oscurece (a zona de reflexión)
- El micro-espejo aparece con fade-in + slide desde la izquierda (400ms)
- Borde izquierdo verde

**Barra de progreso:** 50% — "Tu diagnóstico: 50% completo"

**Lo que ve (ejemplo para quien marcó 3+ ítems en P3 + opción A o E en P4):**

**Texto principal (body, italic):**
> Tu cabeza va a mil pero tu capacidad de procesar se ha reducido. No es que seas menos capaz — es que tu cerebro está usando su energía para mantenerte en alerta en lugar de para pensar con claridad. Y eso tiene una consecuencia directa: te irritas más porque tu freno interno está agotado.

**Dato colectivo (body-sm, secondary):**
> El 83% de personas con tu combinación de respuestas no saben que la irritabilidad y la niebla mental tienen la misma causa. Cuando se regula una, la otra mejora.

**Conexión futura (lo que planta para la bisagra):**
Este micro-espejo conecta D3 (niebla mental) con D4 (irritabilidad) bajo una misma causa (D1 — sistema nervioso desregulado). Cuando la bisagra muestre el score de D1, la persona pensará "los micro-espejos ya me lo estaban diciendo."

**Variantes del micro-espejo 1:**

| P3 + P4 | Micro-espejo (resumen) |
|---|---|
| Pocos síntomas cognitivos + B (vacío) | "Tu cerebro funciona pero por dentro hay un vacío. No es tristeza — es un sistema nervioso que se ha apagado para protegerte. Como un fusible que salta." |
| Muchos síntomas + C (exploto) | "Das todo lo que tienes a los demás y lo que queda para ti no alcanza. Tu cerebro no tiene recursos para regularse después de regularte a ti — y el resultado es que explotas justo con quien menos quieres." |
| Muchos síntomas + D (no siento) | "Tu cuerpo ha encontrado la forma más radical de protegerte: apagar los circuitos. No es que no te importe — es que sentir se volvió demasiado costoso para tu sistema." |
| Pocos síntomas + E (rumiación) | "Tu capacidad cognitiva está intacta pero tu mente la usa para anticipar en lugar de ejecutar. No estás pensando — estás sobreviviendo mentalmente." |

---

## M2 continúa — GRADIENTE (Preguntas 5-6)

### Personalización de tono (invisible, post-P4)

A partir de aquí, el sistema YA SABE quién tiene delante. P4 reveló el patrón emocional. El CONTENIDO de P5 y P6 no cambia — pero el CONTEXTO sutil sí:

| Perfil detectado | Ajuste de tono en P5-P6 |
|---|---|
| Fuerte (P4=D "no siento") | Los contextos se vuelven más directos, menos emocionales. "Dato:" en vez de "Esto sugiere..." |
| Cuidador (P4=C "exploto") | Se añade "No hay prisa" en algún punto. Tono más suave. |
| Controlador (P4=E "rumiación") | Más datos visibles. "Basado en tu combinación..." refuerza personalización. |
| Productivo (P4=A "irritabilidad") | Tono directo. Sin rodeos. El ejecutivo respeta la eficiencia. |

La persona no sabe que la experiencia se adaptó. Pero lo siente.

### Pregunta 5 — Alegría de vivir + Ritmo (D5)

**Barra de progreso:** 60%

**Texto:**
> ¿Cuándo fue la última vez que disfrutaste algo de verdad — sin culpa, sin prisa, sin pensar en lo siguiente?

**Dato colectivo (body-sm, tertiary):**
> El 41% de personas que hacen este diagnóstico no recuerdan cuándo fue.

**Opciones:**

A. **"No lo recuerdo"**
B. **"Hace semanas o meses"**
C. **"Puedo, pero no suelto la cabeza"** — *Disfrutas pero no del todo — algo te tira de vuelta*
D. **"Disfruto con culpa"** — *Sientes que deberías estar haciendo algo productivo*
E. **"Disfruto con frecuencia"**

**Señal:**
- A → D5 muy baja. Anhedonia profunda. Señal de dorsal vagal. Alarma.
- B → D5 baja. Burnout instalado. La chispa se apagó hace tiempo.
- C → D5 media. Simpático activo — no puede soltar.
- D → D5 media. Culpa del Productivo/Cuidador. Vergüenza de disfrutar.
- E → D5 probablemente ok.

**Nota:** Esta pregunta es la que más duele. Muchos ejecutivos nunca se la han hecho. El simple acto de formulársela ya es terapéutico — y genera una conexión emocional con el gateway que las preguntas anteriores no alcanzaron.

### Pregunta 6 — Patrones y estructura (D1 + D5 + perfil)

**Barra de progreso:** 70%

**Texto:**
> ¿Cuál de estas frases sientes más verdadera ahora mismo?

**Dato colectivo (body-sm, tertiary):**
> Cada una de estas frases la ha elegido más de 1.000 personas antes que tú.

**Opciones:**

A. **"No puedo parar"** — *Sientes que si aflojas, todo lo que has construido se cae*
B. **"Puedo con todo"** — *No necesitas ayuda — o eso es lo que repites*
C. **"Si yo caigo, todos caen"** — *Las personas que dependen de ti te mantienen en pie — y agotado*
D. **"Necesito entender primero"** — *No actúas hasta que lo tienes todo claro — y nunca está del todo claro*
E. **"He probado de todo"** — *Nada ha funcionado de verdad y empiezas a dudar de que algo pueda*

**Señal:**
- A → Perfil Productivo confirmado. Miedo nuclear activado. D1 comprometida (simpático crónico impulsado por el miedo a parar).
- B → Perfil Fuerte confirmado. Vergüenza máxima. Negación activa. D1 probablemente muy comprometida (pero no lo admite).
- C → Perfil Cuidador confirmado. Culpa + miedo. D5 comprometida por otros, no por sí mismo.
- D → Perfil Controlador confirmado. Parálisis por análisis. D3 comprometida por rumiación.
- E → Múltiples intentos fallidos. Lock bioquímico confirmado. Vergüenza alta por intentos previos.

**Esta pregunta es la más importante del gateway.** No por la señal dimensional — sino porque cada opción es la frase identitaria de un perfil. La persona se reconoce en una de ellas y el sistema sabe exactamente quién tiene delante. Todo lo que sigue (micro-espejo 2, bisagra, resultado, CTA) se calibra con esta respuesta.

---

## M3 — MICRO-ESPEJO 2

**Transición:** Igual que micro-espejo 1. Fondo oscuro. Borde verde.

**Barra de progreso:** 75%

**Lo que ve (varía radicalmente según P6):**

### Si eligió A — "Si me detengo, todo se derrumba"

**Texto principal (body, italic):**
> Llevas años confundiendo resistencia con fortaleza. Tu cuerpo te pide parar pero tu miedo te dice que no puedes. Y ese miedo no es irracional — es la respuesta de un sistema nervioso que lleva tanto tiempo en emergencia que ya no sabe funcionar de otra forma. No necesitas parar. Necesitas regularte para que tu rendimiento no dependa de tu desgaste.

**Dato colectivo (body-sm, secondary):**
> El 91% de personas que seleccionan esta frase llevan más de 2 años con su sistema nervioso en modo alarma sin saberlo. Los que regularon su biología no pararon — rindieron mejor.

### Si eligió B — "Yo puedo con todo"

**Texto principal (body, italic):**
> Poder con todo tiene un precio que nadie ve — ni siquiera tú. Tu cuerpo lleva la cuenta aunque tu mente la ignore. No te estamos pidiendo que admitas debilidad. Te estamos mostrando datos. Y los datos dicen que tu sistema nervioso está sosteniendo un nivel de alerta que tiene fecha de caducidad.

**Dato colectivo (body-sm, secondary):**
> De las personas que responden "puedo con todo", el 89% presenta señales biológicas que contradicen su percepción. No es fortaleza — es un sistema nervioso que ya no puede enviar la señal de alarma porque la alarma lleva años encendida.

### Si eligió C — "Si yo caigo, todos se caen"

**Texto principal (body, italic):**
> Has convertido el cuidado de los demás en tu razón de existir — y tu propio cuidado en un lujo que no te permites. Pero la biología no entiende de sacrificios: tu cuerpo se desgasta igual cuides de quien cuides. Y cuando se desgasta el que sostiene todo... todo lo que sostienes se cae.

**Dato colectivo (body-sm, secondary):**
> El 86% de personas con tu patrón reportan que la culpa de cuidarse es mayor que el malestar de no hacerlo. Es la trampa más silenciosa del agotamiento.

### Si eligió D — "Necesito entender antes de hacer nada"

**Texto principal (body, italic):**
> Entender es tu forma de sentirte seguro. Pero hay un punto donde entender más se convierte en la excusa perfecta para no actuar — porque actuar implica soltar el control. Lo que tu sistema nervioso necesita no es más análisis. Es una intervención concreta, medible y reversible.

**Dato colectivo (body-sm, secondary):**
> Las personas que priorizan entender antes de actuar tardan una media de 14 meses más en resolver su situación. No por falta de información — por exceso de análisis.

### Si eligió E — "He probado de todo"

**Texto principal (body, italic):**
> No es que nada funcione. Es que nadie ha mirado el cuadro completo. Un psicólogo trabaja la mente pero no tiene acceso a tu bioquímica. Un médico mira analíticas estándar que no miden lo que importa. Un coach te da herramientas que tu cerebro no puede ejecutar. Lo que falta no es otro intento — es un abordaje que integre todo.

**Dato colectivo (body-sm, secondary):**
> El 72% de las personas que llegan al programa han probado 3 o más enfoques previos. El factor común: ninguno abordó la biología como punto de partida.

**Checkpoint 2 — CLARITY:** La persona piensa "ahora entiendo lo que me pasa. No soy yo — es mi sistema nervioso. Y hay un patrón que se repite en miles de personas como yo." El micro-espejo 2 ha conectado su frase identitaria con la causa profunda, y el dato colectivo confirma que no está solo. Puede nombrar su patrón.

---

## M4 — BISAGRA (Preguntas 7-8 rápidas + revelación)

Las preguntas 7-8 son las últimas y las más rápidas. Capturan los datos finales para calcular el score compuesto.

### Pregunta 7 — Cuantificación rápida (todas las dimensiones)

**Barra de progreso:** 82%

**Texto:**
> En una escala del 1 al 10, ¿cómo calificarías cada una de estas áreas en tu vida ahora mismo?

**Formato:** 5 sliders horizontales, uno por dimensión. De 1 (muy mal) a 10 (muy bien). Valor por defecto: ninguno (la persona debe mover cada uno).

```
Capacidad de descansar y desconectar    [────●─────] 
Calidad de tu sueño                     [──●───────]
Claridad para pensar y decidir          [─────●────]
Estabilidad emocional                   [───●──────]
Ilusión por lo que haces                [──●───────]
```

**Señal:** Autoevaluación directa. Se cruza con las señales indirectas de P1-P6. Cuando hay discrepancia (por ejemplo: P2 = "duermo poco pero funciono" + slider sueño = 7), el sistema registra negación/vergüenza y ajusta el score real a la baja.

**Por qué sliders:** El ejecutivo piensa en números. Es su idioma. 5 sliders en una pantalla son rápidos (15 segundos) y le dan sensación de control. Product-philosophy: decisiones guiadas, sin fricción.

### Pregunta 8 — Duración y contexto temporal

**Barra de progreso:** 90%

**Texto:**
> ¿Cuánto tiempo llevas sintiéndote así?

**Contexto (body-sm, secondary, italic):**
> La duración importa: determina cómo responde tu cuerpo a la intervención.

**Opciones:**

A. "Semanas"
B. "Meses"
C. "Más de un año"
D. "Años — no recuerdo estar bien"

**Señal:**
- A → Burnout emergente. Lock bajo. Intervención rápida probable.
- B → Burnout instalado. Lock nivel 1-2.
- C → Burnout cronificado. Lock nivel 2-3. Score global se ajusta a la baja.
- D → Posible trauma de desarrollo O burnout severo. Lock nivel 3. Señal de derivación si combinado con D4 muy baja.

**Nota:** Esta pregunta cierra la captura de señal. El sistema ya tiene todo para calcular los 5 scores + el score global.

---

### BISAGRA — La revelación

**Transición visual:**
- Fondo oscurece al máximo (zona de reflexión profunda)
- Pausa de 2 segundos con "Calculando tu perfil de regulación..." (typing effect)
- El score aparece con animación de counter

**Lo que ve:**

**Componente bisagra** (fondo con gradiente sutil, borde verde tenue, border-radius 16px, padding generoso):

**Overline (overline, accent):**
> TU NIVEL DE REGULACIÓN

**Score principal (display, Cormorant Garamond, 56px):**
> 34

**Subtexto del score (h4, secondary):**
> de 100

**Comparación (h3, Inter Tight, secondary):**
El promedio de personas en tu situación que empezaron a regularse:

**Benchmark (display, Cormorant Garamond, 56px, accent):**
> 72

**Brecha (body, accent, peso 500):**
> La distancia entre ambos números es donde está tu oportunidad.

**Separador sutil.**

**Coste oculto (body, text-primary):**
> Con un nivel de regulación de 34, tu cuerpo pierde unas 12-15 horas semanales de rendimiento real. No en tiempo — en calidad de decisiones, en paciencia, en energía para lo que importa. En los últimos meses, eso se acumula.

**Amplificador social (body-sm, secondary):**
> De las 5.247 personas con un score similar al tuyo, las que actuaron en la primera semana mejoraron un 34% más rápido que las que esperaron un mes.

**Cómo se calcula el score:**

```
Score global = Media ponderada de D1-D5

D1 (Regulación Nerviosa): peso 30%
  - Inputs: P1 (contexto), P2 (sueño como proxy de SN), 
    P6 (patrón), P7-slider-1, P8 (duración)
  
D2 (Calidad de Sueño): peso 20%
  - Inputs: P2 (directa), P7-slider-2, P8 (duración)

D3 (Claridad Cognitiva): peso 20%
  - Inputs: P3 (síntomas cognitivos, conteo), 
    P7-slider-3

D4 (Equilibrio Emocional): peso 15%
  - Inputs: P4 (selección), P7-slider-4

D5 (Alegría de Vivir): peso 15%
  - Inputs: P5 (directa), P4 si eligió B-vacío, 
    P7-slider-5

Ajustes:
  - Si P2=D ("duermo poco pero funciono") Y slider-sueño > 6:
    D2 se reduce 20% (negación detectada)
  - Si P6=B ("puedo con todo"):
    Score global se reduce 10% (vergüenza/negación)
  - Si P8=C o D (>1 año):
    Score global se reduce 15% (cronificación)
  - Si P4=D ("no siento nada"):
    D4 automáticamente < 25 independientemente del slider

Escala: 0-100 donde:
  80-100 = Regulado (verde)
  60-79 = Atención necesaria (amarillo) 
  40-59 = Comprometido (naranja)
  0-39 = Crítico (rojo)
```

**El benchmark (72)** es el promedio REAL de personas que completaron 4+ semanas del programa LARS. No es inventado — es aspiracional y alcanzable. A medida que más personas hagan el gateway, este número se calibra con datos reales.

**La bisagra es compuesta:**
1. COMPARACIÓN: tu 34 vs. el 72 de quienes ya se regularon (activa Productivo y Controlador)
2. COSTE OCULTO: 12-15 horas semanales de rendimiento perdido (activa Fuerte y Cuidador)

Juntas cubren los 4 perfiles.

**Botón para continuar (ghost):**
> Ver mi diagnóstico completo

---

## PANTALLA EMAIL — La llave al mapa

**Transición:** El score de bisagra permanece visible arriba (recordatorio de la tensión). El contenido nuevo aparece centrado debajo.

**Lo que ve:**

Fondo oscuro. Centrado. Mínimo. Un solo campo. **Detrás del contenido, visible pero difuminado (CSS blur 8px + opacity 0.3), las 5 barras de dimensión de su mapa y el score global (34/100). La persona CASI VE su resultado. Lo huele. Las barras están ahí — colores semáforo visibles pero ilegibles. El score global SÍ se lee (no está difuminado). Las dimensiones son la recompensa de dar el email.**

**Score visible arriba (h1, text-primary):**
> 34/100

**Headline (Cormorant Garamond, h2):**
> Tu diagnóstico está listo

**Subtítulo (Inter, body, secondary):**
> Lo guardamos en una página personal para ti. Evoluciona con el tiempo — cada semana hay algo nuevo.

**Campo email:**
```
Placeholder: "Tu email"
Estilo: --color-bg-tertiary, border-radius 12px, padding 14px 16px
Focus: border --color-accent
```

**Botón (primario, pill verde):**
> Acceder a mi diagnóstico

**Debajo del botón (caption, tertiary):**
> Solo email. Cero spam. Tu diagnóstico es confidencial.

**Notas de diseño:**
- El Zeigarnik está al máximo: la persona ha visto su score (34), ha visto la brecha (vs. 72), ha visto el coste (12-15h/semana). NECESITA ver el desglose. El email no es fricción — es la llave para acceder a algo que ya siente suyo.
- "Evoluciona con el tiempo" planta la semilla del mapa vivo. No es un PDF que te olvidas — es algo que vale la pena volver a ver.
- Un solo campo. Cero campos extra. Cero preguntas adicionales. Nombre, teléfono, empresa = nunca aquí.
- "Cero spam" y "confidencial" — para el Fuerte que teme ser identificado y el Controlador que desconfía.
- Login con Google NO. Es un ejecutivo de alto nivel que no quiere vincular su cuenta de Google a un test de burnout. Email manual = más seguro, más privado.

**Qué pasa al enviar:**
1. Se crea la URL única: `dominio.com/mapa/[hash-único]`
2. Se envía email con el link: "Tu diagnóstico está aquí: [link]"
3. Se redirige automáticamente a la URL del mapa (no espera al email)
4. La persona ve su resultado completo inmediatamente

---

## M6 — RESULTADO COMO MAPA (vive en URL única)

**Contexto:** A partir de aquí, todo lo que sigue vive en una URL personal: `dominio.com/mapa/[hash]`. Es una página persistente que la persona puede visitar cuando quiera. No es una pantalla del gateway — es su espacio.

**Lo que ve al acceder por primera vez:**

### Header del resultado

**Overline (overline, accent):**
> TU DIAGNÓSTICO

**Título (Cormorant Garamond, h2):**
> Tu Mapa de Regulación

**Subtítulo (Inter, body, secondary):**
> Calibrado con +25.000 evaluaciones reales · Basado en tus 10 respuestas

### Score global (repetido del bisagra, más compacto)

**Score (h1):** 34/100
**Estado (badge):** Comprometido
**Texto (body-sm, secondary):** "Tu sistema nervioso lleva tiempo pidiendo atención."

### 5 dimensiones (grid 1 columna móvil, 2 columnas desktop)

Cada dimensión es una card con:

```
┌─────────────────────────────────────┐
│ REGULACIÓN NERVIOSA         28/100  │
│ ████████░░░░░░░░░░░░░░  ← rojo     │
│                                     │
│ Tu cuerpo está atascado en modo     │
│ alarma. No sabe cómo volver a la    │
│ calma — y eso afecta a todo lo      │
│ demás.                              │
│                                     │
│ ▸ Tu prioridad nº1                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ CALIDAD DE SUEÑO            31/100  │
│ █████████░░░░░░░░░░░░░  ← rojo     │
│                                     │
│ Tu cerebro no se repara por la      │
│ noche. Sin sueño profundo, ninguna  │
│ otra mejora se sostiene.            │
│                                     │
│ ▸ Mejorable en 72 horas             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ CLARIDAD COGNITIVA          38/100  │
│ ███████████░░░░░░░░░░░  ← naranja  │
│                                     │
│ Tu prefrontal está funcionando      │
│ con recursos mínimos. Las           │
│ decisiones cuestan más de lo que    │
│ deberían.                           │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ EQUILIBRIO EMOCIONAL        42/100  │
│ ████████████░░░░░░░░░░  ← naranja  │
│                                     │
│ Tu reactividad emocional no es un   │
│ defecto — es un cerebro que ha      │
│ agotado su capacidad de regular.    │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ALEGRÍA DE VIVIR            25/100  │
│ ███████░░░░░░░░░░░░░░░  ← rojo     │
│                                     │
│ La chispa que te llevó a construir  │
│ lo que tienes se ha apagado. No     │
│ la has perdido — está debajo del    │
│ agotamiento.                        │
│                                     │
└─────────────────────────────────────┘
```

### Primer paso recomendado

**Card con fondo verde sutil:**

**Texto (body, text-primary):**
> Tu prioridad es tu sistema nervioso (D1) y tu sueño (D2). Cuando estos dos se regulan, la claridad, el equilibrio emocional y la ilusión por vivir mejoran como consecuencia. No al revés.

**Texto secundario (body-sm, secondary):**
> Las personas con tu perfil que empezaron por regular el sueño reportaron mejoras medibles en las primeras 72 horas.

### Cascada de valor (integrada en el resultado)

**Después de las dimensiones, naturalmente:**

**En la dimensión más comprometida (D1 o D2):**
> "El capítulo 3 de *Burnout: El Renacimiento del Líder Fénix* explica en profundidad por qué tu sistema nervioso funciona así — y qué puedes empezar a hacer hoy." [Link sutil al libro]

**Junto al primer paso recomendado:**
> "¿Quieres que Javier revise tu mapa personalmente? Agenda una sesión de valoración gratuita." [Link sutil]

**Ambos son N1 y N2 de la cascada. Están DENTRO del resultado como parte natural del mapa, no como sidebar.**

### 5 puentes líquidos (integrados en cada dimensión)

Cada dimensión del mapa muestra lo que TIENE y, en una línea sutil al final de la card, lo que NO PUEDE tener sin observación continua. No es teaser — es verdad estructural. Los vacíos son genuinos.

**Puente 1 — Plan vivo (en el primer paso recomendado):**
Texto sutil (caption, tertiary): *"Este mapa es una foto fija. El programa lo convierte en un sistema que se adapta cada semana según cómo respondes."*

**Puente 2 — Resolución completa (en la dimensión más comprometida):**
Texto sutil (caption, tertiary): *"Esta dimensión tiene 3 subdimensiones que solo emergen con observación continua."*

**Puente 3 — Benchmark dinámico (junto al score global):**
Texto sutil (caption, tertiary): *"Tu 34 vs. 72 es la foto de hoy. El programa mide tu evolución semana a semana."*

**Puente 4 — Inteligencia personalizada (en cualquier micro-espejo del mapa):**
Texto sutil (caption, tertiary): *"Este patrón usa datos de miles de personas. El programa aprende TUS patrones — en 2 semanas sabe más de ti que tú."*

**Puente 5 — Sistema compartido (al final de las dimensiones):**
Texto sutil (caption, tertiary): *"Tu mapa es individual. El programa incluye 12 personas en tu misma situación — las brechas compartidas revelan lo que ningún diagnóstico individual puede ver."*

Los puentes se amplifican en loop: el plan vivo (1) necesita más resolución (2), que necesita benchmark dinámico (3), que necesita inteligencia personalizada (4), que se multiplica con el sistema compartido (5), que alimenta el plan vivo (1).

**Test ético:** ¿Estos vacíos existirían aunque no hubiera programa? Sí. Un mapa estático REALMENTE no se adapta. 5 dimensiones REALMENTE son menos que 12+. Un benchmark estático REALMENTE caduca. Los patrones individuales REALMENTE requieren datos longitudinales. Las dinámicas de grupo REALMENTE no se ven en diagnósticos individuales. Todos pasan.

### Depósitos de confianza — Cadena documentada

La confianza se acumula como capas. Cada depósito depende de los anteriores. Si uno falla, los siguientes pierden efecto.

```
DEPÓSITO 1 (M1 — Primera verdad): "Me entiende"
  La primera verdad nombra lo que siento con mis palabras.
  Si falla → todo lo que sigue se siente genérico.

DEPÓSITO 2 (M1 — Dato colectivo): "Tienen experiencia"  
  +25.000 sistemas analizados. No soy el primero.
  Si falla → los micro-espejos no tienen credibilidad.

DEPÓSITO 3 (M3 — Micro-espejo 1): "Sabe más que yo"
  Conecta mis síntomas con una causa que yo no veía.
  Si falla → la bisagra es un número sin contexto.

DEPÓSITO 4 (M3 — Micro-espejo 2): "Me conoce"
  Habla mi idioma identitario. Sabe mi frase.
  Si falla → el resultado se siente impersonal.

DEPÓSITO 5 (M4 — Bisagra): "Es honesto"
  Datos reales. No exagera ni minimiza.
  Si falla → el CTA se siente como manipulación.

DEPÓSITO 6 (Email): "Me protege"
  Solo email. Confidencial. Sin Google. Sin datos extra.
  Si falla → la persona desconfía de dar el email.

DEPÓSITO 7 (M6 — Resultado): "Es para mí"
  5 dimensiones calibradas con MIS respuestas. Único.
  Si falla → "podría ser el resultado de cualquiera."
```

Cada depósito se mide por la acción que sigue: si la persona continúa después de M1, el depósito 1+2 funcionó. Si completa P3-P4 sin abandonar, el depósito 3 mantuvo la atención. Si da el email, el depósito 6 funcionó. La cadena se diagnostica por dónde abandona.

---

## EL RÍO — Articulación explícita

El gateway eliminó la micro-regulación entre resultado y CTA. El río no se perdió — se reubicó. El gateway entero ES el río:

```
MOMENTO 1 — HACER:
  La persona PRODUJO su diagnóstico con 10 respuestas propias.
  No consumió pasivamente. Construyó su mapa con sus datos.
  El resultado es SUYO porque lo generó ella.
  (Product-philosophy: Hacer > Ver > Oír)

MOMENTO 2 — SENTIR:
  La bisagra le hizo SENTIR la brecha con SUS números.
  Los micro-espejos le hicieron SENTIR que alguien le entiende.
  La pregunta 5 ("¿cuándo disfrutaste algo?") le hizo SENTIR
  algo que no esperaba sentir en un test.

MOMENTO 3 — VER EL CAMINO:
  El resultado le muestra el mapa + primer paso + los 5 puentes.
  Los puentes revelan que hay profundidad que no puede acceder sola.
  El CTA es la puerta al camino que ya puede ver.
```

La persona nunca sale de la experiencia. Del gateway al email al mapa al CTA — todo es un río continuo. La URL del mapa ES el producto en su versión mínima. El programa en Mighty Networks es el producto en su versión completa. Misma agua, más profundidad.

---

## M7 — CTA COMO ALIVIO

**Lo que ve (después del resultado, con espacio generoso):**

**Texto pre-CTA (Cormorant Garamond, h3, italic):**
> Tu sistema nervioso lleva años sosteniendo lo que tú no podías soltar. Ahora tienes el mapa.

**Texto delta de alivio (Inter, body, text-primary):**
> Los primeros cambios llegan en 72 horas. No en meses — en 3 días. El Protocolo de Sueño de Emergencia está diseñado para que tu cuerpo note la diferencia antes de que tu mente decida si confía.

**Botón CTA (primario, pill verde, large):**
> Empieza la Semana 1

**Texto post-CTA (body-sm, tertiary):**
> 97€ · Protocolo de Sueño de Emergencia + Sesión 1:1 con Javier + MNN© · Garantía de 7 días

**Debajo, más pequeño (caption, tertiary):**
> Si tu sueño no mejora en 7 días, te devolvemos los 97€. Sin preguntas.

**Qué incluye la Semana 1 (card sutil, colapsable):**

```
→ Protocolo de Sueño de Emergencia
  Diseñado por el Dr. Carlos Alvear. Resultados en 72 horas.

→ Sesión 1:1 con Javier A. Martín Ramos
  Director del Instituto Epigenético. Ya tiene tu mapa.

→ MNN© — Mapa de Niveles de Neurotransmisores
  Tu primer análisis bioquímico real.

→ Garantía total
  7 días. Si no mejora tu sueño, devolución íntegra.
```

**Notas de diseño:**
- El texto pre-CTA es serif, itálica — es la voz de Javier. Empatía, no instrucción.
- El botón dice "Empieza" — acción, movimiento. No "Comprar", "Suscribirse", "Inscribirse."
- El precio + garantía van debajo en terciario. Visibles para el Controlador, no protagonistas.
- La card de contenido es colapsable — el que necesita saber qué incluye lo abre. El que está listo, hace clic directamente.

---

## M8 — URGENCIA NATURAL

**Lo que ve (debajo del CTA, sutil):**

**Texto (body-sm, secondary):**
> Tu mapa está guardado en tu página personal. Evoluciona con el tiempo — cada semana hay algo nuevo.

**Texto (body-sm, secondary, un tono más oscuro):**
> Cada semana sin regulación, tu cuerpo profundiza el patrón actual. No es opinión — es lo que confirman los datos de +5.000 personas. Cuanto antes, más rápida la recuperación.

**Dato de actividad (caption, tertiary):**
> 142 personas completaron este diagnóstico esta semana · 5.247 en total

**Notas:**
- CERO presión artificial. Cero "quedan 3 plazas." Cero countdown.
- El mapa VIVE en su URL — depósito de confianza máximo. Puede volver siempre.
- La urgencia es un HECHO biológico, no una técnica de ventas.
- El dato de actividad es prueba social en tiempo real, no testimonial estático.
- "Tu mapa evoluciona" planta la semilla de que hay razones para volver.

---

## POST-PUERTA — El mapa vivo

La persona ya tiene su URL única. Ya tiene su email capturado. Si no pagó, no se va con las manos vacías — tiene un activo digital personal que evoluciona. Cada evolución es valor nuevo que mantiene a la persona en el sistema y acerca el CTA.

**Principio:** El mapa es un micro-producto gratuito. Cada vez que la persona vuelve, hay algo nuevo. Cada cosa nueva profundiza su comprensión, su inversión identitaria y su confianza en el sistema. Los emails no son el valor — son la notificación de que hay valor nuevo en su mapa.

### Evolución del mapa (lo que aparece en la URL)

**Día 0 — El mapa base (inmediato)**
Lo que ya tiene: 5 dimensiones con scores, insights, primer paso recomendado, cascada de valor, CTA.

**Día 3 — Tu Arquetipo del Sistema Nervioso (nuevo)**
Basado en P6 (frase identitaria) + P4 (patrón emocional) + P2 (sueño), el sistema revela cuál de los 7 arquetipos de Javier es su dominante.

Se desbloquea una nueva sección en el mapa:
```
┌─────────────────────────────────────┐
│ NUEVO                               │
│                                     │
│ TU ARQUETIPO                        │
│ El Perfeccionista                   │
│                                     │
│ "En algún momento de tu historia    │
│ aprendiste que el amor, la          │
│ aceptación o la seguridad no eran   │
│ gratuitos — se ganaban con          │
│ resultados..."                      │
│                                     │
│ ▸ Leer mi arquetipo completo        │
└─────────────────────────────────────┘
```

La narrativa completa del arquetipo se muestra al expandir. Este contenido ya existe (arquetipos_sn.docx) — es profundamente identitario. La persona lo lee pensando "esto soy yo." No huele a venta. Huele a autoconocimiento que nadie le había dado.

Incluye: narrativa, herida, miedos, necesidades bioquímicas, necesidades del SN, necesidades emocionales. Todo calibrado para su arquetipo.

**Día 7 — Actualización de inteligencia colectiva (nuevo)**
Un dato nuevo aparece en su dimensión más comprometida:
```
┌─────────────────────────────────────┐
│ ACTUALIZADO                         │
│                                     │
│ REGULACIÓN NERVIOSA         28/100  │
│                                     │
│ Nuevo insight: el 67% de personas   │
│ con tu patrón reportan que la       │
│ primera mejora que notan es en la   │
│ calidad del sueño — antes incluso   │
│ que en la energía o la claridad.    │
│ Tu D2 (Sueño: 31) confirma que     │
│ ahí está tu palanca.               │
└─────────────────────────────────────┘
```

No es información reciclada. Es un insight nuevo generado por la inteligencia colectiva que no existía cuando hizo el test. La persona tiene razón para volver.

**Día 10-14 — Sesión de valoración gratuita (nuevo)**
Se desbloquea la opción de hablar con Javier:
```
┌─────────────────────────────────────┐
│ DISPONIBLE                          │
│                                     │
│ ¿Quieres que Javier revise tu mapa │
│ contigo?                            │
│                                     │
│ 20 minutos. Sin compromiso. Ya      │
│ tiene tus datos — no repites nada.  │
│                                     │
│ ▸ Agendar sesión gratuita           │
└─────────────────────────────────────┘
```

Para el Fuerte que no confía en sistemas digitales, hablar con un humano lo cambia todo. Para el Cuidador que necesita permiso, Javier se lo da en persona. Para el Controlador que necesita certeza, 20 minutos resuelven más que 30 emails.

**Día 14 — Subdimensiones desbloqueadas (nuevo + interacción)**
Se activan 2-3 preguntas adicionales que profundizan su dimensión más comprometida:
```
┌─────────────────────────────────────┐
│ NUEVO                               │
│                                     │
│ Tu regulación nerviosa tiene 3      │
│ subdimensiones que no pudimos       │
│ calcular con tu diagnóstico         │
│ original:                           │
│                                     │
│ · Activación diurna                 │
│ · Recuperación nocturna             │
│ · Respuesta al estrés agudo        │
│                                     │
│ 2 preguntas más para calcularlas.   │
│                                     │
│ ▸ Profundizar mi diagnóstico        │
└─────────────────────────────────────┘
```

La persona responde 2 preguntas. Su mapa se actualiza con mayor resolución. Más señal para el sistema. Más inversión identitaria (ha construido más). Más precisión en el primer paso recomendado.

**Día 21 — Contenido del libro personalizado (nuevo)**
Un extracto del capítulo exacto que explica su dimensión más comprometida:
```
┌─────────────────────────────────────┐
│ PARA TI                             │
│                                     │
│ Extracto del capítulo 3 de          │
│ "Burnout: El Renacimiento del       │
│ Líder Fénix"                        │
│                                     │
│ Tu dimensión más comprometida       │
│ (Regulación Nerviosa: 28) se        │
│ explica en profundidad aquí.        │
│                                     │
│ [Extracto de 500-800 palabras del   │
│ capítulo correspondiente]           │
│                                     │
│ ▸ El libro completo (15€)           │
└─────────────────────────────────────┘
```

Valor puro. No "compra el libro" — sino "aquí tienes exactamente lo que necesitas entender sobre tu situación." El link al libro es N1 de la cascada, integrado naturalmente.

**Día 30 — Reevaluación (interacción + nueva bisagra)**
Invitación a reevaluar con los 5 sliders de P7:
```
┌─────────────────────────────────────┐
│ UN MES DESDE TU DIAGNÓSTICO        │
│                                     │
│ ¿Ha cambiado algo?                  │
│                                     │
│ Mueve los sliders para actualizar   │
│ tu mapa.                            │
│                                     │
│ [5 sliders pre-rellenados con       │
│ sus valores originales]             │
│                                     │
│ ▸ Actualizar mi mapa                │
└─────────────────────────────────────┘
```

Si el score bajó → urgencia natural legítima: "Tu patrón se ha profundizado."
Si subió → refuerzo positivo: "Algo estás haciendo bien. Imagina con acompañamiento."
Si no cambió → consolidación: "Tu patrón se ha instalado. Los datos dicen que cuanto más esperas, más profundo."

El mapa se actualiza visualmente. Los scores viejos se muestran al lado de los nuevos. La persona ve su evolución (o falta de ella) en sus propios números.

### Los emails como notificación (no como valor)

Cada evolución del mapa genera un email que AVISA — no que ENTREGA. El valor está en el mapa. El email es la campana.

**Email día 3:**
> **Asunto:** Hay algo nuevo en tu mapa de regulación
>
> Tu arquetipo del sistema nervioso está disponible. Es la pieza que faltaba para entender por qué tu cuerpo responde como responde.
>
> [Botón: Ver mi mapa]

**Email día 7:**
> **Asunto:** Tu mapa se ha actualizado
>
> Nuevo insight sobre tu dimensión más comprometida. Un dato que no existía cuando hiciste tu diagnóstico.
>
> [Botón: Ver mi mapa]

**Email día 10-14:**
> **Asunto:** Javier puede revisar tu mapa contigo
>
> 20 minutos. Sin compromiso. Ya tiene tus datos.
>
> [Botón: Agendar sesión]

**Email día 14:**
> **Asunto:** Hay 3 subdimensiones nuevas disponibles
>
> 2 preguntas más para aumentar la resolución de tu diagnóstico.
>
> [Botón: Ver mi mapa]

**Email día 21:**
> **Asunto:** Un capítulo escrito para tu situación
>
> Basado en tu dimensión más comprometida. Del libro "Burnout: El Renacimiento del Líder Fénix."
>
> [Botón: Ver mi mapa]

**Email día 30:**
> **Asunto:** Un mes desde tu diagnóstico — ¿ha cambiado algo?
>
> Actualiza tu mapa en 30 segundos. Tus scores anteriores se guardan para que veas la evolución.
>
> [Botón: Actualizar mi mapa]

### Después del día 30 — El mapa no muere

Four Seasons no tiene callejones sin salida. Si la persona no convierte en 30 días, el mapa sigue vivo.

**Día 90 — Reevaluación trimestral:**
```
┌─────────────────────────────────────┐
│ 3 MESES DESDE TU DIAGNÓSTICO       │
│                                     │
│ Tu score original: 34/100           │
│ Tu score a 30 días: [si lo hizo]    │
│                                     │
│ ¿Quieres ver dónde estás ahora?     │
│                                     │
│ ▸ Actualizar mi mapa (30 segundos)  │
└─────────────────────────────────────┘
```

Si el score bajó → urgencia natural máxima: "Tu patrón se ha profundizado en 3 meses. Lo que hoy se resuelve en 12 semanas, dentro de un año puede requerir mucho más."
Si subió → refuerzo: "Algo estás haciendo bien. El programa convertiría esa mejora en transformación permanente."
Si no hizo la reevaluación de 30 días → oportunidad fresca: "Hace 3 meses tu score era 34. ¿Quieres saber dónde estás ahora?"

**Email día 90:**
> **Asunto:** 3 meses desde tu mapa — una pregunta
>
> ¿Ha cambiado algo?
>
> Tu mapa sigue aquí. Actualízalo en 30 segundos y compara.
>
> [Botón: Actualizar mi mapa]

**Cada 90 días después:** El mismo touchpoint se repite trimestralmente mientras el email esté activo y no haya convertido. Cada vez más breve. Cada vez con más historial comparativo. La persona que actualiza a los 6 meses y ve que su score sigue igual tiene 6 meses de datos gritándole que la inercia tiene un coste. La que ve que empeoró tiene urgencia legítima basada en SUS propios números, no en presión nuestra.

### Lo que esto resuelve

| Barrera | Cómo la resuelve el mapa vivo |
|---|---|
| **Timing** ("ahora no") | El mapa espera. Vive. Evoluciona. Cada actualización recuerda la brecha sin presionar. |
| **Confianza** ("no conozco a Javier") | Cada contenido nuevo (arquetipo, libro, insights) demuestra profundidad sin pedir nada. Día 10-14: sesión gratuita para quien necesita el humano. |
| **Precio** ("97€ sin saber si funciona") | Después de 3-4 semanas de valor gratuito de este nivel, 97€ con garantía de 7 días se siente como nada. |
| **Vergüenza** ("pagar es admitir que necesito ayuda") | El mapa es privado. URL única. Interactuar no es "pedir ayuda" — es "explorar mi diagnóstico." La vergüenza se erosiona con cada visita. |

### El CTA vive permanentemente en el mapa

En cada versión del mapa, el botón "Empieza la Semana 1 — 97€" está presente. No agresivo. No en popup. Siempre en el mismo sitio, después de las dimensiones, con el mismo texto de alivio. Pero cada vez que el mapa evoluciona y la brecha se hace más visible, ese botón tiene más gravedad.

### Fecha de última visita

Cuando la persona vuelve a su URL, el mapa muestra sutilmente:

**Texto (caption, tertiary):** "Última visita: hace 3 días" o "No has vuelto en 12 días"

No como reproche — como dato. Junto con los badges "NUEVO" en secciones desbloqueadas, da la sensación de que el mapa ESPERA a la persona. Como un diario que se actualiza solo.

### Mecánica de compartir + descarga

Después de las dimensiones, un elemento sutil:

**Texto (body-sm, secondary):**
> ¿Conoces a alguien que podría necesitar ver su mapa?

**Botón (ghost, small):** "Enviar el diagnóstico"
→ Genera link limpio al gateway (NO a su mapa — su mapa es privado). Si viene con parámetro de referencia, se registra para AMPLIFY.

**Botón (ghost, small):** "Descargar mi mapa"
→ PNG limpio con la estética del mapa: fondo oscuro, 5 barras con scores, score global, iconos de dimensión. Footer: "Mapa de Regulación · [fecha]". Sin logos agresivos. La persona se lo guarda, se lo enseña a su médico, o se lo lleva a la sesión de valoración con Javier.

### Email de día 0 (Four Seasons)

El primer email post-gateway. La primera impresión fuera de la experiencia. Impecable.

**Asunto:** Tu Mapa de Regulación

**Cuerpo (HTML, estilo dark, mínimo):**
```
Tu mapa está listo.

Score global: 34/100
Tu dimensión más comprometida: Regulación Nerviosa (28)
Tu primer paso: [personalizado según D1+D2]

[Botón: Ver mi mapa completo]

Este mapa es tuyo. Evoluciona con el tiempo — 
cada semana hay algo nuevo.

Confidencial. Solo tú puedes verlo.
```

Sin firma corporativa. Sin logo grande. Sin footer de "empresa." Sin "síguenos en redes." Mínimo. Limpio. El email es un mensajero, no un protagonista. El valor está en el mapa.

### Métricas del mapa vivo

```
- Tasa de captura de email (bisagra → email): objetivo >85%
- Visitas al mapa día 0: 100% (redirect automático)
- Visitas al mapa día 3 (arquetipo): objetivo >40%
- Visitas al mapa día 7 (insight): objetivo >25%
- Visitas al mapa día 14 (subdimensiones): objetivo >20%
- Interacción subdimensiones (responde 2 preguntas): objetivo >60% de quienes visitan
- Sesión con Javier agendada: objetivo >10% del total
- Conversión a Semana 1 desde mapa (acumulada 30 días): objetivo >15%
- Conversión a Semana 1 total (inmediata + mapa vivo): objetivo >20%
```

---

## CHECKPOINT 3 — CONFIDENCE (post-resultado)

La persona piensa: "Este sistema me entiende mejor que cualquier profesional que he visto. Mi mapa es personal — no es un template. Las 5 dimensiones describen exactamente lo que siento. Y el primer paso tiene sentido para MI situación."

Señales de que el checkpoint se cumple:
- El resultado NO podría ser igual con respuestas diferentes (personalización real)
- Cada insight de dimensión usa el lenguaje de lo que la persona respondió
- El primer paso recomendado es específico para su combinación de D1+D2 (no genérico)
- La cascada de valor está integrada, no impuesta

---

## OH SHIT MOMENT — Conexiones futuras

Cada pregunta tiene conexiones que se revelan DESPUÉS, dentro del programa:

| Pregunta | Conexión en Semana 1-4 | Conexión en Semana 5-12 |
|---|---|---|
| P2 (sueño) | El Protocolo de Sueño ataca exactamente lo que P2 reveló | Semana 6: "¿Recuerdas tu respuesta sobre el sueño? Mira cómo ha cambiado" |
| P4 (emociones) | Semana 2: "Tu respuesta sobre emociones predecía este patrón" | Semana 7 (Asamblea Interior): la parte que eligió en P4 se trabaja directamente |
| P5 (alegría de vivir) | Semana 4: "Tu respuesta sobre cuándo disfrutaste algo..." | Semana 10 (Valores): se reconecta con lo que P5 reveló |
| P6 (frase identitaria) | Semana 1: Javier ya sabe su frase y la aborda en la sesión 1:1 | Semana 11 (Nueva narrativa): reescribe la frase de P6 |

La persona descubrirá, semanas después, que una pregunta de 3 minutos predijo patrones que el programa confirma con datos reales. "El diagnóstico ya lo sabía."

---

## ESPECIFICACIÓN TÉCNICA PARA CONSTRUIR

### Flujo de pantallas

```
GATEWAY (la landing ES el gateway — una sola URL):
  Hero: Headline + P1 integrada (la persona llega y la pregunta está ahí)
  Pantalla 2: Pregunta 2 (selección única) — barra progreso aparece
  Pantalla 3: Primera verdad (revelación — ZONA 2)
  Pantalla 4: Pregunta 3 (selección múltiple)
  Pantalla 5: Pregunta 4 (selección única)
  Pantalla 6: Micro-espejo 1 (revelación — ZONA 2)
  Pantalla 7: Pregunta 5 (selección única)
  Pantalla 8: Pregunta 6 (selección única)
  Pantalla 9: Micro-espejo 2 (revelación — ZONA 2)
  Pantalla 10: Pregunta 7 (5 sliders)
  Pantalla 11: Pregunta 8 (selección única)
  Pantalla 12: Bisagra (revelación — ZONA 3, counter animado)
  Pantalla 13: Email capture (score visible + mapa borroso)
  → Redirect a URL única del mapa
  → Redirect a URL única

MAPA VIVO (URL única persistente):
  Sección 1: Score global + 5 dimensiones + insights
  Sección 2: Primer paso recomendado + cascada de valor
  Sección 3: CTA "Empieza la Semana 1" + urgencia natural
  ---
  Sección 4: [Día 3] Arquetipo del Sistema Nervioso
  Sección 5: [Día 7] Insight de inteligencia colectiva
  Sección 6: [Día 10-14] Sesión de valoración con Javier
  Sección 7: [Día 14] Subdimensiones (2 preguntas adicionales)
  Sección 8: [Día 21] Extracto personalizado del libro
  Sección 9: [Día 30] Reevaluación con sliders
  Sección 10: [Día 90+] Reevaluación trimestral (se repite cada 90 días)
```

### Datos que se almacenan por usuario

```
{
  id: uuid,
  email: string,
  map_url: string,            // hash único para la URL
  created_at: timestamp,
  responses: {
    p1: string,
    p2: string,
    p3: string[],
    p4: string,
    p5: string,
    p6: string,
    p7: {
      regulacion: number,
      sueno: number,
      claridad: number,
      emocional: number,
      alegria: number
    },
    p8: string
  },
  scores: {
    global: number,
    d1_regulacion: number,
    d2_sueno: number,
    d3_claridad: number,
    d4_emocional: number,
    d5_alegria: number
  },
  profile: {
    ego_primary: string,
    archetype: string,        // arquetipo SN asignado
    shame_level: string,
    fear_core: string,
    lock_level: number,
    duration: string,
    denial_detected: boolean
  },
  map_evolution: {
    archetype_unlocked: boolean,      // día 3
    archetype_viewed: boolean,
    insight_d7_unlocked: boolean,     // día 7
    insight_d7_viewed: boolean,
    session_unlocked: boolean,        // día 10-14
    session_booked: boolean,
    subdimensions_unlocked: boolean,  // día 14
    subdimensions_completed: boolean,
    subdimension_responses: object | null,
    book_excerpt_unlocked: boolean,   // día 21
    book_excerpt_viewed: boolean,
    reevaluation_unlocked: boolean,   // día 30
    reevaluation_completed: boolean,
    reevaluation_scores: object | null,
    reevaluations: [                  // historial trimestral
      { day: number, scores: object, date: timestamp }
    ]
  },
  confidence_chain: {                 // depósitos de confianza — diagnóstico
    d1_first_truth: boolean,          // ¿continuó después de M1?
    d2_collective_data: boolean,      // ¿continuó después del dato colectivo?
    d3_mirror_1: boolean,             // ¿completó P3-P4 sin abandonar?
    d4_mirror_2: boolean,             // ¿completó P5-P6 sin abandonar?
    d5_bisagra: boolean,              // ¿llegó a la bisagra?
    d6_email: boolean,                // ¿dio el email?
    d7_result: boolean,               // ¿visitó el mapa?
    abandoned_at_deposit: number | null  // en qué depósito se rompió la cadena
  },
  funnel: {
    gateway_completed: boolean,
    email_captured: boolean,
    map_visits: number,
    map_last_visit: timestamp | null,
    cta_clicked: boolean,
    converted_week1: boolean,
    converted_program: boolean,
    session_booked: boolean
  },
  meta: {
    source: string,
    device: string,
    time_to_complete: number,
    abandoned_at: string | null
  }
}
```

### Arquitectura de la URL del mapa

```
Estructura: dominio.com/mapa/[hash-12-caracteres]

El hash es:
- Único por usuario
- No contiene email ni datos personales
- No adivinable (aleatorio, no secuencial)
- Permanente (no expira)

La página del mapa:
- Se renderiza con los datos del usuario
- Muestra solo las secciones desbloqueadas según la fecha
- Las secciones nuevas aparecen con badge "NUEVO"
- El CTA está siempre presente, mismo sitio, misma forma
- Es responsive (mobile-first 375px)
- No requiere login (la URL ES el acceso — como un link mágico)
- Se puede guardar en favoritos / bookmarks

Seguridad:
- La URL con hash es el único método de acceso
- No se indexa en buscadores (noindex, nofollow)
- Los datos sensibles (scores) solo se muestran en la URL
- El email no se muestra en ningún sitio de la página
```

### Sistema de desbloqueo temporal

```
El desbloqueo NO es por calendario fijo. Es por condición:

Día 3 (arquetipo):
  Condición: created_at + 72 horas
  Trigger: cron job que marca archetype_unlocked = true
  Notificación: email "Hay algo nuevo en tu mapa"

Día 7 (insight):
  Condición: created_at + 7 días
  Trigger: cron job
  Notificación: email

Día 10-14 (sesión):
  Condición: created_at + 10 días AND NOT converted_week1
  Solo se desbloquea para quien NO ha pagado.
  Trigger: cron job
  Notificación: email

Día 14 (subdimensiones):
  Condición: created_at + 14 días AND NOT converted_week1
  Trigger: cron job
  Notificación: email

Día 21 (libro):
  Condición: created_at + 21 días AND NOT converted_week1
  Trigger: cron job
  Notificación: email

Día 30 (reevaluación):
  Condición: created_at + 30 días
  Se desbloquea para TODOS (incluso los que pagaron —
  les sirve para ver evolución)
  Trigger: cron job
  Notificación: email

Día 90+ (reevaluación trimestral):
  Condición: created_at + 90 días, luego cada 90 días
  AND NOT converted_program (si ya está en el programa,
  el programa tiene sus propias métricas)
  Trigger: cron job recurrente
  Notificación: email (cada vez más breve)
  Se detiene: cuando convierte O cuando 3 emails 
  consecutivos no se abren
```

### Inteligencia colectiva (datos agregados)

Los datos colectivos que se muestran ("el 78% de personas con tu patrón...") se calculan en tiempo real con todos los diagnósticos completados. Inicialmente se hardcodean con los datos de los +25.000 sistemas analizados por Neurotropy. Conforme el gateway acumula datos propios, se van calibrando.

```
Datos que se agregan:
- Distribución de scores por dimensión
- % de personas por patrón de respuesta
- Correlaciones entre dimensiones
- Correlaciones arquetipo SN ↔ dimensiones
- Tiempo medio de mejora por perfil (cuando hay datos de programa)
- % que actúa en semana 1 vs. semana 2+ vs. nunca
- Tasa de reevaluación y delta de scores a 30 días
```

---

*Gateway L.A.R.S.© · Diseño Completo · Marzo 2026*
