# DESIGN.md — Sistema de Diseño Visual

## Filosofía de Diseño

Estética premium-editorial sobre fondo oscuro. La experiencia transmite autoridad científica sin frialdad clínica: un espacio donde un ejecutivo de alto nivel se siente en un entorno a su medida. Cada decisión visual refuerza calma, profundidad y confianza.

**Principios rectores:**
- Oscuridad cálida, nunca fría ni técnica
- Tipografía editorial como voz principal
- Máximo contraste funcional sin agresividad
- Espacio generoso: el blanco (vacío) es un elemento de diseño, no desperdicio
- Cero decoración gratuita: cada elemento visual tiene función

---

## Referencias Visuales

| Fuente | Qué se toma | Qué NO se toma |
|--------|-------------|-----------------|
| **Function Health** (functionhealth.com) | Jerarquía tipográfica con itálicas para énfasis, layout limpio y generoso, CTAs prominentes sobre fondo oscuro, patrón de steps numerados | El blanco puro de algunas secciones interiores, la densidad informativa de las tablas de tests, la paleta de colores concreta |
| **Pitch Deck oscuro** (Imagen 2) | Fondos oliva/teal oscuro, tipografía grande y bold para datos/headlines, cards con bordes redondeados, jerarquía de información con números prominentes | Los colores arena/crema como color de texto primario (se usa blanco), el layout de presentación tipo slide |
| **Noha Furniture** (Imagen 1) | Fondos oscuros cálidos, grid modular, sensación editorial premium, secciones claramente delimitadas | La paleta marrón exacta, las fotos de producto como protagonistas |

---

## Paleta de Colores

### Colores Base

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg-primary` | `#0a252c` | Fondo principal de la aplicación |
| `--color-bg-secondary` | `#0f3037` | Fondo de cards, secciones alternadas |
| `--color-bg-tertiary` | `#0c2a48` | Fondo de inputs, elementos interactivos en reposo |
| `--color-bg-elevated` | `#0f2e56` | Hover de cards, tooltips, dropdowns |
| `--color-surface-subtle` | `#133364` | Bordes sutiles, separadores |

### Colores de Texto

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-text-primary` | `#F5F5F0` | Texto principal (off-white cálido, nunca #FFFFFF puro) |
| `--color-text-secondary` | `#A8B0AC` | Texto secundario, labels, metadata |
| `--color-text-tertiary` | `#6B7572` | Placeholders, texto deshabilitado |
| `--color-text-inverse` | `#0a252c` | Texto sobre fondos claros (botones primarios) |

### Color de Acento (Lavanda)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-accent` | `#c6c8ee` | Acento principal: CTAs, links, estados activos |
| `--color-accent-hover` | `#d8daf5` | Hover del acento |
| `--color-accent-subtle` | `#c6c8ee15` | Fondo sutil de badges, highlights (15% opacidad) |
| `--color-accent-muted` | `#8b8db8` | Bordes activos, indicadores secundarios |

### Colores Funcionales

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-success` | `#4ADE80` | Confirmaciones, progreso completado (semáforo clásico) |
| `--color-warning` | `#FACC15` | Alertas, valores que requieren atención |
| `--color-error` | `#F87171` | Errores, valores críticos |
| `--color-info` | `#60A5FA` | Información contextual, tooltips |

### Reglas de Uso de Color

- **Nunca usar `#000000` ni `#FFFFFF` puros.** Siempre las variantes cálidas definidas arriba.
- **El acento lavanda se usa con moderación.** Solo para CTAs primarios, links, e indicadores de estado activo. Si todo es lavanda, nada destaca.
- **Contraste mínimo WCAG AA:** texto primario sobre fondo primario = ratio ≥ 7:1. Texto secundario ≥ 4.5:1.
- **Bordes:** usar `--color-surface-subtle` a 40-60% opacidad. Nunca bordes blancos ni de alto contraste.
- **Semáforo funcional independiente del acento:** success (verde), warning (amarillo), error (rojo) nunca cambian aunque cambie el acento.

---

## Tipografía

