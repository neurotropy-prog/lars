# PROGRESS.md — Estado del Proyecto L.A.R.S.©

## Estado actual: PRODUCCIÓN — Sistema completo

Todo el flujo landing → gateway → mapa vivo → pago funciona en producción.
Evoluciones del mapa (día 3-90), emails automáticos, analytics custom en Supabase, booking con Google Calendar — todo implementado.

---

## Fases

| Fase | Estado | Fecha | Notas |
|------|--------|-------|-------|
| 0 — Setup | ✅ Completada | 21 Mar 2026 | Stack completo, 8 componentes, Supabase con schema, Vercel desplegado, GitHub conectado. |
| 1 — Hero + P1 + Landing | ✅ Completada | 21 Mar 2026 | Hero, P1 visible, below-fold, SVG nervioso, scroll animations. |
| 2 — P2-P4 + Primera Verdad + Micro-espejo 1 | ✅ Completada | 21 Mar 2026 | P2, P3 multiselect, P4, Primera Verdad (5 variantes), Micro-espejo 1, zonas, barra no lineal. |
| 3 — P5-P8 + Micro-espejo 2 | ✅ Completada | 22 Mar 2026 | P5, P6, Micro-espejo 2, Sliders P7, P8. Animaciones A-04 a A-11 + A-15. |
| 4 — Bisagra + Email + Backend | ✅ Completada | 22 Mar 2026 | Scoring D1-D5 ponderado + 4 ajustes. API /api/diagnostico. Supabase + Resend. Email día 0. |
| 5 — Mapa Vivo + CTA + Stripe | ✅ Completada | 22 Mar 2026 | Revelación progresiva 8s. CTA completo. Stripe Checkout 97€. Webhook. /pago/exito. Compartir + PNG. |
| 6 — Evoluciones del Mapa | ✅ Completada | 22 Mar 2026 | Cron evoluciones (día 3/7/10/14/21/30/90). 7 arquetipos. Subdimensiones. Extractos libro. Re-evaluación. Timeline. Fast-forward admin. |
| 7 — Emails | ✅ Completada | 22 Mar 2026 | 8 plantillas (día 0/3/7/10/14/21/30/90) + post-pago. Tracking pixel. Unsubscribe. Lógica de supresión. |
| 8 — Analytics + Edge Cases | ✅ Completada | 22 Mar 2026 | Dashboard custom en Supabase (/admin/analytics). Funnel completo. Métricas por periodo. Stats colectivos (reales cuando >100 diagnósticos). Edge cases cubiertos (offline, duplicados, doble clic, sliders). |
| 9 — Polish + Performance | ✅ Completada | 22 Mar 2026 | A-01 a A-15 verificadas. Responsive 4 breakpoints. Build limpio. Accesibilidad. Fonts swap. |

---

## Mejoras post-lanzamiento

### Completadas
- ✅ PostHog eliminado — analytics custom en Supabase (22 Mar 2026)
- ✅ localStorage en gateway — retoma donde se quedo, expira 24h (22 Mar 2026)
- ✅ **Fase 10 — Booking Pro** (22 Mar 2026):
  - Buffer 10 min entre sesiones (availability.ts)
  - Bloqueo de franjas horarias especificas (no solo dias completos)
  - Admin cancela bookings desde el panel
  - Historial de sesiones (completadas, canceladas, no-show) — migracion 003
  - Emails con diseno premium (header, cards con borde, footer, tipografia)

- ✅ **v3 — Rediseño Mapa Vivo** (24 Mar 2026):
  - Arquitectura 4 zonas: Estado + Foco + Mapa Completo + Camino
  - FocusBanner con lógica visit-aware (NEW > PENDING > unpaid > teaser)
  - MapaAccordion para profundidad organizada (solo 1 abierto a la vez)
  - AspiracionalTimeline con lenguaje de transformación del cliente (5 puntos)
  - Puentes líquidos eliminados (reemplazados por estructura del acordeón)
  - Badge pills con animación scale-in, timeline con stagger por punto
  - HOY dot con pulse scale 1→1.3→1
  - Todos los estados de evolución verificados (Day 0→3→7→10→14→21→30→90)
  - Sin cambios a map-evolution.ts, fast-forward API, ni schema de BD

- ✅ **Admin v2 — Sprint 0: Foundation** (24 Mar 2026):
  - Profile intelligence engine, geo capture, new API routes
- ✅ **Admin v2 — Sprint 1: Sidebar + Layout** (24 Mar 2026):
  - Collapsible sidebar, AdminLayout wrapper, mobile bottom bar
- ✅ **Admin v2 — Sprint 2: Hub** (24 Mar 2026):
  - Centro de Comando with intelligent alerts
- ✅ **Admin v2 — Sprint 3: LAM** (24 Mar 2026):
  - Lead Acquisition Manager with heat score + detail panel
- ✅ **Admin v2 — Sprint 4: LAM Actions** (24 Mar 2026):
  - Note, video, unlock, express session, email actions
- ✅ **Admin v2 — Sprint 5: Automations** (24 Mar 2026):
  - Email flow visualization dashboard
- ✅ **Admin v2 — Sprint 6: Analytics Enhanced** (25 Mar 2026):
  - API extended: daily_counts, worst_dimension_distribution, 90d period
  - AnalyticsFunnel: 4-bar proportional funnel with staggered animation
  - AnalyticsTrends: SVG line/area chart (diagnostics + conversions overlay)
  - AnalyticsProfiles: 4 profile distribution bars (PC/FI/CE/CP colors)
  - AnalyticsDimensions: 5 dimension bars + auto-insight ("X% tienen D[n] como peor")
  - AnalyticsGeo: Top 5 countries + cities with flag emojis, period-filtered
  - Period selector: 7d / 30d / 90d / Todo — reloads all components
  - Responsive: 2-col grid → 1-col on mobile

### Pendiente (no bloquea lanzamiento)
- Testimonios: siguen siendo placeholder — pendiente de testimonios reales de Javier
- Stripe: en modo test — pasar a LIVE cuando esté listo

## Decisiones pendientes de Javier

- [ ] Seleccionar 2-3 clientes para testimonios del diagnóstico (pedir permiso, cargo + edad)
- [ ] Confirmar dónde vive la Semana 1 (web separada vs Mighty Networks)
- [ ] Fecha de la próxima edición del programa

---

*Actualizar al cerrar cada sesión de Claude Code.*
