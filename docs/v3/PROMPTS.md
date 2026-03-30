# CLAUDE CODE PROMPTS — V3 Mapa Vivo Redesign

> Copy/paste each prompt into Claude Code in order.
> Each prompt = 1 session. Wait for completion before starting the next.
> **IMPORTANT: Create a `v3` branch before starting.**

---

## PROMPT 0 — Repository Verification + Branch Setup

```
SAFETY CHECK — Run this FIRST before doing anything:

Run: git remote -v

You MUST see: github.com/neurotropy-prog/lars.git
If you see ANY other repository, STOP immediately and tell me. Do NOT proceed.

Once confirmed, create a new git branch called `v3/mapa-vivo-redesign` from the current main branch. Switch to it.

Do NOT modify the main branch. All work happens on v3/mapa-vivo-redesign.

After creating the branch, run: git branch --show-current
Confirm it says v3/mapa-vivo-redesign.
```

---

## PROMPT 1 — Zone Architecture + Focus Logic

```
Read these files first:
- docs/REDISENO_MAPA_VIVO.md (complete redesign spec — read ALL of it)
- docs/v3/sessions/SESSION_1_ZONE_ARCHITECTURE.md (this session's detailed spec)
- docs/DESIGN.md (design system tokens)
- docs/ANIMATIONS.md (animation specs)
- src/app/mapa/[hash]/MapaClient.tsx (current implementation ~1160 lines)
- src/app/mapa/[hash]/page.tsx (server component, props flow)

Then implement the 4-zone restructure of the mapa vivo.

TASK 1 — Restructure MapaClient.tsx into 4 zones:

ZONA 1 — TU ESTADO (always top):
- Score global with counter animation (keep existing)
- Score badge (Crítico/Moderado/En rango) with color
- If reevaluation exists: show before→after delta
- relativeTime as secondary text

ZONA 2 — TU FOCO (below score):
- New FocusBanner component (see Task 2)
- Only shows on RETURN visits (when lastVisitedAt exists)
- First visit (no lastVisitedAt): skip FocusBanner, show dimension cards with existing progressive reveal

ZONA 3 — TU MAPA COMPLETO (below focus):
- For now: wrap all evolution sections in a container div with id="mapa-completo"
- The accordion component will be built in Session 2

ZONA 4 — TU CAMINO (bottom):
- For now: keep existing timeline + CTA + price here
- Will be replaced in Session 3

TASK 2 — Create FocusBanner.tsx at src/app/mapa/[hash]/sections/FocusBanner.tsx

This component determines WHAT to show based on visit-aware logic:

Priority order:
1. NEW content since lastVisitedAt? → Show that section as focus
   (priority: archetype > d7Insight > session > subdimensions > bookExcerpt > reevaluation)
2. PENDING action? (session not booked, subdimensions not completed, reevaluation available) → Show that
3. User hasn't paid? → "Tu camino" teaser
4. Default → "Next unlock" teaser with days remaining

Each focus renders a card with:
- Tag line (e.g., "NUEVO DESDE TU ÚLTIMA VISITA")
- Title
- 1-2 line description
- CTA button
- Design: bg-secondary, 3px left accent border, rounded-lg

TASK 3 — First visit vs return visit logic:

First visit (!lastVisitedAt):
- Full progressive reveal: 0s score → 2-6s dimensions → 7s priority → 8s first step → 9.5s Zona 4
- No FocusBanner

Return visit (lastVisitedAt exists):
- Score visible immediately (NO counter animation)
- FocusBanner shows the focus
- Everything else visible immediately

Remove showTimeline/showPrice/showCTA states — Zona 4 is always visible on return visits.
Add isFirstVisit computed from !lastVisitedAt.

DESIGN SPECS:
- 48px vertical gap between zones
- Zona 2 card: bg var(--color-bg-secondary), left border 3px var(--color-accent), rounded-lg
- All text uses DESIGN.md tokens. No hardcoded values.
- Mobile-first 375px

VERIFICATION — After implementing:
1. First visit (day 0): progressive reveal works exactly as before
2. Return visit (day 3+): score shows immediately, FocusBanner shows correct focus
3. All evolution sections still render in Zona 3
4. Mobile 375px: zones stack properly
5. No regressions: Stripe checkout, download PNG, share link all work
6. No console errors
```

---

## PROMPT 2 — MapaAccordion + Section Adapters

