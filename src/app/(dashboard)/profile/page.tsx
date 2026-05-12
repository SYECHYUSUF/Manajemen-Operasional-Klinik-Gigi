"use client";

import { useState, useRef, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, Shield, Camera, Bell, Lock,
  Stethoscope, Award, Save, Loader2, ImageIcon, X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/contexts/role-context";

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin:   { label: "Administrator", color: "text-[#006b57] dark:text-green-400 bg-[#76f9d6]/20 border-[#76f9d6]/40" },
  doctor:  { label: "Dokter",        color: "text-[#0D5A94] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200" },
  cashier: { label: "Kasir",         color: "text-amber-700 bg-amber-50 dark:bg-amber-900/20 border-amber-200" },
};

export default function ProfilePage() {
  const { role } = useRole();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

  // Avatar & banner
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerColor, setBannerColor] = useState("#0D5A94");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Notification toggles
  const [notifState, setNotifState] = useState([true, true, false, true]);

  // Password
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "", specialization: "", licenseNumber: "", bio: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const meta = data.user.user_metadata || {};
      setForm({
        fullName: meta.full_name || "",
        email: data.user.email || "",
        phone: meta.phone || "",
        address: meta.address || "",
        specialization: meta.specialization || "",
        licenseNumber: meta.license_number || "",
        bio: meta.bio || "",
      });
      if (meta.avatar_url) setAvatarUrl(meta.avatar_url);
      if (meta.banner_color) setBannerColor(meta.banner_color);
      if (meta.banner_url) setBannerPreview(meta.banner_url);
    });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBannerPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await supabase.auth.updateUser({
      data: {
        full_name: form.fullName,
        phone: form.phone,
        address: form.address,
        specialization: form.specialization,
        license_number: form.licenseNumber,
        bio: form.bio,
        avatar_url: avatarUrl,
        banner_color: bannerColor,
        banner_url: bannerPreview,
      },
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleUpdatePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      setPwMsg({ ok: false, text: "Password baru tidak cocok!" });
      return;
    }
    if (passwords.newPass.length < 8) {
      setPwMsg({ ok: false, text: "Password minimal 8 karakter." });
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass });
    setPwSaving(false);
    if (error) {
      setPwMsg({ ok: false, text: error.message });
    } else {
      setPwMsg({ ok: true, text: "✓ Password berhasil diperbarui!" });
      setPasswords({ current: "", newPass: "", confirm: "" });
    }
  };

  const initials = form.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
  const roleInfo = ROLE_LABELS[role || "cashier"] || ROLE_LABELS.cashier;

  const BANNER_COLORS = ["#0D5A94","#004271","#006b57","#7c3aed","#be185d","#b45309","#1e293b"];

  const tabs = [
    { id: "profile" as const, label: "Profil", icon: User },
    { id: "security" as const, label: "Keamanan", icon: Shield },
    { id: "notifications" as const, label: "Notifikasi", icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 max-w-5xl mx-auto">

      {/* ── Banner ── */}
      <div className="relative h-44 rounded-2xl overflow-hidden shadow-xl shadow-blue-900/20 group">
        {bannerPreview
          ? <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
          : <div className="w-full h-full transition-colors duration-300" style={{ background: `linear-gradient(135deg, ${bannerColor}, ${bannerColor}cc)` }}>
              <div className="absolute top-4 right-16 w-40 h-40 rounded-full bg-white dark:bg-slate-900/10 blur-3xl" />
              <div className="absolute bottom-0 left-24 w-56 h-28 rounded-full bg-white dark:bg-slate-900/5 blur-3xl" />
            </div>
        }
        {/* Banner edit button */}
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
        >
          <ImageIcon className="h-3.5 w-3.5" /> Ganti Banner
        </button>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />

        {/* Color picker strip */}
        {!bannerPreview && (
          <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {BANNER_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setBannerColor(c)}
                title={c}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${bannerColor === c ? "border-white scale-110" : "border-white/30"}`}
                style={{ background: c }}
              />
            ))}
            {bannerPreview && (
              <button onClick={() => setBannerPreview(null)} className="w-6 h-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                <X className="h-3 w-3 text-white" />
              </button>
            )}
          </div>
        )}
        {bannerPreview && (
          <button
            onClick={() => setBannerPreview(null)}
            className="absolute bottom-4 right-4 bg-red-500/80 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Hapus Foto
          </button>
        )}
      </div>

      {/* ── Avatar Row ── */}
      <div className="relative -mt-14 px-6 flex flex-col sm:flex-row items-start sm:items-end gap-5">
        <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
          <div className="h-24 w-24 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden bg-[#0d5a94] flex items-center justify-center">
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-white text-2xl font-black">{initials}</span>
            }
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0d5a94] flex items-center justify-center shadow-lg border-2 border-white">
            <Camera className="h-3 w-3 text-white" />
          </div>
        </div>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

        <div className="flex-1 pb-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{form.fullName || "Nama Pengguna"}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {form.specialization && (
              <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Stethoscope className="h-3.5 w-3.5 text-[#0d5a94]" /> {form.specialization}
              </span>
            )}
            {form.licenseNumber && (
              <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Award className="h-3.5 w-3.5 text-amber-500" /> {form.licenseNumber}
              </span>
            )}
          </div>
        </div>
        <div className="sm:pb-1">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${roleInfo.color}`}>
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
              activeTab === id
                ? "bg-white dark:bg-slate-900 text-[#0d5a94] shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-300"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 dark:border dark:border-slate-800">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-4">Informasi Pribadi</h3>
                {saveSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-xl text-center font-semibold">✓ Profil berhasil disimpan!</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Nama Lengkap", key: "fullName", icon: User, type: "text" },
                    { label: "Spesialisasi", key: "specialization", icon: Stethoscope, type: "text" },
                  ].map(({ label, key, icon: Icon, type }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <input
                          type={type}
                          value={(form as any)[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                      type="email"
                      value={form.email}
                      disabled
                      className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm cursor-not-allowed opacity-70"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Email tidak dapat diubah langsung. Hubungi administrator.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "No. Telepon", key: "phone", icon: Phone },
                    { label: "No. SIP / Lisensi", key: "licenseNumber", icon: Award },
                  ].map(({ label, key, icon: Icon }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <input
                          type="text"
                          value={(form as any)[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alamat</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                    <input
                      type="text"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bio</label>
                  <textarea
                    value={form.bio}
                    rows={3}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-[#0d5a94] hover:bg-[#004271] text-white font-bold px-8 gap-2 shadow-md shadow-blue-900/20">
                    {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="h-4 w-4" /> Simpan Perubahan</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side */}
          <div className="space-y-5">
            <Card className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 dark:border dark:border-slate-800">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Statistik Aktivitas</h3>
                <div className="space-y-4">
                  {[
                    { label: "Pasien Ditangani", value: "248", color: "text-[#0d5a94]" },
                    { label: "Janji Temu Bulan Ini", value: "32", color: "text-[#006b57] dark:text-green-400" },
                    { label: "Rekam Medis Diupdate", value: "19", color: "text-purple-600 dark:text-purple-400" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-800 last:border-0">
                      <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
                      <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 dark:border dark:border-slate-800">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Warna Banner</h3>
                <div className="flex flex-wrap gap-2">
                  {BANNER_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => { setBannerColor(c); setBannerPreview(null); }}
                      className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${bannerColor === c && !bannerPreview ? "border-[#0d5a94] scale-110 ring-2 ring-[#0d5a94]/30" : "border-slate-200 dark:border-slate-700"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-3">Atau upload foto banner di bagian atas profil</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── Security Tab ── */}
      {activeTab === "security" && (
        <Card className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardContent className="p-6 space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-4">Ubah Password</h3>
            {pwMsg && (
              <div className={`text-sm px-4 py-2.5 rounded-xl text-center font-semibold ${pwMsg.ok ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                {pwMsg.text}
              </div>
            )}
            {[
              { label: "Password Saat Ini", key: "current" },
              { label: "Password Baru", key: "newPass" },
              { label: "Konfirmasi Password Baru", key: "confirm" },
            ].map(field => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={(passwords as any)[field.key]}
                    onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 transition-all"
                  />
                </div>
              </div>
            ))}
            <Button onClick={handleUpdatePassword} disabled={pwSaving} className="bg-[#0d5a94] hover:bg-[#004271] text-white font-bold gap-2 shadow-md shadow-blue-900/20">
              <Shield className="h-4 w-4" />{pwSaving ? "Memperbarui..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Notifications Tab ── */}
      {activeTab === "notifications" && (
        <Card className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-4">Preferensi Notifikasi</h3>
            {[
              { label: "Pengingat Janji Temu", desc: "Notifikasi 1 jam sebelum jadwal" },
              { label: "Stok Habis", desc: "Alert saat stok produk di bawah minimum" },
              { label: "Pembayaran Baru", desc: "Konfirmasi setiap transaksi masuk" },
              { label: "Laporan Mingguan", desc: "Ringkasan performa klinik setiap Senin" },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifState(s => s.map((v, idx) => idx === i ? !v : v))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${notifState[i] ? "bg-[#0d5a94]" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 shadow-sm transition-all ${notifState[i] ? "left-6" : "left-1"}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
