# EXPERIENCE STANDARDS — V2 Visual & Interaction Bible

> **EVERY sprint spec references this file. Read it BEFORE implementing anything.**
> This is the sensory layer that transforms "a form" into "an experience that changes how you see yourself."

---

## THE RULE

If a screen has correct data but no animation, no zone transition, no micro-interaction — it is NOT done.
Two layers ship together or not at all: **CONTENT** (copy, logic, data) + **EXPERIENCE** (animation, transition, rhythm, atmosphere).

---

## 1. THE THREE EMOTIONAL ZONES

The gateway is a journey through 3 atmospheres. The user must FEEL the shift.

| Zone | Where | Background | Border | Typography | Feeling |
|------|-------|-----------|--------|-----------|---------|
| **EXPLORE** | Questions (P1-P8) | `#0a252c` (bg-primary) | None | Inter, regular weight | Neutral, safe, curious |
| **REFLECT** | Micro-mirrors, First Truth | `#0f3037` (bg-secondary) | Left 3px `#c6c8ee` | Cormorant Garamond italic for observation, Inter for data | Intimate, someone is speaking to you |
| **REVEAL** | Bisagra, Score, Email capture | Deep gradient `#060d10` → `#0a252c` | Subtle glow | Plus Jakarta Sans bold for numbers | Dramatic, the curtain lifts |

**Transition between zones:**
```css
.zone-transition {
  transition: background-color 600ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

The transition must be FELT — not just seen. 600ms is slow enough to register emotionally. The user should think "something just changed" without being able to pinpoint exactly what.

---

## 2. ANIMATION LIBRARY

### 2.1 Shared Easing
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);    /* Entries — fast start, gentle land */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);      /* Zone transitions — smooth */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* Micro-interactions — alive */
```

### 2.2 Entry Animations (for elements appearing)
```css
/* fade-in-up: default for most content */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in-up {
  animation: fadeInUp 500ms var(--ease-out-expo) forwards;
  opacity: 0;
}

/* slide-in-right: for micro-mirrors (coming from the system) */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* scale-in: for score reveal, important numbers */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
```

### 2.3 Stagger Delays
When multiple elements appear in sequence:
```css
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 150ms; }
.stagger-3 { animation-delay: 300ms; }
.stagger-4 { animation-delay: 450ms; }
.stagger-5 { animation-delay: 600ms; }
```

### 2.4 Counter Animation (for scores)
```javascript
function animateCounter(element, target, duration = 1200) {
  const start = performance.now();
  const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(target * easeOutExpo(progress));
    element.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
```

### 2.5 Typing Effect (for "Calculando tu perfil...")
```javascript
function typeText(element, text, charDelay = 35) {
  element.textContent = '';
  element.style.borderRight = '2px solid #c6c8ee'; // cursor
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      // Cursor blinks then disappears
      setTimeout(() => { element.style.borderRight = 'none'; }, 1500);
    }
  }, charDelay);
}
```

### 2.6 IntersectionObserver (for scroll-triggered animations)
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
```

---

## 3. MICRO-INTERACTIONS

### 3.1 Card Selection Feedback
When a user selects an answer card:
```
1. Card border transitions to accent color (#c6c8ee) — 150ms
2. Checkmark icon fades in — 200ms
3. Subtle scale pulse on the card — scale(1.02) then back to 1 — 300ms spring easing
4. Other cards dim slightly — opacity 0.6 — 200ms
5. After 600ms delay: transition to next question
```

### 3.2 Slider Interaction (P7)
```
- Thumb is INVISIBLE until first touch/click
- On first interaction: thumb appears with scale-in animation
- Track color changes dynamically:
  - Value 1-3: #F87171 (red) — critical
  - Value 4-6: #FACC15 (yellow) — moderate
  - Value 7-10: #4ADE80 (green) — healthy
- Value number appears next to slider with same color
- Color transition: 200ms ease
```

### 3.3 Button States
Every button must have:
```css
.btn-primary {
  /* Default */
  background: #c6c8ee;
  color: #0a252c;
  transition: all 200ms var(--ease-spring);

  /* Hover */
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(198, 200, 238, 0.3);
  }

  /* Active/Press */
  &:active {
    transform: translateY(0) scale(0.98);
  }

  /* Loading */
  &.loading {
    pointer-events: none;
    opacity: 0.7;
  }
}
```

### 3.4 Progress Bar
The progress bar is a NARRATIVE TOOL, not a technical indicator.
```
- Width transitions: 500ms ease-out-expo
- During micro-mirrors: bar PAUSES (no movement) — signals "absorb this"
- During bisagra: bar holds at 90% — maximum tension
- Color shifts subtly per zone:
  - EXPLORE zone: white/light track
  - REFLECT zone: accent tint
  - REVEAL zone: brighter, more saturated
