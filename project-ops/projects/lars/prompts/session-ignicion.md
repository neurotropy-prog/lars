## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión IGNICION: Arquitectura de distribución y crecimiento orgánico — SEO, tracking, social sharing

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño visual
- `docs/DATABASE.md` — Schema actual
- Documentos de estrategia (si existen): notas sobre crecimiento, SEO, social

## Lo que ya está construido
- Gateway completo (10 preguntas, mapa vivo, compra)
- Admin con seguimiento
- Email secuencia
- Perfil detection system
- Co-learning, WhatsApp, datos colectivos

## Tu tarea

Esta sesión construye la **capa de distribución y crecimiento**:

1. **Landing pages por perfil** — SEO friendly, dirigidas a cada arquetipo (burnout ejecutivo, agotamiento directivo, etc.)
2. **UTM tracking avanzado** — Origen de cada lead (organic search, referral, paid, email, etc.)
3. **Open Graph dinámico** — Cuando alguien comparte su resultado, la preview muestra score + contexto
4. **Página de resultados SEO** — Datos agregados anónimos (para ser indexable, generar backlinks)

Implementa en dos fases:
**FASE VISUAL:** Diseña las landing pages y la página de resultados. Avísame cuando esté lista.
**FASE FUNCIONAL:** Solo después de aprobación, conecta tracking UTM y Open Graph dinámico.

---

### Tarea 1: Landing pages por perfil

**Estrategia:** Cada perfil tiene su propia landing → gateway. Los CTAs y copy son 100% calibrados al perfil. El gateway al final los categoriza.

**Rutas:**
- `/landing/burnout-ejecutivo` → Productivo Colapsado
- `/landing/agotamiento-directivo` → Controlador Paralizado
- `/landing/desgaste-emocional` → Cuidador Exhausto
- `/landing/desregulacion-silenciosa` → Fuerte Invisible

**Estructura común (adaptada per-perfil):**

```
[Hero]
Headline específico del perfil
Subheadline de transformación

[Problema]
Síntomas que reconoce este perfil

[Solución]
Qué es LARS para este perfil

[Social proof]
Datos colectivos (% de mejora, testimonios, etc.)

[CTA]
"Haz tu diagnóstico — 3 minutos"

[FAQ]
Preguntas del perfil
```

**LANDING 1: Burnout ejecutivo (Productivo Colapsado)**

```
HERO:
Headline: "Recupera tu productividad sin sacrificar tu salud"
Subheadline: "Para ejecutivos que rindieron años, y ahora el cuerpo necesita pausa"

PROBLEMA:
"Has alcanzado todo. Pero hace meses que no duermes bien.
La concentración se fue. La energía no alcanza como antes.

Esto no es depresión. Es: tu sistema nervioso pidiendo ajuste."

SOLUCIÓN:
"LARS es un protocolo de 12 semanas diseñado para ejecutivos.
No es coaching. Es biología.

Regulamos tu nervio vago, recuperas sueño profundo,
y vuelves a tener esas 4 horas de productividad focada que perdiste."

PROOF:
"Resultado promedio: +45% en regulación en 12 semanas.
Tiempo recuperado: 3-4 horas de work profundo por día.
De ejecutivos como tú: el 74% mejora en 30 días."

CTA:
[Haz tu diagnóstico — 3 minutos]
"Sin costo. Solo datos. Recibirás tu mapa de regulación en 2 minutos."

FAQ:
- ¿Cuánto dura el programa?
- ¿Necesito dejar mi trabajo?
- ¿Garantiza resultados?
- etc. (lenguaje PC: eficiencia, garantías, data)
```

**LANDING 2: Agotamiento directivo (Controlador Paralizado)**

