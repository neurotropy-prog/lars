-- 004_personal_actions.sql
-- Añadir columna para acciones personales de Javi sobre leads.
-- IMPORTANTE: No ejecutar sin aprobación de Javi/Alex. Es aditiva y no afecta datos existentes.

ALTER TABLE diagnosticos
  ADD COLUMN IF NOT EXISTS personal_actions jsonb DEFAULT '[]'::jsonb;

-- Índice GIN para queries eficientes sobre el array de acciones
CREATE INDEX IF NOT EXISTS idx_diagnosticos_personal_actions
  ON diagnosticos USING gin (personal_actions);

-- Reversal:
-- ALTER TABLE diagnosticos DROP COLUMN IF EXISTS personal_actions;
-- DROP INDEX IF EXISTS idx_diagnosticos_personal_actions;
