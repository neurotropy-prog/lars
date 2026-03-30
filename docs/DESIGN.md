# DESIGN.md — Sistema de Diseño Visual · Método LIBERA®

## Filosofía de Diseño

Estética limpia-científica sobre fondo blanco puro. La experiencia transmite autoridad médica y esperanza transformadora sin frialdad clínica: un espacio donde la persona se siente comprendida, respaldada por la ciencia y guiada por profesionales empáticos. Cada decisión visual refuerza confianza, naturaleza y rigor. La página es una landing de producto/programa (Método LIBERA® para TAG) con narrativa de venta larga tipo sales page.

**Principios rectores:**
- Limpieza absoluta sobre blanco, con acentos de color orgánico y vibrante
- Tipografía 100% sans-serif — Host Grotesk como única familia. Las frases de acento se resuelven con cambio de color y peso, nunca con itálica serif
- Contraste cromático: verde bosque como ancla de seriedad, salmón/terracota como calidez emocional, dorado como energía
- El vacío respira: espacio generoso como señal de claridad y profesionalismo
- Cero decoración sin función: cada elemento visual comunica o guía
- Sin ilustraciones: la página se apoya en tipografía, color, espacio y fotografía de personas reales

---

## Referencias Visuales (Secciones de la Página)

| Sección | Qué se toma | Qué NO se toma |
|---------|-------------|-----------------|
| **Hero / Landing** | Fondo blanco limpio, badge overline dorado (#F2D162) con texto uppercase verde bosque, headline sans-serif grande con parte del texto en color salmón (#CD796C), subtexto descriptivo con links subrayados, grupo de 3 CTAs pill (verde primario, salmón secundario, outline terciario), overline inferior en verde bosque uppercase | — |
| **Sección de visión (verde bosque)** | Fondo verde bosque (#1B4332) full-bleed, título centrado con frase de acento en salmón, lista de beneficios con flechas "→" en dorado, texto blanco | — |
| **Sección educativa (verde suave)** | Fondo verde suave (#EAF2EE), headline grande centrado con frase de acento en salmón, párrafo explicativo centrado con ancho de lectura limitado | — |
| **Síntomas / Accordion** | Fondo blanco, headline centrado con acento salmón, accordion items con checkmarks verdes, bordes sutiles, expand/collapse | — |
| **Fases del método (Timeline)** | Cards de fase sobre fondo ligeramente verde (#EBF5EA), layout alternado izquierda/derecha con timeline vertical de puntos salmón, cada card: título bold "Fase N: NOMBRE", semanas en caption, subtítulo en salmón, texto descriptivo con bold en frases clave y underline en links | — |
| **Banner CTA intermedio** | Fondo verde bosque (#264233) con border-radius 16px, texto blanco centrado con frase clave en underline, botón salmón pill centrado | — |
| **Timeline de resultados** | Fondo blanco, overline uppercase verde, headline con acento salmón, fases colapsables tipo accordion con fondo verde claro | — |
| **Sección de cita emocional** | Fondo verde bosque (#1B4332) full-bleed, overline dorado, cita grande centrada en sans-serif (NO serif), subtexto debajo | — |
| **Testimonios** | Fondo blanco, headline centrado, grid 3 columnas de cards blancas con borde sutil, cada card: avatar circular + iniciales + rol muted, texto citado, frase de resultado en salmón debajo | — |
| **Fundadores** | Fondo blanco, headline centrado, grid 2 columnas, cada card: foto circular grande centrada, nombre bold sans, rol en salmón, bio centrada en texto regular | — |
| **Stats (barra de impacto)** | Fondo verde suave (#ECF2EE), grid 4 columnas equidistantes, números grandes en salmón/terracota, labels uppercase debajo en verde bosque | — |
| **Garantía** | Fondo blanco, icono de checkmark centrado, headline grande centrado con fade-in, párrafo descriptivo con bold en frases clave, texto de confianza | — |
| **Pricing (3 planes)** | Fondo blanco, grid 3 columnas, card central con badge "MÁS POPULAR", cada card: nombre del plan + precio + botón salmón pill + lista de features con checkmarks verdes, borde sutil, border-radius 16px | — |
| **Coste de inacción (terracota)** | Fondo terracota/arcilla (#C0392B aprox.) full-bleed, headline blanco centrado con "NO" en itálica bold (sans), lista con flechas doradas + títulos bold + descripciones, frase final con acento dorado | — |
| **Filtro (para ti / no para ti)** | Fondo blanco, headline centrado, grid 2 columnas: izquierda con checkmarks verdes + textos, derecha con X rojas + textos | — |
| **Semana 1 (Tu Primer Paso)** | Fondo beige cálido (#FBF8F3), overline salmón, headline grande, precio display, lista de beneficios con checkmarks, botón verde pill, texto de garantía debajo | — |
| **FAQ** | Fondo beige (#F7F5F0), headline centrado, accordion items con fondo blanco, bordes sutiles, expand/collapse con "+" | — |
| **CTA final (verde bosque)** | Fondo verde bosque (#264233) full-bleed, headline dorado (#F2D162) grande centrado, subtexto blanco bold, 2 CTAs (salmón + outline blanco), texto de urgencia/escasez, fecha de próxima edición | — |
| **Footer** | Fondo verde bosque oscuro (#264233), copyright izquierda, links legales derecha en línea horizontal, minimalismo extremo | — |

---

## Paleta de Colores

### Colores Base

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg-primary` | `#FFFFFF` | Fondo principal de la aplicación (blanco puro limpio) |
| `--color-bg-secondary` | `#EAF2EE` | Fondo de secciones educativas, áreas de descanso visual verde suave |
| `--color-bg-tertiary` | `#FFFFFF` | Fondo de cards principales, inputs, elementos elevados |
| `--color-bg-warm` | `#FBF8F3` | Fondo de secciones cálidas (Semana 1, Tu Primer Paso) |
| `--color-bg-warm-alt` | `#F7F5F0` | Fondo de FAQ y secciones de contenido beige |
| `--color-bg-elevated` | `#F0F3F8` | Fondo de cards de síntomas, hover, tooltips |
| `--color-bg-green-soft` | `#EBF5EA` | Fondo de cards de fases del método, timeline |
| `--color-bg-dark` | `#264233` | Footer, banners CTA, secciones de impacto (verde bosque) |
| `--color-bg-dark-deep` | `#1B4332` | Secciones de visión y citas emocionales (verde bosque profundo) |

### Colores de Texto

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-text-primary` | `#212426` | Texto principal (gris oscuro casi negro, máxima legibilidad) |
| `--color-text-secondary` | `#2D2D2D` | Texto de cuerpo, descripciones, párrafos |
| `--color-text-tertiary` | `#878E92` | Placeholders, texto deshabilitado, captions, metadata |
| `--color-text-muted` | `#555555` | Texto muted de cards, roles, semanas |
| `--color-text-inverse` | `#FFFFFF` | Texto sobre fondos oscuros (footer, botones, stats) |
| `--color-text-inverse-muted` | `rgba(255,255,255,0.65)` | Texto secundario sobre fondo oscuro verde |
| `--color-text-inverse-faded` | `rgba(255,255,255,0.5)` | Copyright, metadata sobre fondo oscuro |

### Color de Acento (Salmón / Terracota)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-accent-warm` | `#CD796C` | Acento principal cálido: botones secundarios, frases destacadas en headlines, roles, resultados de testimonios |
| `--color-accent-warm-hover` | `#DA7468` | Hover del acento cálido (más luminoso) |
| `--color-accent-warm-subtle` | `rgba(205,121,108,0.15)` | Fondo sutil de highlights (15% opacidad) |
| `--color-accent-warm-muted` | `#CC796C` | Estado pressed, bordes activos |

### Color Primario (Verde Bosque)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-primary` | `#264233` | CTA primario, footer, nav links, overlines, badges de categoría |
| `--color-primary-deep` | `#1B4332` | Secciones full-bleed de visión, citas emocionales (más profundo) |
| `--color-primary-hover` | `#1E352A` | Hover del verde primario (más oscuro) |
| `--color-primary-light` | `#3A5A47` | Variante más clara para estados intermedios |
| `--color-primary-subtle` | `rgba(38,66,51,0.10)` | Bordes sutiles, separadores (10% opacidad) |

### Color de Energía (Dorado / Amarillo)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-energy` | `#F2D162` | Badge overline del hero, flechas en secciones oscuras, acentos de energía |
| `--color-energy-hover` | `#EDD274` | Hover del dorado |
| `--color-energy-text` | `#212426` | Texto sobre fondo dorado (siempre oscuro para contraste) |

### Color de Urgencia (Terracota / Arcilla)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-urgency` | `#C0392B` | Fondo de sección "coste de inacción", urgencia emocional |
| `--color-urgency-muted` | `rgba(192,57,43,0.85)` | Variante con overlay para legibilidad de texto |

### Colores Funcionales

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-success` | `#489F2E` | Checkmarks de listas positivas ("esto es para ti"), confirmaciones |
| `--color-error` | `#8B0000` | Cruces en listas negativas ("esto NO es para ti"), errores |
| `--color-warning` | `#D4A017` | Alertas, valores que requieren atención |
| `--color-info` | `#4A8DB7` | Información contextual, tooltips |

### Reglas de Uso de Color

- **El blanco `#FFFFFF` es el fondo principal.** La limpieza del blanco puro transmite rigor científico. Las secciones de color (verde, terracota, beige) crean contraste por bloques.
- **El verde bosque (`--color-primary` / `--color-primary-deep`) es la identidad de marca.** Se usa para CTAs principales, footer, secciones de visión, banners CTA, overlines y la nav.
- **El salmón (`--color-accent-warm`) es la calidez humana.** Se reserva para frases emocionales destacadas en headlines, botones secundarios, roles/cargos y resultados en testimonios. Nunca como fondo de sección completa.
- **El dorado (`--color-energy`) se usa solo para badges, flechas y overlines puntuales.** Transmite energía y optimismo sin saturar.
- **El terracota (`--color-urgency`) se usa exclusivamente para la sección de "coste de inacción".** Un solo uso en la página para máximo impacto emocional.
- **Contraste mínimo WCAG AA:** texto primario sobre fondo blanco = ratio ≥ 7:1. Texto sobre verde oscuro siempre en blanco.
- **Bordes:** usar `--color-primary-subtle` (rgba(38,66,51,0.10-0.15)). Nunca bordes oscuros de alto contraste.
- **Secciones a ancho completo con color:** verde bosque para visión/CTA/footer, terracota para urgencia, beige para Semana 1/FAQ. Siempre full-bleed.

---

## Tipografía

### Fuentes

| Rol | Fuente | Fallback | Peso |
|-----|--------|----------|------|
| **Headlines / Display** | Host Grotesk | system-ui, sans-serif | 600 (SemiBold), 700 (Bold) |
| **Cuerpo de texto** | Host Grotesk | system-ui, sans-serif | 400 (Regular), 500 (Medium) |
| **Frases de acento** | Host Grotesk | system-ui, sans-serif | 400 (Regular) — diferenciadas solo por color `--color-accent-warm` |
| **Datos / Métricas** | Host Grotesk | system-ui, sans-serif | 700 (Bold) |
| **Subtítulos / UI** | Host Grotesk | system-ui, sans-serif | 500 (Medium), 600 (SemiBold) |
| **Labels / Nav** | Host Grotesk | system-ui, sans-serif | 400 (Regular), 500 (Medium) |
| **Overlines** | Host Grotesk | system-ui, sans-serif | 500 (Medium) |

> **Decisión tipográfica:** Sistema mono-familia 100% sans-serif. Toda la interfaz usa Host Grotesk — una sans-serif humanista que transmite modernidad, accesibilidad y rigor sin frialdad geométrica. Las frases emocionales clave se diferencian exclusivamente por color (salmón `--color-accent-warm`) y, cuando corresponde, por peso (Regular dentro de un headline Bold). Este contraste cromático crea momentos de calidez sin recurrir a serif ni itálica. Host Grotesk disponible en Google Fonts con soporte completo para caracteres latinos extendidos.

### Escala Tipográfica

Base: `16px` (1rem). Ratio: `1.250` (Major Third).

| Token | Tamaño | Line Height | Letter Spacing | Uso |
|-------|--------|-------------|----------------|-----|
| `--text-display` | 3.5rem (56px) | 1.05 | -0.02em | Hero headlines, precios grandes (97€), números de impacto |
| `--text-h1` | 2.5rem (40px) | 1.15 | -0.015em | Títulos de sección principales |
| `--text-h2` | 2rem (32px) | 1.2 | -0.01em | Títulos de subsección, citas emocionales |
| `--text-h3` | 1.5rem (24px) | 1.3 | -0.005em | Títulos de card, nombres de fase |
| `--text-h4` | 1.25rem (20px) | 1.35 | 0 | Labels prominentes, nombres de fundadores |
| `--text-body` | 1rem (16px) | 1.6 | 0 | Texto principal |
| `--text-body-sm` | 0.9375rem (15px) | 1.5 | 0.005em | Texto de botones, captions, roles |
| `--text-caption` | 0.75rem (12px) | 1.4 | 0.02em | Metadata, timestamps, badges, semanas |
| `--text-overline` | 0.75rem (12px) | 1.4 | 0.15em | Labels superiores en UPPERCASE |

### Reglas Tipográficas

- **Headlines:** siempre Host Grotesk SemiBold (600) o Bold (700). Tamaño generoso que domina la sección.
- **Frases de acento:** se insertan dentro del headline. Siempre en `--color-accent-warm` (salmón) con peso Regular (400) o SemiBold (600). Solo una frase por headline. El contraste cromático (oscuro → salmón) crea tensión visual controlada sin necesidad de cambio de familia tipográfica.
- **Cuerpo y UI:** Host Grotesk Regular (400) para texto largo, Medium (500) para labels, botones y navegación.
- **Bold dentro de párrafos:** se usa estratégicamente para resaltar frases clave dentro del texto de cuerpo. Frecuente en descripciones de fases y beneficios.
- **Underline como recurso:** links y frases con underline (text-decoration) para dar énfasis dentro de párrafos sin usar itálica.
- **NUNCA usar itálica serif.** El acento emocional se logra siempre con color salmón + cambio de peso.
- **Overlines:** siempre Host Grotesk Medium uppercase + tracking amplio (`0.15em`). Color `--color-primary` (verde bosque).
- **Números de impacto en stats:** Host Grotesk Bold `--text-display` sobre fondo verde suave. Color salmón/terracota.
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
| `--space-6` | 24px | Padding lateral móvil, padding de cards |
| `--space-8` | 32px | Separación entre bloques dentro de sección |
| `--space-10` | 40px | Padding lateral desktop |
| `--space-12` | 48px | Separación entre secciones menores |
| `--space-16` | 64px | Padding vertical de secciones principales |
| `--space-20` | 80px | Padding vertical de sección hero |
| `--space-24` | 96px | Padding-top del hero (bajo nav fija) |

### Reglas de Espaciado

- **Generosidad extrema:** el espacio vacío es la señal principal de profesionalismo y calma. Más espacio del que parece necesario. Esta página en particular usa espaciado muy generoso entre secciones.
- **Secciones:** mínimo `--space-16` entre secciones principales. Las secciones con fondo de color usan padding vertical `--space-16` o superior.
- **Cards:** padding interno `--space-6`. Gap entre cards `--space-5`.
- **Hero:** padding vertical `--space-20` mínimo, con `--space-24` arriba para compensar nav fija.
- **Consistencia vertical:** headline → `--space-4` → párrafo → `--space-8` → siguiente bloque.
- **Secciones de transición:** muchas secciones usan espaciado extra (>80px) antes y después para crear pausas de lectura dramáticas, especialmente antes de secciones CTA y después de secciones educativas.

---

## Layout y Grid

### Contenedor Principal

```
Max-width: 1280px
Padding lateral: 24px (móvil), 40px (tablet), 64px (desktop)
Centrado horizontal: margin 0 auto
```

### Grid

```
Desktop: 12 columnas, gap 24px
Tablet: 6 columnas, gap 20px
Móvil: 4 columnas, gap 16px
```

### Patrones de Layout

- **Hero:** texto a la izquierda (60%) + espacio visual a la derecha (40%). Badge dorado overline + headline con acento salmón + párrafo descriptivo con links subrayados + grupo de 3 CTAs pill en fila + overline inferior verde.
- **Sección de visión (verde bosque):** fondo full-bleed verde profundo. Headline centrado con acento salmón. Lista de beneficios con "→" dorado. Texto blanco.
- **Sección educativa (verde suave):** fondo verde suave full-bleed. Headline grande centrado con acento salmón. Párrafo con ancho de lectura limitado (~42rem).
- **Síntomas (accordion):** centrado. Headline con acento salmón. Items accordion con checkmark verde + texto + icono expand.
- **Fases del método (timeline):** layout alternado izquierda/derecha. Línea vertical con puntos salmón. Cards sobre fondo verde suave con título, semanas, subtítulo salmón, texto descriptivo.
- **Banner CTA:** fondo verde bosque con border-radius 16px dentro del contenedor. Texto centrado. Botón salmón pill.
- **Testimonios:** grid 3 columnas. Cards blancas con borde sutil, avatar circular, cita, resultado salmón.
- **Fundadores:** grid 2 columnas centradas. Cada card: foto circular grande + nombre bold + rol salmón + bio centrada.
- **Stats:** fondo verde suave. Grid 4 columnas equidistantes. Cada stat: número grande salmón + label uppercase verde debajo.
- **Pricing:** grid 3 columnas. Card central destacada con badge "MÁS POPULAR". Cada card: plan + precio + CTA + lista de features.
- **Coste de inacción:** fondo terracota full-bleed. Headline blanco. Lista con flechas doradas, títulos bold, descripciones.
- **Filtro (para ti / no para ti):** grid 2 columnas. Izquierda: checkmarks verdes. Derecha: X rojas.
- **Semana 1:** fondo beige cálido. Layout centrado. Precio display. Lista con checkmarks. CTA verde pill.
- **FAQ:** fondo beige. Accordion items con fondo blanco.
- **CTA final:** fondo verde bosque full-bleed. Headline dorado grande. 2 CTAs. Texto de urgencia.
- **Footer:** fondo verde bosque full-bleed. Copyright izquierda + links legales derecha. Mínimo absoluto.

---

## Componentes

### Botones

```
Primario (Verde Bosque):
  Background: --color-primary (#264233)
  Color: --color-text-inverse (#FFFFFF)
  Border: none
  Border-radius: 9999px (pill)
  Padding: 16px 32px
  Font: Host Grotesk Medium 500, --text-body-sm (15px)
  Hover: --color-primary-hover, scale(1.02)

Secundario (Salmón):
  Background: --color-accent-warm (#CD796C)
  Color: --color-text-inverse (#FFFFFF)
  Border: none
  Border-radius: 9999px (pill)
  Padding: 16px 32px
  Font: Host Grotesk Medium 500, --text-body-sm (15px)
  Hover: --color-accent-warm-hover (#DA7468)

Terciario (Outline verde):
  Background: transparent
  Color: --color-primary (#264233)
  Border: 1px solid --color-primary-subtle
  Border-radius: 9999px (pill)
  Padding: 16px 32px
  Font: Host Grotesk Medium 500, --text-body-sm (15px)
  Hover: --color-bg-elevated
  Puede incluir icono de chat (💬) a la izquierda
```

- **Todos los botones son pill** (border-radius máximo). Nunca esquinas rectas.
- **Máximo 3 CTAs por sección visible.** El primario (verde) siempre a la izquierda, seguido del secundario (salmón) y luego el terciario (outline).
- **Jerarquía estricta:** verde = acción principal, salmón = acción alternativa, outline = acción exploratoria.

### Cards

```
Card base:
  Background: --color-bg-tertiary (#FFFFFF)
  Border: 1px solid rgba(38, 66, 51, 0.10)
  Border-radius: 16px
  Padding: --space-6
  Overflow: hidden

Card de fase (timeline):
  Background: --color-bg-green-soft (#EBF5EA)
  Border: none
  Border-radius: 16px
  Padding: --space-6
  Título: Host Grotesk Bold, "Fase N:" regular + "NOMBRE" uppercase bold
  Semanas: --text-caption, --color-text-muted
  Subtítulo: --color-accent-warm, --text-body
  Texto: --color-text-secondary con bold en frases clave

Card de testimonio:
  Background: --color-bg-tertiary (#FFFFFF)
  Border: 1px solid rgba(38, 66, 51, 0.10)
  Border-radius: 16px
  Padding: --space-6
  Avatar: circular 48px con iniciales o emoji
  Nombre: Host Grotesk SemiBold, --text-body
  Rol: --color-text-muted, --text-caption
  Cita: --color-text-secondary, --text-body
  Resultado: --color-accent-warm, --text-body-sm, bold

Card de fundador:
  Background: --color-bg-tertiary (#FFFFFF)
  Border: 1px solid rgba(38, 66, 51, 0.08)
  Border-radius: 16px
  Padding: --space-8
  Layout: centrado vertical
  Foto: circular 160px, centrada
  Nombre: Host Grotesk SemiBold, --text-h4
  Rol: --color-accent-warm, --text-body-sm
  Bio: --color-text-secondary, --text-body, text-align center

Card de pricing:
  Background: --color-bg-tertiary (#FFFFFF)
  Border: 1px solid rgba(38, 66, 51, 0.15)
  Border-radius: 16px
  Padding: --space-6
  Nombre plan: Host Grotesk SemiBold, --text-h3
  Precio: Host Grotesk Bold, --text-h1
  Cuotas: --color-text-muted, --text-body-sm
  CTA: botón salmón pill a ancho completo
  Features: lista con checkmarks verdes, --text-body
  Badge "MÁS POPULAR": fondo dorado, texto oscuro, uppercase, centrado arriba de la card
```

- **Border-radius 16px** en todas las cards. Consistencia absoluta.
- **Sin sombra** por defecto. Los bordes sutiles con opacidad baja crean separación suficiente sobre fondo blanco.
- **Hover sutil:** translate-y -2px + sombra suave (0 4px 12px rgba(38,66,51,0.08)).

### Accordion

```
Accordion item:
  Background: --color-bg-tertiary (#FFFFFF) o fondo heredado
  Border: 1px solid rgba(38, 66, 51, 0.10)
  Border-radius: 12px
  Padding: --space-4 --space-6
  Font: Host Grotesk Medium 500, --text-body
  Color: --color-text-primary
  Icono: "+" a la derecha, rotación 45° al expandir
  Hover: fondo --color-bg-elevated
  Transición: max-height 300ms ease

Accordion de síntomas:
  Mismo estilo + checkmark verde a la izquierda
  Texto en --color-accent-warm (salmón) para mayor impacto emocional
```

### Badges / Pills

```
Badge overline (dorado):
  Background: --color-energy (#F2D162)
  Color: --color-primary (#264233)
  Border-radius: 9999px
  Padding: 8px 20px
  Font: Host Grotesk Medium 500, --text-overline
  Text-transform: uppercase
  Letter-spacing: 0.15em
  Uso: "PROGRAMA DE TRANSFORMACIÓN — MÉTODO L.I.B.E.R.A.® TAG"

Badge "MÁS POPULAR":
  Background: --color-energy (#F2D162)
  Color: --color-text-primary (#212426)
  Border-radius: 9999px
  Padding: 6px 16px
  Font: Host Grotesk Medium 500, --text-caption
  Text-transform: uppercase

Badge de idioma/moneda:
  Background: --color-primary (#264233) para activo, transparent para inactivo
  Color: --color-text-inverse para activo, --color-text-primary para inactivo
  Border-radius: 8px
  Padding: 4px 12px
  Font: Host Grotesk Medium 500, --text-caption
  Uso: selector EUR/MXN en nav
```

### Navegación

```
Nav bar:
  Background: rgba(255, 255, 255, 0.9) (con backdrop-blur)
  Border-bottom: 1px solid rgba(38, 66, 51, 0.10)
  Height: ~58px
  Padding: 0 --space-6
  Position: fixed, top: 0, z-index: 50

Logo:
  Font: Host Grotesk SemiBold con icono de sol/estrella a la izquierda
  Color: --color-text-primary (#212426)
  Tamaño: ~20px
  Incluye símbolo ™

Acciones derecha:
  Selector de moneda: badges EUR/MXN
  Gap: --space-2
```

### Footer

```
Background: --color-bg-dark (#264233)
Padding: --space-4 --space-6

Layout: flex justify-between
  Izquierda: copyright
  Derecha: links legales en línea horizontal

Links legales:
  Font: Host Grotesk Regular 400, --text-body-sm
  Color: --color-text-inverse (#FFFFFF)
  Opacity: 0.7
  Hover: opacity 1
  Separador: espacio entre links (no pipes)

Copyright:
  Color: --color-text-inverse
  Opacity: 0.5
  Font: --text-body-sm
```

### Chat Flotante

```
Botón circular fijo:
  Position: fixed, bottom: 24px, right: 24px
  Background: --color-accent-warm (#CD796C)
  Width: 56px, Height: 56px
  Border-radius: 9999px (circular)
  Icono: chat bubble blanco, centrado
  Sombra: 0 4px 16px rgba(0,0,0,0.15)
  Hover: --color-accent-warm-hover, scale(1.05)
  Z-index: 50
```

---

## Secciones de Color Full-Bleed

El diseño alterna secciones blancas con bloques de color que rompen el ritmo y crean impacto:

- **Verde bosque profundo (#1B4332):** Secciones de visión ("Imagina cómo sería tu vida") y citas emocionales. Transmite profundidad, naturaleza, seriedad.
- **Verde bosque (#264233):** Banners CTA intermedios, CTA final y footer. Transmite solidez y acción.
- **Verde suave (#EAF2EE / #EBF5EA):** Secciones educativas y cards de fases. Transmite calma, ciencia, naturaleza sutil.
- **Beige cálido (#FBF8F3 / #F7F5F0):** Semana 1 y FAQ. Transmite calidez, accesibilidad, cercanía.
- **Terracota (#C0392B aprox.):** Sección de "coste de inacción". Uso único. Transmite urgencia emocional, consecuencias.
- **Dorado (#F2D162):** Solo en badges y elementos puntuales. Nunca como fondo de sección completa.
- **Blanco (#FFFFFF):** Todas las secciones de contenido principal. Base neutra que permite que los bloques de color destaquen.

**Regla:** las secciones de color siempre son full-bleed (ancho completo del viewport). El contenido dentro respeta el max-width de 1280px. Excepción: el banner CTA intermedio usa border-radius 16px dentro del contenedor.

---

## Iconografía

- **Estilo:** outline/stroke, peso 1.5px. Nunca filled/solid.
- **Tamaños:** 16px (inline con texto), 20px (en botones), 24px (standalone), 56px (icono de chat flotante)
- **Color:** heredan el color del texto padre por defecto.
- **Flechas "→":** usadas como bullet points en secciones oscuras. Color dorado (`--color-energy`).
- **Checkmarks "✓":** usadas en listas de beneficios y pricing. Color verde (`--color-success`).
- **Cruces "✕":** usadas en listas negativas ("esto NO es para ti"). Color rojo (`--color-error`).
- **Chat bubble:** icono del botón flotante. Blanco sobre salmón.
- **Selector de moneda:** badges compactos con bandera emoji + texto, sin iconos.
- **Nunca** usar iconos decorativos sin función.
- **Sin ilustraciones:** la página no usa ilustraciones vectoriales ni cartoon. Todo el peso visual recae en tipografía, color y fotografía.

---

## Imágenes y Media

- **Fotos de personas (fundadores):** retratos profesionales, fondo neutro, iluminación natural y cálida.
- **Border-radius:** 9999px (circular) para avatares de fundadores y testimonios. 16px para imágenes en cards.
- **Aspect ratios:** 1:1 para avatares circulares.
- **Avatares de fundadores:** border-radius 9999px (circular), tamaño ~160px, centrados en card, sin borde visible.
- **Avatares de testimonios:** border-radius 9999px (circular), tamaño ~48px, con iniciales o emoji como fallback.
- **Sin ilustraciones vectoriales/cartoon.** La página se apoya exclusivamente en fotografía de personas reales, tipografía expresiva y bloques de color.
- **Overlay:** no se usan overlays sobre imágenes. Las fotos van siempre en su contexto sin texto superpuesto.
- **Gradientes:** no se usan gradientes decorativos. Los bloques de color son sólidos y planos.

---

## Animación y Transiciones

- **Duración base:** 200ms para hover/focus, 300ms para apariciones, 400ms para transiciones de layout.
- **Easing:** `ease` para la mayoría. `cubic-bezier(0.16, 1, 0.3, 1)` para entradas (ease-out expresivo).
- **Scroll animations:** fade-in + translate-y sutil (de 20px abajo). Aplicado con delays escalonados en secciones y cards. La página hace un uso intensivo de reveal-on-scroll, especialmente en secciones de impacto (garantía, citas, stats).
- **Cards hover:** translate-y -2px + aparición de sombra suave. 200ms ease.
- **Nav:** backdrop-blur con transición suave al hacer scroll.
- **Accordion:** max-height transition 300ms ease + rotación de icono "+".
- **Timeline puntos:** los puntos salmón del timeline pueden tener pulse animation sutil.
- **Nunca:** animaciones que bloqueen interacción, bounces, parallax agresivo, ni efectos que distraigan del contenido.
- **Principio:** la calma visual es prioritaria. Las animaciones deben sentirse como respiración, no como excitación.

---

## Responsive

### Breakpoints

| Nombre | Valor | Comportamiento |
|--------|-------|----------------|
| `mobile` | < 640px | Stack vertical, tipografía reducida 1 nivel, CTAs apilados |
| `tablet` | 640-1024px | Grid 2 columnas, tipografía intermedia |
| `desktop` | > 1024px | Layout completo, grid hasta 4 columnas en stats |

### Reglas Responsive

- **Tipografía:** en móvil, `--text-display` baja a `2.5rem`, `--text-h1` a `2rem`. El resto mantiene escala.
- **Cards:** en móvil, siempre stack vertical (1 columna). En tablet, grid 2 columnas.
- **Hero:** en móvil, texto centrado o stack completo. CTAs se apilan verticalmente, cada uno a ancho completo. Padding reducido a `--space-12`.
- **Stats:** en móvil, grid 2×2. En tablet, 4 columnas.
- **Pricing:** en móvil, stack vertical (1 columna). Card "MÁS POPULAR" primero.
- **Timeline de fases:** en móvil, stack vertical sin alternancia izquierda/derecha. Línea vertical a la izquierda.
- **Testimonios:** en móvil, 1 columna con scroll horizontal opcional.
- **Filtro (para ti / no para ti):** en móvil, stack vertical.
- **Footer:** en móvil, stack vertical centrado. Copyright arriba, links debajo.
- **Imágenes:** todas con `width: 100%` y `height: auto`. Nunca dimensiones fijas.
- **Touch targets:** mínimo 44px × 44px para todos los elementos interactivos en móvil.
- **Chat flotante:** siempre visible en esquina inferior derecha, mismo tamaño en todas las resoluciones.

---

## Modo Oscuro (Futuro)

El sistema está diseñado light-first. Si se implementa modo oscuro:

| Token light | Equivalente dark |
|-------------|------------------|
| `--color-bg-primary` (#FFFFFF) | `#1A1A1A` |
| `--color-bg-secondary` (#EAF2EE) | `#1E2A24` |
| `--color-bg-tertiary` (#FFFFFF) | `#2E2E2E` |
| `--color-bg-warm` (#FBF8F3) | `#2A2520` |
| `--color-text-primary` (#212426) | `#F5F5F5` |
| `--color-text-secondary` (#2D2D2D) | `#B0B0B0` |
| `--color-primary` (#264233) | `#3A7A55` (más luminoso para contraste) |
| `--color-accent-warm` (#CD796C) | `#E08B7D` (más luminoso) |
| `--color-energy` (#F2D162) | `#E5BE40` (ligeramente más apagado) |

---

## Checklist de Validación Visual

Antes de aprobar cualquier pantalla, verificar:

- [ ] ¿Los colores vienen exclusivamente de los tokens definidos aquí?
- [ ] ¿La jerarquía tipográfica es clara? (headline sans bold → acento salmón sans → cuerpo sans → caption)
- [ ] ¿No hay ninguna fuente serif ni itálica serif en toda la página?
- [ ] ¿No hay ilustraciones vectoriales ni cartoon?
- [ ] ¿El espaciado entre secciones es generoso y transmite calma profesional?
- [ ] ¿Los elementos interactivos tienen estados hover/focus/active definidos?
- [ ] ¿El contraste cumple WCAG AA mínimo?
- [ ] ¿Funciona en móvil sin scroll horizontal?
- [ ] ¿Las cards tienen border-radius 16px y bordes sutiles?
- [ ] ¿No hay sombras agresivas, gradientes vivos, ni bordes de alto contraste?
- [ ] ¿El verde bosque se usa como identidad principal (CTAs, footer, secciones de visión, overlines)?
- [ ] ¿El salmón se usa solo para acentos emocionales (frases en headlines, botón secundario, roles, resultados)?
- [ ] ¿El dorado se usa puntualmente (badges, flechas, overlines)?
- [ ] ¿Los botones son todos pill (border-radius máximo)?
- [ ] ¿Las secciones de color son full-bleed con contenido centrado?
- [ ] ¿El footer es minimalista con copyright + links legales?
- [ ] ¿Las frases de acento en salmón aparecen solo dentro de headlines, máximo una por sección?
- [ ] ¿Las fotos son exclusivamente de personas reales, sin ilustraciones?
