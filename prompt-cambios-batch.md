# Prompt para Claude Code — 5 cambios

Necesito que hagas estos 5 cambios. Lee los archivos relevantes antes de tocar nada. Recuerda: NUNCA ejecutes `npm run build`. Verifica tipos con `npx tsc --noEmit`. Para desplegar, solo hay que hacer git push.

---

## 1. QUITAR EL CANVAS DEL SISTEMA NERVIOSO

Elimina el componente NervousSystemCanvas.tsx y toda su integración. Actualmente hay un canvas 2D a pantalla completa (z-index: 51) que renderiza el "sistema nervioso" animado como fondo durante el gateway.

Archivos involucrados:
- `src/components/NervousSystemCanvas.tsx` — eliminar el archivo completo
- `src/lib/nervous-system-engine.ts` — eliminar el archivo completo
- `src/contexts/NervousSystemContext.tsx` — eliminar el archivo completo
- `src/components/GatewayController.tsx` — quitar el import y uso del NervousSystemProvider y NervousSystemCanvas
- Cualquier otro archivo que importe NervousSystemContext, NervousSystemCanvas, o nervous-system-engine — quitar esos imports y usos

**NO toques** el `NervousSystemSVG.tsx` de la landing (`src/components/landing/NervousSystemSVG.tsx`) — ese se queda.

Después de eliminar, verifica con `npx tsc --noEmit` que no hay errores de tipos.

---

## 2. AUTO-SCROLL AL TOPE AL AVANZAR DE PREGUNTA EN EL GATEWAY

**Problema:** cuando el usuario responde una pregunta y avanza a la siguiente, a veces la vista se queda abajo y tiene que hacer scroll manual para ver la nueva pregunta. La pregunta SIEMPRE debe ser lo primero visible después de cada avance.

**Solución:** añade un `window.scrollTo({ top: 0, behavior: 'smooth' })` en cada transición entre preguntas/pasos dentro del gateway.

Archivos donde implementar:
- `src/components/gateway/GatewayBloque1.tsx` — en cada transición de paso (P2 → Analizando → PrimeraVerdad → P3 → P4 → MicroEspejo1)
- `src/components/gateway/GatewayBloque2.tsx` — en cada transición de paso (P5 → P6 → MicroEspejo2 → P7 → P8)
- `src/components/gateway/GatewayBloque3.tsx` — en cada transición de paso
- `src/components/GatewayController.tsx` — en las transiciones entre bloques (Landing→Bloque1, Bloque1→Bloque2, Bloque2→Bloque3)

Implementa el scroll DESPUÉS de que se actualice el estado del paso, pero dentro del mismo ciclo. Usa un pequeño `setTimeout` (50-100ms) si es necesario para que el DOM se actualice primero. Ejemplo:

```typescript
const handleNext = () => {
  setCurrentStep('next_step');
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 80);
};
```

---

## 3. MENÚ DE NAVEGACIÓN EN EL ADMIN

El panel admin tiene 3 secciones (Analytics, Disponibilidad, Fast-Forward) pero no hay forma de navegar entre ellas sin volver al hub. Crea un menú de navegación persistente.

Archivos involucrados:
- **Crear:** `src/components/admin/AdminNav.tsx` — componente de navegación
- **Modificar:** `src/app/admin/analytics/page.tsx`
- **Modificar:** `src/app/admin/disponibilidad/page.tsx`
- **Modificar:** `src/app/admin/fast-forward/page.tsx`
- **Modificar:** `src/app/admin/page.tsx` (hub principal)

Requisitos del menú:
- Barra horizontal en la parte superior de cada página admin
- Links a: Hub (/admin), Analytics (/admin/analytics), Disponibilidad (/admin/disponibilidad), Fast-Forward (/admin/fast-forward)
- Indicador visual de la página activa (usa el verde `#4ADE80` del sistema de diseño)
- Fondo oscuro coherente con el diseño admin existente
- Mobile responsive (en móvil que sea scrollable horizontal o se adapte)
- Que aparezca en TODAS las páginas admin, incluyendo el hub
- Usa `'use client'` y `usePathname()` de `next/navigation` para detectar la ruta activa

---

