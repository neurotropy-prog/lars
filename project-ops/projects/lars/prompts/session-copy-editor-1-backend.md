## Contexto
Proyecto: L.A.R.S.©
Sesión: Editor de Copy — Backend + Defaults + API + Estructura

El admin ya tiene un editor de emails (EmailTemplateEditor.tsx) que usa un patrón de defaults en TypeScript + overrides en Supabase. Ahora necesitamos extender ese patrón para que Javier pueda editar TODO el copy visible al usuario: landing, gateway y mapa vivo.

## Documentos fundamentales (LEER ANTES de empezar)
- docs/VISION.md — Visión del producto
- docs/PROFILES.md — Los 4 perfiles de cliente (PC, FI, CE, CP)
- docs/DESIGN.md — Sistema de diseño. NADA se inventa fuera de este doc.
- docs/features/FEATURE_LANDING_DESIGN.md — Copy exacto de la landing
- docs/features/FEATURE_GATEWAY_DESIGN.md — Copy exacto del gateway

## Lo que ya está construido
- Fases 0-9: Gateway completo (P1-P8), landing, mapa vivo, emails, analytics, admin v2 completo
- Admin v2 con 7 sprints: Hub, LAM, Automations, Analytics, Agenda, Tools, Disponibilidad
- Email Template Editor (src/components/admin/EmailTemplateEditor.tsx) — REFERENCIA CLAVE
- Patrón actual: src/lib/email-defaults.ts (defaults) + tabla email_templates (overrides) + API /api/admin/templates

## Referencia: cómo funciona el editor de emails (PATRÓN A REPLICAR)
El email editor tiene este patrón y funciona bien:
1. `src/lib/email-defaults.ts` — Archivo TypeScript con TODO el copy por defecto
2. Tabla `email_templates` en Supabase — Solo guarda overrides (lo que Javier ha personalizado)
3. API GET `/api/admin/templates` — Devuelve defaults + overrides mergeados
4. API POST `/api/admin/templates` — Guarda override de un template específico
5. Frontend muestra campos editables, preview, y botón "Restaurar original"
6. Flag `is_customized` para saber si algo fue editado

## Tu tarea

### Tarea 1: Crear archivo de defaults de copy (`src/lib/copy-defaults.ts`)

Crea un archivo centralizado con TODO el copy editable organizado por secciones. Este archivo es la fuente de verdad de los textos originales.

**Estructura requerida:**

```typescript
interface CopySection {
  id: string           // ej: "hero.shock", "gateway.p2.optionA"
  section: string      // ej: "landing", "gateway", "mapa"
  subsection: string   // ej: "hero", "p2", "evolution_d3"
  label: string        // nombre legible para Javier: "Frase de impacto del hero"
  defaultValue: string // el texto actual
  fieldType: 'short' | 'medium' | 'long'  // determina input vs textarea
  hint?: string        // ayuda contextual: "Este texto aparece en grande sobre el hero"
}
```

**Copy a incluir (extraer de los componentes existentes):**

**LANDING (src/components/landing/):**
- `hero.shock` — Frase shock del hero (HeroSection.tsx línea ~81)
- `hero.headline` — Headline principal (línea ~98)
- `hero.subtitle` — Subtítulo (líneas ~114-115)
- `hero.micropromises` — Micro-promesas "10 preguntas · 3 minutos · Sin registro previo" (línea ~135)
- `mirror.headline` — "Lo que sientes tiene nombre. Y tiene solución." (MirrorSection.tsx)
- `mirror.body` — Cuerpo del espejo (MirrorSection.tsx)
- `tension.stat1.number`, `tension.stat1.text` — Primera stat (TensionSection.tsx)
- `tension.stat2.number`, `tension.stat2.text` — Segunda stat
- `tension.stat3.number`, `tension.stat3.text` — Tercera stat
- `socialproof.testimonial1.quote`, `socialproof.testimonial1.author` — Testimonios (SocialProofSection.tsx)
- `socialproof.testimonial2.quote`, `socialproof.testimonial2.author`
- `relief.headline`, `relief.body`, `relief.cta` — Sección final (ReliefSection.tsx)
- `footer.text` — Footer (Footer.tsx)

