## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión COMUNIDAD-LATENTE: Inteligencia colectiva en tiempo real — comparativa de mejora con cohorte

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Los 4 perfiles de cliente
- `docs/DESIGN.md` — Sistema de diseño visual
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Perfiles y lenguajes
- `docs/DATABASE.md` — Schema actual, tabla `diagnosticos`, tabla de evoluciones
- Sesión anterior: COLECTIVA-DINAMICA (datos colectivos dinámicos debe estar completa)

## Lo que ya está construido
- Gateway con 10 preguntas
- Mapa vivo con evoluciones día 0→90
- Datos colectivos dinámicos (API `/api/stats/collective-for-profile`)
- Email secuencia de nurturing personalizado por perfil
- Admin con seguimiento

## Tu tarea

Lee `docs/DATABASE.md` completamente. Esta sesión añade **inteligencia de cohorte latente**: mientras el usuario sigue su programa, ve datos reales y agregados de otras personas que empezaron la misma semana que él.

**Mecánica clave:**
- Día 14-21 del mapa: mostrar "Los [perfil] que empezaron contigo han mejorado X puntos en [dimensión]"
- Solo visible cuando hay ≥20 personas en la misma cohorte (mismo semana + mismo perfil)
- Datos reales de reevaluaciones (no estáticos)
- Anónimo: no se sabe quién es quién
- Perfilado: cada perfil ve solo a gente su perfil

Implementa en dos fases:
**FASE VISUAL:** Diseña la sección de cohorte en el mapa. Avísame cuando esté lista.
**FASE FUNCIONAL:** Solo después de aprobación visual, conecta los datos.

### Tarea 1: Definición de cohorte

Una **cohorte** es un grupo de personas que:
- Completaron el gateway en la MISMA SEMANA (window de 7 días: lun-dom)
- Tienen el MISMO PERFIL (Productive Collapsed, Invisible Strong, etc.)

Ejemplo:
- Semana de 27 mar - 2 abr 2026
- Perfil: Invisible Strong
- Total de gente: 23 personas

**Umbral de visibilidad:** Solo mostrar inteligencia de cohorte si `count >= 20`.

Si hay < 20, mostrar placeholder:
```
La comunidad en tu etapa está creciendo.
Cuando seamos más de 20, verás el progreso compartido.
```

### Tarea 2: Estructura de tabla de cohortes

```
CREATE TABLE cohort_stats (
  id UUID PRIMARY KEY,
  cohort_week DATE (primer día de la semana, ej: 2026-03-24),
  profile VARCHAR ('productive_collapsed', 'invisible_strong', 'exhausted_caregiver', 'paralyzed_controller'),
  total_members INT,
  day_number INT (0, 7, 14, 21, 30, 60, 90 — cuándo se calcula),

  -- Métricas agregadas (promedios)
  avg_nervous_regulation_change INT,
  avg_sleep_change INT,
  avg_digestion_change INT,
  avg_energy_change INT,
  avg_attention_change INT,

  -- Tasas
  improvement_rate FLOAT (% de gente que mejoró ≥3 puntos en cualquier dimensión),
  completion_rate FLOAT (% de gente que completó reevaluación),

  -- Para insights
  most_improved_dimension VARCHAR,
  most_improved_value INT,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Cálculo:**
- Se calcula batch cada día (cron job)
- Para cada cohorte (semana + perfil):
  - COUNT(*) de diagnósticos en esa semana + perfil
  - Si COUNT >= 20, calcular promedios y tasas
  - Si COUNT < 20, marcar `visible = false`

### Tarea 3: Lógica de visibilidad en el mapa

El usuario ve la sección de cohorte **en el mapa entre día 14-21**.

Condiciones:
1. Hoy >= día 14 del diagnóstico
2. Cohorte del usuario tiene >= 20 personas
3. Usuario ha visitado el mapa al menos 1 vez (no día 0)

**Ubicación en el mapa:** Después de las 5 dimensiones, ANTES del CTA de Semana 2.

### Tarea 4: Sección visual "Tu comunidad"

```
TU COMUNIDAD EN ESTA ETAPA

[icono de gente]

Hay 23 personas como tú que empezaron esta semana.
Después de 14 días, así va el progreso:

┌─────────────────────────────────────────┐
│ Regulación Nerviosa: promedio +12 pts   │
│ Sueño: promedio +8 pts                  │
│ Energía: promedio +7 pts                │
│ Atención: promedio +5 pts               │
│ Digestión: promedio +3 pts              │
└─────────────────────────────────────────┘

