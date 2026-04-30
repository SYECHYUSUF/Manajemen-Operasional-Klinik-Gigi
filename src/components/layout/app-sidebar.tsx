"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CalendarDays, FileText,
  Package, Receipt, BarChart3, Settings,
  Stethoscope, LogOut, HelpCircle, CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const NAV_ITEMS = [
  { label: "Dashboard",       href: "/dashboard",       icon: LayoutDashboard },
  { label: "Pasien",          href: "/patients",        icon: Users },
  { label: "Jadwal",          href: "/appointments",    icon: CalendarDays },
  { label: "Rekam Medis",     href: "/medical-records", icon: FileText },
  { label: "Inventaris",      href: "/inventory",       icon: Package },
  { label: "Kasir & Billing", href: "/billing",         icon: Receipt },
  { label: "Laporan",         href: "/reports",         icon: BarChart3 },
  { label: "Pengaturan",      href: "/settings",        icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex h-full w-[260px] flex-col border-r border-slate-100 bg-white">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d5a94] shadow-lg shadow-blue-900/20">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-black text-[#0d5a94] leading-none">DentalCloud</h1>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Clinical Excellence
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "nav-item-active font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0d5a94]"
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-[#0d5a94]" : "text-slate-400")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* ── Footer ── */}
      <div className="border-t border-slate-100 px-3 py-4 space-y-1">
        {/* CTA – New Appointment */}
        <Link
          href="/appointments/new"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#0d5a94] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/15 hover:bg-[#004271] active:scale-[0.98] transition-all duration-150 mb-3"
        >
          <CalendarPlus className="h-4 w-4" />
          Buat Janji Baru
        </Link>

        <Link
          href="/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0d5a94] transition-colors"
        >
          <HelpCircle className="h-[18px] w-[18px] text-slate-400" />
          Bantuan
        </Link>
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          onClick={() => {/* logout handler */}}
        >
          <LogOut className="h-[18px] w-[18px]" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
