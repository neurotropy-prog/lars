## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión GATEWAY-APRENDE: A/B testing ligero de micro-espejos y optimización basada en datos

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño visual
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Los micro-espejos (A-02, A-06, A-08 en ANIMATIONS.md)
- `docs/DATABASE.md` — Schema actual

## Lo que ya está construido
- Gateway con 10 preguntas
- 3 micro-espejos que validan al usuario (Páginas 2, 5, 8)
- Mapa vivo
- Admin con seguimiento de conversión

## Tu tarea

Lee `docs/ANIMATIONS.md` completamente (especialmente secciones de micro-espejos: A-02, A-06, A-08).

Esta sesión implementa **A/B testing ligero** de las variantes de cada micro-espejo. El objetivo: identificar cuál versión genera mayor completion rate (llegar a Página 10) y mejor conversión (pago después de ver mapa).

**Arquitectura:**
- 2-3 variantes por micro-espejo (asignación aleatoria, localStorage + BD)
- Medición: completion rate, conversión, engagement
- Dashboard en admin para ver resultados
- Sin librería externa (vanilla JS + localStorage)

Implementa en dos fases:
**FASE VISUAL:** Diseña el dashboard de resultados en admin. Avísame cuando esté listo.
**FASE FUNCIONAL:** Solo después de aprobación, conecta medición real.

### Tarea 1: Variantes de micro-espejos

**MICRO-ESPEJO 1 (Página 2 — "Tu verdad")**

Condición de aparición: Después que usuario contesta las 2 primeras preguntas (stress alto + otro factor)

**Variante A (Control) — Reflexiva:**
```
¿Reconoces este patrón?

Rendimiento constante,
hasta que un día el cuerpo dice basta.

[Sí, es exacto]  [Parcialmente]  [No es mi caso]
```

**Variante B — Directa:**
```
Esto que ves es real.

No es depresión.
No es burnout clínico.
Es: un sistema nervioso al máximo.

¿Te describes así?
[Sí, completamente]  [Algo parecido]  [No]
```

**Variante C — Médica:**
```
Tu patrón de respuestas sugiere:

Regulación nerviosa comprometida.
Evaluada en 5 dimensiones.
Sin diagnóstico clínico — solo biomarcadores.

¿Esto encaja contigo?
[Exactamente]  [Bastante]  [No del todo]
```

---

**MICRO-ESPEJO 2 (Página 5 — "Primera verdad")**

Condición: Después de preguntas 5-7 (patrón de sueño + energía)

**Variante A (Control) — Empática:**
```
Aquí está lo que pasó.

Tu cuerpo ha estado en modo "go" demasiado tiempo.
El sueño es lo primero en colapsar.
La energía viene después.

[Entendido — qué sigue]
```

**Variante B — Objetiva:**
```
Datos de Preguntas 5-7:

Calidad de sueño: baja
Energía durante el día: impactada
Sistema: en estado compensatorio

[Continuar análisis]
```

**Variante C — Validación:**
```
Aquí está tu situación.

El 72% de ejecutivos en tu situación
reportan patrones idénticos de sueño.
No es fracaso tuyo. Es patrón biológico.

[Siguiente]
```

---

**MICRO-ESPEJO 3 (Página 8 — "Micro-espejo 2" / Segunda validación)**

Condición: Después de preguntas 8-9 (atención + digestión)

**Variante A (Control) — Síntesis:**
```
Lo que hemos visto hasta aquí:

5 dimensiones comprometidas.
Un patrón clara: regulación nerviosa.
Tu recupero tiene una ruta clara.

[Ver tu mapa]
```

**Variante B — Esperanza:**
```
Aquí está la buena noticia.

Todo lo que ves aquí es reversible.
La mayoría de personas en tu situación
ven cambios en 30 días.

[Ver tu mapa]
```

**Variante C — Estructura:**
```
Resumen de tu análisis:

Regulación Nerviosa: Comprometida
Sueño: Impactado
Energía: Reducida
Atención: Afectada
Digestión: Desregulada

Plan de recupero: 12 semanas.
[Comenzar]
```

### Tarea 2: Asignación aleatoria y tracking

**Lógica en el gateway:**

```typescript
// Pseudo-código
function assignVariant(microespejo_id: string): 'A' | 'B' | 'C' {
  // Intentar leer de localStorage
  const stored = localStorage.getItem(`variant_${microespejo_id}`);
  if (stored) return stored;

  // Si no existe, asignar aleatoriamente (33% cada variante)
  const variants = ['A', 'B', 'C'];
  const assigned = variants[Math.floor(Math.random() * 3)];

  // Guardar en localStorage
  localStorage.setItem(`variant_${microespejo_id}`, assigned);

  // Guardar en BD (tabla diagnosticos)
  // Esto se hace DESPUÉS de que termina el gateway

  return assigned;
}

// En el componente del micro-espejo
useEffect(() => {
  const variant = assignVariant('micro-espejo-1');
  renderVariant(variant);

  // Registrar que el usuario vio esta variante
  logEvent({
    event_type: 'microespejo_shown',
    microespejo_id: 'micro-espejo-1',
    variant: variant,
    timestamp: now()
  });
}, []);
```

