# V2 GATEWAY UPGRADE — Implementation Plan

---

## Branch Strategy
All work on branch `v2/gateway-upgrade`. Main stays untouched.

---

## File Structure

```
docs/v2/
├── PLAN.md                          ← You are here
├── EXPERIENCE_STANDARDS.md          ← Visual/interaction bible (read before EVERY sprint)
├── PROMPTS.md                       ← Copy/paste prompts for Claude Code (11 prompts)
└── sprints/
    ├── SPRINT_1_CRITICAL_DATA.md    ← Fix social proof 0% + score inconsistency
    ├── SPRINT_2_EMOTIONAL_ZONES.md  ← 3 zones + micro-mirror redesign
    ├── SPRINT_3_HERO_PROGRESS.md    ← Hero animation + non-linear progress bar
    ├── SPRINT_NS_NERVOUS_SYSTEM.md  ← Living Canvas nervous system (5 states)
    ├── SPRINT_4_CTA_WOW.md          ← Bisagra orchestration + lavender pill CTA
    └── SPRINT_5_POLISH.md           ← Transitions, haptics, sliders, below-fold
```

---

## Sprint Overview

| Sprint | What | Why | Depends On |
|--------|------|-----|------------|
| **1** | Fix social proof data + score consistency | Without real data, the system has zero credibility | Nothing |
| **2** | 3 emotional zones + micro-mirror redesign | Transforms "form" into "experience with atmosphere" | Sprint 1 |
| **3** | Hero entrance animation + non-linear progress | First impression + narrative tension tool | Sprint 2 |
| **NS** | **Living nervous system (Canvas)** | **The visual soul — evolves from fragmented to flowing** | Sprint 3 |
| **4a** | Bisagra 10s orchestration | The WOW moment — nervous system freezes here | Sprint NS |
| **4b** | Email capture + lavender CTA | Conversion — where money lives | Sprint 4a |
| **5a** | Question transitions + card haptics | Clean movement between screens | Sprints 1-4 |
| **5b** | Slider redesign (P7) | Hidden thumb → alive interaction | Sprint 5a |
| **5c** | P1 transition + below-fold polish | First and last impression polish | Sprint 5a |
| **6** | Full screenshot audit at desktop + mobile | Verify everything including NS states | Sprint 5c |

---

## How to Execute

1. Open Claude Code in the project directory
2. Copy Prompt 0 from `PROMPTS.md` → paste into Claude Code → creates the branch
3. Copy Prompt 1 → paste → wait for completion
4. Copy Prompt 2 → paste → wait for completion
5. Copy Prompt 3 → paste → wait for completion
6. Copy Prompt NS → paste → wait for completion (this is the big one — Canvas nervous system)
7. Continue through Prompts 4a, 4b, 5a, 5b, 5c
8. Copy Prompt 6 → paste → review the final screenshots
9. When satisfied, merge v2/gateway-upgrade into main

---

## Key Principles (from EXPERIENCE_STANDARDS.md)

- **Two layers ship together:** Content + Experience. A screen without its animations is not done.
- **3 zones:** EXPLORE (questions), REFLECT (mirrors), REVEAL (bisagra+result)
- **Lavender accent (#c6c8ee):** Only for CTAs, active states, and the SHOCK phrase
- **Stagger everything:** Elements never appear all at once
- **Pauses are intentional:** The progress bar pausing during mirrors = "absorb this"
- **Mobile first (375px):** If it doesn't work on mobile, it doesn't exist
