-- 007_copy_audit_log.sql
-- Historial de cambios en copy_overrides.
-- Registra quién cambió qué, cuándo, y el valor anterior/nuevo.
--
-- IMPORTANTE: No ejecutar sin aprobación de Javier/Alex.
--
-- Reversal:
-- DROP TABLE IF EXISTS copy_audit_log CASCADE;

CREATE TABLE IF NOT EXISTS copy_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  copy_key TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  action TEXT NOT NULL CHECK (action IN ('update', 'restore', 'restore_section')),
  changed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by key and time
CREATE INDEX idx_copy_audit_log_key ON copy_audit_log (copy_key, created_at DESC);
CREATE INDEX idx_copy_audit_log_time ON copy_audit_log (created_at DESC);

-- RLS: only admins read via service_role (createAdminClient bypasses RLS)
ALTER TABLE copy_audit_log ENABLE ROW LEVEL SECURITY;
