import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key (bypasses RLS)
// Only use this in API routes / server components, NEVER expose to client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
