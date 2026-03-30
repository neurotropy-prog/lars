# SPRINT 4 — CTA as Relief + WOW Moment + Email Capture

> **Priority:** HIGH — this is where conversion happens or dies.
> **Read first:** `docs/v2/EXPERIENCE_STANDARDS.md` (sections 2.4, 2.5, 3.3)
> **Depends on:** Sprint 1 (score must be consistent), Sprint 2 (REVEAL zone must exist)
> **Estimated effort:** 1 session

---

## OBJECTIVE

The current bisagra → email → result sequence works mechanically but doesn't deliver the emotional punch. After this sprint:
- The bisagra will be a 10-second orchestrated revelation
- The email capture will feel like relief (not a gate)
- The CTA button will be the lavender pill that resolves all built-up tension

---

## PART A: Bisagra Orchestration (A-09, A-10)

### Current State
"Calculando tu perfil..." typing effect works. Score appears. But the revelation feels rushed and the numbers are inconsistent (fixed in Sprint 1).

### Target Sequence — 10 seconds of orchestrated tension

The entire bisagra happens inside ZONE 3 (REVEAL — dark gradient background).

```
SECOND 0.0  → Zone transition to REVEAL (800ms, darker gradient)
SECOND 0.8  → Dark box appears (scale-in, 400ms)
SECOND 1.2  → "Calculando tu perfil..." typing starts (35ms/char)
              Subtle radial glow pulses behind the box
SECOND 3.0  → Typing complete. Cursor blinks 3 times.
SECOND 4.0  → Text fades out. Brief darkness (300ms).
SECOND 4.3  → Label "TU NIVEL DE REGULACIÓN" fades in (300ms)
SECOND 4.8  → Score counter: 0 → [final_score] (1200ms ease-out-expo)
              Large typography (Plus Jakarta Sans 700, 4rem)
              "/100" appears statically next to it
SECOND 6.0  → Severity label fades in below score:
              - Score < 30: "CRÍTICO" in red (#F87171)
              - Score 30-50: "MODERADO" in yellow (#FACC15)
              - Score > 50: "EN RANGO" in green (#4ADE80)
SECOND 6.5  → Pause. Let it land. (1 second of nothing)
SECOND 7.5  → Benchmark text fades in: "El promedio de personas..."
              Benchmark counter: 0 → [benchmark] (800ms)
SECOND 8.5  → Gap text in accent color: "La distancia entre ambos números..."
SECOND 9.0  → Social data fades in (the "De las 5.247 personas..." line)
SECOND 9.5  → "Ver mi diagnóstico completo →" button fades in
SECOND 10.0 → Sequence complete
```

**Critical:** Each step MUST wait for the previous to finish. No overlaps. The pauses between reveals are part of the design — they create space for the information to land emotionally.

### Bisagra Box Design (REVEAL zone)
```css
.bisagra-box {
  background: linear-gradient(135deg, #060d10 0%, #0a1820 100%);
  border: 1px solid rgba(198, 200, 238, 0.1);
  border-radius: 16px;
  padding: 48px 32px;
  max-width: 520px;
  margin: 0 auto;
  position: relative;
}

/* Subtle radial glow during calculation */
.bisagra-box::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(198, 200, 238, 0.08) 0%, transparent 70%);
  animation: pulseGlow 2s ease-in-out infinite;
}
```

---

## PART B: Email Capture Redesign

### Current State
Score "17/100 CRÍTICO" at top, blurred map behind, email input, generic button. Functional but not emotional.

### Target State
The email capture should feel like the FINAL STEP to unlock something the user has already built. Not a gate — a key.