**GATEWAY (src/lib/gateway-bloque1-data.ts + gateway-bloque2-data.ts):**
- `gateway.p1.question` — "¿Qué te trajo hasta aquí?"
- `gateway.p1.optionA` a `gateway.p1.optionE` — Las 5 opciones de P1
- `gateway.p2.optionA` a `gateway.p2.optionE` — Las 5 opciones de P2
- `gateway.p3.option1` a `gateway.p3.option6` — Las 6 opciones de P3
- `gateway.p4.optionA` a `gateway.p4.optionF` — Las 6 opciones de P4
- `gateway.p5.optionA` a `gateway.p5.optionE` — Las 5 opciones de P5 (con subtítulos)
- `gateway.p6.optionA` a `gateway.p6.optionE` — Las 5 frases identitarias de P6 (con subtítulos)
- `gateway.p7.slider1.label` a `gateway.p7.slider5.label` — Labels de los 5 sliders
- `gateway.p8.optionA` a `gateway.p8.optionD` — Las 4 opciones de P8
- `gateway.primeraverdad.AA` a todas las combinaciones P1×P2 — Textos de Primera Verdad (text + collectiveData)
- `gateway.microespejo1.*` — Variantes del micro-espejo 1
- `gateway.microespejo2.*` — Variantes del micro-espejo 2 (por P6)
- `gateway.bisagra.*` — Textos de la bisagra (calculando, score reveal)

**MAPA VIVO (src/app/mapa/[hash]/):**
- `mapa.focusbanner.*` — Textos del FocusBanner (por estado: NEW, PENDING, unpaid, teaser)
- `mapa.aspiracional.*` — Los 5 puntos de la AspiracionalTimeline
- `mapa.evolution.d3.*` — Textos de evolución día 3 (arquetipos)
- `mapa.evolution.d7.*` — Textos de evolución día 7
- `mapa.evolution.d14.*` — Textos de subdimensiones
- `mapa.evolution.d21.*` — Textos del extracto del libro
- `mapa.evolution.d30.*` — Textos de re-evaluación
- `mapa.evolution.d90.*` — Textos de re-evaluación trimestral
- `mapa.session.*` — Textos de la sección de sesión con Javier
- `mapa.dimension.*` — Labels y descripciones de las 5 dimensiones

**IMPORTANTE:** No inventes copy. Extrae el texto EXACTO de cada componente y archivo de datos. Si un texto tiene variantes (como primera verdad con combinaciones P1×P2), incluye CADA variante como entrada separada.

Cada entry necesita un `hint` claro para Javier que explique DÓNDE aparece y QUÉ efecto tiene. Javier no es técnico — los hints deben ser en español y descriptivos: "Esta frase aparece en grande sobre el hero, es lo primero que lee la persona."

### Tarea 2: Migración de base de datos

Crea una migración para la tabla `copy_overrides`:

```sql
CREATE TABLE copy_overrides (
  copy_key TEXT PRIMARY KEY,        -- ej: "hero.shock"
  value TEXT NOT NULL,               -- el texto personalizado
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by TEXT DEFAULT 'admin'    -- para futuro multi-user
);

-- RLS: solo lectura pública (el frontend lo lee), escritura solo admin
ALTER TABLE copy_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON copy_overrides FOR SELECT USING (true);
-- Write: por ahora sin auth (el admin no tiene auth), protegido por ruta
```

### Tarea 3: API Routes

Crea `/api/admin/copy`:

**GET** — Devuelve TODAS las entradas de copy, mergeando defaults + overrides:
```typescript
// Para cada default: si existe override en BD, usa ese valor
// Respuesta: { sections: { landing: [...], gateway: [...], mapa: [...] } }
// Cada entry: { id, label, defaultValue, currentValue, isCustomized, fieldType, hint }
```

**POST** — Guarda un override:
```typescript
// Body: { key: string, value: string }
// Si value === defaultValue, BORRA el override (restaurar original)
// Respuesta: { success: true, isCustomized: boolean }
```

**DELETE** — Restaura una sección completa:
```typescript
// Body: { section: string } // "landing" | "gateway" | "mapa"
// Borra TODOS los overrides de esa sección
```

