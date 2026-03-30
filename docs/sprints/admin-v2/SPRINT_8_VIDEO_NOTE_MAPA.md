# Sprint 8 — Video con nota + Video en Mapa Vivo

## Objetivo
Dos mejoras al flujo de video personalizado:
1. Que Javi pueda escribir una nota que acompañe al video en el email (ahora solo llega un enlace seco)
2. Que el video se guarde y aparezca en el mapa vivo del cliente (dentro de un acordeón), no solo como email

## Dependencias
- Sprint 4 (LAM Actions — ya implementado)
- ActionVideo.tsx, ActionModal.tsx (ya existen)
- /api/admin/leads/[hash]/action/route.ts (ya existe)
- MapaClient.tsx + MapaAccordion (ya existe en el mapa vivo)

## Duración estimada
1 sesión de Claude Code

---

## FEATURE 1: Nota personalizada en el email del video

### Problema actual
Cuando Javi envía un video personalizado, el email que recibe el cliente contiene `body.content` que es la URL del video. No hay campo para escribir un mensaje personalizado. El email dice genéricamente "Javier ha grabado algo para ti" y el body es solo el enlace.

### Solución

#### 1. Añadir campo de nota en ActionVideo.tsx
**Archivo:** `src/components/admin/ActionVideo.tsx`

- Añadir un `<textarea>` debajo de la zona de upload de video
- Placeholder: "Escribe un mensaje que acompañe al video (opcional)"
- Max 500 caracteres con contador
- La nota se pasa al `onSubmit` junto con `videoUrl` y `notifyLead`

Cambiar la interfaz de `onSubmit`:
```tsx
// Antes:
onSubmit: (videoUrl: string, notifyLead: boolean) => void

// Después:
onSubmit: (videoUrl: string, notifyLead: boolean, note?: string) => void
```

#### 2. Actualizar ActionModal.tsx para pasar la nota
**Archivo:** `src/components/admin/ActionModal.tsx`

- El handler de video debe pasar la nota al body del POST a `/api/admin/leads/[hash]/action`
- Buscar la llamada que hace `fetch` con `type: 'video'` y añadir `note` al body

Cambiar el body del POST:
```json
{
  "type": "video",
  "content": "URL_DEL_VIDEO",
  "note": "Mensaje personalizado de Javi",
  "notify_lead": true
}
```

#### 3. Actualizar la API de action para manejar la nota del video
**Archivo:** `src/app/api/admin/leads/[hash]/action/route.ts`

- Aceptar campo `note` en el body (además de `content`)
- Guardar la nota en la `PersonalAction`:
  ```ts
  const action: PersonalAction = {
    type: body.type,
    content: body.content ?? '', // URL del video
    note: body.note ?? '',       // Nota personalizada
    created_at: new Date().toISOString(),
    notify_lead: body.notify_lead,
  }
  ```
- En el email HTML, si `body.type === 'video'` y hay `body.note`:
  - Primero mostrar la nota de Javi como párrafo
  - Luego el enlace al video (o al mapa, que es donde estará el video)

#### 4. Actualizar el tipo PersonalAction
**Archivo:** `src/lib/profile-intelligence.ts`

Añadir campo opcional `note`:
```ts
export interface PersonalAction {
  type: ActionType
  content: string
  note?: string        // ← NUEVO
  created_at: string
  notify_lead?: boolean
}
```

### Email HTML mejorado para video
Cuando `type === 'video'`:
```html
<!-- Nota de Javi -->
<p style="...">{note}</p>

<!-- Video embed o enlace -->
<p style="...">He grabado este video para ti:</p>
<a href="{videoUrl}">Ver video →</a>

<!-- CTA al mapa -->
<a href="{mapUrl}">Ver mi mapa</a>
```

---

## FEATURE 2: Video visible en el Mapa Vivo

### Problema actual
El video se guarda en `personal_actions` del diagnóstico pero NO se renderiza en el mapa vivo. El cliente solo puede verlo si abre el email. Si el email se pierde, el video se pierde.

### Solución

#### 1. Pasar personal_actions al MapaClient
**Archivo:** `src/app/mapa/[hash]/page.tsx`

- El server component ya hace un `select('*')` así que `personal_actions` ya está en `row`
- Pasarlo como prop a `MapaClient`:
  ```tsx
  <MapaClient
    data={...}
    personalActions={row.personal_actions ?? []}
  />
  ```

#### 2. Crear componente MapaPersonalContent.tsx
**Archivo:** `src/app/mapa/[hash]/sections/MapaPersonalContent.tsx`

- Recibe: `personalActions: PersonalAction[]`
- Filtra solo las acciones de tipo `video` y `personal_note` (las que tienen contenido visual para el cliente)
- Renderiza dentro de un acordeón "Mensajes de tu especialista" o similar
- Para cada video:
  - Si la URL es de Supabase storage → `<video>` tag con controls
  - Si es YouTube/Vimeo → embed iframe
  - Si es otra URL → enlace externo
  - Debajo del video: la nota de Javi (si existe)
  - Fecha de envío en texto sutil
