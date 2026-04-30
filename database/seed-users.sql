-- =========================================================
-- FIX: Hapus & buat ulang semua akun demo dengan benar
-- Jalankan di: Supabase Dashboard > SQL Editor
-- =========================================================

-- LANGKAH 1: Hapus akun lama yang mungkin corrupt
DELETE FROM auth.identities WHERE user_id IN (
  'a1111111-1111-1111-1111-111111111111',
  'd2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333'
);
DELETE FROM auth.sessions WHERE user_id IN (
  'a1111111-1111-1111-1111-111111111111',
  'd2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333'
);
DELETE FROM auth.users WHERE id IN (
  'a1111111-1111-1111-1111-111111111111',
  'd2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333'
);

-- Juga hapus berdasarkan email (untuk akun yang dibuat manual dengan ID berbeda)
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'admin@dentalcloud.id', 'dokter@dentalcloud.id', 'kasir@dentalcloud.id'
  )
);
DELETE FROM auth.sessions WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'admin@dentalcloud.id', 'dokter@dentalcloud.id', 'kasir@dentalcloud.id'
  )
);
DELETE FROM auth.users WHERE email IN (
  'admin@dentalcloud.id', 'dokter@dentalcloud.id', 'kasir@dentalcloud.id'
);

-- LANGKAH 2: Aktifkan extension yang dibutuhkan
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- LANGKAH 3: Insert ulang semua akun dengan lengkap
-- ── ADMIN ──────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token,
  is_sso_user, deleted_at
) VALUES (
  'a1111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'admin@dentalcloud.id',
  crypt('Admin@1234', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "drg. Sarah Amelia, Sp.Ort", "role": "admin"}'::jsonb,
  NOW(), NOW(), '', '', false, null
);

INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  '{"sub": "a1111111-1111-1111-1111-111111111111", "email": "admin@dentalcloud.id", "email_verified": true}'::jsonb,
  'email', NOW(), NOW(), NOW()
);

-- ── DOKTER ─────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token,
  is_sso_user, deleted_at
) VALUES (
  'd2222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'dokter@dentalcloud.id',
  crypt('Dokter@1234', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "drg. Bima Pratama, Sp.BM", "role": "doctor"}'::jsonb,
  NOW(), NOW(), '', '', false, null
);

INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'd2222222-2222-2222-2222-222222222222',
  'd2222222-2222-2222-2222-222222222222',
  'd2222222-2222-2222-2222-222222222222',
  '{"sub": "d2222222-2222-2222-2222-222222222222", "email": "dokter@dentalcloud.id", "email_verified": true}'::jsonb,
  'email', NOW(), NOW(), NOW()
);

-- ── KASIR ──────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token,
  is_sso_user, deleted_at
) VALUES (
  'c3333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'kasir@dentalcloud.id',
  crypt('Kasir@1234', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "Rina Kusuma", "role": "cashier"}'::jsonb,
  NOW(), NOW(), '', '', false, null
);

INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'c3333333-3333-3333-3333-333333333333',
  'c3333333-3333-3333-3333-333333333333',
  'c3333333-3333-3333-3333-333333333333',
  '{"sub": "c3333333-3333-3333-3333-333333333333", "email": "kasir@dentalcloud.id", "email_verified": true}'::jsonb,
  'email', NOW(), NOW(), NOW()
);

-- Verifikasi hasil
SELECT id, email, raw_user_meta_data->>'role' as role, email_confirmed_at
FROM auth.users
WHERE email IN ('admin@dentalcloud.id', 'dokter@dentalcloud.id', 'kasir@dentalcloud.id')
ORDER BY email;
