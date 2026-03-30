# Sprint 4 — Acciones de Javi (LAM Actions)

## Objetivo
Implementar las 5 acciones que Javi puede tomar sobre un lead desde el admin, con templates pre-rellenados por perfil y entrega al mapa vivo + email.

## Dependencias
- Sprint 0 (profile-intelligence + API de acciones)
- Sprint 3 (LeadDetailPanel)

## Duración estimada
1 sesión de Claude Code

---

## Las 5 acciones

### 1. Nota personal
- **Esfuerzo de Javi:** 30 segundos
- **Qué hace:** Javi escribe (o edita template pre-rellenado) una nota que aparece en el mapa vivo del lead
- **En el mapa:** Card especial con borde terracotta, fondo --color-bg-secondary, firma de Javi
- **Email al lead:** "Javier ha dejado una nota personal en tu mapa" + link al mapa

### 2. Video personalizado
- **Esfuerzo de Javi:** 60-90 segundos
- **Qué hace:** Javi sube un video (grabado con móvil o webcam) desde el admin
- **En el mapa:** Player de video prominente en la zona Estado del mapa, con título "Mensaje personal del Dr. Martín Ramos"
- **Email al lead:** "Javier tiene un mensaje personal para ti" + link al mapa
- **Storage:** Vercel Blob (o Supabase Storage). El video se sube y se guarda la URL

### 3. Desbloqueo anticipado
- **Esfuerzo de Javi:** 1 clic
- **Qué hace:** Desbloquea la siguiente evolución del mapa antes del timing automático
- **En el mapa:** Badge "NUEVO" aparece, FocusBanner se actualiza
- **Email al lead:** "Tu mapa se ha actualizado con nueva información" + link

### 4. Sesión express (10 min)
- **Esfuerzo de Javi:** 1 clic + seleccionar slot
- **Qué hace:** Ofrece una sesión corta de 10 minutos al lead
- **En el mapa:** Card en zona Estado: "Javier te propone una conversación breve — sin compromiso"
- **Email al lead:** "Javier puede dedicarte 10 minutos esta semana" + link para agendar
- **Backend:** Crea un slot especial de 10 min en bookings (no la sesión estándar de 20)

### 5. Email manual
- **Esfuerzo de Javi:** 2-3 minutos
- **Qué hace:** Javi escribe un email personalizado (con template pre-rellenado por perfil)
- **En el mapa:** No aparece nada en el mapa
- **Email al lead:** Se envía directamente vía Resend

---

## UI: Modal de acción

Desde el panel lateral del LAM, el botón "Tomar acción" abre un modal centrado.

### Layout del modal

```
┌──────────────────────────────────────────────┐
│  Acción para maria@ejemplo.com               │
│  Productivo Colapsado · Score 28 · Día 8     │
│                                               │
│  Elige una acción:                            │
│                                               │
│  ┌─ ✍️  Nota personal ──────────────────────┐ │
│  │  Una nota que aparece en su mapa vivo.   │ │
│  │  30 segundos.                             │ │
│  └───────────────────────────────────────────┘ │
│                                               │
│  ┌─ 🎬 Video personalizado ─────────────────┐ │
│  │  Un video que aparece en su mapa.        │ │
│  │  60-90 segundos.                          │ │
│  └───────────────────────────────────────────┘ │
│                                               │
│  ┌─ 🔓 Desbloqueo anticipado ───────────────┐ │
│  │  Desbloquea contenido antes de tiempo.   │ │
│  │  1 clic.                                  │ │
│  └───────────────────────────────────────────┘ │
│                                               │
│  ┌─ 📞 Sesión express (10 min) ─────────────┐ │
│  │  Ofrece una llamada breve.               │ │
│  │  1 clic + elegir slot.                    │ │
│  └───────────────────────────────────────────┘ │
│                                               │
│  ┌─ 📧 Email manual ────────────────────────┐ │
│  │  Email personalizado directo.            │ │
│  │  2-3 minutos.                             │ │
│  └───────────────────────────────────────────┘ │
│                                               │
│  💡 Recomendado para este perfil: Video      │
│     (Razón del profile-intelligence)          │
│                                               │
└──────────────────────────────────────────────┘
```