```
HERO:
Headline: "Recupera el control — de tu cuerpo y tu tiempo"
Subheadline: "Un plan claro para ejecutivos que necesitan estructura y garantías"

PROBLEMA:
"Necesitas datos, no promesas. Tienes 100 cosas en la cabeza
y la presión de resolver todo. El sistema está paralizado.

¿Qué necesitas? Un plan. Un hito. Una garantía de que funciona."

SOLUCIÓN:
"LARS es un protocolo estructurado basado en biología nerviosa.
12 semanas. 5 dimensiones. Métricas semanales.

Sabrás exactamente qué hacer, por qué y cuándo.
Sin ambigüedad."

PROOF:
"Metodología: validada en 200+ diagnósticos.
Estructura: plan semanal + hitos.
Resultado: 85% llega al hito de Semana 4. 78% al de Semana 8."

CTA:
[Ver el plan (PDF) — 2 minutos]
"Descarga tu análisis + roadmap antes de decidir nada."

FAQ:
- ¿Cuál es exactamente la estructura?
- ¿Qué pasa cada semana?
- ¿Puedo auditarlo?
- etc. (lenguaje CP: estructura, hitos, certeza)
```

**LANDING 3: Desgaste emocional (Cuidador Exhausto)**

```
HERO:
Headline: "Tu bienestar es el bienestar de todos"
Subheadline: "Para las personas que cuidan y olvidaron cuidarse"

PROBLEMA:
"Llevas años priorizando a otros. Familia, trabajo, el que necesite ayuda.
Pero ahora tu cuerpo está diciendo basta. Culpa + agotamiento.

No puedes caer. Pero tampoco puedes seguir así."

SOLUCIÓN:
"LARS es para personas como tú. Miles han pasado por esto.
No estás sola.

Un protocolo que entiende que tu recuperación no es egoísmo—
es lo que tu familia necesita de ti."

PROOF:
"El 91% de personas como tú sienten cambio en 30 días.
El 79% reporta que duermen mejor en 2 semanas.
Historias: personas que volvieron a cuidar (y a vivir)."

CTA:
[Haz tu diagnóstico — 3 minutos]
"Confidencial. Solo tú ves tu resultado."

FAQ:
- ¿Necesito tiempo extra?
- ¿Puedo empezar mientras sigo con mis responsabilidades?
- ¿Es normal sentir culpa?
- etc. (lenguaje CE: normalización, permiso, comunidad)
```

**LANDING 4: Desregulación silenciosa (Fuerte Invisible)**

```
HERO:
Headline: "Los datos de tu desregulación"
Subheadline: "Análisis objetivo para personas que necesitan números"

PROBLEMA:
"No hablas de esto. Pero sabes que algo está mal.
Duermes mal. La digestión no funciona. Pero todo se ve 'normal' desde afuera.

Necesitas que alguien lo mire objetivamente."

SOLUCIÓN:
"LARS mide regulación nerviosa en 5 dimensiones.
Sin narrativa. Sin 'cómo te sientes'. Solo datos.

Recibirás un análisis que puedes auditar, comparar, entender."

PROOF:
"Usuarios FI: el 78% ve mejora >50% en 8 semanas.
Métrica: tu percentil vs población diagnosticada.
Datos: validados en investigación de neurorregulación."

CTA:
[Haz tu análisis — 3 minutos]
"Recibirás tu dashboard de datos completo."

FAQ:
- ¿De dónde vienen los datos?
- ¿Puedo descargar mi análisis?
- ¿Cómo se compara con normales?
- etc. (lenguaje FI: ciencia, objetividad, datos)
```

---

### Tarea 2: UTM tracking avanzado

Estructura de UTM:

```
utm_source = 'organic' | 'paid' | 'referral' | 'email' | 'social' | 'direct'
utm_medium = 'search' | 'cpc' | 'friend' | 'newsletter' | 'instagram' | ...
utm_campaign = 'burnout-ejecutivo' | 'agotamiento-directivo' | ...
utm_content = 'landing-page-1' | 'email-subject-line' | ...
utm_term = 'burnout ejecutivo' | 'agotamiento nervioso' | ... (solo para search)
```

**Ejemplos:**

```
/landing/burnout-ejecutivo?utm_source=organic&utm_medium=search&utm_term=burnout%20ejecutivo&utm_campaign=burnout-ejecutivo

/landing/agotamiento-directivo?utm_source=paid&utm_medium=cpc&utm_campaign=agotamiento-directivo&utm_content=google-ads-v1

/mapa/[hash]?utm_source=referral&utm_medium=friend&utm_campaign=amplify&utm_content=invite-link-12345

/landing/desgaste-emocional?utm_source=email&utm_medium=newsletter&utm_campaign=day-7-nurture&utm_content=email-subject-line
```

