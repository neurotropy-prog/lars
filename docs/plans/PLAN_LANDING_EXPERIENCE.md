# PLAN: Upgrade de la Experiencia Landing — Four Seasons en cada detalle

**Prioridad:** Alta — la landing es la puerta de entrada. Si no enamora, nadie responde P1.
**Dependencia:** Se ejecuta DESPUÉS del PLAN_DESIGN_MIGRATION (necesita la paleta cálida)
**Estimación:** 2-3 sesiones
**Objetivo:** Que la experiencia below-the-fold pase de "funcional" a "esto es otra cosa" — nivel Four Seasons.

---

## DIAGNÓSTICO ACTUAL — ¿Por qué la landing se siente "pobre"?

Después de revisar todo el código de la landing (HeroSection, BelowTheFold, MirrorSection, TensionSection, SocialProofSection, ReliefSection), estos son los problemas concretos:

### 1. MONOTONÍA VISUAL
- **Todo se ve igual.** Mismos fondos, mismas cards, misma estructura. No hay ritmo visual.
- Las 4 secciones del below-fold (Espejo, Tensión, Prueba, Alivio) son texto plano sobre fondo plano con mínima diferenciación.
- No hay **formas orgánicas decorativas** — que DESIGN.md define como blobs peach en secciones emocionales.
- No hay **variación de layout** — todo es texto centrado en columna estrecha.

### 2. TESTIMONIOS SIN IMPACTO
- Son blockquotes simples con borde izquierdo lavanda.
- No tienen fondos de color diferenciados (lavanda, crema, lima — como dice DESIGN.md).
- No tienen icono de comillas como apertura.
- No tienen badges pill de atribución.
- No transmiten credibilidad ni emoción — son texto más.

### 3. COPY FUNCIONAL PERO SIN ALMA
- El copy cumple su función informativa pero le falta peso emocional.
- La sección Espejo es un solo párrafo largo sin descanso visual.
- La sección Tensión son 3 cards con dato + explicación pero sin jerarquía visual del dato.
- Falta **callback narrativo** entre secciones — no hay hilo que conecte SHOCK → Espejo → Tensión → Prueba → Alivio.

### 4. ANIMACIONES BÁSICAS
- Solo hay scroll-reveal (fade-in-up) genérico.
- Los counters de la sección Tensión son inline, sin impacto visual.
- No hay **stagger entre secciones** — cada sección aparece como bloque independiente.
- Falta la sensación de **coreografía** que ANIMATIONS.md describe.

### 5. AUSENCIA DE ELEMENTOS FOUR SEASONS
- No hay **stat cards de color** (terracota/marrón con números grandes blancos).
- No hay **micro-interacciones** en hover.
- No hay **separadores visuales** orgánicos entre secciones.
- El footer es mínimo pero plano — le falta el tratamiento oscuro cálido del nuevo DESIGN.md.
- No hay **jerarquía tipográfica clara** — headlines y body se sienten al mismo nivel.

---

## EL PLAN — 6 INTERVENCIONES

### INTERVENCIÓN 1: Rediseño completo de Testimonios (SocialProofSection)

**Estado actual:** 3 blockquotes minimalistas con borde izquierdo.
**Objetivo:** Cards visuales con personalidad, fondos pastel diferenciados, comillas decorativas, badges de atribución.

**Nuevo diseño (según DESIGN.md → Testimonios):**

```
Layout: Grid 3 columnas en desktop. Stack en móvil.

Card Testimonial 1 (fondo lavanda):
  Background: --color-surface-lavender (#F3E8F6)
  Border-radius: 20px
  Padding: --space-8 (32px)

  [Icono comillas] — Círculo 40px con "" en --color-text-primary, outline
  [Cita] — Inter Regular, --text-body, --color-text-primary
  [Badge] — Pill oscuro (#4B413C) con texto claro: "Director de operaciones, 47"

Card Testimonial 2 (fondo crema):
  Background: --color-surface-cream (#F9F1DE)
  ... misma estructura, diferente color

Card Testimonial 3 (fondo lima):
  Background: --color-surface-lime (#FBFAC1)
  ... misma estructura, diferente color
```

