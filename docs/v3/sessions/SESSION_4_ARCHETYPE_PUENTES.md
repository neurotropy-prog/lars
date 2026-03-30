# Session 4 — Archetype Focus Mode + Puentes Removal

## Objective
Implement archetype display with two modes (summary for FocusBanner, full for accordion) and remove puentes líquidos (selling text disguised as insights) from the entire map.

## Read First (mandatory)
- docs/REDISENO_MAPA_VIVO.md (sections on archetype focus, zones, puentes)
- docs/DESIGN.md (design system, typography, colors)
- docs/ANIMATIONS.md (if archetype display has animations)
- src/app/mapa/[hash]/sections/EvolutionArchetype.tsx (current full implementation)
- src/app/mapa/[hash]/sections/DimensionCard.tsx (currently renders puente prop)
- src/app/mapa/[hash]/MapaClient.tsx (PUENTES object, rendering logic)

## What Changes

### 1. EvolutionArchetype.tsx — Two Display Modes

The archetype component must support two distinct presentation modes, both equally polished:

#### SUMMARY MODE
Used in FocusBanner (Zona 2) on day 3+ when archetype is the focus.

Visual structure:
```
┌─────────────────────────────────────────┐
│  NUEVO DESDE TU ÚLTIMA VISITA  [tag]    │
│                                         │
│  Tu Arquetipo del Sistema Nervioso      │
│  [title-tag, text-overline]             │
│                                         │
│  El Escéptico                           │
│  [archetype name, Lora h3 700]          │
│                                         │
│  "En algún momento, alguien en quien    │
│  confiaste plenamente te traicionó."    │
│  [impact phrase, Inter body italic]     │
│                                         │
│  [Descubrir tu perfil completo →]       │
│  [button tertiary ghost]                │
└─────────────────────────────────────────┘
```

**Rules for summary mode:**
- ONE phrase maximum (1-2 sentences)
- The phrase must feel like a mirror, not sales copy
- Never mention the program, subdimensions, or next steps
- The phrase should trigger "¿cómo sabe esto?" response
- For Fuerte Invisible profile archetypes: use biology-first language, avoid emotional wound language
  - Example: "Tu sistema nervioso aprendió que confiar es peligroso. No es psicología — es una respuesta biológica que se puede recalibrar."
- For other profiles: use the most emotionally resonant line from the archetype narrative

**Props addition:**
```typescript
interface EvolutionArchetypeProps {
  // ... existing props
  mode: 'summary' | 'full'
  onExpandRequest?: () => void  // called when "Descubrir perfil completo" is clicked in summary mode
}
```

**Implementation notes:**
- Summary mode uses a subset of the archetype data (name + one impact phrase)
- The impact phrase is selected from archetype content based on profile-aware logic
- CTA button behavior: when clicked, call `onExpandRequest()` which scrolls to and opens the accordion section
- Design: follows FocusBanner card design (bg-secondary, left border 3px accent, rounded-lg)

#### FULL MODE
Used in the accordion (Zona 3) when user clicks to expand archetype section.

**Keep existing structure:**
- Archetype name (Lora h3)
- Traits list (if available in data)
- Narrative paragraph
- 2 beliefs/statements
- Wound/Armor binary display
- 3 expandable subsections (fears, patterns, needs)

**No changes to full mode content or layout.**
Just ensure it:
- Works smoothly inside the accordion container
- Maintains all visual hierarchy and spacing from current design
- Animations still work (if any expandables have animations)

---

### 2. Remove PUENTES Object and All References

**In MapaClient.tsx:**

1. Locate the `PUENTES` constant (typically around line 97-103 in current codebase):
   ```typescript
   const PUENTES = {
     p1: "Esta dimensión tiene 3 subdimensiones que solo emergen...",
     p2: "Este mapa es una foto fija. El programa lo convierte...",
     // etc.
   }
   ```
   **Action:** Delete the entire constant.

2. Find all calls to `<DimensionCard ... puente={PUENTES.pX} ... />`
   **Action:** Remove the `puente` prop from every DimensionCard render call.

3. Search MapaClient for any other references to `puente` or `PUENTES`
   **Action:** Delete or refactor.

**In DimensionCard.tsx:**

1. Remove `puente?: string` from the Props interface.

2. Locate the puente rendering block (typically at the bottom of the component):
   ```tsx
   {/* Puente líquido */}
   {puente && <p className="mapa-puente">{puente}</p>}
   ```
   **Action:** Delete this block entirely.

