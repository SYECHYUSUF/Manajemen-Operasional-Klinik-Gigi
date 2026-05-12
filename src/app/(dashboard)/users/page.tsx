"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Shield, Clock, Ban, ShieldOff, RefreshCw,
  Search, MoreVertical, UserCheck, UserX, ChevronDown,
  AlertTriangle, X, CheckCircle2, Crown, Stethoscope, Receipt
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/role-context";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "doctor" | "cashier";
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  is_sso_user: boolean;
  login_logs?: LoginLog[];
}

interface LoginLog {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  logged_at: string;
}

const ROLE_CONFIG = {
  admin:   { label: "Admin",  icon: Crown,       color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200" },
  doctor:  { label: "Dokter", icon: Stethoscope,  color: "text-[#0D5A94] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200" },
  cashier: { label: "Kasir",  icon: Receipt,      color: "text-amber-700 bg-amber-50 dark:bg-amber-900/20 border-amber-200" },
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function timeAgo(d: string | null) {
  if (!d) return "Belum pernah";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari lalu`;
}

// ─── Mock data (ganti dengan real Supabase Admin API jika tersedia) ────────
const MOCK_USERS: AppUser[] = [
  { id: "cf317a64-90c0-42da-9d30-5f2e8bd50e58", email: "admin@dentalcloud.id",  full_name: "drg. Sarah Amelia, Sp.Ort", role: "admin",   created_at: "2026-04-30T10:00:00Z", last_sign_in_at: new Date(Date.now() - 5 * 60000).toISOString(), banned_until: null, is_sso_user: false },
  { id: "13fa31bc-0b95-464c-ae3f-aca21a0df5f9", email: "dokter@dentalcloud.id", full_name: "drg. Bima Pratama, Sp.BM", role: "doctor",  created_at: "2026-04-30T10:01:00Z", last_sign_in_at: new Date(Date.now() - 2 * 3600000).toISOString(), banned_until: null, is_sso_user: false },
  { id: "5bac84cc-1fe2-4cc0-9451-414237353b9a", email: "kasir@dentalcloud.id",  full_name: "Rina Kusuma",              role: "cashier", created_at: "2026-04-30T10:02:00Z", last_sign_in_at: new Date(Date.now() - 1 * 3600000).toISOString(), banned_until: null, is_sso_user: false },
];

const MOCK_LOGS: LoginLog[] = [
  { id: "1", user_id: "cf317a64", email: "admin@dentalcloud.id",  name: "drg. Sarah Amelia",  role: "admin",   logged_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: "2", user_id: "5bac84cc", email: "kasir@dentalcloud.id",  name: "Rina Kusuma",         role: "cashier", logged_at: new Date(Date.now() - 65 * 60000).toISOString() },
  { id: "3", user_id: "13fa31bc", email: "dokter@dentalcloud.id", name: "drg. Bima Pratama",  role: "doctor",  logged_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "4", user_id: "cf317a64", email: "admin@dentalcloud.id",  name: "drg. Sarah Amelia",  role: "admin",   logged_at: new Date(Date.now() - 26 * 3600000).toISOString() },
  { id: "5", user_id: "5bac84cc", email: "kasir@dentalcloud.id",  name: "Rina Kusuma",         role: "cashier", logged_at: new Date(Date.now() - 27 * 3600000).toISOString() },
];

// ─── Modals ───────────────────────────────────────────────────────────────────
function EditRoleModal({ user, onClose, onSave }: { user: AppUser; onClose: () => void; onSave: (id: string, role: string) => void }) {
  const [role, setRole] = useState(user.role);
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 md:pl-[276px]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white">Ubah Role Pengguna</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-10 h-10 bg-[#0D5A94] rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {user.full_name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{user.full_name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            {(["admin", "doctor", "cashier"] as const).map(r => {
              const { label, icon: Icon, color } = ROLE_CONFIG[r];
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${role === r ? "border-[#0D5A94] bg-blue-50 dark:bg-blue-900/20" : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:border-slate-700"}`}
                >
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 ${color}`}>
                    <Icon className="h-3.5 w-3.5" />{label}
                  </span>
                  {role === r && <CheckCircle2 className="h-4 w-4 text-[#0D5A94] dark:text-blue-400 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => { onSave(user.id, role); onClose(); }} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold">Simpan Role</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const { isAdmin, isLoading: roleLoading } = useRole();
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS);
  const [logs] = useState<LoginLog[]>(MOCK_LOGS);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [logFilter, setLogFilter] = useState<"today" | "all">("today");

  useEffect(() => {
    if (!roleLoading && !isAdmin) router.replace("/dashboard");
  }, [roleLoading, isAdmin, router]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveRole = (id: string, role: string) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, role: role as any } : u));
    showToast(`Role berhasil diubah menjadi ${ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]?.label}`);
  };

  const handleBan = (id: string) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, banned_until: new Date(Date.now() + 30 * 86400000).toISOString() } : u));
    setOpenMenu(null);
    showToast("Pengguna berhasil di-banned selama 30 hari.", true);
  };

  const handleSuspend = (id: string) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, banned_until: new Date(Date.now() + 86400000).toISOString() } : u));
    setOpenMenu(null);
    showToast("Pengguna di-suspend selama 24 jam.", true);
  };

  const handleUnban = (id: string) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, banned_until: null } : u));
    setOpenMenu(null);
    showToast("Akses pengguna dipulihkan.", true);
  };

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const todayLogs = logs.filter(l => new Date(l.logged_at).toDateString() === new Date().toDateString());
  const displayLogs = logFilter === "today" ? todayLogs : logs;

  const stats = {
    total: users.length,
    active: users.filter(u => !u.banned_until || new Date(u.banned_until) < new Date()).length,
    banned: users.filter(u => u.banned_until && new Date(u.banned_until) > new Date()).length,
    todayLogin: todayLogs.length,
  };

  if (roleLoading) return <div className="flex items-center justify-center h-64 text-slate-400">Memuat...</div>;
  if (!isAdmin) return null;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-7xl mx-auto">
      {editUser && <EditRoleModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSaveRole} />}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-4 text-white ${toast.ok ? "bg-[#0D5A94]" : "bg-red-600"}`}>
          {toast.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span className="text-sm font-semibold">{toast.msg}</span>
          <button onClick={() => setToast(null)}><X className="h-4 w-4 opacity-70" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0D5A94] dark:text-blue-400">Manajemen Pengguna</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola akun, role, dan akses semua pengguna sistem.</p>
        </div>
        <Button onClick={() => showToast("Fitur undang pengguna akan segera hadir.", true)} className="bg-[#0D5A94] hover:bg-[#004271] text-white font-bold gap-2">
          <Users className="h-4 w-4" /> Undang Pengguna
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pengguna", value: stats.total, icon: Users, color: "text-[#0D5A94] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
          { label: "Akun Aktif", value: stats.active, icon: UserCheck, color: "text-emerald-600 bg-emerald-50" },
          { label: "Akun Banned", value: stats.banned, icon: UserX, color: "text-red-600 bg-red-50" },
          { label: "Login Hari Ini", value: stats.todayLogin, icon: Clock, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" },
        ].map((s, i) => (
          <Card key={i} className="border-slate-100 dark:border-slate-800 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-extrabold ${s.color.split(" ")[0]}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* User Table */}
        <div className="xl:col-span-2">
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Daftar Pengguna</h3>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama, email, role..."
                  className="w-full pl-9 pr-4 h-9 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-[#0D5A94]/20"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map(user => {
                const isBanned = user.banned_until && new Date(user.banned_until) > new Date();
                const { label: roleLabel, icon: RoleIcon, color: roleColor } = ROLE_CONFIG[user.role] || ROLE_CONFIG.cashier;
                return (
                  <div key={user.id} className="p-4 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 ${isBanned ? "bg-red-400" : "bg-[#0D5A94]"}`}>
                        {user.full_name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{user.full_name}</p>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 ${roleColor}`}>
                            <RoleIcon className="h-3 w-3" />{roleLabel}
                          </span>
                          {isBanned && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-600 border border-red-200 flex items-center gap-1">
                              <Ban className="h-3 w-3" />BANNED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Login: {timeAgo(user.last_sign_in_at)}</span>
                          <span>Daftar: {fmtDate(user.created_at).split(",")[0]}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="relative shrink-0">
                        <button
                          onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </button>
                        {openMenu === user.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-20 py-1 overflow-hidden">
                            <button onClick={() => { setEditUser(user); setOpenMenu(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800">
                              <Shield className="h-4 w-4 text-[#0D5A94] dark:text-blue-400" /> Ubah Role
                            </button>
                            {isBanned ? (
                              <button onClick={() => handleUnban(user.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50">
                                <UserCheck className="h-4 w-4" /> Pulihkan Akses
                              </button>
                            ) : (
                              <>
                                <button onClick={() => handleSuspend(user.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:bg-amber-900/20">
                                  <ShieldOff className="h-4 w-4" /> Suspend 24 Jam
                                </button>
                                <button onClick={() => handleBan(user.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                                  <Ban className="h-4 w-4" /> Ban 30 Hari
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">Tidak ada pengguna ditemukan.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Login Activity Log */}
        <div>
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Log Aktivitas Login</h3>
              <div className="flex gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-100 dark:border-slate-700">
                {(["today", "all"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${logFilter === f ? "bg-[#0D5A94] text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800"}`}
                  >
                    {f === "today" ? "Hari Ini" : "Semua"}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[480px] overflow-y-auto">
              {displayLogs.map(log => {
                const isToday = new Date(log.logged_at).toDateString() === new Date().toDateString();
                const { color: rc, icon: RIcon } = ROLE_CONFIG[log.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.cashier;
                return (
                  <div key={log.id} className="p-4 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${isToday ? "bg-[#0D5A94]" : "bg-slate-400"}`}>
                        {log.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{log.name}</p>
                        <p className="text-[11px] text-slate-400">{log.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 ml-11">
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border flex items-center gap-1 ${rc}`}>
                        <RIcon className="h-2.5 w-2.5" />{ROLE_CONFIG[log.role as keyof typeof ROLE_CONFIG]?.label || log.role}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.logged_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        {" · "}
                        {isToday ? "Hari ini" : new Date(log.logged_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {displayLogs.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-xs">Belum ada aktivitas login.</div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Close menu on outside click */}
      {openMenu && <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />}
    </div>
  );
}
