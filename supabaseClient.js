import { createClient } from '@supabase/supabase-js';

// Preferir service role en el servidor (bypass RLS). El anon no debe ir al navegador.
let supabaseUrl = process.env.SUPABASE_URL || '';
// Typo en Render: q1l (dígito) vs qll (eles) rompe Auth/DB
if (supabaseUrl.includes('lnjcbcdudokkjq1lrqlf')) {
  supabaseUrl = supabaseUrl.replace('lnjcbcdudokkjq1lrqlf', 'lnjcbcdudokkjqllrqlf');
}
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';
const supabaseKey = serviceKey || anonKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('🚨 Configuración crítica: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (preferido) o SUPABASE_ANON_KEY deben estar en el entorno.');
}

export const supabaseUsaServiceRole = Boolean(serviceKey);

if (!serviceKey) {
  console.warn('⚠️ [SUPABASE]: Sin SUPABASE_SERVICE_ROLE_KEY. RLS abierto (USING true) no se puede cerrar sin romper el API. Ver scripts/lock_rls_progreso.sql');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
