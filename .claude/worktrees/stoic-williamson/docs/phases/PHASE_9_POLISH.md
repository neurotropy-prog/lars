# FASE 9 — POLISH + PERFORMANCE + REVISIÓN FOUR SEASONS
**Sesión 10 de Claude Code**

---

## Contexto

La sesión de pulido. Revisar TODO contra los skills. Optimizar performance. Verificar cross-browser. El objetivo: que un ejecutivo de 45 años en su iPhone pueda completar el gateway en 3 minutos sin confusión, sin errores, sin esperas, y sentir que lo que acaba de vivir es lo más personal e impresionante que ha encontrado online en mucho tiempo.

## Docs a leer

- `CLAUDE.md`
- `docs/features/FEATURE_LANDING_DESIGN.md` — Checklist completa
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Principios de experiencia, momento WOW


## Checklist product-philosophy

- [ ] ¿Cada pantalla tiene UNA acción principal clara?
- [ ] ¿Acción obvia en < 2 segundos?
- [ ] ¿Cero callejones sin salida?
- [ ] ¿Feedback < 300ms en toda interacción?
- [ ] ¿Estados vacíos, error, carga todos diseñados?
- [ ] ¿Mobile-first 375px impecable?
- [ ] ¿El WOW de la revelación del mapa se siente?
- [ ] ¿Four Seasons en cada detalle? (estados guardados, tiempo respetado, elegancia)

## Checklist movement-philosophy

- [ ] ¿Gramática S→E→T→A→CTA presente en la landing?
- [ ] ¿Los 4 perfiles se reconocen en las opciones de P1?
- [ ] ¿La normalización disuelve vergüenza sin nombrarla?
- [ ] ¿La urgencia es legítima (datos reales, no fabricada)?
- [ ] ¿El delta de alivio del CTA está calibrado?
- [ ] ¿Confianza compuesta a lo largo del recorrido?

## Checklist gateway

- [ ] ¿Primera verdad < 30s después de P2?
- [ ] ¿Cada mecánica amplifica la siguiente?
- [ ] ¿Inteligencia colectiva visible en cada pantalla?
- [ ] ¿Resultado vale sin producto?
- [ ] ¿CTA como alivio, no como petición?
- [ ] ¿5 puentes líquidos visibles en el resultado?
- [ ] ¿Cadena de confianza documentada y medible?
- [ ] ¿Checkpoints de estado verificables? (M1→Awareness, M3→Clarity, M6→Confidence)

## Checklist ética

- [ ] ¿Todo verificable? ¿Datos reales o marcados como estimación?
- [ ] ¿La persona sale con más poder sobre su vida?
- [ ] ¿Si viera cómo diseñamos esto, estaríamos cómodos?
- [ ] ¿Testimonios reales?
- [ ] ¿Cero urgencia fabricada?

---

## Performance

- [ ] Lighthouse mobile > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Sin layout shift (CLS = 0)
- [ ] SVGs optimizados (inline, no imagen)
- [ ] Fuentes con font-display: swap
- [ ] Imágenes lazy-loaded si las hay

## Cross-browser

- [ ] Chrome desktop + mobile
- [ ] Safari desktop + iOS Safari
- [ ] Firefox desktop
- [ ] Chrome Android

## Responsive

- [ ] 375px (iPhone SE) — todo funciona
- [ ] 390px (iPhone 14) — todo funciona
- [ ] 768px (iPad) — layout se adapta
- [ ] 1280px (desktop) — max-widths respetados
- [ ] Sin scroll horizontal en ningún breakpoint

---

## Recorrido completo de prueba

Hacer el gateway completo en móvil, de principio a fin, con 3 perfiles diferentes:

1. **Productivo:** P1=B, P2=B, P3=3+items, P4=A, P5=B, P6=A, P7=bajos, P8=C
2. **Fuerte:** P1=C, P2=D, P3=1item, P4=D, P5=A, P6=B, P7=mixtos, P8=B
3. **Controlador:** P1=E, P2=A, P3=4+items, P4=E, P5=C, P6=D, P7=medios, P8=B

Verificar que:
- La primera verdad se siente diferente en cada caso
- Los micro-espejos hablan el idioma del perfil
- La bisagra muestra scores diferentes
- El mapa muestra insights coherentes con las respuestas
- El CTA se siente como alivio, no como venta

---

## Entregable

- Todas las issues de las checklists resueltas
- Performance optimizada
- Cross-browser verificado
- 3 recorridos completos probados
- PROGRESS.md actualizado con estado final
- Lista de lo que funciona y lo que falta (si algo)

## Criterio de cierre

Un ejecutivo de 45 años en su iPhone podría completar el gateway en 3 minutos sin confusión, sin errores, sin esperas, y sentir que lo que acaba de vivir es lo más personal e impresionante que ha encontrado online en mucho tiempo.

---

*Si todo pasa: el sistema está listo para recibir tráfico.*
