# Rediseño del Mapa Vivo — La Mejor Solución Posible

**Fecha:** 24 marzo 2026
**Contexto:** Auditoría completa del mapa vivo con fast-forward a día 182.
Skills aplicados: product-philosophy, movement-philosophy, gateway, profiles.

---

## LA IDEA CENTRAL

El mapa vivo no es una página. Es una **interfaz de relación**.

La persona no lo visita una vez — vuelve durante 90+ días. Cada visita tiene
un contexto diferente: la primera vez acaba de terminar el gateway, a los 3
días vuelve por curiosidad, a los 7 porque recibió un email, a los 14 porque
quiere profundizar, a los 30 porque quiere medir progreso.

**El error actual:** tratar todas las visitas igual. Apilar contenido de arriba
a abajo en orden cronológico y que la persona lo digiera como pueda.

**La solución:** hacer que cada visita tenga UN foco, UN ritmo, y UNA acción.
El resto disponible pero no compitiendo.

---

## ARQUITECTURA: FOCO + PROFUNDIDAD

### Principio

```
Cada vez que entras a tu mapa, ves UNA cosa que importa ahora.
Todo lo demás está ahí, organizado, accesible — pero no gritando.
```

### Las 3 zonas

```
┌─────────────────────────────────────────────┐
│  ZONA 1 — TU ESTADO                         │
│  Score global + badge + comparativa          │
│  (si hay reevaluación: antes → ahora)        │
│  Siempre visible. Siempre actualizado.       │
├─────────────────────────────────────────────┤
│  ZONA 2 — TU FOCO                           │
│  Lo que importa HOY en esta visita.          │
│  Una sola sección expandida.                 │
│  Sigue la gramática: espejo → tensión →      │
│  alivio → siguiente paso.                    │
├─────────────────────────────────────────────┤
│  ZONA 3 — TU MAPA COMPLETO                  │
│  Acordeón organizado por bloques.            │
│  Cada bloque: título + resumen + estado.     │
│  Solo UNO abierto a la vez.                  │
│  Lo nuevo se marca. Lo pendiente se señala.  │
├─────────────────────────────────────────────┤
│  ZONA 4 — TU CAMINO                         │
│  Timeline aspiracional de 12 semanas.        │
│  CTA contextual según estado de pago.        │
│  Siempre presente al final natural del       │
│  scroll.                                     │
└─────────────────────────────────────────────┘
```

---

## ZONA 1 — TU ESTADO (el ancla permanente)

Lo que la persona ve primero, siempre. No cambia de estructura entre visitas
— solo se actualiza con datos nuevos.

**Primera visita (día 0):**
```
TU EVALUACIÓN
Tu Mapa de Regulación

   27 /100        [Crítico]
   Score global de regulación
```

**Visitas posteriores con reevaluación (día 30+):**
```
TU EVALUACIÓN
Tu Mapa de Regulación

   27 → 45 /100   [En recuperación]
   +18 puntos en 30 días
```

El score con comparativa es el dato más poderoso del mapa. Cuando la
persona ve que su número ha subido, no necesitas convencerla de nada.
El dato habla.

---

## ZONA 2 — TU FOCO (lo que importa esta visita)

Esta es la pieza clave del rediseño. El foco cambia según el contexto:

### Lógica de selección del foco

```
1. ¿Hay contenido NUEVO desde la última visita?
   → Sí → El contenido nuevo es el foco
   → No → Paso 2

2. ¿Hay una acción PENDIENTE? (sesión sin agendar, subdimensiones sin responder, reevaluación disponible)
   → Sí → La acción pendiente es el foco
   → No → Paso 3

3. ¿La persona no ha pagado y el CTA no ha sido el foco reciente?
   → Sí → "Tu camino" es el foco (timeline + CTA)
   → No → Estado actual con teaser del próximo desbloqueo
```

### Cómo se ve cada foco por día

**Día 0 — Primera visita (post-gateway):**
Foco = las 5 dimensiones (reveal progresivo actual, funciona bien).
Después del reveal → el primer paso + timeline aspiracional + CTA.

**Día 3 — Arquetipo (NUEVO):**
```
┌─────────────────────────────────────────┐
│  NUEVO DESDE TU ÚLTIMA VISITA           │
│                                          │
│  Tu Arquetipo del Sistema Nervioso       │
│                                          │
│  El Escéptico                            │
│  "En algún momento, alguien en quien     │
│  confiaste plenamente te traicionó."     │
│                                          │
│  [Descubrir tu perfil completo →]        │
└─────────────────────────────────────────┘
```