**Storage en BD:**

```
CREATE TABLE utm_data (
  id UUID PRIMARY KEY,
  diagnostic_id UUID (FK diagnosticos),
  utm_source VARCHAR,
  utm_medium VARCHAR,
  utm_campaign VARCHAR,
  utm_content VARCHAR,
  utm_term VARCHAR,
  landing_page VARCHAR,
  landing_visit_at TIMESTAMP,
  created_at TIMESTAMP
);
```

**Lógica:**

1. Usuario llega a landing con UTM
2. Guardar UTM en sessionStorage (persiste durante el gateway)
3. Al completar el gateway, guardar en tabla `utm_data`
4. En admin: ver fuentes de tráfico, canal más efectivo, etc.

---

### Tarea 3: Open Graph dinámico

Cuando alguien **comparte su resultado** (mapa vivo), la preview debe ser atractiva:

```
URL: https://lars.institutoepigenetico.com/mapa/abc123def456

Open Graph:
og:title = "{Nombre}, tu regulación nerviosa en 5 dimensiones"
og:description = "Regulación: 32/100 | Sueño: 28/100 | Energía: 25/100 | Atención: 29/100 | Digestión: 18/100. Haz el diagnóstico."
og:image = [dynamic image con score visual]
og:url = "https://lars.institutoepigenetico.com/mapa/abc123def456"
og:type = "website"

Twitter Card:
twitter:card = "summary_large_image"
twitter:title = "Mi resultado LARS"
twitter:description = "{Perfil}: Mejora +8 pts en 2 semanas"
twitter:image = [dynamic image]
```

**Imagen dinámica (Open Graph image):**

Mostrar un card visual con:
- Nombre del usuario (si lo quiere revelar, es opcional)
- 5 barras de las 5 dimensiones (colores según DESIGN.md)
- Score total
- Perfil (ej: "Fuerte Invisible")
- CTA: "Ver mi análisis y el tuyo"

Ejemplo visual:

```
┌─────────────────────────────────┐
│  TU REGULACIÓN NERVIOSA         │
│                                 │
│  Regulación: [████████░░] 32    │
│  Sueño:      [███████░░░] 28    │
│  Energía:    [██████░░░░] 25    │
│  Atención:   [███████░░░] 29    │
│  Digestión:  [█████░░░░░] 18    │
│                                 │
│  Perfil: Fuerte Invisible       │
│  Mejora: +8 pts en 2 semanas   │
│                                 │
│  lars.institutoepigenetico.com │
└─────────────────────────────────┘
```

**Generación:**

Usar librería como `sharp` (Node.js) o generar SVG server-side:

```typescript
// Pseudo-código
async function generateMapPreview(diagnostico) {
  const svg = `
    <svg width="1200" height="630" ...>
      <rect ... />
      <text x="100" y="100" ...>{diagnostico.nombre}</text>
      <rect y="150" width="${diagnostico.nervous_regulation * 10}" ... />
      ...
    </svg>
  `;

  // Convertir SVG a PNG
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  // Guardar en /public/og-images/[diagnostic_id].png
  fs.writeFileSync(`/public/og-images/${diagnostico.id}.png`, png);

  return `/og-images/${diagnostico.id}.png`;
}
```

En meta tags (SSR):

```html
<meta property="og:image" content="https://lars.institutoepigenetico.com/og-images/abc123.png">
```

---

### Tarea 4: Página de resultados SEO

Nueva ruta pública (sin login): `/resultados-colectivos`

Objetivo: Ser indexable por Google, generar tráfico orgánico, impulsar shares.