```
Read these files first:
- docs/v3/sessions/SESSION_2_ACCORDION.md (this session's detailed spec)
- docs/REDISENO_MAPA_VIVO.md (Zona 3 sections)
- docs/DESIGN.md
- src/app/mapa/[hash]/MapaClient.tsx (after Session 1 changes)
- All files in src/app/mapa/[hash]/sections/

Then implement the accordion for Zona 3.

TASK 1 — Create MapaAccordion.tsx at src/app/mapa/[hash]/sections/MapaAccordion.tsx

Behavior:
- Only ONE section open at a time
- Opening a section smoothly closes the previous one
- Clicking an open section closes it
- Disabled sections (not yet unlocked) show title + "Disponible en X días" but can't open
- Animation: height 400ms ease-out-expo, content opacity 200ms

Each row shows:
- Left: title (Inter, text-body-sm, weight 600)
- Right: summary (text-caption, color-text-tertiary) + badge
- Chevron rotates 90° when open
- Badges: "NUEVO" = accent pill, "PENDIENTE" = warning pill, "COMPLETADO" = success pill

Design:
- Row padding: var(--space-4) var(--space-5)
- Border-bottom: var(--border-subtle)
- Open content: bg var(--color-bg-secondary), padding var(--space-5)
- Disabled rows: opacity 0.4

TASK 2 — Build accordion sections array in MapaClient.tsx

In Zona 3, replace the wrapped evolution sections with MapaAccordion:

Always present:
- "Tu Evaluación" — 5 dimensiones · {score}/100 → dimension cards as children

Day 3+ (evolution.archetype.unlocked):
- "Tu Identidad" — {archetype name} → EvolutionArchetype as children
- Badge: NUEVO if isNew

Day 10+ (evolution.session.unlocked):
- "Sesión con Javier" — "20 min gratuitos" or "✓ Agendada"
- Badge: PENDIENTE if not viewed, COMPLETADO if viewed

Day 14+ (evolution.subdimensions.unlocked):
- "Tu Profundidad" — "2 preguntas pendientes" or "3 subdimensiones"
- Badge: PENDIENTE if not completed

Day 21+ (evolution.bookExcerpt.unlocked):
- "Extracto del libro" — "Capítulo personalizado"
- Badge: NUEVO if isNew

Day 30+ (evolution.reevaluation.unlocked):
- "Tu Evolución" — reevaluation count + delta or "Reevaluación disponible"
- Badge: NUEVO/PENDIENTE accordingly

TASK 3 — defaultOpenId from focus logic

The accordion auto-opens the section that matches FocusBanner's current focus.
If FocusBanner focus = archetype → open "identidad"
If FocusBanner focus = session → open "sesion"
First visit → open "evaluacion"

TASK 4 — Disabled teaser rows

Show the next 1-2 upcoming (not yet unlocked) sections as disabled rows:
- Greyed out, no chevron, not clickable
- Summary: "Disponible en X días"
- Creates anticipation

VERIFICATION — After implementing:
1. Day 0: only "Tu Evaluación" in accordion — clean
2. Day 3: 2 sections, "Tu Identidad" has NUEVO badge
3. Day 14: 4+ sections, only 1 open at a time
4. Day 90: all 6 sections, organized, not overwhelming
5. Open/close animation is smooth
6. Badges show correct colors
7. Disabled rows show for upcoming unlocks
8. Mobile 375px: touch targets adequate, fits well
9. FocusBanner CTA scrolls to correct accordion section
```

---

## PROMPT 3 — Timeline Aspiracional + CTA Contextual