UNA frase. La que más duele. La que hace que la persona diga "¿cómo sabe esto?"
El perfil completo (narrativa + creencias + herida/armadura) se expande al pulsar.

Para el Fuerte Invisible: la frase no menciona herida. Solo biología.
"Tu sistema nervioso aprendió que confiar es peligroso. No es psicología — es
una respuesta biológica que se puede recalibrar."

**Día 7 — Insight colectivo:**
No es un bloque nuevo. Se INTEGRA en la dimension card de la peor dimensión.
La DimensionCard se actualiza con un dato nuevo incrustado (como ya hace con
el d7Insight). Pero el foco de la visita es:

```
┌─────────────────────────────────────────┐
│  TU MAPA SE HA ACTUALIZADO              │
│                                          │
│  Regulación Nerviosa — 17/100            │
│  Nuevo dato: "El 67% de personas con     │
│  tu patrón reportan que la primera       │
│  mejora es en la calidad del sueño."     │
│                                          │
│  [Ver tu evaluación completa ↓]          │
└─────────────────────────────────────────┘
```

El foco señala QUÉ cambió y dónde mirarlo. No repite todo.

**Día 10 — Sesión con Javier:**
```
┌─────────────────────────────────────────┐
│  DISPONIBLE                              │
│                                          │
│  Tu sesión con Javier                    │
│                                          │
│  Ya tiene tu mapa. La sesión arranca     │
│  desde tus datos, no desde cero.         │
│  20 min gratuitos. Sin compromiso.       │
│                                          │
│  [Elegir horario →]                      │
│     08:00  ·  08:20  ·  08:40  ·  09:20 │
└─────────────────────────────────────────┘
```

UNA acción clara. No compite con nada. El selector de horarios está aquí,
no enterrado entre el arquetipo y las subdimensiones.

**Día 14 — Subdimensiones:**
```
┌─────────────────────────────────────────┐
│  PROFUNDIZA TU EVALUACIÓN               │
│                                          │
│  Tu regulación nerviosa tiene 3 capas   │
│  que no pudimos medir con tu             │
│  diagnóstico original:                   │
│                                          │
│  · Activación diurna                     │
│  · Recuperación nocturna                 │
│  · Respuesta al estrés agudo            │
│                                          │
│  2 preguntas más para calcularlas.       │
│                                          │
│  [Responder ahora →]                     │
└─────────────────────────────────────────┘
```

Al pulsar, las 2 preguntas se expanden in-place. Al responder, las barras
de subdimensión aparecen con animación. Resultado inmediato.

**Día 21 — Extracto del libro:**
```
┌─────────────────────────────────────────┐
│  PARA TI                                 │
│                                          │
│  Un capítulo que escribimos para          │
│  personas con tu patrón de regulación.   │
│                                          │
│  [Leer extracto →]                       │
└─────────────────────────────────────────┘
```

Íntimo. Personal. Sin ruido alrededor.

**Día 30 — Reevaluación (el momento más poderoso):**
```
┌─────────────────────────────────────────┐
│  HAN PASADO 30 DÍAS                      │
│                                          │
│  ¿Ha cambiado algo en tu regulación?     │
│  Responde las mismas 10 preguntas y      │
│  compara con tu día 0.                   │
│                                          │
│  [Reevaluar mi estado →]                 │
└─────────────────────────────────────────┘
```

Después de completar:
```
┌─────────────────────────────────────────┐
│  TU EVOLUCIÓN                            │
│                                          │
│       27 → 45                            │
│    +18 puntos en 30 días                 │
│                                          │
│  [Gráfica de evolución por dimensión]    │
│                                          │
│  Las personas que siguen midiendo cada   │
│  90 días mantienen su mejora. Tu         │
│  próxima reevaluación: en 60 días.       │
└─────────────────────────────────────────┘
```

ESTE es el momento WOW. El dato más personal, más impactante, más
compartible. El delta calibrado: supera la expectativa un 20-30%.

---

## ZONA 3 — TU MAPA COMPLETO (profundidad organizada)

Todas las secciones desbloqueadas hasta ahora, en un acordeón limpio.
Solo UNA sección abierta a la vez. Al abrir una, las demás se cierran.

