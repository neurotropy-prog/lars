## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión COLECTIVA-DINAMICA: Datos colectivos en tiempo real en el gateway y mapa

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Sección "Datos colectivos" (visualización actual, estática)
- `docs/DATABASE.md` — Schema actual, tabla `diagnosticos`

## Lo que ya está construido
- Gateway con 10 preguntas
- Cálculo de perfil automático
- Mapa vivo con datos individuales
- 4 cards de "datos colectivos" en gateway (estáticas, valores hardcodeados)

## Tu tarea

Lee `docs/features/FEATURE_GATEWAY_DESIGN.md` completamente, especialmente la sección sobre datos colectivos.

Actualmente, el gateway muestra 4 métricas colectivas que son **estáticas** (números fijos en código):
- "97 ejecutivos en el programa"
- "68% en Regulación Nerviosa comprometida"
- "4 de cada 5 mejoran en 30 días"
- etc.

Esta sesión convierte esos números en **dinámicos**, calculados en TIEMPO REAL desde Supabase. El gatewayará para obtener estas métricas vivas cada vez que se carga.

### Tarea 1: API de datos colectivos

Crear endpoint GET `/api/stats/collective`:

**Retorna:**

```json
{
  "total_diagnostics": 97,
  "profile_distribution": {
    "productive_collapsed": 28,
    "invisible_strong": 24,
    "exhausted_caregiver": 31,
    "paralyzed_controller": 14
  },
  "dimension_by_profile": {
    "productive_collapsed": {
      "most_compromised_dimension": "nervous_regulation",
      "score": 34,
      "percentage": 68
    },
    "invisible_strong": {
      "most_compromised_dimension": "sleep",
      "score": 31,
      "percentage": 57
    },
    "exhausted_caregiver": {
      "most_compromised_dimension": "digestion",
      "score": 29,
      "percentage": 63
    },
    "paralyzed_controller": {
      "most_compromised_dimension": "attention",
      "score": 36,
      "percentage": 72
    }
  },
  "conversion_metrics": {
    "diagnostics_to_payment": 0.28,
    "improvement_rate_30_days": 0.64
  },
  "response_combinations": [
    {
      "combo": "high_stress_poor_sleep",
      "count": 24,
      "percentage": 25
    },
    {
      "combo": "high_stress_poor_digestion",
      "count": 18,
      "percentage": 19
    }
  ]
}
```

**Lógica de cálculo:**

- `total_diagnostics`: COUNT(*) de `diagnosticos` donde `created_at` >= hace 90 días
- `profile_distribution`: GROUP BY `profile`, contar cada uno
- `dimension_by_profile`: Para cada perfil, calcular qué dimensión tiene el score más bajo EN PROMEDIO (esa es la más comprometida), y su porcentaje promedio
- `conversion_metrics.diagnostics_to_payment`: COUNT(pagos) / COUNT(diagnosticos completados)
- `improvement_rate_30_days`: % de diagnósticos donde el mapa de día 30 > mapa de día 0 en ≥3 puntos en cualquier dimensión
- `response_combinations`: Combos más frecuentes de respuestas (ej: respuesta A en Q1 + respuesta B en Q2)

**Fallback:**

Si hay < 100 diagnósticos, el endpoint devuelve números estáticos (valores "semilla" que habrán en código como fallback):

```json
{
  "is_fallback": true,
  "fallback_reason": "insufficient_data",
  "total_diagnostics": 0,
  "profile_distribution": {...números semilla...}
}
```

### Tarea 2: Endpoint de datos colectivos filtrados por perfil

GET `/api/stats/collective-for-profile?profile={profile}`

Devuelve solo los datos colectivos RELEVANTES para cada perfil (no muestra TODO a todos):

**Para Productivo Colapsado:**
```json
{
  "your_profile": "productive_collapsed",
  "people_like_you": 28,
  "your_most_common_issue": "nervous_regulation",
  "percentage_with_same_issue": 68,
  "your_percentile": 32,
  "improvement_rate_in_your_profile": 0.71,
  "typical_recovery_weeks": 8
}
```

**Para Fuerte Invisible:**
```json
{
  "your_profile": "invisible_strong",
  "people_like_you": 24,
  "your_most_common_issue": "sleep",
  "percentage_with_same_issue": 57,
  "benchmark": "4 de cada 5 mejoran en 12 semanas",
  "percentage_improvement": 0.64,
  "data_source": "97 diagnósticos en los últimos 90 días"
}
```

**Lógica:**

Cada perfil ve métricas calibradas a SU lenguaje:
- **PC:** Números exactos, "percentil", "recuperación de productividad"
- **FI:** Datos benchmark, estadísticas robustas, "4 de cada 5"
- **CE:** "Personas como tú", "normalización", historias
- **CP:** Estructura clara, "plan de 12 semanas", garantías

### Tarea 3: Integración en el gateway

En el gateway, reemplazar las 4 cards de datos colectivos estáticas con llamadas a `/api/stats/collective-for-profile?profile={detected_profile}`.

**Timing:** El perfil se calcula al FINAL del gateway (Página 10), así que al mostrar las cards de datos colectivos (Página 11, la de "Datos que te importan"), ya se conoce el perfil y se puede hacer la llamada.

**Loading state:**

Mientras cargan los datos:
- Skeleton cards (mismo layout de la card real, con fondo gris animado, sin texto)
- Duración: max 2 segundos. Si tarda más, fallback a datos estáticos.

**Fallback:**

Si la API falla o tarda >2s:
- Usar los números semilla estáticos (los que están ahora en código)
- No mostrar error al usuario
- Silent fallback

**Actualización en vivo:**

