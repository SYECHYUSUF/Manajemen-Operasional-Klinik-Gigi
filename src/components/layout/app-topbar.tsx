"use client";

import { useState } from "react";
import { Bell, Search, Settings, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockNotifications } from "@/lib/mock-data";
import { formatRelative } from "@/lib/utils";
import Link from "next/link";

const NOTIFICATION_TYPE_ICON: Record<string, string> = {
  stock_alert:           "🔴",
  appointment_reminder:  "📅",
  follow_up:             "🔔",
  birthday:              "🎂",
  system:                "⚙️",
};

export function AppTopbar() {
  const [search, setSearch] = useState("");
  const unreadCount = mockNotifications.filter((n) => !n.is_read).length;

  return (
    <header className="fixed top-0 right-0 left-[260px] z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md px-8 shadow-sm shadow-slate-200/40">
      {/* ── Search ── */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pasien, rekam medis, stok..."
          className="pl-9 rounded-full bg-slate-50 border-slate-200 text-sm focus-visible:ring-[#0d5a94] h-9"
        />
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifikasi</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs h-5 px-1.5">
                  {unreadCount} baru
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex items-start gap-3 py-3 cursor-pointer">
                <span className="text-lg leading-none mt-0.5">
                  {NOTIFICATION_TYPE_ICON[notif.type] ?? "🔔"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${!notif.is_read ? "font-semibold" : "font-medium"}`}>
                    {notif.title}
                  </p>
                  {notif.body && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.body}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">{formatRelative(notif.created_at)}</p>
                </div>
                {notif.is_read && <Check className="h-3 w-3 text-slate-300 mt-1 shrink-0" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/notifications" className="justify-center text-xs font-semibold text-[#0d5a94] w-full flex">
                Lihat Semua Notifikasi
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings shortcut */}
        <Link
          href="/settings"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Link>

        {/* Divider */}
        <div className="mx-1 h-7 w-px bg-slate-200" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-2.5 rounded-full py-1 px-2 hover:bg-slate-50 transition-colors group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#0d5a94] leading-none">drg. Sarah Amelia</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Administrator</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-slate-100 group-hover:border-[#9dcaff] transition-colors">
                <AvatarFallback className="bg-[#0d5a94] text-white text-xs font-bold">SA</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-slate-500 font-normal">Masuk sebagai</DropdownMenuLabel>
            <DropdownMenuItem disabled className="font-semibold text-[#0d5a94]">
              drg. Sarah Amelia
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile" className="w-full flex">Profil Saya</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings" className="w-full flex">Pengaturan</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50">
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
