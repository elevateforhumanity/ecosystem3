// Shared Supabase client for all sister sites
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, storage: localStorage }
});

// Shared "memory" functions for all sister sites
export async function loadMe() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Upsert into app_users
  await supabase.from('app_users').upsert({
    auth_user_id: user.id,
    email: user.email
  }, { onConflict: 'auth_user_id' });

  // Get or create profile/preferences
  const userRow = await supabase.from('app_users').select('id').eq('auth_user_id', user.id).single();
  const user_id = userRow.data?.id;

  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user_id).maybeSingle();
  const { data: prefs } = await supabase.from('preferences').select('*').eq('user_id', user_id).maybeSingle();

  return { user, user_id, profile, prefs };
}

// Global function for easy access across sites
window.efhLoadMe = loadMe;