Si el usuario vuelve a visitar el gateway (ej: con otro browser, con otro device) en el mismo día, los números serán iguales (porque se basan en el mismo set de diagnósticos). No es necesario refrescar en tiempo real dentro de la sesión.

### Tarea 4: Visibilidad en el mapa

El mapa individual muestra datos colectivos en una sección "Contexto" (arriba del CTA):

```
TU CONTEXTO

Hay 97 ejecutivos con diagnósticos similares a los tuyos.
El 68% empieza exactamente donde estás.
El 71% mejora notablemente en 8 semanas.
```

Esta sección usa los mismos datos dinámicos de `/api/stats/collective-for-profile`.

**Timing:** Se carga después de que el mapa esté visible (lazy load, usandoIntersectionObserver).

### Tarea 5: Admin — API de troubleshooting

En `/api/admin/stats/debug`, endpoint privado (requiere ADMIN_SECRET) que devuelve:

```json
{
  "total_diagnostics": 97,
  "diagnostics_by_profile": {...},
  "diagnostics_with_mapa_evolution": 45,
  "diagnostics_with_30day_data": 32,
  "oldest_diagnostic": "2026-01-15T...",
  "newest_diagnostic": "2026-03-27T...",
  "fallback_active": false,
  "last_calculation_time": "2026-03-27T12:45:00Z",
  "cache_ttl_seconds": 3600
}
```

Esto permite a Javier verificar que los datos colectivos son correctos.

### Tarea 6: Caching

Los datos colectivos se cachean en Supabase (Redis si está disponible) con TTL de 1 hora:

- Primera llamada: cálculo completo (puede tomar 1-2 segundos)
- Siguientes 3599 segundos: sirve del cache
- Después de 1 hora: recalcula

Esto evita queries pesadas a la BD en cada carga de gateway.

## INTELIGENCIA DEL SISTEMA

### Datos predictivos (OBLIGATORIO)
No solo mostrar lo que pasó. Predecir lo que pasará:
- "Personas con tu perfil (PC) y score inicial similar (28-35) mejoran un promedio de +42 pts en 12 semanas"
- "Basado en tu primera semana, tu proyección es: D1 → 65/100 en Semana 8"
- Algoritmo: regresión lineal sobre cohortes históricas con mismo perfil + score inicial similar (±10 pts)
- Mostrar con disclaimer: "Proyección basada en datos de X personas similares"

### Personalización dentro del dato colectivo (OBLIGATORIO)
El dato colectivo que ve cada persona es diferente:
- PC ve: "De 28 ejecutivos con tu perfil, el 74% recuperó 3+ horas de productividad"
- FI ve: "Tu percentil actual: 55. Mediana de tu cohorte: 62. Diferencia: -7 pts"
- CE ve: "19 de 23 personas en tu situación reportan mejor sueño en 14 días"
- CP ve: "Hito Semana 2 alcanzado por 85% de tu cohorte. Siguiente hito: Semana 4"

### Detección de outliers (OBLIGATORIO)
Si alguien tiene un resultado muy diferente al grupo:
- Score >2σ por encima: "Tu mejora está por encima del 95% de tu cohorte. Eres un caso excepcional."
- Score >2σ por debajo: NO alarmar. En su lugar, normalizar: "Cada persona mejora a su ritmo. El 23% de personas como tú ven el cambio más grande entre Semana 4 y 8."
- Outliers negativos alimentan CO-LEARNING: "Juan M. está 2σ por debajo de su cohorte. Sugerir: sesión adicional con Javier."

### Conexión con todos los sistemas
Los datos colectivos son el CORAZÓN de la inteligencia. Alimentan:
- **Gateway:** Prueba social en micro-espejos
- **Mapa vivo:** Sección "Tu contexto" con datos de tu cohorte
- **Emails:** Datos personalizados en cada email
- **Landing pages (IGNICIÓN):** Social proof real (no hardcodeado)
- **Resultados SEO:** Datos públicos agregados
- **CO-LEARNING:** Alertas sobre tendencias anómalas
- **RE-ENGAGEMENT:** "El 89% de personas en tu situación vuelven a visitar su mapa en Semana 2. ¿Tú cuándo vuelves?"

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin avisarme antes.
- Los cálculos deben ser rápidos (< 1 segundo para queries). Si no, optimizar con índices.
- Fallback automático a números semilla si falla — nunca mostrar error al usuario.
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- El endpoint de debug requiere ADMIN_SECRET.
- Los datos colectivos no exponen información individual (solo agregados).

### 3. Calidad del código
- Cero console.log de debug.
- Las queries están optimizadas (índices en `profile`, `created_at`).
- El cálculo es reutilizable (función helper limpia).

### 4. Testing funcional
- Con 0 diagnósticos: fallback a números semilla
- Con 50 diagnósticos: números correctos
- Con 200+ diagnósticos: sigue siendo rápido (< 1s)
- Cambiar un diagnóstico y recargar: los números se actualizan

### 5. Accesibilidad
- N/A

### 6. Performance
- Las queries usan índices.
- El cache TTL reduce queries redundantes.
- Loading skeletons mientras se cargan los datos.

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Los números en gateway y mapa usan el mismo endpoint (no duplicación de lógica).
**7b. Feedback:** Skeleton loading while data fetches.
**7c. Claridad:** Los números se presentan con contexto (no solo números, sino "97 ejecutivos", "el 68% empieza aquí").
**7d. Lenguaje:** Cada perfil ve métricas en su idioma (PC=eficiencia, FI=datos, CE=normalización, CP=estructura).

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **COLECTIVA-DINAMICA — Sesión 1: Datos en tiempo real** ({fecha}):
     - API de estadísticas colectivas dinámicas, cálculo de profiles/dimensiones/combos, integración en gateway y mapa, caching, fallback
   ```
2. Commit final limpio.