```
TU MAPA

├── Tu Evaluación                      5 dimensiones · 27/100
│   [chevron ▸]
│
├── Tu Identidad  ·  NUEVO             El Escéptico
│   [chevron ▸]
│
├── Tu Profundidad                     3 subdimensiones
│   [chevron ▸]
│
├── Extracto del libro  ·  NUEVO       Capítulo personalizado
│   [chevron ▸]
│
├── Sesión con Javier                  ✓ Completada
│   [chevron ▸]
│
└── Tu Evolución                       1 reevaluación · +18 pts
    [chevron ▸]
```

**Cada fila muestra:**
- Título
- Resumen de una línea (dato clave o estado)
- Badge si es NUEVO o si hay acción PENDIENTE
- Chevron para expandir

**Al expandir:** el contenido completo de esa sección aparece
(con la misma calidad y detalle que tiene ahora).

**Beneficios:**
- Día 0: el acordeón tiene solo "Tu Evaluación" → limpio
- Día 3: se añade "Tu Identidad" con badge NUEVO → invita a explorar
- Día 90: tiene 6 secciones → organizado, no abrumador
- La persona ELIGE qué profundizar. Nadie le obliga a scrollear todo.

---

## ZONA 4 — TU CAMINO (el ancla hacia adelante)

### El timeline del CLIENTE, no del sistema

ACTUAL (lenguaje de sistema):
```
Día 0: Tu evaluación · 5 dimensiones · Score global
Día 3: Arquetipo del SN · 7 tipos · Tu patrón profundo
Día 7: Insight colectivo · Dato nuevo en tu peor dimensión
Día 10: Sesión con Javier · 20 min gratuitos
Día 14: Subdimensiones · 2 preguntas · Mayor resolución
Día 21: Extracto del libro · Capítulo personalizado
Día 30: Reevaluación · Compara con tu día 0
Día 90: Trimestral · Evolución a largo plazo
```

PROPUESTO (lenguaje de transformación):
```
TU CAMINO DE REGULACIÓN

──── HOY
     Tu punto de partida: 27/100
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
- Habla de lo que el CLIENTE va a experimentar, no de lo que el mapa desbloquea
- Cada punto es una promesa verificable (no "arquetipo del SN")
- El lenguaje es de transformación, no de features
- Solo 5 puntos, no 8. Menos ruido, más claridad.

### ¿Dónde queda el timeline del mapa?

Como nota secundaria, debajo del timeline aspiracional:

```
Tu mapa también evoluciona: cada semana aparece algo nuevo
— tu perfil profundo, insights colectivos, reevaluaciones.
Vuelve cuando quieras.
```

Una línea. Sin desglose. La persona descubre los desbloqueos cuando vuelve,
no porque un timeline se lo anticipe todo. La sorpresa es parte del diseño.

### CTA contextual

**Si no ha pagado:**
```
Tu regulación es un proceso de 12 semanas.
Tu primer paso son los próximos 7 días.

[Empieza la Semana 1]

