# 🦷 DentalCloud Pro - Sistem Manajemen Klinik Gigi

DentalCloud Pro adalah aplikasi manajemen klinik gigi modern berbasis web yang dibangun dengan Next.js dan Supabase. Sistem ini dilengkapi dengan Role-Based Access Control (RBAC), modul keuangan (billing), rekam medis, penjadwalan, dan inventaris.

## 👥 Tugas Kelompok
Proyek ini diajukan untuk memenuhi tugas matakuliah **Pemrograman Web Lanjutan**.

**Kelompok 12**
- MOCH SYECH YUSUF M
- AKHMAD HIDYAT
- MUHAMMAD FADHIL MULYADI

---

## 🛠️ Teknologi yang Digunakan
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI
- **Backend/Database:** Supabase (PostgreSQL, Authentication)
- **Icons:** Lucide React
- **Theming:** next-themes (Dark/Light mode)

## 🔑 Fitur Utama
1. **Role-Based Access Control (RBAC)**
   - **Admin:** Akses penuh ke dasbor, laporan keuangan, manajemen pengguna (CRUD, Ban, Suspend), dan master data.
   - **Dokter:** Akses khusus ke jadwal, rekam medis pasien (resep, riwayat), dan inventaris klinis.
   - **Kasir:** Akses khusus ke modul penagihan (billing) dan invoice.

2. **Manajemen Pasien & Rekam Medis**
   - Pendaftaran pasien baru.
   - Pencatatan rekam medis terpadu (diagnosa, resep obat, jadwal selanjutnya).

3. **Manajemen Jadwal**
   - Tampilan kalender interaktif (Hari/Minggu/Bulan).
   - Penambahan janji temu dan konfirmasi kehadiran.

4. **Keuangan & Kasir**
   - Pembuatan tagihan (invoice) otomatis.
   - Cetak struk pembayaran.

5. **Laporan & Dasbor**
   - Grafik pendapatan dan statistik harian.

## 🚀 Cara Menjalankan Aplikasi Lokal

1. **Clone repository ini**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   Buat file `.env.local` di root folder dan masukkan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

5. **Buka di Browser:**
   Akses `http://localhost:3000`

## 👤 Akun Demo
- **Admin:** `admin@dentalcloud.id` (Pass: `Admin@1234`)
- **Dokter:** `dokter@dentalcloud.id` (Pass: `Dokter@1234`)
- **Kasir:** `kasir@dentalcloud.id` (Pass: `Kasir@1234`)