```
HERO:
Headline: "Los resultados reales de 1,247 ejecutivos con desregulación"
Subheadline: "Datos agregados y anónimos. Qué pasa cuando la gente se diagnostica."

SECCIÓN 1: NÚMEROS COLECTIVOS

"Después de 12 semanas de LARS:

- 91% reporta mejora en regulación nerviosa
- Mejora promedio: +45 puntos de 100
- 78% duerme mejor (en 30 días)
- Energía recuperada: 3-4 horas/día de productividad
- Retención: 89% completa el programa"

SECCIÓN 2: POR PERFIL

"Productivo Colapsado (428 personas):
- Mejora promedio: +48 puntos
- Tiempo productivo recuperado: 4+ horas/día
- Tasa de éxito: 94%

Fuerte Invisible (312 personas):
- Mejora promedio: +41 puntos
- Diagnóstico más valioso: datos objetivos
- Tasa de éxito: 89%

Cuidador Exhausto (387 personas):
- Mejora promedio: +43 puntos
- Cambio más importante: mejor sueño
- Tasa de éxito: 88%

Controlador Paralizado (120 personas):
- Mejora promedio: +44 puntos
- Hito clave: Semana 4 (85% alcanza)
- Tasa de éxito: 92%"

SECCIÓN 3: DIMENSIONES

"La regulación nerviosa se mejora en 5 dimensiones:

Sueño: +28 pts en promedio (cambio más rápido)
Regulación: +45 pts (el core)
Digestión: +12 pts (toma más tiempo)
Energía: +35 pts (segundo más rápido)
Atención: +22 pts (sigue a regulación)"

SECCIÓN 4: TIMELINE

"Cuándo ves cambios:

Semana 1: Efecto placebo bajo, datos sin cambio. Normal.
Semana 2-3: Primer cambio real (sueño comienza)
Semana 4: Hito clave (85% alcanza mejora notable)
Semana 8: Consolidación (cambios sostenibles)
Semana 12: Resultado final (promedio +45 pts)"

SECCIÓN 5: METODOLOGÍA

"Estos datos vienen de:

✓ 1,247 diagnósticos completos
✓ Reevaluaciones en día 7, 14, 30, 60, 90
✓ Anonimizado: no hay identidades
✓ Período: últimos 18 meses
✓ Base: análisis en 5 dimensiones de regulación

¿Quieres ver tu análisis?"

CTA:
[Haz tu diagnóstico]
"3 minutos. Datos reales. Sin datos personales."

FAQ:
- ¿Cómo se recolectaron estos datos?
- ¿Es sesgado?
- ¿Puedo ver mis propios datos?
```

**Meta tags para SEO:**

```html
<title>Resultados reales de 1,247 ejecutivos — LARS Programa</title>
<meta name="description" content="Datos agregados y anónimos sobre mejora de regulación nerviosa en 12 semanas. 91% de mejora promedio.">

<meta property="og:title" content="Resultados de 1,247 ejecutivos — LARS">
<meta property="og:description" content="Datos colectivos sobre regulación, sueño, energía en ejecutivos diagnosticados.">
<meta property="og:image" content="[imagen con gráficos de datos]">

<link rel="canonical" href="https://lars.institutoepigenetico.com/resultados-colectivos">
```

**Keyword targeting:**

```
"resultados programa regulación ejecutivos"
"burnout cómo se recuperan los ejecutivos"
"mejora sueño rendimiento empresarios"
"desregulación nerviosa síntomas ejecutivos"
```

---

### Tarea 5: Integración en admin

Dashboard `/admin/ignicion` (nuevo):

```
IGNICION — DISTRIBUCIÓN Y CRECIMIENTO

[FUENTES DE TRÁFICO — Últimos 30 días]

Organic search: 234 visitas (landing) → 28 diagnósticos (12% conversion)
Referral (amplify): 89 visitas → 16 diagnósticos (18% conversion)
Email (nurture): 156 visitas → 34 diagnósticos (22% conversion)
Paid (Google Ads): 78 visitas → 18 diagnósticos (23% conversion)
Social: 45 visitas → 6 diagnósticos (13% conversion)

[LANDING PAGES — Performance]

/landing/burnout-ejecutivo: 89 visitas → 18 diagnósticos (20%)
/landing/agotamiento-directivo: 56 visitas → 8 diagnósticos (14%)
/landing/desgaste-emocional: 67 visitas → 16 diagnósticos (24%)
/landing/desregulacion-silenciosa: 22 visitas → 4 diagnósticos (18%)

[TOP KEYWORDS (Organic Search)]

"burnout ejecutivo": 45 visitas
"regulación nerviosa": 38 visitas
"agotamiento ejecutivo": 34 visitas
"sueño ejecutivo": 28 visitas

[OPEN GRAPH — Shares]

Total shares en últimos 30 días: 127
Por perfil:
  PC: 34 shares (27%)
  FI: 41 shares (32%)
  CE: 38 shares (30%)
  CP: 14 shares (11%)

[PÁGINA DE RESULTADOS]

Visitas (últimos 30 días): 456
Bounce rate: 32% (bueno)
Average time on page: 3m 14s
Conversion a diagnóstico: 18 (3.9%)
SEO: Posición 1 para 2 keywords, posición 3 para 5 keywords
```