```
Read these files first:
- docs/v3/sessions/SESSION_3_TIMELINE.md (this session's detailed spec)
- docs/REDISENO_MAPA_VIVO.md (Zona 4 sections)
- docs/DESIGN.md
- src/app/mapa/[hash]/sections/EvolutionTimeline.tsx (current — to be replaced)
- src/app/mapa/[hash]/MapaClient.tsx (Zona 4 section)

Then replace the system-language timeline with a client transformation timeline.

TASK 1 — Create AspiracionalTimeline.tsx (replaces EvolutionTimeline.tsx)

NEW timeline — 5 points in CLIENT language:

"TU CAMINO DE REGULACIÓN"

HOY — Tu punto de partida: {score}/100. Tu sistema nervioso necesita atención.
SEMANA 1 — Tu cuerpo nota la diferencia. Protocolo de Sueño de Emergencia. Resultados en 72 horas.
SEMANA 4 — Tu primer balance real. Reevaluación completa. Medirás cuánto ha cambiado tu biología.
SEMANA 8 — Los patrones cambian. Desmontar las creencias que sostienen el ciclo.
SEMANA 12 — Tu nueva arquitectura vital. Límites, vínculos, sistema de alertas. El burnout no vuelve.

"HOY" updates based on daysSinceCreation:
- Day 0: "Tu punto de partida: {score}/100"
- Day 7+: "Llevas {days} días. Tu mapa sigue evolucionando."
- Day 30+: Shows reevaluation score if available, or "Es hora de reevaluar."

Design:
- Title: Lora, text-h3, weight 700
- Timeline line: 2px solid accent at 15% opacity, left side
- "HOY" dot: 10px, filled accent, 2s pulse animation
- Future dots: 8px, hollow border only
- Point spacing: var(--space-8)

TASK 2 — Below timeline, one subtle line:
"Tu mapa también evoluciona: cada semana aparece algo nuevo — tu perfil profundo, insights colectivos, reevaluaciones. Vuelve cuando quieras."
Inter, text-caption, color-text-tertiary.

TASK 3 — CTA contextual:

If NOT paid:
"Tu regulación es un proceso de 12 semanas. Tu primer paso son los próximos 7 días."
Button: "Empieza la Semana 1" — primary pill style (accent bg, dark text, full-width max 400px)
Below: "97€ · Protocolo de Sueño + Sesión 1:1 + MNN©"
Below: "Garantía: si tu sueño no mejora en 7 días, devolución íntegra."
Wire to existing handleStripeCheckout in MapaClient.

If PAID:
"Tu Semana 1 está en marcha. Revisa tu email para el Protocolo de Sueño de Emergencia."
No button.

TASK 4 — Remove old Zona 4 content from MapaClient:
- Old EvolutionTimeline component usage
- Old 3-phase cards (Fase Inmediata / Estabilización / Profundización)
- Old price reframe section
- Old urgency text block
- Keep handleStripeCheckout function — wire to new CTA

VERIFICATION — After implementing:
1. Timeline shows 5 aspirational points, NOT system events
2. "HOY" dot has accent color with pulse
3. CTA says "Empieza la Semana 1" for non-paid
4. CTA hidden for paid users, shows confirmation
5. Stripe checkout works from new CTA
6. Old timeline/phase cards/price reframe are completely gone
7. Mobile 375px: timeline readable, CTA full-width
```

---

## PROMPT 4 — Archetype Focus Mode + Puentes Removal

```
Read these files first:
- docs/v3/sessions/SESSION_4_ARCHETYPE_PUENTES.md (this session's detailed spec)
- docs/REDISENO_MAPA_VIVO.md (archetype + puentes sections)
- docs/DESIGN.md
- src/app/mapa/[hash]/sections/EvolutionArchetype.tsx
- src/app/mapa/[hash]/sections/DimensionCard.tsx
- src/app/mapa/[hash]/MapaClient.tsx (PUENTES object)

Then implement archetype dual-mode and remove puentes.

TASK 1 — Add mode prop to EvolutionArchetype.tsx

Two modes:

SUMMARY MODE (for FocusBanner):
- Tag: "NUEVO DESDE TU ÚLTIMA VISITA" or "TU IDENTIDAD"
- Archetype name: Lora, text-h3, weight 700
- ONE impact phrase (the most powerful sentence from the archetype)
- CTA: "Descubrir tu perfil completo →"
- Profile-aware: for Fuerte Invisible archetype, use biology-first language, no emotional wound

FULL MODE (for accordion):
- Keep existing complete display unchanged
- Name, traits, narrative, beliefs, wound/armor, expandables

Add to props:
- mode: 'summary' | 'full'
- onExpandRequest?: () => void (for summary CTA click)

TASK 2 — Update FocusBanner to use summary mode

When archetype is the focus, FocusBanner renders:
<EvolutionArchetype mode="summary" onExpandRequest={scrollToAccordion} ... />

TASK 3 — Remove PUENTES completely

In MapaClient.tsx:
- DELETE the entire PUENTES constant object
- Remove all puente={PUENTES.pX} props from DimensionCard renders

In DimensionCard.tsx:
- Remove `puente` from Props interface
- Remove the puente rendering block at bottom
- Remove any "mapa-puente" CSS class references

Grep the entire codebase for "puente", "PUENTES", "mapa-puente" — remove all traces.

WHY: Puentes are sales copy disguised as insights ("Este mapa es una foto fija. El programa lo convierte..."). They break trust. The accordion's PENDIENTE badges create genuine desire to explore without manipulation.

VERIFICATION — After implementing:
1. FocusBanner shows archetype in summary mode: name + ONE phrase + CTA
2. Accordion shows archetype in full mode: complete profile
3. Clicking "Descubrir perfil completo" scrolls to and opens accordion section
4. ZERO puente text anywhere on the page
5. grep -r "puente\|PUENTES\|mapa-puente" src/ returns nothing
6. DimensionCard is clean — no italic text at bottom
7. Mobile 375px: summary fits, phrase is readable
```

