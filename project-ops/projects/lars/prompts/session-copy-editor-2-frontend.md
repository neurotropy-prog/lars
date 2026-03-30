## Contexto
Proyecto: L.A.R.S.©
Sesión: Editor de Copy — Frontend completo + Integración

En la sesión anterior se creó:
- `src/lib/copy-defaults.ts` — Archivo centralizado con TODO el copy por defecto (landing + gateway + mapa)
- Tabla `copy_overrides` en Supabase
- API `/api/admin/copy` (GET/POST/DELETE) y `/api/copy` (pública con cache)
- Helper `src/lib/copy.ts` con `getCopy()`, `useCopy()`, `getCopyServer()`
- Página admin `/admin/copy` con estructura base, sidebar entry, y tabs Landing|Gateway|Mapa

Ahora hay que construir la experiencia de edición completa y conectar los componentes públicos.

## Documentos fundamentales (LEER ANTES de empezar)
- docs/VISION.md — Visión del producto
- docs/PROFILES.md — Los 4 perfiles de cliente
- docs/DESIGN.md — Sistema de diseño. NADA se inventa fuera de este doc.
- docs/features/FEATURE_LANDING_DESIGN.md — Copy de la landing (para el preview)
- docs/features/FEATURE_GATEWAY_DESIGN.md — Copy del gateway (para el preview)

## Lo que ya está construido
- Fases 0-9 + Admin v2 completo + Editor de emails + Todo lo de la sesión anterior
- **Referencia clave:** src/components/admin/EmailTemplateEditor.tsx — el editor de emails que ya funciona

## Tu tarea

### Tarea 1: Editor de Copy por Sección (`CopyEditor.tsx`)

Crea el componente principal de edición. Cuando Javier selecciona una sección (Landing, Gateway, o Mapa), ve las subsecciones organizadas como un acordeón colapsable:

**Landing:**
- Hero (shock, headline, subtítulo, micro-promesas)
- Espejo (headline, cuerpo)
- Tensión (3 stats con número + texto)
- Social Proof (testimonios)
- Alivio (headline, cuerpo, CTA)
- Footer

**Gateway:**
- P1: ¿Qué te trajo aquí? (pregunta + 5 opciones)
- P2: Sueño (5 opciones)
- P3: Síntomas cognitivos (6 opciones)
- P4: Estado emocional (6 opciones)
- Primera Verdad (variantes por combinación P1×P2 — esto es el más complejo, muchas combinaciones)
- Micro-espejo 1 (variantes)
- P5: Alegría de vivir (5 opciones con subtítulos)
- P6: Frase identitaria (5 opciones con subtítulos)
- Micro-espejo 2 (variantes por P6)
- P7: Sliders (labels de los 5 sliders)
- P8: Duración (4 opciones)
- Bisagra (textos de "Calculando..." y resultado)

**Mapa:**
- Focus Banner (variantes por estado)
- Aspiracional Timeline (5 puntos)
- Evoluciones día 3/7/14/21/30/90
- Sesión con Javier (textos)
- Dimensiones (labels + descripciones)

**UX del editor:**

1. **Cada campo editable muestra:**
   - Label descriptivo (ej: "Frase de impacto del hero")
   - Hint/tooltip con contexto (ej: "Lo primero que lee la persona al llegar")
   - El campo de edición (input corto / textarea mediano / textarea largo según `fieldType`)
   - Indicador visual si está personalizado (punto verde o badge "Editado")
   - Botón "Restaurar" individual por campo (solo si está personalizado) — con confirmación
   - El texto original visible en gris debajo cuando está personalizado ("Original: ...")

2. **Guardado:**
   - Auto-save con debounce de 1.5 segundos después de que Javier deja de escribir
   - Indicador sutil: "Guardado" / "Guardando..." / "Error al guardar"
   - NO requiere botón "Guardar" — el guardado es automático
   - Si el texto vuelve a ser igual al original, el override se borra automáticamente

3. **Búsqueda:**
   - Campo de búsqueda arriba que filtra por texto del copy O por label
   - Javier escribe "sueño" y ve todas las entradas que mencionan sueño
   - Highlight de la coincidencia en los resultados

