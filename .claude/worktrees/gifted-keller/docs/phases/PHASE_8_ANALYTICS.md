# FASE 8 — ANALYTICS + INTELIGENCIA COLECTIVA + EDGE CASES
**Sesión 9 de Claude Code**

---

## Contexto

La capa de datos que hace todo medible y mejora con cada usuario. También implementa el patrón CONVERT (versión rápida del gateway) y todos los edge cases.

## Docs a leer

- `CLAUDE.md`
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Secciones: métricas, edge cases, patrón CONVERT, inteligencia colectiva
- `docs/features/FEATURE_LANDING_DESIGN.md` — Sección: métricas de la landing


## Analytics

Evento por cada punto del flujo:

| Punto | Evento |
|---|---|
| Página cargada | `page_view` |
| P1 respondida | `gateway_p1` + opción |
| Cada pregunta | `gateway_pN` + respuesta |
| Primera verdad vista | `gateway_first_truth` |
| Micro-espejo 1 vista | `gateway_mirror_1` |
| Micro-espejo 2 vista | `gateway_mirror_2` |
| Bisagra vista | `gateway_bisagra` + score |
| Email enviado | `gateway_email_captured` |
| Mapa accedido | `map_view` + día |
| Sección desbloqueada vista | `map_section_viewed` + tipo |
| CTA clicado | `cta_clicked` |
| Pago completado | `payment_completed` |

**Abandonos:** En qué pantalla + cadena de confianza (qué depósito falló).

**Métricas clave:**
- % P1 respondida (>60%)
- % scroll below the fold (<40%)
- Completion rate gateway (>70% de quienes hacen P1)
- Email capture rate (>85% de quienes llegan a bisagra)
- Conversión inmediata (>8%)
- Visitas al mapa día 3 (>40%)
- Conversión acumulada 30 días (>15%)

---

## Inteligencia colectiva

**Dashboard interno** (no público):
- Distribución de scores por dimensión
- % por patrón de respuesta (P6)
- Correlaciones entre dimensiones
- Datos para los "el X% de personas con tu patrón..."

**Datos colectivos en la experiencia:** Inicialmente hardcodeados, después calculados en tiempo real cuando haya volumen (>100 diagnósticos).

---

## Edge cases

| Caso | Solución |
|---|---|
| Conexión perdida | Mensaje sutil, localStorage preserva estado |
| Email inválido | Validación en tiempo real |
| Email repetido | "Ya tienes un mapa" + opción ver existente o actualizar |
| URL del mapa no carga | Skeleton screens + retry |
| Sliders sin mover | Advertencia suave, permite avanzar al 2º intento |
| Doble clic en pago | Debounce, single charge |
| Stripe falla | Mensaje claro + retry + no perder datos |

---

## Patrón CONVERT (versión rápida)

Para personas que llegan con UTM de Confidence/Readiness:

```
P1 + P2 + P7 (sliders) → bisagra rápida → email → resultado
```

90 segundos. Activado por UTM o selección manual "¿Diagnóstico rápido (1 min) o completo (3 min)?"

---

## Entregable

- Eventos de analytics en cada punto del flujo
- Dashboard de métricas básico (interno)
- Datos colectivos calculables (queries para los % mostrados)
- Todos los edge cases implementados
- Patrón CONVERT funcional end-to-end

## Criterio de cierre

- [ ] Se puede ver el embudo completo: entrada → abandono → email → pago
- [ ] Los datos colectivos se actualizan con cada nuevo diagnóstico
- [ ] Todos los edge cases manejados con elegancia
- [ ] CONVERT funciona end-to-end en < 90 segundos
- [ ] Dashboard interno muestra datos coherentes
- [ ] PROGRESS.md actualizado