```

---

## 4. TYPOGRAPHY IN MOTION

### 4.1 Hierarchy
```
SHOCK phrase: Cormorant Garamond, italic, 1.125rem, letter-spacing 0.02em
Questions: Plus Jakarta Sans, 700, 1.75rem mobile / 2.25rem desktop
Subtitles/context: Inter, 400, italic, 0.9375rem, opacity 0.7
Micro-mirror observation: Cormorant Garamond, italic, 1.25rem
Micro-mirror data: Inter, 400, 0.875rem, opacity 0.6
Score number: Plus Jakarta Sans, 700, 4rem (bisagra) / 3rem (email)
CTA button: Inter Tight, 500, 1rem
```

### 4.2 Text Appearance
- Headlines: fade-in-up, 500ms
- Body text: fade-in, 400ms, 100ms after headline
- Data points: fade-in, 300ms, 200ms after body
- Never show all text at once. Always stagger: title → body → data → CTA

---

## 5. THE FOUR SEASONS CHECKLIST

Before marking ANY component as complete, verify:

### Sensory Layer
- [ ] Does the background zone match the emotional moment?
- [ ] Is there a transition animation between this screen and the previous one?
- [ ] Do elements appear with stagger, not all at once?
- [ ] Is there a micro-interaction on user action (selection, click, slide)?
- [ ] Does the progress bar behavior match the narrative moment?

### Emotional Layer
- [ ] Does this screen GIVE something before ASKING something?
- [ ] Is there a moment of surprise (something 20-30% better than expected)?
- [ ] Does the copy speak to the user's ego and blocks (per profile)?
- [ ] Is the collective data present and credible?

### Technical Layer
- [ ] Mobile-first 375px — does everything fit without scrolling unnecessarily?
- [ ] All animations use shared easing variables (not hardcoded values)?
- [ ] Colors come from the design system (not invented)?
- [ ] Typography follows the hierarchy above?
- [ ] Loading states designed (skeleton, not spinner)?

---

## 6. REFERENCE EXPERIENCE

**Visual benchmark:** functionhealth.com — health data revealed progressively with choreography.

**Emotional benchmark:** The feeling of opening a letter that tells you something about yourself you suspected but never confirmed. Not a form. A mirror.

**Interaction benchmark:** Apple product pages — every scroll reveals something, every transition has purpose, nothing is static that could be alive.

---

## 7. COLORS — COMPLETE PALETTE

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a252c;      /* EXPLORE zone */
  --bg-secondary: #0f3037;    /* REFLECT zone, cards */
  --bg-tertiary: #060d10;     /* REVEAL zone deep */

  /* Text */
  --text-primary: #F5F5F0;    /* Main text — NEVER pure white */
  --text-secondary: #9CA3AF;  /* Subtitles, context */
  --text-muted: #6B7280;      /* Micro-data, timestamps */

  /* Accent */
  --accent: #c6c8ee;          /* CTAs, links, active states, borders */
  --accent-glow: rgba(198, 200, 238, 0.15); /* Subtle glows */

  /* Functional */
  --success: #4ADE80;         /* Green — healthy scores */
  --warning: #FACC15;         /* Yellow — moderate scores */
  --danger: #F87171;          /* Red — critical scores */

  /* FORBIDDEN */
  /* Never use #000000 or #FFFFFF */
  /* Never use accent color for body text */
  /* Never use functional colors decoratively */
}
```

---

## 8. SPACING SYSTEM

Base: 4px. All spacing uses multiples.

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

Between gateway screens: `--space-4xl` minimum.
Between elements within a screen: `--space-lg` to `--space-xl`.
Card padding: `--space-lg` (24px).
Mobile horizontal padding: `--space-md` (16px).

---

## 9. ANTI-PATTERNS (instant failure)

These are the things that make an experience feel like a form instead of a journey:

1. **Static text dump** — All text appears at once without stagger
2. **Hard cut** — Screen changes instantly with no transition
3. **Generic button** — "Continue" in default browser style
4. **Same background everywhere** — No zone differentiation
5. **Numbers without animation** — Score "34" appearing statically instead of counting up
6. **Cards appearing all at once** — No stagger between options
7. **Missing feedback** — User clicks and nothing visible happens for 200ms+
8. **Spinner** — Generic loading spinner instead of contextual loading state
9. **Tooltip** — If you need a tooltip, the design is wrong
10. **Decorative animation** — Motion without purpose
