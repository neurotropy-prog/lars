-- 005_admin_users.sql
-- Crear tabla de usuarios admin autorizados para Google OAuth
-- Almacena email, nombre, rol, y timestamps de login
-- IMPORTANTE: No ejecutar sin aprobación de Javier/Alex

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  role VARCHAR DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMP DEFAULT now(),
  last_login_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT now()
);

-- Crear índice en email para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Row Level Security: solo lectura para el propio usuario autenticado
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own record" ON admin_users
  FOR SELECT USING (auth.email() = email);

-- Insertar los 2 usuarios autorizados
INSERT INTO admin_users (email, name, role) VALUES
  ('javier@institutoepigenetico.com', 'Javier A. Martín Ramos', 'admin'),
  ('alex@withowners.com', 'Alex', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- Reversal (para deshacer si es necesario):
-- DROP TABLE IF EXISTS admin_users CASCADE;