---

## PROMPT 5 — Polish + Fast-Forward Verification

```
Read these files first:
- docs/v3/sessions/SESSION_5_POLISH.md (this session's detailed spec)
- docs/REDISENO_MAPA_VIVO.md (verification section at bottom)
- docs/DESIGN.md
- docs/ANIMATIONS.md
- src/lib/map-evolution.ts (evolution thresholds)
- src/app/api/admin/fast-forward/route.ts (testing tool)

This is the final session. Polish everything and verify every state.

PART A — VISUAL POLISH

Check and fix:
1. FocusBanner entrance: fade-in-up, 400ms, ease-out-expo
2. Accordion open/close: height 400ms + opacity 200ms
3. Badge pills: scale-in 200ms when first appearing
4. AspiracionalTimeline points: 150ms stagger on scroll (IntersectionObserver)
5. "HOY" dot: 2s pulse, scale 1→1.3→1

Mobile 375px walkthrough:
- Zona 1: score + badge fit?
- Zona 2: FocusBanner CTA full-width?
- Zona 3: accordion touch targets >= 44px?
- Zona 4: timeline doesn't overflow? CTA full-width?

Typography: all text uses DESIGN.md tokens, no hardcoded values.
Dark theme: no #FFFFFF, no #000000, all vars.

PART B — FAST-FORWARD VERIFICATION

Use the fast-forward API to test every evolution state. In development, it works without auth:

fetch('/api/admin/fast-forward', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ hash: 'YOUR_TEST_HASH', daysToAdd: N })
})

Test sequence (use a real test hash — create a diagnostic first if needed):

Day 0: Score + dimension reveal + no FocusBanner + only "Tu Evaluación" in accordion + CTA
Day 3 (+3): FocusBanner = archetype summary + accordion "Tu Identidad" NUEVO
Day 7 (+4): FocusBanner = "Tu mapa se ha actualizado" + d7 insight in dimension card
Day 10 (+3): FocusBanner = "Tu sesión con Javier" + accordion PENDIENTE
Day 14 (+4): FocusBanner = subdimension prompt + accordion PENDIENTE
Day 21 (+7): FocusBanner = book excerpt teaser + accordion NUEVO
Day 30 (+9): FocusBanner = reevaluation prompt + accordion PENDIENTE
Day 90 (+60): All 6 sections, organized, not overwhelming

At each state verify:
- FocusBanner shows correct focus
- Accordion sections and badges are correct
- Timeline "HOY" text updates
- No console errors

PART C — CROSS-CUTTING

1. Stripe checkout works from Zona 4 CTA
2. Download PNG works
3. Share link works
4. No console errors at any state
5. Page load < 2s
6. No layout shifts during accordion open/close

PART D — DOCUMENTATION

Update docs/PROGRESS.md with v3 status.
Update docs/DECISIONS.md with:
- 4-zone architecture rationale
- Visit-aware focus logic
- Puentes removal reasoning
- Timeline language transformation
- "No changes to map-evolution.ts, fast-forward, or database schema"

THE 8 TESTS (must pass for every evolution state):
1. ¿La persona sabe qué hay de nuevo en < 3 segundos?
2. ¿Hay UNA sola acción principal clara?
3. ¿Puede acceder a todo lo anterior sin scroll infinito?
4. ¿El timeline habla de SU transformación, no del sistema?
5. ¿El Fuerte Invisible se siente protegido, no expuesto?
6. ¿El Controlador Paralizado ve estructura y datos?
7. ¿Cada visita entrega más de lo esperado?
8. ¿La experiencia se siente CURADA, no ACUMULADA?
```

---

## DEPENDENCY MAP

```
PROMPT 0 (branch) → required for all
    ↓
PROMPT 1 (zones + focus logic) → the structural foundation
    ↓
PROMPT 2 (accordion) → needs zones to exist
    ↓
PROMPT 3 (timeline) → needs Zona 4 placeholder from Session 1
    ↓
PROMPT 4 (archetype + puentes) → needs FocusBanner + accordion from 1+2
    ↓
PROMPT 5 (polish + verification) → final check of EVERYTHING
```

Execute in order. Each prompt is one focused Claude Code session.
Total: 6 prompts (0, 1, 2, 3, 4, 5).

## WHAT DOES NOT CHANGE (confirmed)

- `src/lib/map-evolution.ts` — evolution logic stays identical
- `src/app/api/admin/fast-forward/route.ts` — testing tool stays identical
- Database schema — no column or table changes
- `diagnosticos.meta.last_visited_at` — already tracked, already passed as prop
- Score calculation, Stripe checkout, PNG download, share functionality
