# Instrucciones para Claude Code

## Contexto
Soy Javier A. Martín Ramos, director del Instituto Epigenético. Alex es el fundador y estratega que diseñó este sistema. No somos desarrolladores.
Estamos construyendo el sistema de adquisición del Programa L.A.R.S.© — un protocolo de 12 semanas para ejecutivos con burnout.
Todo lo que se genere debe ser código de producción, no demos.

## Documentación del proyecto (LÉELA ANTES DE TODO)
Toda la estrategia, el copy, las decisiones de experiencia y los principios de diseño ya están destilados en estos documentos. Son tu fuente de verdad:

- `docs/VISION.md` — Qué es el producto, para quién, los 4 perfiles de cliente, métricas de éxito
- `docs/DESIGN.md` — Sistema de diseño visual completo (paleta, tipografía, componentes, reglas)
- `docs/features/FEATURE_LANDING_DESIGN.md` — Landing page completa: copy exacto, secciones, checklists
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Gateway completo: 8 mecánicas, preguntas, variantes, scoring, mapa vivo, emails, CTA
- `docs/phases/` — Specs individuales por fase de construcción. Una fase = una sesión.

**Regla:** Si algo no está en estos documentos, pregunta antes de inventar. Estos docs contienen decisiones de producto validadas — no son sugerencias.

## Los 4 perfiles de cliente (resumen rápido)
1. **Productivo Colapsado** — Identidad = rendimiento. Lenguaje de eficiencia.
2. **Fuerte Invisible** — Vergüenza máxima. Solo datos y biología.
3. **Cuidador Exhausto** — Culpa de cuidarse. "Si tú caes, todos caen."
4. **Controlador Paralizado** — Necesita datos, estructura, garantías.

Los perfiles completos están en VISION.md. El copy de cada feature ya está calibrado para los 4.

## Comunicación
- Explica qué vas a hacer y por qué ANTES de ejecutar.
- Si usas un término técnico, explícalo entre paréntesis.
- Si necesito hacer algo manual, instrucciones paso a paso con exactitud.

## Base de datos (CRÍTICO)
- NUNCA modifiques sin avisarme ANTES.
- Explica: qué cambias, por qué, qué pasa con datos existentes, si hay riesgo.
- Después de aprobación: ejecuta Y actualiza docs/DATABASE.md.
- Cada migración debe ser reversible.

## Diseño (CRÍTICO)
- Lee docs/DESIGN.md ANTES de construir pantallas.
- NUNCA inventes valores de diseño. Todo viene de DESIGN.md.
- Implementa en dos fases:
  FASE 1: Solo diseño visual con datos ficticios → espera mi aprobación
  FASE 2: Solo después de aprobación, conecta la funcionalidad
- Variables de diseño centralizadas. Nunca valores sueltos en el código.

## La experiencia (CRÍTICO)
- La landing ES el gateway. No hay páginas separadas. Una sola experiencia.
- P1 está visible en el hero. Sin botón "Empezar." La persona llega y la pregunta está ahí.
- Mobile-first 375px. Si no funciona en móvil, no existe.
- Fondo oscuro cálido (#0B0F0E). Nunca #000000 ni #FFFFFF puros.
- El verde acento (#4ADE80) SOLO para CTAs, links y estados positivos.
- Cormorant Garamond para headlines/display, Inter para cuerpo, Inter Tight para UI.
- Cada feature doc tiene su propia checklist al final. Valida contra ella antes de cerrar.

## Desarrollo
- Lee la fase correspondiente en docs/phases/ + los feature docs referenciados.
- Al completar una funcionalidad, SIEMPRE actualiza:
  docs/PROGRESS.md, docs/DATABASE.md (si cambió), docs/DECISIONS.md (si decidiste algo nuevo).
- Antes de decirme que algo está terminado:
  1. Revisión técnica: estados vacíos, loading, error, datos inválidos,
     doble clic, responsive, seguridad.
  2. Revisión de experiencia: checklist del feature doc correspondiente.

## Seguridad
- Sigue docs/SECURITY.md siempre (se genera en Fase 0).
- Nunca expongas datos sensibles en frontend.
- APIs externas siempre por backend.
- Credenciales en variables de entorno, nunca en código.
- Los mapas vivos son privados. URL con hash único. Sin autenticación pero no indexables.

## Stack
Se decide en la Fase 0. Claude Code elige y justifica. Requisitos:
- Mobile-first
- Carga < 2 segundos
- Sin CMS
- Pasarela de pago (Stripe) para los 97€
- Analytics en cada paso
- Hosting simple (Vercel o similar)