### Fuentes

| Rol | Fuente | Fallback | Peso |
|-----|--------|----------|------|
| **Headlines / Display** | Plus Jakarta Sans | system-ui, sans-serif | 600 (Semibold), 700 (Bold) |
| **Cuerpo de texto** | Inter | system-ui, sans-serif | 400 (Regular), 500 (Medium) |
| **Datos / Métricas** | Plus Jakarta Sans | system-ui, sans-serif | 700 (Bold) |
| **Subtítulos / UI** | Inter Tight | system-ui, sans-serif | 500 (Medium) |
| **Código / Monospace** | JetBrains Mono | monospace | 400 |

> **Decisión tipográfica:** Todo sans-serif. Plus Jakarta Sans para headlines: geométrica, limpia, con personalidad suficiente para diferenciarse de Inter sin necesitar serif. La jerarquía se crea por peso y tamaño, no por contraste de familias tipográficas. Referencia directa: Acorn Property Invest — headlines grandes y bold que transmiten confianza y modernidad. Inter se mantiene para cuerpo y UI: máxima legibilidad. Plus Jakarta Sans está disponible en Google Fonts (gratis).

### Escala Tipográfica

Base: `16px` (1rem). Ratio: `1.250` (Major Third).

| Token | Tamaño | Line Height | Letter Spacing | Uso |
|-------|--------|-------------|----------------|-----|
| `--text-display` | 3.5rem (56px) | 1.1 | -0.03em | Hero, números grandes de impacto |
| `--text-h1` | 2.488rem (40px) | 1.15 | -0.025em | Títulos de página |
| `--text-h2` | 1.99rem (32px) | 1.2 | -0.02em | Títulos de sección |
| `--text-h3` | 1.59rem (25px) | 1.3 | -0.015em | Subtítulos, títulos de card |
| `--text-h4` | 1.25rem (20px) | 1.35 | -0.01em | Labels prominentes |
| `--text-body` | 1rem (16px) | 1.6 | 0 | Texto principal |
| `--text-body-sm` | 0.875rem (14px) | 1.5 | 0.005em | Texto secundario, captions |
| `--text-caption` | 0.75rem (12px) | 1.4 | 0.02em | Metadata, timestamps, badges |
| `--text-overline` | 0.75rem (12px) | 1.4 | 0.1em | Labels superiores en UPPERCASE |

### Reglas Tipográficas

- **Headlines:** siempre `Plus Jakarta Sans`, peso Semibold o Bold. Letter-spacing negativo. La jerarquía se marca por tamaño y peso, no por familia tipográfica.
- **Subtítulos y UI:** `Inter Tight`, peso Medium. Más compacta que Inter regular, ideal para labels y navegación.
- **Énfasis en headlines:** usar peso Bold para palabras clave dentro de un headline Semibold. Nunca itálicas en headlines — la referencia no las usa.
- **NUNCA subrayar** texto que no sea un link.
- **Overlines:** siempre uppercase + tracking amplio (`0.1em`). Color `--color-text-secondary` o `--color-accent`.
- **Números de impacto:** usar `--text-display` + `Plus Jakarta Sans` Bold. Son el protagonista visual de la sección.
- **Longitud de línea máxima:** 65-75 caracteres para cuerpo de texto. Usar `max-width: 42rem` en contenedores de texto.

---

## Espaciado

Base: `4px`. Sistema de múltiplos de 4.

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Mínimo: separación entre icono y label |
| `--space-2` | 8px | Padding interno compacto |
| `--space-3` | 12px | Gap entre elementos inline |
| `--space-4` | 16px | Padding de inputs, gap de grid compacto |
| `--space-5` | 20px | Gap estándar |
| `--space-6` | 24px | Padding de cards |
| `--space-8` | 32px | Separación entre bloques dentro de sección |
| `--space-10` | 40px | Margen entre componentes |
| `--space-12` | 48px | Separación entre secciones menores |
| `--space-16` | 64px | Separación entre secciones principales |
| `--space-20` | 80px | Padding vertical de secciones hero |
| `--space-24` | 96px | Espacio superior/inferior de página |

