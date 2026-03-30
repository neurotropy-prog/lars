## Contexto
Proyecto: L.A.R.S.© — Sistema de adquisición del Programa LARS para ejecutivos con burnout
Sesión GOOGLE AUTH: Reemplazar acceso por ADMIN_SECRET con autenticación Google OAuth via Supabase Auth

## Documentos fundamentales (LEER ANTES de empezar)
- `CLAUDE.md` — Reglas del proyecto (LEER PRIMERO)
- `docs/DATABASE.md` — Schema actual de la BD
- `docs/SECURITY.md` — Reglas de seguridad

## Lo que ya está construido
- Admin completo: Hub, LAM, Automations, Analytics, Agenda, Emails
- Acceso actual: `?secret=ADMIN_SECRET` en la URL (variable de entorno)
- Todas las API routes de admin verifican este secret
- Supabase ya está integrado (PostgreSQL + client SDK)

## Tu tarea

Reemplazar el sistema actual de acceso al admin (secret en URL) por **autenticación con Google OAuth via Supabase Auth**, restringido a exactamente 2 usuarios:

- `javier@institutoepigenetico.com`
- `alex@withowners.com`

Nadie más puede acceder al admin. Ni siquiera si tiene cuenta Google.

Implementa en dos fases:
**FASE 1:** Configura Supabase Auth + Google OAuth + middleware. Avísame cuando esté listo para que yo configure las credenciales.
**FASE 2:** Solo después de mi confirmación de que las credenciales están configuradas, conecta todo y elimina el sistema antiguo de ADMIN_SECRET.

---

### Tarea 1: Configurar Supabase Auth con Google Provider

**En Supabase Dashboard (instrucciones para Javier/Alex):**

Necesito que prepares instrucciones paso a paso para que yo haga esto manualmente en Supabase Dashboard:

1. Ir a Authentication → Providers → Google → Activar
2. Necesita: Google Client ID + Google Client Secret
3. Para obtenerlos: ir a Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `https://[PROJECT_REF].supabase.co/auth/v1/callback`
4. Copiar Client ID y Client Secret → pegarlos en Supabase Dashboard
5. Guardar

**IMPORTANTE:** Dame estas instrucciones EXACTAS con screenshots textuales (paso 1, paso 2, etc.) para que no me pierda. No soy desarrollador.

### Tarea 2: Tabla de usuarios autorizados

Crear una tabla `admin_users` en Supabase para controlar quién puede acceder:

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  role VARCHAR DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Solo estos 2 usuarios
INSERT INTO admin_users (email, name, role) VALUES
  ('javier@institutoepigenetico.com', 'Javier A. Martín Ramos', 'admin'),
  ('alex@withowners.com', 'Alex', 'superadmin');

-- RLS: solo lectura para el propio usuario autenticado
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own record" ON admin_users
  FOR SELECT USING (auth.email() = email);
```

**IMPORTANTE:** Antes de ejecutar cualquier migración:
1. Explícame qué vas a crear y por qué
2. Muéstrame el SQL exacto
3. Espera mi aprobación
4. Después de ejecutar, actualiza `docs/DATABASE.md`

### Tarea 3: Página de login `/admin/login`

Crear una página de login minimalista:

```
[Logo LARS o texto "Instituto Epigenético"]

ADMIN

[🔵 Entrar con Google]

