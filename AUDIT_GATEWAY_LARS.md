# AUDITORÍA COMPLETA — Gateway L.A.R.S.©
## Instituto Epigenético · https://lars.institutoepigenetico.com/
### Fecha: 23 marzo 2026

---

## MÉTODO

Navegación completa como usuario real (desktop 1440px) + revisión mobile (375px).
Evaluación cruzada contra 4 frameworks: Product Philosophy, Movement Philosophy, Gateway Skill, Profiles B2C Transformación.

---

## RESUMEN EJECUTIVO

El sistema tiene una base sólida: la estructura narrativa funciona, el copy es potente, y la arquitectura de 8 preguntas + micro-espejos + bisagra + email está correctamente implementada. El esqueleto es bueno.

Pero hay una distancia enorme entre "funciona técnicamente" y "transforma vidas de forma inevitable." Ahora mismo, la experiencia se siente como un formulario bien escrito — no como una conversación que te cambia la manera de verte. El estándar Four Seasons exige que cada segundo cuente. Todavía no estamos ahí.

Lo que sigue está organizado por impacto, de mayor a menor.

---

## HALLAZGOS CRÍTICOS (bloquean la conversión)

### 1. DATOS SOCIALES ROTOS — "El 0% de personas..."

**Dónde:** Todas las pantallas de micro-espejo (Primera Verdad, Micro-Espejo 1, Micro-Espejo 2) y la bisagra.

**Qué pasa:** Los datos colectivos muestran "El 0% de personas con tu patrón de respuestas..." en lugar de porcentajes reales (78%, 91%, etc.).

**Por qué es crítico:** La inteligencia colectiva es la M1 del Gateway — la Primera Verdad que genera confianza en los primeros 30 segundos. Si el dato dice "0%", el sistema pierde toda credibilidad. El usuario piensa: "esto es un test genérico que nadie ha hecho." Destruye la mecánica más poderosa del Gateway: que cada persona que hace el diagnóstico mejora el diagnóstico para todos los demás.

**Según Gateway Skill:** "Sin social → señal de alarma de diseño." La inteligencia colectiva en cada pantalla es obligatoria (Social nivel 1).

**Impacto estimado:** Pérdida de 30-50% de la confianza acumulada. Sin estos datos, los micro-espejos son observaciones genéricas, no verdades calibradas con evidencia.

**Acción:** Corregir la lógica de cálculo de porcentajes colectivos. Si no hay datos reales suficientes aún, usar valores semilla calibrados hasta que haya masa crítica.

---

### 2. INCONSISTENCIA EN EL SCORE — Bisagra muestra "2" pero luego dice "17"

**Dónde:** Pantalla de bisagra (post-P8).

**Qué pasa:** El score principal se muestra como "2 de 100" con benchmark "11". Pero el texto debajo dice "Con un nivel de regulación de 17..." Y la pantalla de email muestra "17/100 CRÍTICO."

**Por qué es crítico:** La bisagra es el momento de máxima tensión del sistema. Si los números no coinciden, el usuario pierde confianza exactamente cuando más la necesita. Es el momento donde la persona debe pensar "este sistema ME entiende" — no "esto tiene un bug."

**Según Product Philosophy:** "Resultados personales pesan más. Todo resultado que pueda ser personal, debe serlo." Un número inconsistente destruye la personalización percibida.

**Acción:** Revisar la lógica de scoring. El número que aparece en la bisagra DEBE ser el mismo que aparece en el email capture. Un solo score, una sola verdad.

---

### 3. LA LANDING NO TIENE SVG DE SISTEMA NERVIOSO (A-01)

**Dónde:** Hero de la landing.

**Qué pasa:** No hay SVG animado del sistema nervioso con pulso continuo. El hero es texto sobre fondo oscuro con un sutil patrón de red/nodos, pero no el SVG protagonista que debería ser el ancla visual de la experiencia.

**Según ANIMATIONS.md:** "A-01: SVG sistema nervioso — pulso continuo 3s, líneas con delay escalonado." Es verificación obligatoria de Fase 1.

**Por qué importa:** El SVG del sistema nervioso no es decoración — es la METÁFORA VISUAL del producto entero. Sin él, la landing es texto sobre fondo oscuro. Con él, la persona VE su sistema nervioso antes de que le pregunten nada. Product Philosophy: "Hacer > Ver > Oír."

