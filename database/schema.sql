-- =============================================================
-- SKEMA DATABASE: Manajemen Operasional Klinik Gigi
-- Kompatibel dengan Supabase / PostgreSQL
-- Versi: 1.0.0
-- =============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- ENUM TYPES
-- =============================================================

CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'patient', 'cashier');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'debit_card', 'credit_card', 'transfer', 'insurance', 'qris');
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'overdue', 'cancelled');
CREATE TYPE notification_type AS ENUM ('appointment_reminder', 'follow_up', 'birthday', 'stock_alert', 'system');
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE');
CREATE TYPE tooth_surface AS ENUM ('mesial', 'distal', 'buccal', 'lingual', 'occlusal', 'incisal');
CREATE TYPE tooth_condition AS ENUM (
  'healthy', 'caries', 'filled', 'missing', 'crown', 'bridge',
  'implant', 'root_canal', 'extraction_indicated', 'impacted',
  'fractured', 'abscess', 'other'
);

-- =============================================================
-- 1. USERS (RBAC Core)
-- =============================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'patient',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- =============================================================
-- 2. ROLES & PERMISSIONS (RBAC Detail)
-- =============================================================

CREATE TABLE permissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource    VARCHAR(100) NOT NULL,  -- e.g. 'medical_records', 'invoices'
  action      VARCHAR(50)  NOT NULL,  -- e.g. 'read', 'write', 'delete'
  description TEXT,
  UNIQUE (resource, action)
);

