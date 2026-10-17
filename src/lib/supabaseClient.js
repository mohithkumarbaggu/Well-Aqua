import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mzjkwfcuiwcfhngrsmdl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8XODYXSAWYPPXmuFgVft0g_222eYxEP';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Health check helper for Supabase connection
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Supabase session check notice:', error.message);
      return { connected: true, session: null, message: error.message };
    }
    return { connected: true, session: data.session, message: 'Connected successfully' };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { connected: false, error: err.message };
  }
}
