# FASE 6 — EVOLUCIONES DEL MAPA (DÍA 3-30)
**Sesión 7 de Claude Code**

---

## Contexto

El mapa vivo evoluciona. Cada pocos días aparece contenido nuevo que mantiene a la persona en el sistema y acerca el CTA. Los emails son notificación, no valor — el valor está en el mapa.

## Docs a leer

- `CLAUDE.md`
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Sección: POST-PUERTA, evolución del mapa completa (día 3, 7, 10-14, 14, 21, 30, 90)
- Contenido de arquetipos: `/content/arquetipos_sn.docx` (7 arquetipos del sistema nervioso)


## Evoluciones

**Día 3 — Arquetipo del Sistema Nervioso:**
- Mapear P6 + P4 + P2 → 1 de 7 arquetipos (de arquetipos_sn.docx)
- Nueva sección en el mapa con badge "NUEVO"
- Narrativa completa expandible: herida, miedos, necesidades

**Día 7 — Insight de inteligencia colectiva:**
- Dato nuevo en la dimensión más comprometida
- Badge "ACTUALIZADO"
- No reciclado — insight que no existía en día 0

**Día 10-14 — Sesión de valoración con Javier:**
- Desbloqueo de opción de agendar 20 min gratuitos
- Badge "DISPONIBLE"
- Integración con Calendly o similar

**Día 14 — Subdimensiones:**
- 2-3 preguntas inline que profundizan la dimensión más comprometida
- Badge "NUEVO"
- Mapa se actualiza con mayor resolución tras responder

**Día 21 — Contenido del libro:**
- Extracto del capítulo que explica su dimensión más comprometida
- De los libros de Javier (BURNOUT_FENIX_Vol1-3)
- Link al libro completo (N1 cascada)

**Día 30 — Reevaluación:**
- 5 sliders pre-rellenados con valores del día 0
- Al actualizar: scores viejos vs nuevos lado a lado
- Insight según delta (bajó/subió/igual)

**Día 90+ — Trimestral:**
- Mismo formato que día 30, más historial
- Se repite cada 90 días mientras email activo y no convirtió

---

## Sistema de desbloqueo

- Cron job o scheduled function que marca evoluciones según fecha de creación + condiciones
- Badge "NUEVO" / "ACTUALIZADO" / "DISPONIBLE" en secciones recién desbloqueadas
- Las secciones se ACUMULAN (no reemplazan — el mapa CRECE)

---

## Entregable

- Lógica de desbloqueo temporal implementada
- 6 secciones del mapa con contenido
- Arquetipo: 7 narrativas mapeadas a perfiles
- Subdimensiones: 2-3 preguntas inline que actualizan el mapa
- Reevaluación: sliders con comparación antes/después
- Badges funcionales
- Cron job o scheduled function para desbloqueos

## Criterio de cierre

- [ ] Simular fast-forward (cambiar fecha creación) → cada evolución se desbloquea correctamente
- [ ] Cada sección nueva aporta valor genuino
- [ ] La reevaluación actualiza scores visualmente con comparación
- [ ] Las secciones se acumulan (mapa de 30 días mucho más rico que día 0)
- [ ] Badges aparecen y desaparecen correctamente
- [ ] PROGRESS.md actualizado
