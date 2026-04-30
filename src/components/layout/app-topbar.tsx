"use client";

import { useState } from "react";
import { Bell, Search, Settings, ChevronDown, Check, AlertCircle, CalendarClock, PhoneCall, Cake, ServerCog, X, LogOut, User } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockNotifications } from "@/lib/mock-data";
import { formatRelative } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NOTIFICATION_TYPE_ICON: Record<string, React.ReactNode> = {
  stock_alert:           <AlertCircle className="h-4 w-4 text-red-500" />,
  appointment_reminder:  <CalendarClock className="h-4 w-4 text-blue-500" />,
  follow_up:             <PhoneCall className="h-4 w-4 text-orange-500" />,
  birthday:              <Cake className="h-4 w-4 text-purple-500" />,
  system:                <ServerCog className="h-4 w-4 text-slate-500" />,
};

export function AppTopbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.is_read).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 md:left-[260px] z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md px-4 md:px-8 shadow-sm shadow-slate-200/40">
        {/* ── Search ── */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pasien, rekam medis, stok..."
            className="pl-9 rounded-full bg-slate-50 border-slate-200 text-sm focus-visible:ring-[#0d5a94] h-9"
          />
        </div>

        {/* Mobile Search Button */}
        <button
          className="sm:hidden p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={() => setShowSearch(true)}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors outline-none focus:ring-2 focus:ring-[#0d5a94]">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifikasi</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs h-5 px-1.5">
                      {unreadCount} baru
                    </Badge>
                  )}
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {mockNotifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex items-start gap-3 py-3 cursor-pointer">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mt-0.5">
                    {NOTIFICATION_TYPE_ICON[notif.type] ?? <Bell className="h-4 w-4 text-slate-500" />}
                  </div>
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

          {/* Settings shortcut → App Settings */}
          <Link
            href="/pengaturan"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors hidden sm:flex"
            title="Pengaturan Aplikasi"
          >
            <Settings className="h-5 w-5" />
          </Link>

          {/* Divider */}
          <div className="mx-1 h-7 w-px bg-slate-200 hidden sm:block" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full hover:bg-slate-50 p-1.5 transition-colors outline-none focus:ring-2 focus:ring-[#0d5a94]">
              <Avatar className="h-8 w-8 border border-slate-200">
                <AvatarFallback className="bg-[#0d5a94] text-white text-xs font-semibold">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-bold text-slate-700 leading-none">drg. Sarah Amelia</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Administrator</p>
              </div>
              <ChevronDown className="hidden md:block h-4 w-4 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-slate-500 font-normal">Masuk sebagai</DropdownMenuLabel>
              <DropdownMenuItem disabled className="font-bold text-[#0d5a94] text-sm">
                drg. Sarah Amelia
              </DropdownMenuItem>
            </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                <User className="h-4 w-4 text-slate-400 mr-2" /> Profil Saya
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/pengaturan")}>
                <Settings className="h-4 w-4 text-slate-400 mr-2" /> Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-20 px-4" onClick={() => setShowSearch(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari pasien, rekam medis, stok..."
                  className="pl-9 h-11 rounded-xl border-slate-200"
                />
              </div>
              <button onClick={() => setShowSearch(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            {search && (
              <div className="mt-3 py-2 border-t border-slate-100">
                <p className="text-xs text-slate-400 px-2">Menampilkan hasil untuk "{search}"</p>
                <div className="mt-2 space-y-1">
                  <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700 font-medium">
                    Budi Santoso — Pasien <span className="text-xs text-slate-400 ml-1">P-000001</span>
                  </button>
                  <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700 font-medium">
                    Siti Rahayu — Pasien <span className="text-xs text-slate-400 ml-1">P-000002</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
