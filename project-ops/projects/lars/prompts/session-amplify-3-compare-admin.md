## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión AMPLIFY-3: Vista Comparativa + Admin — La pieza central de AMPLIFY

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/VISION.md` — Visión del producto
- `docs/DESIGN.md` — Sistema de diseño visual. NADA se inventa fuera de este doc.
- `docs/ANIMATIONS.md` — Spec de animaciones. Usa los mismos patrones para consistencia.
- `docs/features/FEATURE_AMPLIFY_DESIGN.md` — **SPEC COMPLETA** (LEER ENTERO — especialmente la sección "Vista comparativa")
- `docs/features/FEATURE_GATEWAY_DESIGN.md` — Los 4 perfiles y el mapa de dimensiones

## Lo que ya está construido
- Todo lo anterior (gateway, mapa, admin, emails, booking, analytics)
- **AMPLIFY-1:** Tabla `amplify_invites`, 5 API routes, lógica de insight comparativo, detección ?ref=
- **AMPLIFY-2:** Sección AMPLIFY en mapa, modal de invitación, banner de aceptación, email día 7

## Tu tarea

Lee `docs/features/FEATURE_AMPLIFY_DESIGN.md` completo. Esta sesión construye la vista comparativa (la pieza más visual de AMPLIFY) y la integración en el admin.

Implementa en dos fases:
**FASE VISUAL:** Construye la vista comparativa con datos ficticios. Avísame cuando esté listo para revisar.
**FASE FUNCIONAL:** Solo después de mi aprobación visual, conecta la funcionalidad real.

### Tarea 1: Página de comparación `/mapa/[hash]/comparar/[compare_hash]`

Esta es la pieza central de AMPLIFY. Dos mapas, lado a lado, con un insight que los conecta.

**Estructura de la página:**

**1. Header:**
```
TU COMPARACIÓN DE REGULACIÓN

[Tú]                        [Iniciales otro]
34/100                      48/100
Comprometido                Atención necesaria
```
- Los dos scores usan counter animado (como A-10 en el mapa normal)
- Color semáforo para cada score (rojo/naranja/amarillo/verde)
- "Tú" siempre a la izquierda. El otro a la derecha.

**2. Cinco dimensiones comparadas (barras paralelas):**

Para CADA dimensión (D1-D5):
```
D1 — Regulación Nerviosa
Tú:    ████████░░░░░░░░░░  28  (rojo)
Otro:  ██████████████░░░░  52  (naranja)
       ← La mayor brecha: 24 puntos
```

**Animación (IMPORTANTE — sigue el patrón de A-12 Momento WOW):**
```
Segundo 0:     Header aparece (fade-in)
Segundo 0.5:   Scores globales counter animado simultáneo
Segundo 1.5:   PAUSA (procesamiento)
Segundo 2.0:   D1 barras se llenan paralelas (800ms ease-out-expo)
Segundo 3.0:   D2 barras se llenan
Segundo 4.0:   D3 barras se llenan
Segundo 5.0:   D4 barras se llenan
Segundo 6.0:   D5 barras se llenan
Segundo 6.5:   La dimensión con MAYOR BRECHA se destaca:
               - Badge "Mayor brecha: X puntos"
               - Las otras reducen opacidad (0.7)
Segundo 7.0:   Insight comparativo aparece (fade-in-up)
```

**Cada barra:**
- Height: 8px (como el mapa individual)
- Border-radius: 4px
- Color semáforo según score individual
- Track de fondo: rgba(255,255,255,0.08)
- Transición de llenado: 800ms ease-out-expo (var(--ease-out-expo))
- Score numérico al lado derecho de cada barra
- Label "Tú" / "[Iniciales]" a la izquierda de cada par de barras

**Mobile (375px):**
Las barras van apiladas verticalmente (no lado a lado):
```
D1 — Regulación Nerviosa
Tú:    ████████░░░░░░░░░░░░  28
Otro:  ██████████████░░░░░░  52
```

**3. Insight comparativo (texto generado):**

Aparece DESPUÉS de las barras. Usa el insight generado por `generateComparisonInsight()` (implementado en AMPLIFY-1).

**Estilo visual:**
- Fondo sutil diferenciado (como los micro-espejos del gateway — zona de reflexión)
- Borde izquierdo verde (var(--color-accent))
- Tipografía: Cormorant Garamond para la primera línea (impactante), Inter para el desarrollo
- Padding generoso (32px)
- Animación: fade-in-up después de las barras

**4. CTA al final:**
```
Lo que ningún diagnóstico individual puede revelar,
dos mapas juntos sí.

