import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

// Supabase versi baru memakai PUBLISHABLE_KEY, versi lama memakai ANON_KEY
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

// Validasi: bukan string kosong atau placeholder
const isConfigured =
  supabaseUrl.startsWith('https://') &&
  supabaseKey.length > 20 &&
  !supabaseKey.includes('...');

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
);

/** true = kredensial nyata sudah ada di .env.local */
export const supabaseIsConfigured = isConfigured;