### Reglas de Espaciado

- **Generosidad:** preferir más espacio que menos. El espacio vacío transmite premium.
- **Secciones:** mínimo `--space-16` entre secciones principales. En móvil, mínimo `--space-12`.
- **Cards:** padding interno `--space-6`. Gap entre cards `--space-5`.
- **Consistencia vertical:** los márgenes entre elementos dentro de una sección siguen la jerarquía: headline → `--space-4` → párrafo → `--space-8` → siguiente bloque.

---

## Layout y Grid

### Contenedor Principal

```
Max-width: 1200px
Padding lateral: 24px (móvil), 40px (tablet), 64px (desktop)
Centrado horizontal: margin 0 auto
```

### Grid System

| Breakpoint | Nombre | Columnas | Gap | Padding lateral |
|------------|--------|----------|-----|-----------------|
| < 640px | `mobile` | 1 | 16px | 24px |
| 640-1024px | `tablet` | 2 | 20px | 40px |
| > 1024px | `desktop` | 12 | 24px | 64px |

### Patrones de Layout Recurrentes

1. **Hero full-width:** texto centrado, ancho máximo 800px, padding vertical generoso (`--space-20`)
2. **Grid de cards 2-up / 3-up:** cards de igual altura, gap `--space-5`
3. **Split 50/50:** texto a un lado, visual al otro. Alineación vertical centrada
4. **Lista de pasos numerados:** número grande a la izquierda (`--text-display`), contenido a la derecha
5. **Testimonial strip:** fondo ligeramente diferente (`--color-bg-secondary`), texto centrado con comillas
6. **Stats row:** 3-4 métricas en línea con número grande + label pequeño debajo

---

## Componentes

### Botones

| Variante | Fondo | Texto | Borde | Border-radius |
|----------|-------|-------|-------|---------------|
| **Primario** | `--color-accent` | `--color-text-inverse` | ninguno | 9999px (pill) |
| **Secundario** | transparent | `--color-text-primary` | 1px `--color-surface-subtle` | 9999px |
| **Ghost** | transparent | `--color-accent` | ninguno | 8px |

- **Padding:** `12px 28px` (default), `10px 20px` (small), `16px 36px` (large)
- **Hover primario:** fondo `--color-accent-hover`, transición 200ms ease
- **Hover secundario:** fondo `--color-bg-elevated`, transición 200ms ease
- **Nunca** usar sombras en botones. El contraste viene del color, no de la elevación.
- **Texto del botón:** `--text-body-sm`, peso Medium (500), sin uppercase

### Cards

```
Background: --color-bg-secondary
Border: 1px solid rgba(255, 255, 255, 0.06)
Border-radius: 16px
Padding: --space-6 (24px)
Hover: background --color-bg-elevated, border rgba(255, 255, 255, 0.10)
Transition: all 200ms ease
```

- **Cards con datos:** el número o métrica principal va en `--text-display` o `--text-h1`, prominente, arriba o a la izquierda. El contexto/label va debajo en `--text-body-sm` + `--color-text-secondary`.
- **Cards interactivas:** añadir `cursor: pointer` y transición de hover.
- **Nunca** usar box-shadow para elevación. La jerarquía se crea con diferencias sutiles de fondo.

### Inputs

```
Background: --color-bg-tertiary
Border: 1px solid rgba(255, 255, 255, 0.08)
Border-radius: 12px
Padding: 14px 16px
Color texto: --color-text-primary
Color placeholder: --color-text-tertiary
Focus: border --color-accent, box-shadow 0 0 0 3px rgba(198, 200, 238, 0.15)
```

### Tags / Badges

```
Background: --color-accent-subtle (lavanda al 15% opacidad)
Color texto: --color-accent
Border-radius: 9999px
Padding: 4px 12px
Font: --text-caption, peso Medium, uppercase, letter-spacing 0.05em
```

### Separadores

```
Color: rgba(255, 255, 255, 0.06)
Grosor: 1px
Margin vertical: --space-8
```