**Cuando completa el gateway:**

Guardar todas las variantes asignadas en tabla `diagnosticos`:

```
variants: {
  "micro-espejo-1": "B",
  "micro-espejo-2": "A",
  "micro-espejo-3": "C"
}
```

(Almacenar como JSONB en PostgreSQL)

### Tarea 3: Tabla de tracking

```
CREATE TABLE ab_test_events (
  id UUID PRIMARY KEY,
  diagnostic_id UUID (FK diagnosticos),
  microespejo_id VARCHAR ('micro-espejo-1', 'micro-espejo-2', 'micro-espejo-3'),
  variant VARCHAR ('A', 'B', 'C'),
  event_type VARCHAR ('shown', 'clicked', 'completed'),
  event_data JSONB,
  created_at TIMESTAMP
);
```

**Eventos capturados:**
- `shown` — Usuario vio el micro-espejo
- `clicked` — Usuario hizo click en opción (registrar cuál)
- `completed` — Usuario continuó al siguiente paso (completion rate)

### Tarea 4: Métricas calculadas

Para cada micro-espejo x variante:

```
- view_count: COUNT(event_type='shown')
- completion_rate: COUNT(next_page_reached) / COUNT(shown)
- engagement: (clicked) / (shown)
- conversion_rate: COUNT(paid) / COUNT(showed the variant)
```

Ejemplo:
```
micro-espejo-1, variante A:
  - Views: 47
  - Completions: 38 (80.8%)
  - Conversion: 12 pago / 47 vista (25.5%)

micro-espejo-1, variante B:
  - Views: 51
  - Completions: 44 (86.3%)
  - Conversion: 15 pago / 51 vista (29.4%)

micro-espejo-1, variante C:
  - Views: 42
  - Completions: 34 (80.9%)
  - Conversion: 8 pago / 42 vista (19.0%)
```

### Tarea 5: Dashboard en admin

Nueva sección: `/admin/ab-testing`

**Vista general:**

```
A/B TESTING — MICRO-ESPEJOS

Test activo desde: 15 Mar 2026
Duración recomendada: 30 días (alcanzar 200+ vistas por variante)

[TABLA DE RESULTADOS]

Micro-Espejo 1: "Tu verdad"

| Variante | Vistas | Completions | Completion % | Conversiones | Conv % | Recomendación |
|----------|--------|------------|-------------|---|---|-----------|
| A (Reflexiva) | 47 | 38 | 80.8% | 12 | 25.5% | — |
| B (Directa) | 51 | 44 | 86.3% ✅ | 15 | 29.4% ✅ | Ganador |
| C (Médica) | 42 | 34 | 80.9% | 8 | 19.0% | — |

Estadística: B es 5.5% mejor en completion que A (p-value: 0.23, no significativo)

---

Micro-Espejo 2: "Primera verdad"

| Variante | Vistas | Completions | Completion % | Conversiones | Conv % | Recomendación |
|----------|--------|------------|-------------|---|---|-----------|
| A (Empática) | 38 | 33 | 86.8% ✅ | 9 | 23.7% | Ganador |
| B (Objetiva) | 44 | 37 | 84.1% | 12 | 27.3% ✅ | — |
| C (Validación) | 40 | 31 | 77.5% | 7 | 17.5% | — |

Estadística: A vs B no es significativo. Empática lidera.

---

Micro-Espejo 3: "Segunda validación"

| Variante | Vistas | Completions | Completion % | Conversiones | Conv % | Recomendación |
|----------|--------|------------|-------------|---|---|-----------|
| A (Síntesis) | 35 | 32 | 91.4% ✅ | 10 | 28.6% | Ganador |
| B (Esperanza) | 52 | 44 | 84.6% | 13 | 25.0% | — |
| C (Estructura) | 39 | 33 | 84.6% | 11 | 28.2% | — |

Estadística: A es 6.8% mejor (p-value: 0.08, marginalmente significativo)

---

[GRÁFICOS]

Por cada micro-espejo:
- Gráfico de barras: Completion % por variante
- Gráfico de línea: Trend a lo largo del tiempo

[ACCIONES]

☑️ Bloquear ganadores (dejar de rotar, usar siempre ese)
☑️ Pausar test
☑️ Reset y empezar de nuevo con nuevas variantes
☑️ Exportar CSV
```