Interpretación por perfil:

**Si usuario es Productivo Colapsado:**
"El 78% de ustedes han recuperado entre 3-4 horas
de productividad focada. La Regulación Nerviosa
es lo que más está mejorando."

**Si usuario es Fuerte Invisible:**
"Estadística: 22 de 23 completaron la reevaluación.
Mejora promedio en Regulación: +12 pts (52% de mejora).
Percentil: estás en el 55% del grupo."

**Si usuario es Cuidador Exhausto:**
"Lo que ves en ti está pasando en otros también.
No estás sola/o en esto. 19 de 23 reportan
que duermen mejor. Es el patrón más claro."

**Si usuario es Controlador Paralizado:**
"Hito de Semana 2 alcanzado por el 85% del grupo.
Plan está funcionando. La Regulación Nerviosa es
el leverage point — ya ves el impacto."

[Mi comparativa personal]
```

**Estilo visual:**
- Card o sección separada con fondo sutil diferenciado
- Las 5 dimensiones como mini-barras: `[████████░░] +12 pts`
- Color de barra según dimensión (referencia DESIGN.md)
- Animación: las barras se revelan progresivamente (stagger, 200ms entre cada)
- Tipografía: Cormorant para headline "Tu comunidad", Inter para números y explicación
- Responsive: en 375px, barras apiladas verticalmente

### Tarea 5: Endpoints necesarios

**GET `/api/stats/cohort`**

Sin parámetros (usa el diagnóstico del usuario autenticado):

```json
Response (si >= 20 personas):
{
  "visible": true,
  "cohort_size": 23,
  "cohort_week": "2026-03-24",
  "user_profile": "invisible_strong",
  "day_number": 14,

  "dimension_changes": {
    "nervous_regulation": {
      "avg_change": 12,
      "user_change": 14,
      "rank": "above_average" // above_average, average, below_average
    },
    "sleep": { "avg_change": 8, "user_change": 6, "rank": "below_average" },
    "digestion": { "avg_change": 3, "user_change": 5, "rank": "above_average" },
    "energy": { "avg_change": 7, "user_change": 10, "rank": "above_average" },
    "attention": { "avg_change": 5, "user_change": 3, "rank": "below_average" }
  },

  "cohort_stats": {
    "improvement_rate": 0.78,
    "completion_rate": 0.96,
    "most_improved_dimension": "nervous_regulation",
    "most_improved_value": 12
  },

  "benchmark_message": "El 78% de ustedes han recuperado entre 3-4 horas de productividad focada."
}

Response (si < 20 personas):
{
  "visible": false,
  "cohort_size": 8,
  "message": "La comunidad en tu etapa está creciendo. Cuando seamos más de 20, verás el progreso compartido."
}
```

**GET `/api/stats/cohort-for-profile?profile={profile}&week={YYYY-MM-DD}`** (admin-only)

Usado en admin para verificar qué cohortes existen:

```json
{
  "profile": "invisible_strong",
  "week_start": "2026-03-24",
  "total_members": 23,
  "visible": true,
  "dimension_changes": {...},
  "cohort_stats": {...}
}
```

### Tarea 6: Integración en el mapa

En la página `/mapa/[hash]`:

```typescript
// Pseudo-código
useEffect(() => {
  if (dayNumber >= 14 && dayNumber <= 21) {
    const cohortData = await fetch('/api/stats/cohort');
    setCohortData(cohortData);
  }
}, [dayNumber]);

// En el renderizado:
if (cohortData?.visible) {
  return <CohortSection data={cohortData} userProfile={profile} />;
} else if (cohortData && !cohortData.visible) {
  return <CohortPlaceholder size={cohortData.cohort_size} />;
}
```

### Tarea 7: Cálculo batch de cohort_stats

Cron job que corre cada 24h:

```typescript
// Pseudo-código
async function updateCohortStats() {
  // Obtener todas las cohortes únicas (semana + perfil)
  const cohorts = await db.diagnosticos
    .groupBy(['cohort_week', 'profile'])
    .count();

  for (const cohort of cohorts) {
    // Para cada punto de evaluación (día 0, 7, 14, 30, 60, 90)
    for (const dayNumber of [0, 7, 14, 30, 60, 90]) {
      // Calcular cambios promedio
      const stats = await calculateCohortStats(
        cohort.week,
        cohort.profile,
        dayNumber
      );

      // Guardar en cohort_stats
      await db.cohortStats.upsert({
        where: {
          cohort_week_profile_day: {
            cohort_week: cohort.week,
            profile: cohort.profile,
            day_number: dayNumber
          }
        },
        data: stats
      });
    }
  }
}