3. Clean up unused imports (if any imports were only used for puente rendering).

**In globals.css (if it exists):**

1. Search for `.mapa-puente` class definition
   **Action:** Delete the entire class.

2. Check for any other puente-related styles
   **Action:** Delete.

**Verification after removal:**
- Run `grep -r "puente\|PUENTES\|mapa-puente" src/` (or similar) to confirm no orphan references remain
- Run `grep -r "puente\|PUENTES\|mapa-puente" docs/` to confirm no docs reference the removed pattern
- DimensionCard should render clean without italic text at bottom
- No console warnings about missing props

---

### 3. Why Remove Puentes

The current puentes are selling text disguised as insights:
- "Este mapa es una foto fija. El programa lo convierte en un sistema que se adapta..."
- "Esta dimensión tiene 3 subdimensiones que solo emergen con observación continua."

**Why this breaks trust:**
- Reader expects factual data about their score, not product marketing
- Italic, secondary text at bottom of each card feels like fine print
- The message is transparent: "You're missing something, buy more."

**Why the accordion solves this naturally:**
- Zona 3 accordion title: "Tu Profundidad — 3 subdimensiones" with PENDIENTE badge
- Seeing that there's structure *and* a clear path to access it creates authentic desire
- The person's own curiosity drives exploration, not sales copy
- The presence of locked content is itself a call-to-action

**What this improves:**
- DimensionCard data feels clean and neutral (only facts: score, description, dimension breakdown)
- The archetype focuses on mirroring the person, not selling to them
- Zona 2 (FocusBanner) and Zona 3 (accordion) together create natural progression
- Trust in the product increases because there's no hidden messaging

---

### 4. Archetype Impact Phrases (Reference Guide)

For each archetype type, define the ONE impact phrase used in summary mode.
These should be curated from the existing narrative content or created to be:
- 1-2 sentences maximum
- Biologically accurate for Fuerte Invisible archetypes
- Emotionally resonant for other archetypes
- Never mentioning subdimensions, program, or paid features
- Feeling like a mirror, not diagnosis

**Examples (to be confirmed with actual archetype content):**

| Archetype | Profile | Impact Phrase |
|-----------|---------|---------------|
| El Escéptico | Fuerte Invisible | Tu sistema nervioso aprendió que confiar es peligroso. No es psicología — es una respuesta biológica que se puede recalibrar. |
| El Productivo | Productivo Colapsado | Tu rendimiento se convirtió en tu identidad. Cuando la productividad cae, caes tú. |
| El Cuidador | Cuidador Exhausto | Cuidaste a otros hasta olvidar que tú también necesitas aire. |
| El Controlador | Controlador Paralizado | Necesitas saber qué viene después. La incertidumbre te paraliza. |

**Note:** These are placeholders. Each phrase must be extracted from or calibrated against the actual archetype narrative data. Session 4 implementation should include a mapping or configuration defining the impact phrase for each archetype type.

---

### 5. Integration Points

**FocusBanner.tsx (already created in Session 1):**
- When focus is archetype (day 3):
  ```tsx
  <EvolutionArchetype
    mode="summary"
    archetype={archetype}
    onExpandRequest={() => {
      // Scroll to accordion and open identidad section
      document.getElementById('mapa-completo')?.scrollIntoView({ behavior: 'smooth' })
      // Then programmatically open the 'identidad' accordion section
    }}
  />
  ```

**MapaAccordion.tsx (already created in Session 2):**
- When accordion section for archetype is expanded:
  ```tsx
  {
    id: 'identidad',
    title: 'Tu Identidad',
    summary: archetype?.name ?? '',
    badge: evolution.archetype.isNew ? 'nuevo' : null,
    children: <EvolutionArchetype mode="full" archetype={archetype} />
  }
  ```

---

## Design Specs

### Summary Mode Card
- Background: `var(--color-bg-secondary)`
- Left border: `3px solid var(--color-accent)`
- Padding: `var(--space-6)` all sides
- Border-radius: `var(--border-radius-lg)` (12-16px)
- Spacing inside:
  - Tag to title: `var(--space-2)`
  - Title to archetype name: `var(--space-4)`
  - Name to impact phrase: `var(--space-3)`
  - Phrase to CTA: `var(--space-5)`

