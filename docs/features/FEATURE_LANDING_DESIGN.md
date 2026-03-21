# LANDING L.A.R.S.© — DISEÑO COMPLETO

**La landing ES el gateway · P1 visible en el hero · Construible inmediatamente**

---

## ANTES DE LEER: LA ARQUITECTURA

No hay landing + gateway como páginas separadas. Hay UNA experiencia. La persona llega a la URL y el primer paso del diagnóstico ya está visible. El hero contiene P1. Selecciona una opción → está dentro. Sin clic extra. Sin "Empezar mi diagnóstico" que lleva a otra página.

```
URL → Hero (SHOCK + headline + P1 visible) → Selecciona opción → Gateway inline
```

Referencia: como Keytrends (llegas y el campo está ahí), como ChatGPT (llegas y el input está ahí), como Lovable (llegas y ya estás haciendo).

La landing tiene UN SOLO TRABAJO: que la persona responda P1. Todo lo demás es configuración para que ese paso ocurra.

---

## EL RITMO EMOCIONAL

La gramática de movimiento en una sola página:

```
SHOCK       ← Frase de apertura. Viola expectativa. "Esto no es lo que esperaba."
HEADLINE    ← Propuesta clara. "Quiero saber."
P1          ← Acción. Ya está dentro.
------- below the fold (para quien necesite más) -------
ESPEJO      ← "Esto me pasa a mí."
TENSIÓN     ← "El coste de no saber es más alto de lo que pensaba."
PRUEBA      ← "Gente como yo ya pasó por esto."
ALIVIO      ← "Es rápido, confidencial y tiene base real."
CTA         ← Sube a P1. Cierra el loop.
```

El 70%+ no necesitará hacer scroll. Llega, lee, responde P1. Pero para el Controlador y el Fuerte que necesitan más datos antes de actuar, el below the fold está ahí.

---

## LOS 4 PERFILES — Cómo lee cada uno

| Perfil | Qué necesita para responder P1 | Probabilidad de scroll |
|---|---|---|
| **Productivo Colapsado** | Ve "rendimiento" en las opciones → responde en 15s | Baja (10%) |
| **Fuerte Invisible** | Ve que no piden datos, es biología, es confidencial | Media (30%) — puede bajar a ver credenciales |
| **Cuidador Exhausto** | Lee el SHOCK ("tu cuerpo te habla") y siente permiso | Baja-media (20%) |
| **Controlador Paralizado** | Necesita datos, estructura, credenciales | Alta (60%) — baja a las 3 cards + Harvard |

---

## ABOVE THE FOLD — El hero que es gateway

### Fondo y atmósfera