function calculateCohortStats(week, profile, dayNumber) {
  // 1. Filtrar diagnósticos de esa semana + perfil
  const diagnosticos = await db.diagnosticos.findMany({
    where: {
      cohort_week: week,
      profile: profile,
      'mapas.day': { in: [0, dayNumber] } // tenemos día 0 Y día X
    },
    include: { mapas: true }
  });

  // 2. Para cada dimensión, calcular cambio promedio
  const changes = calculateDimensionChanges(diagnosticos, dayNumber);

  // 3. Calcular improvement_rate (% con cambio >= 3)
  const improvementRate = diagnosticos.filter(d => {
    const totalChange = sumDimensionChanges(d, dayNumber);
    return totalChange >= 3;
  }).length / diagnosticos.length;

  return {
    avg_nervous_regulation_change: changes.nervous_regulation,
    avg_sleep_change: changes.sleep,
    // ... resto
    improvement_rate: improvementRate,
    most_improved_dimension: maxBy(changes),
    most_improved_value: max(changes),
    completion_rate: (diagnosticos that have day X) / total
  };
}
```

### Tarea 8: Lenguaje personalizado por perfil

La **interpretación** que ve el usuario de los datos de cohorte cambia según su perfil:

**PRODUCTIVO COLAPSADO:**
- Enfoca: recuperación de tiempo/productividad
- Ejemplo: "El 78% han recuperado 3-4 horas de productividad focada"
- Métrica: horas recuperadas, no puntos

**FUERTE INVISIBLE:**
- Enfoca: percentiles, datos objetivos, tendencias
- Ejemplo: "Mejora promedio +12 pts (52% de mejora). Estás en percentil 55%"
- Métrica: puntos exactos, porcentajes

**CUIDADOR EXHAUSTO:**
- Enfoca: normalización, "no estás sola/o"
- Ejemplo: "19 de 23 reportan mejor sueño. Es el patrón más claro"
- Métrica: "de cada X", historias implícitas

**CONTROLADOR PARALIZADO:**
- Enfoca: estructura, hitos, planes funcionando
- Ejemplo: "Hito de Semana 2 alcanzado por el 85%. Plan está funcionando"
- Métrica: porcentajes, confirmación de plan

Estas interpretaciones están en tabla `cohort_interpretations`:

```
id | profile | dimension | template_text | created_at
```

Ejemplo:
```
productive_collapsed | nervous_regulation | "{avg_change} pts = {hours_recovered} horas de productividad"
invisible_strong | nervous_regulation | "+{avg_change} pts ({percentage_improvement}% mejora). Percentil {percentile}"
```

### Tarea 9: Privacy y anonimato

- Los datos de cohorte son **agregados** (no hay nombres individuales)
- El usuario no ve con quién está comparándose (ni inicial ni email)
- En admin, puedes ver la lista de gente en cada cohorte (con consentimiento)
- No enviar identidades individuales por API al frontend

### Tarea 10: Validación en admin

Nueva sección: `/admin/cohorts`

```
COHORTES — INTELIGENCIA COLECTIVA

[Filtros]
- Semana: [Selector de fecha]
- Perfil: Todos | PC | FI | CE | CP

[TABLA DE COHORTES]

| Semana | Perfil | Total | Visible | Día 14 Change | Día 30 Change | [Detalles]
| ------|--------|-------|---------|---------------|---------------|----------
| 24 Mar | FI | 23 | ✅ | +12 reg, +8 sleep | +18 reg, +14 sleep | [Ver]
| 24 Mar | PC | 18 | ❌ | — | — | [Ver]
| 17 Mar | CE | 31 | ✅ | +7 reg, +11 sleep | +14 reg, +18 sleep | [Ver]

