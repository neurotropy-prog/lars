# SPRINT 5 — Polish: Transitions, Haptics, Sliders, Below-Fold

> **Priority:** MEDIUM — elevates good to Four Seasons.
> **Read first:** `docs/v2/EXPERIENCE_STANDARDS.md` (sections 3, 5)
> **Depends on:** Sprints 1-4 complete
> **Estimated effort:** 1 session

---

## OBJECTIVE

The foundation is solid after Sprints 1-4. This sprint adds the final 20% of polish that makes the difference between "good product" and "I need to tell someone about this."

---

## PART A: Question-to-Question Transitions (A-04)

### Current State
When transitioning between questions, there's a brief overlap/glitch where content from the next question bleeds through before the current one fully exits.

### Target State
Clean horizontal slide transitions:

```
Current question exits:
  - Slides LEFT by 30px
  - Fades to opacity 0
  - Duration: 300ms ease-in

Brief gap: 100ms (empty space — the "breath")

New question enters:
  - Starts 30px to the RIGHT, opacity 0
  - Slides to position 0, fades to opacity 1
  - Duration: 400ms ease-out-expo
```

```css
/* Exit animation */
@keyframes questionExit {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-30px); }
}

/* Enter animation */
@keyframes questionEnter {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

.question-exit {
  animation: questionExit 300ms ease-in forwards;
}

.question-enter {
  animation: questionEnter 400ms var(--ease-out-expo) forwards;
  animation-delay: 100ms; /* the breath */
  opacity: 0;
}
```

**Important:** The transition should ONLY move the content area, not the progress bar or navigation. The progress bar stays static while content slides.

---

## PART B: Card Selection Haptics (A-02)

### Current State
Selecting a card shows a checkmark but the feedback is minimal. Other cards remain at full opacity.

### Target State
A satisfying selection experience:

```
ON CLICK:
1. Selected card:
   - Border transitions to accent (#c6c8ee) — 150ms
   - Background brightens slightly — rgba(198,200,238,0.08)
   - Subtle scale pulse: 1.0 → 1.02 → 1.0 — 300ms spring easing
   - Checkmark icon fades in — 200ms

2. Unselected cards:
   - Dim to opacity 0.5 — 200ms
   - Slight desaturation
   - NOT clickable after selection (prevent double-selection)

3. After 600ms: auto-advance to next screen
   (except for multiselect P3, where user must click "Continuar")
```

```css
.card-selected {
  border-color: var(--accent);
  background: rgba(198, 200, 238, 0.08);
  animation: selectPulse 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes selectPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.card-dimmed {
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 200ms ease;
}
```

### Multiselect (P3) Specific
For the multiselect question (P3 — cognitive symptoms):
- Each selected card gets the accent border + checkmark
- Unselected cards do NOT dim (user needs to select multiple)
- "Continuar" button appears after first selection
- "Continuar" button should be the same style as other gateway buttons (not lavender pill — that's reserved for the final CTA)

---

## PART C: Slider Redesign (P7) — A-07

### Current State
Sliders show "—" as default but the thumb is positioned at the visual center (~5), creating confusion. Dynamic color works (red for low, yellow for mid, green for high).

### Target State
Sliders that clearly communicate "you haven't answered yet" and come alive on first interaction.

```
BEFORE INTERACTION:
- Track: thin line, muted color (rgba(255,255,255,0.1))
- Thumb: HIDDEN (not positioned)
- Value display: "—" in muted color
- Label: full opacity

ON FIRST TOUCH/CLICK:
- Thumb appears at the click position (scale-in animation, 200ms)
- Track fills with color from left to thumb position
- Value number appears with the color matching the value
- Color transition: 200ms

WHILE DRAGGING:
- Track color updates in real-time:
  - 1-3: #F87171 (red)
  - 4-6: #FACC15 (yellow)
  - 7-10: #4ADE80 (green)
- Value number updates in real-time with matching color
- Subtle haptic-like pulse when crossing color boundaries (3→4, 6→7)
```

```css
.slider-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.slider-fill {
  height: 4px;
  border-radius: 2px;
  transition: background-color 200ms ease;
}

.slider-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 100ms ease;
}

.slider-thumb:active {
  transform: scale(1.2);
}

.slider-thumb.hidden {
  opacity: 0;
  transform: scale(0);
}

.slider-thumb.visible {
  animation: scaleIn 200ms var(--ease-spring) forwards;
}

/* Color boundary pulse */
@keyframes boundaryPulse {
  0% { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
  50% { box-shadow: 0 2px 16px rgba(198,200,238,0.4); }
  100% { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
}
```

### "Ver mi diagnóstico completo" Button
The button below the sliders should only become active (non-dimmed) once ALL 5 sliders have been interacted with. Before that, it should be visually dimmed:
```css
.btn-disabled {
  opacity: 0.4;
  pointer-events: none;
}
```

---

## PART D: Below-Fold Refinement

### Tension Cards (3 cards)
- Entry animation: fade-in-up with 150ms stagger
- Cards should have a subtle hover state (slight lift, border glow)
- Numbers in the cards (73%, 12-15h) should use counter animation on scroll trigger

### Testimonials
- Entry animation: fade-in-up with 200ms stagger
- The left accent border should match the gateway micro-mirror style (consistency)
- Add a subtle quotation mark icon (Cormorant Garamond, large, muted) as decorative element

### Final CTA Section
- "142 personas completaron este diagnóstico esta semana" — this number should be dynamic (or at least feel current). Consider adding "hoy" or "esta semana" with a recent-feeling number.
- "Empezar mi diagnóstico" → lavender pill button (consistency with Sprint 4)

---

## PART E: P1-to-Gateway Transition

### Current State
When user selects a P1 card in the hero, there's a visual overlap/glitch before P2 appears.

### Target State
Smooth transition from landing context to gateway context:

```
1. Selected P1 card: pulse + checkmark (same as Part B)
2. 600ms delay (let the selection register)
3. Landing content (hero header, other cards, below-fold) fades out — 400ms
4. Progress bar appears at top — fade-in, 300ms
5. P2 slides in from right — 400ms ease-out-expo
```

The key is that the LANDING disappears and the GATEWAY appears as a new context. The progress bar appearing signals "you're now inside something."

---

## VERIFICATION CHECKLIST

### Transitions
- [ ] Question-to-question: clean slide left/right with 100ms gap
- [ ] No visual overlap between exiting and entering content
- [ ] Progress bar stays static during content transitions

### Card Haptics
- [ ] Selected card: accent border + pulse + checkmark
- [ ] Unselected cards: dim to 0.5 opacity
- [ ] 600ms auto-advance after single-select
- [ ] P3 multiselect: no dimming, "Continuar" appears after first selection

### Sliders
- [ ] Thumb hidden before first interaction
- [ ] Thumb appears with scale-in on first click/touch
- [ ] Track color changes: red (1-3), yellow (4-6), green (7-10)
- [ ] Value number matches track color
- [ ] Pulse effect when crossing color boundaries
- [ ] Submit button disabled until all 5 sliders touched

### Below-Fold
- [ ] Tension cards: stagger entrance, counter animation for numbers
- [ ] Testimonials: stagger entrance, accent border
- [ ] CTA section: lavender pill button
- [ ] "142 personas" counter feels current

### P1 Transition
- [ ] P1 card selection has proper feedback
- [ ] Landing fades out cleanly
- [ ] Progress bar appears
- [ ] P2 slides in without glitch
- [ ] Mobile: entire sequence works at 375px