Si uno de los dos se regula, el otro lo nota.
Si los dos os reguláis, todo cambia.

[Empezar la Semana 1 — 97€]

"Cada programa es individual y personalizado."
```

**Estilo:** Igual que el CTA del mapa individual (A-13). Botón pill verde. Espacio generoso.

**5. Navegación:**
- Link "← Volver a mi mapa" arriba a la izquierda
- La página es standalone pero accesible desde el mapa de cada persona
- Ambas personas ven la misma data pero desde su perspectiva ("Tú" cambia según quién ve)

### Tarea 2: Enlace a la comparación desde el mapa

En la página del mapa individual (`/mapa/[hash]`), si la persona tiene una comparación activa:

- Mostrar una sección nueva ANTES de la sección AMPLIFY:
```
TU COMPARACIÓN

Tienes una comparación activa con [Iniciales].
[Ver comparación →]
```

- Si tiene múltiples comparaciones (máximo 5), listarlas:
```
TUS COMPARACIONES

[Iniciales 1] — Ver comparación →
[Iniciales 2] — Ver comparación →
```

### Tarea 3: Admin — Card AMPLIFY en Hub

En el Centro de Comando (`/admin`), añadir una card en el grid de métricas:

```
AMPLIFY
  12 invitaciones enviadas
  4 completadas (33%)
  3 comparaciones activas

  K-factor: 0.33
```

**K-factor** = (invitaciones por usuario medio) × (tasa de completación)
Ejemplo: si 7 personas han enviado un total de 12 invitaciones (1.7 por persona) y el 33% se completan → K = 1.7 × 0.33 = 0.56

**Color del K-factor:**
- < 0.2: rojo (no está funcionando)
- 0.2-0.5: naranja (potencial)
- > 0.5: verde (motor activo)

**Estilo:** Consistente con las demás cards del Hub (mismo componente, mismos tokens).

### Tarea 4: Admin — Badge "Referido" en LAM

En el Lead Acquisition Manager (`/admin/lam`):

**En la lista de leads:**
- Si un lead vino por AMPLIFY (?ref=), mostrar badge "Referido" junto al heat score
- Color del badge: azul o púrpura (diferenciado de los badges existentes)

**En el detalle del lead (panel lateral):**
- Sección nueva "AMPLIFY":
  ```
  Invitado por: [email del invitador]
  Comparación: Activa / Pendiente de aceptación
  [Ver comparación →]
  ```
- Si el lead ES invitador (ha enviado invitaciones):
  ```
  Invitaciones enviadas: 3
  Completadas: 1
  ```

### Tarea 5: Métricas AMPLIFY en Analytics

En `/admin/analytics`, añadir una sección o card:

```
AMPLIFY — Motor de crecimiento orgánico

Invitaciones enviadas:       12
Invitaciones completadas:    4  (33%)
Comparaciones aceptadas:     3  (75% de completadas)
Conversiones desde AMPLIFY:  1  (25% de aceptadas)

