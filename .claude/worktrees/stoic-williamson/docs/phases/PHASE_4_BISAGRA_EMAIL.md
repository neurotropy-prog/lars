# FASE 4 — BISAGRA + EMAIL CAPTURE
**Sesión 5 de Claude Code**

---

## Contexto

El momento de máximo impacto del gateway. La bisagra revela el score, muestra la brecha, y genera la tensión que convierte el email en la llave del mapa. La persona ya completó las 8 preguntas + 2 micro-espejos.

## Docs a leer

- `CLAUDE.md`
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Secciones: M4 (Bisagra), PANTALLA EMAIL, fórmula de scoring completa


## Flujo

```
P8 (Fase 3) → "Calculando tu perfil..." → BISAGRA (score + brecha + coste) → EMAIL CAPTURE → Redirect a mapa
```

---

## BISAGRA — La revelación

**Transición:**
- Fondo oscurece al máximo
- "Calculando tu perfil de regulación..." (typing effect, 2s)
- Score aparece con counter animado (0→34, 1200ms)

**Componente bisagra** (fondo gradiente sutil, borde verde tenue, border-radius 16px):

```
TU NIVEL DE REGULACIÓN (overline, accent)

34 (display, Cormorant Garamond, 56px)
de 100 (h4, secondary)

El promedio de personas que empezaron a regularse:
72 (display, Cormorant Garamond, 56px, accent)

"La distancia entre ambos números es donde está tu oportunidad."

---

"Con un nivel de regulación de 34, tu cuerpo pierde unas 12-15 horas
semanales de rendimiento real. No en tiempo — en calidad de decisiones,
en paciencia, en energía para lo que importa."

"De las 5.247 personas con un score similar al tuyo, las que actuaron
en la primera semana mejoraron un 34% más rápido que las que esperaron."
```

**Fórmula de scoring completa:** Ver FEATURE_GATEWAY_DESIGN.md, sección "Cómo se calcula el score". Implementar:
- Media ponderada D1(30%) + D2(20%) + D3(20%) + D4(15%) + D5(15%)
- Ajustes por negación (P2=D + slider>6), vergüenza (P6=B), cronificación (P8=C/D), anestesia (P4=D)
- Escala semáforo: 0-39 rojo, 40-59 naranja, 60-79 amarillo, 80-100 verde

Botón ghost: **"Ver mi diagnóstico completo"**

---

## EMAIL CAPTURE

**Lo que ve:** Score 34/100 visible arriba. Detrás del contenido: las 5 barras de dimensión DIFUMINADAS (CSS blur 8px + opacity 0.3). Colores semáforo visibles pero ilegibles. La persona CASI VE su resultado.

**Headline:** "Tu diagnóstico está listo"
**Subtítulo:** "Lo guardamos en una página personal para ti. Evoluciona con el tiempo — cada semana hay algo nuevo."

**Campo:** Un solo campo email. Placeholder: "Tu email". Sin nombre, sin teléfono, sin nada más.
**Botón pill verde:** "Acceder a mi diagnóstico"
**Bajo botón:** "Solo email. Cero spam. Tu diagnóstico es confidencial."

**Validación email:** En tiempo real. Si inválido → mensaje sutil.
**Email repetido:** "Ya tienes un mapa" → opción de ver existente o actualizar.

**Al enviar:**
1. Crear URL única: `dominio.com/mapa/[hash-único]`
2. Enviar email con link (email día 0)
3. Redirect automático a la URL del mapa
4. Guardar en base de datos: email, respuestas P1-P8, scores D1-D5, score global, perfil, timestamp

---

## Entregable

- Algoritmo de scoring implementado con la fórmula exacta
- Bisagra con counter animado y layout completo
- Mapa borroso detrás del email capture (blur + opacity)
- Campo email con validación en tiempo real
- Detección de email repetido
- Creación de URL única con hash
- Envío de email día 0 (template Four Seasons)
- Redirect automático post-email
- Almacenamiento completo en BD

## Criterio de cierre

- [ ] El score se calcula correctamente (probar con 5+ combinaciones diferentes)
- [ ] Los ajustes por negación/vergüenza/cronificación funcionan
- [ ] El counter animado se siente bien (no demasiado rápido ni lento)
- [ ] El mapa borroso genera tensión (se ven colores pero no se lee)
- [ ] Email válido → redirect inmediato al mapa
- [ ] Email repetido → manejo elegante
- [ ] Email día 0 llega a inbox (probar Gmail, Outlook)
- [ ] Todo funciona en 375px
- [ ] PROGRESS.md actualizado
