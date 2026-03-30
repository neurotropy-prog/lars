# Session 2 — MapaAccordion + Section Adapters

## Objective
Create the accordion component for Zona 3 (Tu Mapa Completo) and adapt all Evolution section components to work as accordion content.

## Read First (mandatory)
- docs/REDISENO_MAPA_VIVO.md (sections on Zona 3)
- docs/DESIGN.md
- docs/ANIMATIONS.md
- src/app/mapa/[hash]/MapaClient.tsx (after Session 1 changes)
- All files in src/app/mapa/[hash]/sections/

## What Changes

### 1. NEW: MapaAccordion.tsx
Location: `src/app/mapa/[hash]/sections/MapaAccordion.tsx`

A clean accordion component where only ONE section is open at a time.

Props:
```typescript
interface AccordionSection {
  id: string
  title: string
  summary: string        // one-line right-side text
  badge?: 'nuevo' | 'pendiente' | 'completado' | null
  disabled?: boolean     // greyed out, not yet unlocked
  children: React.ReactNode
}

interface MapaAccordionProps {
  sections: AccordionSection[]
  defaultOpenId?: string  // which section starts open (from focus logic)
}
```

Behavior:
- Only ONE section open at a time
- Clicking an open section closes it
- Opening a section smoothly closes the previous one
- Disabled sections show title + "Disponible en X días" but can't open
- Animation: height transition 400ms ease-out-expo, content fades in 200ms

Each row shows:
- Left: title (Inter, text-body-sm, weight 600)
- Right: summary text (Inter, text-caption, color-text-tertiary) + badge if applicable
- Chevron (rotates 90° when open)
- Badge "NUEVO" = accent background pill, "PENDIENTE" = warning pill, "COMPLETADO" = success pill

Design:
- Each row: padding var(--space-4) var(--space-5)
- Border-bottom: var(--border-subtle) between rows
- Open section: bg var(--color-bg-secondary), content padding var(--space-5)
- Chevron: 12px, color-text-tertiary, transition 200ms

### 2. Section Adapters in MapaClient.tsx
In MapaClient's Zona 3, build the accordion sections array from evolution state:

```typescript
const accordionSections: AccordionSection[] = []

// Always present
accordionSections.push({
  id: 'evaluacion',
  title: 'Tu Evaluación',
  summary: `5 dimensiones · ${global}/100`,
  children: <>{/* dimension cards */}</>
})

// Day 3+
if (evolution.archetype.unlocked) {
  accordionSections.push({
    id: 'identidad',
    title: 'Tu Identidad',
    summary: archetype?.name ?? '',
    badge: evolution.archetype.isNew ? 'nuevo' : null,
    children: <EvolutionArchetype ... />
  })
}

// Day 7+
if (evolution.insightD7.unlocked) {
  // d7 insight integrates into evaluacion, but mark it
  // Update evaluacion summary to note the update
}

// Day 10+
if (evolution.session.unlocked) {
  accordionSections.push({
    id: 'sesion',
    title: 'Sesión con Javier',
    summary: evolution.session.viewed ? '✓ Agendada' : '20 min gratuitos',
    badge: !evolution.session.viewed ? 'pendiente' : 'completado',
    children: <EvolutionSession ... />
  })
}

// Day 14+
if (evolution.subdimensions.unlocked) {
  accordionSections.push({
    id: 'profundidad',
    title: 'Tu Profundidad',
    summary: subdimensionScores ? '3 subdimensiones' : '2 preguntas pendientes',
    badge: !subdimensionScores ? 'pendiente' : null,
    children: <EvolutionSubdimensions ... />
  })
}

// Day 21+
if (evolution.bookExcerpt.unlocked) {
  accordionSections.push({
    id: 'libro',
    title: 'Extracto del libro',
    summary: 'Capítulo personalizado',
    badge: evolution.bookExcerpt.isNew ? 'nuevo' : null,
    children: <EvolutionBookExcerpt ... />
  })
}

// Day 30+
if (evolution.reevaluation.unlocked) {
  accordionSections.push({
    id: 'evolucion',
    title: 'Tu Evolución',
    summary: reevaluations.length > 0
      ? `${reevaluations.length} reevaluación · +${delta} pts`
      : 'Reevaluación disponible',
    badge: evolution.reevaluation.isNew ? 'nuevo' : (!reevaluations.length ? 'pendiente' : null),
    children: <>{reevaluations.length > 0 && <EvolutionChart ... />}<EvolutionReevaluation ... /></>
  })
}
```

### 3. Determine defaultOpenId
The accordion should open the section that corresponds to the FocusBanner's focus:
- If FocusBanner focus = archetype → defaultOpenId = 'identidad'
- If FocusBanner focus = session → defaultOpenId = 'sesion'
- etc.
- First visit: defaultOpenId = 'evaluacion'

### 4. Future disabled sections
For sections not yet unlocked, show them as disabled teaser rows:
- Show the next 1-2 upcoming unlocks as disabled rows
- Text: "Disponible en X días" in summary position
- Greyed out, no chevron, not clickable
- This creates anticipation without revealing too much

## Design Specs
- Container: no extra background, sits in Zona 3 of MapaClient
- Section header height: ~56px
- Open transition: max-height animation + opacity fade
- Close transition: reverse, slightly faster (300ms)
- Disabled rows: opacity 0.4
- Badge pills: 3px 10px padding, radius-pill, text-caption, uppercase, letter-spacing 0.04em

## Verification
After completing:
1. Day 0: accordion shows only "Tu Evaluación" (open) — clean, not overwhelming
2. Day 3: accordion shows 2 sections, "Tu Identidad" has NUEVO badge
3. Day 14: accordion shows 4+ sections, only 1 open at a time
4. Day 90: accordion has all 6 sections, organized, not overwhelming
5. Opening/closing is smooth (height + fade animation)
6. Disabled teaser rows show for next unlocks
7. Badge colors are correct (nuevo=accent, pendiente=warning, completado=success)
8. Mobile 375px: accordion fits, touch targets adequate
9. FocusBanner CTA scrolls to and opens the correct accordion section