La acción recomendada se destaca con borde terracotta y el texto de razón del profile-intelligence.

### Flujo de cada acción

#### Nota personal (al seleccionar):

```
┌──────────────────────────────────────────────┐
│  ✍️ Nota personal para maria@ejemplo.com     │
│                                               │
│  Template pre-rellenado (editable):           │
│  ┌───────────────────────────────────────────┐│
│  │ María, he revisado tu diagnóstico. Tu     ││
│  │ sistema nervioso está operando al 28%     ││
│  │ de su capacidad. No es cansancio — es un  ││
│  │ patrón fisiológico documentado. He        ││
│  │ trabajado con ejecutivos en tu misma      ││
│  │ situación. Hay un protocolo específico    ││
│  │ para esto.                                ││
│  │                                           ││
│  │ — Dr. Javier A. Martín Ramos             ││
│  └───────────────────────────────────────────┘│
│                                               │
│  ☑ Notificar por email                       │
│                                               │
│  [Cancelar]                    [Enviar nota]  │
└──────────────────────────────────────────────┘
```

**El template se pre-rellena con:**
- Nombre del lead (si disponible en email, sino "Hola")
- Score real del lead
- Texto del `note_templates` del perfil
- Variables reemplazadas: [Nombre], [score], [worstDim]

**Al enviar:**
1. POST a `/api/admin/leads/[hash]/action` con type: 'personal_note'
2. Se guarda en `personal_actions`
3. Se envía email si checkbox marcado
4. Confirmación: "Nota enviada ✓" (toast/feedback)
5. El panel lateral se actualiza mostrando la acción en "Acciones de Javi"

#### Video personalizado (al seleccionar):

```
┌──────────────────────────────────────────────┐
│  🎬 Video para maria@ejemplo.com             │
│                                               │
│  Sube un video grabado con tu móvil:         │
│  ┌───────────────────────────────────────────┐│
│  │                                           ││
│  │        📤 Arrastra o haz clic             ││
│  │        para subir video                   ││
│  │        (MP4, MOV · max 50MB)              ││
│  │                                           ││
│  └───────────────────────────────────────────┘│
│                                               │
│  💡 Guía para este perfil:                   │
│  "Habla de DATOS y RENDIMIENTO. 'He          │
│  analizado tu diagnóstico y hay un patrón    │
│  que veo en ejecutivos de tu perfil...'      │
│  Nunca de emociones. Sé directo."            │
│                                               │
│  ☑ Notificar por email                       │
│                                               │
│  [Cancelar]                   [Subir video]   │
└──────────────────────────────────────────────┘
```

**El hint de video** viene de `video_script_hint` del perfil.

**Al enviar:**
1. Upload video a storage (Vercel Blob preferido por simplicidad)
2. POST a `/api/admin/leads/[hash]/action` con type: 'video', content: videoUrl
3. Se guarda en `personal_actions`
4. Email al lead
5. Confirmación

#### Desbloqueo anticipado (al seleccionar):

```
┌──────────────────────────────────────────────┐
│  🔓 Desbloqueo para maria@ejemplo.com        │
│                                               │
│  Estado actual: Día 8 · Arquetipo ya visible │
│                                               │
│  Siguiente desbloqueo natural: Día 10        │
│  Contenido: Sesión con Javier (booking)       │
│                                               │
│  [Cancelar]              [Desbloquear ahora]  │
└──────────────────────────────────────────────┘
```

**Muestra:** qué se desbloqueará y cuándo habría ocurrido naturalmente.