**Acción:** Implementar A-01 como pieza central del hero. Debe ser el primer elemento que la persona ve y que establece el universo visual.

---

## HALLAZGOS GRAVES (reducen significativamente la conversión)

### 4. LA EXPERIENCIA SE SIENTE PLANA — No hay 3 zonas emocionales

**Dónde:** Todo el gateway.

**Qué pasa:** El fondo es prácticamente el mismo color oscuro durante todo el recorrido. No hay transición visible entre ZONA 1 (Exploración), ZONA 2 (Reflexión) y ZONA 3 (Revelación).

**Según FEATURE_GATEWAY_DESIGN.md:** Debe haber 3 zonas con transiciones de 600ms:
- ZONA 1 → bg-primary (preguntas)
- ZONA 2 → bg-secondary + borde verde + itálica (espejos)
- ZONA 3 → gradiente oscuro profundo (bisagra/resultado)

**Por qué importa:** Las zonas emocionales son la COREOGRAFÍA del gateway. Sin ellas, responder 8 preguntas se siente como llenar un formulario largo. Con ellas, el usuario SIENTE que algo cambia en el ambiente — como entrar en una habitación diferente. Movement Philosophy: "El ritmo musical: inhala (pregunta) → exhala (verdad/espejo)." Sin cambio de zona, no hay ritmo.

**Acción:** Implementar las 3 zonas con transiciones suaves (600ms ease). Cada zona debe sentirse como un cambio de temperatura emocional.

---

### 5. LOS MICRO-ESPEJOS NO IMPACTAN VISUALMENTE

**Dónde:** Primera Verdad, Micro-Espejo 1, Micro-Espejo 2.

**Qué pasa:** Los espejos son texto en itálica con borde izquierdo sobre el mismo fondo. No hay cambio de zona, no hay ruptura visual clara, no hay momento de "el sistema me está hablando directamente."

**Según DESIGN.md:** Los micro-espejos necesitan: borde izquierdo 3px acento, fondo bg-secondary, texto principal en itálica, dato colectivo debajo, animación fade-in + slide-right 400ms.

**Según Gateway Skill M3:** "Micro-espejos con ruptura visual." Deben sentirse como un momento donde el sistema PARA, te mira, y te dice algo que sabe de ti.

**Por qué importa:** Los micro-espejos son los depósitos de confianza que hacen que la bisagra funcione. Si se sienten como "más texto", la confianza no se acumula. Cada espejo debe ser un mini-WOW.

**Acción:** Rediseñar los micro-espejos como momentos de ruptura: cambio de zona (fondo más cálido/oscuro), tipografía diferenciada, animación de entrada más dramática, y separación visual clara del flujo de preguntas.

---

### 6. LA BARRA DE PROGRESO ES LINEAL — Debería ser no-lineal

**Dónde:** Todo el gateway.

**Qué pasa:** La barra de progreso avanza de manera uniforme (20%, 35%, 45%, 60%, 70%, 82%, 90%, 95%). No hay PAUSAS en los momentos de espejo ni tensión sostenida en 90%.

**Según FEATURE_GATEWAY_DESIGN.md:** La barra debe ser NO LINEAL:
- Saltos rápidos al inicio (momentum)
- PAUSAS durante espejos (espacio de recepción)
- Saltos pequeños al final (tensión)
- Sostenida en 90% durante bisagra (MÁXIMA TENSIÓN)

**Por qué importa:** La barra de progreso no es un indicador técnico — es una herramienta de tensión narrativa. Las pausas dicen "aquí pasa algo importante." La tensión en 90% dice "estás a punto de ver algo que cambiará tu perspectiva."

---

### 7. EL BOTÓN CTA DEL EMAIL NO ES "ALIVIO" — Es genérico

**Dónde:** Pantalla de email capture (95%).

**Qué pasa:** El CTA dice "Acceder a mi diagnóstico" sobre un botón oscuro/gris. No transmite alivio. No transmite urgencia natural. No es el botón pill lavanda del DESIGN.md.

**Según Gateway Skill M7:** "CTA como alivio. Primero valor, después compromiso." El CTA no debe PEDIR — debe ser el ALIVIO natural después de la tensión de la bisagra.

