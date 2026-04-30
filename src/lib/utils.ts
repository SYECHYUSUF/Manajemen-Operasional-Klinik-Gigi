import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format Rupiah */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Format tanggal Indo: "Senin, 1 Januari 2024" */
export function formatDateLong(date: string | Date): string {
  return format(new Date(date), "EEEE, d MMMM yyyy", { locale: id });
}

/** Format tanggal pendek: "01/01/2024" */
export function formatDateShort(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy");
}

/** Format waktu: "08:30" */
export function formatTime(date: string | Date): string {
  return format(new Date(date), "HH:mm");
}

/** Relative time: "3 menit yang lalu" */
export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { locale: id, addSuffix: true });
}

/** Hitung umur dari tanggal lahir */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Generate kode unik, e.g. P-20240001 */
export function generateCode(prefix: string, sequence: number): string {
  return `${prefix}-${String(sequence).padStart(6, "0")}`;
}

/** Truncate teks panjang */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

/** Inisial nama untuk Avatar */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
