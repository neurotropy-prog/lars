# FASE 7 — EMAILS DE NOTIFICACIÓN
**Sesión 8 de Claude Code**

---

## Contexto

Los emails avisan de que hay valor nuevo en el mapa. No SON el valor — son la campana. Estética dark, un solo botón por email, mínimos.

## Docs a leer

- `CLAUDE.md`
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Sección: emails como notificación, email día 0 (Four Seasons)


## Los 8+ emails

**Día 0:** "Tu Mapa de Regulación"
- Score global + dimensión más comprometida + primer paso
- Botón: "Ver mi mapa completo"
- Four Seasons: mínimo, limpio, sin firma corporativa

**Día 3:** "Hay algo nuevo en tu mapa de regulación"
- Tu arquetipo del sistema nervioso está disponible
- Botón: "Ver mi mapa"

**Día 7:** "Tu mapa se ha actualizado"
- Nuevo insight sobre tu dimensión más comprometida
- Botón: "Ver mi mapa"

**Día 10-14:** "Javier puede revisar tu mapa contigo"
- 20 minutos. Sin compromiso. Ya tiene tus datos.
- Botón: "Agendar sesión"

**Día 14:** "Hay 3 subdimensiones nuevas disponibles"
- 2 preguntas más para mayor resolución
- Botón: "Ver mi mapa"

**Día 21:** "Un capítulo escrito para tu situación"
- Basado en tu dimensión más comprometida
- Botón: "Ver mi mapa"

**Día 30:** "Un mes desde tu diagnóstico — ¿ha cambiado algo?"
- Actualiza tu mapa en 30 segundos
- Botón: "Actualizar mi mapa"

**Día 90+:** "X meses desde tu mapa — una pregunta"
- Score original + ¿ha cambiado algo?
- Botón: "Actualizar mi mapa"

---

## Diseño email

- HTML responsive
- Estética dark consistente con el mapa (#0B0F0E fondo)
- Un solo botón por email (verde, pill)
- Sin firma corporativa pesada
- Sin footer de redes sociales
- Sin "síguenos"
- Mínimo. El email es mensajero, no protagonista.

---

## Lógica

- Trigger por cron job sincronizado con desbloqueos del mapa
- NO enviar si ya convirtió a Semana 1 (excepto día 30 reevaluación — aplica a todos)
- Parar después de 3 emails consecutivos no abiertos
- Tracking de apertura y clic
- Link de unsubscribe obligatorio

---

## Entregable

- Templates de los 8+ emails
- Sistema de envío programado (sincronizado con desbloqueos de Fase 6)
- Lógica de supresión (convertidos, no-abiertos consecutivos)
- Tracking de apertura y clic
- Unsubscribe funcional

## Criterio de cierre

- [ ] Emails llegan a inbox (probar Gmail, Outlook, Apple Mail)
- [ ] El diseño es coherente con el mapa (dark, minimal, un botón)
- [ ] Lógica de supresión funciona (no envía a convertidos, para tras 3 no abiertos)
- [ ] Cada email tiene un solo CTA claro
- [ ] Los links llevan a la URL correcta del mapa
- [ ] Unsubscribe funciona
- [ ] PROGRESS.md actualizado