### Layout
```
┌──────────────────────────────────────┐
│  REVEAL ZONE BACKGROUND              │
│                                      │
│        [Score] /100                  │
│        [Severity Label]              │
│                                      │
│  ╔══════════════════════════════╗     │
│  ║  Blurred dimension bars     ║     │
│  ║  (5 bars, red/yellow/green) ║     │
│  ║  blur(8px) opacity(0.3)     ║     │
│  ║                              ║    │
│  ║  "Tu diagnóstico completo   ║     │
│  ║   está aquí"                ║     │
│  ║   (overlaid on blur)        ║     │
│  ╚══════════════════════════════╝     │
│                                      │
│  "Tu diagnóstico está listo"         │
│  (Plus Jakarta Sans 700, 1.5rem)     │
│                                      │
│  "Lo guardamos en una página         │
│   personal para ti. Evoluciona       │
│   con el tiempo — cada semana        │
│   hay algo nuevo."                   │
│  (Inter 400, muted)                  │
│                                      │
│  ┌────────────────────────────┐      │
│  │ Tu email                   │      │
│  └────────────────────────────┘      │
│                                      │
│  ┌────────────────────────────┐      │
│  │  Acceder a mi diagnóstico  │      │ ← LAVENDER PILL BUTTON
│  └────────────────────────────┘      │
│                                      │
│  "Solo email. Cero spam.             │
│   Tu diagnóstico es confidencial."   │
│                                      │
└──────────────────────────────────────┘
```

### The Lavender Pill CTA Button
```css
.cta-pill {
  background-color: var(--accent); /* #c6c8ee */
  color: var(--bg-primary); /* #0a252c — dark text on light button */
  font-family: 'Inter Tight', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  padding: 16px 48px;
  border-radius: 100px; /* full pill shape */
  border: none;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 100%;
  max-width: 400px;
}

.cta-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(198, 200, 238, 0.25);
}

.cta-pill:active {
  transform: translateY(0) scale(0.98);
}
```

### Email Input Styling
```css
.email-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(198, 200, 238, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  transition: border-color 200ms ease;
}

.email-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.email-input.error {
  border-color: var(--danger);
}
```

### Blurred Map Preview
The 5 dimension bars should be visible behind the email form with:
```css
.map-preview {
  filter: blur(8px);
  opacity: 0.3;
  pointer-events: none;
}
```
The bars should use the actual computed D1-D5 values with their color coding. This creates the Zeigarnik effect: "I can ALMOST see my results."

### Animation Sequence (email capture screen)
```
SECOND 0.0 → Score + severity carry over from bisagra (already visible)
SECOND 0.3 → Blurred map preview fades in (400ms)
SECOND 0.7 → "Tu diagnóstico está listo" fades in
SECOND 1.0 → Subtitle text fades in
SECOND 1.3 → Email input fades in
SECOND 1.6 → CTA button fades in
SECOND 1.9 → Privacy text fades in
```

---

## PART C: Post-Email Landing CTA (bottom of landing page)

The "Empezar mi diagnóstico" button at the bottom of the landing page should also use the lavender pill style. Currently it's a generic outlined button.

---

## VERIFICATION CHECKLIST

### Bisagra
- [ ] Zone transitions to REVEAL (dark gradient) — 800ms
- [ ] Typing effect plays "Calculando tu perfil..." at 35ms/char
- [ ] Radial glow pulses behind the box during calculation
- [ ] Score counter animates 0 → [final_score] in 1200ms
- [ ] Severity label appears with correct color per score range
- [ ] 1-second pause after severity before benchmark
- [ ] Benchmark counter animates
- [ ] Gap text appears in accent color
- [ ] Social data appears last
- [ ] CTA button appears after all reveals
- [ ] Total sequence: ~10 seconds, no rushing

### Email Capture
- [ ] Score and severity persist from bisagra (same numbers)
- [ ] Blurred map shows 5 dimension bars with correct colors
- [ ] "Tu diagnóstico está listo" feels like a statement, not a gate
- [ ] CTA button is LAVENDER PILL (#c6c8ee background, dark text)
- [ ] CTA button has hover lift + shadow effect
- [ ] Email input has accent border on focus
- [ ] Privacy text is visible but muted
- [ ] Elements appear with stagger animation
- [ ] Mobile (375px): everything centered, button full-width

### Landing CTA
- [ ] "Empezar mi diagnóstico" button uses lavender pill style
- [ ] Consistent with gateway CTA button
