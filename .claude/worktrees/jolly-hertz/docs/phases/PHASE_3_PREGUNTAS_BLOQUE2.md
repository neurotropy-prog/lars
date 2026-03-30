# FASE 3 — P5-P8 + MICRO-ESPEJO 2 + PERSONALIZACIÓN TONO
**Sesión 4 de Claude Code**

---

## Contexto

Segundo bloque del gateway. Las preguntas profundas que revelan el perfil y alimentan la bisagra. La persona ya completó P1-P4 + primera verdad + micro-espejo 1.

## Docs a leer

- `CLAUDE.md`
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Secciones: M2 continúa (P5-P6), M3 (Micro-espejo 2), M4 (P7-P8)


## Flujo

```
MICRO-ESPEJO 1 (Fase 2) → P5 (alegría) → P6 (frase identitaria) → MICRO-ESPEJO 2 → P7 (sliders) → P8 (duración)
```

---

## Personalización de tono (invisible, post-P4)

El sistema ya sabe quién tiene delante. P4 reveló el patrón emocional. El CONTENIDO de P5/P6 no cambia — el CONTEXTO sutil sí:

| Perfil detectado | Ajuste |
|---|---|
| Fuerte (P4=D) | Más directo. "Dato:" en vez de "Esto sugiere..." |
| Cuidador (P4=C) | Más suave. "No hay prisa" en algún punto. |
| Controlador (P4=E) | Más datos. "Basado en tu combinación..." |
| Productivo (P4=A) | Sin rodeos. Tono eficiente. |

---

## P5 — Alegría de vivir (D5)

**Barra progreso:** 60%

**Pregunta:** "¿Cuándo fue la última vez que disfrutaste algo de verdad — sin culpa, sin prisa, sin pensar en lo siguiente?"
**Dato:** "El 41% de personas que hacen este diagnóstico no recuerdan cuándo fue."

**5 opciones:** A. No lo recuerdo / B. Hace semanas o meses / C. Puedo pero no suelto la cabeza / D. Disfruto con culpa / E. Disfruto con frecuencia

(Texto completo y señales en FEATURE_GATEWAY_DESIGN.md, P5)

---

## P6 — Frase identitaria (la más importante del gateway)

**Barra progreso:** 70%

**Pregunta:** "¿Cuál de estas frases sientes más verdadera ahora mismo?"
**Dato:** "Cada una de estas frases la ha elegido más de 1.000 personas antes que tú."

**5 opciones:**
- A. **"No puedo parar"** → Perfil Productivo confirmado
- B. **"Puedo con todo"** → Perfil Fuerte confirmado
- C. **"Si yo caigo, todos caen"** → Perfil Cuidador confirmado
- D. **"Necesito entender primero"** → Perfil Controlador confirmado
- E. **"He probado de todo"** → Lock bioquímico confirmado

(Texto completo y señales en FEATURE_GATEWAY_DESIGN.md, P6)

---

## MICRO-ESPEJO 2 — Post-P6

**Barra progreso:** 75%

**Transición:** Igual que micro-espejo 1. Fondo oscuro. Borde verde.

**5 variantes — una por frase identitaria:** (ver FEATURE_GATEWAY_DESIGN.md, M3 Micro-espejo 2)

Ejemplo P6=A ("No puedo parar"):
> "Llevas años confundiendo resistencia con fortaleza. Tu cuerpo te pide parar pero tu miedo te dice que no puedes. No necesitas parar. Necesitas regularte para que tu rendimiento no dependa de tu desgaste."

Cada variante tiene dato colectivo calibrado.

**Checkpoint 2 — CLARITY:** "Ahora entiendo lo que me pasa. No soy yo — es mi sistema nervioso."

---

## P7 — Sliders (todas las dimensiones)

**Barra progreso:** 82%

**Pregunta:** "En una escala del 1 al 10, ¿cómo calificarías cada una de estas áreas?"

**5 sliders horizontales:**
1. Capacidad de descansar y desconectar
2. Calidad de tu sueño
3. Claridad para pensar y decidir
4. Estabilidad emocional
5. Ilusión por lo que haces

Sin valor por defecto — la persona debe mover cada uno. Feedback de color en tiempo real: ≤3 rojo, 4-6 amarillo, ≥7 verde. Valor numérico visible.

**Si intenta avanzar sin mover todos:** "Mueve todos los indicadores para un diagnóstico preciso." Highlight en los que faltan. Si insiste 2ª vez → puede avanzar.

---

## P8 — Duración

**Barra progreso:** 90%

**Pregunta:** "¿Cuánto tiempo llevas sintiéndote así?"
**Contexto:** "La duración importa: determina cómo responde tu cuerpo a la intervención."

**4 opciones:** A. Semanas / B. Meses / C. Más de un año / D. Años — no recuerdo estar bien

---

## Entregable

- P5, P6, P7, P8 funcionales con todas las opciones
- Micro-espejo 2 con 5 variantes según P6
- Sliders con feedback visual de color en tiempo real
- Personalización de tono implementada (cambios sutiles según perfil P4)
- Toda la señal almacenada en localStorage para calcular scores

## Criterio de cierre

- [ ] P6 se siente como "la pregunta importante" — probar las 5 opciones
- [ ] Sliders fluidos en móvil (touch-friendly, min 44px height)
- [ ] Micro-espejo 2 habla el idioma del perfil detectado
- [ ] Personalización de tono sutil pero perceptible
- [ ] El sistema tiene toda la señal necesaria para los 5 scores
- [ ] Todo funciona en 375px
- [ ] PROGRESS.md actualizado