K-factor actual: 0.33
```

**API:** Puede ser un endpoint nuevo GET `/api/admin/amplify-stats` o extender el endpoint de analytics existente. Lo que sea más limpio.

## INTELIGENCIA DEL SISTEMA

### K-factor como señal sistémica (OBLIGATORIO)
El K-factor no es solo una métrica pasiva. Alimenta decisiones:

- **K < 0.2:** El sistema genera alerta en CO-LEARNING: "Motor AMPLIFY inactivo. Sugerencia: activar bloque AMPLIFY en email de día 7 para leads con mapa >14 días."
- **K 0.2-0.5:** Normal. El sistema monitoriza qué perfiles tienen mejor K-factor y ajusta el copy de la sección AMPLIFY en el mapa para favorecer esos perfiles.
- **K > 0.5:** Motor activo. El sistema sugiere a Javier en CO-LEARNING: "AMPLIFY está funcionando. Considerar reducir inversión en paid ads y reforzar referral."

### Atribución financiera (OBLIGATORIO)
Si el invitado convierte (compra el programa):
- Marcar en admin: "Conversión atribuida a AMPLIFY" con link al invitador
- Calcular: "AMPLIFY ha generado X€ en ventas directas (Y conversiones × 97€)"
- Mostrar en Analytics: "Coste de adquisición por AMPLIFY: 0€ vs Paid: Z€/lead"
- Esto alimenta la decisión de Javier sobre dónde invertir tiempo

### Vista comparativa evolutiva
La comparación NO es estática. Si ambas personas siguen en el programa:
- Cada vez que un mapa evoluciona (día 7, 14, 30...), la comparación se actualiza automáticamente
- Mostrar badge "Actualizado" en la sección de comparaciones del mapa
- Si la brecha se REDUCE: insight positivo ("Estáis convergiendo en D1 — 24 pts → 12 pts en 14 días")
- Si la brecha se AMPLÍA: insight de oportunidad ("La brecha en D3 creció. Esto es normal — cada persona mejora a su ritmo")
- Estos cambios generan notificación por email/WhatsApp (si opt-in): "Tu comparación con [Iniciales] se ha actualizado"

### Conexión con COMUNIDAD LATENTE
La comparación alimenta datos colectivos anónimos:
- "El 67% de las parejas que comparan mapas muestran convergencia en Semana 4"
- "La dimensión con mayor brecha entre parejas es D1 Regulación Nerviosa"
- Estos datos aparecen en la página de resultados SEO (/resultados-colectivos) como prueba social

### Recomendación inteligente de invitación
En admin, cuando Javier ve un lead activo, el sistema sugiere:
- "Este lead (PC) tiene un K-factor personal de 0.7. Es un buen candidato para AMPLIFY. Sugerir invitación en próximo contacto."
- "Este lead (FI) ha rechazado 2 invitaciones. No sugerir AMPLIFY por ahora."

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit` para verificar tipos.
- NO modifiques la base de datos sin avisarme antes.
- TODO el diseño viene de docs/DESIGN.md. No inventes valores.
- Las animaciones siguen docs/ANIMATIONS.md (mismos easings, duraciones).
- Mobile-first: 375px es el diseño base.
- Recuerda: no soy desarrollador. Explícame todo en lenguaje simple.
- La vista comparativa es la pieza más visual de AMPLIFY. Tiene que generar WOW.

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- La URL de comparación solo funciona para las dos personas involucradas.
- En el admin: solo accesible con ADMIN_SECRET (como el resto del admin).
- No exponer datos de un lead al otro más allá de scores e iniciales.

### 3. Calidad del código
- Cero console.log de debug.
- Componentes de la vista comparativa reutilizables (ComparisonBar, ComparisonInsight).
- Archivos < 300 líneas.

### 4. Testing funcional
- Vista comparativa: datos ficticios → datos reales → verificar que los scores coinciden.
- Animación de barras: funciona en Chrome, Safari, Firefox mobile.
- La perspectiva cambia según quién mira (Persona A ve "Tú=A", Persona B ve "Tú=B").
- Admin: las métricas se calculan correctamente con 0 datos, 1 dato, y N datos.
- Mobile 375px: barras legibles, scores claros, sin overflow.

### 5. Accesibilidad
- Barras con aria-label descriptivo.
- Counter animado respeta prefers-reduced-motion (aparece estático).
- La página de comparación tiene estructura semántica (h1, h2, etc.).

### 6. Performance
- La vista comparativa carga rápido (una sola llamada API).
- Las animaciones usan requestAnimationFrame.

### 7. Diseño y UX (OBLIGATORIO)

**7a. Consistencia:** Mismos tokens que el mapa individual. Misma paleta, mismos easings.
**7b. 5 estados:**
- Loading: skeleton de barras paralelas (no spinner)
- Vacío: N/A (siempre hay datos si la URL existe)
- Error: "Esta comparación ya no está disponible" + link a mi mapa
- Parcial: si una persona no ha aceptado aún → "Esperando aceptación"
**7c. Feedback:** Counters animados dan sensación de revelación progresiva.
**7d. Una acción:** Después de ver la comparación, el CTA es "Empezar la Semana 1".
**7e. Respira:** Spacing generoso entre dimensiones. La comparación no se siente apretada.
**7f. Copy:** "Mayor brecha" (no "Mayor diferencia"). "Comparación" (no "Versus").
**7g. WOW:** La secuencia de 7 segundos con barras llenándose en paralelo + insight al final es el momento WOW. Si no genera reacción, no está terminado.

## Actualización de progreso
Después de completar:
1. Actualiza `docs/PROGRESS.md`:
   ```
   - ✅ **AMPLIFY — Sesión 3: Vista Comparativa + Admin** ({fecha}):
     - Página de comparación con barras paralelas animadas, insight dinámico, CTA
     - Card AMPLIFY en Hub, badge Referido en LAM, métricas en Analytics
   ```
2. Actualiza `docs/PENDIENTES.md` — eliminar o actualizar el estado de AMPLIFY.
3. Commit final limpio.