**Al confirmar:**
1. POST a `/api/admin/leads/[hash]/action` con type: 'early_unlock'
2. Modifica `map_evolution` del lead para activar el siguiente step
3. Email al lead
4. Confirmación

#### Sesión express (al seleccionar):

```
┌──────────────────────────────────────────────┐
│  📞 Sesión express para maria@ejemplo.com    │
│                                               │
│  Duración: 10 minutos (sin compromiso)       │
│                                               │
│  Tus próximos slots disponibles:             │
│  ○ Mié 26 mar — 10:00                        │
│  ○ Mié 26 mar — 11:30                        │
│  ○ Jue 27 mar — 09:00                        │
│  ○ Jue 27 mar — 16:30                        │
│                                               │
│  (Se le enviarán estos slots para elegir)     │
│                                               │
│  [Cancelar]                  [Ofrecer sesión] │
└──────────────────────────────────────────────┘
```

**Al confirmar:**
1. POST con type: 'express_session'
2. Email al lead con los slots disponibles + link de booking
3. Aparece en su mapa vivo como oferta

#### Email manual (al seleccionar):

```
┌──────────────────────────────────────────────┐
│  📧 Email para maria@ejemplo.com             │
│                                               │
│  Asunto:                                      │
│  ┌───────────────────────────────────────────┐│
│  │ Sobre tu diagnóstico                      ││
│  └───────────────────────────────────────────┘│
│                                               │
│  Mensaje (template pre-rellenado):           │
│  ┌───────────────────────────────────────────┐│
│  │ (template del perfil, editable)           ││
│  └───────────────────────────────────────────┘│
│                                               │
│  [Cancelar]                   [Enviar email]  │
└──────────────────────────────────────────────┘
```

---

## Cambios en el mapa vivo

### Nuevo componente: `PersonalNote.tsx`

Se renderiza en la zona Estado del mapa si el lead tiene una nota personal.

```tsx
// Estilo: card con borde izquierdo terracotta, fondo secondary, firma
<div style={{
  padding: '20px 24px',
  background: 'var(--color-bg-secondary)',
  borderLeft: '3px solid var(--color-accent)',
  borderRadius: 'var(--radius-md)',
}}>
  <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{note.content}</p>
  <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '12px' }}>
    — Dr. Javier A. Martín Ramos
  </p>
</div>
```

### Nuevo componente: `PersonalVideo.tsx`

Player de video en la zona Estado del mapa.

```tsx
// Card prominente con video player nativo
<div>
  <p style={{ overline }}>MENSAJE PERSONAL</p>
  <h3>Dr. Javier A. Martín Ramos</h3>
  <video src={videoUrl} controls poster={thumbnailUrl} style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
</div>
```

### Nuevo componente: `ExpressSessionOffer.tsx`

Card de oferta de sesión express en la zona Estado.

---

## Archivos a crear
- `src/components/admin/ActionModal.tsx` — Modal principal con selector de acción
- `src/components/admin/ActionNote.tsx` — Formulario de nota personal
- `src/components/admin/ActionVideo.tsx` — Upload de video
- `src/components/admin/ActionUnlock.tsx` — Desbloqueo anticipado
- `src/components/admin/ActionExpressSession.tsx` — Oferta de sesión express
- `src/components/admin/ActionEmail.tsx` — Email manual
- `src/components/mapa/PersonalNote.tsx` — Nota en mapa vivo
- `src/components/mapa/PersonalVideo.tsx` — Video en mapa vivo
- `src/components/mapa/ExpressSessionOffer.tsx` — Oferta sesión en mapa vivo
- `src/app/api/admin/upload/route.ts` — Upload de video (Vercel Blob)

## Archivos a modificar
- `src/components/admin/LeadDetailPanel.tsx` — Añadir botón "Tomar acción"
- `src/app/mapa/[hash]/MapaClient.tsx` — Renderizar PersonalNote/Video/ExpressSession si existen en personal_actions
- `src/app/mapa/[hash]/page.tsx` — Pasar personal_actions al client component