- Para cada nota personal:
  - Card con el contenido de la nota
  - Fecha de envío
- Ordenados por fecha DESC (más reciente primero)

Diseño:
```
┌─ Mensajes de tu especialista ─────────────────┐
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │  [▶ VIDEO]                          │       │
│  │                                     │       │
│  └─────────────────────────────────────┘       │
│  "He revisado tu mapa y quiero que              │
│   entiendas algo sobre tu regulación..."        │
│                                                 │
│  Javier · hace 2 días                           │
│                                                 │
│  ─────────────────────────────────────          │
│                                                 │
│  ✍️ "Tu sueño es la dimensión que más          │
│   necesita atención. Te explico por qué..."     │
│                                                 │
│  Javier · hace 5 días                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3. Integrar en MapaClient.tsx
**Archivo:** `src/app/mapa/[hash]/MapaClient.tsx`

- Importar MapaPersonalContent
- Posicionar ANTES del acordeón de dimensiones (zona de alto impacto)
- Solo renderizar si hay al menos 1 acción de tipo video o personal_note
- Estilo: Card con borde izquierdo terracotta, fondo cálido sutil

#### 4. Video storage
**Ya resuelto:** El video se sube a Supabase Storage vía `/api/admin/upload` y la URL se guarda en `personal_actions[].content`. Solo necesitamos renderizarla.

---

## Archivos a crear
- `src/app/mapa/[hash]/sections/MapaPersonalContent.tsx`

## Archivos a modificar
- `src/components/admin/ActionVideo.tsx` — añadir textarea para nota
- `src/components/admin/ActionModal.tsx` — pasar nota al POST
- `src/app/api/admin/leads/[hash]/action/route.ts` — guardar nota, mejorar email HTML
- `src/lib/profile-intelligence.ts` — añadir `note?` a PersonalAction
- `src/app/mapa/[hash]/page.tsx` — pasar personal_actions a MapaClient
- `src/app/mapa/[hash]/MapaClient.tsx` — renderizar MapaPersonalContent

## Verificación
1. [ ] ActionVideo tiene textarea para nota con contador de caracteres
2. [ ] Al enviar video con nota, el email incluye la nota + enlace al video + CTA al mapa
3. [ ] Al enviar video sin nota, el email funciona como antes (retrocompatible)
4. [ ] La nota se guarda en personal_actions[].note en Supabase
5. [ ] El mapa vivo muestra sección "Mensajes de tu especialista" si hay videos/notas
6. [ ] Video se reproduce inline con `<video controls>` si es URL de Supabase
7. [ ] La nota personal se muestra debajo del video
8. [ ] Si no hay personal_actions relevantes, la sección no aparece
9. [ ] Responsive: video 100% width en mobile
10. [ ] `npx tsc --noEmit` pasa sin errores

## Prompt para Claude Code
```
Lee estos documentos ANTES de empezar (en este orden):
1. docs/sprints/admin-v2/SPRINT_8_VIDEO_NOTE_MAPA.md — este sprint completo
2. docs/DESIGN.md — tokens de diseño
3. src/components/admin/ActionVideo.tsx — componente actual de video
4. src/components/admin/ActionModal.tsx — modal que orquesta las acciones
5. src/app/api/admin/leads/[hash]/action/route.ts — API de acciones
6. src/lib/profile-intelligence.ts — tipos PersonalAction
7. src/app/mapa/[hash]/MapaClient.tsx — cliente del mapa vivo
8. src/app/mapa/[hash]/page.tsx — server component del mapa

CONTEXTO IMPORTANTE:
- Proyecto Next.js 15 con App Router + Supabase + TypeScript
- NUNCA ejecutes npm run build. Usa npx tsc --noEmit para verificar tipos
- El video ya se sube a Supabase Storage y la URL se guarda en personal_actions[].content
- El mapa vivo usa acordeones (MapaAccordion) — busca el patrón existente
- Inline styles, CSS variables de DESIGN.md
- Colores: terracotta #B45A32, fondo cálido #FFFBEF, cards #FFFFFF

TU TAREA: Ejecutar Sprint 8 — Video con nota + Video en Mapa Vivo.

1. Añadir campo de nota (textarea, 500 chars max) en ActionVideo.tsx
2. Actualizar ActionModal.tsx para pasar la nota al POST
3. Actualizar PersonalAction type en profile-intelligence.ts (añadir note?)
4. Actualizar /api/admin/leads/[hash]/action para:
   - Guardar la nota en personal_actions
   - Mejorar email HTML del video (nota + video + CTA mapa)
5. Crear MapaPersonalContent.tsx:
   - Filtra personal_actions tipo video y personal_note
   - Renderiza videos con <video controls> y notas en cards
   - Fecha de envío
   - Sección "Mensajes de tu especialista"
6. Integrar en MapaClient.tsx:
   - Pasar personal_actions desde page.tsx
   - Renderizar MapaPersonalContent antes de dimensiones
   - Solo si hay contenido relevante
7. npx tsc --noEmit
```