**Vista de detalle (click en micro-espejo):**

```
MICRO-ESPEJO 1 — DETALLE

Test actual: Reflexiva vs Directa vs Médica
Iniciado: 15 Mar 2026
Estado: En progreso (objetivo: 200+ vistas/variante)

[LÍNEA DE TIEMPO]

Semana 1 (15-21 Mar):
  Variante A: 12 vistas, 10 completions (83%)
  Variante B: 14 vistas, 12 completions (86%)
  Variante C: 11 vistas, 8 completions (73%)

Semana 2 (22-28 Mar):
  Variante A: 35 vistas, 28 completions (80%)
  Variante B: 37 vistas, 32 completions (86%)
  Variante C: 31 vistas, 26 completions (84%)

[COMPARATIVA DE VARIANTES]

Variante A — Reflexiva
"¿Reconoces este patrón? Rendimiento constante, hasta que..."

Completion rate: 80.8%
Avg time to complete: 1.2s
Next page: 38/47 (80.8%)
Paid conversion (30-day): 12/47 (25.5%)

Variante B — Directa
"Esto que ves es real. No es depresión. No es burnout..."

Completion rate: 86.3% ✅
Avg time to complete: 0.9s (más rápida)
Next page: 44/51 (86.3%)
Paid conversion (30-day): 15/51 (29.4%) ✅

Variante C — Médica
"Tu patrón sugiere regulación comprometida..."

Completion rate: 80.9%
Avg time to complete: 1.8s (más lenta)
Next page: 34/42 (80.9%)
Paid conversion (30-day): 8/42 (19.0%)

INSIGHT: B es la más efectiva. C es más lenta pero más "profesional" (no convierte).
```

### Tarea 6: Endpoints de admin

**GET `/api/admin/ab-testing/results`**

```json
{
  "test_start_date": "2026-03-15",
  "test_status": "active",
  "microspejos": [
    {
      "microespejo_id": "micro-espejo-1",
      "variants": [
        {
          "variant": "A",
          "label": "Reflexiva",
          "views": 47,
          "completions": 38,
          "completion_rate": 0.808,
          "conversions": 12,
          "conversion_rate": 0.255,
          "avg_time_to_completion_seconds": 1.2
        },
        { ... B ... },
        { ... C ... }
      ]
    }
  ]
}
```

**POST `/api/admin/ab-testing/lock-variant`**

```
Body:
{
  "microespejo_id": "micro-espejo-1",
  "winning_variant": "B"
}

Response:
{
  "success": true,
  "message": "Variante B bloqueada para micro-espejo-1. Todos los usuarios verán B a partir de ahora."
}
```

### Tarea 7: Pausar y resetear test

**POST `/api/admin/ab-testing/pause`**

Pausa la rotación aleatoria. Todas las futuras sesiones verán las variantes actuales (sin cambio aleatorio).

**POST `/api/admin/ab-testing/reset`**

Borra todos los datos del test y empieza de nuevo con nuevas variantes.

### Tarea 8: Cálculo de significancia estadística

En el dashboard, mostrar p-value simple (prueba chi-cuadrado):

```typescript
// Pseudo-código
function chiSquareTest(variantA, variantB) {
  const completionDiffSignificance = calculateChiSquare(
    variantA.completions,
    variantA.views - variantA.completions,
    variantB.completions,
    variantB.views - variantB.completions
  );

  return completionDiffSignificance; // p-value
}

// En dashboard:
if (pValue < 0.05) {
  showBadge("Diferencia significativa");
} else if (pValue < 0.10) {
  showBadge("Marginalmente significativa");
} else {
  showBadge("No significativo aún");
}
```

No necesitas librería externa — implementar el test manualmente.

### Tarea 9: Restricciones y safety

- Mínimo 50 vistas por variante antes de declararla "ganadora"
- Mínimo 30 días de test antes de conclusiones sólidas
- Si hay <3 usuarios/día, mostrar advertencia ("Test lento, recoge datos")
- Si una variante tiene >90% completion, verificar que no hay bug (ej: botón que no funciona)

### Tarea 10: Integración con perfiles

(Opcional pero recomendado)

Los micro-espejos pueden responder diferente según perfil detectado hasta ese punto:

```
Si después de Pregunta 3, el sistema SABE que es Productivo Colapsado:
  → Mostrar Variante B (Directa) — PC responde mejor a lenguaje claro

Si es Fuerte Invisible:
  → Mostrar Variante C (Médica) — FI responde mejor a datos/ciencia
```

