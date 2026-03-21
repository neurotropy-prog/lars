# FASE 1 — HERO + LANDING + P1
**Sesión 2 de Claude Code**

---

## Contexto

La página principal. Lo que la persona ve cuando llega a la URL. No hay landing separada — el hero ES el inicio de la experiencia. P1 visible sin clic previo.

## Docs a leer

- `CLAUDE.md`
- `docs/DESIGN.md` (sistema visual completo)
- `docs/features/FEATURE_LANDING_DESIGN.md` (spec completa con copy exacto)

---

## Qué se construye

### ABOVE THE FOLD

**Fondo:** `--color-bg-primary` (#0B0F0E). Ilustración SVG del sistema nervioso pulsando detrás del headline.

**1. SHOCK (Cormorant Garamond, body-lg, italic, color-text-secondary):**

> *"Tu cuerpo lleva meses hablándote. Esta es la primera vez que alguien te traduce lo que dice."*

**2. Headline (Inter Tight, display, semibold 600, color-text-primary):**

> **Descubre en qué estado está tu sistema nervioso**

**3. Subtítulo (Inter, body, color-text-secondary):**

> Un diagnóstico de 3 minutos calibrado con más de 25.000 evaluaciones reales. Tu resultado es personal, confidencial y tuyo — con o sin programa.

**4. P1 — ¿Qué te trajo hasta aquí? (cards seleccionables, 1 columna en móvil):**

- A. **"Agotamiento que no se va"** — *Llevas tiempo sintiéndote agotado y nada de lo que haces lo resuelve*
- B. **"Rendimiento en caída"** — *Tu capacidad ha bajado y no entiendes por qué*
- C. **"El cuerpo habla"** — *Duermes mal, estás irritable, y tu cuerpo da señales que no puedes ignorar*
- D. **"Alguien me lo sugirió"** — *Un médico, terapeuta o alguien de confianza te recomendó explorar esto*
- E. **"Curiosidad"** — *Quieres saber cómo está tu sistema nervioso*

**Feedback al seleccionar:** Borde → `--color-accent`, fondo → `--color-accent-subtle`, checkmark en esquina. Transición 150ms. Delay 600ms. Transición a P2: 400ms slide.

**5. Micro-promesas (caption, color-text-tertiary, centrado):**

> 10 preguntas · 3 minutos · Sin registro previo

### BELOW THE FOLD (4 secciones)

Fondo cambia a `--color-bg-secondary`. Para quien necesite más antes de P1.

**Sección 1 — ESPEJO:**

> **Lo que sientes tiene nombre. Y tiene solución.**
>
> No es falta de voluntad. No es que "no puedas con todo." Es un sistema nervioso que lleva meses — quizá años — en modo alarma. Y cuando eso pasa, tu sueño se rompe, tus decisiones se nublan, tu paciencia desaparece y tu energía no vuelve por mucho que descanses. No estás roto. Tu biología está respondiendo exactamente como debería ante una carga que ya no puede sostener.

**Sección 2 — TENSIÓN (3 cards):**

Card 1:
> **El 73% de ejecutivos con burnout no saben que lo tienen.** Confunden el agotamiento con "una mala racha" y pierden meses — a veces años — mientras su biología se deteriora.

Card 2:
> **Un sistema nervioso desregulado pierde entre 12 y 15 horas semanales de rendimiento real.** No en tiempo — en calidad de decisiones, en paciencia, en energía para lo que importa.

Card 3:
> **El burnout no se arregla con vacaciones.** Si tu cortisol no baja, tu sueño no se repara y tu sistema no se regula, dos semanas en la playa son un parche. Vuelves y en 72 horas estás igual.

Stagger animation al entrar en viewport (150ms delay entre cards).

**Sección 3 — PRUEBA SOCIAL (2-3 testimonios):**

Formato: citas con borde izquierdo `--color-accent` al 40%. Sin fotos. Cargo + edad.

> *"En 3 minutos entendí lo que llevaba 2 años sin ver."*
> — Director de operaciones, 47 años

> *"Pensaba que era estrés normal. El mapa me mostró que mi sistema nervioso llevaba meses en modo alarma."*
> — CEO, 52 años

> *"Lo hice por curiosidad. Los resultados me cambiaron la conversación conmigo mismo."*
> — Socia fundadora, 39 años

**NOTA:** Estos son PLANTILLA. Javier debe sustituirlos por testimonios reales adaptados de sus consultas (pendiente).

**Sección 4 — ALIVIO:**

> **3 minutos para entender lo que tu cuerpo lleva meses intentando decirte.**
>
> Este diagnóstico cruza tus respuestas con datos de más de 25.000 evaluaciones reales para mostrarte el estado de 5 dimensiones clave: regulación nerviosa, calidad de sueño, claridad cognitiva, equilibrio emocional y alegría de vivir. No es un test genérico — es un mapa calibrado para ti.

Credenciales (caption, tertiary):
> Diseñado por el Dr. Carlos Alvear López · Mind-Body Medicine, Harvard · +25.000 sistemas nerviosos analizados · +20 años

Dato colectivo (body-sm, tertiary):
> 142 personas completaron este diagnóstico esta semana.

CTA (botón pill verde): **Empezar mi diagnóstico** → scroll suave a P1 + pulse sutil.

Bajo CTA (caption, tertiary):
> Tu resultado es confidencial. No compartimos datos con terceros.

### FOOTER MÍNIMO

> Instituto Epigenético · Política de privacidad · Aviso legal

---

## Funcionalidades técnicas

- **Ilustración SVG:** Sistema nervioso abstracto. Líneas fluidas conectando nodos en `--color-accent` al 30%. Animación CSS: pulso 3s. No anatómico — orgánico, editorial.
- **Detección UTM:** Si UTM indica Confidence/Readiness → mostrar "¿Diagnóstico rápido (1 min) o completo (3 min)?"
- **Estado guardado (localStorage):** Si hay respuestas parciales → "Continúas donde lo dejaste. Llevas un X% completado." Botón "Continuar" + link "Empezar de nuevo"
- **Responsive:** Mobile-first 375px. Tablet 768px (cards de tensión en fila). Desktop 1280px (hero max-width 720px, below fold max-width 960px).
- **Accesibilidad:** Contraste WCAG AA. Cards focusables con teclado. ARIA roles. Skip link. prefers-reduced-motion respetado.

---

## Criterio de cierre

- [ ] En móvil (375px): SHOCK + headline + P1 visibles sin scroll o con scroll mínimo
- [ ] Al seleccionar opción en P1 → transición suave a P2 (P2 puede ser placeholder si Fase 2 no está)
- [ ] Below the fold: 4 secciones visibles, CTA sube a P1 con scroll suave
- [ ] Estado se guarda en localStorage tras P1
- [ ] Ilustración SVG pulsa sin afectar performance
- [ ] Lighthouse mobile > 90
- [ ] Ningún valor de diseño inventado — todo de DESIGN.md
- [ ] PROGRESS.md actualizado