- Nunca usar `<hr>` visible. Los separadores son sutiles y opcionales.
- Preferir espacio vacío sobre líneas divisorias.

### Progreso (Gateway)

Indicador de avance durante el diagnóstico. El progreso debe sentirse como descubrimiento, no como formulario.

**Barra de progreso:**
```
Contenedor:
  Background: --color-bg-tertiary
  Height: 3px
  Border-radius: 9999px
  Width: 100%

Relleno:
  Background: --color-accent
  Height: 3px
  Border-radius: 9999px
  Transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1)
```

**Label de progreso:**
```
Font: --text-caption
Color: --color-text-secondary
Formato: "Tu diagnóstico: 40% completo"
Posición: debajo de la barra, alineado a la derecha
```

- **La barra es sutil, no protagonista.** 3px de alto, nunca más. El protagonista es el contenido que se revela, no el porcentaje.
- **El label usa lenguaje de descubrimiento:** "Tu diagnóstico: 40% completo" — no "Paso 3 de 7". El progreso es sobre lo que están construyendo, no sobre lo que les falta por rellenar.
- **El avance NO es lineal visualmente.** Los primeros pasos avanzan rápido (momentum), los últimos más despacio (tensión antes de la revelación). Esto se calibra con la cascada de mecánicas del gateway.

### Micro-espejo (Gateway)

Momentos donde el sistema devuelve una observación sobre la persona entre bloques de preguntas. Es el componente más importante del gateway: donde la confianza se construye.

```
Contenedor:
  Background: --color-bg-secondary
  Border-left: 3px solid --color-accent-muted
  Border-radius: 0 12px 12px 0
  Padding: --space-5 --space-6
  Margin: --space-6 0
  Animación entrada: fade-in + slide-right sutil (desde -12px), 400ms ease-out

Texto principal:
  Font: --text-body
  Color: --color-text-primary
  Style: italic (solo la observación, no el dato)

Dato colectivo:
  Font: --text-body-sm
  Color: --color-text-secondary
  Margin-top: --space-2
  Formato: "El 73% de personas en tu situación..."
```

- **El borde izquierdo acento indica que el sistema habla.** Es sutil pero inconfundible: esto no es una pregunta, es una revelación.
- **La observación va en itálica.** Diferencia visualmente lo que la persona dice (preguntas) de lo que el sistema devuelve (espejos).
- **El dato colectivo va debajo, más pequeño.** No compite con la observación — la valida.
- **Animación de entrada obligatoria.** El micro-espejo no "aparece" — se revela. Fade-in con desplazamiento lateral sutil desde la izquierda (porque el borde acento marca la dirección).

### Bisagra (Gateway)

El momento de mayor impacto emocional del gateway. Donde la persona ve la brecha entre dónde está y dónde podría estar. Necesita un tratamiento visual diferenciado.

```
Contenedor:
  Background: linear-gradient(135deg, --color-bg-secondary, --color-bg-tertiary)
  Border: 1px solid rgba(198, 200, 238, 0.12)
  Border-radius: 16px
  Padding: --space-8
  Margin: --space-8 0

Número / Score principal:
  Font: --text-display (Plus Jakarta Sans)
  Color: --color-text-primary
  Peso: 600
  Animación: counter que sube desde 0, 1200ms ease-out

Benchmark / Comparativa:
  Font: --text-h3 (Inter Tight)
  Color: --color-text-secondary

Brecha:
  Font: --text-body
  Color: --color-accent
  Peso: 500

Amplificador social:
  Font: --text-body-sm
  Color: --color-text-secondary
  Border-top: 1px solid rgba(255, 255, 255, 0.06)
  Padding-top: --space-4
  Margin-top: --space-4
```

