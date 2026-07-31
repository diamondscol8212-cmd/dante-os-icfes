import { createClient } from '@supabase/supabase-js';

// 1. URL de la API REST de tu proyecto indexado en la infraestructura de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://lnjcbcdudokkjqllrqlf.supabase.co'; 

// 2. Token JWT legítimo anon public sincronizado para autorizar el tráfico de Dante OS
const supabaseAnonKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuamNiY2R1ZG9ra2pxbGxycWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTE4OTEsImV4cCI6MjA5NTU2Nzg5MX0.DpXDnwgLYvnX87q4Pr7PLgxYgOisCjJ-duOk2r7KhGo';

// 3. Inicialización soberana del cliente para el procesamiento adaptativo con timeout seguro
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});
