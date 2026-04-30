import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di .env.local" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const accounts = [
    {
      email: "admin@dentalcloud.id",
      password: "Admin@1234",
      full_name: "drg. Sarah Amelia, Sp.Ort",
      role: "admin",
    },
    {
      email: "dokter@dentalcloud.id",
      password: "Dokter@1234",
      full_name: "drg. Bima Pratama, Sp.BM",
      role: "doctor",
    },
    {
      email: "kasir@dentalcloud.id",
      password: "Kasir@1234",
      full_name: "Rina Kusuma",
      role: "cashier",
    },
  ];

  const results = [];

  for (const account of accounts) {
    const { data, error } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          full_name: account.full_name,
          role: account.role,
        },
      },
    });

    results.push({
      email: account.email,
      password: account.password,
      status: error ? "❌ Gagal" : "✅ Berhasil",
      error: error?.message ?? null,
      userId: data?.user?.id ?? null,
    });
  }

  return NextResponse.json(
    {
      message: "Seeder selesai dijalankan!",
      note: "Cek email konfirmasi jika Supabase Email Confirmation aktif. Atau disable di Supabase > Auth > Settings > Email Confirmations.",
      accounts: results,
    },
    { status: 200 }
  );
}