"Acceso restringido a administradores autorizados."
```

**Estilo visual:**
- Fondo oscuro cálido (#0B0F0E) — mismo que el resto del proyecto
- Centrado vertical y horizontal
- Botón de Google con estilo oficial (o estilizado según DESIGN.md)
- Tipografía: Inter para el cuerpo, Cormorant para "ADMIN"
- Mobile-first: funciona perfecto en 375px
- Animación: fade-in sutil al cargar

**Flujo:**
1. Usuario hace click en "Entrar con Google"
2. Se abre popup de Google OAuth (Supabase lo gestiona)
3. Usuario elige su cuenta Google
4. Supabase verifica el token
5. Tu código verifica que el email está en `admin_users`
6. Si SÍ → redirect a `/admin` (dashboard)
7. Si NO → mostrar error: "Tu cuenta no tiene acceso al admin. Contacta con el administrador." + botón "Intentar con otra cuenta"

### Tarea 4: Middleware de autenticación

Crear un middleware que proteja TODAS las rutas `/admin/*`:

```typescript
// middleware.ts o src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  // Si no hay sesión → redirect a login
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Verificar que el email está en admin_users
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('email, role')
    .eq('email', session.user.email)
    .single()

  if (!adminUser) {
    // Cerrar sesión (no es admin autorizado)
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/admin/login?error=unauthorized', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
```

**Excluir** `/admin/login` del middleware (si no, loop infinito).

### Tarea 5: Actualizar API routes del admin

Todas las API routes que actualmente verifican `ADMIN_SECRET` deben verificar la sesión de Supabase Auth:

**Antes (sistema actual):**
```typescript
const secret = request.headers.get('x-admin-secret') || searchParams.get('secret')
if (secret !== process.env.ADMIN_SECRET) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Después (nuevo sistema):**
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabase = createRouteHandlerClient({ cookies })
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

// Verificar que es admin autorizado
const { data: adminUser } = await supabase
  .from('admin_users')
  .select('email, role')
  .eq('email', session.user.email)
  .single()

if (!adminUser) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

**Crear un helper reutilizable** para no repetir esto en cada API route:

```typescript
// src/lib/admin-auth.ts
export async function verifyAdmin(cookies) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return { authorized: false, error: 'No session', status: 401 }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', session.user.email)
    .single()

  if (!adminUser) return { authorized: false, error: 'Not admin', status: 403 }

  // Actualizar last_login_at
  await supabase
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('email', session.user.email)

  return { authorized: true, user: adminUser, session }
}
```

### Tarea 6: Botón de logout + info de sesión

En el header del admin (ya existe), añadir:

```
[Avatar Google / Iniciales]  Javier  ▾
                              └─ [Cerrar sesión]
```

- Mostrar nombre o email del usuario logueado
- Dropdown con "Cerrar sesión"
- Logout llama a `supabase.auth.signOut()` → redirect a `/admin/login`

### Tarea 7: Eliminar sistema antiguo (SOLO DESPUÉS DE VERIFICAR)

**SOLO después de confirmar que Google Auth funciona:**

1. Eliminar `ADMIN_SECRET` de `.env.local` y `.env.example`
2. Eliminar toda referencia a `x-admin-secret` en headers
3. Eliminar toda referencia a `?secret=` en URLs
4. Buscar y limpiar cualquier referencia residual al sistema antiguo
5. Verificar que NINGUNA ruta del admin funciona sin autenticación Google

### Tarea 8: Variables de entorno necesarias

Añadir a `.env.local`:
```
# Google OAuth (configurar en Supabase Dashboard)
# No se necesitan variables extra aquí — Supabase gestiona Google OAuth internamente
# Solo necesitas las variables de Supabase que ya existen:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

Si se necesita alguna variable adicional para el auth helper, documentarla.

---

## Diferencia de roles (futuro)

Aunque ahora ambos son "admin", la tabla tiene campo `role` para futura diferenciación:
- `superadmin` (Alex): puede ver todo + configuración del sistema
- `admin` (Javier): puede ver todo excepto configuración técnica

Por ahora, ambos ven lo mismo. Pero el campo está preparado para cuando se necesite.

---

## Reglas críticas
- **NUNCA ejecutes `npm run build`.** Usa `npx tsc --noEmit` para verificar tipos.
- NO modifiques la base de datos sin avisarme antes y mostrarme el SQL.
- Las credenciales de Google OAuth las configuro yo manualmente (instrucciones paso a paso).
- El sistema antiguo (ADMIN_SECRET) NO se elimina hasta que Google Auth esté verificado y funcionando.
- Recuerda: no soy desarrollador. Explícame todo en lenguaje simple.
- Instala los paquetes necesarios con `npm install` (nunca borres node_modules).

## Validación obligatoria (ANTES de cada commit)

### 1. Tipos y compilación
- Ejecuta `npx tsc --noEmit` — cero errores, cero warnings.

### 2. Seguridad
- Solo los 2 emails autorizados pueden acceder al admin
- Si alguien con otro email Google intenta entrar → error claro, sin acceso
- La sesión expira después de 7 días (configurar en Supabase)
- CSRF protegido por Supabase Auth
- No exponer tokens en URLs ni en logs

### 3. Calidad del código
- Cero console.log de debug
- Helper `verifyAdmin()` reutilizable en todas las API routes
- Archivos < 300 líneas

### 4. Testing funcional
- Login con email autorizado → acceso ✅
- Login con email NO autorizado → error + redirect ✅
- Acceder a `/admin` sin sesión → redirect a login ✅
- Acceder a `/admin/lam` sin sesión → redirect a login ✅
- API route `/api/admin/*` sin sesión → 401 ✅
- API route `/api/admin/*` con sesión no-admin → 403 ✅
- Logout → redirect a login, no puede volver con "Atrás" ✅
- Mobile 375px: login page responsive ✅

### 5. Accesibilidad
- Botón de Google accesible con teclado
- Error messages claros y visibles
- Focus visible en todos los elementos interactivos

### 6. Performance
- Login page carga en <1s
- Middleware no añade más de 100ms a cada request
- Verificación de admin cacheada en la sesión (no re-query en cada request)

### 7. Diseño y UX (OBLIGATORIO)
**7a. Consistencia:** La página de login usa tokens de DESIGN.md (colores, tipografía, spacing)
**7b. Claridad:** Un solo botón, una sola acción. No hay ambigüedad.
**7c. Error handling:** Si el email no es autorizado, el mensaje es claro y no técnico: "Tu cuenta no tiene acceso." No "403 Forbidden".
**7d. Feedback:** Después de click en "Entrar con Google", mostrar loading state mientras se completa OAuth.
**7e. Seguridad visible:** El usuario ve su nombre/email en el header — sabe que está logueado.

## Actualización de progreso
Después de completar y pasar TODAS las verificaciones:
1. Actualiza `docs/DATABASE.md` con la nueva tabla `admin_users`.
2. Actualiza `docs/SECURITY.md` con el nuevo sistema de autenticación.
3. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **GOOGLE AUTH — Sesión 1: Autenticación admin** ({fecha}):
     - Login con Google OAuth via Supabase Auth, tabla admin_users (2 emails autorizados), middleware de protección, helper verifyAdmin(), logout, eliminación de ADMIN_SECRET
   ```
4. Commit final limpio.

**NOTA CRÍTICA — Pasos manuales para Javier/Alex:**
1. Crear proyecto en Google Cloud Console (si no existe)
2. Crear OAuth 2.0 Client ID (Web application)
3. Configurar redirect URI: `https://[PROJECT_REF].supabase.co/auth/v1/callback`
4. Copiar Client ID + Secret → Supabase Dashboard → Auth → Providers → Google
5. Activar Google Provider en Supabase

Sin estos pasos, el login no funciona. Claude Code construye todo el código, pero la configuración OAuth es manual.
