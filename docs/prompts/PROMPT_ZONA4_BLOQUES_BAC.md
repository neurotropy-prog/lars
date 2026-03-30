# PROMPT — Implementar Bloques B + C en Zona 4 (AspiracionalTimeline)

## CONTEXTO

La Zona 4 del mapa vivo ("Tu Camino") tiene 3 bloques definidos en `docs/phases/M7_ACTUALIZADO.md` y `docs/features/FEATURE_GATEWAY_DESIGN.md`:

- **BLOQUE A** — Timeline de 3 fases del programa (ya parcialmente implementado como timeline de 5 puntos)
- **BLOQUE B** — Reencuadre de precio con transparencia total ("desde 2.500€")
- **BLOQUE C** — CTA completo con texto pre-CTA emocional + botón + garantía + card colapsable de contenido

**Estado actual:** El componente `AspiracionalTimeline.tsx` tiene una timeline de 5 puntos (HOY→S1→S4→S8→S12) que salta directamente al botón CTA de 97€. **Falta el BLOQUE B completo y el BLOQUE C está incompleto** — no tiene el texto pre-CTA emocional, no tiene la card colapsable de "Qué incluye la Semana 1", y no tiene el reencuadre de precio.

## QUÉ HAY QUE HACER

Reescribir `src/app/mapa/[hash]/sections/AspiracionalTimeline.tsx` para que tenga la secuencia completa de 3 bloques cuando `hasPaid === false`. Si `hasPaid === true`, el componente mantiene la timeline + mensaje de "Tu Semana 1 está en marcha" tal como está ahora.

### BLOQUE A — Timeline de 3 Fases (reemplaza los 5 puntos actuales)

La timeline actual de 5 puntos (HOY→S1→S4→S8→S12) se reorganiza en **3 fases** del programa, con Fase 1 como protagonista visual. Los textos vienen de `docs/phases/M7_ACTUALIZADO.md` (son la fuente de verdad):

```
FASE 1 — EL DESPERTAR
Badge: "AQUÍ EMPIEZAS" (terracota accent)
Subtítulo: Semanas 1–4 · Reconocer y estabilizar
Texto: "Entenderás qué le pasa a tu biología: neurotransmisores, función
hormonal, inflamación. Restaurarás tu sueño con un protocolo diseñado
por un médico. En la semana 4, tu primer balance formal confirmará lo
que tu cuerpo ya empieza a notar."

FASE 2 — LA METAMORFOSIS  (opacity 0.5)
Subtítulo: Semanas 5–8 · Activar y procesar
Texto: "Desmontarás las creencias y patrones que sostienen el ciclo.
Conocerás las partes internas que dirigen tus decisiones sin que lo
sepas — el perfeccionista, el controlador, el crítico — y aprenderás
a liderarlas. Lo que el burnout congeló empieza a procesarse."

FASE 3 — VOLAR ALTO  (opacity 0.5)
Subtítulo: Semanas 9–12 · Conectar y reconstruir
Texto: "Repararás los vínculos que el burnout dañó, pondrás límites
desde tus valores y diseñarás tu nueva arquitectura vital. Un sistema
de alertas tempranas para que el burnout no vuelva."
```

**Diseño (mobile-first 375px):**
- 3 cards apiladas verticalmente
- Línea de progreso vertical a la izquierda con nodos circulares
- Nodo Fase 1: círculo relleno con `var(--color-accent)` + animación pulse + badge "AQUÍ EMPIEZAS" en terracota (`var(--color-accent)` fondo, `var(--color-text-inverse)` texto)
- Nodos Fase 2 y 3: círculos vacíos con borde `rgba(180, 90, 50, 0.3)`
- Cards Fase 2 y 3 con `opacity: 0.5` y sin borde accent. Comunican "esto viene después" sin competir
- Aparición secuencial con stagger: Fase 1 primero, +150ms Fase 2, +300ms Fase 3 (usar IntersectionObserver, patrón A-15 ya implementado en el componente)
- Cada card tiene esta jerarquía tipográfica:
  - Título de fase: Inter, `--text-body-sm`, fontWeight 700 (negrita), `--color-text-primary` (Fase 1) o `--color-text-secondary` (Fases 2-3)
  - Subtítulo: Inter, `--text-caption`, fontWeight 400, `--color-text-secondary` (Fase 1) o `--color-text-tertiary` (Fases 2-3)
  - Texto descriptivo: Inter, `--text-body-sm`, fontWeight 400, `--color-text-tertiary`
- Card de Fase 1 tiene `borderLeft: 3px solid var(--color-accent)` como señal visual de protagonismo

### BLOQUE B — Reencuadre de Precio (NUEVO — transparencia)

