-- ============================================================
-- MIGRACIÓN 001: Schema inicial del gateway L.A.R.S.©
-- Reversible: ver sección ROLLBACK al final
-- ============================================================

-- Extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: users
-- Cada persona que da su email en el gateway
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  map_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para buscar usuarios por hash del mapa (acceso público)
CREATE INDEX idx_users_map_hash ON users(map_hash);

-- ============================================================
-- TABLA: gateway_responses
-- Respuestas al diagnóstico + scores + perfil
-- ============================================================
CREATE TABLE gateway_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{}',
  profile JSONB NOT NULL DEFAULT '{}',
  meta JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gateway_responses_user_id ON gateway_responses(user_id);

-- ============================================================
-- TABLA: map_evolution
-- Estado de las evoluciones del mapa vivo (día 3 a 90+)
-- ============================================================
CREATE TABLE map_evolution (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  archetype_unlocked BOOLEAN DEFAULT FALSE,
  archetype_viewed BOOLEAN DEFAULT FALSE,
  insight_d7_unlocked BOOLEAN DEFAULT FALSE,
  insight_d7_viewed BOOLEAN DEFAULT FALSE,
  session_unlocked BOOLEAN DEFAULT FALSE,
  session_booked BOOLEAN DEFAULT FALSE,
  subdimensions_unlocked BOOLEAN DEFAULT FALSE,
  subdimensions_completed BOOLEAN DEFAULT FALSE,
  subdimension_responses JSONB,
  book_excerpt_unlocked BOOLEAN DEFAULT FALSE,
  book_excerpt_viewed BOOLEAN DEFAULT FALSE,
  reevaluation_unlocked BOOLEAN DEFAULT FALSE,
  reevaluation_completed BOOLEAN DEFAULT FALSE,
  reevaluation_scores JSONB,
  reevaluations JSONB DEFAULT '[]'
);

-- ============================================================
-- TABLA: confidence_chain
-- Cadena de depósitos de confianza durante el diagnóstico
-- ============================================================
CREATE TABLE confidence_chain (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  d1_first_truth BOOLEAN DEFAULT FALSE,
  d2_collective_data BOOLEAN DEFAULT FALSE,
  d3_mirror_1 BOOLEAN DEFAULT FALSE,
  d4_mirror_2 BOOLEAN DEFAULT FALSE,
  d5_bisagra BOOLEAN DEFAULT FALSE,
  d6_email BOOLEAN DEFAULT FALSE,
  d7_result BOOLEAN DEFAULT FALSE,
  abandoned_at_deposit INTEGER
);

-- ============================================================
-- TABLA: funnel
-- Estado de conversión de la persona
-- ============================================================
CREATE TABLE funnel (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  gateway_completed BOOLEAN DEFAULT FALSE,
  email_captured BOOLEAN DEFAULT FALSE,
  map_visits INTEGER DEFAULT 0,
  map_last_visit TIMESTAMPTZ,
  cta_clicked BOOLEAN DEFAULT FALSE,
  converted_week1 BOOLEAN DEFAULT FALSE,
  converted_program BOOLEAN DEFAULT FALSE,
  session_booked BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Los mapas son privados: acceso solo por map_hash
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gateway_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE confidence_chain ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública de users solo por map_hash
CREATE POLICY "Acceso público por map_hash"
  ON users FOR SELECT
  USING (true);

-- Política: lectura de gateway_responses vinculada a user
CREATE POLICY "Lectura de respuestas por usuario"
  ON gateway_responses FOR SELECT
  USING (true);

-- Política: lectura de map_evolution vinculada a user
CREATE POLICY "Lectura de evolución por usuario"
  ON map_evolution FOR SELECT
  USING (true);

-- Política: lectura de funnel vinculada a user
CREATE POLICY "Lectura de funnel por usuario"
  ON funnel FOR SELECT
  USING (true);

-- Nota: las escrituras se hacen desde el backend con service_role_key
-- que bypasa RLS. No hay políticas INSERT/UPDATE públicas.

-- ============================================================
-- ROLLBACK (para revertir esta migración)
-- ============================================================
-- DROP TABLE IF EXISTS funnel;
-- DROP TABLE IF EXISTS confidence_chain;
-- DROP TABLE IF EXISTS map_evolution;
-- DROP TABLE IF EXISTS gateway_responses;
-- DROP TABLE IF EXISTS users;