- **El score principal es el protagonista visual absoluto.** Tamaño display, Bold, con animación de contador. Es el número que la persona va a recordar.
- **La comparativa va al lado o debajo, en peso Regular y color secundario.** No compite con el score — lo contextualiza.
- **La brecha se marca en color acento.** Es la distancia entre ambos números. Es lo que crea la tensión que el CTA resuelve.
- **El amplificador social se separa con línea sutil.** Es dato de refuerzo, no protagonista: "De las 847 personas con tu patrón, las que actuaron en la primera semana mejoraron un 34% más rápido."
- **Animación de entrada más lenta que el resto.** 400ms de delay tras la aparición del contenedor, luego el counter sube en 1200ms. La persona espera — y eso amplifica el impacto.

### Resultado / Mapa (Gateway)

El resultado final del diagnóstico. Es un mapa explorable, no un informe estático. La persona debe sentir que lo que tiene delante es SUYO — construido con SUS datos.

```
Contenedor principal:
  Background: --color-bg-secondary
  Border: 1px solid rgba(255, 255, 255, 0.08)
  Border-radius: 20px
  Padding: --space-8

Header del resultado:
  Overline: "TU DIAGNÓSTICO" en --text-overline + --color-accent
  Título: Plus Jakarta Sans, --text-h2
  Subtítulo: Inter, --text-body, --color-text-secondary

Dimensiones (cards internas):
  Background: --color-bg-tertiary
  Border-radius: 12px
  Padding: --space-5
  Grid: 2 columnas en desktop, 1 en móvil
  Cada dimensión muestra:
    - Label: --text-overline, --color-text-secondary
    - Score: --text-h3, --color-text-primary
    - Barra visual: height 4px, fondo --color-bg-elevated,
      relleno con color según nivel:
      Verde (--color-success) = bien
      Amarillo (--color-warning) = atención
      Rojo (--color-error) = crítico
    - Insight: --text-body-sm, --color-text-secondary, italic

Primer paso recomendado:
  Background: rgba(198, 200, 238, 0.08)
  Border: 1px solid rgba(198, 200, 238, 0.15)
  Border-radius: 12px
  Padding: --space-5
  Icono: flecha o paso, --color-accent, 20px
  Texto: --text-body, --color-text-primary
```

- **El overline "TU DIAGNÓSTICO" usa color acento.** Marca que esto es personal, no genérico.
- **Las dimensiones usan barras de color semáforo.** Verde/amarillo/rojo es universalmente entendido y no requiere explicación. El ejecutivo lo lee como un dashboard.
- **Cada dimensión tiene un insight en itálica.** No es solo un número — es lo que el número significa para esta persona.
- **El primer paso recomendado tiene fondo acento sutil.** Destaca visualmente del resto como la acción a tomar. Es el puente al CTA.

### CTA como Alivio (Gateway)

El CTA del gateway no pide — ofrece. Visualmente debe sentirse como resolución, no como venta.

```
Contenedor:
  Background: transparent
  Padding: --space-8 0
  Text-align: center

Texto pre-CTA:
  Font: Plus Jakarta Sans, --text-h3, weight 600
  Color: --color-text-primary
  Max-width: 500px
  Margin: 0 auto --space-5
  Ejemplo: "Tu sistema nervioso lleva años pidiendo esto."

Botón CTA:
  Variante: Primario (pill acento)
  Tamaño: Large (16px 36px)
  Texto: "Empieza la Semana 1" (nunca "Comprar", "Suscribirse", "Registrarse")

Texto post-CTA:
  Font: --text-body-sm
  Color: --color-text-tertiary
  Margin-top: --space-3
  Ejemplo: "97€ · Garantía de 7 días · Sin compromiso"
```

- **El texto pre-CTA usa la fuente de headlines, peso Semibold.** Es la voz de Javier, no la voz del sistema. Es empatía, no instrucción.
- **El botón usa lenguaje de acción, no de transacción.** "Empieza la Semana 1" es movimiento. "Comprar" es comercio.
- **El texto post-CTA disuelve fricción.** Precio + garantía + sin compromiso. En terciario para que no compita con el botón pero esté visible para el Controlador que necesita esos datos antes de hacer clic.

---

## Iconografía

