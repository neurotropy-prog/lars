# Session 5 — Polish + Fast-Forward Verification

## Objective
Complete visual polish of all v3 changes and verify every evolution state using fast-forward. This is the final session before merge.

## Read First (mandatory)
- docs/REDISENO_MAPA_VIVO.md (verification section at bottom)
- docs/DESIGN.md
- docs/ANIMATIONS.md
- All files modified in Sessions 1-4
- src/lib/map-evolution.ts (evolution thresholds reference)
- src/app/api/admin/fast-forward/route.ts (testing tool)

## Part A — Visual Polish

### Animation Consistency
Verify and fix animations across all new/modified components:

1. **FocusBanner entrance**: fade-in-up, 400ms, ease-out-expo — should feel like a gentle notification
2. **Accordion open/close**: height transition 400ms ease-out-expo + content opacity 200ms
3. **Badge pills**: subtle scale-in when they first appear (200ms spring)
4. **AspiracionalTimeline points**: stagger 150ms per point when scrolling into view (IntersectionObserver)
5. **"HOY" dot pulse**: 2s infinite, subtle scale 1→1.3→1 at 20% opacity

### Mobile Polish (375px)
Walk through every zone at 375px:
- Zona 1: score + badge fit on one line? Badge wraps gracefully?
- Zona 2: FocusBanner CTA button full-width?
- Zona 3: Accordion touch targets >= 44px height? Chevron visible?
- Zona 4: Timeline points don't overflow? CTA button full-width?

### Typography Check
Verify all text uses DESIGN.md tokens:
- No hardcoded font sizes or colors
- Lora for display/headlines, Inter for body, Inter Tight for UI elements
- Line heights match design tokens

### Dark Theme Consistency
The site uses a warm dark background (#0B0F0E). Verify:
- No white (#FFFFFF) text anywhere — use var(--color-text-primary)
- No pure black backgrounds
- Card backgrounds use var(--color-bg-secondary)
- Borders use var(--border-subtle)

## Part B — Fast-Forward Verification

Use the fast-forward API to test every evolution state. The API is at `/api/admin/fast-forward` (POST, works without auth in development).

### Test Sequence
Use a test hash. For each state, verify the mapa vivo renders correctly:

**Day 0 — Initial state:**
- Zona 1: Score with counter animation
- Zona 2: No FocusBanner (first visit shows dimension cards)
- Zona 3: Accordion with only "Tu Evaluación"
- Zona 4: Timeline + CTA (non-paid)
- No puente text anywhere

**Day 3 — Archetype unlocked:**
Fast-forward +3 days, then visit the mapa.
- Zona 2: FocusBanner shows archetype summary (name + impact phrase)
- Zona 3: Accordion has "Tu Evaluación" + "Tu Identidad" with NUEVO badge
- Clicking FocusBanner CTA opens accordion to "Tu Identidad"

**Day 7 — Insight D7:**
Fast-forward +4 more days.
- Zona 2: FocusBanner shows "Tu mapa se ha actualizado" with worst dimension + new insight
- Zona 3: "Tu Evaluación" section shows updated d7 data in worst dimension card

**Day 10 — Session available:**
Fast-forward +3 more days.
- Zona 2: FocusBanner shows "Tu sesión con Javier" with booking CTA
- Zona 3: "Sesión con Javier" section with PENDIENTE badge

**Day 14 — Subdimensions:**
Fast-forward +4 more days.
- Zona 2: FocusBanner shows subdimension prompt
- Zona 3: "Tu Profundidad" section with PENDIENTE badge

**Day 21 — Book excerpt:**
Fast-forward +7 more days.
- Zona 2: FocusBanner shows "Para ti" book excerpt teaser
- Zona 3: "Extracto del libro" section with NUEVO badge

**Day 30 — Reevaluation:**
Fast-forward +9 more days.
- Zona 2: FocusBanner shows "Han pasado 30 días" reevaluation prompt
- Zona 3: "Tu Evolución" section with PENDIENTE badge

**Day 90+ — All unlocked:**
Fast-forward +60 more days.
- All 6 accordion sections present
- No overwhelming feel — organized, clean
- Timeline shows updated "HOY" text
- Quarterly reevaluation available

### Focus Priority Verification
After fast-forwarding to day 90+ where everything is unlocked:
- If nothing is new: FocusBanner should show next pending action or CTA teaser
- Manually mark archetype as viewed (visit the section) and verify FocusBanner moves to next focus

## Part C — Cross-Cutting Checks

1. **Stripe checkout**: Click CTA in Zona 4, verify checkout flow works
2. **Download PNG**: Verify the canvas-based map download still works
3. **Share link**: Verify copy-to-clipboard works
4. **No console errors**: Check browser console at each evolution state
5. **No 404 or broken imports**: Verify all new component imports resolve
6. **Performance**: Page load < 2s, no layout shifts during accordion open/close

## Part D — Documentation Updates

After all verification passes:
1. Update `docs/PROGRESS.md` with v3 completion status
2. Update `docs/DECISIONS.md` with key v3 decisions:
   - 4-zone architecture rationale
   - Visit-aware focus logic
   - Puentes removal reasoning
   - Timeline language transformation
3. Note in DECISIONS.md: "No changes to map-evolution.ts, fast-forward, or database schema"

## Verification Checklist (the 8 tests from REDISENO_MAPA_VIVO.md)

For each evolution state tested:
- [ ] ¿La persona sabe qué hay de nuevo en < 3 segundos?
- [ ] ¿Hay UNA sola acción principal clara?
- [ ] ¿Puede acceder a todo lo anterior sin scroll infinito?
- [ ] ¿El timeline habla de SU transformación, no del sistema?
- [ ] ¿El Fuerte Invisible se siente protegido, no expuesto?
- [ ] ¿El Controlador Paralizado ve estructura y datos?
- [ ] ¿Cada visita entrega más de lo esperado?
- [ ] ¿La experiencia se siente CURADA, no ACUMULADA?