97€ · Protocolo de Sueño + Sesión 1:1 + MNN©
Garantía: si tu sueño no mejora en 7 días, devolución íntegra.
```

**Si ya pagó:**
```
Tu Semana 1 está en marcha.
Revisa tu email para el Protocolo de Sueño de Emergencia.
```

---

## LOS PUENTES LÍQUIDOS

Los puentes actuales (p1-p5) son texto itálico al pie de cada card
que huele a venta disfrazada. La solución no es eliminarlos — es
integrarlos como parte natural del contenido.

ACTUAL:
```
[DimensionCard: Regulación Nerviosa 17/100]
"Esta dimensión tiene 3 subdimensiones que solo emergen
con observación continua."
```

PROPUESTO:
El texto del puente se elimina como bloque separado.
Si la persona quiere profundizar, el Zona 3 ya le dice:
"Tu Profundidad — 3 subdimensiones" con un badge de PENDIENTE.

El deseo de profundizar nace de la EXPERIENCIA (ver su score,
leer su arquetipo, notar que hay más capas), no de copy itálico.

---

## POR QUÉ ESTA SOLUCIÓN ES LA MEJOR

### Cumple product-philosophy

- **Una acción por visita.** El foco garantiza que la persona
  siempre sabe qué hacer.
- **Complejidad ganada.** El acordeón revela profundidad cuando
  la persona la busca, no antes.
- **Diseño del silencio.** Lo que no se muestra importa tanto
  como lo que se muestra.
- **La interfaz no se usa, se habita.** Cada visita se siente
  curada, no acumulada.

### Cumple movement-philosophy

- **Gramática S→E→T→A→CTA.** Cada foco sigue la secuencia:
  dato personal → "esto significa que..." → tensión → alivio → paso.
- **Los 5 estados de conciencia.** El foco mueve a la persona
  por el camino: Awareness (score) → Clarity (dimensiones) →
  Confidence (arquetipo + datos colectivos) → Readiness (CTA).
- **Confianza compuesta.** Cada visita entrega más de lo esperado.
  La persona aprende que cada vez que vuelve, hay algo nuevo y
  valioso. Eso construye confianza progresiva.

### Cumple gateway

- **Protocolo del Río.** La experiencia no se rompe entre visitas.
  Cada una retoma donde la anterior dejó.
- **Cascada de valor.** N0 (mapa) → N1 (arquetipo, subdimensiones)
  → N2 (sesión con Javier) → N3 (programa). Cada nivel entrega
  más valor y acerca más a la decisión.
- **Los 3 Momentos.** El foco de cada visita sigue HACER → SENTIR
  → VER EL CAMINO. El micro-ejercicio del día 0 es HACER. El
  arquetipo es SENTIR. El timeline es VER.

### Cumple profiles (los 4)

- **Productivo Colapsado:** Eficiencia. Un foco, una acción, cero
  ruido. "En 30 segundos sé qué hay nuevo y qué hacer."
- **Fuerte Invisible:** Protección. El arquetipo muestra UNA frase,
  no toda la herida. La profundidad es su elección, no una
  emboscada. La biología va primero, la emoción cuando él elija.
- **Cuidador Exhausto:** Cuidado. "Tu mapa se cuida solo. Vuelve
  cuando puedas — siempre hay algo nuevo esperándote." Sin presión.
  Sin culpa de no haber vuelto antes.
- **Controlador Paralizado:** Estructura. El acordeón es un índice
  perfecto. El timeline tiene fechas y métricas. Todo medible,
  todo predecible, todo bajo su control.

---

## CAMBIOS TÉCNICOS NECESARIOS

| Componente | Cambio | Complejidad |
|---|---|---|
| `MapaClient.tsx` | Añadir lógica de selección de foco basada en `lastVisitedAt` + `evolution` | Media |
| `MapaClient.tsx` | Reorganizar render en 4 zonas (Estado, Foco, Mapa Completo, Camino) | Alta |
| **NUEVO** `MapaAccordion.tsx` | Componente acordeón para Zona 3 (solo 1 abierto a la vez) | Media |
| **NUEVO** `FocusBanner.tsx` | Componente para Zona 2 que selecciona y renderiza el foco correcto | Media |
| `EvolutionTimeline.tsx` | Reemplazar timeline de sistema por timeline aspiracional del cliente | Baja |
| `EvolutionArchetype.tsx` | Crear versión "resumen" (1 frase) + versión "completa" (expandible) | Baja |
| `MapaClient.tsx` | Eliminar `PUENTES` object y los bloques `.mapa-puente` | Baja |
| `DimensionCard.tsx` | Eliminar puentes como bloques separados | Baja |
| Todos los `Evolution*.tsx` | Adaptar para funcionar como contenido de acordeón | Media |

### Lo que NO cambia

- Score global + counter animado → funciona
- Revelación progresiva 0-11s de las dimensiones → funciona
- Descarga PNG → funciona
- Stripe checkout → funciona
- Evolución por días (lógica en `map-evolution.ts`) → funciona
- Urgencia natural al final → tono correcto

---

## VERIFICACIÓN FINAL

Después de implementar, cada visita debe pasar estos tests:

1. **¿La persona sabe qué hay de nuevo en < 3 segundos?**
2. **¿Hay UNA sola acción principal clara?**
3. **¿Puede acceder a todo lo anterior sin scroll infinito?**
4. **¿El timeline habla de SU transformación, no del sistema?**
5. **¿El Fuerte Invisible se siente protegido, no expuesto?**
6. **¿El Controlador Paralizado ve estructura y datos?**
7. **¿Cada visita entrega más de lo esperado? (delta del 20-30%)**
8. **¿La experiencia se siente CURADA, no ACUMULADA?**
