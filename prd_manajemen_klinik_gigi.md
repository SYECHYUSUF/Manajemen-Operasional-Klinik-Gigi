# Dokumen Desain: Aplikasi Manajemen Operasional Klinik Gigi

## Ringkasan Proyek
Aplikasi berbasis web untuk mengintegrasikan layanan medis, administrasi pasien, dan pengelolaan inventaris klinik gigi secara digital dan terpusat.

## Arsitektur Data (Relasional)
1. **users**: Kredensial untuk Admin, Dokter, dan Pasien.
2. **patients**: Identitas detail pasien (Many-to-One dengan users).
3. **doctors**: Data dokter gigi (Many-to-One dengan users).
4. **services**: Master data layanan (Scaling, Tambal, dll).
5. **appointments**: Core table menghubungkan Pasien, Dokter, dan Layanan.
6. **medical_records**: Riwayat pemeriksaan (One-to-Many dengan appointments).
7. **product_categories**: Kategori (Obat, Alat Medis).
8. **products**: Stok barang (Many-to-One dengan product_categories).

## Rencana Layar (Proposed Screens)
Untuk mencakup seluruh kebutuhan tersebut, saya mengusulkan pembuatan layar berikut:
1. **Dashboard Admin**: Ringkasan operasional, jumlah janji temu hari ini, dan status stok kritis.
2. **Manajemen Pasien**: Daftar pasien, pencarian, dan pendaftaran pasien baru.
3. **Penjadwalan (Appointments)**: Kalender atau list untuk mengelola jadwal pertemuan dokter dan pasien.
4. **Rekam Medis (Medical Records)**: Detail riwayat tindakan dan pemeriksaan untuk setiap pasien.
5. **Inventaris (Products & Categories)**: Pengelolaan stok obat dan alat medis serta kategorisasinya.
6. **Master Data Layanan**: Pengaturan jenis layanan dan tarif klinik.

Apakah Anda setuju dengan rencana layar ini, atau ada bagian spesifik yang ingin Anda prioritaskan terlebih dahulu?