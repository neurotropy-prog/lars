# FASE 2 — P2-P4 + PRIMERA VERDAD + MICRO-ESPEJO 1
**Sesión 3 de Claude Code**

---

## Contexto

Primer bloque completo del gateway. Las preguntas que alimentan la primera verdad y el primer micro-espejo. La persona ya respondió P1 (Fase 1).

## Docs a leer

- `CLAUDE.md`
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Secciones: M1 (Primera Verdad), M2 (Gradiente, P3-P4), M3 (Micro-espejo 1)
- `docs/DESIGN.md` — Componentes: micro-espejo, barra de progreso, cards


## Flujo

```
P1 (ya hecha, Fase 1) → P2 (sueño) → PRIMERA VERDAD → P3 (cognitivo) → P4 (emocional) → MICRO-ESPEJO 1
```

---

## P2 — Sueño (D2)

**Barra progreso:** 20%

**Pregunta:** "¿Cómo son tus noches últimamente?"
**Contexto:** "Tu sueño es el indicador más fiable de cómo está tu sistema nervioso."

**5 opciones:** (ver FEATURE_GATEWAY_DESIGN.md, sección M1, Pregunta 2 para texto y señales completas)
- A. "Me cuesta dormirme — mi mente no se apaga"
- B. "Me despierto a las 3-4 de la mañana y no puedo volver a dormirme"
- C. "Duermo horas pero me despierto igual de cansado"
- D. "Duermo poco pero funciono"
- E. "Mi sueño es razonablemente bueno"

---

## PRIMERA VERDAD — Revelación post-P1×P2

**Transición visual:**
- Opciones fade out (300ms)
- Fondo oscurece de `bg-primary` a `bg-secondary` (600ms ease)
- "Analizando tus respuestas..." con typing effect (1.5s)
- Primera verdad aparece con fade-in

**Componente:** micro-espejo (borde izquierdo verde, fondo bg-secondary)

**5 variantes según P1×P2:** (ver FEATURE_GATEWAY_DESIGN.md, tabla de variantes completa)

Ejemplo P1=A + P2=B:
> "Tu agotamiento no es cansancio normal. Tu cortisol se dispara de noche porque tu sistema no distingue descanso de amenaza."

**Dato colectivo** debajo de cada variante. Counter animado.

**Regla:** Siempre contiene (1) lo que siente nombrado con sus palabras, (2) causa biológica, (3) dato colectivo. Nunca genérica.

**Checkpoint 1 — AWARENESS:** "Esto es más concreto de lo que esperaba. Me está leyendo."

---

## P3 — Claridad cognitiva (D3)

**Barra progreso:** 35%

**Pregunta:** "¿Reconoces alguna de estas señales en tu día a día?"
**Contexto:** "Tu cerebro consume el 20% de tu energía total. Cuando el sistema nervioso está en alerta, desvía esos recursos a la supervivencia."
**Dato:** "El 68% de ejecutivos con tu perfil reportan 3 o más de estos síntomas."

**SELECCIÓN MÚLTIPLE (puede marcar varias):**
- ☐ "Niebla mental" — *Leo algo y al terminar no sé qué he leído*
- ☐ "Peores decisiones" — *Tomo peores decisiones que antes — y lo noto*
- ☐ "Mente dispersa" — *Mi cabeza salta de un tema a otro sin control*
- ☐ "Palabras perdidas" — *Me cuesta encontrar palabras que antes tenía*
- ☐ "Agotamiento decisional" — *Al final del día no puedo elegir ni qué cenar*
- ☐ "Ninguna de estas"

Botón "Continuar" aparece al marcar ≥1.

---

## P4 — Equilibrio emocional (D4)

**Barra progreso:** 45%

**Pregunta:** "¿Cuál de estas frases podrías haber dicho tú esta semana?"
**Contexto:** "La reactividad emocional no es un defecto de carácter. Es la respuesta de un cerebro que ha agotado los recursos para regular."
**Dato:** "Esta es la pregunta que más tarda en responderse. Tómate tu tiempo."

**6 opciones selección única:** (ver FEATURE_GATEWAY_DESIGN.md, P4 completa)
- A. Irritabilidad
- B. Vacío
- C. Explosiones de culpa
- D. Anestesia emocional
- E. Rumiación constante
- F. Razonablemente bien

---

## MICRO-ESPEJO 1 — Post-P3×P4

**Barra progreso:** 50%

**Transición:** Fondo oscurece. Micro-espejo slide-in desde izquierda (400ms). Borde izquierdo verde.

**4 variantes según P3×P4:** (ver FEATURE_GATEWAY_DESIGN.md, tabla de variantes micro-espejo 1)

Ejemplo muchos síntomas + A (irritabilidad):
> "Tu cabeza va a mil pero tu capacidad de procesar se ha reducido. No es que seas menos capaz — es que tu cerebro está usando su energía para mantenerte en alerta en lugar de para pensar con claridad."

**Dato colectivo** calibrado por combinación.

**Conexión futura:** Conecta D3 (niebla) con D4 (reactividad) bajo causa D1 (SN desregulado). Prepara la bisagra.

---

## Barra de progreso — Comportamiento

No lineal:
- Se mueve en preguntas (10% → 20% → 35% → 45% → 50%)
- PAUSA en revelaciones (primera verdad y micro-espejo — no avanza)
- Label: "Tu diagnóstico: X% completo"

---

## Entregable

- P2, P3, P4 funcionales con todas las opciones
- P3 con selección múltiple (botón "Continuar" aparece al marcar ≥1)
- Primera verdad con 5 variantes según P1×P2
- Micro-espejo 1 con 4+ variantes según P3×P4
- Transiciones ZONA 1 ↔ ZONA 2 implementadas (600ms ease)
- Animación "Analizando..." con typing effect
- Barra de progreso no lineal
- Todos los datos se guardan en localStorage en tiempo real

## Criterio de cierre

- [ ] Las transiciones entre zonas se SIENTEN (cambio de espacio, no solo de fondo)
- [ ] La primera verdad se siente personalizada (probar con diferentes combinaciones de P1×P2)
- [ ] El micro-espejo conecta P3 con P4 de forma coherente
- [ ] P3 selección múltiple funciona correctamente
- [ ] Todo funciona en 375px sin scroll horizontal
- [ ] Las animaciones no bloquean interacción
- [ ] localStorage guarda estado después de cada respuesta
- [ ] PROGRESS.md actualizado