Fondo oscuro cálido (`--color-bg-primary`, #0B0F0E). Detrás del headline, la ilustración SVG del sistema nervioso pulsa suavemente — líneas fluidas conectando nodos en `--color-accent` (#4ADE80) al 30% de opacidad. Animación CSS: pulso suave (3s cycle). Orgánico. Vivo. Como un sistema que respira.

Mobile-first: 375px. Todo centrado. Sin logo prominente. Sin menú. Sin distracciones.

---

### Elemento SHOCK

**Tipografía:** Cormorant Garamond, `--text-body-lg`, italic, `--color-text-secondary`
**Posición:** Encima del headline. Centrado. Respira.

**Texto:**

> *"Tu cuerpo lleva meses hablándote. Esta es la primera vez que alguien te traduce lo que dice."*

**Por qué funciona por perfil:**
- **Productivo:** Reencuadra — no es debilidad, es un sistema enviando señales.
- **Fuerte:** Es biología, no emociones. No le pide sentir nada.
- **Cuidador:** Alivio — alguien le escucha por primera vez.
- **Controlador:** Intrigante — ¿qué dice mi cuerpo que yo no estoy leyendo?

**Lo que viola:** La persona espera "test de estrés" o "descubre si tienes burnout." En su lugar recibe la idea de que su cuerpo ya tiene las respuestas — solo necesita traducción. Es una inversión: no eres tú quien tiene un problema, eres tú quien tiene un mensaje.

---

### Headline principal

**Tipografía:** Inter Tight, `--text-display`, semibold (600), `--color-text-primary`

**Texto:**

> **Descubre en qué estado está tu sistema nervioso**

**Notas:**
- "Sistema nervioso" — NO "burnout." NO "salud mental." Un ejecutivo de 45 años no busca "test de burnout." Busca entender qué le pasa. El sistema nervioso es neutral y científico.
- "Descubre" — acción suave. No "Haz el test." No "Evalúa." Descubre implica que hay algo que no sabes y merece la pena saber.
- "En qué estado está" — personalización implícita. No es genérico. Es TU sistema nervioso.

---

### Subtítulo

**Tipografía:** Inter, `--text-body`, `--color-text-secondary`

**Texto:**

> Un diagnóstico de 3 minutos calibrado con más de 25.000 evaluaciones reales. Tu resultado es personal, confidencial y tuyo — con o sin programa.

**Palabras clave por perfil:**
- "3 minutos" → Productivo (no tengo tiempo).
- "25.000 evaluaciones" → Controlador (base de datos real, no inventado).
- "Confidencial" → Fuerte (nadie se entera).
- "Con o sin programa" → Todos. Disuelve la sospecha de trampa de ventas. El Fuerte necesita saber que no le van a vender. El Controlador necesita saber que no hay compromiso.

---

### P1 — Primera pregunta VISIBLE en el hero

**Tipografía pregunta:** Inter Tight, `--text-h3`, medium (500), `--color-text-primary`
**Tipografía opciones:** Título en Inter Tight medium + subtexto en Inter, `--text-body-sm`, italic, `--color-text-secondary`

**NO hay botón "Empezar mi diagnóstico" antes de P1.** La pregunta está ahí, visible, esperando. La persona lee el headline y P1 ya está debajo.

**Texto de pregunta:**

> **¿Qué te trajo hasta aquí?**

**Opciones (cards seleccionables, una columna en móvil):**

**A.** **"Agotamiento que no se va"**
*Llevas tiempo sintiéndote agotado y nada de lo que haces lo resuelve*

**B.** **"Rendimiento en caída"**
*Tu capacidad ha bajado y no entiendes por qué*

**C.** **"El cuerpo habla"**
*Duermes mal, estás irritable, y tu cuerpo da señales que no puedes ignorar*

**D.** **"Alguien me lo sugirió"**
*Un médico, terapeuta o alguien de confianza te recomendó explorar esto*

**E.** **"Curiosidad"**
*Quieres saber cómo está tu sistema nervioso*

**Cada opción habla el idioma de un perfil:**
- A → Cuidador/Productivo exhausto
- B → Productivo que mide rendimiento
- C → Fuerte cuyo cuerpo grita lo que él no dice
- D → Derivado (ya en Clarity)
- E → Controlador que investiga / Curiosidad pura

**Feedback al seleccionar:** Card cambia borde a `--color-accent`, fondo a `--color-accent-subtle`, checkmark en esquina. Transición 150ms. Delay 600ms. Transición a P2: 400ms slide.

---

### Micro-promesas bajo P1

**Tipografía:** Inter, `--text-caption`, `--color-text-tertiary`. Centrado.

**Texto:**

> 10 preguntas · 3 minutos · Sin registro previo

**Tres promesas que eliminan tres miedos:**
- "10 preguntas" → No es largo (Productivo).
- "3 minutos" → Puedo hacerlo ahora (todos).
- "Sin registro previo" → No me piden datos (Fuerte).

---

### Detección UTM (invisible)

Antes de mostrar P1, el sistema evalúa UTM / referrer:

- **Sin UTM o UTM genérico:** Hero estándar con P1 visible.
- **UTM de Confidence/Readiness** (sesión de valoración, contenido avanzado de Javier, link "empezar semana 1"): Mostrar opción "¿Diagnóstico rápido (1 min) o completo (3 min)?" antes de P1.

### Estado guardado (si vuelve)

Si hay respuestas en localStorage:

**Texto (Cormorant Garamond, h3):**
> Continúas donde lo dejaste

**Subtexto (Inter, body-sm, secondary):**
> Llevas un X% completado. Tu tiempo importa — nada se pierde.

**Botón primario:** "Continuar mi diagnóstico"
**Link sutil (caption, tertiary):** "Empezar de nuevo"

---

## BELOW THE FOLD — Para quien necesite más

**Separador visual:** El fondo cambia sutilmente a `--color-bg-secondary` (#141A18). Transición con gradiente (no corte brusco). La persona que hace scroll busca razones para confiar ANTES de responder P1.

---

### SECCIÓN 1 — ESPEJO (Normalización)

**Objetivo:** Que la persona se pregunte por ella misma. Del shock externo a la pregunta interna. "Esto me pasa a mí."

**Headline (Inter Tight, h3, `--color-text-primary`):**

> **Lo que sientes tiene nombre. Y tiene solución.**

**Texto (Inter, `--text-body`, `--color-text-secondary`):**

> No es falta de voluntad. No es que "no puedas con todo." Es un sistema nervioso que lleva meses — quizá años — en modo alarma. Y cuando eso pasa, tu sueño se rompe, tus decisiones se nublan, tu paciencia desaparece y tu energía no vuelve por mucho que descanses. No estás roto. Tu biología está respondiendo exactamente como debería ante una carga que ya no puede sostener.

**Cómo habla a cada perfil:**
- "No es que no puedas con todo" → Fuerte (valida su identidad sin atacarla).
- "Tu sueño se rompe, tus decisiones se nublan" → Productivo (rendimiento como síntoma).
- "Tu paciencia desaparece" → Cuidador (explota con los que quiere).
- "Tu biología está respondiendo exactamente como debería" → Controlador (hay lógica, hay sistema, no es caos).

**Notas de diseño:**
- Máximo 4 líneas en móvil por párrafo.
- El texto respira. Spacing generoso arriba y abajo (--space-2xl).

---

### SECCIÓN 2 — TENSIÓN (El coste de no saber)

**Objetivo:** Hacer visible la brecha. Que la persona entienda que la inercia tiene un precio. Urgencia ética — no fabricada.

**Formato:** 3 cards horizontales (en móvil: verticales, una debajo de otra). `--color-bg-secondary`, borde sutil `--color-surface-subtle` al 40%, border-radius 16px. Padding generoso.

**Card 1:**

> **El 73% de ejecutivos con burnout no saben que lo tienen.**
> Confunden el agotamiento con "una mala racha" y pierden meses — a veces años — mientras su biología se deteriora.

→ Controlador (dato duro que justifica la exploración). También despierta al que está en Unawareness.

**Card 2:**

> **Un sistema nervioso desregulado pierde entre 12 y 15 horas semanales de rendimiento real.**
> No en tiempo — en calidad de decisiones, en paciencia, en energía para lo que importa.

→ Productivo (habla su idioma: rendimiento, horas, impacto). También activa al Cuidador (energía para lo que importa = familia).

**Card 3:**

> **El burnout no se arregla con vacaciones.**
> Si tu cortisol no baja, tu sueño no se repara y tu sistema no se regula, dos semanas en la playa son un parche. Vuelves y en 72 horas estás igual.

→ Todos (desmonta la falsa solución más común). Especialmente resonante para el Productivo que ya lo intentó y el Fuerte que cree que "solo necesita desconectar."

**Notas de diseño:**
- Las 3 cards aparecen en secuencia con stagger animation (150ms delay entre cada una) al entrar en viewport.
- El headline de cada card en Inter Tight, `--text-body`, bold, `--color-text-primary`.
- El texto explicativo en Inter, `--text-body-sm`, `--color-text-secondary`.

---

### SECCIÓN 3 — PRUEBA SOCIAL (Testimonios del diagnóstico)

**Objetivo:** Normalizar la acción. Mostrar que gente con su perfil ya pasó por aquí y le resultó valioso. NO vende el programa — valida el acto de hacer el diagnóstico.

**Formato:** 2-3 citas en formato minimalista. Sin fotos. Sin nombres completos. Cargo + edad. Mismo fondo `--color-bg-secondary`. Borde izquierdo `--color-accent` al 40%.

**Testimonial 1:**

> *"En 3 minutos entendí lo que llevaba 2 años sin ver."*
> — Director de operaciones, 47 años

→ Productivo se identifica (cargo, tiempo perdido, eficiencia del diagnóstico).

**Testimonial 2:**

> *"Pensaba que era estrés normal. El mapa me mostró que mi sistema nervioso llevaba meses en modo alarma."*
> — CEO, 52 años

→ Fuerte se identifica (CEO, normalización, biología no emociones).

**Testimonial 3:**

> *"Lo hice por curiosidad. Los resultados me cambiaron la conversación conmigo mismo."*
> — Socia fundadora, 39 años

→ Controlador (curiosidad como puerta) y Cuidador ("conmigo mismo" — permiso para mirar hacia dentro).

**Notas:**
- Testimonios cortos: 1 frase máximo.
- Cargo + edad: que la persona vea a alguien de su mundo. C-level, directors, founders. 35-55 años.
- Sin fotos para preservar anonimato (refuerza "confidencial").
- NUNCA mencionan el programa, el precio, ni resultados clínicos. Solo hablan del diagnóstico.

**Origen de los testimonios — DECIDIDO:**
Los testimonios se adaptan de experiencias reales de las consultas de Javier. El momento de descubrimiento ("entender el estado de mi sistema nervioso") es el mismo aunque no haya sido a través del gateway. Javier selecciona 2-3 clientes que hayan vivido ese click y les pide permiso para usar una versión adaptada (cargo + edad, sin nombre completo). Los textos de arriba son plantilla — se sustituyen por las frases reales de los clientes de Javier. A medida que el gateway genere sus propios testimonios, se actualizan con experiencias directas del diagnóstico.

NUNCA testimonios inventados. Eso viola la línea ética de movement-philosophy.

---

### SECCIÓN 4 — ALIVIO (Qué mide + credenciales + CTA)

**Objetivo:** Resolver la última duda. Dar la información que confirma que esto es serio, rápido y que merece la pena. Y cerrar con la acción.

**Headline (Inter Tight, h3, `--color-text-primary`):**

> **3 minutos para entender lo que tu cuerpo lleva meses intentando decirte.**

→ Callback al SHOCK de apertura ("tu cuerpo lleva meses hablándote"). Cierra el arco narrativo.

**Texto (Inter, `--text-body`, `--color-text-secondary`):**

> Este diagnóstico cruza tus respuestas con datos de más de 25.000 evaluaciones reales para mostrarte el estado de 5 dimensiones clave: regulación nerviosa, calidad de sueño, claridad cognitiva, equilibrio emocional y alegría de vivir. No es un test genérico — es un mapa calibrado para ti.

→ Controlador: 5 dimensiones, 25.000 evaluaciones, calibrado. Estructura visible.
→ Productivo: rápido, personal, no genérico.
→ Fuerte: científico, datos, no emocional.
→ Cuidador: "alegría de vivir" como dimensión le da permiso.

**Credenciales (una línea, Inter, `--text-caption`, `--color-text-tertiary`):**

> Diseñado por el Dr. Carlos Alvear López · Mind-Body Medicine, Harvard · +25.000 sistemas nerviosos analizados · +20 años

**Dato colectivo (Inter, `--text-body-sm`, `--color-text-tertiary`):**

> 142 personas completaron este diagnóstico esta semana.

→ Dato vivo. A medida que haya datos reales, se actualiza automáticamente. Normalización para todos. El Fuerte ve que no es el primero. El Controlador ve volumen.

**CTA (botón primario, pill, `--color-accent`, centrado):**

> **Empezar mi diagnóstico**

**Comportamiento:** Scroll suave hacia arriba hasta P1. P1 hace un pulse sutil (border `--color-accent` parpadea 1 vez, 400ms). La persona ya tiene P1 en la pantalla, lista para responder.

**Debajo del CTA (Inter, `--text-caption`, `--color-text-tertiary`):**

> Tu resultado es confidencial. No compartimos datos con terceros.

→ Última disolución de fricción para el Fuerte.

---

## LO QUE NO HAY EN LA LANDING

- ❌ Mención del Programa L.A.R.S.©
- ❌ Precio de nada (ni del programa ni de la Semana 1)
- ❌ Explicación del método
- ❌ Foto de Javier ni del equipo
- ❌ Menú de navegación
- ❌ Footer pesado (solo mínimo legal si es obligatorio)
- ❌ Múltiples CTAs compitiendo
- ❌ Testimonios del programa (esos viven en el mapa vivo)
- ❌ Logo prominente del Instituto Epigenético
- ❌ Fotos de stock
- ❌ Iconos decorativos
- ❌ Gradientes de color vivo

La landing huele a herramienta, no a venta.

---

## FOOTER MÍNIMO

Si es legalmente necesario:

**Fondo:** `--color-bg-primary`
**Texto:** Inter, `--text-caption`, `--color-text-tertiary`

> Instituto Epigenético · Política de privacidad · Aviso legal

Sin redes sociales. Sin newsletter. Sin "sobre nosotros." Nada que distraiga del único objetivo: responder P1.

---

## ESPECIFICACIONES TÉCNICAS

### Responsive

- **Mobile-first:** 375px. Todo centrado. Una columna.
- **Tablet (768px):** Cards de tensión en fila de 3. Testimonios en fila.
- **Desktop (1280px):** Hero centrado con max-width 720px. Below the fold max-width 960px.

### Performance

- Lighthouse mobile > 95
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Sin layout shift
- SVG de sistema nervioso optimizado (inline, no imagen)
- Fuentes: Cormorant Garamond + Inter + Inter Tight cargadas con font-display: swap

### Ilustración SVG

Sistema nervioso abstracto — líneas fluidas conectando nodos. Monocromático en `--color-accent` al 30%. Animación CSS: pulso suave (3s cycle, ease-in-out). Posición: detrás del headline como fondo. No compite con el texto. En mobile puede ser más sutil o recortada.

No es anatómico. Es abstracto, orgánico, editorial. Líneas que fluyen y conectan puntos. Como una red que respira.

### Accesibilidad

- Contraste WCAG AA mínimo en todos los textos
- Cards de P1 focusables con teclado
- Roles ARIA en las opciones seleccionables
- Skip link para lectores de pantalla
- Reduced motion: desactivar animación SVG si prefers-reduced-motion

---

## CONEXIÓN CON EL GATEWAY

Al seleccionar una opción en P1, la experiencia transiciona inline a P2 (sueño). No hay redirect. No hay otra página. El contenido del below the fold desaparece (ya no es necesario — la persona está dentro). La barra de progreso aparece. El espacio se transforma en la ZONA 1 del gateway.

La transición es:
1. Card seleccionada → feedback visual (150ms)
2. Delay (600ms) — la persona ve su selección confirmada
3. Below the fold hace fade-out si estaba visible (300ms)
4. P2 hace slide-in desde abajo (400ms)
5. Barra de progreso aparece (fade-in 200ms) al 10%

A partir de aquí, el FEATURE_GATEWAY_DESIGN.md toma el control.

---

## MÉTRICAS DE LA LANDING

| Métrica | Qué mide | Objetivo |
|---|---|---|
| **% P1 respondida** | Conversión hero → gateway | > 60% |
| **% scroll** | Cuántos necesitan below the fold | < 40% (si es más, el hero no convierte solo) |
| **Tiempo en hero antes de P1** | Velocidad de decisión | < 30s para Productivo, < 60s para Controlador |
| **Fuente de entrada** | UTM, referrer, directo | Para calibrar SHOCK y detección de estado |
| **CTA below the fold clicado** | Cuántos necesitan el recorrido completo | Dato comparativo con % scroll |

---

## CHECKLIST ANTES DE CONSTRUIR

### Product-philosophy
- [ ] UNA acción principal (responder P1). Nada compite.
- [ ] Acción obvia en < 2 segundos (P1 visible en el hero).
- [ ] Cero callejones sin salida.
- [ ] Four Seasons: el SHOCK viola una expectativa y genera un WOW.
- [ ] Show > Tell (ilustración SVG antes que texto largo).

### Movement-philosophy
- [ ] Gramática S→E→T→A→CTA presente en below the fold.
- [ ] Arranca desde Unawareness (no asume que la persona sabe qué le pasa).
- [ ] Confianza por depósitos pequeños (dato colectivo, credenciales, "sin registro").
- [ ] Urgencia ética: coste REAL de no actuar, no fabricado.
- [ ] "Con o sin programa" — el resultado vale por sí mismo.

### Profiles
- [ ] Los 4 perfiles se reconocen en las opciones de P1.
- [ ] La normalización disuelve vergüenza sin nombrarla.
- [ ] Las credenciales hablan al Controlador.
- [ ] "Confidencial" habla al Fuerte.
- [ ] El tono es firme y empático, científico y humano.

### Ética
- [ ] Todo verificable. Datos reales o marcados como estimación.
- [ ] La persona sale con más poder (sabe más sobre sí misma).
- [ ] Si viera cómo diseñamos esto, estaríamos cómodos.
- [ ] Testimonios reales o no hay testimonios.

---

*L.A.R.S.© · Landing Design · Validado Marzo 2026*
