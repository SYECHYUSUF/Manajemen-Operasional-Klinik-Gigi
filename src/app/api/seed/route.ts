import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Gunakan service role key (server-side only, tidak terekspos ke client)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const DEMO_USERS = [
  {
    email: 'admin@dentalcloud.id',
    password: 'Admin@1234',
    user_metadata: { full_name: 'drg. Sarah Amelia, Sp.Ort', role: 'admin' },
  },
  {
    email: 'dokter@dentalcloud.id',
    password: 'Dokter@1234',
    user_metadata: { full_name: 'drg. Bima Pratama, Sp.BM', role: 'doctor' },
  },
  {
    email: 'kasir@dentalcloud.id',
    password: 'Kasir@1234',
    user_metadata: { full_name: 'Rina Kusuma', role: 'cashier' },
  },
];

export async function GET() {
  // Guard: hanya bisa diakses jika service role key ada
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY belum diset di .env.local' },
      { status: 500 }
    );
  }

  const results: { email: string; status: string; error?: string }[] = [];

  for (const user of DEMO_USERS) {
    // Cek apakah user sudah ada
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
    const alreadyExists = existing?.users?.find((u) => u.email === user.email);

    if (alreadyExists) {
      // Update password & metadata jika sudah ada (fix akun corrupt)
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
        alreadyExists.id,
        {
          password: user.password,
          user_metadata: user.user_metadata,
          email_confirm: true,
        }
      );
      results.push({
        email: user.email,
        status: updateErr ? 'update_failed' : 'updated',
        error: updateErr?.message,
      });
    } else {
      // Buat user baru via Admin API
      const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: user.user_metadata,
        email_confirm: true, // langsung terverifikasi, tidak perlu email konfirmasi
      });
      results.push({
        email: user.email,
        status: createErr ? 'create_failed' : 'created',
        error: createErr?.message,
      });
    }
  }

  const hasErrors = results.some((r) => r.status.includes('failed'));

  return NextResponse.json({
    success: !hasErrors,
    message: hasErrors
      ? 'Beberapa akun gagal dibuat. Lihat detail di bawah.'
      : '✅ Semua akun demo berhasil dibuat/diperbarui!',
    results,
    accounts: DEMO_USERS.map((u) => ({
      email: u.email,
      password: u.password,
      role: u.user_metadata.role,
    })),
  });
}