## Criterios de aceptación
- [ ] Modal de acción se abre desde el panel lateral del LAM
- [ ] Las 5 acciones funcionan end-to-end (admin → DB → mapa → email)
- [ ] Templates pre-rellenados usan profile-intelligence con variables reemplazadas
- [ ] Video se sube correctamente y se reproduce en el mapa
- [ ] Nota personal aparece en el mapa con estilo correcto
- [ ] Desbloqueo anticipado actualiza map_evolution
- [ ] Sesión express muestra slots disponibles
- [ ] Email manual se envía via Resend
- [ ] Checkbox "Notificar por email" funciona
- [ ] Feedback de confirmación después de cada acción (toast)
- [ ] `npx tsc --noEmit` pasa sin errores

---

## PROMPT PARA CLAUDE CODE

```
Lee estos documentos ANTES de empezar (en este orden):

1. docs/sprints/admin-v2/00_MASTER_PLAN.md — contexto general
2. docs/sprints/admin-v2/SPRINT_4_ACTIONS.md — este sprint completo
3. docs/DESIGN.md — tokens de diseño
4. src/lib/profile-intelligence.ts — templates y hints por perfil
5. src/lib/email.ts — templates de email actuales (patrón a seguir para emails de acción)
6. src/app/mapa/[hash]/MapaClient.tsx — mapa vivo actual (donde renderizar notas/videos)
7. src/app/mapa/[hash]/page.tsx — page del mapa (para pasar personal_actions)
8. src/components/admin/LeadDetailPanel.tsx — panel lateral (donde va el botón "Tomar acción")
9. src/app/api/admin/leads/[hash]/action/route.ts — API de acciones (Sprint 0)
10. src/lib/map-evolution.ts — lógica de evolución del mapa (para desbloqueo anticipado)

CONTEXTO IMPORTANTE:
- Proyecto Next.js 15 con App Router + TypeScript
- NUNCA ejecutes npm run build. Usa npx tsc --noEmit
- Los templates pre-rellenados son CRUCIALES. Javi no escribe desde cero — edita un borrador calibrado a cada perfil
- Variables en templates: [Nombre] (extraer del email antes del @, capitalizar), [score] (global), [worstDim] (nombre de dimensión más baja)
- Para video upload: usa Vercel Blob (@vercel/blob) si está disponible, sino Supabase Storage. El video no puede ser mayor de 50MB.
- Los componentes del mapa (PersonalNote, PersonalVideo, ExpressSessionOffer) deben seguir EXACTAMENTE el estilo del mapa vivo v3 (ver MapaClient.tsx)
- Emails de acción siguen el template base de buildEvolutionEmail() en email.ts
- Inline styles, CSS variables de DESIGN.md

TU TAREA: Ejecutar Sprint 4 — Acciones de Javi.

1. Crear modal de selección de acción (ActionModal.tsx) con las 5 opciones
2. Crear formulario para cada acción (ActionNote, ActionVideo, ActionUnlock, ActionExpressSession, ActionEmail)
3. Implementar upload de video (/api/admin/upload/route.ts)
4. Crear componentes de mapa vivo (PersonalNote, PersonalVideo, ExpressSessionOffer)
5. Integrar en MapaClient.tsx: si el lead tiene personal_actions, renderizar los componentes correspondientes en la zona Estado
6. Integrar en LeadDetailPanel: botón "Tomar acción" + historial de acciones previas
7. Emails de notificación para cada acción (seguir patrón de email.ts)
8. npx tsc --noEmit

REGLA: Los templates pre-rellenados no son genéricos. Son ESPECÍFICOS al perfil. El template para Productivo Colapsado habla de rendimiento y datos. El de Cuidador Exhausto habla de permiso y responsabilidad. El de Fuerte Invisible habla de biología. El de Controlador Paralizado habla de estructura y garantías. Si el template no está calibrado al perfil, no funciona.
```