- **Estilo:** outline/stroke, peso 1.5px. Nunca filled/solid.
- **Tamaños:** 16px (inline con texto), 20px (en botones), 24px (standalone), 32px (feature icons)
- **Color:** heredan el color del texto padre por defecto. Iconos de acento usan `--color-accent`.
- **Librería recomendada:** Lucide Icons (consistente con el estilo outline limpio)
- **Nunca** usar iconos decorativos sin función. Cada icono comunica algo.

---

## Imágenes y Media

- **Fotos:** siempre con overlay oscuro si llevan texto encima. Mínimo 40% opacidad de overlay.
- **Border-radius:** 16px para imágenes en cards. 24px para imágenes hero standalone.
- **Aspect ratios consistentes:** 16:9 para banners/hero, 4:3 para cards, 1:1 para avatares.
- **Avatares:** border-radius 9999px (circular), borde sutil `2px solid rgba(255, 255, 255, 0.1)`.
- **Gradientes:** solo oscuros, para fondos de sección. De `--color-bg-primary` a `--color-bg-secondary`. Nunca gradientes de color vivo.

---

## Animación y Transiciones

- **Duración base:** 200ms para hover/focus, 300ms para apariciones, 400ms para transiciones de layout.
- **Easing:** `ease` para la mayoría. `cubic-bezier(0.16, 1, 0.3, 1)` para entradas (ease-out expresivo).
- **Scroll animations:** fade-in + translate-y sutil (de 20px abajo hacia posición final). Solo en secciones principales, no en cada elemento.
- **Nunca:** animaciones que bloqueen interacción, bounces, ni efectos que distraigan del contenido.
- **Principio:** si la animación no ayuda a entender la jerarquía o la transición de estado, no se incluye.

---

## Responsive

### Breakpoints

| Nombre | Valor | Comportamiento |
|--------|-------|----------------|
| `mobile` | < 640px | Stack vertical, nav colapsada, tipografía reducida 1 nivel |
| `tablet` | 640-1024px | Grid 2 columnas, nav visible, tipografía intermedia |
| `desktop` | > 1024px | Layout completo, grid 12 columnas |

### Reglas Responsive

- **Tipografía:** en móvil, `--text-display` baja a `2.5rem`, `--text-h1` a `2rem`. El resto mantiene su escala.
- **Cards:** en móvil, siempre stack vertical (1 columna). En tablet, grid 2 columnas.
- **Hero:** en móvil, padding vertical se reduce a `--space-12`. Texto siempre centrado.
- **Imágenes:** todas con `width: 100%` y `height: auto`. Nunca dimensiones fijas.
- **Touch targets:** mínimo 44px × 44px para todos los elementos interactivos en móvil.

---

## Modo Claro (Futuro)

El sistema está diseñado dark-first. Si se implementa modo claro:

| Token dark | Equivalente light |
|------------|-------------------|
| `--color-bg-primary` (#0a252c) | `#FAFAF8` |
| `--color-bg-secondary` (#0e2885) | `#F0F0EC` |
| `--color-text-primary` (#F5F5F0) | `#1A1A1A` |
| `--color-text-secondary` (#A8B0AC) | `#6B6B6B` |
| `--color-accent` (#c6c8ee) | `#253149` (más saturado para contraste sobre claro) |

---

## Checklist de Validación Visual

Antes de aprobar cualquier pantalla, verificar:

- [ ] ¿Los colores vienen exclusivamente de los tokens definidos aquí?
- [ ] ¿La jerarquía tipográfica es clara? (se distingue headline → subtítulo → cuerpo → caption)
- [ ] ¿El espaciado entre secciones es generoso y consistente?
- [ ] ¿Los elementos interactivos tienen estados hover/focus/active definidos?
- [ ] ¿El contraste cumple WCAG AA mínimo?
- [ ] ¿Funciona en móvil sin scroll horizontal?
- [ ] ¿Las cards mantienen altura consistente en su fila?
- [ ] ¿No hay sombras, gradientes de color, ni bordes de alto contraste?
- [ ] ¿El acento lavanda se usa solo donde debe (CTAs, links, estados activos)?
- [ ] ¿Los números/métricas están visualmente prominentes cuando son el dato principal?
