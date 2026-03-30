# CLAUDE CODE PROMPTS — V2 Gateway Upgrade

> Copy/paste each prompt into Claude Code in order.
> Each prompt = 1 session. Wait for completion before starting the next.
> **IMPORTANT: Create a `v2` branch before starting.**

---

## PROMPT 0 — Repository Verification + Branch Setup

```
SAFETY CHECK — Run this FIRST before doing anything:

Run: git remote -v

You MUST see: github.com/neurotropy-prog/lars.git
If you see ANY other repository, STOP immediately and tell me. Do NOT proceed.

Once confirmed, create a new git branch called `v2/gateway-upgrade` from the current main branch. Switch to it.

Do NOT modify the main branch. All work happens on v2/gateway-upgrade.

After creating the branch, run: git branch --show-current
Confirm it says v2/gateway-upgrade.
```

---

## PROMPT 1 — Fix Critical Data (Social Proof + Score Consistency)

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md
- docs/v2/sprints/SPRINT_1_CRITICAL_DATA.md

Then investigate and fix two critical bugs:

BUG 1 — SOCIAL PROOF SHOWS "0%"
Navigate the gateway flow and you'll see that every micro-mirror (First Truth after P2, Micro-Mirror 1 after P4, Micro-Mirror 2 after P6) displays "El 0% de personas..." instead of a real percentage.

Find the code that calculates these social proof percentages. The root cause is likely:
- The query that counts matching response patterns returns 0
- Or there's no seed data in the database

Fix: Implement seed percentages per answer combination. These are defaults that show until real data accumulates. Use these calibrated values:

First Truth (P1+P2 combinations):
- exhaustion + cant_sleep → 78%
- exhaustion + wake_3am → 82%
- performance + cant_sleep → 71%
- body_speaks + sleep_tired → 85%
- Default fallback → 73%

Micro-Mirror 1 (after P3+P4):
- brain_fog selected + irritability → 68%
- decision_fatigue + emptiness → 74%
- Default fallback → 65%

Micro-Mirror 2 (after P6 archetype):
- cant_stop (Productivo) → 91%
- can_handle_it (Fuerte) → 87%
- if_i_fall (Cuidador) → 84%
- need_to_understand (Controlador) → 79%
- Default fallback → 85%

BUG 2 — SCORE INCONSISTENCY
The bisagra screen shows a different score number than the email capture screen. For example, bisagra shows "2 de 100" but email capture shows "17/100".

Find both places where the score is displayed and ensure they use the SAME computed value. The scoring algorithm should run ONCE and the result should be stored and reused everywhere.

Also fix the bisagra text: "Con un nivel de regulación de X..." must use the same score variable as the counter animation.

After fixing, navigate the entire gateway to verify:
- All micro-mirrors show non-zero percentages
- Different answer paths produce different percentages
- The score in the bisagra matches the score in the email capture
- The text paragraph in the bisagra uses the same score as the counter
```

---

## PROMPT 2 — Emotional Zones + Micro-Mirror Redesign

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md (especially sections 1, 2, 4)
- docs/v2/sprints/SPRINT_2_EMOTIONAL_ZONES.md

Implement the 3 emotional zones and redesign the micro-mirrors.

ZONES:
The gateway currently has the same background color throughout. Implement 3 distinct zones:

1. EXPLORE zone (questions): background #0a252c — this is the default
2. REFLECT zone (micro-mirrors): background #0f3037 — warmer, more intimate
3. REVEAL zone (bisagra onward): gradient from #060d10 to #0a252c — dramatic, deep

The zone transition should apply to the full-screen gateway container. Transition: 600ms cubic-bezier(0.65, 0, 0.35, 1) for EXPLORE↔REFLECT, 800ms for entry into REVEAL.

Zone map:
- P1, P2 → EXPLORE
- First Truth → REFLECT
- P3, P4 → EXPLORE
- Micro-Mirror 1 → REFLECT
- P5, P6 → EXPLORE
- Micro-Mirror 2 → REFLECT
- P7, P8 → EXPLORE
- Bisagra onward → REVEAL (stays REVEAL through email and result)

MICRO-MIRROR REDESIGN:
The micro-mirrors need to feel like the system PAUSES and speaks directly to the user.

For each micro-mirror screen:
1. The zone background transitions to REFLECT (#0f3037)
2. The observation text uses Cormorant Garamond italic (or the serif font available in the project) with a 3px left border in accent color (#c6c8ee)
3. The collective data text uses Inter, smaller size, slightly muted opacity
4. Elements appear with stagger animation:
   - Section label fades in (300ms)
   - Wait 150ms
   - Observation text slides in from left (400ms)
   - Wait 300ms
   - Collective data fades in below (300ms)
   - Wait 200ms
   - Continue button fades in (300ms)

Use the shared easing from EXPERIENCE_STANDARDS.md: cubic-bezier(0.16, 1, 0.3, 1) for entries.

After implementing, verify:
- Zone background VISIBLY changes when entering each micro-mirror
- Zone returns to EXPLORE when continuing to next question
- REVEAL zone is noticeably darker/deeper than EXPLORE
- Micro-mirror text has left accent border
- Elements appear with stagger, not all at once
- Mobile 375px: zones are visible and text is readable
```

