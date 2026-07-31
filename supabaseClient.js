import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://lnjcbcdudokkjqllrqlf.supabase.co'; 
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuamNiY2R1ZG9ra2pxbGxycWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTE4OTEsImV4cCI6MjA5NTU2Nzg5MX0.DpXDnwgLYvnX87q4Pr7PLgxYgOisCjJ-duOk2r7KhGo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

