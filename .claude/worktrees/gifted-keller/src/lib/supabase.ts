import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ─── Cliente público (lazy) ───────────────────────────────────────────────────
// Se crea la primera vez que se llama, no al importar el módulo.
// Evita errores en build/dev cuando las env vars no están configuradas.
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

/** Alias de compatibilidad — usa getSupabase() para acceso lazy */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ─── Cliente admin ────────────────────────────────────────────────────────────
/** Solo para uso en API Routes (backend). Usa SUPABASE_SERVICE_ROLE_KEY. */
export function createAdminClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada");
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
