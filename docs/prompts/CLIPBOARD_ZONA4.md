# PROMPT PARA CLAUDE CODE — Copiar y pegar directamente

---

Lee estos archivos antes de tocar nada:

1. `docs/prompts/PROMPT_ZONA4_BLOQUES_BAC.md` — es la spec completa de lo que hay que implementar
2. `docs/phases/M7_ACTUALIZADO.md` — fuente de verdad para los textos de las 3 fases y el reencuadre de precio
3. `docs/features/FEATURE_GATEWAY_DESIGN.md` líneas 1030-1110 — el diseño original de los bloques B y C
4. `docs/DESIGN.md` — sistema de diseño (tokens, tipografía, colores, espaciado)
5. `src/app/mapa/[hash]/sections/AspiracionalTimeline.tsx` — el componente actual que vas a reescribir
6. `src/app/mapa/[hash]/sections/MapaAccordion.tsx` — referencia del patrón de acordeón (easing, animación de height) pero NO lo reutilices, crea un acordeón inline simple

Tu tarea: reescribir `AspiracionalTimeline.tsx` siguiendo la spec de `PROMPT_ZONA4_BLOQUES_BAC.md` al pie de la letra.

Puntos críticos que NO puedes saltarte:

- Las 3 fases (El Despertar, La Metamorfosis, Volar Alto) reemplazan la timeline de 5 puntos. Textos EXACTOS de M7_ACTUALIZADO.md.
- El BLOQUE B de reencuadre de precio ("desde 2.500€") es OBLIGATORIO. Sin él, la experiencia viola el principio de transparencia. Es la razón de este cambio.
- El acordeón "Qué incluye la Semana 1" va cerrado por defecto debajo de la garantía, con los 4 ítems de la spec.
- El texto pre-CTA en Lora italic es la voz de Javier, no lo pongas en Inter.
- Usa SOLO tokens del sistema de diseño (--color-accent, --font-lora, --space-X, etc). Cero valores hardcoded.
- La spec M7 dice "verde acento" en algunos sitios — ignora eso, el diseño actual usa terracota. Usa siempre `var(--color-accent)`.
- Cuando termines, verifica con `npx tsc --noEmit`. NUNCA ejecutes `npm run build`.

---
