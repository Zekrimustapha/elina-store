import { createClient, SupabaseClient } from '@supabase/supabase-js';

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safe lazy getter for client-side Supabase instance
let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  if (isValidUrl(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('your_')) {
    cachedClient = createClient(supabaseUrl!, supabaseAnonKey);
    return cachedClient;
  }
  return null;
}

// Server-side Supabase client with Service Role Key (bypasses RLS for secure order handling)
export function getServiceSupabase(): SupabaseClient | null {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (
    isValidUrl(projectUrl) &&
    serviceRoleKey &&
    !serviceRoleKey.includes('your_')
  ) {
    return createClient(projectUrl!, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return null;
}
