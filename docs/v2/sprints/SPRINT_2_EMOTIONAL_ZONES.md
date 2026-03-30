# SPRINT 2 — Emotional Zones + Micro-Mirror Redesign

> **Priority:** HIGH — this is what transforms "form" into "experience."
> **Read first:** `docs/v2/EXPERIENCE_STANDARDS.md` (sections 1, 2, 4)
> **Depends on:** Sprint 1 (social data must work before mirrors can shine)
> **Estimated effort:** 1 session

---

## OBJECTIVE

Right now the entire gateway feels like one long room with the same lighting. After this sprint, the user will feel three distinct emotional atmospheres — like walking through different spaces in a building where each room has its own temperature.

---

## PART A: Implement the 3 Zones

### Zone Mapping

```
ZONE 1 — EXPLORE (questions)
├── P1 (hero)
├── P2
├── P3
├── P4
├── P5
├── P6
├── P7 (sliders)
└── P8

ZONE 2 — REFLECT (system speaks)
├── First Truth (after P2)
├── Micro-Mirror 1 (after P4)
└── Micro-Mirror 2 (after P6)

ZONE 3 — REVEAL (the curtain lifts)
├── Bisagra ("Calculando tu perfil...")
├── Score display
├── Email capture
└── Result preview
```

### Zone Styles

**ZONE 1 — EXPLORE:**
```css
.zone-explore {
  background-color: var(--bg-primary); /* #0a252c */
  transition: background-color 600ms cubic-bezier(0.65, 0, 0.35, 1);
}
```

**ZONE 2 — REFLECT:**
```css
.zone-reflect {
  background-color: var(--bg-secondary); /* #0f3037 */
  transition: background-color 600ms cubic-bezier(0.65, 0, 0.35, 1);
}
```
The zone change should apply to the full-screen container, not just the content area. The entire viewport background shifts.

**ZONE 3 — REVEAL:**
```css
.zone-reveal {
  background: linear-gradient(180deg, #060d10 0%, #0a252c 100%);
  transition: background 800ms cubic-bezier(0.65, 0, 0.35, 1);
}
```
Note: 800ms for REVEAL entry (slower = more dramatic). This zone is entered only once and never left.

### Implementation

The gateway container needs a zone state that changes as the user progresses:

```
User answers P2 → zone changes to REFLECT (First Truth)
User clicks "Continue" → zone changes back to EXPLORE (P3)
User answers P4 → zone changes to REFLECT (Micro-Mirror 1)
User clicks "Continue" → zone changes back to EXPLORE (P5)
User answers P6 → zone changes to REFLECT (Micro-Mirror 2)
User clicks "Continue" → zone changes back to EXPLORE (P7)
User answers P8 → zone changes to REVEAL (bisagra)
Zone stays REVEAL through email capture and result
```

The transition should be a smooth background-color change on the outermost gateway container. The content transitions (slide in/out) happen INSIDE the zone.

---

## PART B: Redesign Micro-Mirrors

The micro-mirrors currently look like "more text on the same background." They need to feel like the system PAUSES, looks at you, and tells you something it knows about you.

### Visual Structure of a Micro-Mirror

```
┌─────────────────────────────────────────┐
│  ZONE 2 BACKGROUND (#0f3037)            │
│                                         │
│  ╔═══════════════════════════════════╗   │
│  ║  SECTION LABEL (small, caps)     ║   │
│  ║  "LO QUE REVELAN TUS RESPUESTAS"║   │
│  ║                                  ║   │
│  ║  ┃ Observation text in           ║   │
│  ║  ┃ Cormorant Garamond italic     ║   │
│  ║  ┃ with 3px left border          ║   │
│  ║  ┃ in accent color (#c6c8ee)     ║   │
│  ║                                  ║   │
│  ║  Collective data in smaller      ║   │
│  ║  Inter text, slightly muted      ║   │
│  ║                                  ║   │
│  ║  ┌──────────────────────────┐    ║   │
│  ║  │  Seguir con mi           │    ║   │
│  ║  │  diagnóstico →           │    ║   │
│  ║  └──────────────────────────┘    ║   │
│  ╚═══════════════════════════════════╝   │
│                                         │
└─────────────────────────────────────────┘
```

### Animation Sequence (for each micro-mirror)

```
1. Zone transition: EXPLORE → REFLECT (600ms background change)
2. Wait 200ms (let the zone settle)
3. Section label fades in (300ms)
4. Wait 150ms
5. Observation text slides in from left (400ms, slide-in-right animation)
   - The left border appears simultaneously
   - Text appears as if "being written" — not typing effect, but a smooth reveal
6. Wait 300ms (let the observation land)
7. Collective data fades in below (300ms, fade-in-up)
8. Wait 200ms
9. "Continue" button fades in (300ms)

Total sequence: ~2.5 seconds
```

### Mirror-Specific Details

**First Truth** (after P1+P2):
- Label: "LO QUE REVELAN TUS RESPUESTAS"
- Higher intensity than current — this is the FIRST time the system speaks back
- The zone change itself is the surprise — user didn't expect the atmosphere to shift

**Micro-Mirror 1** (after P3+P4):
- Label: "TU PATRÓN — 50% COMPLETADO"
- Connects previous answers: links sleep issues with cognitive symptoms
- The observation should feel like "oh, these things are connected?"

**Micro-Mirror 2** (after P5+P6):
- Label: "TU PATRÓN — 75% COMPLETADO"
- Most intense mirror — directly addresses the archetype from P6
- This is where the user thinks "this system KNOWS me"
- Consider slightly more dramatic entry: 800ms zone transition instead of 600ms

---

## VERIFICATION CHECKLIST

- [ ] Zone background visibly changes when entering First Truth
- [ ] Zone background returns to EXPLORE when continuing to P3
- [ ] Zone background changes again for Micro-Mirror 1
- [ ] Zone background returns to EXPLORE for P5
- [ ] Zone background changes for Micro-Mirror 2
- [ ] Zone background transitions to REVEAL for bisagra (darker, gradient)
- [ ] REVEAL zone persists through email capture and result
- [ ] All transitions are 600ms (800ms for REVEAL entry)
- [ ] Micro-mirror text has left accent border (3px #c6c8ee)
- [ ] Micro-mirror observation uses Cormorant Garamond italic
- [ ] Micro-mirror data uses Inter, smaller size, muted color
- [ ] Elements within micro-mirrors appear with stagger (not all at once)
- [ ] The "Continue" button appears LAST in the sequence
- [ ] Mobile (375px): everything fits, text is readable, zones are visible
- [ ] The experience feels like walking through 3 different rooms