Click en una cohorte → ver lista de miembros (solo Javier ve esto)
```

## INTELIGENCIA DEL SISTEMA

### Peer matching anónimo (OBLIGATORIO)
No solo mostrar datos agregados. Ofrecer conexión:
- "Hay 3 personas con un perfil muy similar al tuyo que mejoraron >40 pts. ¿Te gustaría que compartamos cómo lo hicieron?" (anónimo, solo patterns)
- No revelar identidades. Solo compartir patrones: "Persona similar a ti (PC, score inicial 30) mejoró 48 pts enfocándose en D2 primero."
- Opt-in: "¿Quieres recibir historias anónimas de personas similares?"

### Datos predictivos por cohorte (OBLIGATORIO)
Extender COLECTIVA DINÁMICA con predicción:
- "Tu cohorte (Semana 2, PC): si sigues al ritmo actual, tu proyección es +38 pts en Semana 12"
- "Personas que mejoraron >5 pts en D2 en Semana 1 tienen 89% de probabilidad de completar el programa"
- Mostrar esto en el mapa como motivador

### Normalización inteligente para CE
Los Cuidadores Exhaustos necesitan sentir comunidad. El sistema:
- Muestra "Eres una de 31 personas que empezaron esta semana" con más prominencia para CE
- Añade micro-historias anónimas: "Una persona como tú escribió: 'Pensé que era la única que se sentía así.' Ahora lleva 4 semanas mejorando."
- Estas historias se generan a partir de patrones reales (no inventadas), con consentimiento implícito (datos anónimos)

### Efecto competitivo sutil para CP
Los Controladores Paralizados responden a estructura y benchmarks:
- "Tu posición en tu cohorte: percentil 45. Siguiente milestone: alcanzar percentil 60 (necesitas +8 pts en D1)."
- "El 85% de tu cohorte ya alcanzó el hito de Semana 2. [Ver tu progreso →]"
- Esto crea urgencia sana sin presión

### Alimentación a RE-ENGAGEMENT
Si alguien NO ha vuelto pero su cohorte está avanzando:
- Email de re-engagement: "Tu cohorte avanzó. El 78% ya superó la Semana 2. Tus datos te esperan: [Ver mapa →]"
- Esto usa presión social positiva para reactivar

### Conexión con GATEWAY-APRENDE
Los datos de cohorte alimentan los micro-espejos del gateway:
- Si esta semana el 74% de PC mejoran en D1, usar en micro-espejo: "El 74% de ejecutivos como tú mejoran regulación nerviosa en las primeras 2 semanas."
- Los datos son REALES y actualizados, no estáticos

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit`.
- NO modifiques la base de datos sin mostrarme el SQL antes.
- Umbral: >= 20 personas por cohorte. Si < 20, no mostrar números específicos.
- Anonimato: nunca reveles quién es quién en la cohorte.
- Depende de COLECTIVA-DINAMICA: este sistema complementa datos individuales con data de grupo.
- Recuerda: no soy desarrollador. Explícame en lenguaje simple.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- No exponer nombres/emails en endpoints de cohorte
- Admin puede ver lista de miembros (con control de acceso)
- Datos agregados solo, nunca individuales al frontend

### 3. Calidad del código
- Cero console.log de debug
- Funciones reutilizables (calculateDimensionChanges, getCohortInterpretation)
- Archivos < 400 líneas

### 4. Testing funcional
- Cohorte con < 20: mostrar placeholder
- Cohorte con >= 20: mostrar datos entre día 14-21
- Cambiar de perfil en BD: ver datos diferentes
- Admin → cohorts: listar cohortes, filter por semana/perfil
- Cron job: calcula correctamente, actualiza BD cada 24h
- Datos históricos: día 14, 30, 60, 90 todos presentes

### 5. Accesibilidad
- Barras de dimensiones: etiquetas claras (no solo colores)
- Números legibles (alto contrast vs fondo)
- Mobile 375px: barras apiladas, números legibles

### 6. Performance
- Cálculo de cohorte no bloquea carga del mapa (async, lazy)
- Cron job no tarda >5 min
- Query de cohorte indexada en (cohort_week, profile)

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Usa DESIGN.md tokens. Mismo fondo, tipografía.
**7b. Progresión:** Barras se revelan con stagger (200ms). Animación suave.
**7c. Claridad:** El número de personas se ve claro ("23 personas como tú").
**7d. Interpretación:** El lenguaje de explicación cambia por perfil (no genérico).
**7e. Control:** Usuario no puede ver quién es quién (anonimato respetado).
**7f. Moment:** Sección aparece en día 14-21 (no demasiado temprano, no demasiado tarde).

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/PROGRESS.md`:
   ```
   - ✅ **COMUNIDAD-LATENTE — Sesión 1: Inteligencia de cohorte** ({fecha}):
     - Tabla cohort_stats, cálculo batch 24h, API de cohorte, sección en mapa día 14-21, lenguaje personalizado por perfil, admin cohorts, anonimato garantizado
   ```
2. Actualiza `docs/DATABASE.md` con tablas nuevas
3. Commit final limpio.