---

### Tarea 6: Tabla de tracking de distribución

```
CREATE TABLE distribution_tracking (
  id UUID PRIMARY KEY,
  event_type VARCHAR ('landing_visit', 'og_image_generated', 'share_detected', 'search_keyword'),
  source VARCHAR ('organic', 'paid', 'referral', 'email', 'social'),
  medium VARCHAR ('search', 'cpc', 'facebook', 'instagram', 'whatsapp', 'email', ...),
  keyword VARCHAR (opcional, para search),
  landing_page VARCHAR (opcional),
  diagnostic_id UUID (FK, opcional),
  utm_data JSONB,
  metadata JSONB,
  created_at TIMESTAMP
);
```

---

### Tarea 7: Consideraciones técnicas

**Open Graph image generation:**

- Generar imagen dinamicamente es lento. Cachear después de generar.
- Almacenar en `/public/og-images/[id].png`
- Si ya existe, servir del cache
- Regenerar cada 7 días (por si cambios en datos)

**SEO:**

- `/resultados-colectivos` debe estar en robots.txt (permitido)
- Sitemaps: incluir landing pages + resultados
- Structured data: usar Schema.org (Article, AggregateRating, etc.)

**Performance:**

- Landing pages: <2s load time
- Open Graph image: <500ms generation
- Página resultados: <1.5s load time

---

## INTELIGENCIA DEL SISTEMA

### Routing inteligente de landing (OBLIGATORIO)
Las 4 landings no son estáticas. El sistema detecta señales para mostrar la landing correcta:

1. **Query string:** Si alguien llega a `/landing/burnout-ejecutivo` pero su comportamiento sugiere CP (lee FAQ de estructura, pasa mucho tiempo en "¿Cuál es el plan?"), el gateway adapta el tono internamente.
2. **Referrer:** Si el tráfico viene de un artículo sobre "agotamiento por cuidar a otros", redirigir a `/landing/desgaste-emocional` aunque la URL sea genérica.
3. **Landing genérica:** Crear `/landing` (sin perfil) que detecta señales del visitante y redirige a la mejor landing. Si no hay señales → mostrar versión neutra con las 4 opciones: "¿Cuál de estos te suena más?"

### A/B testing en landings (OBLIGATORIO)
Aplicar el mismo principio de GATEWAY-APRENDE a las landings:
- Cada landing tiene 2 variantes de headline (Variante A = original, Variante B = alternativa)
- Asignación random 50/50
- Medir: visitas → diagnóstico completado → compra
- Dashboard en admin: "Landing burnout-ejecutivo: Variante A 18% conversión, Variante B 22% conversión (p=0.04)"
- Cuando hay ganador estadístico, el sistema sugiere a Javier en CO-LEARNING: "Variante B gana en burnout-ejecutivo. ¿Activar como default?"

### Sugerencia de link a Javier (OBLIGATORIO)
Cuando Javier está en el admin mirando un lead, el sistema le sugiere QUÉ landing compartir:
- Lead detectado como PC → "Link sugerido: lars.institutoepigenetico.com/landing/burnout-ejecutivo?utm_source=direct&utm_medium=javier"
- Lead detectado como FI → "Link sugerido: lars.institutoepigenetico.com/landing/desregulacion-silenciosa?utm_source=direct&utm_medium=javier"
- Botón [Copiar link] al lado de cada sugerencia
- Esto conecta con CO-LEARNING: cada vez que Javier usa un link sugerido y el lead convierte, el sistema aprende que la sugerencia fue correcta