4. **Restaurar sección completa:**
   - Botón "Restaurar toda la sección" por cada sección (Landing/Gateway/Mapa)
   - Confirmación seria: "¿Restaurar los X textos personalizados de esta sección a sus valores originales? Esta acción no se puede deshacer."

5. **Estadísticas de personalización:**
   - Header de cada sección: "Landing — 3 de 15 textos personalizados"
   - Header de cada subsección: "Hero — 2 de 4 editados"

### Tarea 2: Preview en vivo

Al lado derecho del editor (en desktop), mostrar un preview aproximado de cómo se ve el texto en contexto:

**Para Landing:**
- Preview simplificado del hero (fondo oscuro, texto centrado con la tipografía real)
- No necesita ser pixel-perfect, pero sí usar los colores y fuentes reales (Cormorant Garamond para headlines, Inter para body)
- Fondo #0B0F0E, texto claro, verde #4ADE80 para CTAs

**Para Gateway:**
- Preview de la pregunta actual con sus opciones
- Para Primera Verdad / Micro-espejos: preview del texto de reflexión

**Para Mapa:**
- Preview básico del texto en el contexto del mapa (fondo oscuro, tipografía correcta)

**El preview se actualiza en tiempo real** mientras Javier escribe (usa el estado local, no espera al save).

**En mobile:** El preview se oculta. Solo se muestra el editor. Opcionalmente un botón "Ver preview" que abre un modal.

### Tarea 3: Integrar componentes públicos con el sistema de copy

Ahora modifica los componentes del frontend público para que lean del sistema de copy:

**Landing components — Modificar para usar getCopy/useCopy:**
- `src/components/landing/HeroSection.tsx` — shock, headline, subtitle, micropromises
- `src/components/landing/MirrorSection.tsx` — headline, body
- `src/components/landing/TensionSection.tsx` — 3 stats
- `src/components/landing/SocialProofSection.tsx` — testimonials
- `src/components/landing/ReliefSection.tsx` — headline, body, CTA
- `src/components/landing/Footer.tsx` — text

**Gateway data files — Modificar para soportar overrides:**
- `src/lib/gateway-bloque1-data.ts` — Exportar funciones que acepten overrides como parámetro
- `src/lib/gateway-bloque2-data.ts` — Mismo patrón
- Los componentes del gateway que usan estas funciones deben pasar los overrides

**Mapa components:**
- `src/app/mapa/[hash]/sections/FocusBanner.tsx`
- `src/app/mapa/[hash]/sections/AspiracionalTimeline.tsx`
- `src/app/mapa/[hash]/sections/EvolutionArchetype.tsx`
- `src/app/mapa/[hash]/sections/EvolutionBookExcerpt.tsx`
- `src/app/mapa/[hash]/sections/EvolutionSubdimensions.tsx`
- `src/app/mapa/[hash]/sections/EvolutionReevaluation.tsx`
- `src/app/mapa/[hash]/sections/EvolutionSession.tsx`
- `src/app/mapa/[hash]/sections/DimensionCard.tsx`

**Patrón de integración:**

Para server components:
```typescript
// En el componente
import { getCopyServer } from '@/lib/copy'

export default async function HeroSection() {
  const copy = await getCopyServer()
  const shock = copy['hero.shock'] // Si hay override usa ese, si no el default
  // ...render con shock
}
```

Para client components:
```typescript
import { useCopy } from '@/lib/copy'

export default function P1Cards() {
  const { getCopy, isLoading } = useCopy()
  const question = getCopy('gateway.p1.question')
  // ...
}
```

**CRÍTICO:** Los cambios en componentes públicos NO deben cambiar el comportamiento visual cuando NO hay overrides. Todo debe verse exactamente igual que antes. Los defaults del código siguen funcionando como fallback — el override solo aplica cuando Javier ha personalizado algo.

### Tarea 4: Indicador global de personalización

En el sidebar del admin, junto a "Copy", mostrar un badge con el número total de textos personalizados (como notificación). Si es 0, no mostrar badge.