---

## PROMPT 3 — Hero Impact + Non-Linear Progress Bar

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md (especially sections 2, 3.4, 4)
- docs/v2/sprints/SPRINT_3_HERO_PROGRESS.md

Implement two things: hero entrance animation and non-linear progress bar.

HERO ENTRANCE:
The hero content currently appears all at once (static). Add a staggered reveal sequence:

1. 400ms after page load → SHOCK phrase fades in (600ms, fade-in-up animation)
2. 200ms later → Headline fades in (500ms, fade-in-up)
3. 200ms later → Subtitle fades in (400ms, fade-in)
4. 300ms later → P1 question label fades in
5. Immediately after → P1 cards fade in with 150ms stagger between each
6. 200ms after last card → "10 preguntas · 3 minutos" micro-promises fade in

The SHOCK phrase should use the accent color (#c6c8ee) — it's the only place we use accent for body text.

For the below-fold sections (below P1 cards), add IntersectionObserver scroll-triggered animations:
- Each section: fade-in-up when 15% visible
- Tension cards (the 3 stat cards): 150ms stagger between each
- Testimonials: 200ms stagger between each
- Bottom CTA section: elements stagger 150ms

Also reduce the whitespace between the P1 cards area and the below-fold content. The gap is too large — use max 96px.

NON-LINEAR PROGRESS BAR:
Replace the current linear progress with this map:

P1 → 10% (jump)
P2 → 22% (jump)
First Truth → 22% (PAUSE — bar does NOT advance)
P3 → 38%
P4 → 48%
Micro-Mirror 1 → 48% (PAUSE)
P5 → 60%
P6 → 72%
Micro-Mirror 2 → 72% (PAUSE)
P7 → 85%
P8 → 90%
Bisagra → 90% (SUSTAINED HOLD through entire calculation)
Email capture → 95%
Result → 100%

The bar width transition should be 500ms with ease-out-expo easing.
During PAUSE states (micro-mirrors), the bar stays at its current width — no movement.
During the bisagra HOLD, the bar stays at 90% through the entire typing + score reveal sequence.

After implementing, verify:
- Hero content appears with staggered reveal (not all at once)
- Below-fold sections animate on scroll
- Progress bar PAUSES during micro-mirrors
- Progress bar HOLDS at 90% during bisagra
- Transitions between progress values are smooth
- Mobile 375px: hero fits, animations work
```

---

## PROMPT NS — The Living Nervous System (Canvas)

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md (ALL sections)
- docs/v2/sprints/SPRINT_NS_NERVOUS_SYSTEM.md (this is the complete spec)

Replace the current static SVG nervous system background with a living, interactive Canvas-based nervous system that evolves throughout the gateway.

WHAT IT IS:
A full-viewport Canvas 2D background (position: fixed, z-index: 0, pointer-events: none) that renders an abstract neural network — nodes connected by organic bezier curves, with light particles flowing along the connections. It's atmospheric (20-25% opacity), never competes with content, but is ALIVE.

THE 5 STATES (mapped to gateway steps):

1. FRAGMENTED (landing → P2):
   - 40% of connections visible (gaps in the network)
   - Irregular node pulse (random 2-5s timing)
   - Few particles (8-12), slow, sometimes stalling
   - Color: muted (#6B7280) at 15% opacity
   - Feeling: "something is not working right"

2. AWAKENING (P3 → P6):
   - 65% connections visible (new ones draw on with stroke animation)
   - Semi-regular pulse (converging rhythm)
   - More particles (15-25), gaining speed
   - Color: transitioning toward accent (#c6c8ee at 20%)
   - Feeling: "something is connecting"

3. FLOWING (P7 → P8):
   - 85% connections visible
   - Synchronized wave pulse (3s cycle traveling along spine)
   - Many particles (25-40), smooth flow
   - Color: accent at 25% opacity
   - Feeling: "it's alive, it's reading me"

4. FROZEN (bisagra "Calculando..."):
   - ALL animation stops over 800ms
   - Particles freeze mid-path
   - After freeze: single scanning pulse from center
   - One center node pulses slowly (heartbeat) while everything else is still
   - Feeling: "everything is holding its breath"

5. RESOLVED (score reveal onward):
   - Score < 30: fragments BACK, red tint (#F87171), low energy
   - Score 30-50: partial connections, mixed accent/yellow
   - Score > 50: full network, calm green-accent flow
   - Feeling: "this IS my nervous system — I can see it"

NODE LAYOUT:
- 15-18 nodes on desktop, 10-12 on mobile
- Arranged in a loose vertical spine (slight S-curve) with branching connections
- Suggests a spinal column with branching nerves
- Each node drifts 1-3px using simplex noise (organic, not mechanical)
- Install simplex-noise package for organic movement

MOUSE/TOUCH INTERACTION:
- Desktop: cursor proximity (150px radius) brightens nearby nodes and accelerates nearby particles. Subtle radial glow follows cursor.
- Mobile: scroll velocity boosts system energy temporarily. Touch emits a ripple pulse ring from touch point.

IMPLEMENTATION ORDER (follow this sequence within this session):
1. Canvas setup (fixed, full viewport, retina DPR, z-index 0)
2. Node layout algorithm (spine + branches + noise drift)
3. Connection rendering (quadratic bezier curves, organic)
4. Node pulse animation (irregular → synchronized based on coherence)
5. Particle system (light flowing along connections with trails)
6. Mouse/touch interaction
7. State machine (fragmented/awakening/flowing/frozen/resolved)
8. Integration: expose API that gateway calls on step change
9. Performance: visibility API, reduced-motion, low-power detection
10. Remove old SVG nervous system

CRITICAL DETAILS:
- Use simplex-noise (npm) for organic drift — NOT Math.random()
- Connections use quadratic bezier curves, NOT straight lines
- Particles have a 5-position trail (fading dots behind them)
- The FREEZE during bisagra must be DRAMATIC — everything stops
- The RESOLVE must visually reflect the score (red fragmentation vs green flow)
- Canvas resolution: window.innerWidth * devicePixelRatio (max 2x)
- Frame budget: if frame > 20ms, reduce particle count

After implementing, do a full walkthrough verifying:
- Landing: system is visible, fragmented, irregular pulse
- Cursor/touch interaction creates visible response
- P3 triggers awakening (more connections, more particles)
- P7-P8: system is noticeably more alive than landing
- Bisagra: system FREEZES (dramatic stillness)
- Score reveal: system responds to the score number
- Mobile 375px: system visible, touch works, not overwhelming
- prefers-reduced-motion: static version, no animation
- Canvas never interferes with UI (pointer-events: none)
```

---

## PROMPT 4a — Bisagra Orchestration (WOW Moment)

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md (especially sections 2.4, 2.5)
- docs/v2/sprints/SPRINT_4_CTA_WOW.md (focus on PART A only)

Redesign the bisagra revelation for maximum emotional impact. This is the single most important moment of the entire gateway — the score reveal.

BISAGRA ORCHESTRATION:
The bisagra should be a 10-second orchestrated sequence. Each step waits for the previous one:

Second 0.0 → Zone should already be REVEAL (dark gradient)
Second 0.8 → Dark box appears (scale-in, 400ms). Add a subtle radial glow that pulses behind it.
Second 1.2 → "Calculando tu perfil..." typing starts (35ms per character, cursor in accent color)
Second 3.0 → Typing done. Cursor blinks 3 times then disappears.
Second 4.0 → Text fades out. Brief 300ms darkness.
Second 4.3 → "TU NIVEL DE REGULACIÓN" label fades in
Second 4.8 → Score counter animates 0 → [score] in 1200ms with ease-out-expo. Use Plus Jakarta Sans (or the bold font in the project), 4rem size.
Second 6.0 → Severity label fades in below score: CRÍTICO (<30, red), MODERADO (30-50, yellow), EN RANGO (>50, green)
Second 6.5 → 1 second pause (silence — let it land)
Second 7.5 → Benchmark text + counter fade in
Second 8.5 → Gap text in accent color
Second 9.0 → Social data line fades in
Second 9.5 → "Ver mi diagnóstico completo →" button fades in

Each step MUST complete before the next begins. The pauses are intentional.

Bisagra box design specs:
- Background: linear-gradient(135deg, #060d10, #0a1820)
- Border: 1px solid rgba(198,200,238,0.1)
- Border-radius: 16px
- Padding: 48px 32px
- Max-width: 520px
- Radial glow pseudo-element during calculation phase

After implementing, verify:
- Bisagra sequence plays for ~10 seconds with proper pauses
- Score counter animates smoothly from 0 to final value
- Severity label uses correct color per range (red <30, yellow 30-50, green >50)
- 1-second pause between severity and benchmark
- Total sequence feels dramatic and intentional, not rushed
- Score value matches what was computed in Sprint 1
- Mobile 375px: box fits, text readable, counter visible
```

---

## PROMPT 4b — Email Capture Redesign + Landing CTA

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md (especially section 3.3)
- docs/v2/sprints/SPRINT_4_CTA_WOW.md (focus on PARTS B and C only)

Redesign the email capture screen and update the landing page CTA for consistency.

EMAIL CAPTURE:
The email capture should feel like the FINAL STEP to unlock something the user already built — not a gate.

Layout (top to bottom):
1. Score + severity label carry over from bisagra (already visible, same values)
2. Blurred map preview: the 5 dimension bars with blur(8px) and opacity 0.3 — creates Zeigarnik effect
3. "Tu diagnóstico está listo" heading (Plus Jakarta Sans 700, 1.5rem)
4. Subtitle text explaining the living map
5. Email input field
6. LAVENDER PILL CTA button
7. Privacy text (muted)

CTA BUTTON — the lavender pill:
- Background: #c6c8ee (accent)
- Text: #0a252c (dark on light)
- Font: Inter Tight, 500, 1rem
- Padding: 16px 48px
- Border-radius: 100px (full pill)
- Width: 100%, max-width 400px
- Hover: translateY(-2px) + box-shadow 0 8px 30px rgba(198,200,238,0.25)
- Active: translateY(0) scale(0.98)
- Transition: 200ms spring easing

EMAIL INPUT:
- Background: rgba(255,255,255,0.05)
- Border: 1px solid rgba(198,200,238,0.2)
- Border-radius: 12px
- Padding: 16px 20px
- Focus: accent border + subtle glow
- Error: red border

Animation sequence for email capture screen:
- Second 0.0 → Score + severity carry over (already visible)
- Second 0.3 → Blurred map preview fades in (400ms)
- Second 0.7 → Title fades in
- Second 1.0 → Subtitle fades in
- Second 1.3 → Email input fades in
- Second 1.6 → CTA button fades in
- Second 1.9 → Privacy text fades in

LANDING CTA (bottom of page):
Also update the "Empezar mi diagnóstico" button at the bottom of the landing page to use the same lavender pill style. Currently it's a generic outlined button.

After implementing, verify:
- Score and severity persist from bisagra (same numbers)
- Blurred map shows 5 dimension bars
- CTA button is LAVENDER PILL (#c6c8ee background, dark text)
- CTA has hover lift + shadow
- Email input has accent focus state and red error state
- Elements appear with stagger animation
- Landing page bottom CTA also uses lavender pill
- Mobile 375px: everything centered, button full-width
```

---

## PROMPT 5a — Question Transitions + Card Selection Feedback

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md (especially section 3)
- docs/v2/sprints/SPRINT_5_POLISH.md (Parts A and B only)

Implement clean question transitions and satisfying card selection feedback.

QUESTION TRANSITIONS (A-04):
Current state has visual overlap between exiting and entering content.

Target:
- Exiting question: slides LEFT 30px + fades out (300ms ease-in)
- 100ms gap (empty — the "breath")
- Entering question: slides in from RIGHT 30px + fades in (400ms ease-out-expo)
- Progress bar and navigation stay STATIC during content transitions — only the content area moves

CSS keyframes:
@keyframes questionExit {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-30px); }
}
@keyframes questionEnter {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
Exit: 300ms ease-in. Enter: 400ms ease-out-expo with 100ms delay.

CARD SELECTION FEEDBACK (A-02):
When a user selects an answer card:
1. Selected card: border → accent (#c6c8ee), background brightens rgba(198,200,238,0.08), scale pulse 1.0→1.02→1.0 (300ms spring), checkmark fades in
2. Unselected cards: dim to opacity 0.5, pointer-events none
3. Auto-advance after 600ms for single-select questions

EXCEPTION — P3 (multiselect):
- Each selected card gets accent border + checkmark
- Unselected cards do NOT dim (user needs to select more)
- "Continuar" button appears after first selection
- "Continuar" uses standard gateway button style (not lavender pill)

After implementing, verify:
- Question-to-question transition is a clean slide with no overlap
- 100ms gap (breath) is perceptible between exit and enter
- Progress bar doesn't move during content slide
- Card selection: accent border + pulse + checkmark appears
- Other cards dim after selection (except P3)
- 600ms auto-advance works on single-select
- P3 multiselect: no dimming, "Continuar" appears
- Mobile 375px: transitions smooth, cards fit
```

---

## PROMPT 5b — Slider Redesign (P7)

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md (section 3)
- docs/v2/sprints/SPRINT_5_POLISH.md (Part C only)

Redesign the P7 slider interaction. This is the self-assessment screen with 5 sliders.

BEFORE INTERACTION (each slider):
- Track: thin line, muted (rgba(255,255,255,0.1))
- Thumb: HIDDEN (not visible, not positioned)
- Value display: "—" in muted color
- Label: full opacity

ON FIRST TOUCH/CLICK:
- Thumb appears AT the click position with scale-in animation (200ms spring easing)
- Track fills with color from left to thumb position
- Value number appears with color matching the value range

WHILE DRAGGING:
- Track color updates in real-time:
  - 1-3: #F87171 (red)
  - 4-6: #FACC15 (yellow)
  - 7-10: #4ADE80 (green)
- Value number updates with matching color
- Subtle pulse when crossing color boundaries (3→4, 6→7)

CSS specs:
- Track: height 4px, border-radius 2px
- Thumb: 20px circle, white, shadow 0 2px 8px rgba(0,0,0,0.3)
- Thumb active: scale(1.2)
- Hidden state: opacity 0, transform scale(0)
- Visible state: animation scaleIn 200ms spring easing

SUBMIT BUTTON:
"Ver mi diagnóstico completo" button stays DISABLED (opacity 0.4, pointer-events none) until ALL 5 sliders have been interacted with. Only then does it become active.

After implementing, verify:
- All 5 sliders start with hidden thumb and "—" value
- First click on any slider makes thumb appear at click position
- Track fills with correct color based on value range
- Crossing boundaries (3→4, 6→7) triggers a subtle pulse
- Submit button is dimmed until all 5 sliders are touched
- Each slider works independently
- Mobile 375px: sliders are usable with touch, thumb is large enough
```

---

## PROMPT 5c — P1-to-Gateway Transition + Below-Fold Polish

```
Read these files first:
- docs/v2/EXPERIENCE_STANDARDS.md (sections 2, 5)
- docs/v2/sprints/SPRINT_5_POLISH.md (Parts D and E only)

Two final polish items: the transition from landing to gateway, and below-fold refinements.

P1-TO-GATEWAY TRANSITION (Part E):
When user selects a P1 card in the hero:
1. Card gets selection feedback (accent border + pulse + checkmark) — reuse what you built in Prompt 5a
2. 600ms delay (let the selection register)
3. Landing content (hero header, other cards, below-fold) fades out — 400ms
4. Progress bar appears at top — fade-in, 300ms
5. P2 slides in from right — 400ms ease-out-expo

The key: the LANDING disappears and the GATEWAY appears as a new context. The progress bar appearing signals "you're inside something now." No visual overlap or glitch.

BELOW-FOLD POLISH (Part D):

Tension cards (the 3 stat cards):
- Entry: fade-in-up with 150ms stagger between cards (already done in Prompt 3 via IntersectionObserver — verify it works)
- Numbers (73%, 12-15h): add counter animation when scrolling into view
- Subtle hover state: slight lift + border glow

Testimonials:
- Entry: fade-in-up with 200ms stagger
- Left accent border should match the micro-mirror style (consistency with Prompt 2)
- Add a subtle quotation mark (Cormorant Garamond, large, muted opacity) as decoration

Final CTA section:
- "142 personas completaron este diagnóstico esta semana" — update the number or wording to feel current (e.g., "esta semana" not a static number that will look stale)
- CTA button: lavender pill (consistency with Prompt 4b)

After implementing, verify:
- P1 card selection → landing fades → progress bar appears → P2 slides in (clean sequence)
- No visual glitch during P1-to-gateway transition
- Tension card numbers animate (counter) on scroll
- Testimonials have accent border + quotation decoration
- Bottom CTA uses lavender pill button
- Mobile 375px: entire P1 transition works, below-fold animations trigger
```

---

## PROMPT 6 — Final Review + Screenshot Audit

```
Do a complete walkthrough of the gateway at both desktop (1440px) and mobile (375px) viewports.

Take screenshots of every screen:
1. Hero/Landing (above fold)
2. Below-fold sections
3. P1 with a card selected
4. P2
5. First Truth micro-mirror
6. P3 (multiselect)
7. P4
8. Micro-Mirror 1
9. P5
10. P6 (the key question)
11. Micro-Mirror 2
12. P7 (sliders — before and after interaction)
13. P8
14. Bisagra (typing effect)
15. Bisagra (score revealed)
16. Email capture
17. Result (if accessible without real email)

For each screenshot, verify against docs/v2/EXPERIENCE_STANDARDS.md section 5 (Four Seasons Checklist):
- Zone background matches emotional moment?
- Transition animation between screens?
- Elements appear with stagger?
- Micro-interaction on user action?
- Progress bar behavior matches narrative moment?
- Collective data present and non-zero?
- Score consistent across all displays?
- Canvas nervous system state matches the moment? (fragmented on landing, awakening mid-gateway, flowing late-gateway, frozen during bisagra, resolved after score)
- Cursor/touch interaction with nervous system works?

Report any issues found.
```

---

## DEPENDENCY MAP

```
PROMPT 0 (branch) → required for all

PROMPT 1 (data fixes)
    ↓
PROMPT 2 (zones + mirrors) — needs working social data
    ↓
PROMPT 3 (hero + progress) — needs zones to exist
    ↓
PROMPT NS (living nervous system) — needs hero structure + zones
    ↓
PROMPT 4a (bisagra WOW) — needs nervous system for freeze effect
    ↓
PROMPT 4b (email capture + CTA) — needs bisagra done
    ↓
PROMPT 5a (transitions + cards) — needs core gateway working
    ↓
PROMPT 5b (sliders) — independent, but run after 5a
    ↓
PROMPT 5c (P1 transition + below-fold) — needs card feedback from 5a
    ↓
PROMPT 6 (review) — final verification of EVERYTHING including nervous system states
```

Execute in order. Each prompt is one focused Claude Code session.
Total: 11 prompts (0, 1, 2, 3, NS, 4a, 4b, 5a, 5b, 5c, 6).