Inmediatamente debajo de la timeline, sin separador visual fuerte (es continuación natural).

```
TEXTO PRINCIPAL (Inter, --text-body, --color-text-primary):
"El programa completo tiene tres niveles de acompañamiento desde 2.500€, según la profundidad que necesites. La elección del plan viene después — cuando hayas comprobado con tu propio cuerpo que esto funciona."

TEXTO PUENTE (Inter, --text-body-sm, --color-text-secondary):
"Por eso existe la Semana 1."
```

**Notas de diseño:**
- Son solo dos frases. Nada más. No hay cards de planes. No hay tabla comparativa. No hay opciones.
- Es información de fondo que responde la pregunta "¿y después cuánto cuesta?" sin crear una decisión nueva.
- Padding: `var(--space-5)` arriba, `var(--space-6)` abajo (espacio generoso antes del CTA — respiro visual entre el precio del programa y la acción)
- Fade-in suave al entrar en viewport (misma animación que el resto del componente)

### BLOQUE C — CTA Completo (reemplaza el CTA actual)

**1. Texto pre-CTA (Lora, `--text-h3`, italic, `--color-text-primary`):**
```
Tu sistema nervioso lleva años sosteniendo lo que tú no podías soltar. Ahora tienes el mapa.
```
Es la voz de Javier. Serif, itálica. Empatía, no instrucción. `marginBottom: var(--space-4)`.

**2. Texto delta de alivio (Inter, `--text-body`, `--color-text-primary`):**
```
Los primeros cambios llegan en 72 horas. No en meses — en 3 días. El Protocolo de Sueño de Emergencia está diseñado para que tu cuerpo note la diferencia antes de que tu mente decida si confía.
```
`marginBottom: var(--space-6)`.

**3. Botón CTA (mantener el actual):**
- Pill con `var(--color-accent)`, full-width, max-width 400px, border-radius 9999px
- Texto: "Empieza la Semana 1" (o "Redirigiendo…" si loading)
- Hover: `var(--color-accent-hover)` + translateY(-2px)
- onClick: `onStartWeek1` (Stripe checkout)

**4. Sub-copy precio + garantía (mantener):**
```
97€ · Protocolo de Sueño + Sesión 1:1 + MNN©
Garantía: si tu sueño no mejora en 7 días, devolución íntegra.
```

**5. Card colapsable "Qué incluye" (NUEVO):**

Un acordeón simple debajo de la garantía. Cerrado por defecto. Al abrir, revela el desglose:

```
HEADER (cerrado):
"Qué incluye la Semana 1" + chevron (→)

CONTENIDO (abierto):
→ Protocolo de Sueño de Emergencia
  Diseñado por el Dr. Carlos Alvear. Un plan concreto para
  ganar hasta una hora más de sueño al día. Resultados en 72 horas.

→ Sesión 1:1 con Javier A. Martín Ramos
  Director del Instituto Epigenético. Ya tiene tu mapa —
  la sesión arranca desde tus datos, no desde cero.

→ Mapa de Niveles de Neurotransmisores (MNN©)
  Tu primer análisis bioquímico real: qué sustancias produce
  tu cerebro, cuáles le faltan y qué significa eso para tu
  sueño, tu energía y tu claridad mental.

→ Garantía total
  7 días. Si no notas mejora en tu sueño, devolución íntegra.
  Sin preguntas. Sin formularios.
```

**Diseño del acordeón:**
- NO reutilizar MapaAccordion (es para Zona 3, diferente propósito)
- Crear un acordeón inline simple dentro del propio componente:
  - Header: `button` con display flex, justify-content space-between
  - Font: Inter, `--text-body-sm`, fontWeight 500, `--color-text-secondary`
  - Chevron SVG de 12x12, rotación 90° al abrir (200ms ease)
  - Contenido con max-height animado (400ms cubic-bezier(0.16, 1, 0.3, 1)) — mismo easing que MapaAccordion
  - Fondo del contenido: `var(--color-bg-secondary)`, border-radius `var(--radius-md)`, padding `var(--space-5)`
  - Cada ítem: título en Inter fontWeight 600, `--text-body-sm`, `--color-text-primary)` + descripción en fontWeight 400, `--color-text-secondary`
  - Ítems separados por `var(--space-5)` de margen

**6. Error de checkout (mantener el bloque actual de error)**

## ESTRUCTURA FINAL DEL COMPONENTE (caso `hasPaid === false`)