**GET `/api/copy`** (ruta pública, sin /admin):
- Devuelve un mapa key→value optimizado para el frontend público
- Solo devuelve los overrides (las entradas no personalizadas usan el default del código)
- Con cache header: `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- Esto es lo que los componentes públicos consultan para saber si hay texto personalizado

### Tarea 4: Función helper para componentes públicos

Crea `src/lib/copy.ts`:
```typescript
// getCopy(key: string): string
// 1. Busca en el cache del fetch a /api/copy
// 2. Si hay override, devuelve override
// 3. Si no, devuelve default de copy-defaults.ts
//
// También: hook useCopy() para client components
// Y: función getCopyServer() para server components (fetch directo a Supabase)
```

**IMPORTANTE:** No modifiques los componentes públicos todavía. Eso se hace en la sesión siguiente. Solo deja el helper listo.

### Tarea 5: Página admin base

Crea `/admin/copy/page.tsx` con:
- Ruta nueva en el sidebar del admin (icono de texto/edición, entre "Automations" y "Agenda")
- Layout con navegación horizontal por secciones: Landing | Gateway | Mapa
- Conteo de "X textos personalizados" por sección (badge)
- Esqueleto de la página con loading states
- Breadcrumb: Copy > Landing > Hero (para saber dónde estás)

**Solo la estructura.** Los campos de edición y preview se hacen en la siguiente sesión.

## Reglas críticas
- NO modifiques la base de datos sin avisarme ANTES. Muéstrame la migración y espera aprobación.
- TODO el diseño viene de docs/DESIGN.md. No inventes valores.
- NUNCA ejecutes `npm run build` — usa `npx tsc --noEmit` para verificar tipos.
- Recuerda: no soy desarrollador. Explícame todo en lenguaje simple.
- El patrón es IDÉNTICO al de emails: defaults en TS + overrides en Supabase. Si tienes dudas, mira cómo funciona EmailTemplateEditor.tsx y replica la lógica.

## Validación obligatoria (ANTES de cada commit)

IMPORTANTE: No hagas commit de nada sin completar TODAS estas verificaciones.
Si alguna falla, arréglala y explícame qué encontraste y cómo lo solucionaste.

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- Cero secrets/API keys/tokens hardcodeados — todo en .env.local.
- .env.local en .gitignore (verificar).
- Todo input del usuario validado y sanitizado (XSS, injection).
- Endpoints API con autorización adecuada.
- Queries a Supabase con RLS policies que cubran el caso.
- Solo HTTPS para llamadas externas.

### 3. Calidad del código
- Cero console.log de debug, código comentado, o TODOs sin resolver.
- Cero lógica duplicada — si se repite, extraer a función/componente.
- Nombres descriptivos en inglés.
- Archivos < 300 líneas — si crece más, dividir.
- Imports ordenados, sin imports no utilizados.

### 4. Testing funcional
- Verificar CADA flujo que tocaste:
  - Happy path completo funciona.
  - Datos vacíos / inválidos manejados correctamente.
  - Error de red / API caída muestra estado de error.
  - Estados de loading visibles.

### 5. Accesibilidad
- Botones e inputs accesibles con teclado (Tab, Enter, Escape).
- Labels en todos los inputs.
- Empty states con icono + texto + CTA (no pantallas en blanco).

### 6. Performance
- No N+1 queries — verificar que no hay fetches en loops.
- La API pública /api/copy tiene cache headers correctos.
- copy-defaults.ts no se importa en bundles del cliente innecesariamente.

### 7. Diseño y UX (OBLIGATORIO — tan importante como el código)

**7a. Sistema de diseño — Consistencia absoluta:**
- CERO valores hardcodeados: colores, spacing, border-radius, sombras, tipografía — TODO viene del sistema de diseño.
- La nueva página de Copy se integra visualmente con el resto del admin (mismos patrones de Hub, LAM, Analytics).

**7b. Los 5 estados — TODOS diseñados:**
- Loading: skeleton para la lista de copy entries.
- Vacío: estado cuando no hay overrides ("Todo el copy está usando los textos originales").
- Error: mensaje si la API falla.

**7c. Navegación:**
- El sidebar muestra "Copy" como nueva entrada, con el icono correcto.
- Las tabs Landing | Gateway | Mapa funcionan y mantienen estado.
- Breadcrumb claro.

**7d. Consistencia con email editor:**
- El concepto de "personalizado vs original" se comunica igual que en emails.
- Misma lógica de is_customized, mismos patrones visuales.

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones (código Y diseño):
1. Actualiza `docs/PROGRESS.md` con resumen de lo construido.
2. Commit final limpio con mensaje descriptivo.
