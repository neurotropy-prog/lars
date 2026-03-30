# SPRINT 3 — Hero Impact + Non-Linear Progress Bar

> **Priority:** HIGH — first impression and narrative tension.
> **Read first:** `docs/v2/EXPERIENCE_STANDARDS.md` (sections 2, 3.4, 4)
> **Depends on:** Sprint 2 (zones must exist for the hero to land properly)
> **Estimated effort:** 1 session

---

## PART A: Hero Redesign

### Current State
The hero has the correct copy but everything appears statically. There's a subtle network/node pattern in the background but no SVG protagonist. The SHOCK phrase is static italic text.

### Target State
The hero should feel like arriving at a place that already knows something about you. The SVG nervous system visualization is the visual anchor — the METAPHOR made visible.

### A.1 — SVG Nervous System (A-01)

Create an abstract SVG visualization that suggests a nervous system or neural network. NOT a medical diagram — an artistic, abstract representation.

**Design:**
```
- Base: 5-7 vertical flowing lines (like nerve pathways)
- Nodes: small circles at intersection points
- Pulse animation: a subtle glow that travels along the lines
- Color: lines in text-muted (#6B7280), pulse in accent (#c6c8ee)
- Opacity: overall 0.15-0.25 (background element, not protagonist)
- Position: centered behind the hero content, extends from top to below P1
```

**Animation:**
```css
/* Pulse travels along each line with staggered start */
@keyframes nervePulse {
  0% { stroke-dashoffset: 1000; opacity: 0.1; }
  50% { opacity: 0.3; }
  100% { stroke-dashoffset: 0; opacity: 0.1; }
}

.nerve-line {
  animation: nervePulse 3s ease-in-out infinite;
}
.nerve-line:nth-child(1) { animation-delay: 0s; }
.nerve-line:nth-child(2) { animation-delay: 0.4s; }
.nerve-line:nth-child(3) { animation-delay: 0.8s; }
/* etc. */
```

**Important:** The SVG is atmospheric — it sets the mood. It should NOT compete with the text for attention. Think: ambient lighting, not spotlight.

### A.2 — SHOCK Phrase Animation

Current: static italic text.
Target: the phrase appears with a reveal that creates a moment of pause.

**Option (recommended): Fade-in with slight delay**
```
1. Page loads → SVG nervous system starts pulsing (immediate)
2. 400ms delay → SHOCK phrase fades in (600ms, fade-in-up)
3. 200ms after shock → Headline fades in (500ms, fade-in-up)
4. 200ms after headline → Subtitle fades in (400ms, fade-in)
5. 300ms after subtitle → P1 question + cards fade in with stagger (150ms each)
6. 200ms after last card → Micro-promises fade in ("10 preguntas · 3 minutos")
```

Total hero reveal sequence: ~3.5 seconds. The user arrives and watches the page "wake up."

**The SHOCK phrase typography:**
```css
.shock-phrase {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.125rem;
  color: var(--accent); /* #c6c8ee — this is the ONE place accent color is used for text */
  letter-spacing: 0.02em;
  line-height: 1.6;
}
```

### A.3 — Below-Fold Scroll Animation (A-03, A-15)

The below-fold sections (Espejo, Tensión, Prueba, Alivio) should appear on scroll using IntersectionObserver:

```
Each section: fade-in-up when 15% visible
Tension cards (3 cards): stagger 150ms between each
Testimonials: stagger 200ms between each
Final CTA section: all elements stagger 150ms
```

Also fix the excessive whitespace between P1 cards and the below-fold content. Current gap is too large. Reduce to `--space-4xl` (96px) maximum.

---

## PART B: Non-Linear Progress Bar

### Current State
Progress advances linearly: 20%, 35%, 45%, 60%, 70%, 82%, 90%, 95%.

### Target State
Progress bar is a NARRATIVE TENSION tool with pauses, acceleration, and sustained holds.

### New Progress Map

```
P1 selection      → 10%  (instant jump — momentum)
P2 selection      → 22%  (fast — momentum continues)
First Truth       → 22%  (PAUSE — bar does NOT move during mirror)
  User clicks continue → bar smoothly catches up
P3 completion     → 38%  (normal)
P4 selection      → 48%  (normal)
Micro-Mirror 1    → 48%  (PAUSE — absorb the reflection)
  User clicks continue → bar catches up
P5 selection      → 60%  (normal)
P6 selection      → 72%  (slightly slower increment — this is THE question)
Micro-Mirror 2    → 72%  (PAUSE — most important mirror)
  User clicks continue → bar catches up
P7 sliders done   → 85%  (small jump — tension building)
P8 selection      → 90%  (small jump — almost there)
Bisagra           → 90%  (SUSTAINED HOLD — maximum tension)
  "Calculando..."  → 90% (bar frozen while typing effect plays)
  Score revealed   → 90% (still frozen — the score IS the progress)
Email capture     → 95%  (tiny advance — "just one more thing")
Result            → 100% (completion)
```

### Implementation

```javascript
// Progress values mapped to gateway steps
const PROGRESS_MAP = {
  'p1': 10,
  'p2': 22,
  'first-truth': 22,      // PAUSE
  'p3': 38,
  'p4': 48,
  'micro-mirror-1': 48,   // PAUSE
  'p5': 60,
  'p6': 72,
  'micro-mirror-2': 72,   // PAUSE
  'p7': 85,
  'p8': 90,
  'bisagra': 90,           // SUSTAINED HOLD
  'email': 95,
  'result': 100,
};
```

### Bar Animation
```css
.progress-bar-fill {
  transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* During PAUSE states, no transition happens — bar is static */
/* The lack of movement signals "something different is happening here" */
```

### Progress Text
Currently shows "Tu diagnóstico: XX% completo." Keep this, but:
- During PAUSES: hide the percentage text or show the label only
- During SUSTAINED HOLD (bisagra): optionally pulse the bar subtly to show it's "alive"

---

## VERIFICATION CHECKLIST

### Hero
- [ ] SVG nervous system is visible as background element
- [ ] SVG pulses with staggered animation (3s cycle)
- [ ] SHOCK phrase appears with fade-in after 400ms delay
- [ ] Headline appears after SHOCK with stagger
- [ ] P1 cards appear with stagger (150ms between each)
- [ ] Below-fold sections animate on scroll (IntersectionObserver)
- [ ] Tension cards (3) have stagger entrance
- [ ] Whitespace between P1 and below-fold is reduced

### Progress Bar
- [ ] P1 → P2: fast jumps (momentum feel)
- [ ] First Truth: bar PAUSES at 22%
- [ ] Micro-Mirror 1: bar PAUSES at 48%
- [ ] Micro-Mirror 2: bar PAUSES at 72%
- [ ] Bisagra: bar HOLDS at 90% through entire calculation sequence
- [ ] Email capture: bar moves to 95%
- [ ] Result: bar reaches 100%
- [ ] Transitions are smooth (500ms ease-out-expo)
- [ ] Mobile: bar is visible and readable at 375px
