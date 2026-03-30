# FASE 5 — MAPA VIVO + CTA + STRIPE
**Sesión 6 de Claude Code**

---

## Contexto

El mapa vivo es la URL única personal donde la persona ve su resultado completo. Es el activo central del sistema — un micro-producto gratuito que evoluciona en el tiempo. En esta fase se construye el mapa base (día 0) + el CTA + la integración de pago.

## Docs a leer

- `CLAUDE.md`
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Secciones: M6 (Resultado como mapa), M7 (CTA como alivio), M8 (Urgencia natural), Momento WOW, 5 puentes líquidos, cadena de confianza, compartir + descarga


## URL: dominio.com/mapa/[hash]

No indexable. Sin autenticación. La URL es la llave.

---

## MOMENTO WOW — Revelación progresiva

La persona espera un número. Recibe un dashboard que se despliega.

**Timing:**
```
Segundo 0:   Score global aparece (counter 0→34, 1200ms)
Segundo 1.5: Pausa. Solo el score.
Segundo 2:   D1 Regulación Nerviosa (fade-in 400ms + barra se llena 800ms)
Segundo 3:   D2 Calidad de Sueño
Segundo 4:   D3 Claridad Cognitiva
Segundo 5:   D4 Equilibrio Emocional
Segundo 6:   D5 Alegría de Vivir
Segundo 7:   "Tu prioridad" se destaca en dimensión más baja
Segundo 8:   Primer paso recomendado aparece
```

---

## Estructura del mapa (día 0)

**Header:**
- Overline: "TU DIAGNÓSTICO"
- Título: "Tu Mapa de Regulación" (Cormorant Garamond)
- Sub: "Calibrado con +25.000 evaluaciones reales · Basado en tus 10 respuestas"

**Score global:** 34/100 + badge "Comprometido" + texto contextual

**5 dimensiones** (cards, 1 col móvil, 2 col desktop):
Cada card: nombre + score + barra color semáforo + insight personalizado + "Tu prioridad nº1" si es la más baja + "Mejorable en 72 horas" si es D2 (sueño)

(Textos exactos de cada dimensión en FEATURE_GATEWAY_DESIGN.md, M6)

**Primer paso recomendado** (card verde sutil):
Texto calibrado según D1+D2 + dato de personas con perfil similar.

**5 puentes líquidos** (integrados en dimensiones, no en sidebar):
Textos caption en cada dimensión que revelan profundidad no accesible sin programa.
(Textos exactos en FEATURE_GATEWAY_DESIGN.md, sección puentes)

---

## CTA — Semana 1 (M7)

**Pre-CTA (Cormorant Garamond, h3, italic):**
> "Tu sistema nervioso lleva años sosteniendo lo que tú no podías soltar. Ahora tienes el mapa."

**Delta de alivio (body):**
> "Los primeros cambios llegan en 72 horas. No en meses — en 3 días."

**Botón pill verde large:** "Empieza la Semana 1"

**Post-CTA (body-sm, tertiary):**
> "97€ · Protocolo de Sueño de Emergencia + Sesión 1:1 con Javier + MNN© · Garantía de 7 días"

**Garantía (caption, tertiary):**
> "Si tu sueño no mejora en 7 días, te devolvemos los 97€. Sin preguntas."

**Card colapsable** con detalle de qué incluye la Semana 1.

---

## Stripe

- Integración Stripe Checkout para los 97€
- Moneda: EUR
- Después del pago exitoso: página de confirmación + email de bienvenida
- Si falla: mensaje claro + retry
- Webhook para registrar conversión en BD

---

## Urgencia natural (M8)

Debajo del CTA, sutil:
> "Cada semana sin regulación, tu cuerpo profundiza el patrón actual."

Dato de actividad:
> "142 personas completaron este diagnóstico esta semana · 5.247 en total"

---

## Compartir + Descarga

**"¿Conoces a alguien que podría necesitar ver su mapa?"**
- Botón ghost: "Enviar el diagnóstico" → genera link al gateway (NO a su mapa)
- Botón ghost: "Descargar mi mapa" → PNG limpio con scores + estética dark

**Fecha de última visita:** "Última visita: hace X días" (dato, no reproche)

---

## Entregable

- URL única funcional con hash
- Revelación progresiva animada (8 segundos)
- 5 dimensiones con scores, barras, insights, colores semáforo
- Primer paso recomendado calibrado
- 5 puentes líquidos integrados
- CTA completo con detalle colapsable
- Stripe Checkout integrado (97€)
- Página post-pago
- Compartir (link al gateway) + descarga PNG
- Fecha de última visita

## Criterio de cierre

- [ ] La revelación progresiva genera WOW (probar con alguien que no conozca el proyecto)
- [ ] Los scores coinciden con lo calculado en la bisagra
- [ ] Los insights son coherentes con las respuestas
- [ ] Stripe funciona end-to-end (pago de prueba)
- [ ] La descarga PNG se ve profesional
- [ ] El link de compartir lleva al gateway, NO al mapa personal
- [ ] Todo funciona en 375px
- [ ] PROGRESS.md actualizado
