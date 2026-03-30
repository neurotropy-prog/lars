# Session 3 — Timeline Aspiracional + CTA Contextual

**Zona 4: Tu Camino de Regulación**

---

## Objetivo

Reemplazar el timeline del sistema (sistema-céntrico) con un timeline aspiracional centrado en la transformación del cliente. Implementar CTA contextual basado en estado de pago. Esta es la pieza de cierre de cada visita al mapa vivo.

---

## Lectura obligatoria ANTES de comenzar

1. `/docs/REDISENO_MAPA_VIVO.md` — Sección **ZONA 4 — TU CAMINO** (líneas 296–375)
2. `/docs/DESIGN.md` — Paleta, tipografía, espaciado, variables
3. `/docs/ANIMATIONS.md` — A-04 (transiciones), A-13 (CTA calma), A-15 (IntersectionObserver)
4. `/src/app/mapa/[hash]/sections/EvolutionTimeline.tsx` — Implementación actual
5. `/src/app/mapa/[hash]/MapaClient.tsx` — Contexto de zona 4, integración Stripe

---

## Qué cambia

### 1. Componente EvolutionTimeline → AspiracionalTimeline

El componente se renombra y se reescribe completamente. El contenido cambia de lenguaje de sistema a lenguaje de transformación del cliente.

#### Contenido actual (SISTEMA-CÉNTRICO — A DESCARTAR)

```
Día 0: Tu evaluación · 5 dimensiones · Score global
Día 3: Arquetipo del SN · 7 tipos · Tu patrón profundo
Día 7: Insight colectivo · Dato nuevo
Día 10: Sesión con Javier · 20 min
Día 14: Subdimensiones · 2 preguntas
Día 21: Extracto del libro
Día 30: Reevaluación
Día 90: Trimestral
```

#### Contenido nuevo (CLIENTE-CÉNTRICO — TRANSFORMACIÓN)

```
TU CAMINO DE REGULACIÓN

──── HOY
     Tu punto de partida: {score}/100
     Tu sistema nervioso necesita atención.

──── SEMANA 1 · Tu cuerpo nota la diferencia
     Protocolo de Sueño de Emergencia.
     Resultados en 72 horas.

──── SEMANA 4 · Tu primer balance real
     Reevaluación completa.
     Medirás cuánto ha cambiado tu biología.

──── SEMANA 8 · Los patrones cambian
     Desmontar las creencias que sostienen el ciclo.
     IFS, trabajo emocional, reprocesamiento.

──── SEMANA 12 · Tu nueva arquitectura vital
     Límites, vínculos, sistema de alertas.
     El burnout no vuelve.
```

**Diferencias clave:**
- Habla de lo que el **CLIENTE va a experimentar**, no de los desbloqueos del sistema
- 5 puntos en lugar de 8 — menos ruido, más claridad
- Cada punto es una **promesa verificable** (no "arquetipo del SN")
- Lenguaje de **transformación biológica** + **cambio de patrones** + **nueva arquitectura vital**

---

### 2. Props de AspiracionalTimeline

```typescript
interface AspiracionalTimelineProps {
  score: number              // Score global actual (ej: 27)
  scoreColor: string         // Color derivado del rango (crítico/bajo/medio/alto)
  hasPaid: boolean           // True si el usuario ha pagado
  daysSinceCreation: number  // Días desde creación del mapa
}
```

**Origen de datos:**
- `score`: viene de `mapData.score` en MapaClient
- `scoreColor`: viene de `getScoreColor(score)` (función auxiliar)
- `hasPaid`: viene del estado de sesión / auth
- `daysSinceCreation`: calculado en `map-evolution.ts` o MapaClient

---

### 3. Punto "HOY" dinámico según progreso

El primer punto del timeline ("HOY") se actualiza según `daysSinceCreation`:

**Día 0 (Primera visita post-gateway):**
```
──── HOY
     Tu punto de partida: 27/100
     Tu sistema nervioso necesita atención.
```

**Día 7+ (Dentro de Semana 1):**
```
──── HOY
     Llevas 7 días. Tu mapa sigue evolucionando.
     Tu sistema nervioso está registrando cambios.
```

**Día 30+ (Post-reevaluación):**
```
──── HOY
     Llevas 30 días. Tu nuevo score: 45/100
     +18 puntos en 30 días.
```

