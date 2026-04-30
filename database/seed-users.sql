-- =========================================================
-- SEED: Demo Accounts untuk DentalCloud Pro
-- Jalankan di: Supabase Dashboard > Authentication > Users
-- Atau gunakan SQL Editor berikut ini
-- =========================================================

-- CATATAN: Supabase tidak memperbolehkan INSERT langsung ke auth.users
-- melalui SQL biasa. Gunakan salah satu cara di bawah ini:

-- ============================================================
-- CARA 1 (REKOMENDASI): Buat manual via Supabase Dashboard
-- Authentication > Users > "Add user" > isi email + password
-- ============================================================
-- Email   : admin@dentalcloud.id
-- Password: Admin@1234
-- ============================================================

-- ============================================================
-- CARA 2: Gunakan SQL ini HANYA jika Supabase mendukung
-- fungsi pgcrypto dan akses ke schema auth
-- ============================================================

-- Enable extension (jika belum ada)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Insert user admin (langsung ke auth.users — hanya works di Supabase)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  role,
  aud,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
)
VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@dentalcloud.id',
    crypt('Admin@1234', gen_salt('bf')),
    NOW(),
    '{"full_name": "drg. Sarah Amelia, Sp.Ort", "role": "admin"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    ''
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'dokter@dentalcloud.id',
    crypt('Dokter@1234', gen_salt('bf')),
    NOW(),
    '{"full_name": "drg. Bima Pratama, Sp.BM", "role": "doctor"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    ''
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'kasir@dentalcloud.id',
    crypt('Kasir@1234', gen_salt('bf')),
    NOW(),
    '{"full_name": "Rina Kusuma", "role": "cashier"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    ''
  )
ON CONFLICT (email) DO NOTHING;