**Según DESIGN.md:** Botón pill lavanda (#c6c8ee) con hover transform + sombra. Texto pre-CTA en semibold (voz de Javier). Texto post-CTA con garantía + confidencialidad.

**Acción:** Rediseñar el CTA como momento de alivio: botón pill lavanda visible, texto pre-CTA que baje la tensión ("Tu mapa está listo. Solo necesitamos saber dónde enviarlo."), y el botón como la resolución natural de la experiencia.

---

## HALLAZGOS IMPORTANTES (mejoran significativamente la experiencia)

### 8. FALTA EL SHOCK INICIAL — La frase de apertura no impacta suficiente

**Dónde:** Hero, above the fold.

**Qué pasa:** La frase "Tu cuerpo lleva meses hablándote..." aparece como texto estático en itálica. No hay revelación progresiva, no hay animación de entrada, no hay momento de SHOCK.

**Según Movement Philosophy, Gramática del Movimiento:** "SHOCK — Ven algo que no esperaban. Rompe la inercia mental." El shock debe violar una expectativa. Un texto estático no viola nada — es esperado.

**Acción:** La frase de SHOCK necesita una entrada dramática: fade-in con delay, o typing effect, o revelación letra a letra. Debe sentirse como que alguien te susurra algo que no esperabas oír.

---

### 9. LAS CARDS DE TENSIÓN (below-fold) SE SIENTEN COMO "MÁS INFORMACIÓN"

**Dónde:** Sección below-fold con las 3 cards (73%, 12-15h, vacaciones).

**Qué pasa:** Las 3 cards aparecen con un diseño funcional pero no generan TENSIÓN. Son bloques azules con texto. No hay stagger de entrada, no hay revelación progresiva, no hay momento de "espera... esto es peor de lo que pensaba."

**Según Movement Philosophy:** La TENSIÓN es el tercer paso de la gramática. "El coste de no actuar. El contraste entre donde están y donde podrían estar se vuelve insoportable."

**Acción:** Las cards deben aparecer con stagger (150ms entre cada una, como spec A-03), con una animación que genere peso — no un simple fade-in, sino un movimiento que comunique gravedad.

---

### 10. LOS TESTIMONIOS SON PLACEHOLDER

**Dónde:** Sección de prueba social (below-fold).

**Qué pasa:** Los testimonios son ficticios. "Director de operaciones, 47 años" sin nombre, sin foto, sin contexto verificable.

**Según Movement Philosophy:** "Prueba social creíble. Alguien como él ya cruzó. Testimonios específicos, variedad, contexto replicable."

**Nota del PROGRESS.md:** Esto ya está marcado como pendiente de Javier. Pero es importante calibrar: testimonios débiles son PEOR que no tener testimonios. Si los testimonios siguen siendo placeholder, es mejor eliminar la sección temporalmente y dejar que el dato colectivo ("142 personas completaron este diagnóstico esta semana") haga el trabajo.

---

### 11. NO HAY NOMBRE DE JAVIER EN LA EXPERIENCIA

**Dónde:** Todo el gateway.

**Qué pasa:** El Dr. Carlos Alvear López aparece en la sección de credenciales al final de la landing. Pero Javier — el director, la VOZ del sistema — no aparece en ningún momento.

**Según Profiles B2C Transformación:** En negocios de transformación, la autoridad "no se impone, se demuestra con presencia y coherencia." El cliente busca un guía, no una institución.

**Por qué importa:** Los micro-espejos deberían sentirse como que ALGUIEN te habla — no como que un sistema genera texto. Una firma sutil ("— Javier") en el primer espejo transforma un texto en una conversación.

---

### 12. LA TRANSICIÓN P1→P2 ES ABRUPTA

**Dónde:** Al seleccionar una opción en P1.

**Qué pasa:** Cuando el usuario selecciona la opción en P1, la transición al gateway muestra un solapamiento visual momentáneo donde el contenido de P2 aparece superpuesto sobre la landing antes de resolverse.

**Según ANIMATIONS.md A-02/A-04:** Las transiciones deben ser slide horizontal 400ms (P sale -30px, P nueva entra +30px). Limpias, sin solapamiento.

**Acción:** Revisar la animación de transición P1→P2. Debe sentirse como un paso fluido, no como un glitch.

---

## HALLAZGOS DE OPTIMIZACIÓN (elevan la experiencia al nivel Four Seasons)

### 13. NO HAY HAPTIC FEEDBACK EN LAS SELECCIONES

**Dónde:** Todas las preguntas de selección.

**Qué pasa:** Al seleccionar una opción, aparece un checkmark pero no hay respuesta táctil/visual inmediata que diga "te escuché."

**Según Product Philosophy:** "Toda acción completada genera respuesta del sistema. Nunca silencio." Y: "Feedback inmediato al toque/clic. Nunca duda de si se registró."

**Acción:** Micro-animación de confirmación: la card seleccionada debe tener un pulso sutil, un cambio de borde más evidente, o una micro-vibración visual que diga "registrado."

---

### 14. LOS SLIDERS NO MUESTRAN VALOR HASTA QUE SE MUEVEN

**Dónde:** P7 (sliders 1-10).

**Qué pasa:** Los sliders muestran "—" como valor por defecto. Pero el thumb del slider está posicionado visualmente en el centro (~5), lo cual es confuso: parece que ya tiene un valor pero muestra "—."

**Según Product Philosophy:** "Si necesita explicación, está mal diseñado." El estado visual debe ser coherente con el estado de datos.

**Acción:** El thumb debería estar oculto o en posición 0 hasta que el usuario interactúe. O usar un diseño que haga explícito "no has respondido aún" (thumb gris/transparente en el centro, que se activa al primer toque).

---

### 15. FALTA EL "MOMENTO WOW" DE 8 SEGUNDOS EN LA REVELACIÓN

**Dónde:** Bisagra → email.

**Qué pasa:** Según la spec (A-12), debería haber una revelación orquestada de 8 segundos: score 0→val (1200ms), pausa 1.5s, D1-D5 aparecen secuencialmente (cada 1s), D prioritaria destaca, primer paso recomendado fade-in. En su lugar, el score aparece en la bisagra y el mapa borroso aparece directamente en el email capture.

**Según Product Philosophy:** "El efecto WOW es obligatorio. ¿Qué hay aquí que el usuario no esperaba? Si la respuesta es 'nada', no está terminado."

---

### 16. EL BELOW-FOLD TIENE DEMASIADO ESPACIO VACÍO

**Dónde:** Entre P1 cards y la sección "Lo que sientes tiene nombre."

**Qué pasa:** Hay un espacio vacío enorme (lo que parece ser ~200px) entre el final de las cards de P1 y el inicio del contenido below-fold. Se siente como un "fin" en lugar de una invitación a seguir explorando.

**Según Product Philosophy:** "Espacio generoso. Contenido respira. Nunca se aprieta para que quepa." Pero hay una diferencia entre "respira" y "está vacío." El espacio debe guiar, no abandonar.

---

## EVALUACIÓN POR FRAMEWORK

### Product Philosophy — Puntuación: 5/10

| Principio | Estado | Nota |
|---|---|---|
| Ejecución sin fricción | ✅ Aceptable | El flujo es claro, pocas fricciones |
| Decisiones guiadas | ✅ Bien | Una acción principal por pantalla |
| Experiencia directa | ⚠️ Parcial | El usuario HACE (responde), pero los resultados no se sienten "suyos" por los datos rotos |
| Four Seasons | ❌ No alcanzado | Faltan detalles, WOW, coreografía |
| Resultados o nada | ❌ Parcial | Score inconsistente, datos colectivos rotos |
| Interfaz que se habita | ❌ No alcanzado | Se siente como formulario, no como experiencia |

### Movement Philosophy — Puntuación: 6/10

| Elemento | Estado | Nota |
|---|---|---|
| Gramática S→E→T→A→CTA | ✅ Correcta | La estructura narrativa funciona |
| 5 estados de conciencia | ✅ Diseñados | El recorrido Unawareness→Readiness está |
| Ecuación de valor | ⚠️ Parcial | Resultado soñado claro, pero personalización rota |
| Confianza compuesta | ❌ Débil | Sin datos sociales, los depósitos no se acumulan |
| Oferta irresistible | ⚠️ Parcial | El CTA no se siente como alivio |
| Resistencia por desconfianza | ❌ No mitigada | Sin prueba social real, sin datos colectivos reales |

### Gateway Skill — Puntuación: 5/10

| Mecánica | Estado | Nota |
|---|---|---|
| M1 Primera Verdad | ❌ Rota | Datos 0%, pierde credibilidad |
| M2 Gradiente | ✅ Funciona | Cada paso devuelve algo |
| M3 Micro-espejos | ⚠️ Parcial | Copy bueno, pero sin ruptura visual ni datos |
| M4 Bisagra | ⚠️ Parcial | Typing effect funciona, score inconsistente |
| M5 Personalización | ✅ Funciona | Adapta espejo por perfil |
| M6 Resultado | ⚠️ Parcial | Mapa borroso es bueno, pero sin WOW orchestrado |
| M7 CTA como alivio | ❌ No funciona | CTA genérico, no alivio |
| M8 Urgencia natural | ⚠️ Parcial | Texto de coste presente, pero diluido |
| Checkpoints | ⚠️ | Sin validación observable |
| Social | ❌ Roto | 0% en todos los puntos |
| 3 Zonas | ❌ Ausentes | Mismo fondo todo el recorrido |
| Barra no-lineal | ❌ No implementada | Progreso lineal |

### Profiles B2C Transformación — Puntuación: 7/10

| Aspecto | Estado | Nota |
|---|---|---|
| 4 arquetipos identificados | ✅ Excelente | P6 detecta perfectamente |
| Copy calibrado por perfil | ✅ Muy bueno | Los espejos hablan al ego correcto |
| Vergüenza desarmada | ✅ Bien | "No es falta de voluntad — es bioquímica" |
| Lock biológico traducido | ✅ Bien | Cortisol, sistema nervioso, modo alarma |
| Neuroception (seguridad) | ⚠️ Parcial | Faltan señales de seguridad ambiental (zonas, ritmo) |
| Identidad tribal | ❌ Ausente | No hay "personas como tú ya pasaron por aquí" (datos rotos) |

---

## TOP 5 ACCIONES — Por orden de impacto

### 1. ARREGLAR LOS DATOS COLECTIVOS (urgente, bloquea todo)
Sin esto, el Gateway no tiene M1 (Primera Verdad) ni componente social. Es como un restaurante Four Seasons sin camareros.

### 2. IMPLEMENTAR LAS 3 ZONAS EMOCIONALES
Es lo que transforma "formulario" en "experiencia." Tres fondos diferentes, transiciones de 600ms, cambio de temperatura emocional.

### 3. ARREGLAR LA INCONSISTENCIA DEL SCORE
Un número → un solo número en toda la experiencia. Bisagra = Email = Mapa Vivo.

### 4. REDISEÑAR LOS MICRO-ESPEJOS COMO MOMENTOS DE RUPTURA
Cambio de zona + tipografía diferenciada + animación de entrada + datos colectivos reales = confianza que se acumula.

### 5. REDISEÑAR EL CTA COMO ALIVIO
Botón pill lavanda, texto pre-CTA en voz de Javier, resolución de la tensión acumulada.

---

## LA VISIÓN — Cómo debería sentirse

Imagina esto: llegas a la página. Un sistema nervioso pulsa suavemente en la pantalla. Una frase aparece letra a letra: "Tu cuerpo lleva meses hablándote." Debajo, sin botón, una pregunta directa: "¿Qué te trajo hasta aquí?" Haces clic en tu respuesta. El ambiente cambia sutilmente — más cálido, más íntimo. El sistema te dice algo que te deja helado: "El 78% de personas con tu patrón de respuestas presentan niveles de cortisol crónicamente elevados." No te lo dijimos nosotros — lo dijeron tus respuestas, calibradas con 25.000 personas más. Cada pregunta te devuelve más de lo que te pide. Cada espejo te dice algo que sabías pero no habías visto así. Y cuando llegas a tu score — 17 de 100, CRÍTICO — no te asustas. Te alivia. Porque por primera vez, lo que sientes tiene un nombre, un número, y un camino. El email no es una barrera. Es la llave para ver tu mapa completo. Y cuando lo ves, piensas: "¿Cómo es posible que un diagnóstico de 3 minutos me conozca mejor que yo mismo?"

Eso es el estándar. Vamos a construirlo.
