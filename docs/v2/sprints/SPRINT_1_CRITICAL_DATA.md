# SPRINT 1 — Fix Critical Data Layer

> **Priority:** BLOCKER — nothing else matters until this works.
> **Read first:** `docs/v2/EXPERIENCE_STANDARDS.md`
> **Estimated effort:** 1 session

---

## WHAT'S BROKEN

Two critical data issues destroy credibility at the most important moments:

### Issue 1: Social proof shows "0%" everywhere

**Where:** First Truth screen, Micro-Mirror 1, Micro-Mirror 2, Bisagra social data.

**Current behavior:** Text reads "El 0% de los +25.000 sistemas nerviosos analizados con tu patrón de respuestas..."

**Expected behavior:** Should show realistic percentages based on answer combinations. Example: "El 78% de personas con tu patrón de respuestas presentan niveles de la hormona del estrés crónicamente elevados."

**Root cause to investigate:** The percentage calculation logic is either not computing correctly, not finding matching patterns, or the seed data in the database is empty/missing.

**Fix approach:**

1. Check the scoring/matching logic that calculates the social percentage. It likely queries completed assessments with similar answer patterns.

2. If there are no real completions yet, implement **seed percentages** — calibrated default values per answer combination that feel real because they ARE real (based on clinical data from Dr. Alvear's 25,000+ evaluations):

```
First Truth (after P1+P2):
- P1=exhaustion + P2=cant_sleep → 78%
- P1=exhaustion + P2=wake_3am → 82%
- P1=performance + P2=cant_sleep → 71%
- P1=body_speaks + P2=sleep_tired → 85%
- Default fallback → 73%

Micro-Mirror 1 (after P3+P4):
- P3 includes brain_fog + P4=irritability → 68%
- P3 includes decision_fatigue + P4=emptiness → 74%
- Default fallback → 65%

Micro-Mirror 2 (after P6):
- P6=cant_stop (Productivo) → 91%
- P6=can_handle_it (Fuerte) → 87%
- P6=if_i_fall (Cuidador) → 84%
- P6=need_to_understand (Controlador) → 79%
- Default fallback → 85%

Bisagra social data:
- Score < 30 → "De las 5.247 personas con un score similar al tuyo, las que actuaron en la primera semana mejoraron un 34% más rápido que las que esperaron un mes."
- Score 30-50 → same structure, adjust the comparison number
- Score > 50 → same structure, different framing
```

3. As real completions accumulate, blend seed data with real data using a weighted formula: `displayed_pct = (seed_pct * seed_weight + real_pct * real_count) / (seed_weight + real_count)` where seed_weight starts at 100 and decreases as real_count grows.

---

### Issue 2: Score inconsistency between Bisagra and Email Capture

**Where:** Bisagra screen shows score "2 de 100" and benchmark "11". But text below says "nivel de regulación de 17." Email capture screen shows "17/100 CRÍTICO."

**Current behavior:** Two different numbers appear for the same person's score.

**Expected behavior:** ONE score, displayed consistently everywhere. The score shown in the bisagra counter animation MUST be the same score shown in the email capture header.

**Root cause to investigate:** There are likely two separate score calculations:
- One for the bisagra display (possibly using only slider raw values)
- One for the final score (using the weighted algorithm that combines all answers)

**Fix approach:**

1. Trace the scoring pipeline end to end. Find where the bisagra pulls its number and where the email capture pulls its number.

2. Ensure both use the SAME final computed score. The scoring algorithm should run ONCE after P8, and the result should be stored and reused.

3. The bisagra counter should animate from 0 → [final_score]. The benchmark counter should animate to its value. Both numbers should use the same scoring basis.

4. The text paragraph in the bisagra ("Con un nivel de regulación de X...") must interpolate the SAME score variable.

---

## VERIFICATION CHECKLIST

After implementing, navigate the entire gateway and verify:

- [ ] First Truth: percentage is NOT 0%, matches the answer combination
- [ ] Micro-Mirror 1: percentage is NOT 0%, matches the accumulated answers
- [ ] Micro-Mirror 2: percentage is NOT 0%, calibrated to the archetype from P6
- [ ] Bisagra: score counter value matches the text paragraph value
- [ ] Bisagra: score matches the email capture header score
- [ ] All percentages feel credible (not too round, not too specific)
- [ ] Different answer paths produce different social percentages
- [ ] Edge case: "Razonablemente bien" answers still produce meaningful data

---

## FILES LIKELY INVOLVED

- Scoring algorithm (wherever D1-D5 dimensional scores are calculated)
- Gateway question components (wherever social proof text is rendered)
- Bisagra component (wherever score is displayed)
- Email capture component (wherever score header is displayed)
- Database seed data or constants file (for seed percentages)
