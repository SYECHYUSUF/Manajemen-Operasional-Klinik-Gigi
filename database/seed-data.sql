-- =========================================================
-- SEED DATA: Dummy Data untuk Tabel-tabel DentalCloud Pro
-- Jalankan di: Supabase Dashboard > SQL Editor > New Query
-- =========================================================

-- 1. Insert Service Categories
INSERT INTO service_categories (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Diagnostik', 'Pemeriksaan dan diagnosis kondisi gigi'),
  ('22222222-2222-2222-2222-222222222222', 'Radiologi', 'Pemeriksaan menggunakan X-ray'),
  ('33333333-3333-3333-3333-333333333333', 'Preventif', 'Perawatan pencegahan kerusakan gigi'),
  ('44444444-4444-4444-4444-444444444444', 'Bedah', 'Tindakan bedah mulut'),
  ('55555555-5555-5555-5555-555555555555', 'Endodontik', 'Perawatan saluran akar'),
  ('66666666-6666-6666-6666-666666666666', 'Ortodonsi', 'Perawatan merapikan gigi')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Services
INSERT INTO services (service_category_id, code, name, description, base_price, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'CNS-001', 'Konsultasi Awal', 'Pemeriksaan rongga mulut secara menyeluruh', 150000, true),
  ('22222222-2222-2222-2222-222222222222', 'RAD-012', 'Rontgen Digital (Full Mouth)', 'Satu set radiografi digital penuh', 250000, true),
  ('33333333-3333-3333-3333-333333333333', 'PRV-005', 'Scaling Profesional', 'Pembersihan karang gigi, plak, dan noda', 300000, true),
  ('44444444-4444-4444-4444-444444444444', 'SUR-009', 'Ekstraksi Gigi Bungsu', 'Pencabutan bedah gigi bungsu yang impaksi', 1500000, false),
  ('55555555-5555-5555-5555-555555555555', 'END-003', 'Perawatan Saluran Akar', 'Perawatan infeksi pulpa gigi', 1200000, true),
  ('66666666-6666-6666-6666-666666666666', 'ORT-001', 'Pemasangan Kawat Gigi (Metal)', 'Pemasangan behel metal standar', 6500000, true)
ON CONFLICT (code) DO NOTHING;

-- 3. Insert Patients
INSERT INTO patients (id, patient_code, full_name, date_of_birth, gender, phone, is_active) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PT-2023001', 'Budi Santoso', '1990-05-15', 'male', '081234567890', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'PT-2023002', 'Siti Rahayu', '1985-11-22', 'female', '081298765432', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'PT-2023003', 'Ahmad Fauzi', '1995-02-10', 'male', '081311223344', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'PT-2023004', 'Dian Sastro', '1992-08-30', 'female', '081555666777', true)
ON CONFLICT (patient_code) DO NOTHING;

-- 4. Insert Invoices
INSERT INTO invoices (id, invoice_number, patient_id, status, subtotal, tax_amount, total_amount) VALUES
  ('11111111-2222-3333-4444-555555555555', 'INV-20231001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'paid', 350000, 0, 350000),
  ('22222222-3333-4444-5555-666666666666', 'INV-20231002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'issued', 1250000, 0, 1250000),
  ('33333333-4444-5555-6666-777777777777', 'INV-20230945', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'paid', 450000, 0, 450000),
  ('44444444-5555-6666-7777-888888888888', 'INV-20230946', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'issued', 6500000, 0, 6500000)
ON CONFLICT (invoice_number) DO NOTHING;

-- 5. Insert Specializations & Doctors
INSERT INTO specializations (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ortodonsi'),
  ('22222222-2222-2222-2222-222222222222', 'Bedah Mulut')
ON CONFLICT DO NOTHING;

INSERT INTO doctors (id, doctor_code, full_name, specialization_id, license_number, consultation_fee, is_active) VALUES
  ('11111111-2222-3333-4444-555555555555', 'DOC-001', 'drg. Sarah Amelia, Sp.Ort', '11111111-1111-1111-1111-111111111111', '123456789', 200000, true),
  ('22222222-3333-4444-5555-666666666666', 'DOC-002', 'drg. Bima Pratama, Sp.BM', '22222222-2222-2222-2222-222222222222', '987654321', 250000, true)
ON CONFLICT DO NOTHING;