## Reglas críticas
- NO modifiques la base de datos — la migración ya se hizo en la sesión anterior.
- TODO el diseño viene de docs/DESIGN.md. No inventes valores.
- NUNCA ejecutes `npm run build` — usa `npx tsc --noEmit` para verificar tipos.
- Recuerda: no soy desarrollador. Explícame todo en lenguaje simple.
- Los cambios en componentes públicos son TRANSPARENTES — si no hay overrides, todo se ve idéntico a antes.
- El editor debe ser INTUITIVO para alguien no técnico. Javier es director de un instituto, no un desarrollador. Si algo requiere instrucciones para usarse, está mal diseñado.
- Auto-save es obligatorio. Nada de botones "Guardar" que Javier pueda olvidar.

## Validación obligatoria (ANTES de cada commit)

IMPORTANTE: No hagas commit de nada sin completar TODAS estas verificaciones.
Si alguna falla, arréglala y explícame qué encontraste y cómo lo solucionaste.

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- Cero secrets/API keys/tokens hardcodeados — todo en .env.local.
- .env.local en .gitignore (verificar).
- Todo input del usuario validado y sanitizado (XSS, injection).
- Los overrides de copy se sanitizan antes de renderizar en el frontend público.
- No permitir HTML/scripts en los campos de texto.

### 3. Calidad del código
- Cero console.log de debug, código comentado, o TODOs sin resolver.
- Cero lógica duplicada — si se repite, extraer a función/componente.
- Nombres descriptivos en inglés.
- Archivos < 300 líneas — si crece más, dividir.
- Imports ordenados, sin imports no utilizados.

### 4. Testing funcional
- Verificar CADA flujo:
  - Editar un texto → se guarda automáticamente → se ve en preview → se ve en la web pública
  - Restaurar un texto individual → vuelve al original → desaparece el badge "Editado"
  - Restaurar sección completa → todos vuelven al original
  - Buscar texto → filtra correctamente
  - Sin overrides → la web pública se ve EXACTAMENTE igual que antes (CRÍTICO)
  - Error de red → indicador de error, no se pierde el texto escrito
  - Reload de página → los overrides persisten (vienen de Supabase)

### 5. Accesibilidad
- Botones e inputs accesibles con teclado.
- Labels en todos los inputs.
- El acordeón se navega con teclado.
- Empty states diseñados.

### 6. Performance
- Los componentes públicos NO hacen fetch extra si no hay overrides.
- El fetch de overrides se hace UNA vez por page load, no por componente.
- El editor no re-renderiza toda la lista al editar un campo (virtualization o memoization).
- El auto-save tiene debounce real (no spamea la API).

### 7. Diseño y UX (OBLIGATORIO — tan importante como el código)

**7a. Sistema de diseño:**
- CERO valores hardcodeados.
- Se integra visualmente con el admin existente.
- Mismos patrones de acordeón, badges, indicadores que ya existen en el admin.

**7b. Los 5 estados:**
- Loading: skeleton de la lista de campos
- Vacío: "Todo el copy está usando los textos originales" (con icono)
- Parcial: algunos editados, algunos no — indicadores claros
- Lleno: muchos editados — no se siente caótico
- Error: mensaje de error por campo ("No se pudo guardar") y global

**7c. Interacciones:**
- Auto-save con feedback visual (guardado/guardando/error)
- Confirmación para restaurar (individual y por sección)
- Búsqueda instantánea con highlight
- Preview actualización en tiempo real
- Acordeón suave con animación

**7d. Arquitectura de pantalla:**
- Acción principal clara: editar texto
- Breadcrumb: Copy > Gateway > P1
- No hay callejones sin salida
- En mobile: editor a pantalla completa, sin preview (o preview en modal)

**7e. Para Javier específicamente:**
- Los labels son descriptivos en español ("Frase de impacto del hero", no "hero.shock")
- Los hints explican DÓNDE aparece ese texto y QUÉ efecto tiene
- El preview le muestra cómo queda SIN tener que ir a la web pública
- Restaurar es fácil y seguro (con confirmación)
- El conteo "3 de 15 editados" le da sensación de control

**7f. Primera impresión:**
- Cuando Javier entra por primera vez a /admin/copy, entiende en 3 segundos qué puede hacer
- El WOW: ve el preview actualizarse en tiempo real mientras escribe

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones (código Y diseño):
1. Actualiza `docs/PROGRESS.md` con resumen de lo construido.
2. Commit final limpio con mensaje descriptivo.
