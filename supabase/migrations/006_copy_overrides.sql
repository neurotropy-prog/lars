-- 006_copy_overrides.sql
-- Tabla para almacenar personalizaciones de copy (textos de la web).
-- Patrón: mismo que email_templates — overrides sobre defaults en código.
--
-- IMPORTANTE: No ejecutar sin aprobación de Javier/Alex.
--
-- Reversal:
-- DROP POLICY IF EXISTS "Public read" ON copy_overrides;
-- DROP TABLE IF EXISTS copy_overrides CASCADE;

CREATE TABLE IF NOT EXISTS copy_overrides (
  copy_key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by TEXT DEFAULT 'admin'
);

ALTER TABLE copy_overrides ENABLE ROW LEVEL SECURITY;

-- Lectura pública: el frontend necesita leer los textos personalizados
CREATE POLICY "Public read" ON copy_overrides
  FOR SELECT USING (true);

-- Escritura: protegida por ruta API con createAdminClient (service_role)
-- No se necesita política de INSERT/UPDATE/DELETE porque el service_role
-- bypasea RLS automáticamente.