### Tag (NUEVO DESDE TU ÚLTIMA VISITA)
- Font: Inter Medium 500, `--text-caption` (12px)
- Color: `var(--color-accent)`
- Text-transform: uppercase
- Letter-spacing: 0.08em

### Archetype Name (El Escéptico)
- Font: Lora Bold 700, `--text-h3` (25px)
- Color: `var(--color-text-primary)`
- Line-height: 1.3

### Impact Phrase
- Font: Inter Regular 400, `--text-body` (16px)
- Font-style: italic
- Color: `var(--color-text-secondary)`
- Line-height: 1.6
- Max-width: 42rem (text readability)

### CTA Button ("Descubrir tu perfil completo →")
- Type: Tertiary ghost button (see DESIGN.md for specs)
- Includes arrow at end
- Hover: slight background shift, cursor pointer
- Responsive: full width on mobile, inline on tablet+

---

## Verification

After completing Session 4:

1. **Archetype summary in FocusBanner (day 3+):**
   - [ ] Shows tag "NUEVO DESDE TU ÚLTIMA VISITA" or similar context tag
   - [ ] Shows archetype name in Lora Bold
   - [ ] Shows exactly ONE impact phrase (italic, secondary color)
   - [ ] CTA button present and clickable
   - [ ] Clicking CTA scrolls to accordion and opens the identidad section
   - [ ] Impact phrase feels like a mirror, not sales copy

2. **Archetype full in accordion (when expanded):**
   - [ ] All existing content displays correctly (name, traits, narrative, beliefs, wound/armor, expandables)
   - [ ] Layout and spacing unchanged from current design
   - [ ] Expandable subsections work (fears, patterns, needs)
   - [ ] No visual regressions

3. **Puentes removal:**
   - [ ] No `<DimensionCard ... puente={...} />` calls exist
   - [ ] No `.mapa-puente` styling in CSS
   - [ ] No `PUENTES` constant in MapaClient
   - [ ] DimensionCard no longer accepts puente prop
   - [ ] grep search confirms zero orphan references to "puente" or "PUENTES"
   - [ ] DimensionCard renders clean without italic text at bottom

4. **Mobile 375px responsiveness:**
   - [ ] Summary card archetype fits without overflow
   - [ ] Impact phrase is readable (may wrap, but no horizontal scroll)
   - [ ] CTA button is accessible (≥44px touch target)
   - [ ] Full archetype in accordion scrolls naturally on mobile

5. **Profile-aware language:**
   - [ ] Fuerte Invisible archetypes show biology-first impact phrase
   - [ ] Other profiles show emotionally resonant phrase
   - [ ] No archetype shows wound language if profile is Fuerte Invisible

6. **Experience quality:**
   - [ ] On day 3 (archetype day), person sees their archetype immediately in FocusBanner
   - [ ] Reading the impact phrase creates recognition ("¿cómo sabe esto?")
   - [ ] Clicking "Descubrir tu perfil completo" reveals the full profile in context
   - [ ] The accordion "Tu Profundidad" section (day 14) now makes sense without puente explaining it
   - [ ] No CTA fatigue — each section has clear purpose, no hidden sales messaging

---

## Technical Notes

### State Management
- No new database columns needed
- Archetype impact phrase can be:
  - Hardcoded mapping in component (if 7-10 archetype types)
  - Pulled from archetype content JSON (if framework already supports it)
  - Computed on component render (if phrase follows a pattern)

### Backwards Compatibility
- Existing EvolutionArchetype full mode must remain unchanged
- Only new prop: `mode: 'summary' | 'full'` with default 'full' to avoid breaking changes
- Optional `onExpandRequest` callback for summary mode

### Testing Checklist
- First visit (day 0): no FocusBanner yet, archetype not unlocked
- Day 3 visit: FocusBanner shows archetype summary
- Click "Descubrir perfil completo": scrolls to Zona 3, opens accordion section
- Switch between profiles (test data): verify profile-aware impact phrase
- Mobile 375px: test on actual device or DevTools
- Search codebase: confirm puente removal completeness

---

## What Does NOT Change
- Archetype content/data structure (same `ArchetypeData` type)
- Dimension card rendering logic (only prop removal)
- Evolution section logic and state
- Server component data flow
- Database schema
- Stripe checkout, PNG download, analytics
- All other Evolution components (Session, Subdimensions, BookExcerpt, Reevaluation, Chart)