**Forma orgánica decorativa:**
Una forma blob en `--color-surface-peach` (#FFCA9E) al 60% opacity, parcialmente fuera del viewport a la derecha, detrás de la sección de testimonios. Solo visible en tablet+ (oculta en móvil).

**Animación:**
- Cada card entra con scroll-reveal (fade-in-up) + stagger 200ms.
- Al entrar, la comilla decorativa hace un scale sutil (0.9→1.0, 300ms).
- El blob peach hace un sutil translateX de 20px (parallax lento al scroll — solo si performant).

**Headline de sección (NUEVO):**
Añadir un headline antes de los testimonios:
> **Lo que dicen quienes ya pasaron por aquí.**

Tipografía: Lora Regular, `--text-h2`. Color: `--color-text-primary`.
Con overline: `PRUEBA SOCIAL` en Inter Medium uppercase, `--color-accent` (terracota).

### INTERVENCIÓN 2: Sección Espejo — De párrafo plano a experiencia editorial

**Estado actual:** Headline + un párrafo largo.
**Objetivo:** Texto que respira con peso visual y diseño editorial.

**Nuevo diseño:**

```
Layout: Max-width 680px, centrado.

[Overline] "LO QUE SIENTES" — Inter Medium uppercase, terracota, tracking amplio
[Headline] "Lo que sientes tiene nombre. Y tiene solución." — Lora Bold, --text-h2
[Separador sutil] — línea fina crema oscuro, 60px wide, centrada, margin 24px
[Párrafo 1] — Primera frase con peso:
  "No es falta de voluntad."
  Esto va en Lora italic, --text-h4, --color-text-primary. Solo esta frase.
  Crea impacto antes del texto explicativo.

[Párrafo 2] — El texto explicativo actual, pero fragmentado en 2-3 párrafos cortos
  con espaciado generoso entre ellos. Máximo 3 líneas por párrafo en móvil.

[Decoración opcional] — Una cita pull-quote al margen:
  "Tu biología está respondiendo exactamente como debería."
  En un recuadro lateral con border-left terracota 3px.
  Solo visible en desktop (en móvil, inline).
```

**Animación:**
- Overline fade-in primero (0ms)
- Headline fade-in-up (150ms delay)
- Separador scale-x de 0→1 (300ms delay)
- Frase de impacto fade-in (450ms delay)
- Párrafos fade-in stagger (600ms, 750ms)

### INTERVENCIÓN 3: Sección Tensión — De cards informativas a stat cards de impacto

**Estado actual:** 3 cards con el mismo aspecto visual — texto + explicación.
**Objetivo:** 3 cards con jerarquía visual fuerte donde el DATO protagoniza.

**Nuevo diseño:**

```
Card 1 (STAT CARD TERRACOTA):
  Background: --color-accent (#B45A32)
  Color: --color-text-inverse (#FFFBEF)
  Border-radius: 20px
  Padding: --space-8

  [Número] "73%" — Lora Bold, --text-display (56px), blanco
    Counter animado de 0→73% al entrar en viewport
  [Texto] "de ejecutivos con burnout no saben que lo tienen."
    Inter Regular, --text-body, blanco al 85% opacity
  [Subtexto] "Confunden el agotamiento con 'una mala racha'..."
    Inter Regular, --text-body-sm, blanco al 60% opacity

Card 2 (STAT CARD MARRÓN):
  Background: --color-secondary (#6E5032)
  ... misma estructura pero marrón

  [Número] "12-15h" — Lora Bold, --text-h1
  [Texto] "semanales de rendimiento real perdidas."

Card 3 (CARD BLANCA con borde):
  Background: --color-bg-tertiary (#FFFFFF)
  Border: 1px solid rgba(30,19,16,0.06)

  [Badge] "DATO CLAVE" — pill terracota subtle
  [Headline] "El burnout no se arregla con vacaciones." — Lora Bold, --text-h3
  [Texto] "Si tu cortisol no baja..." — Inter Regular
```

**Layout:**
- Desktop: Grid 3 columnas. Card 1 y 2 son stat cards de color que destacan.
- Móvil: Stack vertical con gap generoso.

**Animación:**
- Stagger 150ms entre cards.
- Los números (73%, 12-15h) con counter animado.
- Cards de color tienen un hover sutil: scale(1.01) + sombra profunda.

### INTERVENCIÓN 4: Sección Alivio — Credenciales con gravedad y CTA con espacio

**Estado actual:** Texto + credenciales en caption + CTA.
**Objetivo:** Sección de cierre que combina tranquilidad con urgencia ética suave.

**Nuevo diseño:**

```
Layout: centrado, max-width 680px.

[Overline] "EL DIAGNÓSTICO" — Inter Medium uppercase, terracota
[Headline] "3 minutos para entender lo que tu cuerpo lleva meses
            intentando decirte." — Lora Regular, --text-h2
[Párrafo] — El texto actual sobre las 5 dimensiones

[Card de credenciales] — NUEVA:
  Background: --color-bg-secondary (#F9F1DE)
  Border-radius: 20px
  Padding: --space-6
  Layout: horizontal en desktop, stack en móvil

  [Izquierda] Icono o badge "Harvard" + "Dr. Carlos Alvear López"
  [Centro] "+25.000 sistemas nerviosos analizados"
  [Derecha] "+20 años de práctica clínica"

  Cada stat es un mini-bloque:
    Número en Lora Bold, --text-h3, --color-accent
    Texto en Inter Regular, --text-body-sm

[Dato colectivo] "142 personas completaron este diagnóstico esta semana."
  Counter animado. Inter Regular, --text-body-sm, --color-text-tertiary.

[Espacio] — padding var(--space-12) antes del CTA

[CTA] Botón pill LIMA (#F5F564):
  "Empezar mi diagnóstico →"
  Texto: --color-cta-text (#1E1310)
  Hover: scale(1.02) + sombra suave
  Mínimo 52px height, padding generoso

[Disolvente] "Tu resultado es confidencial. No compartimos datos con terceros."
  Inter, caption, tertiary.
```

**Animación:**
- Scroll reveal escalonado.
- Card de credenciales: los 3 stats aparecen con counter animado + stagger.
- CTA: aparece último, con un breathing glow sutil (como el botón de Apple — sin ser agresivo).

### INTERVENCIÓN 5: Footer — De mínimo a profesional

**Estado actual:** Una línea de texto plano con links.
**Objetivo:** Footer oscuro cálido que cierra la experiencia con profesionalismo.

**Nuevo diseño (según DESIGN.md → Footer):**

```
Background: --color-bg-dark (#1E130F)
Padding: --space-16 arriba, --space-8 abajo

[Logo] — SVG del Instituto Epigenético, blanco/crema
  Margin-bottom: --space-10

[Grid 3 columnas en desktop, 1 en móvil]:

  Columna 1: "INSTITUTO"
    - Sobre nosotros
    - Equipo
    - Contacto

  Columna 2: "RECURSOS"
    - Blog (futuro)
    - Libro "Burnout: El Renacimiento"
    - Podcast (futuro)

  Columna 3: "LEGAL"
    - Política de privacidad
    - Aviso legal
    - Condiciones de uso

Heading de columna:
  Inter Medium uppercase, --text-overline
  Color: --color-text-inverse-muted (#EBCDB9)
  Letter-spacing: 0.1em

Links:
  Inter Regular, --text-body-sm
  Color: --color-text-inverse (#FFFBEF) al 85% opacity
  Hover: opacity 1

[Separador] — línea sutil rgba(255,255,255,0.08)

[Bottom] "© 2026 Instituto Epigenético. Todos los derechos reservados."
  Inter, caption, --color-text-inverse al 50%
```

**NOTA:** Algunos links serán placeholder (#) hasta que existan las páginas. Eso está bien — el footer da presencia institucional.

### INTERVENCIÓN 6: Ritmo visual y coreografía global

**Problema transversal:** Las secciones se sienten como bloques independientes sin conexión.

**Soluciones:**

#### A. Transiciones entre secciones
En lugar de cortes bruscos de fondo, usar gradientes sutiles:
```css
.section-transition-down {
  height: 64px;
  background: linear-gradient(to bottom, var(--from), var(--to));
}
```
Entre cada sección mayor.

#### B. Overlines consistentes
Cada sección lleva un overline en terracota uppercase que la nombra:
- `LO QUE SIENTES` (Espejo)
- `EL COSTE DE NO SABER` (Tensión)
- `PRUEBA SOCIAL` (Testimonios)
- `EL DIAGNÓSTICO` (Alivio)

Esto crea **ritmo tipográfico** y ayuda al Controlador Paralizado a mapear dónde está.

#### C. Hilo narrativo en el copy
El SHOCK dice: *"Tu cuerpo lleva meses hablándote."*
La sección Alivio cierra con: *"3 minutos para entender lo que tu cuerpo lleva meses intentando decirte."*

Este callback ya existe. Reforzar el hilo entre secciones intermedias:
- Espejo: "Tu cuerpo **habla** en síntomas."
- Tensión: "Y el coste de **no escuchar** es más alto de lo que crees."
- Testimonios: "Otros ya **escucharon**. Y cambió su conversación."
- Alivio: "3 minutos para **entender** el mensaje."

Cada verbo avanza: habla → no escuchar → escucharon → entender.

#### D. Formas orgánicas decorativas
Añadir 2-3 blobs peach (#FFCA9E) como elementos decorativos de fondo:
- **Blob 1:** Detrás de la sección de testimonios, overflow right.
- **Blob 2:** Detrás de la sección de alivio, overflow left (más sutil).
- **Ocultar en móvil** para no interferir.

```css
.organic-blob {
  position: absolute;
  background: var(--color-surface-peach);
  opacity: 0.5;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 768px) {
  .organic-blob { display: none; }
}
```

#### E. Parallax sutil en desktop
Las formas orgánicas y algunos elementos decorativos se mueven ligeramente con el scroll (2-5px de desplazamiento). **Solo CSS** con `transform: translateY(calc(var(--scroll) * 0.02))` o similar. Sin JS pesado.

---

## COPY MEJORADO — Propuestas concretas

### Hero SHOCK (mantener actual — funciona)
> *"Tu cuerpo lleva meses hablándote. Esta es la primera vez que alguien te traduce lo que dice."*

### Espejo — Fragmentar y dar peso

**Actual (un bloque):**
> No es falta de voluntad. No es que "no puedas con todo." Es un sistema nervioso que lleva meses — quizá años — en modo alarma...

**Propuesta (fragmentado):**

> **No es falta de voluntad.**

> Es un sistema nervioso que lleva meses — quizá años — operando en modo alarma. Cuando eso pasa, no importa cuánto descanses: tu sueño se fragmenta, tus decisiones pierden claridad, tu paciencia desaparece antes de llegar a casa.

> No estás roto. Tu biología está haciendo exactamente lo que sabe hacer cuando la carga supera el diseño.

*Primera frase aislada → impacto. Segundo párrafo → explicación concreta con imágenes (llegar a casa). Tercer párrafo → reframe biológico.*

### Tensión — Reforzar impacto del dato

**Card 1 headline mejorado:**
> **73% de ejecutivos con burnout no lo saben.**
*(Más corto, más impacto. El "no lo saben" es más directo que "no saben que lo tienen")*

**Card 2 headline mejorado:**
> **12-15 horas semanales de rendimiento perdido.**
*(Poner el número como protagonista absoluto)*

### Testimonios — Más específicos y creíbles

**Propuesta Testimonial 1 (Productivo):**
> *"Creía que necesitaba más disciplina. En 3 minutos descubrí que necesitaba regulación."*
> — Director de operaciones, 47 años

**Propuesta Testimonial 2 (Fuerte):**
> *"No le conté a nadie que lo hice. Los datos me explicaron lo que yo no quería ver."*
> — CEO, 52 años

**Propuesta Testimonial 3 (Controlador):**
> *"Lo hice por curiosidad científica. Los resultados me desarmaron."*
> — Socia fundadora, 39 años

*Cada testimonial tiene un micro-arco: creencia → descubrimiento. Son más específicos que los actuales.*

**NOTA:** Estos siguen siendo plantilla hasta que Javier provea los reales.

---

## ORDEN DE EJECUCIÓN

1. **Intervención 6A/6B** — Transiciones entre secciones + overlines (fundación visual)
2. **Intervención 2** — Sección Espejo rediseñada
3. **Intervención 3** — Sección Tensión con stat cards de color
4. **Intervención 1** — Testimonios con cards pastel + comillas + badges
5. **Intervención 4** — Sección Alivio con card de credenciales + CTA lima
6. **Intervención 5** — Footer profesional
7. **Intervención 6C/D/E** — Copy callbacks + blobs + parallax
8. **Verificación completa** — flujo, responsive, animaciones, accesibilidad

---

## CHECKLIST FOUR SEASONS

Antes de dar por terminada la landing, verificar cada punto:

### Impresión general
- [ ] ¿Al llegar, la persona siente "esto es diferente"? (WOW del SHOCK)
- [ ] ¿La experiencia transmite confianza clínica SIN frialdad hospitalaria?
- [ ] ¿Hay calidez visual? (crema, terracota, formas orgánicas)
- [ ] ¿El vacío respira? (espacio generoso entre secciones)

### Ritmo visual
- [ ] ¿Cada sección se ve diferente a la anterior? (variación de layout, color, tipografía)
- [ ] ¿Hay overlines que crean ritmo tipográfico?
- [ ] ¿Las transiciones entre secciones son gradiente, no corte?
- [ ] ¿Las animaciones se sienten como respiración, no como excitación?

### Testimonios
- [ ] ¿Cada card tiene fondo pastel diferente?
- [ ] ¿Hay icono de comillas como apertura?
- [ ] ¿Hay badge pill de atribución?
- [ ] ¿Los testimonios hablan el idioma de los 4 perfiles?

### Datos de impacto
- [ ] ¿Los números (73%, 12-15h, 142) son protagonistas visuales?
- [ ] ¿Usan Lora Bold en tamaño grande?
- [ ] ¿Los counters se animan al entrar en viewport?
- [ ] ¿Las stat cards de color (terracota, marrón) crean contraste con las cards blancas?

### Copy
- [ ] ¿El hilo narrativo (habla→escuchar→entender) se percibe al leer?
- [ ] ¿Cada sección tiene copy calibrado para los 4 perfiles?
- [ ] ¿No hay párrafos de más de 3 líneas en móvil?
- [ ] ¿La frase de apertura de cada sección tiene peso propio?

### Credenciales
- [ ] ¿Harvard, 25.000, 20 años son visibles sin buscarlos?
- [ ] ¿Están presentados con gravedad (card propia, números grandes)?
- [ ] ¿El dato colectivo ("142 personas esta semana") se actualiza o parece vivo?

### CTA
- [ ] ¿Solo hay UN CTA lima visible por viewport?
- [ ] ¿El CTA lima contrasta lo suficiente sobre crema?
- [ ] ¿Hay espacio generoso alrededor del CTA (respira)?
- [ ] ¿El CTA del below-fold sube suave a P1 + pulse?

### Footer
- [ ] ¿El footer oscuro cálido cierra la experiencia con peso?
- [ ] ¿Los headings son dorado/tan uppercase?
- [ ] ¿El logo aparece en el footer?

### Técnico
- [ ] Mobile-first 375px — todo funciona sin scroll horizontal
- [ ] Formas orgánicas ocultas en móvil
- [ ] prefers-reduced-motion: animaciones desactivadas
- [ ] Contraste WCAG AA en todas las combinaciones
- [ ] No hay layout shift (CLS = 0)

### El test definitivo
- [ ] ¿Si un CEO de 48 años con burnout ve esta página a las 23:30 desde su iPhone, siente que está en un espacio que le entiende?

---

*Plan creado: 23 Marzo 2026*
