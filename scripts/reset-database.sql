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