**Lógica:**
```javascript
function getHoyContent(daysSinceCreation: number, score: number, reevalScore?: number) {
  if (daysSinceCreation === 0) {
    return {
      title: 'HOY',
      subtitle: `Tu punto de partida: ${score}/100`,
      description: 'Tu sistema nervioso necesita atención.',
    }
  } else if (daysSinceCreation >= 30 && reevalScore) {
    return {
      title: 'HOY',
      subtitle: `Llevas ${daysSinceCreation} días. Tu nuevo score: ${reevalScore}/100`,
      description: `+${reevalScore - score} puntos en ${daysSinceCreation} días.`,
    }
  } else if (daysSinceCreation >= 7) {
    return {
      title: 'HOY',
      subtitle: `Llevas ${daysSinceCreation} días. Tu mapa sigue evolucionando.`,
      description: 'Tu sistema nervioso está registrando cambios.',
    }
  }
}
```

---

### 4. Diseño visual del timeline

**Estructura CSS:**

```css
.aspiracional-timeline {
  margin-bottom: var(--space-8);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  background: var(--color-bg-secondary);
  border: var(--border-subtle);
}

.timeline-title {
  font-family: var(--font-lora);  /* Lora para editorial */
  font-size: var(--text-h3);
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: var(--ls-overline);
  margin-bottom: var(--space-5);
  text-align: left;
}

/* Timeline vertical line — 2px solid, accent a 15% opacidad */
.timeline-line {
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(180, 90, 50, 0.15);  /* --color-accent at 15% */
}

/* Timeline point container */
.timeline-point {
  position: relative;
  padding-left: var(--space-6);
  padding-top: var(--space-4);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-6);
}

/* Dot on the line */
.timeline-dot {
  position: absolute;
  left: 6px;
  top: var(--space-4);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid var(--color-accent);
  transform: translateX(-7px);
}

/* HOY dot — larger, with pulse */
.timeline-dot.is-hoy {
  width: 10px;
  height: 10px;
  background: var(--color-accent);
  box-shadow: 0 0 12px rgba(180, 90, 50, 0.4);
  animation: pulse-accent 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Future dots — hollow, border only */
.timeline-dot.is-future {
  background: transparent;
  border: 2px solid rgba(180, 90, 50, 0.3);
}

/* Past dots for paid users — filled accent */
.timeline-dot.is-past {
  background: var(--color-accent);
  border: 2px solid var(--color-accent);
}

@keyframes pulse-accent {
  0%, 100% {
    box-shadow: 0 0 12px rgba(180, 90, 50, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(180, 90, 50, 0.6);
  }
}

/* Point title — Inter, text-body-sm, weight 600 */
.timeline-point-title {
  font-family: var(--font-inter);
  font-size: var(--text-body-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--lh-body-sm);
}

/* Point description — Inter, text-body-sm, weight 400 */
.timeline-point-description {
  font-family: var(--font-inter);
  font-size: var(--text-body-sm);
  font-weight: 400;
  color: var(--color-text-secondary);
  margin: 0;
  margin-top: 4px;
  line-height: var(--lh-body-sm);
}
```

**Orden visual (izquierda a derecha):**
1. Línea vertical (2px, accent a 15%)
2. Punto/dot (8px normal, 10px para "HOY", hollow para futuro)
3. Título + descripción (texto, alineado a la izquierda)

---

### 5. Nota de evolución del mapa

Debajo del timeline de 5 puntos, agregar una línea sutil:

```
Tu mapa también evoluciona: cada semana aparece algo nuevo — tu perfil
profundo, insights colectivos, reevaluaciones. Vuelve cuando quieras.
```

**Estilo:**
- Tipografía: Inter, text-caption (más pequeño)
- Color: color-text-tertiary (muy sutil)
- Margen superior: var(--space-4)
- No tiene interacción

---

### 6. CTA contextual — Lógica y copy

#### Si NO ha pagado (`hasPaid === false`)

```
Tu regulación es un proceso de 12 semanas.
Tu primer paso son los próximos 7 días.

[Empieza la Semana 1]

97€ · Protocolo de Sueño + Sesión 1:1 + MNN©
Garantía: si tu sueño no mejora en 7 días, devolución íntegra.
```