## 4. FIX GOOGLE CALENDAR — EVENTOS NO APARECEN EN EL CALENDARIO DE JAVIER

La integración con Google Calendar parece funcionar internamente (la API no da error, se crea el booking en Supabase), PERO los eventos NO aparecen en el calendario real de Javier y NO le llegan emails de notificación cuando alguien agenda.

Archivos a revisar:
- `src/lib/google-calendar.ts` — configuración OAuth2 y calendarId
- `src/app/api/booking/create/route.ts` — cómo se llama a createCalendarEvent
- `src/lib/booking-emails.ts` — verificar que el email de Javier sea correcto

**Verificar y corregir lo siguiente:**

1. **GOOGLE_CALENDAR_ID** debe ser `"javier@institutoepigenetico.com"` (no `"primary"` ni otro valor). Si se usa `process.env.GOOGLE_CALENDAR_ID`, confirma que el código lo usa correctamente.

2. **`sendUpdates: 'all'`** — Esto es CRÍTICO. Cuando se crea el evento con la API de Google Calendar, el parámetro `sendUpdates` debe ser `'all'` para que Google envíe notificaciones por email. Esto va como query parameter en la URL de la API, NO en el body del evento. Ejemplo:
   ```
   POST https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events?sendUpdates=all
   ```
   Revisa si está presente. Si no, AÑÁDELO.

3. **Attendees** — El evento debe incluir como attendee al usuario que agenda. Verificar que el array de `attendees` se envíe correctamente en el body del evento.

4. **Email de Javier para notificaciones** — En `src/lib/booking-emails.ts`, la constante `JAVIER_EMAIL` apunta actualmente a `regulacion@institutoepigenetico.com`. **CÁMBIALO** a `javier@institutoepigenetico.com` para que las notificaciones de booking le lleguen a su email directo.

5. **Logging** — Añade `console.log` detallado en `createCalendarEvent` para que en los logs de Vercel podamos diagnosticar:
   - El calendarId usado
   - Los attendees enviados
   - La URL completa de la petición (incluyendo query params)
   - El response status de Google
   - El body de respuesta de Google (o el error completo si falla)

6. **Refresh token** — Verifica que el flujo de obtención del access token no falle silenciosamente. Si el refresh falla, el error debe loggearse explícitamente, no tragarse.

El email correcto de Javier es: **javier@institutoepigenetico.com**

---

## 5. SQL PARA LIMPIAR BASE DE DATOS DE SUPABASE (reset completo)

Todo lo que hay en la base de datos hasta ahora son pruebas. Necesito un SQL que pueda ejecutar en el SQL Editor de Supabase para borrar TODOS los datos pero mantener las tablas y su estructura.

Genera un archivo `scripts/reset-database.sql` con este contenido:

```sql
-- ============================================
-- RESET COMPLETO DE BASE DE DATOS L.A.R.S.
-- Solo borra datos. Mantiene tablas y estructura.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================

-- IMPORTANTE: Ejecutar en este orden por foreign keys

-- 1. Primero bookings (tiene FK a diagnosticos)
TRUNCATE TABLE bookings CASCADE;

-- 2. Después diagnosticos
TRUNCATE TABLE diagnosticos CASCADE;

-- 3. Disponibilidad (sin FKs, independiente)
TRUNCATE TABLE availability_config CASCADE;

-- Verificación: debe devolver 0 en las 3 consultas
SELECT 'bookings' AS tabla, COUNT(*) AS registros FROM bookings
UNION ALL
SELECT 'diagnosticos', COUNT(*) FROM diagnosticos
UNION ALL
SELECT 'availability_config', COUNT(*) FROM availability_config;
```

Crea el archivo en `scripts/reset-database.sql` dentro del proyecto.

**NO ejecutes este SQL. Solo genera el archivo.** Yo lo ejecutaré manualmente desde el dashboard de Supabase.

---

## RECORDATORIOS FINALES

- **NUNCA ejecutes `npm run build`.** Verifica tipos con `npx tsc --noEmit`.
- **NUNCA ejecutes `rm -rf node_modules` ni `rm -rf .next`.**
- Para desplegar: `git push` y Vercel se encarga.
- Al terminar cada cambio, actualiza `docs/PROGRESS.md` y `docs/DECISIONS.md` si aplica.
