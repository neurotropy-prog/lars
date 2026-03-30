# PLAN: Migración al Nuevo Sistema de Diseño

**Prioridad:** Crítica — afecta a TODOS los componentes
**Dependencia:** Se ejecuta ANTES del plan de mejora de landing (PLAN_LANDING_EXPERIENCE depende de este)
**Estimación:** 2-3 sesiones
**Riesgo:** Alto — cambio visual completo. Requiere revisión en cada página después.

---

## RESUMEN DEL CAMBIO

El proyecto fue construido con un tema **oscuro azulado** (bg: #0a252c, accent: lavanda #c6c8ee). El nuevo DESIGN.md define un tema **cálido crema-editorial** (bg: #FFFBEF, accent: terracota #B45A32, CTA: lima #F5F564). Es un cambio radical que toca cada archivo visual del proyecto.

### Tabla comparativa — Lo que cambia

| Aspecto | ANTES (implementado) | DESPUÉS (nuevo DESIGN.md) |
|---------|---------------------|--------------------------|
| **Fondo principal** | `#0a252c` (azul oscuro) | `#FFFBEF` (crema cálido) |
| **Fondo secundario** | `#0f3037` | `#F9F1DE` |
| **Fondo tertiary** | `#0c2a48` | `#FFFFFF` |
| **Texto principal** | `#F5F5F0` (claro sobre oscuro) | `#1E1310` (oscuro sobre claro) |
| **Texto secundario** | `#A8B0AC` | `#4B413C` |
| **Texto terciario** | `#6B7572` | `#8A7E75` |
| **Acento** | `#c6c8ee` (lavanda) | `#B45A32` (terracota) |
| **CTA** | Lavanda sobre oscuro | `#F5F564` (lima) — texto `#1E1310` |
| **Font headlines** | Plus Jakarta Sans (600/700) | **Lora** (400/700) — serif editorial |
| **Font body** | Inter (400/500) | Inter (400/500) — SIN CAMBIO |
| **Font UI** | Inter Tight (500) | Inter (500/600) — simplificación |
| **Font SHOCK** | Cormorant Garamond italic | Lora italic (o mantener Cormorant — decidir) |
| **Border-radius cards** | 12-16px | **20px** mínimo |
| **Bordes** | rgba(255,255,255,0.06-0.10) | rgba(30,19,16,0.06-0.08) |
| **Sombras** | Glow lavanda rgba(198,200,238,0.1) | **Sin sombra por defecto** — hover: 0 4px 12px rgba(30,19,16,0.06) |
| **Botón primario** | Lavanda pill | **Lima pill** `#F5F564` |
| **Botón secundario** | Ghost/outline claro | **Dark pill** `#1E1310` texto `#FFFBEF` |
| **Footer** | Borde sutil, mismo fondo | **Fondo oscuro** `#1E130F` con headings dorado `#EBCDB9` |
| **Testimonios** | Blockquotes con borde lavanda | **Cards con fondos pastel** (lavanda, crema, lima) + comillas decorativas |
| **Formas orgánicas** | No existen | **Blobs peach** `#FFCA9E` en secciones emocionales |

---

## ARCHIVOS AFECTADOS

### Críticos (tokens globales)

| Archivo | Impacto |
|---------|---------|
| `src/app/globals.css` | **TODOS los tokens CSS** — colores, fuentes, bordes, easings, zonas emocionales |
| `src/app/layout.tsx` | Imports de fuentes: añadir **Lora**, posiblemente eliminar Plus Jakarta Sans e Inter Tight |

### Componentes UI (usan tokens directamente)

| Archivo | Qué cambia |
|---------|-----------|
| `src/components/ui/Button.tsx` | Colores, hover states. Primario → lima. Secundario → dark pill |
| `src/components/ui/Card.tsx` | Border-radius → 20px. Fondo → #FFFFFF. Sin sombra base, hover sutil |
| `src/components/ui/Badge.tsx` | Colores de fondo/texto. Pill oscuro para "available" |
| `src/components/ui/Input.tsx` | Fondo blanco, bordes cálidos, focus → terracota |
| `src/components/ui/MicroEspejo.tsx` | Border-left → terracota. Fondo → crema. Texto oscuro |
| `src/components/ui/Bisagra.tsx` | Gradiente y border → cálidos. Score colors → ajustar semáforo |
| `src/components/ui/Counter.tsx` | Color de texto probablemente hereda — verificar |
| `src/components/ui/ProgressBar.tsx` | Track → crema, fill → terracota o gradiente |
| `src/components/ui/Separator.tsx` | Border color → rgba(30,19,16,0.08) |
| `src/components/ui/TypeWriter.tsx` | Cursor → terracota |

### Landing

| Archivo | Qué cambia |
|---------|-----------|
| `src/components/landing/HeroSection.tsx` | Fondo crema. Texto oscuro. Font headline → Lora. SHOCK → Lora italic o Cormorant |
| `src/components/landing/P1Cards.tsx` | Cards blancas con borde cálido. Selección → terracota |
| `src/components/landing/BelowTheFold.tsx` | Fondo → #F9F1DE. Gradiente de transición ajustado |
| `src/components/landing/MirrorSection.tsx` | Texto oscuro sobre crema |
| `src/components/landing/TensionSection.tsx` | Cards blancas con borde sutil cálido. Hover → sombra cálida |
| `src/components/landing/SocialProofSection.tsx` | **Rediseño completo** → cards con fondos pastel (lavanda, crema, lima) |
| `src/components/landing/ReliefSection.tsx` | Texto oscuro. CTA → lima. Footer → oscuro cálido |

### Gateway

| Archivo | Qué cambia |
|---------|-----------|
| `src/components/gateway/ZoneWrapper.tsx` | 3 zonas emocionales → fondos cálidos |
| `src/components/gateway/SingleSelectStep.tsx` | Cards blancas, selección terracota |
| `src/components/gateway/MultiSelectStep.tsx` | Mismo que SingleSelect |
| `src/components/gateway/SlidersStep.tsx` | Track/fill colores. Thumb. Labels |
| `src/components/gateway/AnalyzingScreen.tsx` | Fondo, dots, texto |
| `src/components/gateway/BisagraSequence.tsx` | Colores de score, fondo, gradientes |
| `src/components/gateway/CompressedBisagra.tsx` | Mismos ajustes que BisagraSequence |
| `src/components/gateway/EmailCapture.tsx` | Input blanco, blur de fondo, botón lima |
| `src/components/gateway/GatewayConvert.tsx` | CTA lima, texto oscuro |
| `src/components/GatewayController.tsx` | Background colors en overlays, diálogo duplicado |
| `src/components/NervousSystemCanvas.tsx` | Colores del canvas neural → terracota al 20-30% |

### Mapa Vivo

| Archivo | Qué cambia |
|---------|-----------|
| `src/app/mapa/[hash]/MapaClient.tsx` | Fondo crema, texto oscuro, barras, CTA |
| `src/app/mapa/[hash]/sections/DimensionCard.tsx` | Card blanca, barra de colores ajustada |
| Todos los `Evolution*.tsx` | Fondos, textos, badges, bordes |

### Showcase

| Archivo | Qué cambia |
|---------|-----------|
| `src/app/showcase/page.tsx` | **Reescribir completo** — debe reflejar el nuevo design system |

### Otros

| Archivo | Qué cambia |
|---------|-----------|
| `src/app/pago/exito/SuccessClient.tsx` | Colores |
| `src/components/booking/BookingWidget.tsx` | Colores, botones |
| `src/components/booking/BookingConfirmed.tsx` | Colores |
| `src/lib/email.ts` | Templates HTML de emails — adaptar paleta |
| `src/lib/booking-emails.ts` | Mismo |
| `src/app/layout.tsx` metadata | themeColor → `#FFFBEF` |

---

## ORDEN DE EJECUCIÓN

### Fase A: Tokens y fuentes (fundación)

1. **globals.css** — Reemplazar TODOS los tokens `:root` con los valores del nuevo DESIGN.md
2. **layout.tsx** — Añadir import de **Lora** (Google Fonts). Evaluar si se mantiene Plus Jakarta Sans (el nuevo DESIGN.md no la menciona — usa Lora para headlines). Mantener Inter. Evaluar Inter Tight vs solo Inter para UI.
3. **globals.css zonas emocionales** — Reescribir `.zone-explore`, `.zone-reflect`, `.zone-reveal` con fondos cálidos
4. **globals.css bordes** — Actualizar `--border-subtle`, `--border-medium`, etc. a rgba oscuro
5. **globals.css animaciones** — Revisar colores en keyframes (glow lavanda → glow cálido)
6. **Verificar:** La app carga sin errores. Los textos son legibles (oscuro sobre claro).

### Fase B: Componentes UI base

7. **Button** — Primario lima, secundario dark, ghost outline cálido
8. **Card** — Border-radius 20px, fondo blanco, sin sombra base, hover lift + sombra suave
9. **Badge** — Pill oscuro (#4B413C) y outline cálido
10. **Input** — Fondo blanco, border cálido, focus terracota
11. **MicroEspejo** — Border terracota, fondo crema, texto oscuro
12. **Bisagra** — Gradiente cálido, score semáforo ajustado
13. **ProgressBar** — Track crema, fill terracota
14. **Separator** — Border cálido
15. **TypeWriter** — Cursor terracota
16. **Counter** — Verificar herencia de color
17. **Verificar:** Showcase muestra correctamente todos los componentes

### Fase C: Landing + Gateway

18. **HeroSection** — Fondo crema, headline Lora, SHOCK en Lora italic/Cormorant
19. **P1Cards** — Cards blancas, selección terracota
20. **BelowTheFold** — Fondo #F9F1DE, gradiente ajustado
21. **MirrorSection** — Texto oscuro
22. **TensionSection** — Cards blancas, hover cálido
23. **SocialProofSection** — Cards pastel (se completa en PLAN_LANDING_EXPERIENCE)
24. **ReliefSection** — CTA lima, footer oscuro cálido
25. **NervousSystemCanvas** — Colores terracota al 20-30%
26. **ZoneWrapper** — Zonas emocionales cálidas
27. **Gateway steps** — Todos los componentes de preguntas
28. **Analyzing/Bisagra/Email** — Colores cálidos
29. **Verificar:** Flujo completo landing → gateway → email funciona visualmente

### Fase D: Mapa Vivo + Páginas secundarias

30. **MapaClient** + sections — Fondos crema, barras, CTA
31. **SuccessClient** — Colores cálidos
32. **BookingWidget/Confirmed** — Colores cálidos
33. **Admin pages** — Al menos funcionales con nuevo tema
34. **Verificar:** Mapa vivo completo se ve correcto

### Fase E: Emails + Meta

35. **email.ts** — Templates HTML con nueva paleta
36. **booking-emails.ts** — Templates HTML con nueva paleta
37. **layout.tsx metadata** — themeColor, OG colors
38. **Verificar:** Emails enviados se ven correctos (Resend preview o test)

### Fase F: Showcase

39. **Reescribir showcase/page.tsx** — Reflejar todos los componentes con nuevo design system
40. **Añadir nuevos componentes al showcase** si se han creado (testimonial cards, header, etc.)

---

## DECISIONES A TOMAR ANTES DE EMPEZAR

### 1. Font SHOCK: ¿Lora italic o mantener Cormorant Garamond?

El nuevo DESIGN.md dice Lora para headlines. Pero el SHOCK original usa Cormorant Garamond italic, que tiene un carácter más editorial y dramático.

**Recomendación:** Mantener Cormorant Garamond para el SHOCK y overlines emocionales. Usar Lora para headlines de sección y display. Son compatibles estéticamente.

### 2. ¿Se mantiene Plus Jakarta Sans?

El nuevo DESIGN.md no la menciona. Lora la reemplaza para headlines.

**Recomendación:** Eliminar Plus Jakarta Sans. Lora la sustituye para display/h1/h2. Reduce peso de fuentes.

### 3. ¿Se mantiene Inter Tight?

DESIGN.md solo menciona Inter para cuerpo/UI.

**Recomendación:** Simplificar a solo Inter (con Medium/SemiBold para UI). Eliminar Inter Tight. Reduce complejidad.

### 4. Zonas emocionales del gateway — ¿cómo se adaptan?

Antes:
- ZONA 1 (exploración): `--color-bg-primary` (azul oscuro)
- ZONA 2 (reflexión): `--color-bg-secondary` (más oscuro)
- ZONA 3 (revelación): gradiente oscuro→oscuro

Ahora con tema claro, las zonas necesitan reinterpretarse:
- ZONA 1: `#FFFBEF` (crema principal) — aireado, espacio seguro
- ZONA 2: `#F9F1DE` (crema más cálido) — envolvente, íntimo
- ZONA 3: Gradiente de crema a blanco con acentos terracota suaves — revelación

**La diferencia entre zonas será más sutil** en tema claro. Se puede reforzar con:
- Bordes laterales terracota en ZONA 2
- Formas orgánicas peach de fondo en ZONA 3
- Cambios de tipografía (Lora más presente en zonas de reflexión)

### 5. NervousSystemCanvas — ¿se mantiene?

El canvas neural animado del fondo del hero era verde sobre oscuro (#4ADE80 al 30%). Sobre fondo crema, necesita ser terracota al 15-20% o un tratamiento completamente diferente.

**Recomendación:** Mantener pero adaptar a terracota al 10-15% opacity. Será muy sutil sobre crema — más como una marca de agua viva que como un elemento protagonista. Evaluar si necesita rediseño después de ver el resultado.

---

## RIESGOS Y MITIGACIONES

| Riesgo | Mitigación |
|--------|-----------|
| **Contraste insuficiente** texto sobre crema | Verificar WCAG AA en cada combinación. El marrón espresso #1E1310 sobre #FFFBEF tiene ratio ~15:1 — excelente |
| **Emails rotos** | Los emails son HTML hardcoded — buscar y reemplazar todos los hex colors. Testear con Resend antes de desplegar |
| **Canvas neural invisible** sobre crema | Test con opacidad 10%, 15%, 20% hasta encontrar el punto |
| **Gateway zones no se distinguen** en tema claro | Reforzar con bordes, padding, y micro-cambios tipográficos además de color |
| **Build roto** por fonts eliminadas | Buscar todas las referencias a `--font-plus-jakarta` y `--font-inter-tight` antes de eliminar |

---

## CHECKLIST GLOBAL DE MIGRACIÓN

### Tokens
- [ ] Colores base actualizados en globals.css
- [ ] Colores de texto actualizados
- [ ] Acento → terracota (#B45A32)
- [ ] CTA → lima (#F5F564)
- [ ] Bordes → rgba oscuro
- [ ] Zonas emocionales → cálidas
- [ ] Easings y keyframes → colores actualizados

### Fuentes
- [ ] Lora importada en layout.tsx
- [ ] Plus Jakarta Sans eliminada (si se decide)
- [ ] Inter Tight eliminada (si se decide)
- [ ] Todas las referencias `--font-plus-jakarta` → `--font-lora`
- [ ] Todas las referencias `--font-inter-tight` → `--font-inter` o `--font-lora`
- [ ] themeColor actualizado en metadata

### Componentes UI
- [ ] Button: 3 variantes con nuevos colores
- [ ] Card: border-radius 20px, fondo blanco
- [ ] Badge: pill oscuro
- [ ] Input: fondo blanco, focus terracota
- [ ] MicroEspejo: terracota + crema
- [ ] Bisagra: gradiente cálido
- [ ] ProgressBar: terracota
- [ ] Separator: borde cálido

### Páginas
- [ ] Landing hero: crema + Lora + SHOCK
- [ ] Landing below-fold: crema secundario
- [ ] Gateway: todas las preguntas legibles
- [ ] Gateway: zonas emocionales diferenciadas
- [ ] Mapa vivo: crema + barras + CTA lima
- [ ] Pago éxito: colores actualizados
- [ ] Booking: colores actualizados
- [ ] Admin: funcional con nuevo tema
- [ ] Showcase: reflejando nuevo design system

### Emails
- [ ] 8 plantillas de email actualizadas
- [ ] Plantilla post-pago actualizada
- [ ] Booking emails actualizados

### Verificación final
- [ ] Build limpio sin errores
- [ ] Flujo completo: landing → P1 → gateway → email → mapa → pago
- [ ] Responsive: 375px, 768px, 1024px+
- [ ] WCAG AA contraste verificado
- [ ] prefers-reduced-motion funcional

---

*Plan creado: 23 Marzo 2026*
