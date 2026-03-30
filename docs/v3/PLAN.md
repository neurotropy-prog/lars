# V3 — Rediseño del Mapa Vivo

> **Referencia completa:** `docs/REDISENO_MAPA_VIVO.md`
> **Branch:** `v3/mapa-vivo-redesign`
> **Prerequisito:** v2 completado y deployado.

---

## Objetivo

Transformar el mapa vivo de una página que acumula contenido en una **interfaz de relación** donde cada visita tiene UN foco, UN ritmo y UNA acción.

## Arquitectura: 4 Zonas

```
┌─────────────────────────────────────┐
│  ZONA 1 — TU ESTADO                │  Score + badge + comparativa
├─────────────────────────────────────┤
│  ZONA 2 — TU FOCO                  │  Lo que importa HOY
├─────────────────────────────────────┤
│  ZONA 3 — TU MAPA COMPLETO         │  Acordeón (1 abierto)
├─────────────────────────────────────┤
│  ZONA 4 — TU CAMINO                │  Timeline aspiracional + CTA
└─────────────────────────────────────┘
```

## Sesiones

| # | Sesión | Archivos principales | Complejidad |
|---|--------|---------------------|-------------|
| 0 | Branch Setup | — | Trivial |
| 1 | Zone Architecture + Focus Logic | `MapaClient.tsx`, **nuevo** `FocusBanner.tsx` | Alta |
| 2 | MapaAccordion + Section Adapters | **nuevo** `MapaAccordion.tsx`, todos `Evolution*.tsx` | Media |
| 3 | Timeline Aspiracional + CTA | `EvolutionTimeline.tsx`, `MapaClient.tsx` (Zona 4) | Baja |
| 4 | Archetype Focus + Puentes Removal | `EvolutionArchetype.tsx`, `DimensionCard.tsx`, `MapaClient.tsx` | Baja |
| 5 | Polish + Fast-Forward Verification | Todos — revisión visual + funcional | Media |

## Dependencias

```
Session 0 (branch) → requerido para todo
    ↓
Session 1 (zonas + foco) → la base estructural
    ↓
Session 2 (acordeón) → necesita zonas
    ↓
Session 3 (timeline) → independiente de 2, pero va después
    ↓
Session 4 (arquetipo + puentes) → independiente, puede ir después de 1
    ↓
Session 5 (polish) → verificación final de TODO
```

## Lo que NO cambia

- `map-evolution.ts` — la lógica de evolución por días funciona tal cual
- `fast-forward/route.ts` — la herramienta de testing no necesita cambios
- Score counter animado, descarga PNG, Stripe checkout, emails
- Base de datos: no se modifican columnas ni schema
- `lastVisitedAt` ya se trackea y se pasa como prop

## Prompts

Ver `docs/v3/PROMPTS.md` para los prompts copy-paste de cada sesión.