```
<contenedor con fade-up>

  <título "Tu camino de regulación">

  BLOQUE A — Timeline 3 fases
    Fase 1 (protagonista, badge "AQUÍ EMPIEZAS")
    Fase 2 (opacity 0.5)
    Fase 3 (opacity 0.5)

  <nota evolución mapa>

  ─── separador sutil ───

  BLOQUE B — Reencuadre precio
    "El programa completo... desde 2.500€..."
    "Por eso existe la Semana 1."

  ─── espacio generoso (--space-6) ───

  BLOQUE C — CTA completo
    Texto pre-CTA (Lora, italic — voz de Javier)
    Texto delta de alivio (Inter — 72 horas)
    [Botón: Empieza la Semana 1]
    97€ · Protocolo + Sesión + MNN©
    Garantía 7 días
    ▸ Qué incluye la Semana 1 (acordeón colapsable)
    (Error de checkout si aplica)

</contenedor>
```

## ESTRUCTURA (caso `hasPaid === true`)

Mantener exactamente como está: timeline + mensaje "Tu Semana 1 está en marcha. Revisa tu email."

Pero cambiar la timeline de 5 puntos a 3 fases también aquí, para coherencia. El badge "AQUÍ EMPIEZAS" cambia a "EN CURSO" con color `var(--color-success)`.

## REGLAS DE DISEÑO (de DESIGN.md y los skills)

- Mobile-first 375px. Si no funciona en móvil, no existe.
- Todos los valores del sistema de diseño. NUNCA valores sueltos.
- Font Lora (serif editorial) solo para headlines/display y el texto pre-CTA (es la voz de Javier). Inter para todo lo demás.
- `--color-accent` (#B45A32 terracota) para el botón CTA, badge "AQUÍ EMPIEZAS", nodos activos, línea de progreso. **NOTA:** La spec M7 dice "verde acento" porque fue escrita antes del rediseño visual. El diseño actual usa terracota como accent. Usar siempre `var(--color-accent)` — el token ya apunta al color correcto.
- Fondo `--color-bg-secondary` para el contenedor general (ya está).
- Bordes con `--color-surface-subtle` a opacidad reducida.
- Animaciones con propósito: stagger en fases, fade-in en bloques, pulse en nodo Fase 1.
- Espacio generoso entre bloques. El vacío respira. (Product-philosophy: "El vacío respira: margen amplio como señal de calma y profesionalismo")

## VALIDACIÓN ÉTICA (de movement-philosophy)

El bloque B pasa los 4 tests:
- **Test de verdad:** Los precios son los reales. ✅
- **Test de poder:** La persona sale con más información para decidir. ✅
- **Test de reversibilidad:** Es transparencia pura. Si la persona viera cómo diseñamos esto, pensaría "me están mostrando todo antes de pedirme nada." ✅
- **Test de beneficio:** Reduce la incertidumbre del cliente. Beneficio principal para él. ✅

## ANTI-PATRONES (NO HACER)

- ❌ Cards de planes con precios comparativos (no es un pricing page)
- ❌ Tabla de features "Basic vs Executive vs Premium"
- ❌ Texto "desde 2.500€" en negrita o con color accent (es información de fondo, no headline)
- ❌ CTA antes del reencuadre de precio (la secuencia es: fases → precio → CTA)
- ❌ Acordeón abierto por defecto (el que está listo hace clic directamente, el que necesita información lo abre)
- ❌ Verde #4ADE80 en ningún sitio (ese era el diseño anterior, ahora es terracota)
- ❌ Separador grueso entre Bloque B y C (el espacio generoso es suficiente)

## CHECKLIST ANTES DE CERRAR

- [ ] Bloque A: 3 fases con Fase 1 protagonista y badge
- [ ] Bloque A: Fases 2 y 3 con opacity 0.5
- [ ] Bloque A: Stagger de aparición (0, 150ms, 300ms)
- [ ] Bloque B: Texto de "desde 2.500€" exacto como en spec
- [ ] Bloque B: "Por eso existe la Semana 1" debajo
- [ ] Bloque B: Espacio generoso antes del CTA
- [ ] Bloque C: Texto pre-CTA en Lora italic
- [ ] Bloque C: Texto delta de alivio sobre 72 horas
- [ ] Bloque C: Botón CTA funcional con Stripe
- [ ] Bloque C: Sub-copy 97€ + garantía
- [ ] Bloque C: Acordeón "Qué incluye" colapsable con 4 ítems
- [ ] Bloque C: Error de checkout si aplica
- [ ] Caso hasPaid: Timeline de 3 fases con badge "EN CURSO"
- [ ] Mobile 375px: todo funciona y respira
- [ ] Valores de diseño del sistema (tokens, no hardcoded)
- [ ] IntersectionObserver para fade-up (patrón A-15)
- [ ] `npx tsc --noEmit` sin errores
- [ ] NUNCA `npm run build` (el build lo hace Vercel)
