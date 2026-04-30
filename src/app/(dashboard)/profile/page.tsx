"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Shield, Camera, Bell, Lock, Stethoscope, Award, Save, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [form, setForm] = useState({
    fullName: "drg. Sarah Amelia, Sp.Ort",
    email: "sarah.amelia@dentalcloud.id",
    phone: "081234567890",
    address: "Jl. Sudirman No. 88, Jakarta Selatan",
    specialization: "Ortodonsi",
    licenseNumber: "SIP-001/2024",
    bio: "Dokter gigi spesialis ortodonsi dengan pengalaman lebih dari 10 tahun. Berfokus pada perawatan maloklusi kompleks dan estetika senyum.",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
  };

  const tabs = [
    { id: "profile" as const, label: "Profil", icon: User },
    { id: "security" as const, label: "Keamanan", icon: Shield },
    { id: "notifications" as const, label: "Notifikasi", icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-4xl mx-auto">
      {/* ── Header Banner ── */}
      <div className="relative h-40 rounded-2xl overflow-hidden bg-gradient-to-r from-[#0D5A94] via-[#1a6eaa] to-[#004271] shadow-xl shadow-blue-900/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-12 w-32 h-32 rounded-full bg-white/20 blur-2xl"></div>
          <div className="absolute bottom-0 left-20 w-48 h-24 rounded-full bg-[#76f9d6]/30 blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
      </div>

      {/* ── Profile Card ── */}
      <div className="relative -mt-16 px-6 flex flex-col sm:flex-row items-start sm:items-end gap-5">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-white shadow-xl shadow-slate-200/60">
            <AvatarFallback className="bg-[#0d5a94] text-white text-2xl font-black">SA</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0d5a94] flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#004271] transition-colors">
            <Camera className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
        <div className="flex-1 pb-1">
          <h2 className="text-2xl font-black text-slate-900">{form.fullName}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Stethoscope className="h-3.5 w-3.5 text-[#0d5a94]" /> {form.specialization}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Award className="h-3.5 w-3.5 text-amber-500" /> {form.licenseNumber}
            </span>
          </div>
        </div>
        <div className="sm:pb-1">
          <span className="px-3 py-1.5 bg-[#76f9d6]/20 text-[#006b57] text-xs font-bold rounded-full border border-[#76f9d6]/40">
            Administrator
          </span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
              activeTab === id
                ? "bg-white text-[#0d5a94] shadow-md shadow-slate-200/60"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="border-0 shadow-lg shadow-slate-200/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-bold text-slate-900 text-lg border-b border-slate-50 pb-4">Informasi Pribadi</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                        className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm shadow-slate-100/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Spesialisasi</label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input
                        type="text"
                        value={form.specialization}
                        onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
                        className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm shadow-slate-100/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm shadow-slate-100/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">No. Telepon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm shadow-slate-100/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">No. SIP</label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input
                        type="text"
                        value={form.licenseNumber}
                        onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))}
                        className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm shadow-slate-100/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                    <input
                      type="text"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm shadow-slate-100/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
                  <textarea
                    value={form.bio}
                    rows={3}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all resize-none shadow-sm shadow-slate-100/50"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#0d5a94] hover:bg-[#004271] text-white font-bold px-8 gap-2 shadow-md shadow-blue-900/20"
                  >
                    {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="h-4 w-4" /> Simpan Perubahan</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side info cards */}
          <div className="space-y-5">
            <Card className="border-0 shadow-lg shadow-slate-200/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-4">Statistik Aktivitas</h3>
                <div className="space-y-4">
                  {[
                    { label: "Pasien Ditangani", value: "248", color: "text-[#0d5a94]" },
                    { label: "Janji Temu Bulan Ini", value: "32", color: "text-[#006b57]" },
                    { label: "Rekam Medis Diupdate", value: "19", color: "text-purple-600" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <span className="text-sm text-slate-500">{stat.label}</span>
                      <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-slate-200/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-4">Jadwal Hari Ini</h3>
                <div className="space-y-3">
                  {[
                    { time: "08:00", name: "Budi Santoso", type: "Scaling" },
                    { time: "10:00", name: "Siti Rahayu", type: "Behel" },
                    { time: "13:00", name: "Ahmad Fauzi", type: "Konsultasi" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-[#0d5a94] bg-blue-50 px-2 py-1 rounded-lg whitespace-nowrap">{s.time}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{s.name}</p>
                        <p className="text-[11px] text-slate-400">{s.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <Card className="border-0 shadow-lg shadow-slate-200/50 max-w-xl">
          <CardContent className="p-6 space-y-5">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-50 pb-4">Ubah Password</h3>
            {[
              { label: "Password Saat Ini", id: "currentPass" },
              { label: "Password Baru", id: "newPass" },
              { label: "Konfirmasi Password Baru", id: "confirmPass" },
            ].map(field => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 h-11 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5a94]/20 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            ))}
            <Button className="bg-[#0d5a94] hover:bg-[#004271] text-white font-bold gap-2 shadow-md shadow-blue-900/20">
              <Shield className="h-4 w-4" /> Update Password
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card className="border-0 shadow-lg shadow-slate-200/50 max-w-xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-50 pb-4">Preferensi Notifikasi</h3>
            {[
              { label: "Pengingat Janji Temu", desc: "Notifikasi 1 jam sebelum jadwal", defaultOn: true },
              { label: "Stok Habis", desc: "Alert saat stok produk di bawah minimum", defaultOn: true },
              { label: "Pembayaran Baru", desc: "Konfirmasi setiap transaksi masuk", defaultOn: false },
              { label: "Laporan Mingguan", desc: "Ringkasan performa klinik setiap Senin", defaultOn: true },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${item.defaultOn ? "bg-[#0d5a94]" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${item.defaultOn ? "left-6" : "left-1"}`}></span>
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
