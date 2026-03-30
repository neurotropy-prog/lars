# Session 1 — Zone Architecture + Focus Logic

## Objective
Restructure MapaClient.tsx from linear layout into 4-zone architecture and create FocusBanner.tsx for visit-aware focus.

## Read First (mandatory)
- docs/REDISENO_MAPA_VIVO.md (complete redesign spec)
- docs/DESIGN.md (design system)
- docs/ANIMATIONS.md (animation specs)
- src/app/mapa/[hash]/MapaClient.tsx (current implementation)
- src/app/mapa/[hash]/page.tsx (server component, data flow)

## What Changes

### 1. MapaClient.tsx — Zone Restructure
The render output must be reorganized into 4 clearly separated zones:

**ZONA 1 — TU ESTADO (always visible, top)**
- Score global with counter animation (keep existing 0→score animation)
- Score badge (Crítico/Moderado/En rango) with color
- If reevaluation exists: show before→after delta (27 → 45, +18 pts)
- `relativeTime(createdAt)` as secondary text
- This zone NEVER changes structure between visits — only data updates

**ZONA 2 — TU FOCO (visit-aware, below score)**
- Rendered by new `FocusBanner.tsx` component
- Shows ONE section expanded based on focus logic (see below)
- On first visit (day 0): skip FocusBanner, show dimension cards with existing progressive reveal

**ZONA 3 — TU MAPA COMPLETO (accordion, below focus)**
- Placeholder div with id="mapa-completo" — actual accordion built in Session 2
- For now: render all evolution sections inside this container with a simple wrapper

**ZONA 4 — TU CAMINO (bottom)**
- Placeholder for aspirational timeline — actual content built in Session 3
- For now: keep existing timeline + CTA + price section here

### 2. NEW: FocusBanner.tsx
Location: `src/app/mapa/[hash]/sections/FocusBanner.tsx`

Props:
```typescript
interface FocusBannerProps {
  evolution: EvolutionState
  lastVisitedAt?: string | null
  archetype: ArchetypeData | null
  d7Insight: string | null
  subdimensionConfig: SubdimensionConfig | null
  bookExcerpt: BookExcerptData | null
  worstDimensionName: string
  worstScore: number
  hasPaid: boolean
  hash: string
}
```

Focus selection logic (priority order):
1. Is there NEW content since `lastVisitedAt`?
   - Check each evolution section: if `unlocked && !viewed && unlockDate > lastVisitedAt` → that's the focus
   - Priority if multiple are new: archetype > d7Insight > session > subdimensions > bookExcerpt > reevaluation
2. Is there a PENDING action? (session unlocked but not booked, subdimensions unlocked but not completed, reevaluation available)
   → The pending action is the focus
3. Has the person NOT paid and CTA hasn't been focus recently?
   → "Tu camino" teaser as focus
4. Default: show "next unlock" teaser with days remaining

Each focus type renders a card with:
- Tag line (e.g., "NUEVO DESDE TU ÚLTIMA VISITA", "DISPONIBLE", "PROFUNDIZA TU EVALUACIÓN")
- Title
- 1-2 line description
- Single CTA button that either scrolls to the accordion section or expands it
- Design: bg-secondary background, subtle left border 3px var(--color-accent), rounded-lg

### 3. State Changes in MapaClient
- Remove `showTimeline`, `showPrice`, `showCTA` states (moved to Zona 4, always visible after reveal)
- Keep `displayScore`, `visibleDims`, `showPriority`, `showFirstStep` for Zona 1 + first-visit reveal
- Add `isFirstVisit` computed from `!lastVisitedAt`
- The progressive reveal (0-11s) only runs on first visit. Subsequent visits show score immediately.

### 4. First Visit vs Return Visit
- **First visit** (`!lastVisitedAt`): Full progressive reveal as today. Score animation → dimensions stagger → priority → first step → Zona 4 slides in. No FocusBanner.
- **Return visit** (`lastVisitedAt` exists): Score visible immediately (no counter animation). FocusBanner shows the focus. Accordion below. Zona 4 at bottom.

## Design Specs
- Zone separators: 48px vertical gap between zones
- Zona 1 background: var(--color-bg-primary)
- Zona 2 background: var(--color-bg-secondary) with left border 3px var(--color-accent)
- Zona 3/4: var(--color-bg-primary)
- All text follows DESIGN.md tokens
- Mobile-first 375px

## What Does NOT Change
- Score calculation logic
- Dimension card rendering (DimensionCard.tsx)
- Evolution section components (they stay as-is, just reorganized)
- Server component (page.tsx) — same data, same props
- map-evolution.ts
- Database schema

## Verification
After completing:
1. First visit (day 0): progressive reveal works exactly as before
2. Return visit (day 3+): score shows immediately, FocusBanner shows correct focus
3. All evolution sections still render in their zone
4. Mobile 375px: zones stack properly
5. Fast-forward to different days and verify focus changes appropriately
6. No regressions in existing functionality (Stripe, download PNG, share)