**Estructura:**
1. **Intro text** — 2 líneas, Inter text-body-sm, color-text-primary
2. **Button** — "Empieza la Semana 1"
   - Estilo: primary (fondo accent, texto oscuro, forma pill, full-width max 400px)
   - Acción: conecta al handler Stripe checkout existente en MapaClient
   - Animación: A-13 (CTA calma) — sin urgencia, tranquilo
3. **Sub-copy** — Descrip y garantía, Inter text-caption, color-text-tertiary

**Button styling:**
```css
.cta-button {
  background: var(--color-accent);
  color: var(--color-text-primary);
  border: none;
  padding: var(--space-3) var(--space-5);
  border-radius: 100px;
  font-family: var(--font-inter);
  font-size: var(--text-body-sm);
  font-weight: 600;
  width: 100%;
  max-width: 400px;
  cursor: pointer;
  transition: all 0.3s var(--ease-in-out);
}

.cta-button:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}
```

#### Si YA ha pagado (`hasPaid === true`)

```
Tu Semana 1 está en marcha.
Revisa tu email para el Protocolo de Sueño de Emergencia.
```

**Estructura:**
1. Confirmación text (2 líneas), Inter text-body-sm, color-text-primary
2. **SIN botón CTA**
3. Sugerencia de acción secundaria (revisar email)

---

### 7. Eliminar contenido obsoleto de MapaClient Zona 4

Remover de `MapaClient.tsx` dentro de la sección Zona 4:

- ❌ Referencia al componente antiguo `EvolutionTimeline`
- ❌ Cards de 3 fases (Fase Inmediata / Estabilización / Profundización)
- ❌ Sección "price reframe" ("No es un curso... es 97€")
- ❌ Bloque de texto "urgencia natural"
- ✅ **Mantener:** función handler Stripe checkout (solo redirigirla al nuevo CTA)

---

### 8. Integración en MapaClient

**Ubicación en el flujo:**

```jsx
// MapaClient.tsx estructura

return (
  <div className="mapa-container">
    {/* ZONA 1: TU ESTADO */}
    <ScoreSection ... />

    {/* ZONA 2: TU FOCO */}
    <FocusZone ... />

    {/* ZONA 3: TU MAPA COMPLETO */}
    <MapAccordion ... />

    {/* ZONA 4: TU CAMINO */}
    <AspiracionalTimeline
      score={mapData.score}
      scoreColor={getScoreColor(mapData.score)}
      hasPaid={sessionData.hasPaid}
      daysSinceCreation={evolution.daysSinceCreation}
    />
  </div>
)
```

**Props pasados desde MapaClient:**
- `score` — de `mapData.score`
- `scoreColor` — calculado con `getScoreColor()` (helper simple)
- `hasPaid` — de auth/session context
- `daysSinceCreation` — de `evolution.daysSinceCreation`

---

### 9. Animaciones requeridas (de ANIMATIONS.md)

Las siguientes animaciones aplican a esta zona:

| ID | Descripción | Cuándo |
|---|---|---|
| **A-13** | CTA calma — sin urgencia, transición suave | Botón "Empieza la Semana 1" (fade in suave, sin bounce) |
| **A-15** | IntersectionObserver — reveal on scroll | Todo el timeline entra en view con fade-up |
| **A-04** | Transiciones entre secciones | Al mover del acordeón (Zona 3) al timeline (Zona 4) |

**Implementación mínima:**
```css
/* Fade-up on scroll reveal */
.aspiracional-timeline {
  animation: fadeUpOnScroll 0.6s var(--ease-out-quart) forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeUpOnScroll {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Usar IntersectionObserver en JS para trigger cuando timeline entra en viewport */
```

---

## Verificación antes de marcar como HECHO

### Funcionalidad

- [ ] Timeline muestra 5 puntos aspiracionales, NO eventos de sistema
- [ ] Punto "HOY" actualiza su contenido según `daysSinceCreation`
- [ ] Punto "HOY" tiene dot accent-colored con animación pulse
- [ ] Puntos futuros son hollow (solo borde), no llenos
- [ ] CTA dice "Empieza la Semana 1" para usuarios no pagados
- [ ] CTA está oculto para usuarios pagados
- [ ] Texto de confirmación ("Tu Semana 1 está en marcha...") aparece para usuarios pagados
- [ ] Click en botón CTA dispara checkout Stripe existente
- [ ] Contenido antiguo (EvolutionTimeline ref, 3-phase cards, price reframe) está eliminado
- [ ] Nota de evolución del mapa aparece como texto sutil debajo del timeline