### Open Graph evolutivo (OBLIGATORIO)
La imagen OG no es estática. Si la persona ha evolucionado:
- Día 0: "Mi regulación: 32/100" (con barras rojas/naranjas)
- Día 30: "Mi regulación: 57/100 (+25 pts)" (con barras mejorando, flecha verde)
- Día 90: "Mi regulación: 78/100 (+46 pts)" (con barras verdes, badge "Transformación")

Cada vez que alguien comparte su mapa actualizado, la preview refleja su PROGRESO, no solo su estado actual. Esto hace que cada share sea más potente que el anterior.

### Página de resultados como motor de credibilidad (OBLIGATORIO)
`/resultados-colectivos` no es solo SEO. Es un recurso que el sistema usa activamente:
- En emails de día 14: "Mira cómo otros ejecutivos como tú mejoraron: [Ver resultados colectivos →]"
- En el gateway (micro-espejo): "El 74% de ejecutivos con tu perfil mejoran en 30 días. [Ver datos →]"
- En la landing del perfil: el bloque "Social Proof" tira datos REALES de esta página (no hardcodeados)
- Los datos se actualizan automáticamente cada 24h desde el endpoint de COLECTIVA DINÁMICA

### Conexión con COLECTIVA DINÁMICA
Los datos de `/resultados-colectivos` vienen del mismo endpoint que alimenta el gateway y el mapa. NO son datos separados. Esto garantiza consistencia: el número que se ve en Google es el mismo que se ve en el gateway.

### Detección de keywords emergentes
El sistema trackea qué búsquedas de Google llevan a las landings (via Google Search Console API si disponible, o via UTM tracking):
- Si "burnout silencioso" empieza a generar tráfico → el sistema sugiere a Javier en CO-LEARNING: "Keyword emergente: 'burnout silencioso' (23 visitas/semana). Considerar crear landing específica."
- Esto cierra el loop: datos → decisión → acción → más datos

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin mostrarme el SQL antes.
- Las landing pages son públicas, pero el gateway sigue siendo el conversion point.
- Open Graph images no exponen datos sensibles (solo scores agregados).
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- `/resultados-colectivos` es pública (OK)
- Open Graph images no exponen datos individuales
- UTM data no contiene información sensible
- robots.txt: index sí para /resultados-colectivos, /landing/*, etc.

### 3. Calidad del código
- Cero console.log de debug
- Función reutilizable para generar Open Graph images
- Archivos < 400 líneas

### 4. Testing funcional
- Landing /burnout-ejecutivo: carga, contenido es PC-friendly
- Landing /agotamiento-directivo: carga, contenido es CP-friendly
- UTM tracking: captura correctamente, se guarda en BD
- Open Graph image: genera dinámicamente, se cachea
- Compartir mapa en WhatsApp: preview muestra imagen, score, perfil
- /resultados-colectivos: carga sin login, datos correctos, SEO tags presentes
- Mobile 375px: landing page responsive, página resultados responsive

### 5. Accesibilidad
- Landing pages: contrast ratio bueno, links accesibles
- Página resultados: headings semantic, table accessible

### 6. Performance
- Landing page: <2s load
- Open Graph image generation: <500ms
- Página resultados: <1.5s

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Landing pages usan DESIGN.md tokens. Misma paleta, tipografía.
**7b. Persuasión:** Copy de cada landing es calibrado al perfil (tono, lenguaje, CTA).
**7c. Claridad:** Open Graph image es visualmente clara (no amontonada).
**7d. Crédito:** Datos en `/resultados-colectivos` son transparentes (metodología clara).
**7e. Journey:** De landing → gateway es fluida (UTM se pasa automáticamente).

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/PROGRESS.md`:
   ```
   - ✅ **IGNICION — Sesión 1: Arquitectura de distribución** ({fecha}):
     - 4 landing pages por perfil, UTM tracking avanzado, Open Graph dinámico con imágenes, página de resultados SEO, admin dashboard de distribución, caching de imágenes
   ```
2. Commit final limpio.

**NOTA IMPORTANTE:** Las Skills `/ignition` y `/drift` de Alex proporcionan la estrategia de contenido y positioning. Esta sesión implementa la arquitectura técnica que ejecuta esa estrategia. Consultar con Alex sobre:
- Copy exacto de las landings
- Targeting de keywords
- Estrategia de social amplification
