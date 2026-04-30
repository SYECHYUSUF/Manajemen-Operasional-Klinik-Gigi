import { AppointmentStatus, InvoiceStatus, PaymentMethod, ToothCondition, UserRole } from "@/types";

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: "Dashboard",       href: "/dashboard",         icon: "LayoutDashboard", roles: ["admin","doctor","cashier"] },
  { label: "Pasien",          href: "/patients",          icon: "Users",           roles: ["admin","doctor","cashier"] },
  { label: "Jadwal",          href: "/appointments",      icon: "CalendarDays",    roles: ["admin","doctor"] },
  { label: "Rekam Medis",     href: "/medical-records",   icon: "FileText",        roles: ["admin","doctor"] },
  { label: "Inventaris",      href: "/inventory",         icon: "Package",         roles: ["admin"] },
  { label: "Kasir & Billing", href: "/billing",           icon: "Receipt",         roles: ["admin","cashier"] },
  { label: "Laporan",         href: "/reports",           icon: "BarChart3",       roles: ["admin"] },
  { label: "Pengaturan",      href: "/settings",          icon: "Settings",        roles: ["admin"] },
] as const;

// ─── Status Labels & Colors ───────────────────────────────────────────────────

export const APPOINTMENT_STATUS_MAP: Record<AppointmentStatus, { label: string; color: string }> = {
  scheduled:   { label: "Terjadwal",     color: "bg-blue-100 text-blue-700" },
  confirmed:   { label: "Dikonfirmasi",  color: "bg-indigo-100 text-indigo-700" },
  checked_in:  { label: "Check-In",      color: "bg-cyan-100 text-cyan-700" },
  in_progress: { label: "Berlangsung",   color: "bg-amber-100 text-amber-700" },
  completed:   { label: "Selesai",       color: "bg-emerald-100 text-emerald-700" },
  cancelled:   { label: "Dibatalkan",    color: "bg-red-100 text-red-700" },
  no_show:     { label: "Tidak Hadir",   color: "bg-gray-100 text-gray-600" },
};

export const INVOICE_STATUS_MAP: Record<InvoiceStatus, { label: string; color: string }> = {
  draft:     { label: "Draft",       color: "bg-gray-100 text-gray-600" },
  issued:    { label: "Diterbitkan", color: "bg-blue-100 text-blue-700" },
  paid:      { label: "Lunas",       color: "bg-emerald-100 text-emerald-700" },
  overdue:   { label: "Jatuh Tempo", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Dibatalkan",  color: "bg-gray-100 text-gray-500" },
};

export const PAYMENT_METHOD_MAP: Record<PaymentMethod, string> = {
  cash:        "Tunai",
  debit_card:  "Kartu Debit",
  credit_card: "Kartu Kredit",
  transfer:    "Transfer Bank",
  insurance:   "Asuransi",
  qris:        "QRIS",
};

export const TOOTH_CONDITION_MAP: Record<ToothCondition, { label: string; color: string }> = {
  healthy:               { label: "Sehat",               color: "#22c55e" },
  caries:                { label: "Karies",               color: "#f97316" },
  filled:                { label: "Tambal",               color: "#3b82f6" },
  missing:               { label: "Tidak Ada",            color: "#6b7280" },
  crown:                 { label: "Mahkota",              color: "#8b5cf6" },
  bridge:                { label: "Bridge",               color: "#a78bfa" },
  implant:               { label: "Implan",               color: "#06b6d4" },
  root_canal:            { label: "PSA",                  color: "#ec4899" },
  extraction_indicated:  { label: "Indikasi Cabut",       color: "#ef4444" },
  impacted:              { label: "Impaksi",              color: "#dc2626" },
  fractured:             { label: "Fraktur",              color: "#b45309" },
  abscess:               { label: "Abses",                color: "#991b1b" },
  other:                 { label: "Lainnya",              color: "#9ca3af" },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin:   "Administrator",
  doctor:  "Dokter",
  patient: "Pasien",
  cashier: "Kasir",
};

// ─── FDI Tooth Numbers ────────────────────────────────────────────────────────

// Upper jaw: 18-11 (R) | 21-28 (L)
// Lower jaw: 48-41 (R) | 31-38 (L)
export const PERMANENT_TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
export const PERMANENT_TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
export const DECIDUOUS_TEETH_UPPER = [55,54,53,52,51,61,62,63,64,65];
export const DECIDUOUS_TEETH_LOWER = [85,84,83,82,81,71,72,73,74,75];