CREATE TABLE role_permissions (
  role        user_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- =============================================================
-- 3. PATIENTS
-- =============================================================

CREATE TABLE patients (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  patient_code     VARCHAR(20) UNIQUE NOT NULL,  -- e.g. 'P-20240001'
  full_name        VARCHAR(255) NOT NULL,
  date_of_birth    DATE NOT NULL,
  gender           gender_type NOT NULL,
  blood_type       VARCHAR(5),
  nik              VARCHAR(20) UNIQUE,            -- Nomor Induk Kependudukan
  phone            VARCHAR(20),
  email            VARCHAR(255),
  address          TEXT,
  emergency_contact_name  VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  allergy_notes    TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  registered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patients_user_id      ON patients(user_id);
CREATE INDEX idx_patients_patient_code ON patients(patient_code);
CREATE INDEX idx_patients_full_name    ON patients(full_name);

-- =============================================================
-- 4. DOCTORS
-- =============================================================

CREATE TABLE specializations (
  id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL  -- e.g. 'Orthodontics', 'Periodontics'
);

CREATE TABLE doctors (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  doctor_code      VARCHAR(20) UNIQUE NOT NULL,   -- e.g. 'D-001'
  full_name        VARCHAR(255) NOT NULL,
  specialization_id UUID REFERENCES specializations(id),
  license_number   VARCHAR(100) UNIQUE NOT NULL,  -- SIP/STR Number
  phone            VARCHAR(20),
  email            VARCHAR(255),
  consultation_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE doctor_schedules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id   UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  slot_minutes SMALLINT NOT NULL DEFAULT 30,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- =============================================================
-- 5. SERVICES (Master Data Layanan)
-- =============================================================

CREATE TABLE service_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE services (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_category_id UUID REFERENCES service_categories(id),
  code                VARCHAR(50) UNIQUE NOT NULL,
  name                VARCHAR(255) NOT NULL,
  description         TEXT,
  base_price          NUMERIC(12,2) NOT NULL DEFAULT 0,
  duration_minutes    SMALLINT NOT NULL DEFAULT 30,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 6. APPOINTMENTS
-- =============================================================

CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_code VARCHAR(30) UNIQUE NOT NULL,   -- e.g. 'APT-20240501-001'
  patient_id      UUID NOT NULL REFERENCES patients(id),
  doctor_id       UUID NOT NULL REFERENCES doctors(id),
  service_id      UUID REFERENCES services(id),
  scheduled_at    TIMESTAMPTZ NOT NULL,
  end_at          TIMESTAMPTZ,
  status          appointment_status NOT NULL DEFAULT 'scheduled',
  chief_complaint TEXT,
  notes           TEXT,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient_id   ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id    ON appointments(doctor_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status       ON appointments(status);

-- =============================================================
-- 7. MEDICAL RECORDS
-- =============================================================

CREATE TABLE medical_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id  UUID UNIQUE NOT NULL REFERENCES appointments(id),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  doctor_id       UUID NOT NULL REFERENCES doctors(id),
  subjective      TEXT,   -- Keluhan pasien (S-O-A-P)
  objective       TEXT,   -- Pemeriksaan fisik
  assessment      TEXT,   -- Diagnosa
  plan            TEXT,   -- Rencana tindakan
  vital_signs     JSONB,  -- { "blood_pressure": "120/80", "pulse": 80 }
  attachments     JSONB,  -- Array of file URLs
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medical_records_patient_id     ON medical_records(patient_id);
CREATE INDEX idx_medical_records_appointment_id ON medical_records(appointment_id);

-- =============================================================
-- 8. ODONTOGRAM (32 Gigi per Pasien)
-- =============================================================

CREATE TABLE odontograms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE odontogram_teeth (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  odontogram_id  UUID NOT NULL REFERENCES odontograms(id) ON DELETE CASCADE,
  tooth_number   SMALLINT NOT NULL CHECK (tooth_number BETWEEN 11 AND 85),
  -- FDI Notation: 11-18, 21-28, 31-38, 41-48 (permanent), 51-55, 61-65, 71-75, 81-85 (deciduous)
  condition      tooth_condition NOT NULL DEFAULT 'healthy',
  surfaces       tooth_surface[],              -- affected surfaces
  notes          TEXT,
  treatment_done TEXT,
  UNIQUE (odontogram_id, tooth_number)
);

CREATE INDEX idx_odontogram_patient_id ON odontograms(patient_id);

-- =============================================================
-- 9. PRODUCT CATEGORIES & PRODUCTS (Inventaris)
-- =============================================================

CREATE TABLE product_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_category_id UUID REFERENCES product_categories(id),
  code                VARCHAR(50) UNIQUE NOT NULL,
  name                VARCHAR(255) NOT NULL,
  description         TEXT,
  unit                VARCHAR(30) NOT NULL DEFAULT 'pcs',
  purchase_price      NUMERIC(12,2) NOT NULL DEFAULT 0,
  selling_price       NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock_quantity      INTEGER NOT NULL DEFAULT 0,
  minimum_stock       INTEGER NOT NULL DEFAULT 5,
  is_prescription     BOOLEAN NOT NULL DEFAULT false,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(product_category_id);
CREATE INDEX idx_products_stock    ON products(stock_quantity) WHERE stock_quantity <= minimum_stock;

CREATE TABLE stock_movements (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID NOT NULL REFERENCES products(id),
  type         VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity     INTEGER NOT NULL,
  reference_id UUID,        -- e.g. prescription_id or purchase_order_id
  notes        TEXT,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- 10. PRESCRIPTIONS (Resep Obat)
-- =============================================================

CREATE TABLE prescriptions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_code VARCHAR(30) UNIQUE NOT NULL,
  medical_record_id UUID NOT NULL REFERENCES medical_records(id),
  patient_id        UUID NOT NULL REFERENCES patients(id),
  doctor_id         UUID NOT NULL REFERENCES doctors(id),
  prescribed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dispensed_at      TIMESTAMPTZ,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE prescription_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id  UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  product_id       UUID NOT NULL REFERENCES products(id),
  quantity         INTEGER NOT NULL CHECK (quantity > 0),
  dosage           VARCHAR(100),    -- e.g. '3x1 tablet sesudah makan'
  duration_days    SMALLINT,
  notes            TEXT
);

-- =============================================================
-- 11. INVOICES & PAYMENTS (Kasir/Billing)
-- =============================================================

CREATE TABLE invoices (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number   VARCHAR(30) UNIQUE NOT NULL,    -- e.g. 'INV-20240501-001'
  appointment_id   UUID REFERENCES appointments(id),
  patient_id       UUID NOT NULL REFERENCES patients(id),
  issued_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at           TIMESTAMPTZ,
  status           invoice_status NOT NULL DEFAULT 'draft',
  subtotal         NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes            TEXT,
  created_by       UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id   UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_type    VARCHAR(20) NOT NULL CHECK (item_type IN ('service', 'product')),
  service_id   UUID REFERENCES services(id),
  product_id   UUID REFERENCES products(id),
  description  VARCHAR(255) NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  unit_price   NUMERIC(12,2) NOT NULL,
  subtotal     NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id     UUID NOT NULL REFERENCES invoices(id),
  payment_number VARCHAR(30) UNIQUE NOT NULL,
  amount         NUMERIC(12,2) NOT NULL,
  method         payment_method NOT NULL,
  status         payment_status NOT NULL DEFAULT 'pending',
  reference_code VARCHAR(100),   -- No. transaksi eksternal
  paid_at        TIMESTAMPTZ,
  notes          TEXT,
  created_by     UUID REFERENCES users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_patient_id ON invoices(patient_id);
CREATE INDEX idx_invoices_status     ON invoices(status);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);

-- =============================================================
-- 12. NOTIFICATIONS
-- =============================================================

CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         notification_type NOT NULL,
  title        VARCHAR(255) NOT NULL,
  body         TEXT,
  data         JSONB,             -- arbitrary payload (appointment_id, etc.)
  is_read      BOOLEAN NOT NULL DEFAULT false,
  scheduled_at TIMESTAMPTZ,
  sent_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread  ON notifications(user_id) WHERE is_read = false;

-- =============================================================
-- 13. AUDIT TRAIL
-- =============================================================

CREATE TABLE audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  table_name  VARCHAR(100) NOT NULL,
  record_id   UUID,
  action      audit_action NOT NULL,
  old_data    JSONB,
  new_data    JSONB,
  changed_by  UUID REFERENCES users(id),
  ip_address  INET,
  user_agent  TEXT,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_changed_by   ON audit_logs(changed_by);
CREATE INDEX idx_audit_logs_changed_at   ON audit_logs(changed_at);

-- =============================================================
-- TRIGGER: Auto-update updated_at
-- =============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','patients','doctors','services','appointments',
    'medical_records','odontograms','products','invoices','prescriptions'
  ] LOOP
    EXECUTE format('
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
    ', t);
  END LOOP;
END;
$$;

-- =============================================================
-- TRIGGER: Audit Trail untuk tabel sensitif
-- =============================================================

CREATE OR REPLACE FUNCTION trigger_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  _action audit_action;
  _old    JSONB := NULL;
  _new    JSONB := NULL;
BEGIN
  IF    TG_OP = 'INSERT' THEN _action := 'INSERT'; _new := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN _action := 'UPDATE'; _old := to_jsonb(OLD); _new := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN _action := 'DELETE'; _old := to_jsonb(OLD);
  END IF;

  INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
  VALUES (
    TG_TABLE_NAME,
    COALESCE((NEW).id::UUID, (OLD).id::UUID),
    _action, _old, _new,
    NULLIF(current_setting('app.current_user_id', true), '')::UUID
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'medical_records','odontogram_teeth','prescriptions',
    'prescription_items','invoices','payments','stock_movements'
  ] LOOP
    EXECUTE format('
      CREATE TRIGGER audit_%I
      AFTER INSERT OR UPDATE OR DELETE ON %I
      FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();
    ', t, t);
  END LOOP;
END;
$$;

-- =============================================================
-- TRIGGER: Kurangi stok otomatis saat prescription_items dibuat
-- =============================================================

CREATE OR REPLACE FUNCTION trigger_deduct_stock_on_prescription()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;

  INSERT INTO stock_movements (product_id, type, quantity, reference_id, notes)
  VALUES (NEW.product_id, 'out', NEW.quantity, NEW.prescription_id, 'Prescription dispensed');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deduct_stock_on_prescription
AFTER INSERT ON prescription_items
FOR EACH ROW EXECUTE FUNCTION trigger_deduct_stock_on_prescription();

-- =============================================================
-- TRIGGER: Hitung total invoice otomatis
-- =============================================================

CREATE OR REPLACE FUNCTION trigger_recalculate_invoice()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices
  SET subtotal = (
    SELECT COALESCE(SUM(subtotal), 0) FROM invoice_items WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
  ),
  total_amount = subtotal - discount_amount + tax_amount
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_invoice
AFTER INSERT OR UPDATE OR DELETE ON invoice_items
FOR EACH ROW EXECUTE FUNCTION trigger_recalculate_invoice();

-- =============================================================
-- ROW LEVEL SECURITY (Supabase RLS)
-- =============================================================

ALTER TABLE patients         ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE odontograms      ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY admin_all ON patients        FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all ON medical_records FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all ON odontograms     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all ON invoices        FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY admin_all ON notifications   FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Doctor: akses rekam medis & odontogram pasien mereka
CREATE POLICY doctor_medical_records ON medical_records
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'doctor'
    AND doctor_id = (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY doctor_odontograms ON odontograms
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('doctor', 'admin'));

-- Patient: hanya lihat data sendiri
CREATE POLICY patient_own_data ON patients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY patient_own_records ON medical_records
  FOR SELECT USING (
    patient_id = (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY patient_own_notifications ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Cashier: akses invoices & payments
CREATE POLICY cashier_invoices ON invoices
  FOR ALL USING (auth.jwt() ->> 'role' IN ('cashier', 'admin'));

-- =============================================================
-- SEED DATA AWAL
-- =============================================================

-- Service categories
INSERT INTO service_categories (name, description) VALUES
  ('Pemeriksaan Umum',  'General dental examination'),
  ('Konservasi Gigi',   'Fillings, root canals'),
  ('Bedah Mulut',       'Extractions, implants'),
  ('Ortodonti',         'Braces, retainers'),
  ('Periodonsi',        'Gum treatments'),
  ('Prostodonsi',       'Crowns, bridges, dentures'),
  ('Estetika',          'Bleaching, veneers');

-- Services
INSERT INTO services (service_category_id, code, name, base_price, duration_minutes) VALUES
  ((SELECT id FROM service_categories WHERE name='Pemeriksaan Umum'), 'SVC-001', 'Pemeriksaan & Konsultasi', 150000, 30),
  ((SELECT id FROM service_categories WHERE name='Konservasi Gigi'),  'SVC-002', 'Tambal Gigi Komposit',     350000, 60),
  ((SELECT id FROM service_categories WHERE name='Konservasi Gigi'),  'SVC-003', 'Perawatan Saluran Akar',   800000, 90),
  ((SELECT id FROM service_categories WHERE name='Bedah Mulut'),      'SVC-004', 'Pencabutan Gigi Susu',     150000, 30),
  ((SELECT id FROM service_categories WHERE name='Bedah Mulut'),      'SVC-005', 'Pencabutan Gigi Permanen', 250000, 45),
  ((SELECT id FROM service_categories WHERE name='Periodonsi'),       'SVC-006', 'Scaling & Polishing',      300000, 60),
  ((SELECT id FROM service_categories WHERE name='Estetika'),         'SVC-007', 'Bleaching Gigi',           800000, 90),
  ((SELECT id FROM service_categories WHERE name='Ortodonti'),        'SVC-008', 'Pemasangan Behel',        3000000, 120);

-- Product categories
INSERT INTO product_categories (name, description) VALUES
  ('Obat-obatan',    'Obat dan suplemen untuk pasien'),
  ('Alat Medis',     'Instrumen dan alat perawatan gigi'),
  ('Bahan Habis Pakai', 'Cotton roll, gloves, masker, dll'),
  ('Anestesi',       'Bahan anestesi lokal');

-- Permissions
INSERT INTO permissions (resource, action, description) VALUES
  ('patients',        'read',   'Lihat data pasien'),
  ('patients',        'write',  'Tambah/edit data pasien'),
  ('patients',        'delete', 'Hapus data pasien'),
  ('medical_records', 'read',   'Lihat rekam medis'),
  ('medical_records', 'write',  'Tulis rekam medis'),
  ('odontograms',     'read',   'Lihat odontogram'),
  ('odontograms',     'write',  'Edit odontogram'),
  ('invoices',        'read',   'Lihat tagihan'),
  ('invoices',        'write',  'Buat/edit tagihan'),
  ('payments',        'write',  'Proses pembayaran'),
  ('products',        'read',   'Lihat inventaris'),
  ('products',        'write',  'Kelola inventaris'),
  ('users',           'manage', 'Manajemen pengguna & peran'),
  ('reports',         'read',   'Lihat laporan');

-- Role-permission mappings
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions;  -- Admin gets all

INSERT INTO role_permissions (role, permission_id)
SELECT 'doctor', id FROM permissions
WHERE (resource, action) IN (
  ('patients','read'), ('medical_records','read'), ('medical_records','write'),
  ('odontograms','read'), ('odontograms','write'), ('invoices','read')
);

INSERT INTO role_permissions (role, permission_id)
SELECT 'cashier', id FROM permissions
WHERE (resource, action) IN (
  ('patients','read'), ('invoices','read'), ('invoices','write'),
  ('payments','write'), ('reports','read')
);

INSERT INTO role_permissions (role, permission_id)
SELECT 'patient', id FROM permissions
WHERE (resource, action) IN (
  ('patients','read'), ('medical_records','read'), ('invoices','read')
);
