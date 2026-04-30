import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Cek apakah kredensial valid (bukan placeholder)
const isConfigured =
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes('...');

if (!isConfigured) {
  console.warn(
    '[DentalCloud] ⚠️  Supabase belum dikonfigurasi.\n' +
    'Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di file .env.local\n' +
    'lalu restart dev server dengan `npm run dev`.'
  );
}

// Selalu buat client — gunakan dummy URL jika belum dikonfigurasi agar tidak crash
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
);

/** true = kredensial asli sudah terisi di .env.local */
export const supabaseIsConfigured = isConfigured;
