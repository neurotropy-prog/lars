# Google OAuth Setup para L.A.R.S. Admin

Esta es la guía completa para activar autenticación con Google OAuth en el admin de L.A.R.S.

## Estado actual

- ✅ El código está preparado y listo para usar Google OAuth
- ✅ Tabla `admin_users` con los 2 emails autorizados
- ✅ Página de login `/admin/login` con botón de Google
- ✅ Middleware que protege todas las rutas `/admin/*`
- ⏳ **Falta:** Configuración manual de credenciales de Google (este documento)

## Pasos a seguir

### PASO 1: Crear/Acceder a Google Cloud Console

1. Ve a https://console.cloud.google.com
2. Si no tienes un proyecto, crea uno nuevo:
   - Haz click en "Seleccionar un proyecto" (arriba a la izquierda)
   - Haz click en "Nuevo proyecto"
   - Nombre: "L.A.R.S. Admin"
   - Haz click en "Crear"
3. Espera a que se complete la creación (1-2 minutos)

### PASO 2: Habilitar Google+ API

1. En Google Cloud Console, ve a **APIs & Services → Habilitadas**
2. Haz click en "+ HABILITADOR APIS Y SERVICIOS"
3. Busca "Google+ API"
4. Haz click en ella
5. Haz click en "Habilitar"
6. Espera a que se active (30 segundos)

### PASO 3: Crear credenciales OAuth 2.0

1. Ve a **APIs & Services → Credenciales** (en el sidebar izquierdo)
2. Haz click en "+ CREAR CREDENCIALES"
3. Selecciona **"ID de cliente OAuth 2.0"**

Si pide "Configurar la pantalla de consentimiento primero":
- Haz click en "Configurar pantalla de consentimiento"
- Selecciona **"Externo"**
- Haz click en "Crear"
- Rellena:
  - **Nombre de la app:** L.A.R.S. Admin
  - **Email de soporte de usuario:** javier@institutoepigenetico.com
  - **Email de contacto para cuestiones de privacidad:** javier@institutoepigenetico.com
- Haz click en "Guardar y continuar"
- En "Ámbitos", haz click en "Guardar y continuar"
- En "Usuarios de prueba", haz click en "Guardar y continuar"
- En "Resumen", haz click en "Volver a panel"

Vuelve a **Credenciales → + CREAR CREDENCIALES → ID de cliente OAuth 2.0**:
- Tipo de aplicación: **Aplicación web**
- Nombre: "L.A.R.S. Admin Login"
- En "URIs autorizados de redirección", haz click en "+ Agregar URI"
- Copia y pega este URI exacto:
  ```
  https://dqxjtfhqzecdljstnkch.supabase.co/auth/v1/callback
  ```
  ⚠️ **IMPORTANTE:** Este es el PROJECT_REF de tu Supabase. Si es diferente en tu caso, replázalo.

  Puedes encontrarlo en: Supabase Dashboard → Project Settings → API → Project URL (el subdominio antes de ".supabase.co")

4. Haz click en "Crear"
5. Verás un diálogo con:
   - **Client ID** (copiar)
   - **Client Secret** (copiar)
6. Haz click en "Copiar" para cada uno y guarda en un lugar seguro

### PASO 4: Configurar en Supabase Dashboard

1. Ve a tu dashboard de Supabase: https://app.supabase.com
2. Selecciona el proyecto L.A.R.S.
3. En el sidebar, ve a **Authentication → Providers**
4. Busca **Google** y haz click en él
5. Activa el toggle "Enabled"
6. En **Client ID**, pega el Client ID de Google
7. En **Client Secret**, pega el Client Secret de Google
8. Haz click en "Save"

### PASO 5: Verificar que funciona

1. Ve a https://lars.institutoepigenetico.com/admin
2. Deberías ser redirigido a `/admin/login`
3. Haz click en "Entrar con Google"
4. Elige tu cuenta (javier@institutoepigenetico.com o alex@withowners.com)
5. Si funciona, serás redirigido al admin con tu sesión activa
6. El botón de "Logout" en la sidebar inferior funciona

## Troubleshooting

### Error: "redirect_uri_mismatch"
- La URI que configuraste en Google no coincide
- Verifica que esté exactamente como lo escribiste en Google Cloud Console
- No debe haber espacios antes/después

### Error: "Unauthorized access"
- Tu email no está en la tabla `admin_users`
- Solo funcionan: `javier@institutoepigenetico.com` y `alex@withowners.com`

### No veo el botón de Google
- Es posible que no se haya habilitado Google API
- Vuelve al paso 2 y asegúrate de que Google+ API esté "Habilitada"

### Cambiar credenciales después
- Si necesitas cambiar las credenciales más tarde:
  1. Ve a Supabase Dashboard → Authentication → Providers → Google
  2. Edita los valores
  3. Haz click en "Save"
  4. Los cambios son inmediatos

## Próximos pasos después de verificar

Una vez que Google OAuth esté funcionando:

1. Actualiza `docs/PROGRESS.md` con:
   ```
   - ✅ **Session 0: Google Auth** ({fecha}):
     - Autenticación admin con Google OAuth via Supabase Auth (2 usuarios autorizados), página login, middleware, helper verifyAdmin(), logout, eliminación de ADMIN_SECRET
   ```

2. Puedes eliminar las referencias a `ADMIN_SECRET`:
   - En `.env.local`: elimina `ADMIN_SECRET=...`
   - En `.env.example`: elimina `ADMIN_SECRET`
   - Verifica que no haya más referencias al sistema antiguo

3. La próxima sesión (Session 1) trabaja sobre esta base: Editor de Copy