### Diseño y UX

- [ ] Tipografía correcta: Lora para título, Inter para contenido
- [ ] Colores correctos: accent a 15% para línea, text-primary/secondary/tertiary en orden correcto
- [ ] Espaciado: var(--space-*) utilizado consistentemente
- [ ] Mobile 375px: timeline se lee bien, CTA es full-width, punto y línea están alineados
- [ ] Primera visita: Zona 4 aparece al final de la secuencia de reveal progresivo
- [ ] Visitas posteriores: Zona 4 está inmediatamente visible (sin timing delay)
- [ ] Línea vertical bien posicionada (15% left, no flota)
- [ ] Puntos están centrados en la línea (no desalineados)

### Experiencia de movimiento

- [ ] Timeline entra con fade-up en scroll (A-15)
- [ ] Botón CTA tiene hover suave (A-13)
- [ ] Transición desde Zona 3 a Zona 4 es fluida
- [ ] Sin corte seco entre secciones
- [ ] Pulse animation en punto "HOY" es sutil (no molesta)

### Contextos de pago

- [ ] Primer test: `hasPaid=false` → CTA visible con "Empieza la Semana 1"
- [ ] Segundo test: `hasPaid=true` → CTA oculto, confirmación visible
- [ ] Checkout sigue funcionando cuando se hace click

### Responsividad

- [ ] 375px (mobile): todo legible, no wraps feas
- [ ] 768px (tablet): CTA centrado pero max-width respetado
- [ ] 1024px+ (desktop): layout simétrico, punto "HOY" destaca

---

## Archivo de salida

**Ubicación:** `/src/app/mapa/[hash]/sections/AspiracionalTimeline.tsx`

**Notas de implementación:**

1. Renombrar archivo `EvolutionTimeline.tsx` → `AspiracionalTimeline.tsx`
2. Reescribir contenido completamente (no es refactor, es reescritura)
3. Mantener estructura React similar (props, useState si es necesario, exports)
4. Usar variables CSS centralizadas de DESIGN.md
5. No hardcodear colores ni tamaños — siempre `var(--color-*)` y `var(--space-*)`
6. Incluir comentarios de código en español (coherente con codebase)
7. Exportar en MapaClient como:
   ```typescript
   import AspiracionalTimeline from '@/app/mapa/[hash]/sections/AspiracionalTimeline'
   ```
8. Remover import de EvolutionTimeline

---

## Decisiones de producto reflejadas

Esta implementación cierra los 4 objetivos de REDISENO_MAPA_VIVO.md:

✅ **Foco único:** Zona 4 es el ancla final clara — ver el camino de 12 semanas.

✅ **Lenguaje correcto:** Habla de transformación (sueño, patrones, límites) no de features de sistema.

✅ **Contexto de pago:** CTA cambia según estado, sin presión para pagados.

✅ **Complejidad ganada:** El timeline simple (5 puntos) es digestible; el mapa detallado está en Zona 3 (acordeón).

---

## Referencias en el codebase

- Paleta: `/docs/DESIGN.md` (líneas 28–100)
- Animaciones: `/docs/ANIMATIONS.md` (A-13, A-15)
- Contexto Zona 4: `/docs/REDISENO_MAPA_VIVO.md` (líneas 296–375)
- Stripe handler: `/src/app/mapa/[hash]/MapaClient.tsx` (función `handleStripeCheckout` o similar)
- Evolution state: `/src/lib/map-evolution.ts` (tipos, cálculos)

---

## Notas finales

- **No es iterativo:** Esta es la versión final de Zona 4. El timeline tiene 5 puntos, no 8.
- **Copy es exacto:** Cada línea está en REDISENO_MAPA_VIVO.md. No improvisar.
- **Animación es requisito:** Sin A-13 y A-15, la fase está incompleta.
- **Mobile-first:** Diseña para 375px primero. 1024px es refinamiento.