Esto requiere que el sistema note el perfil incluso durante el gateway (no solo al final). Es un enhancement para después.

## INTELIGENCIA DEL SISTEMA

### Análisis por segmento (OBLIGATORIO)
No solo medir rendimiento global de cada variante. Medir POR PERFIL:
- "Variante A funciona mejor para PC (87% completion), pero Variante C funciona mejor para FI (91% completion)"
- Esto permite: mostrar variante A a PC y variante C a FI (personalización de micro-espejo por perfil)
- Dashboard: tabla cruzada Variante × Perfil con completion rate y conversion rate

### Multi-armed bandit (OBLIGATORIO)
No esperar 30 días para declarar ganador. Implementar Thompson Sampling:
1. Cada variante tiene un distribution de éxito (Beta distribution)
2. En cada nueva visita, samplear de cada distribución y mostrar la que tenga mayor valor
3. Esto naturalmente envía MÁS tráfico a la variante ganadora mientras sigue explorando
4. Resultado: menos personas ven la variante perdedora = menos oportunidades perdidas
5. Explicar a Javier en admin: "El sistema está enviando 70% del tráfico a Variante B porque tiene mejores resultados. Sigue explorando A y C con el 30% restante."

### Conexión con CO-LEARNING (OBLIGATORIO)
Los resultados del A/B testing alimentan sugerencias:
- "Variante B (directa) convierte 15% mejor que Variante A (reflexiva). Sugerir: aplicar tono directo también en emails de nurturing."
- "Los micro-espejos con datos cuantitativos funcionan 2x mejor para FI. Sugerir: más datos en toda la comunicación FI."
- Javier aprueba/rechaza → el sistema aprende qué insights son accionables

### Evolución continua de variantes (OBLIGATORIO)
Cuando una variante gana, no se detiene. El sistema genera una nueva variante:
1. Variante B gana → se convierte en nuevo control
2. Sistema sugiere nueva variante: "Variante D: como B pero con dato colectivo incluido"
3. Javier aprueba → nueva ronda de testing
4. Ciclo infinito de mejora: control → challenger → winner → nuevo control → nuevo challenger

### Conexión con datos colectivos
Los micro-espejos usan datos REALES de COLECTIVA DINÁMICA:
- "El 74% de ejecutivos como tú..." → el 74% viene del endpoint real, no hardcodeado
- Cuando los datos cambian (ej: mejora del 74% al 79%), los micro-espejos se actualizan automáticamente
- Esto significa que los micro-espejos son más poderosos con el tiempo (más datos = más credibilidad)

### Medición de impacto long-term
No solo medir completion/conversion inmediata. Medir:
- "Personas que vieron Variante B: ¿retención a 30 días?"
- "¿La variante del micro-espejo afecta qué perfil se detecta?" (si Variante C enfatiza datos, ¿más personas salen como FI?)
- Esto previene optimizar para conversión inmediata a costa de retención

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin mostrarme el SQL antes.
- Sin librerías externas de A/B testing (no Optimize, no Mixpanel, nada). Todo vanilla.
- localStorage para asignación local, BD para persistencia.
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- `/admin/ab-testing/*` requiere `isAdmin`
- Datos de test no se exponen en frontend (no revelar variantes a usuarios)

### 3. Calidad del código
- Cero console.log de debug
- Función reutilizable para asignar variantes
- Tabla ab_test_events con índices en (diagnostic_id, event_type)

### 4. Testing funcional
- Primera sesión: asignación aleatoria, guardada en localStorage
- Segunda sesión mismo navegador: misma variante
- Logout/login: variante se mantiene (guardada en BD)
- Admin dashboard: números correctos
- Lock variant: nuevos usuarios ven el ganador, A/B termina
- Pause: asignación se congela
- Reset: borra todos los datos, empieza de nuevo

### 5. Accesibilidad
- N/A (test de micro-espejos, UI ya es accesible de otros sprints)

### 6. Performance
- localStorage read: <10ms
- Dashboard carga < 2s
- Queries de ab_test_events indexadas

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Dashboard usa DESIGN.md tokens.
**7b. Claridad:** Los números son legibles. Qué significa cada columna es evidente.
**7c. Insight:** El análisis dice al admin cuál es el ganador, no deja la decisión ambigua.
**7d. Acción:** Botones de lock/pause/reset son accesibles y claros.

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/PROGRESS.md`:
   ```
   - ✅ **GATEWAY-APRENDE — Sesión 1: A/B Testing de micro-espejos** ({fecha}):
     - 2-3 variantes por micro-espejo, asignación aleatoria localStorage+BD, tabla ab_test_events, dashboard admin con métricas, chi-square significance, lock/pause/reset funcionalidad
   ```
2. Commit final limpio.
