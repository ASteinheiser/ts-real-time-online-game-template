import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!SUPABASE_URL) throw new Error('VITE_SUPABASE_URL is not set');
if (!SUPABASE_ANON_KEY) throw new Error('VITE_SUPABASE_ANON_KEY is not set');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: 'pkce',
    // We disable `detectSessionInUrl` because our custom redirect page will handle the exchange (and deep link if needed)
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
  },
});
