# DATABASE.md — Schema de Base de Datos

Base de datos: **Supabase (PostgreSQL)**

---

## Implementación actual (Fase 5)

### Tabla `diagnosticos`

Una tabla única con columnas JSONB para todos los datos de cada persona.
Enfoque: simplicidad + velocidad de iteración. No se normaliza hasta tener volumen que lo justifique.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid (PK, default gen_random_uuid()) | Identificador interno |
| `email` | text (NOT NULL) | Email de la persona |
| `hash` | text (NOT NULL, UNIQUE) | 12 chars aleatorios — URL del mapa |
| `created_at` | timestamptz (default NOW()) | Cuándo se registró |
| `responses` | jsonb NOT NULL | Respuestas P1-P8 |
| `scores` | jsonb NOT NULL | Score global + 5 dimensiones |
| `profile` | jsonb DEFAULT '{}' | Ego, vergüenza, negación detectada |
| `map_evolution` | jsonb DEFAULT '{}' | Estado de evoluciones del mapa (días 3/7/14/21/30) |
| `confidence_chain` | jsonb DEFAULT '{}' | Cadena de depósitos de confianza |
| `funnel` | jsonb DEFAULT '{}' | Estado de conversión |
| `meta` | jsonb DEFAULT '{}' | Fuente, dispositivo, `last_visited_at` (ISO string) |

**Índices:** `email` y `hash` para búsqueda rápida.

**RLS:** Row Level Security activo. Solo el service role puede leer/escribir. Sin acceso público directo a la tabla.

---

## SQL de migración — Ejecutar en Supabase

Ve a **Supabase Dashboard → SQL Editor** y ejecuta este bloque completo:

```sql
-- ─── Tabla principal ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diagnosticos (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL,
  hash          TEXT        NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responses     JSONB       NOT NULL DEFAULT '{}',
  scores        JSONB       NOT NULL DEFAULT '{}',
  profile       JSONB       NOT NULL DEFAULT '{}',
  map_evolution JSONB       NOT NULL DEFAULT '{}',
  confidence_chain JSONB    NOT NULL DEFAULT '{}',
  funnel        JSONB       NOT NULL DEFAULT '{}',
  meta          JSONB       NOT NULL DEFAULT '{}'
);

-- ─── Índices ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_diagnosticos_email ON diagnosticos (email);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_hash  ON diagnosticos (hash);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;

-- Sin políticas públicas → solo el service_role_key puede acceder
-- Las API Routes del backend usan createAdminClient() con service_role_key
-- El frontend NUNCA tiene acceso directo a esta tabla
```

**Para revertir (si hace falta):**
```sql
DROP TABLE IF EXISTS diagnosticos;
```

---

## Estructura de los campos JSONB

### `responses`
```json
{
  "p1": "A",
  "p2": "B",
  "p3": ["A", "C", "E"],
  "p4": "A",
  "p5": "B",
  "p6": "A",
  "p7": {
    "regulacion": 3,
    "sueno": 2,
    "claridad": 4,
    "emocional": 3,
    "alegria": 2
  },
  "p8": "C"
}
```

### `scores`
```json
{
  "global": 34,
  "d1_regulacion": 28,
  "d2_sueno": 22,
  "d3_claridad": 45,
  "d4_emocional": 30,
  "d5_alegria": 25,
  "label": "Crítico"
}
```

### `profile`
```json
{
  "ego_primary": "Fuerte Invisible",
  "shame_level": "high",
  "denial_detected": true
}
```

### `funnel`
```json
{
  "gateway_completed": true,
  "email_captured": true,
  "map_visits": 0,
  "map_last_visit": null,
  "cta_clicked": false,
  "converted_week1": false,
  "converted_program": false,
  "session_booked": false
}
```

---

## Variables de entorno requeridas

Configura estas variables en **Vercel → Project Settings → Environment Variables** y en tu **`.env.local`** local:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...   ← NUNCA exponer al cliente

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx

# App
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

Cómo obtener las keys de Supabase:
- Ir a Supabase Dashboard → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` → service_role key (mantener PRIVADA)

Cómo obtener la key de Resend:
- Ir a resend.com → API Keys → Create API Key
- Verificar el dominio de envío en resend.com → Domains
- Actualizar `FROM_EMAIL` en `src/lib/email.ts` con tu dominio verificado

---

## Seguridad

- Los mapas vivos son privados por diseño.
- RLS activo en `diagnosticos`. Sin acceso público.
- La URL con hash (12 chars) es el único método de acceso al mapa.
- No hay autenticación pero las URLs no son indexables (noindex en metadata).
- Los scores y datos sensibles solo se muestran en la URL personal, nunca en APIs públicas.
- Todas las operaciones de BD van por `createAdminClient()` en rutas de API (backend), nunca desde el cliente.

---

*L.A.R.S.© · Database Schema · Fase 4 · Marzo 2026*
